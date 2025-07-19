import api from "@/lib/store/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Types for API response
export interface ApiResponse<T> {
  status: boolean
  message: string
  detail: string
  metadata?: {
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
    nextPage: number | null
    prevPage: number | null
  }
  results?: T
  data?: T
}

// Types for quiz data
export type QuestionType = "singleChoice" | "multipleChoice" | "boolean" | "fillInBlank"

export interface QuizOption {
  _id: string
  option: string
}

export interface QuizQuestion {
  _id: string
  question: string
  questionType: QuestionType
  options: QuizOption[]
  booleanAnswer?: boolean
  correctAnswer?: string
  order: number
}

export interface Quiz {
  _id: string
  title: string
  description: string
  courseId: string
  createdBy: {
    _id: string
    email: string
  }
  questions: QuizQuestion[]
  createdAt: string
  updatedAt: string
}

// Types for quiz submission
export interface QuizSubmissionAnswer {
  questionId: string
  questionType: QuestionType
  selectedOptionId?: string
  selectedOptionIds?: string[]
  answer?: boolean | string
}

export interface QuizSubmission {
  answers: QuizSubmissionAnswer[]
}

// Types for quiz result
export interface QuizAnswerResult {
  questionIndex: number
  questionType: QuestionType
  isCorrect: boolean
  questionId: string
  selectedOptionIndex?: number
  selectedOptionId?: string
  selectedOptionIndices?: number[]
  selectedOptionIds?: string[]
  correctOptionIndices?: number[]
  selectedAnswer?: boolean
  submittedAnswer?: string
  correctAnswer?: string
}

export interface QuizResult {
  quizTitle: string
  score: number
  correctAnswers: number
  totalQuestions: number
  attempts: number
  answers: QuizAnswerResult[]
}

// API functions
export const fetchQuizzesByCourse = async (courseId: string): Promise<Quiz[]> => {
  const response = await api.get<ApiResponse<Quiz[]>>(`/quizzes/course/${courseId}`)
  return response.data.results || []
}

export const submitQuiz = async ({
  quizId,
  submission,
}: { quizId: string; submission: QuizSubmission }): Promise<QuizResult> => {
  const response = await api.post<ApiResponse<QuizResult>>(`/quizzes/${quizId}/mark`, submission)
  return response.data.data as QuizResult
}

// Custom hooks
export const useQuizzesByCourse = (courseId: string) => {
  return useQuery({
    queryKey: ["quizzes", courseId],
    queryFn: () => fetchQuizzesByCourse(courseId),
    enabled: !!courseId,
  })
}

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitQuiz,
    onSuccess: (_, variables) => {
      // Invalidate quiz results
      queryClient.invalidateQueries({ queryKey: ["quizResults", variables.quizId] })
    },
  })
}

// Helper function to prepare submission answers based on question type
export const prepareQuizSubmission = (
  quiz: Quiz,
  answers: Record<number, string | string[] | boolean>,
): QuizSubmission => {
  const submissionAnswers: QuizSubmissionAnswer[] = []

  Object.entries(answers).forEach(([indexStr, answer]) => {
    const index = Number.parseInt(indexStr)
    const question = quiz.questions[index]

    if (!question) return

    const submissionAnswer: QuizSubmissionAnswer = {
      questionId: question._id,
      questionType: question.questionType,
    }

    switch (question.questionType) {
      case "singleChoice":
        // Find the option ID that matches the selected option text
        const selectedOption = question.options.find((opt) => opt.option === answer)
        if (selectedOption) {
          submissionAnswer.selectedOptionId = selectedOption._id
        }
        break

      case "multipleChoice":
        // Find all option IDs that match the selected option texts
        const selectedOptions = question.options.filter((opt) => Array.isArray(answer) && answer.includes(opt.option))
        submissionAnswer.selectedOptionIds = selectedOptions.map((opt) => opt._id)
        break

      case "boolean":
        submissionAnswer.answer = answer as boolean
        break

      case "fillInBlank":
        submissionAnswer.answer = answer as string
        break
    }

    submissionAnswers.push(submissionAnswer)
  })

  return { answers: submissionAnswers }
}

// Mock function to simulate quiz submission (for development)
export const mockSubmitQuizResult = (quizId: string, quiz: Quiz, submission: QuizSubmission): QuizResult => {
  // This is just a mock implementation for development
  // In production, you would use the real API

  const correctAnswers = Math.floor(Math.random() * (submission.answers.length + 1))
  const score = Math.floor((correctAnswers / submission.answers.length) * 100)

  const answers: QuizAnswerResult[] = submission.answers.map((answer, index) => {
    const isCorrect = index < correctAnswers

    const result: QuizAnswerResult = {
      questionIndex: index,
      questionType: answer.questionType,
      isCorrect,
      questionId: answer.questionId,
    }

    switch (answer.questionType) {
      case "singleChoice":
        result.selectedOptionId = answer.selectedOptionId
        result.selectedOptionIndex = 0
        break

      case "multipleChoice":
        result.selectedOptionIds = answer.selectedOptionIds
        result.selectedOptionIndices = [0, 1, 2]
        result.correctOptionIndices = [0, 1, 3]
        break

      case "boolean":
        result.selectedAnswer = answer.answer as boolean
        break

      case "fillInBlank":
        result.submittedAnswer = answer.answer as string
        result.correctAnswer = answer.answer as string
        break
    }

    return result
  })

  return {
    quizTitle: quiz.title,
    score,
    correctAnswers,
    totalQuestions: submission.answers.length,
    attempts: 1,
    answers,
  }
}
