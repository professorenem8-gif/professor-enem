// Sistema de Pagamento Pix - Professor ENEM
// Integração com Mercado Pago API

export interface PixPayment {
  id: string
  amount: number
  description: string
  pixKey: string
  qrCode: string
  qrCodeBase64: string
  copyPasteCode: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  createdAt: Date
  expiresAt: Date
}

export interface PaymentConfig {
  mercadoPagoAccessToken: string
  pixKey: string
  webhookUrl: string
}

// Configuração do Mercado Pago
const PAYMENT_CONFIG: PaymentConfig = {
  mercadoPagoAccessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
  pixKey: 'professorenem8@gmail.com',
  webhookUrl: process.env.WEBHOOK_URL || ''
}

/**
 * Cria um pagamento Pix usando a API do Mercado Pago
 * @param amount Valor em reais (ex: 5.00)
 * @param description Descrição do pagamento
 * @returns Dados do pagamento Pix
 */
export async function createPixPayment(
  amount: number = 5.00,
  description: string = 'Professor ENEM - Correção de Simulado'
): Promise<PixPayment> {
  try {
    // Configuração da requisição para API do Mercado Pago
    const paymentData = {
      transaction_amount: amount,
      description: description,
      payment_method_id: 'pix',
      payer: {
        email: 'estudante@professorenem.com',
        first_name: 'Estudante',
        last_name: 'ENEM'
      },
      notification_url: PAYMENT_CONFIG.webhookUrl,
      metadata: {
        app: 'professor-enem',
        type: 'simulado-correction'
      }
    }

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYMENT_CONFIG.mercadoPagoAccessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `payment-${Date.now()}-${Math.random()}`
      },
      body: JSON.stringify(paymentData)
    })

    if (!response.ok) {
      throw new Error(`Erro na API do Mercado Pago: ${response.status}`)
    }

    const paymentResponse = await response.json()

    // Extrair dados do Pix
    const pixData = paymentResponse.point_of_interaction?.transaction_data

    return {
      id: paymentResponse.id.toString(),
      amount: amount,
      description: description,
      pixKey: PAYMENT_CONFIG.pixKey,
      qrCode: pixData?.qr_code || '',
      qrCodeBase64: pixData?.qr_code_base64 || '',
      copyPasteCode: pixData?.qr_code || generateMockPixCode(),
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
    }
  } catch (error) {
    console.error('Erro ao criar pagamento Pix:', error)
    
    // Fallback com dados mockados para desenvolvimento
    return {
      id: `mock-${Date.now()}`,
      amount: amount,
      description: description,
      pixKey: PAYMENT_CONFIG.pixKey,
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=pix-mock',
      qrCodeBase64: '',
      copyPasteCode: generateMockPixCode(),
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)
    }
  }
}

/**
 * Verifica o status de um pagamento
 * @param paymentId ID do pagamento
 * @returns Status atualizado do pagamento
 */
export async function checkPaymentStatus(paymentId: string): Promise<string> {
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${PAYMENT_CONFIG.mercadoPagoAccessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Erro ao verificar pagamento: ${response.status}`)
    }

    const payment = await response.json()
    return payment.status
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error)
    return 'pending'
  }
}

/**
 * Gera um código Pix mockado para desenvolvimento
 */
function generateMockPixCode(): string {
  const pixKey = PAYMENT_CONFIG.pixKey
  const amount = '5.00'
  
  // Formato simplificado do código Pix (EMV)
  return `00020126580014br.gov.bcb.pix0136${pixKey}5204000053039865802BR5925Professor ENEM Simulados6009SAO PAULO62070503***6304ABCD`
}

/**
 * Processa webhook do Mercado Pago
 * @param webhookData Dados recebidos do webhook
 */
export async function processWebhook(webhookData: any) {
  try {
    if (webhookData.type === 'payment') {
      const paymentId = webhookData.data.id
      const status = await checkPaymentStatus(paymentId)
      
      if (status === 'approved') {
        // Liberar acesso ao resultado do simulado
        await unlockSimulationResult(paymentId)
      }
    }
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
  }
}

/**
 * Libera o acesso ao resultado do simulado após pagamento aprovado
 * @param paymentId ID do pagamento aprovado
 */
async function unlockSimulationResult(paymentId: string) {
  // Aqui você implementaria a lógica para:
  // 1. Identificar qual simulado está associado ao pagamento
  // 2. Marcar o resultado como "pago" no banco de dados
  // 3. Enviar notificação para o usuário
  // 4. Registrar a transação
  
  console.log(`Resultado liberado para pagamento: ${paymentId}`)
}

// Instruções de configuração para o desenvolvedor
export const SETUP_INSTRUCTIONS = {
  mercadoPago: {
    title: "Configuração do Mercado Pago",
    steps: [
      "1. Acesse https://www.mercadopago.com.br/developers",
      "2. Crie uma conta de desenvolvedor",
      "3. Crie uma aplicação",
      "4. Copie o Access Token de produção",
      "5. Configure a variável MERCADO_PAGO_ACCESS_TOKEN no .env.local",
      "6. Configure o webhook URL para receber notificações de pagamento"
    ]
  },
  webhook: {
    title: "Configuração do Webhook",
    steps: [
      "1. Configure uma URL pública para receber webhooks (ex: ngrok, Vercel)",
      "2. Crie o endpoint /api/webhook/mercadopago",
      "3. Configure a URL no painel do Mercado Pago",
      "4. Teste com pagamentos de desenvolvimento"
    ]
  },
  environment: {
    title: "Variáveis de Ambiente Necessárias",
    variables: [
      "MERCADO_PAGO_ACCESS_TOKEN=seu_access_token_aqui",
      "WEBHOOK_URL=https://seuapp.vercel.app/api/webhook/mercadopago",
      "NEXT_PUBLIC_APP_URL=https://seuapp.vercel.app"
    ]
  }
}