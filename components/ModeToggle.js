import React from 'react';
import { StudyMode } from '../types.js';
import { html } from '../utils/html.js';

const ModeToggle = ({ mode, onModeChange, disabled, t }) => {
  return html`
    <div className="w-full">
      <label className="text-base font-medium text-slate-300">${t('modeTitle')}</label>
      <div className=${`grid grid-cols-2 gap-3 mt-2 ${disabled ? 'opacity-60' : ''}`}>
        <button
          onClick=${() => onModeChange(StudyMode.Normal)}
          disabled=${disabled}
          className=${`relative group p-4 text-center rounded-xl transition-all duration-300 border-2 ${
            mode === StudyMode.Normal
              ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20'
              : 'bg-slate-800/50 border-slate-700 hover:border-indigo-500 hover:bg-slate-800'
          } ${disabled ? 'cursor-not-allowed' : 'transform hover:-translate-y-1'}`}
        >
          <span className="font-semibold text-white">Normal</span>
          <p className="text-xs text-slate-400 mt-1">Fast & Concise</p>
        </button>
        <button
          onClick=${() => onModeChange(StudyMode.Pro)}
          disabled=${disabled}
          className=${`relative group p-4 text-center rounded-xl transition-all duration-300 border-2 ${
            mode === StudyMode.Pro
              ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20'
              : 'bg-slate-800/50 border-slate-700 hover:border-purple-500 hover:bg-slate-800'
          } ${disabled ? 'cursor-not-allowed' : 'transform hover:-translate-y-1'}`}
        >
          <span
            className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white text-[10px] font-bold rounded-full transform group-hover:scale-110 transition-transform"
          >
            PRO
          </span>
          <span className="font-semibold text-white">Pro</span>
          <p className="text-xs text-slate-400 mt-1">Deep & Creative</p>
        </button>
      </div>
    </div>
  `;
};

export default ModeToggle;
