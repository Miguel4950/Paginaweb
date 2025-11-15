import React from 'react';
import { html } from '../../utils/html.js';

const TimelineIcon = ({ className = '' }) => html`
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
    <path d="M3 12h18"></path>
    <path d="M7 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"></path>
    <path d="M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"></path>
    <path d="M21 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"></path>
  </svg>
`;

export default TimelineIcon;
