import React from 'react';
import { html } from '../../utils/html.js';

const AudioFileIcon = ({ className = '' }) => html`
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
    <path d="M12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path>
    <path d="M12 19v-4"></path>
    <path d="M8 12H4"></path>
    <path d="M16 12h4"></path>
    <path d="M10.5 10.5l-3-3"></path>
    <path d="M13.5 13.5l3 3"></path>
  </svg>
`;

export default AudioFileIcon;
