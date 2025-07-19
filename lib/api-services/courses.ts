import api from "@/lib/store/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Types
export interface Course {
  _id: string
  title: string
  description: string
  thumbnail?: string
  category: string
  lessons: number
  duration: string
  price:string
  instructor: {
    id: string
    name: string
    avatar: string
    rating: number
  }
  isBookmarked?: boolean
  enrolledStudentsCount?: number;
  progress?: number;
  isCompleted:boolean;
  isEnrolled:boolean;
  isFree:boolean;
  benefits?: string[];
  goals?:string[];
  notes?: string[];
  ratings?: CourseRating[];
  quizzes:any;
  averageRating?: number;
  totalRatings: number;
  lessonCount: number;
  createdBy:{fullName:string; profilePicture:string}
}

export interface CourseRating {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment?: string
  createdAt: string
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  content?: string
  duration: string
  order: number
  videoUrl?: string
  audioUrl?: string
  resources?: {
    id: string
    name: string
    url: string
    type: string
  }[]
}

// API functions
export const fetchCourses = async (): Promise<Course[]> => {
  const response = await api.get("/courses")
  return response.data.results
}

export const fetchCourse = async (courseId: string): Promise<Course> => {
  const response = await api.get(`/courses/${courseId}`)
  return response.data.data
}

export const toggleBookmark = async (courseId: string): Promise<{
  message: string, isBookmarked: boolean 
}> => {
  const response = await api.post(`/courses/${courseId}/bookmark`)
  return response.data
}

export const fetchBookmarkedCourses = async (): Promise<Course[]> => {
  const response = await api.get("/courses/user/bookmarked")
  return response.data.data
}

export const fetchCourseLessons = async (courseId: string): Promise<Lesson[]> => {
  const response = await api.get(`/lessons/course/${courseId}`)
  return response.data.data
}

export const fetchLesson = async (lessonId: string): Promise<Lesson> => {
  const response = await api.get(`/lessons/lesson/${lessonId}`)
  return response.data.data
}

export const fetchCourseRatings = async (courseId: string): Promise<CourseRating[]> => {
  const response = await api.get(`/courses/${courseId}/ratings`)
  return response.data.results
}

export const rateCourse = async ({
  courseId,
  rating,
  comment,
}: {
  courseId: string
  rating: number
  comment?: string
}): Promise<CourseRating> => {
  const response = await api.post(`/courses/${courseId}/ratings`, { rating, comment })
  return response.data.data
}

// Custom courses hooks
export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  })
}

export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourse(courseId),
    enabled: !!courseId,
  })
}

export const useToggleBookmark = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: toggleBookmark,
    onSuccess: (data, courseId) => {
      // Update the course in the cache
      queryClient.setQueryData<Course>(["course", courseId], (oldData) => {
        if (!oldData) return oldData
        return { ...oldData, isBookmarked: data.isBookmarked }
      })
      
      // Update the course in the courses list
      queryClient.setQueryData<Course[]>(["courses"], (oldData) => {
        if (!oldData) return oldData
        return oldData.map(course => 
          course._id === courseId 
            ? { ...course, isBookmarked: data.isBookmarked } 
            : course
        )
      })
      
      // Invalidate bookmarked courses query to refetch
      queryClient.invalidateQueries({ queryKey: ["bookmarkedCourses"] })
    },
  })
}

export const useBookmarkedCourses = () => {
  return useQuery({
    queryKey: ["bookmarkedCourses"],
    queryFn: fetchBookmarkedCourses,
  })
}

export const useCourseLessons = (courseId: string) => {
  return useQuery({
    queryKey: ["lessons", courseId],
    queryFn: () => fetchCourseLessons(courseId),
    enabled: !!courseId,
  })
}

export const useLesson = (lessonId: string) => {
  return useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => fetchLesson(lessonId),
    enabled: !!lessonId,
  })
}

export const useCourseRatings = (courseId: string) => {
  return useQuery({
    queryKey: ["ratings", courseId],
    queryFn: () => fetchCourseRatings(courseId),
    enabled: !!courseId,
  })
}

export const useRateCourse = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: rateCourse,
    onSuccess: (_, variables) => {
      // Invalidate ratings for this course
      queryClient.invalidateQueries({ queryKey: ["ratings", variables.courseId] })
      // Invalidate the course to update average rating
      queryClient.invalidateQueries({ queryKey: ["course", variables.courseId] })
    },
  })
}
