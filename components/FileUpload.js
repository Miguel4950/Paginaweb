import React, { useState } from 'react';
import UploadIcon from './icons/UploadIcon.js';
import { html } from '../utils/html.js';

const FileUpload = ({ onFilesUpload, disabled, t }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const newFiles = Array.from(fileList);

    const filePromises = newFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            resolve({ data: event.target.result, type: file.type, name: file.name });
          } else {
            reject(new Error('Failed to read file.'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises)
      .then((newFileData) => {
        onFilesUpload(newFileData);
      })
      .catch(console.error);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (!disabled) {
      handleFileChange(event.dataTransfer.files);
    }
  };

  const handleInputChange = (event) => {
    handleFileChange(event.target.files);
    event.target.value = '';
  };

  return html`
    <div className="w-full h-full">
      <label
        htmlFor="dropzone-file"
        onDragEnter=${handleDragEnter}
        onDragLeave=${handleDragLeave}
        onDragOver=${handleDragOver}
        onDrop=${handleDrop}
        className=${`relative flex flex-col items-center justify-center w-full h-full min-h-[260px] border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden group ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 shadow-inner shadow-indigo-500/50'
            : 'border-slate-700 bg-slate-800/50'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-slate-500 hover:bg-slate-800'}`}
      >
        <div
          className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"
        ></div>
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
        ></div>

        <div className="relative flex flex-col items-center justify-center pt-5 pb-6 z-10">
          <${UploadIcon}
            className=${`w-12 h-12 mb-4 text-slate-500 transition-transform duration-300 ${
              isDragging ? 'scale-110' : 'group-hover:scale-110'
            }`}
          />
          <p className="mb-2 text-base text-slate-400">
            <span className="font-semibold text-indigo-400">${t('uploadPrompt')}</span>
            ${' '}
            ${t('dragDropPrompt')}
          </p>
          <p className="text-xs text-slate-500">${t('fileTypesPrompt')}</p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          multiple
          accept="image/*,application/pdf,audio/*"
          onChange=${handleInputChange}
          disabled=${disabled}
        />
      </label>
    </div>
  `;
};

export default FileUpload;
