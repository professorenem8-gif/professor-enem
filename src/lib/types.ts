// Tipos e interfaces para o Professor ENEM

export interface Question {
  id: string
  subject: string
  area: 'Linguagens e Códigos' | 'Matemática' | 'Ciências Humanas' | 'Ciências da Natureza'
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  year?: number
  source?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
  lastLogin: Date
  preferences: {
    notifications: boolean
    dailyReminder: boolean
    preferredStudyTime: string
  }
}

export interface UserStats {
  userId: string
  totalQuestions: number
  correctAnswers: number
  averageTime: number
  streak: number
  maxStreak: number
  points: number
  level: number
  experience: number
  achievements: Achievement[]
  areaStats: {
    [key: string]: {
      total: number
      correct: number
      averageTime: number
    }
  }
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
  category: 'streak' | 'accuracy' | 'speed' | 'area' | 'special'
}

export interface SimulationResult {
  id: string
  userId: string
  area: string
  questions: Question[]
  userAnswers: number[]
  score: number
  percentage: number
  timeSpent: number
  startedAt: Date
  completedAt: Date
  isPaid: boolean
  paymentId?: string
  detailedResults?: {
    bySubject: { [key: string]: { correct: number; total: number } }
    recommendations: string[]
    strengths: string[]
    weaknesses: string[]
  }
}

export interface DailyChallenge {
  id: string
  date: string
  questions: Question[]
  timeLimit: number
  pointsReward: number
  completed: boolean
  completedBy: string[]
}

export interface Challenge {
  id: string
  name: string
  description: string
  type: 'speed' | 'marathon' | 'accuracy' | 'mixed'
  questions: Question[]
  timeLimit?: number
  pointsReward: number
  requirements?: {
    minLevel?: number
    completedChallenges?: string[]
  }
  isActive: boolean
  startDate: Date
  endDate: Date
}

export interface RankingEntry {
  userId: string
  userName: string
  avatar?: string
  points: number
  level: number
  position: number
  weeklyPoints?: number
  monthlyPoints?: number
}

export interface StudySession {
  id: string
  userId: string
  type: 'simulation' | 'challenge' | 'daily' | 'practice'
  area?: string
  questionsAnswered: number
  correctAnswers: number
  timeSpent: number
  pointsEarned: number
  startedAt: Date
  completedAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'achievement' | 'reminder' | 'challenge' | 'payment' | 'general'
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  actionUrl?: string
}

// Constantes do sistema
export const AREAS = [
  'Linguagens e Códigos',
  'Matemática', 
  'Ciências Humanas',
  'Ciências da Natureza'
] as const

export const SUBJECTS = {
  'Linguagens e Códigos': ['Português', 'Literatura', 'Inglês', 'Espanhol', 'Artes'],
  'Matemática': ['Álgebra', 'Geometria', 'Estatística', 'Probabilidade', 'Trigonometria'],
  'Ciências Humanas': ['História', 'Geografia', 'Filosofia', 'Sociologia'],
  'Ciências da Natureza': ['Física', 'Química', 'Biologia']
}

export const DIFFICULTY_POINTS = {
  easy: 10,
  medium: 20,
  hard: 30
}

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700,
  3250, 3850, 4500, 5200, 5950, 6750, 7600, 8500, 9450, 10450
]

// Funções utilitárias
export function calculateLevel(experience: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (experience >= LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

export function getExperienceForNextLevel(currentLevel: number): number {
  return LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
}

export function calculateAccuracy(correct: number, total: number): number {
  return total > 0 ? Math.round((correct / total) * 100) : 0
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function getPerformanceLevel(percentage: number): {
  level: string
  color: string
  message: string
} {
  if (percentage >= 90) {
    return {
      level: 'Excelente',
      color: 'text-green-600',
      message: 'Parabéns! Desempenho excepcional!'
    }
  } else if (percentage >= 80) {
    return {
      level: 'Muito Bom',
      color: 'text-blue-600',
      message: 'Ótimo trabalho! Continue assim!'
    }
  } else if (percentage >= 70) {
    return {
      level: 'Bom',
      color: 'text-yellow-600',
      message: 'Bom desempenho! Há espaço para melhorar.'
    }
  } else if (percentage >= 60) {
    return {
      level: 'Regular',
      color: 'text-orange-600',
      message: 'Precisa estudar mais. Você consegue!'
    }
  } else {
    return {
      level: 'Precisa Melhorar',
      color: 'text-red-600',
      message: 'Foque nos estudos. Não desista!'
    }
  }
}

// Mensagens motivacionais
export const MOTIVATIONAL_MESSAGES = [
  "Cada questão te aproxima da sua aprovação!",
  "O sucesso é a soma de pequenos esforços repetidos diariamente.",
  "Você está mais perto do que imagina!",
  "A persistência é o caminho do êxito.",
  "Acredite em você! Você é capaz de conquistar seus sonhos!",
  "Cada erro é uma oportunidade de aprender.",
  "O ENEM é apenas uma etapa. Você vai conseguir!",
  "Foco, força e fé! Sua aprovação está chegando!",
  "Estudar hoje é investir no seu futuro.",
  "Você não está sozinho nessa jornada!"
]

export function getRandomMotivationalMessage(): string {
  return MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
}