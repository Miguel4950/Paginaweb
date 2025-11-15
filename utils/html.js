import React from 'react';
import htm from 'htm';

// Bind htm to React to get JSX-like tagged template literals without a build step.
export const html = htm.bind(React.createElement);
