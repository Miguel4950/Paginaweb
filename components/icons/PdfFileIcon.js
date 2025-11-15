import React from 'react';
import { html } from '../../utils/html.js';

const PdfFileIcon = ({ className = '' }) => html`
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <path d="M9.5 14.5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1z"></path>
    <path d="M16 12.5h-1.5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H16"></path>
    <path d="M14.5 17H13v-2.5"></path>
  </svg>
`;

export default PdfFileIcon;
