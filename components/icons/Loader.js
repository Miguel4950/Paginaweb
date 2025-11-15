import React from 'react';
import { html } from '../../utils/html.js';

const Loader = ({ className = '' }) => html`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className=${className}
  >
    <defs>
      <linearGradient id="spinner-gradient">
        <stop offset="0%" stopColor="#6366f1"></stop>
        <stop offset="100%" stopColor="#a855f7"></stop>
      </linearGradient>
    </defs>
    <path d="M12 2a10 10 0 1 0 10 10" stroke="url(#spinner-gradient)"></path>
  </svg>
`;

export default Loader;
