import React from 'react';
import { GuideLength } from '../types.js';
import { html } from '../utils/html.js';

const LengthSelector = ({ selectedLength, onLengthChange, disabled, t }) => {
  const lengths = Object.values(GuideLength);

  return html`
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-base font-medium text-slate-300">${t('lengthTitle')}</label>
        <p className="text-xs text-slate-500">${t('lengthSubtitle')}</p>
      </div>
      <div className=${`grid grid-cols-2 md:grid-cols-2 gap-3 ${disabled ? 'opacity-60' : ''}`}>
        ${lengths.map(
          (length) => html`
            <button
              key=${length}
              onClick=${() => onLengthChange(length)}
              disabled=${disabled}
              className=${`group p-4 text-center rounded-xl transition-all duration-300 border-2 ${
                selectedLength === length
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-800/50 border-slate-700 hover:border-indigo-500 hover:bg-slate-800'
              } ${disabled ? 'cursor-not-allowed' : 'transform hover:-translate-y-1'}`}
            >
              <span className="font-semibold text-white">${t(`length${length.replace(' ', '')}`)}</span>
              <span
                className=${`block text-xs mt-1 ${
                  selectedLength === length ? 'text-indigo-300' : 'text-slate-400'
                }`}
              >
                ${t(`lengthDesc${length.replace(' ', '')}`)}
              </span>
            </button>
          `,
        )}
      </div>
    </div>
  `;
};

export default LengthSelector;
