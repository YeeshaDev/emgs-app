import api from "@/lib/store/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/lib/store/auth-store"

// Types
export interface Course {
  _id: string
  title: string
  description: string
  category: string
  thumbnail: string
  lessons: string[]
  quizzes: string[]
  assignments: string[]
  enrolledUsers: string[]
  isFree: boolean
  price: number
  isPublished: boolean
  createdBy: string
  averageRating: number
  ratings: any[]
  createdAt: string
  updatedAt: string
  goals?: string[]
  notes?: string[]
  benefits?: string[]
  completedCreationSections?: string[]
  resources?: string[]
}

export interface CreateCourseRequest {
  title: string
  description: string
  category: string
  thumbnail: string
  isFree: boolean
  price: number
  isPublished: boolean
  benefits?: string[]
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  courseId: string
}

export interface Lesson {
  _id: string
  title: string
  description: string
  courseId: string
  videoUrl?: string
  audioUrl?: string
  isPublished: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateLessonRequest {
  title: string
  description: string
  courseId: string
  videoUrl?: string
  audioUrl?: string
  isPublished: boolean
  order: number
}

export interface QuizOption {
  option: string | boolean
  isCorrect: boolean
}

export interface QuizQuestion {
  question: string
  questionType: "singleChoice" | "multipleChoice" | "boolean" | "fillInBlank"
  options?: QuizOption[]
  booleanAnswer?: boolean
  correctAnswer?: string
}

export interface CreateQuizRequest {
  title: string
  description: string
  courseId: string
  questions: QuizQuestion[]
}

export interface TutorOverview {
  totalStudents: number
  studentStats: {
    active: number
    inactive: number
  }
  totalCourses: number
  publishedCourses: number
  draftCourses: number
}

export interface CourseProgress {
  inProgress: {
    count: number
    percentage: number
  }
  dropped: {
    count: number
    percentage: number
  }
  completed: {
    count: number
    percentage: number
  }
}

// API functions
export const fetchTutorCourses = async (): Promise<Course[]> => {
  const { user } = useAuthStore.getState()
  if (!user) throw new Error("User not authenticated")

  const response = await api.get(`/tutors/${user.id}/courses`)
  return response.data.data
}

export const fetchTutorOverview = async (): Promise<TutorOverview> => {
  const { user } = useAuthStore.getState()
  if (!user) throw new Error("User not authenticated")

  const response = await api.get(`/tutors/${user.id}/overview`)
  return response.data.data
}

export const fetchTutorTopCourses = async (): Promise<Course[]> => {
  const { user } = useAuthStore.getState()
  if (!user) throw new Error("User not authenticated")

  const response = await api.get(`/tutors/${user.id}/top-courses`)
  return response.data.data
}

export const fetchTutorCourseProgress = async (): Promise<CourseProgress> => {
  const { user } = useAuthStore.getState()
  if (!user) throw new Error("User not authenticated")

  const response = await api.get(`/tutors/${user.id}/course-progress`)
  return response.data.data
}

export const fetchCourseById = async (courseId: string): Promise<Course> => {
  const response = await api.get(`/courses/${courseId}`)
  return response.data.data
}

export const createCourse = async (courseData: CreateCourseRequest): Promise<Course> => {
  const response = await api.post("/courses", courseData)
  return response.data.data.course
}

export const updateCourse = async ({ courseId, ...courseData }: UpdateCourseRequest): Promise<Course> => {
  const response = await api.put(`/courses/${courseId}`, courseData)
  return response.data.data.course
}

export const createLesson = async (lessonData: CreateLessonRequest): Promise<Lesson> => {
  const response = await api.post("/lessons", lessonData)
  return response.data.data
}

export const createQuiz = async (quizData: CreateQuizRequest): Promise<any> => {
  const response = await api.post("/quizzes", quizData)
  return response.data.data
}

export const fetchCourseLessons = async (courseId: string): Promise<Lesson[]> => {
  const response = await api.get(`/lessons/course/${courseId}`)
  return response.data.data
}

export const fetchCourseQuizzes = async (courseId: string): Promise<any[]> => {
  const response = await api.get(`/quizzes/course/${courseId}`)
  return response.data.data
}

// Custom hooks
export const useTutorCourses = () => {
  return useQuery({
    queryKey: ["tutorCourses"],
    queryFn: fetchTutorCourses,
  })
}

export const useTutorOverview = () => {
  return useQuery({
    queryKey: ["tutorOverview"],
    queryFn: fetchTutorOverview,
  })
}

export const useTutorTopCourses = () => {
  return useQuery({
    queryKey: ["tutorTopCourses"],
    queryFn: fetchTutorTopCourses,
  })
}

export const useTutorCourseProgress = () => {
  return useQuery({
    queryKey: ["tutorCourseProgress"],
    queryFn: fetchTutorCourseProgress,
  })
}

export const useCourseById = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourseById(courseId),
    enabled: !!courseId,
  })
}

export const useCreateCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutorCourses"] })
      queryClient.invalidateQueries({ queryKey: ["tutorOverview"] })
    },
  })
}

export const useUpdateCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tutorCourses"] })
      queryClient.invalidateQueries({ queryKey: ["course", data._id] })
      queryClient.invalidateQueries({ queryKey: ["tutorOverview"] })
    },
  })
}

export const useCreateLesson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLesson,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course", data.courseId] })
      queryClient.invalidateQueries({ queryKey: ["lessons", data.courseId] })
      queryClient.invalidateQueries({ queryKey: ["tutorOverview"] })
    },
  })
}

export const useCreateQuiz = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createQuiz,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course", data.courseId] })
      queryClient.invalidateQueries({ queryKey: ["quizzes", data.courseId] })
      queryClient.invalidateQueries({ queryKey: ["tutorOverview"] })
    },
  })
}

export const useCourseLessons = (courseId: string) => {
  return useQuery({
    queryKey: ["lessons", courseId],
    queryFn: () => fetchCourseLessons(courseId),
    enabled: !!courseId,
  })
}

export const useCourseQuizzes = (courseId: string) => {
  return useQuery({
    queryKey: ["quizzes", courseId],
    queryFn: () => fetchCourseQuizzes(courseId),
    enabled: !!courseId,
  })
}
