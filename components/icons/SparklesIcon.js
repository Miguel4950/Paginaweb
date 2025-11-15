import React from 'react';
import { html } from '../../utils/html.js';

const SparklesIcon = ({ className = '' }) => html`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className=${className}
  >
    <path d="M12 3L9.5 8.5 4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5L12 3Z"></path>
    <path d="M5 3L6 6"></path>
    <path d="M18 18L19 21"></path>
    <path d="M3 18L6 19"></path>
    <path d="M21 5L18 6"></path>
  </svg>
`;

export default SparklesIcon;
