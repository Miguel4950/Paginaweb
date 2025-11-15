import React, { useState, useCallback } from 'react';
import { GuideLength, StudyMode, Language } from './types.js';
import { generateStudyGuide } from './services/geminiService.js';
import FileUpload from './components/FileUpload.js';
import LengthSelector from './components/LengthSelector.js';
import ModeToggle from './components/ModeToggle.js';
import StudyGuideDisplay from './components/StudyGuideDisplay.js';
import SparklesIcon from './components/icons/SparklesIcon.js';
import LanguageSelector from './components/LanguageSelector.js';
import { translations } from './translations.js';
import Loader from './components/icons/Loader.js';
import CloseIcon from './components/icons/CloseIcon.js';
import PdfFileIcon from './components/icons/PdfFileIcon.js';
import AudioFileIcon from './components/icons/AudioFileIcon.js';
import AdvancedPrompt from './components/AdvancedPrompt.js';
import { html } from './utils/html.js';

export const ADVANCED_FORMATS = [
  {
    id: 'mind_map',
    prompt:
      'Structure a significant portion of the content as a detailed mind map. Use nested HTML lists or divs to represent the hierarchy of central topics, main branches, and sub-branches. Use icons and colors to differentiate topics.',
  },
  {
    id: 'timeline',
    prompt:
      'If the content contains chronological information or a sequence of steps, create a visual timeline. Represent each point in time or step with a clear heading, a date/period (if applicable), and a concise description within a styled container.',
  },
  {
    id: 'flashcards',
    prompt:
      'Generate a section with flashcards for key terms, concepts, or questions. Each flashcard should be a distinct visual block with a "front" (the term/question) and a "back" (the definition/answer). Style them to look like physical cards.',
  },
  {
    id: 'table',
    prompt:
      'When the content involves comparing and contrasting items, or presenting structured data, organize this information into a well-designed comparison table. The table must have clear, styled headers and readable rows.',
  },
];

const getFilePreview = (file) => {
  if (file.type.startsWith('image/')) {
    return html`<img src=${file.data} alt=${file.name} className="w-full h-full object-cover" />`;
  }
  if (file.type === 'application/pdf') {
    return html`
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-900/50 p-2 text-center">
        <${PdfFileIcon} className="w-10 h-10 text-indigo-400 shrink-0" />
        <span className="text-xs text-slate-300 mt-2 break-all line-clamp-3">${file.name}</span>
      </div>
    `;
  }
  if (file.type.startsWith('audio/')) {
    return html`
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-900/50 p-2 text-center">
        <${AudioFileIcon} className="w-10 h-10 text-purple-400 shrink-0" />
        <span className="text-xs text-slate-300 mt-2 break-all line-clamp-3">${file.name}</span>
      </div>
    `;
  }
  return null;
};

