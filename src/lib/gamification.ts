// Sistema de Gamificação - Professor ENEM
import { Achievement, UserStats } from './types'

// Definição das conquistas disponíveis
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_victory',
    name: 'Primeira Vitória',
    description: 'Complete seu primeiro simulado',
    icon: '🏆',
    category: 'special',
    unlockedAt: new Date()
  },
  {
    id: 'streak_5',
    name: 'Sequência de 5',
    description: 'Acerte 5 questões seguidas',
    icon: '🔥',
    category: 'streak',
    unlockedAt: new Date()
  },
  {
    id: 'mathematician',
    name: 'Matemático',
    description: 'Acerte 80% das questões de Matemática',
    icon: '🧮',
    category: 'area',
    unlockedAt: new Date()
  },
  {
    id: 'linguist',
    name: 'Linguista',
    description: 'Acerte 80% das questões de Linguagens',
    icon: '📚',
    category: 'area',
    unlockedAt: new Date()
  },
  {
    id: 'historian',
    name: 'Historiador',
    description: 'Acerte 80% das questões de Ciências Humanas',
    icon: '🏛️',
    category: 'area',
    unlockedAt: new Date()
  },
  {
    id: 'scientist',
    name: 'Cientista',
    description: 'Acerte 80% das questões de Ciências da Natureza',
    icon: '🔬',
    category: 'area',
    unlockedAt: new Date()
  },
  {
    id: 'speed_demon',
    name: 'Demônio da Velocidade',
    description: 'Responda uma questão em menos de 30 segundos',
    icon: '⚡',
    category: 'speed',
    unlockedAt: new Date()
  },
  {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Complete um simulado com 100% de acertos',
    icon: '💯',
    category: 'accuracy',
    unlockedAt: new Date()
  },
  {
    id: 'dedicated',
    name: 'Dedicado',
    description: 'Complete 10 simulados',
    icon: '📖',
    category: 'special',
    unlockedAt: new Date()
  },
  {
    id: 'champion',
    name: 'Campeão',
    description: 'Alcance o nível 20',
    icon: '👑',
    category: 'special',
    unlockedAt: new Date()
  },
  {
    id: 'daily_warrior',
    name: 'Guerreiro Diário',
    description: 'Complete 7 desafios diários consecutivos',
    icon: '⚔️',
    category: 'streak',
    unlockedAt: new Date()
  },
  {
    id: 'knowledge_seeker',
    name: 'Buscador do Conhecimento',
    description: 'Responda 1000 questões',
    icon: '🎓',
    category: 'special',
    unlockedAt: new Date()
  }
]

// Sistema de pontuação
export const POINTS_SYSTEM = {
  correctAnswer: {
    easy: 10,
    medium: 20,
    hard: 30
  },
  speedBonus: {
    under30s: 5,
    under60s: 3,
    under90s: 1
  },
  streakBonus: {
    5: 25,
    10: 50,
    15: 75,
    20: 100
  },
  simulationComplete: 50,
  dailyChallengeComplete: 100,
  perfectSimulation: 200
}

// Níveis e experiência necessária
export const LEVEL_SYSTEM = {
  maxLevel: 50,
  experiencePerLevel: [
    0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700,
    3250, 3850, 4500, 5200, 5950, 6750, 7600, 8500, 9450, 10450,
    11500, 12600, 13750, 14950, 16200, 17500, 18850, 20250, 21700, 23200,
    24750, 26350, 28000, 29700, 31450, 33250, 35100, 37000, 38950, 40950,
    43000, 45100, 47250, 49450, 51700, 54000, 56350, 58750, 61200, 63700
  ]
}

// Função para calcular pontos de uma resposta
export function calculateQuestionPoints(
  isCorrect: boolean,
  difficulty: 'easy' | 'medium' | 'hard',
  timeSpent: number
): number {
  if (!isCorrect) return 0

  let points = POINTS_SYSTEM.correctAnswer[difficulty]

  // Bônus de velocidade
  if (timeSpent < 30) {
    points += POINTS_SYSTEM.speedBonus.under30s
  } else if (timeSpent < 60) {
    points += POINTS_SYSTEM.speedBonus.under60s
  } else if (timeSpent < 90) {
    points += POINTS_SYSTEM.speedBonus.under90s
  }

  return points
}

// Função para calcular nível baseado na experiência
export function calculateLevel(experience: number): number {
  for (let level = LEVEL_SYSTEM.maxLevel; level >= 1; level--) {
    if (experience >= LEVEL_SYSTEM.experiencePerLevel[level - 1]) {
      return level
    }
  }
  return 1
}

// Função para calcular experiência necessária para o próximo nível
export function getExperienceForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_SYSTEM.maxLevel) {
    return LEVEL_SYSTEM.experiencePerLevel[LEVEL_SYSTEM.maxLevel - 1]
  }
  return LEVEL_SYSTEM.experiencePerLevel[currentLevel]
}

