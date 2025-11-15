import React from 'react';
import { html } from '../../utils/html.js';

const FlashcardsIcon = ({ className = '' }) => html`
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
    <path d="m12.83 2.18-1.66 0L2.6 6.08a2 2 0 0 0 0 3.84l8.53 3.84a2 2 0 0 0 1.74 0l8.53-3.84a2 2 0 0 0 0-3.84Z"></path>
    <path d="m22 17.65-8.53 3.84a2 2 0 0 1-1.74 0L3.2 17.65"></path>
    <path d="m22 12.65-8.53 3.84a2 2 0 0 1-1.74 0L3.2 12.65"></path>
  </svg>
`;

export default FlashcardsIcon;