const App = () => {
  const [length, setLength] = useState(GuideLength.Medium);
  const [mode, setMode] = useState(StudyMode.Normal);
  const [language, setLanguage] = useState(Language.English);
  const [files, setFiles] = useState([]);
  const [studyGuideResult, setStudyGuideResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdvancedPromptEnabled, setIsAdvancedPromptEnabled] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedFormats, setSelectedFormats] = useState([]);

  const t = (key) => translations[key]?.[language] || key;

  const handleFilesUpload = (uploadedFiles) => {
    setFiles((prevFiles) => {
      const newFiles = uploadedFiles.filter((uf) => !prevFiles.some((pf) => pf.name === uf.name));
      return [...prevFiles, ...newFiles];
    });
    setStudyGuideResult(null);
    setError(null);
  };

  const handleFileDelete = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleGenerateClick = useCallback(async () => {
    if (files.length === 0) {
      setError(t('uploadError'));
      return;
    }
    setError(null);
    setIsLoading(true);
    setStudyGuideResult(null);

    try {
      let finalCustomPrompt = '';
      if (isAdvancedPromptEnabled) {
        const formatInstructions = ADVANCED_FORMATS.filter((f) => selectedFormats.includes(f.id))
          .map((f) => f.prompt)
          .join('\n');

        const parts = [];
        if (formatInstructions) {
          parts.push(`Prioritize generating content using the following formats:\n${formatInstructions}`);
        }
        if (customPrompt.trim()) {
          parts.push(`Additionally, follow these user-specific instructions:\n${customPrompt.trim()}`);
        }
        finalCustomPrompt = parts.join('\n\n');
      }

      const result = await generateStudyGuide(files, length, mode, language, finalCustomPrompt);
      setStudyGuideResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [files, length, mode, language, isAdvancedPromptEnabled, customPrompt, selectedFormats]);

  return html`
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 sm:p-6 lg:p-8 aurora-background">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10 md:mb-12 relative">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 -z-10">
            <div className="mx-auto max-w-lg h-32 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-400">
            ${t('mainTitle')}
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-slate-400">
            ${t('mainSubtitle')}
          </p>
        </header>

        <main className="flex flex-col items-center gap-8">
          <div
            className="w-full max-w-6xl p-6 sm:p-8 bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-slate-800 control-panel-background"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <${LengthSelector} selectedLength=${length} onLengthChange=${setLength} disabled=${isLoading} t=${t} />
                <${ModeToggle} mode=${mode} onModeChange=${setMode} disabled=${isLoading} t=${t} />
                <${LanguageSelector}
                  selectedLanguage=${language}
                  onLanguageChange=${setLanguage}
                  disabled=${isLoading}
                  title=${t('languageTitle')}
                />
                <div className="border-t border-slate-800 pt-6 mt-2">
                  <${AdvancedPrompt}
                    customPrompt=${customPrompt}
                    onCustomPromptChange=${setCustomPrompt}
                    isEnabled=${isAdvancedPromptEnabled}
                    onIsEnabledChange=${setIsAdvancedPromptEnabled}
                    selectedFormats=${selectedFormats}
                    onSelectedFormatsChange=${setSelectedFormats}
                    disabled=${isLoading}
                    t=${t}
                  />
                </div>
              </div>
              <div className="lg:col-span-3">
                <${FileUpload} onFilesUpload=${handleFilesUpload} disabled=${isLoading} t=${t} />
              </div>
            </div>
          </div>

          ${files.length > 0 &&
          !isLoading &&
          !studyGuideResult &&
          html`
            <div
              className="w-full max-w-6xl p-6 sm:p-8 bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-slate-800 control-panel-background"
            >
              <div>
                <h3 className="text-base font-semibold text-slate-300 mb-4">${t('previewsTitle')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  ${files.map(
                    (file) => html`
                      <div
                        key=${file.name}
                        className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-700/80 shadow-lg bg-black/20 backdrop-blur-sm transition-all duration-300 hover:border-slate-600 hover:scale-105"
                      >
                        ${getFilePreview(file)}
                        ${!isLoading &&
                        html`
                          <button
                            onClick=${() => handleFileDelete(file.name)}
                            className="absolute top-1.5 right-1.5 bg-slate-900/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600/80 hover:scale-110"
                            aria-label=${`Remove ${file.name}`}
                          >
                            <${CloseIcon} className="w-4 h-4" />
                          </button>
                        `}
                      </div>
                    `,
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center">
                <button
                  onClick=${handleGenerateClick}
                  disabled=${isLoading || files.length === 0}
                  className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 text-lg font-bold text-white bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-black/20 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20"
                >
                  <span
                    className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  ></span>
                  <${SparklesIcon} className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" />
                  <span>${t('generateButton')}</span>
                </button>
              </div>
            </div>
          `}

          ${isLoading &&
          html`
            <div className="text-center p-8">
              <div className="flex justify-center items-center">
                <${Loader} className="w-12 h-12 animate-spin text-indigo-400" />
              </div>
              <p className="mt-4 text-lg text-slate-300">${t('generatingText')}</p>
              <p className="text-sm text-slate-500">${t('generatingSubtext')}</p>
            </div>
          `}

          ${error &&
          html`
            <div
              className="w-full max-w-4xl p-4 mt-4 text-center bg-red-900/50 border border-red-700 rounded-lg"
              role="alert"
            >
              <p className="font-bold text-red-300">${t('errorTitle')}</p>
              <p className="text-red-400">${error}</p>
            </div>
          `}

          ${studyGuideResult &&
          !isLoading &&
          html`
            <div className="w-full">
              <${StudyGuideDisplay}
                htmlContent=${studyGuideResult.htmlContent}
                suggestedFilename=${studyGuideResult.suggestedFilename}
                language=${language}
              />
            </div>
          `}
        </main>
      </div>
    </div>
  `;
};

export default App;