// Função para verificar conquistas desbloqueadas
export function checkAchievements(
  userStats: UserStats,
  simulationResult?: any
): Achievement[] {
  const newAchievements: Achievement[] = []
  const currentAchievementIds = userStats.achievements.map(a => a.id)

  // Primeira Vitória
  if (!currentAchievementIds.includes('first_victory') && userStats.totalQuestions > 0) {
    newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'first_victory')!)
  }

  // Sequência de 5
  if (!currentAchievementIds.includes('streak_5') && userStats.streak >= 5) {
    newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'streak_5')!)
  }

  // Conquistas por área (80% de acerto)
  Object.entries(userStats.areaStats).forEach(([area, stats]) => {
    const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
    
    if (accuracy >= 80) {
      let achievementId = ''
      switch (area) {
        case 'Matemática':
          achievementId = 'mathematician'
          break
        case 'Linguagens e Códigos':
          achievementId = 'linguist'
          break
        case 'Ciências Humanas':
          achievementId = 'historian'
          break
        case 'Ciências da Natureza':
          achievementId = 'scientist'
          break
      }
      
      if (achievementId && !currentAchievementIds.includes(achievementId)) {
        newAchievements.push(ACHIEVEMENTS.find(a => a.id === achievementId)!)
      }
    }
  })

  // Perfeccionista (100% em um simulado)
  if (simulationResult && simulationResult.percentage === 100 && 
      !currentAchievementIds.includes('perfectionist')) {
    newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'perfectionist')!)
  }

  // Dedicado (10 simulados)
  if (!currentAchievementIds.includes('dedicated') && userStats.totalQuestions >= 450) { // ~10 simulados
    newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'dedicated')!)
  }

  // Campeão (nível 20)
  if (!currentAchievementIds.includes('champion') && userStats.level >= 20) {
    newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'champion')!)
  }

  // Buscador do Conhecimento (1000 questões)
  if (!currentAchievementIds.includes('knowledge_seeker') && userStats.totalQuestions >= 1000) {
    newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'knowledge_seeker')!)
  }

  return newAchievements
}

// Função para gerar mensagem motivacional baseada no desempenho
export function getMotivationalMessage(percentage: number, streak: number): string {
  if (percentage >= 90) {
    return "🌟 Excelente! Você está dominando o conteúdo!"
  } else if (percentage >= 80) {
    return "🎯 Muito bom! Continue nesse ritmo!"
  } else if (percentage >= 70) {
    return "📈 Bom trabalho! Você está evoluindo!"
  } else if (percentage >= 60) {
    return "💪 Não desista! Cada questão é um aprendizado!"
  } else if (streak > 0) {
    return "🔥 Mantenha o foco! Sua sequência está crescendo!"
  } else {
    return "🚀 Vamos lá! O próximo simulado será ainda melhor!"
  }
}

// Função para calcular ranking semanal/mensal
export function calculateRanking(users: UserStats[]): any[] {
  return users
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({
      ...user,
      position: index + 1,
      badge: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''
    }))
}

// Sistema de recompensas diárias
export function getDailyReward(consecutiveDays: number): {
  points: number
  message: string
  special?: boolean
} {
  const baseReward = 20
  const bonus = Math.min(consecutiveDays * 5, 100) // Máximo 100 pontos de bônus
  
  const rewards = {
    1: { points: baseReward, message: "Bem-vindo de volta! 🎉" },
    3: { points: baseReward + 30, message: "3 dias seguidos! Você está dedicado! 🔥" },
    7: { points: baseReward + 70, message: "Uma semana completa! Incrível! ⭐", special: true },
    14: { points: baseReward + 120, message: "Duas semanas! Você é imparável! 🚀", special: true },
    30: { points: baseReward + 200, message: "Um mês inteiro! Lenda! 👑", special: true }
  }

  return rewards[consecutiveDays as keyof typeof rewards] || {
    points: baseReward + bonus,
    message: `${consecutiveDays} dias consecutivos! Continue assim! 💪`
  }
}

// Função para gerar relatório de progresso
export function generateProgressReport(userStats: UserStats): {
  overall: string
  strengths: string[]
  improvements: string[]
  recommendations: string[]
} {
  const overallAccuracy = (userStats.correctAnswers / userStats.totalQuestions) * 100
  
  const strengths: string[] = []
  const improvements: string[] = []
  const recommendations: string[] = []

  // Análise por área
  Object.entries(userStats.areaStats).forEach(([area, stats]) => {
    const accuracy = (stats.correct / stats.total) * 100
    
    if (accuracy >= 80) {
      strengths.push(`Excelente desempenho em ${area} (${accuracy.toFixed(1)}%)`)
    } else if (accuracy < 60) {
      improvements.push(`Precisa melhorar em ${area} (${accuracy.toFixed(1)}%)`)
      recommendations.push(`Foque mais nos estudos de ${area}`)
    }
  })

  // Análise de velocidade
  if (userStats.averageTime < 2) {
    strengths.push("Ótima velocidade de resposta")
  } else if (userStats.averageTime > 4) {
    improvements.push("Tempo de resposta pode ser melhorado")
    recommendations.push("Pratique mais para ganhar agilidade")
  }

  // Análise de sequência
  if (userStats.streak >= 10) {
    strengths.push(`Excelente sequência de acertos (${userStats.streak})`)
  } else if (userStats.streak < 3) {
    recommendations.push("Tente manter uma sequência de acertos maior")
  }

  let overall = ""
  if (overallAccuracy >= 85) {
    overall = "Excelente! Você está muito bem preparado!"
  } else if (overallAccuracy >= 70) {
    overall = "Bom desempenho! Continue estudando para melhorar ainda mais."
  } else if (overallAccuracy >= 60) {
    overall = "Desempenho regular. Foque nas áreas que precisa melhorar."
  } else {
    overall = "Precisa estudar mais. Não desista, você consegue!"
  }

  return {
    overall,
    strengths,
    improvements,
    recommendations
  }
}