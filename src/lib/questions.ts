// Banco de dados mockado com questões do ENEM
import { Question } from './types'

export const MOCK_QUESTIONS: Question[] = [
  // LINGUAGENS E CÓDIGOS
  {
    id: 'lc001',
    subject: 'Português',
    area: 'Linguagens e Códigos',
    question: 'Leia o texto abaixo:\n\n"O vento sussurrava segredos antigos entre as folhas da árvore centenária, enquanto a lua prateada iluminava o jardim adormecido."\n\nQual figura de linguagem está presente na expressão "O vento sussurrava segredos"?',
    options: [
      'Metáfora',
      'Personificação',
      'Hipérbole',
      'Ironia',
      'Antítese'
    ],
    correctAnswer: 1,
    explanation: 'A personificação (ou prosopopeia) atribui características humanas a seres inanimados. No caso, o vento "sussurrava", ação típica de seres humanos.',
    difficulty: 'medium',
    tags: ['figuras de linguagem', 'personificação', 'interpretação'],
    year: 2023
  },
  {
    id: 'lc002',
    subject: 'Literatura',
    area: 'Linguagens e Códigos',
    question: 'Sobre o Romantismo brasileiro, é correto afirmar que:',
    options: [
      'Priorizava a razão sobre a emoção',
      'Valorizava temas urbanos e industriais',
      'Exaltava o nacionalismo e a natureza brasileira',
      'Seguia rigorosamente os modelos clássicos',
      'Rejeitava completamente a religiosidade'
    ],
    correctAnswer: 2,
    explanation: 'O Romantismo brasileiro caracterizou-se pela exaltação da pátria, valorização da natureza tropical e busca por uma identidade nacional.',
    difficulty: 'medium',
    tags: ['romantismo', 'literatura brasileira', 'nacionalismo'],
    year: 2022
  },
  {
    id: 'lc003',
    subject: 'Inglês',
    area: 'Linguagens e Códigos',
    question: 'Read the text:\n\n"Climate change is one of the most pressing issues of our time. Scientists worldwide agree that immediate action is necessary to prevent catastrophic consequences."\n\nThe word "pressing" in the context means:',
    options: [
      'Expensive',
      'Urgent',
      'Difficult',
      'Recent',
      'Popular'
    ],
    correctAnswer: 1,
    explanation: '"Pressing" no contexto significa "urgente", referindo-se à necessidade imediata de ação sobre as mudanças climáticas.',
    difficulty: 'easy',
    tags: ['vocabulário', 'interpretação', 'inglês'],
    year: 2023
  },

  // MATEMÁTICA
  {
    id: 'mat001',
    subject: 'Álgebra',
    area: 'Matemática',
    question: 'Se f(x) = 2x + 3, qual é o valor de f(5)?',
    options: ['10', '11', '12', '13', '14'],
    correctAnswer: 3,
    explanation: 'f(5) = 2(5) + 3 = 10 + 3 = 13',
    difficulty: 'easy',
    tags: ['função', 'álgebra', 'substituição'],
    year: 2023
  },
  {
    id: 'mat002',
    subject: 'Geometria',
    area: 'Matemática',
    question: 'Um triângulo retângulo tem catetos de 3 cm e 4 cm. Qual é a medida da hipotenusa?',
    options: ['5 cm', '6 cm', '7 cm', '8 cm', '9 cm'],
    correctAnswer: 0,
    explanation: 'Pelo Teorema de Pitágoras: h² = 3² + 4² = 9 + 16 = 25, logo h = 5 cm',
    difficulty: 'easy',
    tags: ['pitágoras', 'triângulo retângulo', 'geometria'],
    year: 2022
  },
  {
    id: 'mat003',
    subject: 'Estatística',
    area: 'Matemática',
    question: 'Em uma turma de 30 alunos, as notas em uma prova foram: 6, 7, 8, 8, 9, 9, 9, 10. Se essas são todas as notas diferentes, qual é a moda?',
    options: ['6', '7', '8', '9', '10'],
    correctAnswer: 3,
    explanation: 'A moda é o valor que aparece com maior frequência. O número 9 aparece 3 vezes, mais que qualquer outro.',
    difficulty: 'medium',
    tags: ['estatística', 'moda', 'medidas centrais'],
    year: 2023
  },

  // CIÊNCIAS HUMANAS
  {
    id: 'ch001',
    subject: 'História',
    area: 'Ciências Humanas',
    question: 'A Revolução Industrial teve início em qual país e século?',
    options: [
      'França, século XVII',
      'Alemanha, século XVIII',
      'Inglaterra, século XVIII',
      'Estados Unidos, século XIX',
      'Itália, século XVII'
    ],
    correctAnswer: 2,
    explanation: 'A Revolução Industrial começou na Inglaterra no século XVIII, por volta de 1760, devido a fatores como disponibilidade de carvão, capital e mão de obra.',
    difficulty: 'easy',
    tags: ['revolução industrial', 'inglaterra', 'século XVIII'],
    year: 2022
  },
  {
    id: 'ch002',
    subject: 'Geografia',
    area: 'Ciências Humanas',
    question: 'Sobre o processo de urbanização no Brasil, é correto afirmar que:',
    options: [
      'Ocorreu principalmente no século XIX',
      'Foi mais intenso na região Norte',
      'Acelerou-se a partir da década de 1950',
      'Concentrou-se apenas no litoral',
      'Não gerou problemas sociais'
    ],
    correctAnswer: 2,
    explanation: 'A urbanização brasileira intensificou-se a partir dos anos 1950, com a industrialização e o êxodo rural.',
    difficulty: 'medium',
    tags: ['urbanização', 'brasil', 'industrialização'],
    year: 2023
  },
  {
    id: 'ch003',
    subject: 'Filosofia',
    area: 'Ciências Humanas',
    question: 'Para Sócrates, "só sei que nada sei" representa:',
    options: [
      'Ignorância total sobre todos os assuntos',
      'Humildade intelectual e busca pelo conhecimento',
      'Descrença na capacidade humana de aprender',
      'Crítica aos filósofos de sua época',
      'Defesa do ceticismo absoluto'
    ],
    correctAnswer: 1,
    explanation: 'A frase socrática expressa humildade intelectual e a consciência de que o verdadeiro saber começa com o reconhecimento da própria ignorância.',
    difficulty: 'medium',
    tags: ['sócrates', 'filosofia antiga', 'conhecimento'],
    year: 2022
  },

  // CIÊNCIAS DA NATUREZA
  {
    id: 'cn001',
    subject: 'Química',
    area: 'Ciências da Natureza',
    question: 'Qual é a fórmula química da água?',
    options: ['H2O', 'CO2', 'NaCl', 'CH4', 'O2'],
    correctAnswer: 0,
    explanation: 'A água é formada por dois átomos de hidrogênio (H) e um átomo de oxigênio (O), resultando na fórmula H2O.',
    difficulty: 'easy',
    tags: ['química', 'fórmulas', 'água'],
    year: 2023
  },
  {
    id: 'cn002',
    subject: 'Física',
    area: 'Ciências da Natureza',
    question: 'Um objeto em queda livre, desprezando a resistência do ar, tem aceleração de:',
    options: [
      '5 m/s²',
      '8 m/s²',
      '10 m/s²',
      '12 m/s²',
      '15 m/s²'
    ],
    correctAnswer: 2,
    explanation: 'A aceleração da gravidade na Terra é aproximadamente 10 m/s² (mais precisamente 9,8 m/s²).',
    difficulty: 'easy',
    tags: ['física', 'gravidade', 'queda livre'],
    year: 2022
  },
  {
    id: 'cn003',
    subject: 'Biologia',
    area: 'Ciências da Natureza',
    question: 'A fotossíntese é um processo que:',
    options: [
      'Consome oxigênio e produz gás carbônico',
      'Produz oxigênio e consome gás carbônico',
      'Não envolve gases',
      'Só ocorre à noite',
      'Só ocorre em animais'
    ],
    correctAnswer: 1,
    explanation: 'Na fotossíntese, as plantas consomem CO2 e água, produzindo glicose e liberando O2 como subproduto.',
    difficulty: 'easy',
    tags: ['biologia', 'fotossíntese', 'plantas'],
    year: 2023
  },

  // Questões mais complexas
  {
    id: 'lc004',
    subject: 'Português',
    area: 'Linguagens e Códigos',
    question: 'Analise o período: "Embora estudasse muito, não conseguiu a aprovação desejada."\n\nA oração subordinada adverbial presente no período expressa ideia de:',
    options: [
      'Causa',
      'Consequência',
      'Concessão',
      'Condição',
      'Finalidade'
    ],
    correctAnswer: 2,
    explanation: 'A oração "Embora estudasse muito" expressa concessão, pois indica uma ideia contrária ao que se esperaria (estudar muito deveria levar à aprovação).',
    difficulty: 'hard',
    tags: ['sintaxe', 'orações subordinadas', 'concessão'],
    year: 2023
  },
  {
    id: 'mat004',
    subject: 'Álgebra',
    area: 'Matemática',
    question: 'O conjunto solução da inequação 2x - 3 > 5 é:',
    options: [
      'x > 4',
      'x < 4',
      'x > 1',
      'x < 1',
      'x = 4'
    ],
    correctAnswer: 0,
    explanation: '2x - 3 > 5 → 2x > 8 → x > 4',
    difficulty: 'medium',
    tags: ['inequação', 'álgebra', 'conjunto solução'],
    year: 2022
  }
]

// Função para obter questões por área
export function getQuestionsByArea(area: string): Question[] {
  return MOCK_QUESTIONS.filter(q => q.area === area)
}

// Função para obter questões aleatórias
export function getRandomQuestions(count: number, area?: string): Question[] {
  let questions = area ? getQuestionsByArea(area) : MOCK_QUESTIONS
  
  // Embaralhar questões
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  
  return shuffled.slice(0, count)
}

// Função para obter questão por ID
export function getQuestionById(id: string): Question | undefined {
  return MOCK_QUESTIONS.find(q => q.id === id)
}

// Função para obter questões por dificuldade
export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Question[] {
  return MOCK_QUESTIONS.filter(q => q.difficulty === difficulty)
}

// Função para obter questões por assunto
export function getQuestionsBySubject(subject: string): Question[] {
  return MOCK_QUESTIONS.filter(q => q.subject === subject)
}

// Estatísticas do banco de questões
export function getQuestionsStats() {
  const total = MOCK_QUESTIONS.length
  const byArea = MOCK_QUESTIONS.reduce((acc, q) => {
    acc[q.area] = (acc[q.area] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const byDifficulty = MOCK_QUESTIONS.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    total,
    byArea,
    byDifficulty
  }
}