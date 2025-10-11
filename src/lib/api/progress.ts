import axios from "axios";
import getIdToken from "@/firebase/getIdToken";

// Create axios instance with auth token
const createAxiosInstance = async () => {
  const token = await getIdToken();
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export interface UserProgress {
  currentLevel: number;
  totalBalance: number;
  progress: Record<
    number,
    {
      tasksCompleted: number[];
      quizAnswers: Record<number, number>;
      quizScore: number;
      totalQuestions: number;
      isCompleted: boolean;
      completedAt?: string;
    }
  >;
  badges: Array<{
    levelId: number;
    badgeName: string;
    earnedAt: string;
  }>;
}

export interface LevelProgressUpdate {
  tasksCompleted?: number[];
  quizAnswers?: Record<number, number>;
  quizScore?: number;
  totalQuestions?: number;
}

export interface LevelCompletion {
  newLevel: number;
  newBalance: number;
  badgeEarned: string;
  moneyAwarded: number;
}

// Fetch all user progress
export const fetchUserProgress = async (): Promise<UserProgress> => {
  try {
    const axiosInstance = await createAxiosInstance();
    const response = await axiosInstance.get("/api/progress");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    throw new Error("Failed to fetch user progress");
  }
};

// Update level progress (tasks or quiz)
export const updateLevelProgress = async (
  levelId: number,
  progress: LevelProgressUpdate,
): Promise<void> => {
  try {
    const axiosInstance = await createAxiosInstance();
    await axiosInstance.put(`/api/progress/level/${levelId}`, progress);
  } catch (error) {
    console.error("Error updating level progress:", error);
    throw new Error("Failed to update level progress");
  }
};

// Submit quiz answers
export const submitQuiz = async (
  levelId: number,
  answers: Record<number, number>,
  score: number,
  totalQuestions: number,
): Promise<void> => {
  try {
    const axiosInstance = await createAxiosInstance();
    await axiosInstance.put(`/api/progress/level/${levelId}`, {
      quizAnswers: answers,
      quizScore: score,
      totalQuestions: totalQuestions,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    throw new Error("Failed to submit quiz");
  }
};

// Complete level (award money, badge, unlock next)
export const completeLevel = async (
  levelId: number,
  rewardMoney: number,
  badgeName: string,
): Promise<LevelCompletion> => {
  try {
    const axiosInstance = await createAxiosInstance();
    const response = await axiosInstance.post(
      `/api/progress/level/${levelId}/complete`,
      {
        rewardMoney,
        badgeName,
      },
    );
    return response.data.data;
  } catch (error) {
    console.error("Error completing level:", error);
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to complete level");
  }
};

// Reset level progress (for failed quiz attempts)
export const resetQuiz = async (levelId: number): Promise<void> => {
  try {
    const axiosInstance = await createAxiosInstance();
    await axiosInstance.put(`/api/progress/level/${levelId}/reset`);
  } catch (error) {
    console.error("Error resetting quiz:", error);
    throw new Error("Failed to reset quiz");
  }
};

// Update user tasks
export const updateLevelTasks = async (
  levelId: number,
  taskIds: number[],
): Promise<void> => {
  try {
    const axiosInstance = await createAxiosInstance();
    await axiosInstance.put(`/api/progress/level/${levelId}`, {
      tasksCompleted: taskIds,
    });
  } catch (error) {
    console.error("Error updating level tasks:", error);
    throw new Error("Failed to update level tasks");
  }
};
