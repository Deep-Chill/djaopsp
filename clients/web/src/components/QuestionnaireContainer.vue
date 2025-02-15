<template v-if="currentQuestion">
  <div class="questionnaire-container mx-md-4">
    <span class="question-text question-index grey--text">
      Question #{{ currentQuestionIdx + 1 }}
    </span>
    <practice-section-header
      :section="currentQuestion.section.name"
      :subcategory="currentQuestion.subcategory.name"
    />
    <p class="question-text mt-3 mt-md-6">{{ currentQuestion.text }}</p>
    <span
      class="d-block mb-4"
      :style="{ fontSize: '0.9rem' }"
      v-if="currentQuestion.optional"
    >
      <sup>*</sup>This answer will not affect your score
    </span>

    <component
      :is="questionForm.componentName"
      :model="questionForm"
      :question="currentQuestion"
      :answer="currentAnswer"
      :previousAnswer="previousAnswer"
      :key="currentQuestion.id"
      @submit="saveAndContinue"
    />
  </div>
</template>

<script>
import { MAP_METRICS_TO_QUESTION_FORMS } from '@/config/questionFormTypes'
import Answer from '@/common/models/Answer'
import FormQuestionBinary from '@/components/FormQuestionBinary'
import FormQuestionNumber from '@/components/FormQuestionNumber'
import FormQuestionRadio from '@/components/FormQuestionRadio'
import FormQuestionRelevantQuantity from '@/components/FormQuestionRelevantQuantity'
import FormQuestionTextarea from '@/components/FormQuestionTextarea'
import FormQuestionQuantity from '@/components/FormQuestionQuantity'
import PracticeSectionHeader from '@/components/PracticeSectionHeader'

export default {
  name: 'QuestionnaireContainer',

  props: ['questionId', 'questions', 'answers', 'previousAnswers'],

  computed: {
    currentQuestionIdx() {
      return this.questions.findIndex((q) => q.id === this.questionId)
    },
    currentQuestion() {
      return this.questions[this.currentQuestionIdx]
    },
    currentAnswer() {
      return this.answers.find((a) => a.question === this.questionId)
    },
    previousAnswer() {
      return this.previousAnswers.find((a) => a.question === this.questionId)
    },
    nextQuestion() {
      if (this.questions.length <= 1) return null
      const nextQuestionIndex =
        (this.currentQuestionIdx + 1) % this.questions.length
      return this.questions[nextQuestionIndex].id
    },
    questionForm() {
      return MAP_METRICS_TO_QUESTION_FORMS[this.currentQuestion.type]
    },
  },

  methods: {
    saveAndContinue(answer) {
      const callback = this.nextQuestion
        ? function () {
            const queryParams = {
              ...this.$route.query,
              ...{ question: this.nextQuestion },
            }
            this.$router.push({
              path: this.$route.path,
              hash: this.$route.hash,
              query: queryParams,
            })
          }.bind(this)
        : function () {
            // There's no next question; reload the current path without query params
            this.$router.push({
              path: this.$route.path,
              hash: this.$route.hash,
            })
          }.bind(this)

      this.$emit('saveAnswer', answer, callback)
    },
  },

  components: {
    FormQuestionBinary,
    FormQuestionNumber,
    FormQuestionQuantity,
    FormQuestionRelevantQuantity,
    FormQuestionRadio,
    FormQuestionTextarea,
    PracticeSectionHeader,
  },
}
</script>

<style lang="scss" scoped>
.questionnaire-container {
  position: relative;
}
.question-index {
  font-weight: 400;
  position: absolute;
  top: -33px;
  right: 6px;
}
@media #{map-get($display-breakpoints, 'sm-and-up')} {
  .question-index {
    top: -78px;
  }
}
@media #{map-get($display-breakpoints, 'md-and-up')} {
  .question-index {
    top: -110px;
  }
  .question-text {
    font-size: 1.1rem;
    line-height: 1.6;
  }
}
</style>
