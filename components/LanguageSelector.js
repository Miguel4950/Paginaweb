import React from 'react';
import { Language } from '../types.js';
import { html } from '../utils/html.js';

const LanguageSelector = ({ selectedLanguage, onLanguageChange, disabled, title }) => {
  const languages = Object.values(Language);

  return html`
    <div className="w-full">
      <label className="text-base font-medium text-slate-300 mb-2 block">${title}</label>
      <div
        className=${`flex flex-wrap items-center justify-start gap-2 p-2 bg-slate-800/50 border-2 border-slate-700 rounded-xl ${
          disabled ? 'opacity-60' : ''
        }`}
      >
        ${languages.map(
          (language) => html`
            <button
              key=${language}
              onClick=${() => onLanguageChange(language)}
              disabled=${disabled}
              className=${`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 ${
                selectedLanguage === language
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-700'
              } ${disabled ? 'cursor-not-allowed' : ''}`}
            >
              ${language}
            </button>
          `,
        )}
      </div>
    </div>
  `;
};

export default LanguageSelector;
