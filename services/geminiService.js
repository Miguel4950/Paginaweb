import { GoogleGenAI, Type } from '@google/genai';
import { GuideLength, StudyMode } from '../types.js';
import { GEMINI_API_KEY, GEMINI_API_KEY_PLACEHOLDER } from '../config.js';

const getLengthInstruction = (length) => {
  switch (length) {
    case GuideLength.Short:
      return 'Generate a concise, one-page summary. Focus only on the most critical concepts, definitions, and key takeaways. Use bullet points and brief descriptions to keep it short and scannable.';
    case GuideLength.Medium:
      return 'Create a detailed guide of approximately 2-3 pages. Expand on key concepts, provide examples, and explain relationships between topics. Use a mix of paragraphs and lists for clarity and good structure.';
    case GuideLength.Long:
      return 'Produce an in-depth guide of approximately 4-5 pages. Elaborate extensively on all topics found in the images. Include detailed explanations, multiple examples for each concept, and explore nuances. Use structured sections with clear headings and subheadings.';
    case GuideLength.VeryLong:
      return 'Generate an exhaustive, comprehensive, and extremely long document of 6 pages or more. This is for deep, academic-level study. Do not hold back. Analyze every piece of information from the images, synthesize it, and then expand on it significantly with additional context, background information, discussions of potential implications or applications, and complex, detailed diagrams. The goal is maximum possible detail and length, making it an all-encompassing resource. Be verbose and thorough.';
    default:
      return '';
  }
};

const getModeInstruction = (mode) => {
  if (mode === StudyMode.Pro) {
    return "You are in 'Pro' mode. This requires a deep, expert-level analysis using the model's full capabilities. Go far beyond simple summaries. You MUST interconnect disparate concepts, generate novel insights, suggest real-world applications, and design sophisticated, highly creative visual layouts. The structural complexity and analytical depth must be exceptionally high, reflecting the highest standard of academic and design quality. The user expects a world-class, premium result.";
  }
  return "You are in 'Normal' mode, optimized for speed and clarity. Focus on creating a clear, well-structured, and visually appealing guide based on the provided content. The priority is a fast, accurate, and easy-to-understand summary.";
};

const getLanguageInstruction = (language) => {
  return `Generate the study guide in the following language: ${language}. All output, including titles, text, and explanations, must be in this language.`;
};

const getCustomInstruction = (prompt) => {
  if (!prompt || prompt.trim() === '') {
    return 'No custom instructions provided. Follow the standard procedure.';
  }
  return `The user has provided the following specific instructions. You MUST follow them carefully to customize the output: "${prompt}"`;
};

const SYSTEM_INSTRUCTION = `
**ROL Y OBJETIVO:**
Eres un experto en síntesis de información y diseño web. Tu objetivo es tomar los archivos proporcionados por el usuario (que pueden ser imágenes, PDFs o audios con transcripciones implícitas) y transformarlos en el contenido para una Guía de Estudio Digital. La guía debe ser DETALLADA y sobre todo, **extremadamente VISUAL Y ATRACTIVA**, siguiendo las preferencias de un usuario exigente que valora la estética y el aprendizaje visual por encima de los largos bloques de texto.

**PROCESO DE ANÁLISIS INTERNO (OBLIGATORIO):**
1.  **Análisis Holístico:** Examina TODOS los archivos (imágenes, PDFs, audios) para comprender la materia, los temas centrales y los tipos de contenido (definiciones, fórmulas, diagramas, apuntes, transcripciones de audio). Sintetiza la información de todas las fuentes en un todo coherente.
2.  **Extracción Estructurada:** Extrae toda la información clave y organízala.
3.  **Síntesis y Expansión Creativa:** Redacta explicaciones claras y detalladas, pero prioriza la representación visual de la información.

**REQUISITOS DE DISEÑO VISUAL (MUY IMPORTANTE):**
*   **Balance Visual:** ¡Evita los "muros de texto"! Cada concepto o sección debe ser una mezcla equilibrada de texto conciso y elementos visuales. Usa tarjetas, grids y layouts de columnas para romper la monotonía.
*   **Iconografía Constante:** Usa íconos SVG inline abundantemente. Asocia un ícono relevante a cada concepto, título de sección o punto importante en una lista. Busca íconos en librerías como Heroicons o Feather y póngalos como SVG inline.
*   **Diagramas y Gráficos con HTML/CSS:** Transforma activamente la información en diagramas. En lugar de una lista de pasos, crea una línea de tiempo visual. En vez de una comparación de texto, crea una tabla de dos columnas con cabeceras claras y estilos de Tailwind. Recrea cualquier diagrama de los archivos (como cadenas de valor, diagramas de flujo, etc.) usando divs, pseudo-elementos y gradientes.

**FORMATO DE SALIDA**
Debes responder en un documento HTML completo y perfectamente estructurado que pueda mostrarse directamente en un navegador. Usa secciones con títulos llamativos, tarjetas, cuadros comparativos, líneas de tiempo, infografías, listas con iconos y callouts visuales. Usa Tailwind CSS utility classes para todos los estilos.`
  .trim();

