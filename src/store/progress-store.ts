import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LevelProgress {
  tasksCompleted: number[];
  quizAnswers: Record<number, number>;
  quizScore: number;
  totalQuestions: number;
  isCompleted: boolean;
  completedAt?: string;
}

interface Badge {
  levelId: number;
  badgeName: string;
  earnedAt: string;
}

interface ProgressState {
  currentLevel: number;
  totalBalance: number;
  levels: Record<number, LevelProgress>;
  badges: Badge[];
  isLoading: boolean;
  error: string | null;
}

interface ProgressActions {
  setProgress: (progress: Partial<ProgressState>) => void;
  updateLevelTasks: (levelId: number, taskIds: number[]) => void;
  submitQuiz: (
    levelId: number,
    answers: Record<number, number>,
    score: number,
    totalQuestions: number,
  ) => void;
  completeLevel: (levelId: number, newBalance: number, badge: Badge) => void;
  resetQuiz: (levelId: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type ProgressStore = ProgressState & ProgressActions;

const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentLevel: 1,
      totalBalance: 10000,
      levels: {},
      badges: [],
      isLoading: false,
      error: null,

      // Actions
      setProgress: (progress) => {
        set((state) => ({
          ...state,
          ...progress,
          error: null,
        }));
      },

      updateLevelTasks: (levelId, taskIds) => {
        set((state) => ({
          levels: {
            ...state.levels,
            [levelId]: {
              ...state.levels[levelId],
              tasksCompleted: taskIds,
            },
          },
        }));
      },

      submitQuiz: (levelId, answers, score, totalQuestions) => {
        set((state) => ({
          levels: {
            ...state.levels,
            [levelId]: {
              ...state.levels[levelId],
              quizAnswers: answers,
              quizScore: score,
              totalQuestions: totalQuestions,
            },
          },
        }));
      },

      completeLevel: (levelId, newBalance, badge) => {
        set((state) => ({
          currentLevel: Math.max(state.currentLevel, levelId + 1),
          totalBalance: newBalance,
          levels: {
            ...state.levels,
            [levelId]: {
              ...state.levels[levelId],
              isCompleted: true,
              completedAt: new Date().toISOString(),
            },
          },
          badges: [...state.badges.filter((b) => b.levelId !== levelId), badge],
        }));
      },

      resetQuiz: (levelId) => {
        set((state) => ({
          levels: {
            ...state.levels,
            [levelId]: {
              ...state.levels[levelId],
              quizAnswers: {},
              quizScore: 0,
              totalQuestions: 0,
              isCompleted: false,
              completedAt: undefined,
            },
          },
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "progress-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist essential data, not loading states
      partialize: (state) => ({
        currentLevel: state.currentLevel,
        totalBalance: state.totalBalance,
        levels: state.levels,
        badges: state.badges,
      }),
    },
  ),
);

export { useProgressStore };
export type { LevelProgress, Badge, ProgressState, ProgressActions };
