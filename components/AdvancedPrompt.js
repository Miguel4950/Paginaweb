import React from 'react';
import MindMapIcon from './icons/MindMapIcon.js';
import TimelineIcon from './icons/TimelineIcon.js';
import FlashcardsIcon from './icons/FlashcardsIcon.js';
import TableIcon from './icons/TableIcon.js';
import { html } from '../utils/html.js';

const FORMAT_OPTIONS = [
  { id: 'mind_map', labelKey: 'formatMindMap', icon: MindMapIcon },
  { id: 'timeline', labelKey: 'formatTimeline', icon: TimelineIcon },
  { id: 'flashcards', labelKey: 'formatFlashcards', icon: FlashcardsIcon },
  { id: 'table', labelKey: 'formatTable', icon: TableIcon },
];

const AdvancedPrompt = ({
  customPrompt,
  onCustomPromptChange,
  isEnabled,
  onIsEnabledChange,
  selectedFormats,
  onSelectedFormatsChange,
  disabled,
  t,
}) => {
  const handleFormatClick = (formatId) => {
    if (disabled) return;
    const newSelection = selectedFormats.includes(formatId)
      ? selectedFormats.filter((id) => id !== formatId)
      : [...selectedFormats, formatId];
    onSelectedFormatsChange(newSelection);
  };

  return html`
    <div className="w-full">
      <div className="flex items-center justify-between">
        <label htmlFor="advanced-toggle" className="text-base font-medium text-slate-300 cursor-pointer">
          ${t('advancedTitle')}
        </label>
        <button
          id="advanced-toggle"
          onClick=${() => onIsEnabledChange(!isEnabled)}
          disabled=${disabled}
          role="switch"
          aria-checked=${isEnabled}
          className=${`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            isEnabled ? 'bg-indigo-600' : 'bg-slate-700'
          } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          <span
            aria-hidden="true"
            className=${`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          ></span>
        </button>
      </div>
      ${isEnabled &&
      html`
        <div className=${`mt-4 space-y-4 transition-opacity duration-300 ${isEnabled ? 'opacity-100' : 'opacity-0'}`}>
          <div>
            <label className="text-sm font-medium text-slate-400 mb-2 block">${t('formatTitle')}</label>
            <div className=${`grid grid-cols-2 gap-3 ${disabled ? 'opacity-60' : ''}`}>
              ${FORMAT_OPTIONS.map((option) => {
                const isSelected = selectedFormats.includes(option.id);
                const Icon = option.icon;
                return html`
                  <button
                    key=${option.id}
                    onClick=${() => handleFormatClick(option.id)}
                    disabled=${disabled}
                    className=${`flex items-center gap-3 p-3 text-left rounded-xl transition-all duration-300 border-2 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-800/50 border-slate-700 hover:border-indigo-500 hover:bg-slate-800'
                    } ${disabled ? 'cursor-not-allowed' : 'transform hover:-translate-y-0.5'}`}
                  >
                    <${Icon}
                      className=${`w-5 h-5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`}
                    />
                    <span className="font-semibold text-sm text-white">${t(option.labelKey)}</span>
                  </button>
                `;
              })}
            </div>
          </div>
          <div>
            <label htmlFor="custom-prompt-textarea" className="text-sm font-medium text-slate-400 mb-2 block">
              ${t('advancedTextareaTitle')}
            </label>
            <textarea
              id="custom-prompt-textarea"
              value=${customPrompt}
              onChange=${(event) => onCustomPromptChange(event.target.value)}
              disabled=${disabled}
              placeholder=${t('advancedPlaceholder')}
              className="w-full h-24 p-3 bg-slate-800/80 border-2 border-slate-700 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
              aria-label=${t('advancedTextareaTitle')}
            ></textarea>
          </div>
        </div>
      `}
    </div>
  `;
};

export default AdvancedPrompt;
