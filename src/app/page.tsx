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

// Dados mockados
const mockQuestions: Question[] = [
  {
    id: '1',
    subject: 'Português',
    area: 'Linguagens e Códigos',
    question: 'Qual figura de linguagem está presente na frase: "O vento sussurrava segredos"?',
    options: ['Metáfora', 'Personificação', 'Hipérbole', 'Ironia', 'Antítese'],
    correctAnswer: 1,
    explanation: 'A personificação atribui características humanas (sussurrar) a elementos não humanos (vento).',
    difficulty: 'medium'
  },
  {
    id: '2',
    subject: 'Matemática',
    area: 'Matemática',
    question: 'Se f(x) = 2x + 3, qual o valor de f(5)?',
    options: ['10', '11', '12', '13', '14'],
    correctAnswer: 3,
    explanation: 'f(5) = 2(5) + 3 = 10 + 3 = 13',
    difficulty: 'easy'
  },
  {
    id: '3',
    subject: 'História',
    area: 'Ciências Humanas',
    question: 'A Revolução Industrial teve início em qual país?',
    options: ['França', 'Alemanha', 'Inglaterra', 'Estados Unidos', 'Itália'],
    correctAnswer: 2,
    explanation: 'A Revolução Industrial começou na Inglaterra no século XVIII.',
    difficulty: 'easy'
  },
  {
    id: '4',
    subject: 'Química',
    area: 'Ciências da Natureza',
    question: 'Qual é a fórmula química da água?',
    options: ['H2O', 'CO2', 'NaCl', 'CH4', 'O2'],
    correctAnswer: 0,
    explanation: 'A água é formada por dois átomos de hidrogênio e um de oxigênio (H2O).',
    difficulty: 'easy'
  }
]

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
  const [dailyChallenge, setDailyChallenge] = useState({
    completed: false,
    questions: mockQuestions.slice(0, 5),
    timeLimit: 300 // 5 minutos
  })
  const [currentSimulation, setCurrentSimulation] = useState<{
    area: string
    questions: Question[]
    currentQuestion: number
    answers: number[]
    startTime: Date
  } | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([])

  // Função para iniciar simulado
  const startSimulation = (area: string) => {
    const areaQuestions = mockQuestions.filter(q => q.area === area)
    setCurrentSimulation({
      area,
      questions: areaQuestions,
      currentQuestion: 0,
      answers: [],
      startTime: new Date()
    })
    setCurrentView('simulation')
  }

  // Função para responder questão
  const answerQuestion = (answerIndex: number) => {
    if (!currentSimulation) return

    const newAnswers = [...currentSimulation.answers, answerIndex]
    
    if (currentSimulation.currentQuestion < currentSimulation.questions.length - 1) {
      setCurrentSimulation({
        ...currentSimulation,
        currentQuestion: currentSimulation.currentQuestion + 1,
        answers: newAnswers
      })
    } else {
      // Finalizar simulado
      const endTime = new Date()
      const timeSpent = (endTime.getTime() - currentSimulation.startTime.getTime()) / 1000
      const score = newAnswers.reduce((acc, answer, index) => {
        return acc + (answer === currentSimulation.questions[index].correctAnswer ? 1 : 0)
      }, 0)

      const result: SimulationResult = {
        id: Date.now().toString(),
        area: currentSimulation.area,
        questions: currentSimulation.questions,
        userAnswers: newAnswers,
        score,
        timeSpent,
        date: new Date(),
        isPaid: false
      }

      setSimulationResults([...simulationResults, result])
      setCurrentSimulation(null)
      setShowPaymentDialog(true)
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

  // Componente de Simulação
  const SimulationScreen = () => {
    if (!currentSimulation) return null

    const currentQ = currentSimulation.questions[currentSimulation.currentQuestion]
    const progress = ((currentSimulation.currentQuestion + 1) / currentSimulation.questions.length) * 100

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

  // Dialog de Pagamento
  const PaymentDialog = () => (
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Simulado Concluído!
          </DialogTitle>
          <DialogDescription>
            Parabéns! Você finalizou o simulado.
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
            <Button className="w-full bg-green-600 hover:bg-green-700">
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
              <li>✓ Gabarito completo das questões</li>
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
      {currentView === 'simulation' && <SimulationScreen />}
      <PaymentDialog />
    </div>
  )
}