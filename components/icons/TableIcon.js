import React from 'react';
import { html } from '../../utils/html.js';

const TableIcon = ({ className = '' }) => html`
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
    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
    <path d="M3 12h18"></path>
    <path d="M12 3v18"></path>
  </svg>
`;

export default TableIcon;
