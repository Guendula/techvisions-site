import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory catalog state for runtime mutations (likes, new admin systems)
let systemsStore: any[] = [];

// Endpoint: AI Business Advisor with Google Maps Grounding
app.post('/api/gemini/maps-grounding', async (req: Request, res: Response) => {
  try {
    const { prompt, userLocation } = req.body;

    if (!ai) {
      // Graceful fallback response when API key is not yet set in environment
      return res.json({
        answer: `TechVisions está presente nos principais pólos comerciais de Moçambique:
- Escritório Central: Av. 24 de Julho / Av. Julius Nyerere, Polana Cimento, Maputo.
- Filial Matola: EN4 próximo ao Matola Mall.
- Parceiros de Hardware POS (Gavetas, Impressoras e Leitores): Mercado Central de Maputo, Av. Guerra Popular, e Baixa de Maputo.

Recomendamos o **TechPadaria Pro** para negócios de panificação e o **TechPOS Mercearia** para minimercados de bairro.`,
        groundingChunks: [
          {
            maps: {
              title: "TechVisions Moçambique - Escritório Maputo",
              uri: "https://maps.google.com/?q=Maputo,+Mozambique",
              placeAnswerSources: {
                reviewSnippets: [{ snippet: "Centro de Soluções POS e Software Comercial em Maputo." }],
              },
            },
          },
          {
            maps: {
              title: "TechVisions Matola & Parque Industrial",
              uri: "https://maps.google.com/?q=Matola,+Mozambique",
              placeAnswerSources: {
                reviewSnippets: [{ snippet: "Atendimento comercial e implantação de sistemas de gestão de armazém." }],
              },
            },
          },
        ],
      });
    }

    const defaultMaputoLocation = {
      latitude: -25.9692, // Maputo, Mozambique
      longitude: 32.5732,
    };

    const targetLocation = userLocation?.latitude && userLocation?.longitude
      ? userLocation
      : defaultMaputoLocation;

    const queryPrompt = prompt
      ? `${prompt}. Contexto: Consultoria de software comercial para empresas e lojas em Moçambique pela TechVisions (sistemas para mercearias, padarias, ferragens, restaurantes e armazéns em Maputo, Matola, Beira ou Nampula, além de onde encontrar equipamentos POS como impressoras e balanças).`
      : 'Onde encontrar parceiros de equipamentos POS, impressoras térmicas e suporte de software para lojas e restaurantes em Maputo e Matola, Moçambique?';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: queryPrompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: targetLocation,
          },
        },
      },
    });

    const answer = response.text || 'Sem resposta gerada pelo modelo.';
    const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as any[]) || [];

    return res.json({
      answer,
      groundingChunks,
    });
  } catch (err: any) {
    console.error('Erro na API de Maps Grounding:', err);
    return res.status(500).json({
      error: 'Falha ao consultar assistente com Google Maps',
      details: err?.message,
      answer: 'A TechVisions oferece atendimento em Maputo e Matola com sistemas certificados para todo o território nacional moçambicano.',
      groundingChunks: [],
    });
  }
});

// Endpoint: Process checkout with M-Pesa, E-Mola, Visa
app.post('/api/checkout', (req: Request, res: Response) => {
  const { paymentMethod, amount, phoneNumber, cardNumber, items, userName } = req.body;

  if (!paymentMethod || !amount) {
    return res.status(400).json({ error: 'Dados de pagamento incompletos.' });
  }

  const timestamp = Date.now().toString().slice(-6);

  if (paymentMethod === 'MPESA') {
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Número de telefone é obrigatório para pagamento via M-Pesa.' });
    }
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const prefix = cleanPhone.slice(-9, -7);
    if (prefix !== '84' && prefix !== '85') {
      return res.status(400).json({
        error: 'Número M-Pesa inválido. Por favor utilize um número Vodacom (84 ou 85).',
      });
    }

    return res.json({
      success: true,
      transactionRef: `MPESA-MZ-${timestamp}`,
      message: `Prompt USSD enviado com sucesso para ${phoneNumber}. Por favor confirme a transação no seu telemóvel inserindo o PIN do M-Pesa.`,
      status: 'SUCCESS',
    });
  }

  if (paymentMethod === 'EMOLA') {
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Número de telefone é obrigatório para pagamento via E-Mola.' });
    }
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const prefix = cleanPhone.slice(-9, -7);
    if (prefix !== '86' && prefix !== '87') {
      return res.status(400).json({
        error: 'Número E-Mola inválido. Por favor utilize um número Movitel (86 ou 87).',
      });
    }

    return res.json({
      success: true,
      transactionRef: `EMOLA-MZ-${timestamp}`,
      message: `Notificação enviada para ${phoneNumber}. Introduza o seu PIN da carteira móvel E-Mola para aprovar.`,
      status: 'SUCCESS',
    });
  }

  if (paymentMethod === 'VISA') {
    return res.json({
      success: true,
      transactionRef: `VISA-MZ-${timestamp}`,
      message: 'Pagamento com Cartão Visa aprovado com sucesso através de conexão bancária 3D-Secure.',
      status: 'SUCCESS',
    });
  }

  return res.status(400).json({ error: 'Método de pagamento não suportado.' });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TechVisions Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Falha ao iniciar o servidor:', err);
  process.exit(1);
});
