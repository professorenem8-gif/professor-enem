"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  BookOpen, 
  Calculator, 
  Globe, 
  Atom, 
  Trophy, 
  User, 
  Clock, 
  Target, 
  Star,
  Play,
  CheckCircle,
  XCircle,
  Award,
  TrendingUp,
  Calendar,
  Zap,
  Crown,
  Medal,
  Brain,
  Timer,
  BarChart3
} from 'lucide-react'

// Tipos de dados
interface Question {
  id: string
  subject: string
  area: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface UserStats {
  totalQuestions: number
  correctAnswers: number
  averageTime: number
  streak: number
  points: number
  level: number
  achievements: string[]
}

interface SimulationResult {
  id: string
  area: string
  questions: Question[]
  userAnswers: number[]
  score: number
  timeSpent: number
  date: Date
  isPaid: boolean
}

interface DailyChallenge {
  completed: boolean
  questions: Question[]
  timeLimit: number
  currentQuestion: number
  answers: number[]
  startTime: Date | null
  timeRemaining: number
}

// Dados mockados - 45 questões por área
const generateQuestions = (area: string, count: number): Question[] => {
  const subjects = {
    'Linguagens e Códigos': ['Português', 'Literatura', 'Inglês', 'Espanhol', 'Artes'],
    'Matemática': ['Álgebra', 'Geometria', 'Estatística', 'Probabilidade', 'Trigonometria'],
    'Ciências Humanas': ['História', 'Geografia', 'Filosofia', 'Sociologia', 'Política'],
    'Ciências da Natureza': ['Física', 'Química', 'Biologia', 'Ecologia', 'Genética']
  }

  const questionTemplates = {
    'Linguagens e Códigos': [
      'Qual figura de linguagem está presente na frase: "O vento sussurrava segredos"?',
      'Identifique a função sintática do termo destacado na oração.',
      'Qual o período literário da obra "Dom Casmurro"?',
      'Complete the sentence: "If I ___ you, I would study more."',
      'Qual movimento artístico caracteriza-se pelo uso de cores puras?'
    ],
    'Matemática': [
      'Se f(x) = 2x + 3, qual o valor de f(5)?',
      'Calcule a área de um triângulo com base 8 e altura 6.',
      'Qual a probabilidade de sair cara em 3 lançamentos de moeda?',
      'Resolva a equação: 2x + 5 = 15',
      'Calcule o valor de sen(30°)'
    ],
    'Ciências Humanas': [
      'A Revolução Industrial teve início em qual país?',
      'Qual filósofo defendia o "Cogito ergo sum"?',
      'O que caracteriza o clima tropical?',
      'Qual foi a principal causa da Primeira Guerra Mundial?',
      'O que é democracia representativa?'
    ],
    'Ciências da Natureza': [
      'Qual é a fórmula química da água?',
      'Qual a primeira lei de Newton?',
      'O que são células procariontes?',
      'Qual gás é responsável pelo efeito estufa?',
      'O que é fotossíntese?'
    ]
  }

  const optionsTemplates = {
    'Linguagens e Códigos': [
      ['Metáfora', 'Personificação', 'Hipérbole', 'Ironia', 'Antítese'],
      ['Sujeito', 'Predicado', 'Objeto direto', 'Adjunto adverbial', 'Complemento nominal'],
      ['Romantismo', 'Realismo', 'Naturalismo', 'Parnasianismo', 'Simbolismo'],
      ['was', 'were', 'am', 'is', 'are'],
      ['Impressionismo', 'Cubismo', 'Surrealismo', 'Expressionismo', 'Fauvismo']
    ],
    'Matemática': [
      ['10', '11', '12', '13', '14'],
      ['24', '28', '32', '36', '40'],
      ['1/8', '1/4', '3/8', '1/2', '5/8'],
      ['3', '4', '5', '6', '7'],
      ['0,5', '0,6', '0,7', '0,8', '0,9']
    ],
    'Ciências Humanas': [
      ['França', 'Alemanha', 'Inglaterra', 'Estados Unidos', 'Itália'],
      ['Platão', 'Aristóteles', 'Descartes', 'Kant', 'Nietzsche'],
      ['Baixa umidade', 'Altas temperaturas', 'Chuvas regulares', 'Todas as anteriores', 'Nenhuma das anteriores'],
      ['Imperialismo', 'Nacionalismo', 'Militarismo', 'Sistema de alianças', 'Todas as anteriores'],
      ['Voto direto', 'Representantes eleitos', 'Participação popular', 'Todas as anteriores', 'Apenas A e B']
    ],
    'Ciências da Natureza': [
      ['H2O', 'CO2', 'NaCl', 'CH4', 'O2'],
      ['Inércia', 'Ação e reação', 'Força = massa × aceleração', 'Conservação da energia', 'Gravitação'],
      ['Sem núcleo', 'Com núcleo', 'Sem parede celular', 'Com mitocôndrias', 'Multicelulares'],
      ['Oxigênio', 'Nitrogênio', 'Dióxido de carbono', 'Hidrogênio', 'Hélio'],
      ['Respiração das plantas', 'Produção de energia', 'Síntese de glicose', 'Absorção de água', 'Reprodução']
    ]
  }

  const explanations = {
    'Linguagens e Códigos': [
      'A personificação atribui características humanas (sussurrar) a elementos não humanos (vento).',
      'O objeto direto completa o sentido do verbo transitivo direto.',
      'Dom Casmurro foi escrito por Machado de Assis durante o Realismo.',
      'Em conditional sentences tipo 2, usa-se "were" para todas as pessoas.',
      'O Fauvismo caracteriza-se pelo uso de cores puras e vibrantes.'
    ],
    'Matemática': [
      'f(5) = 2(5) + 3 = 10 + 3 = 13',
      'Área = (base × altura) / 2 = (8 × 6) / 2 = 24',
      'P(3 caras) = (1/2)³ = 1/8',
      '2x + 5 = 15 → 2x = 10 → x = 5',
      'sen(30°) = 1/2 = 0,5'
    ],
    'Ciências Humanas': [
      'A Revolução Industrial começou na Inglaterra no século XVIII.',
      'René Descartes formulou o "Penso, logo existo".',
      'O clima tropical caracteriza-se por altas temperaturas e chuvas regulares.',
      'O imperialismo, nacionalismo, militarismo e sistema de alianças causaram a guerra.',
      'Na democracia representativa, o povo elege representantes para governar.'
    ],
    'Ciências da Natureza': [
      'A água é formada por dois átomos de hidrogênio e um de oxigênio (H2O).',
      'A primeira lei de Newton é o princípio da inércia.',
      'Células procariontes são aquelas que não possuem núcleo definido.',
      'O dióxido de carbono (CO2) é o principal gás do efeito estufa.',
      'Fotossíntese é o processo de síntese de glicose usando luz solar.'
    ]
  }

  const questions: Question[] = []
  const areaSubjects = subjects[area as keyof typeof subjects] || ['Geral']
  const areaQuestions = questionTemplates[area as keyof typeof questionTemplates] || ['Questão padrão?']
  const areaOptions = optionsTemplates[area as keyof typeof optionsTemplates] || [['A', 'B', 'C', 'D', 'E']]
  const areaExplanations = explanations[area as keyof typeof explanations] || ['Explicação padrão.']

  for (let i = 0; i < count; i++) {
    const subjectIndex = i % areaSubjects.length
    const questionIndex = i % areaQuestions.length
    const optionIndex = i % areaOptions.length
    const explanationIndex = i % areaExplanations.length

    questions.push({
      id: `${area}-${i + 1}`,
      subject: areaSubjects[subjectIndex],
      area,
      question: `${i + 1}. ${areaQuestions[questionIndex]}`,
      options: areaOptions[optionIndex],
      correctAnswer: Math.floor(Math.random() * 5), // Resposta aleatória para demo
      explanation: areaExplanations[explanationIndex],
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard'
    })
  }

  return questions
}

const areas = [
  {
    name: 'Linguagens e Códigos',
    icon: BookOpen,
    color: 'from-blue-500 to-blue-600',
    description: 'Português, Literatura, Inglês, Espanhol, Artes'
  },
  {
    name: 'Matemática',
    icon: Calculator,
    color: 'from-green-500 to-green-600',
    description: 'Álgebra, Geometria, Estatística, Probabilidade'
  },
  {
    name: 'Ciências Humanas',
    icon: Globe,
    color: 'from-purple-500 to-purple-600',
    description: 'História, Geografia, Filosofia, Sociologia'
  },
  {
    name: 'Ciências da Natureza',
    icon: Atom,
    color: 'from-orange-500 to-orange-600',
    description: 'Física, Química, Biologia'
  }
]

export default function ProfessorEnemApp() {
  const [currentView, setCurrentView] = useState('home')
  const [userStats, setUserStats] = useState<UserStats>({
    totalQuestions: 247,
    correctAnswers: 189,
    averageTime: 2.3,
    streak: 7,
    points: 1890,
    level: 12,
    achievements: ['Primeira Vitória', 'Sequência de 5', 'Matemático', 'Linguista']
  })
  
  // Estado do Desafio Diário
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>({
    completed: false,
    questions: generateQuestions('Linguagens e Códigos', 5).slice(0, 5),
    timeLimit: 300, // 5 minutos
    currentQuestion: 0,
    answers: [],
    startTime: null,
    timeRemaining: 300
  })

  const [currentSimulation, setCurrentSimulation] = useState<{
    area: string
    questions: Question[]
    currentQuestion: number
    answers: number[]
    startTime: Date
    isCompleted: boolean
  } | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([])
  const [completedSimulation, setCompletedSimulation] = useState<SimulationResult | null>(null)

  // Timer do desafio diário
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (dailyChallenge.startTime && !dailyChallenge.completed && dailyChallenge.timeRemaining > 0) {
      interval = setInterval(() => {
        setDailyChallenge(prev => {
          const newTimeRemaining = prev.timeRemaining - 1
          if (newTimeRemaining <= 0) {
            // Tempo esgotado - finalizar desafio
            return {
              ...prev,
              completed: true,
              timeRemaining: 0
            }
          }
          return {
            ...prev,
            timeRemaining: newTimeRemaining
          }
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [dailyChallenge.startTime, dailyChallenge.completed, dailyChallenge.timeRemaining])

  // Função para iniciar desafio diário
  const startDailyChallenge = () => {
    setDailyChallenge(prev => ({
      ...prev,
      startTime: new Date(),
      currentQuestion: 0,
      answers: [],
      timeRemaining: 300
    }))
    setCurrentView('dailyChallenge')
  }

  // Função para responder questão do desafio diário
  const answerDailyChallengeQuestion = (answerIndex: number) => {
    setDailyChallenge(prev => {
      const newAnswers = [...prev.answers, answerIndex]
      
      if (prev.currentQuestion < prev.questions.length - 1) {
        // Próxima questão
        return {
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          answers: newAnswers
        }
      } else {
        // Desafio concluído
        const score = newAnswers.reduce((acc, answer, index) => {
          return acc + (answer === prev.questions[index].correctAnswer ? 1 : 0)
        }, 0)
        
        // Adicionar pontos ao usuário
        setUserStats(prevStats => ({
          ...prevStats,
          points: prevStats.points + (score * 10), // 10 pontos por acerto
          totalQuestions: prevStats.totalQuestions + 5,
          correctAnswers: prevStats.correctAnswers + score
        }))

        return {
          ...prev,
          completed: true,
          answers: newAnswers
        }
      }
    })
  }

  // Função para iniciar simulado (45 questões)
  const startSimulation = (area: string) => {
    const areaQuestions = generateQuestions(area, 45) // 45 questões por simulado
    setCurrentSimulation({
      area,
      questions: areaQuestions,
      currentQuestion: 0,
      answers: [],
      startTime: new Date(),
      isCompleted: false
    })
    setCurrentView('simulation')
  }

  // Função para responder questão do simulado
  const answerQuestion = (answerIndex: number) => {
    if (!currentSimulation) return

    const newAnswers = [...currentSimulation.answers, answerIndex]
    
    if (currentSimulation.currentQuestion < currentSimulation.questions.length - 1) {
      // Continuar para próxima questão
      setCurrentSimulation({
        ...currentSimulation,
        currentQuestion: currentSimulation.currentQuestion + 1,
        answers: newAnswers
      })
    } else {
      // TODAS AS 45 QUESTÕES RESPONDIDAS - MARCAR COMO COMPLETADO
      setCurrentSimulation({
        ...currentSimulation,
        answers: newAnswers,
        isCompleted: true
      })
    }
  }

  // Função para finalizar simulado e mostrar pagamento
  const finishSimulation = () => {
    if (!currentSimulation || !currentSimulation.isCompleted) return

    const endTime = new Date()
    const timeSpent = (endTime.getTime() - currentSimulation.startTime.getTime()) / 1000
    const score = currentSimulation.answers.reduce((acc, answer, index) => {
      return acc + (answer === currentSimulation.questions[index].correctAnswer ? 1 : 0)
    }, 0)

    const result: SimulationResult = {
      id: Date.now().toString(),
      area: currentSimulation.area,
      questions: currentSimulation.questions,
      userAnswers: currentSimulation.answers,
      score,
      timeSpent,
      date: new Date(),
      isPaid: false
    }

    setSimulationResults([...simulationResults, result])
    setCompletedSimulation(result)
    setCurrentSimulation(null)
    setCurrentView('home')
    
    // MOSTRAR PAGAMENTO APENAS APÓS FINALIZAR
    setShowPaymentDialog(true)
  }

  // Função para processar pagamento
  const processPayment = () => {
    if (completedSimulation) {
      const updatedResult = { ...completedSimulation, isPaid: true }
      setSimulationResults(prev => 
        prev.map(result => 
          result.id === completedSimulation.id ? updatedResult : result
        )
      )
      setCompletedSimulation(updatedResult)
      setShowPaymentDialog(false)
      setCurrentView('results')
    }
  }

  // Componente de Tela Inicial
  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Professor ENEM</h1>
                <p className="text-blue-200 text-sm">Simulados & Desafios</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-yellow-400 font-bold">{userStats.points} pts</p>
                <p className="text-blue-200 text-sm">Nível {userStats.level}</p>
              </div>
              <Avatar>
                <AvatarFallback className="bg-yellow-400 text-blue-900">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Mensagem Motivacional */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-400 to-yellow-500 border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900">Cada questão te aproxima da sua aprovação!</h2>
                <p className="text-blue-800">Continue firme nos estudos. Você está no caminho certo! 🚀</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{Math.round((userStats.correctAnswers / userStats.totalQuestions) * 100)}%</p>
              <p className="text-blue-200 text-sm">Acertos</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{userStats.streak}</p>
              <p className="text-blue-200 text-sm">Sequência</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Timer className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{userStats.averageTime}min</p>
              <p className="text-blue-200 text-sm">Tempo Médio</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{userStats.level}</p>
              <p className="text-blue-200 text-sm">Nível</p>
            </CardContent>
          </Card>
        </div>

        {/* Desafio Diário */}
        <Card className="mb-8 bg-gradient-to-r from-purple-600 to-purple-700 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Desafio Diário</h3>
                  <p className="text-purple-200">5 questões • 5 minutos • +50 pontos</p>
                </div>
              </div>
              <Button 
                className="bg-white text-purple-700 hover:bg-white/90"
                disabled={dailyChallenge.completed}
                onClick={startDailyChallenge}
              >
                {dailyChallenge.completed ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Concluído
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Começar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Principal */}
        <Tabs defaultValue="simulados" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="simulados" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-blue-900">
              Simulados
            </TabsTrigger>
            <TabsTrigger value="desafios" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-blue-900">
              Desafios
            </TabsTrigger>
            <TabsTrigger value="ranking" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-blue-900">
              Ranking
            </TabsTrigger>
            <TabsTrigger value="perfil" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-blue-900">
              Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulados" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {areas.map((area, index) => {
                const Icon = area.icon
                return (
                  <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${area.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{area.name}</h3>
                          <p className="text-blue-200 text-sm">{area.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="bg-white/20 text-white">45 questões</Badge>
                          <Badge variant="secondary" className="bg-white/20 text-white">90 min</Badge>
                        </div>
                        <Button 
                          onClick={() => startSimulation(area.name)}
                          className="bg-yellow-400 text-blue-900 hover:bg-yellow-500"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Iniciar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="desafios" className="mt-6">
            <div className="grid gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Desafios Disponíveis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">Maratona Matemática</h4>
                        <p className="text-blue-200 text-sm">20 questões • Tempo livre • +200 pontos</p>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700">Participar</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">Speed Português</h4>
                        <p className="text-blue-200 text-sm">10 questões • 5 minutos • +150 pontos</p>
                      </div>
                      <Button className="bg-orange-600 hover:bg-orange-700">Participar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ranking" className="mt-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Ranking Geral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Ana Silva', points: 2450, level: 15, position: 1 },
                    { name: 'João Santos', points: 2380, level: 14, position: 2 },
                    { name: 'Você', points: userStats.points, level: userStats.level, position: 3 },
                    { name: 'Maria Costa', points: 1820, level: 12, position: 4 },
                    { name: 'Pedro Lima', points: 1750, level: 11, position: 5 }
                  ].map((user, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${user.name === 'Você' ? 'bg-yellow-400/20 border border-yellow-400' : 'bg-white/10'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          user.position === 1 ? 'bg-yellow-400 text-blue-900' :
                          user.position === 2 ? 'bg-gray-300 text-gray-800' :
                          user.position === 3 ? 'bg-orange-400 text-white' :
                          'bg-white/20 text-white'
                        }`}>
                          {user.position}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="text-blue-200 text-sm">Nível {user.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-400">{user.points} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="perfil" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-yellow-400" />
                    Estatísticas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-blue-200">Progresso do Nível</span>
                        <span className="text-white">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{userStats.totalQuestions}</p>
                        <p className="text-blue-200 text-sm">Questões</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{userStats.correctAnswers}</p>
                        <p className="text-blue-200 text-sm">Acertos</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Conquistas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {userStats.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                        <Medal className="w-4 h-4 text-yellow-400" />
                        <span className="text-white text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  // Componente do Desafio Diário
  const DailyChallengeScreen = () => {
    if (dailyChallenge.completed) {
      const score = dailyChallenge.answers.reduce((acc, answer, index) => {
        return acc + (answer === dailyChallenge.questions[index].correctAnswer ? 1 : 0)
      }, 0)

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8 text-center">
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Desafio Diário Concluído!</h2>
                <p className="text-purple-200 mb-6">Parabéns! Você completou o desafio de hoje.</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-400">{score}</p>
                    <p className="text-purple-200 text-sm">Acertos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-400">{Math.round((score / 5) * 100)}%</p>
                    <p className="text-purple-200 text-sm">Aproveitamento</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-400">+{score * 10}</p>
                    <p className="text-purple-200 text-sm">Pontos</p>
                  </div>
                </div>

                <Button 
                  onClick={() => setCurrentView('home')}
                  className="bg-yellow-400 text-purple-900 hover:bg-yellow-500"
                >
                  Voltar ao Menu
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    const currentQ = dailyChallenge.questions[dailyChallenge.currentQuestion]
    const progress = ((dailyChallenge.currentQuestion + 1) / dailyChallenge.questions.length) * 100
    const minutes = Math.floor(dailyChallenge.timeRemaining / 60)
    const seconds = dailyChallenge.timeRemaining % 60

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header do Desafio */}
          <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Desafio Diário</h2>
                  <p className="text-purple-200">Questão {dailyChallenge.currentQuestion + 1} de {dailyChallenge.questions.length}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                    </div>
                    <p className="text-purple-200 text-sm">Tempo</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentView('home')}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Sair
                  </Button>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Questão */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="mb-6">
                <Badge className="mb-4 bg-yellow-400 text-purple-900">{currentQ.subject}</Badge>
                <h3 className="text-lg font-semibold text-white mb-4">{currentQ.question}</h3>
              </div>

              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start p-4 h-auto border-white/20 text-white hover:bg-yellow-400 hover:text-purple-900 transition-all"
                    onClick={() => answerDailyChallengeQuestion(index)}
                  >
                    <span className="font-semibold mr-3">{String.fromCharCode(65 + index)})</span>
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Componente de Simulação
  const SimulationScreen = () => {
    if (!currentSimulation) return null

    const currentQ = currentSimulation.questions[currentSimulation.currentQuestion]
    const progress = ((currentSimulation.currentQuestion + 1) / currentSimulation.questions.length) * 100

    // Se o simulado foi completado (45 questões), mostrar tela de finalização
    if (currentSimulation.isCompleted) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Simulado Concluído!</h2>
                  <p className="text-blue-200">Você respondeu todas as {currentSimulation.questions.length} questões de {currentSimulation.area}</p>
                </div>

                <div className="bg-white/10 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Resumo Básico:</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">{currentSimulation.questions.length}</p>
                      <p className="text-blue-200 text-sm">Questões Respondidas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">{Math.round((Date.now() - currentSimulation.startTime.getTime()) / 60000)}min</p>
                      <p className="text-blue-200 text-sm">Tempo Total</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border border-yellow-400/30 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">🔒 Resultado Detalhado Bloqueado</h3>
                  <p className="text-blue-200 text-sm mb-4">
                    Para ver sua pontuação, gabarito completo, explicações detalhadas e recomendações personalizadas, finalize o simulado.
                  </p>
                  <p className="text-yellow-400 font-semibold">Custo: R$ 5,00 via Pix</p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => {
                      setCurrentSimulation(null)
                      setCurrentView('home')
                    }}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Voltar ao Menu
                  </Button>
                  <Button 
                    onClick={finishSimulation}
                    className="bg-yellow-400 text-blue-900 hover:bg-yellow-500"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Finalizar e Ver Resultado
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header da Simulação */}
          <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{currentSimulation.area}</h2>
                  <p className="text-blue-200">Questão {currentSimulation.currentQuestion + 1} de {currentSimulation.questions.length}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCurrentSimulation(null)
                    setCurrentView('home')
                  }}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Sair
                </Button>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Questão */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="mb-6">
                <Badge className="mb-4 bg-yellow-400 text-blue-900">{currentQ.subject}</Badge>
                <h3 className="text-lg font-semibold text-white mb-4">{currentQ.question}</h3>
              </div>

              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start p-4 h-auto border-white/20 text-white hover:bg-yellow-400 hover:text-blue-900 transition-all"
                    onClick={() => answerQuestion(index)}
                  >
                    <span className="font-semibold mr-3">{String.fromCharCode(65 + index)})</span>
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Tela de Resultados (após pagamento)
  const ResultsScreen = () => {
    if (!completedSimulation || !completedSimulation.isPaid) return null

    const percentage = Math.round((completedSimulation.score / completedSimulation.questions.length) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Resultado Detalhado - {completedSimulation.area}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">{completedSimulation.score}</p>
                  <p className="text-blue-200">Acertos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">{percentage}%</p>
                  <p className="text-blue-200">Aproveitamento</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">{Math.round(completedSimulation.timeSpent / 60)}min</p>
                  <p className="text-blue-200">Tempo Total</p>
                </div>
              </div>

              {/* Gabarito Detalhado */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Gabarito e Explicações:</h4>
                {completedSimulation.questions.map((question, index) => {
                  const userAnswer = completedSimulation.userAnswers[index]
                  const isCorrect = userAnswer === question.correctAnswer
                  
                  return (
                    <div key={index} className="p-4 bg-white/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white">Questão {index + 1}</span>
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <p className="text-blue-200 text-sm mb-2">{question.question}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-white">Sua resposta: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>{String.fromCharCode(65 + userAnswer)}) {question.options[userAnswer]}</span></p>
                        </div>
                        <div>
                          <p className="text-white">Resposta correta: <span className="text-green-400">{String.fromCharCode(65 + question.correctAnswer)}) {question.options[question.correctAnswer]}</span></p>
                        </div>
                      </div>
                      <p className="text-blue-200 text-sm mt-2"><strong>Explicação:</strong> {question.explanation}</p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 text-center">
                <Button 
                  onClick={() => setCurrentView('home')}
                  className="bg-yellow-400 text-blue-900 hover:bg-yellow-500"
                >
                  Voltar ao Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Dialog de Pagamento (APENAS APÓS FINALIZAR 45 QUESTÕES)
  const PaymentDialog = () => (
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Simulado Concluído!
          </DialogTitle>
          <DialogDescription>
            Parabéns! Você finalizou o simulado de 45 questões.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Para ver o resultado completo e as correções das suas respostas
            </h3>
            <p className="text-2xl font-bold text-blue-600 mb-4">
              Pague apenas R$ 5,00 via Pix
            </p>
            
            {/* Simulação do QR Code */}
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4">
              <div className="w-32 h-32 bg-gray-200 mx-auto rounded flex items-center justify-center">
                <p className="text-xs text-gray-500 text-center">QR Code Pix<br/>R$ 5,00</p>
              </div>
            </div>
            
            <div className="bg-gray-100 p-3 rounded text-sm font-mono break-all">
              00020126580014br.gov.bcb.pix0136professorenem8@gmail.com5204000053039865802BR5925Professor ENEM Simulados6009SAO PAULO62070503***6304ABCD
            </div>
            
            <p className="text-xs text-gray-600 mt-2">
              Chave Pix: professorenem8@gmail.com
            </p>
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={processPayment}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Já Paguei - Verificar Pagamento
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setShowPaymentDialog(false)}>
              Pagar Depois
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Após o pagamento, você terá acesso a:
            <ul className="mt-2 space-y-1">
              <li>✓ Gabarito completo das 45 questões</li>
              <li>✓ Desempenho detalhado por área</li>
              <li>✓ Tempo médio por questão</li>
              <li>✓ Recomendações personalizadas</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="min-h-screen">
      {currentView === 'home' && <HomeScreen />}
      {currentView === 'dailyChallenge' && <DailyChallengeScreen />}
      {currentView === 'simulation' && <SimulationScreen />}
      {currentView === 'results' && <ResultsScreen />}
      <PaymentDialog />
    </div>
  )
}