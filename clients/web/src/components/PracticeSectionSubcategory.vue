<template>
  <tsp-transition name="v-fade-transition" mode="out-in">
    <div :key="subcategory.id" class="section-subcategory">
      <div class="container-header">
        <practice-section-header
          class="section-header ml-md-4"
          :section="section.content.name"
          :subcategory="subcategory.content.name"
        />
        <button
          class="btn-previous-answers"
          v-if="$vuetify.breakpoint.xs && hasPreviousAnswers"
          @click="showPreviousAnswers = !showPreviousAnswers"
        >
          <span v-if="showPreviousAnswers">
            <v-icon color="primary" class="translate-icon" small
              >mdi-chevron-double-left</v-icon
            >
            <span class="ml-1">Hide Previous Answers</span>
          </span>
          <span v-else>
            <span>Show Previous Answers</span>
            <v-icon color="primary" class="translate-icon ml-1" small
              >mdi-chevron-double-right</v-icon
            >
          </span>
        </button>
      </div>
      <table
        :class="[
          hasPreviousAnswers ? 'with-previous' : 'no-previous',
          $vuetify.breakpoint.xs && showPreviousAnswers ? 'offset' : 'origin',
          'mt-6 mt-sm-4 mx-n4 mt-md-8 mx-xl-0 mb-xl-4',
        ]"
      >
        <thead>
          <tr>
            <th class="pl-4 pl-md-8">Best Practices</th>
            <th
              :class="[
                hasPreviousAnswers ? '' : 'px-3 px-md-4',
                'answers-column',
              ]"
            >
              <span v-if="hasPreviousAnswers">
                Answers
                <br />
                <v-btn
                  data-cy="btn-use-previous"
                  small
                  text
                  color="primary"
                  exact
                  @click="showAnswersDialog = true"
                >
                  <v-icon small>mdi-recycle-variant</v-icon>
                  <span class="ml-1">Use Previous Answers</span>
                </v-btn>
              </span>
              <span v-else>Answers</span>
            </th>
            <th
              v-if="hasPreviousAnswers"
              data-cy="previous-answers-column"
              class="px-3 px-md-4"
            >
              Previous Answers
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="question in subcategory.questions" :key="question.id">
            <practice-section-subcategory-row
              :section="section"
              :subcategory="subcategory"
              :question="question"
              :answers="answers"
              :previousAnswers="previousAnswers"
              :hasPreviousAnswers="hasPreviousAnswers"
            />
          </tr>
        </tbody>
      </table>
      <dialog-action
        title="Use Previous Answers"
        actionText="Yes, replace current answers"
        :isOpen="showAnswersDialog"
        @action="usePreviousAnswers"
        @cancel="showAnswersDialog = false"
      >
        <p>
          Would you like to replace the current answers for this specific
          section of the questionnaire with the most recent answers from past
          assessments that appear in the "Previous Answers" column?
        </p>
        <p>
          If you wish to proceed, any answers in this section will be overriden.
          This action cannot be undone.
        </p>
      </dialog-action>
    </div>
  </tsp-transition>
</template>

<script>
import DialogAction from '@/components/DialogAction'
import PracticeSectionHeader from '@/components/PracticeSectionHeader'
import PracticeSectionSubcategoryRow from '@/components/PracticeSectionSubcategoryRow'
import TspTransition from '@/components/TspTransition'

export default {
  name: 'PracticeSectionSubcategory',

  props: ['section', 'subcategory', 'answers', 'previousAnswers'],

  data() {
    return {
      showAnswersDialog: false,
      showPreviousAnswers: false,
    }
  },

  methods: {
    usePreviousAnswers() {
      this.$emit(
        'usePreviousAnswers',
        this.subcategory.questions,
        function () {
          this.showAnswersDialog = false
        }.bind(this)
      )
    },
  },

  computed: {
    hasPreviousAnswers() {
      return this.subcategory.questions.some((question) =>
        this.previousAnswers.find((a) => a.question === question.id)
      )
    },
  },

  components: {
    DialogAction,
    PracticeSectionHeader,
    PracticeSectionSubcategoryRow,
    TspTransition,
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.section-subcategory {
  overflow: hidden;

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    overflow: visible;
  }

  .container-header {
    display: flex;
    align-items: flex-end;

    .section-header {
      flex: 1;
    }

    .btn-previous-answers {
      display: block;
      color: $primary-color;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.0892857143em;
      text-transform: uppercase;
      width: 35%;
      max-width: 120px;
      text-align: right;

      &:focus,
      &:active {
        outline: 0 none;
      }
    }
  }

  .translate-icon {
    vertical-align: -2px;
  }
  & ::v-deep table {
    border-collapse: collapse;
    transition: transform 0.3s ease-out;

    &.with-previous {
      width: 144vw;
    }

    &.no-previous {
      width: calc(100% + 16px);
    }

    &.origin {
      transform: translateX(0);
    }

    &.offset {
      transform: translateX(calc(-48vw + 16px));
    }

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      &.with-previous,
      &.no-previous {
        width: calc(100% + 32px);
      }
    }

    th {
      width: 48vw;

      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        width: 27%;
      }

      &:first-child {
        text-align: left;

        @media #{map-get($display-breakpoints, 'sm-and-up')} {
          width: 46%;
        }
      }
    }
    tr:nth-child(even) {
      background-color: $background-row-alternate;
    }
  }

  @media #{map-get($display-breakpoints, 'xl-only')} {
    width: 70%;

    & ::v-deep table {
      width: 100%;
    }
  }
}
</style>
