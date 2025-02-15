import groupBy from 'lodash/groupBy'
import kebabCase from 'lodash/kebabCase'

import { APIError, request } from './base'
import Answer from '@/common/models/Answer'
import Assessment from '@/common/models/Assessment'
import Question from '@/common/models/Question'
import Section from '@/common/models/Section'
import Subcategory from '@/common/models/Subcategory'
import { VALID_METRICS } from '@/config/questionFormTypes'

async function createAssessment(organization, payload) {
  const response = await request(`/${organization.id}/sample/`, {
    body: payload,
  })
  if (!response.ok) throw new APIError(response.status)
  const { slug, created_at } = await response.json()
  return new Assessment({ slug: slug, created: created_at })
}

async function getAssessmentDetails(organization, assessment) {
  try {
    const { slug, created, frozen, industryName, industryPath } = assessment
    const {
      answers,
      questions,
      targetAnswers,
      targetQuestions,
    } = await getCurrentPracticesContent(organization.id, slug, industryPath)
    return new Assessment({
      slug,
      created,
      frozen,
      industry: {
        title: industryName,
        path: industryPath,
      },
      answers,
      questions,
      targetAnswers,
      targetQuestions,
    })
  } catch (e) {
    throw new APIError(e)
  }
}

async function getCurrentPracticesContent(
  organizationId,
  assessmentSlug,
  industryPath
) {
  try {
    const responses = await Promise.all([
      request(`/content${industryPath}`),
      request(
        `/${organizationId}/sample/${assessmentSlug}/answers${industryPath}`
      ),
    ])
    const error = responses.find((response) => !response.ok)
    if (error) {
      throw new APIError(
        `Failed to load practices content for assessment: ${error.statusText}`
      )
    }
    const [
      { results: questionList },
      { results: answerList },
    ] = await Promise.all(responses.map((response) => response.json()))

    const questions = getQuestionInstances(questionList)
    const targetQuestions = getTargetQuestionInstances(questionList)
    const answersByPath = getFlatAnswersByPath(answerList)
    const answers = getAnswerInstances(answersByPath, questions)
    const targetAnswers = getAnswerInstances(answersByPath, targetQuestions)

    // Complete questions with type and required fields
    questions.forEach((question) => {
      const answer = answersByPath[question.path][0]
      question.type = answer.default_metric
      question.optional = !answer.required
    })
    targetQuestions.forEach((targetQuestion) => {
      const answer = answersByPath[targetQuestion.path][0]
      targetQuestion.type = answer.default_metric
      targetQuestion.optional = !answer.required
    })

    return {
      answers,
      questions,
      targetAnswers,
      targetQuestions,
    }
  } catch (e) {
    throw new APIError(e)
  }
}

async function getIndustrySegments() {
  const response = await request('/content?q=public')
  if (!response.ok) throw new APIError(response.status)
  const { results } = await response.json()
  return results
}

function getFlatAnswersByPath(answerList) {
  const flatAnswers = answerList
    .filter(({ metric }) => metric === null || VALID_METRICS.includes(metric))
    .map(({ question, ...attrs }) => ({
      ...attrs,
      ...question,
    }))
  return groupBy(flatAnswers, 'path')
}

function getAnswerInstances(answersByPath, questions) {
  const answers = []
  const items = questions.map((question) => ({
    qid: question.id,
    answerObjects: answersByPath[question.path],
  }))
  items.forEach(({ qid, answerObjects }) => {
    if (answerObjects) {
      const answer = new Answer({ question: qid })
      answer.load(answerObjects)
      answers.push(answer)
    }
  })
  return answers
}

function getQuestionInstances(contentList) {
  const questions = []
  const len = contentList.length
  let section, subcategory

  for (let i = 1; i < len; i++) {
    const node = contentList[i]
    if (node.indent === 1) {
      section = new Section({
        id: kebabCase(node.title),
        name: node.title,
        iconPath: node.picture,
      })
      subcategory = null
    } else if (node.tags && node.tags.includes('pagebreak')) {
      // TODO: Pagebreak nodes will need to be processed differently
      continue
    } else if (node.path && !node.path.includes('/targets/')) {
      // Do not include target questions; they will be processed separately
      const question = new Question({
        id: kebabCase(node.path),
        path: node.path,
        section,
        subcategory: !subcategory ? section : subcategory,
        text: node.title,
      })
      questions.push(question)
    } else {
      // Override subcategory.
      // In the end, what matters is the parent of the question
      subcategory = new Subcategory({
        id: `${kebabCase(section.name)}-${kebabCase(node.title)}`,
        name: node.title,
      })
    }
  }
  return questions
}

function getTargetQuestionInstances(contentList) {
  const targetQuestions = []
  contentList.forEach((node) => {
    if (node.path && node.path.includes('/targets/')) {
      const targetQuestion = new Question({
        id: kebabCase(node.path),
        path: node.path,
        text: node.title,
      })
      targetQuestions.push(targetQuestion)
    }
  })
  return targetQuestions
}

async function postTarget(organizationId, assessment, answer) {
  const question = assessment.targetQuestions.find(
    (q) => q.id === answer.question
  )
  const response = await request(
    `/${organizationId}/sample/${assessment.id}/answers${question.path}`,
    {
      body: answer.toPayload(),
    }
  )
  if (!response.ok) throw new APIError(response.status)
  return answer
}

async function postAnswer(organizationId, assessment, answer) {
  const question = assessment.questions.find((q) => q.id === answer.question)
  const response = await request(
    `/${organizationId}/sample/${assessment.id}/answers${question.path}`,
    {
      body: answer.toPayload(),
    }
  )
  if (!response.ok) throw new APIError(response.status)
  return answer
}

async function setAssessmentIndustry(organization, assessment, industry) {
  const { slug, created, frozen } = assessment
  const {
    answers,
    questions,
    targetAnswers,
    targetQuestions,
  } = await getCurrentPracticesContent(organization.id, slug, industry.path)
  return new Assessment({
    slug,
    created,
    frozen,
    industry,
    answers,
    questions,
    targetAnswers,
    targetQuestions,
  })
}

export default {
  createAssessment,
  getAssessmentDetails,
  getIndustrySegments,
  postAnswer,
  postTarget,
  setAssessmentIndustry,
}
