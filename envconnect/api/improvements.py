# Copyright (c) 2019, DjaoDjin inc.
# see LICENSE.

from django.db import transaction

from rest_framework import response as http
from rest_framework import serializers, status
from rest_framework.generics import (get_object_or_404, ListAPIView,
     GenericAPIView)
from rest_framework.mixins import (CreateModelMixin, RetrieveModelMixin,
    DestroyModelMixin, UpdateModelMixin)
from rest_framework.response import Response
from survey.models import Answer, EnumeratedQuestions, get_question_model

from ..helpers import freeze_scores
from ..mixins import ImprovementQuerySetMixin
from ..models import Consumption
from ..serializers import ImprovementSerializer


class ImprovementListAPIView(ImprovementQuerySetMixin,
                             UpdateModelMixin, ListAPIView):
    """
    Retrieve improvements

    **Tags**: survey

    **Examples**

    .. code-block:: http

         GET /api/xia/improvement/ HTTP/1.1

    responds

    .. code-block:: json

        {
            "created_at": "2020-01-01T00:00:00Z",
            "measured": 12
        }
    """
    serializer_class = ImprovementSerializer

    def get_serializer_context(self):
        """
        Provides a list of opportunities, one for each ``Question``.
        """
        context = super(ImprovementListAPIView, self).get_serializer_context()
# XXX This code does not seem to be used since ``with_opportunity`` changed
# prototype a while ago. ``_get_filter_out_testing`` also returns accounts
# instead of samples now.
#        context.update({'opportunities': Consumption.objects.with_opportunity(
#            filter_out_testing=self._get_filter_out_testing())})
        return context

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        #pylint:disable=unused-argument
        # We donot call super() because the up-to-date assessment should
        # never be frozen.
        with transaction.atomic():
            freeze_scores(self.improvement_sample,
                includes=self.get_included_samples(),
                excludes=self._get_filter_out_testing(),
                collected_by=self.request.user)
        return http.Response({})


class ImprovementAnswerAPIView(ImprovementQuerySetMixin,
                               CreateModelMixin, RetrieveModelMixin,
                               DestroyModelMixin, GenericAPIView):
    """
    Assessment:
    implementation rate, nb respondents
    "implemented by you?"
    opportunity score
    selected from improvement
    """
    serializer_class = ImprovementSerializer

    def get_object(self):
        return get_object_or_404(self.get_queryset(),
            question__path=self.kwargs.get('path'))

    @property
    def question(self):
        if not hasattr(self, '_question'):
            self._question = get_object_or_404(
                get_question_model().objects.all(),
                path=self.kwargs.get('path'))
        return self._question

    def get_serializer_context(self):
        context = super(ImprovementAnswerAPIView, self).get_serializer_context()
        context.update({'question': self.question})
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Implementation Note: We need to set the `measured` field
        # otherwise `get_scored_answers` will return a numerator
        # of zero. We use `NEEDS_SIGNIFICANT_IMPROVEMENT` such
        # as to be conservative in the calculation.
        measured = serializer.validated_data.get('measured',
            Consumption.NEEDS_SIGNIFICANT_IMPROVEMENT)
        with transaction.atomic():
            self.get_or_create_improve_sample()
            with transaction.atomic():
                rank = EnumeratedQuestions.objects.get(
                    campaign=self.improvement_sample.survey,
                    question=self.question).rank
                _, created = self.model.objects.update_or_create(
                    sample=self.improvement_sample,
                    question=self.question,
                    metric=self.question.default_metric,
                    defaults={'measured': measured, 'rank': rank})
        return Response({},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        # get_queryset() will filter by `account`. We filter by `path`
        # as in `get_object`. It should return a single result but
        # in case the db was corrupted, let's just fix it on the fly here.
        # XXX In the future the improvements must relate to a specific year.
        self.get_queryset().filter(
            question__path=self.kwargs.get('path')).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