let aiClient = null;
const getClient = () => {
  if (aiClient) return aiClient;
  if (!GEMINI_API_KEY || GEMINI_API_KEY === GEMINI_API_KEY_PLACEHOLDER) {
    throw new Error(
      'Please set your Gemini API key in config.js or assign window.GEMINI_API_KEY before loading the app.',
    );
  }
  aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  return aiClient;
};

const fileToGenerativePart = (base64Data, mimeType) => {
  return {
    inlineData: {
      data: base64Data.split(',')[1],
      mimeType,
    },
  };
};

const MODEL_BY_MODE = {
  [StudyMode.Normal]: 'gemini-2.5-flash',
  [StudyMode.Pro]: 'gemini-2.5-pro',
};

export const generateStudyGuide = async (files, length, mode, language, customPrompt) => {
  const modelName = MODEL_BY_MODE[mode] || MODEL_BY_MODE[StudyMode.Normal];

  if (!Array.isArray(files) || files.length === 0) {
    throw new Error('Please upload at least one file.');
  }

  const fileParts = files.map((file) => fileToGenerativePart(file.data, file.type));

  const userPromptText = `${getCustomInstruction(customPrompt)}

${getLanguageInstruction(language)}

${getModeInstruction(mode)}

${getLengthInstruction(length)}

Based on the files provided, please generate the study guide following all instructions.`;

  const textPart = { text: userPromptText };

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      suggestedFilename: {
        type: Type.STRING,
        description:
          'A short, descriptive, file-safe name for the study guide PDF, without the .pdf extension. E.g., "History_of_Rome_Guide".',
      },
      htmlContent: {
        type: Type.STRING,
        description: 'The full HTML content for the study guide body.',
      },
    },
    required: ['suggestedFilename', 'htmlContent'],
  };

  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [textPart, ...fileParts] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema,
        ...(mode === StudyMode.Normal && { thinkingConfig: { thinkingBudget: 0 } }),
      },
    });

    try {
      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);

      if (!result.htmlContent || !result.suggestedFilename) {
        throw new Error('AI response is missing required fields.');
      }

      result.htmlContent = result.htmlContent.replace(/\s(http:|www\.w3\.org)=""/g, '');

      return result;
    } catch (parseError) {
      console.error('Error parsing AI JSON response:', parseError, 'Raw response:', response.text);
      throw new Error("Failed to parse the AI's response. The format was invalid.");
    }
  } catch (error) {
    console.error('Error generating study guide:', error);
    if (error instanceof Error && error.message.includes('Rpc failed')) {
      throw new Error(
        'A network error occurred while contacting the AI service. This can happen with very large image uploads or long guide requests. Please try again with smaller files or a shorter guide length.',
      );
    }
    throw error;
  }
};
