import React, { useCallback, useEffect, useRef, useState } from 'react';
import PdfIcon from './icons/PdfIcon.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { translations } from '../translations.js';
import Loader from './icons/Loader.js';
import { html } from '../utils/html.js';

const StudyGuideDisplay = ({ htmlContent, suggestedFilename, language }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfButtonText, setPdfButtonText] = useState('');
  const [pdfFilename, setPdfFilename] = useState(suggestedFilename);
  const printRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  const t = (key) => translations[key]?.[language] || key;

  useEffect(() => {
    setPdfButtonText(t('downloadPdf'));
    setIsMounted(true);
  }, [language]);

  useEffect(() => {
    setPdfFilename(suggestedFilename);
  }, [suggestedFilename]);

  const downloadPdf = useCallback(async () => {
    if (isGeneratingPdf || !printRef.current) {
      return;
    }

    const contentToPrint = printRef.current;

    setIsGeneratingPdf(true);
    setPdfButtonText(t('generatingPdf'));

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 50));

      const canvas = await html2canvas(contentToPrint, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#020617',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const ratio = pdfWidth / canvasWidth;
      const canvasImgHeight = canvasHeight * ratio;

      let heightLeft = canvasImgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, canvasImgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, canvasImgHeight);
        heightLeft -= pdfHeight;
      }

      const sanitizedFilename = pdfFilename.replace(/[^a-z0-9_-\s]/gi, '_').replace(/\s+/g, '_');
      pdf.save(`${sanitizedFilename || 'AI_Study_Guide'}.pdf`);
      setPdfButtonText(t('pdfSuccess'));
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfButtonText(t('pdfError'));
    } finally {
      setIsGeneratingPdf(false);
      setTimeout(() => {
        setPdfButtonText(t('downloadPdf'));
      }, 2000);
    }
  }, [isGeneratingPdf, language, pdfFilename]);

  return html`
    <div className=${`relative w-full mt-8 transition-opacity duration-1000 ${
      isMounted ? 'opacity-100' : 'opacity-0'
    }`}>
      <div id="content-to-print" ref=${printRef} className="bg-slate-950">
        <div dangerouslySetInnerHTML=${{ __html: htmlContent }}></div>
      </div>

      ${htmlContent &&
      html`
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
          <div className="flex items-center bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full shadow-lg shadow-black/30 overflow-hidden">
            <input
              type="text"
              value=${pdfFilename}
              onChange=${(event) => setPdfFilename(event.target.value)}
              disabled=${isGeneratingPdf}
              placeholder=${t('filenamePlaceholder')}
              className="bg-transparent py-3 pl-5 w-40 sm:w-56 text-sm text-white placeholder-slate-400 focus:outline-none ring-0 border-0"
              aria-label=${t('filenameAriaLabel')}
            />
            <button
              id="download-btn"
              onClick=${downloadPdf}
              disabled=${isGeneratingPdf}
              className="group flex-shrink-0 flex items-center gap-2 py-3 px-4 text-sm font-bold text-white bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-slate-600 disabled:to-slate-700 transition-all duration-300"
            >
              ${isGeneratingPdf
                ? html`<${Loader} className="w-5 h-5 animate-spin" />`
                : html`<${PdfIcon} className="w-5 h-5" />`}
              <span className="hidden sm:inline-block">${pdfButtonText}</span>
            </button>
          </div>
        </div>
      `}
    </div>
  `;
};

export default StudyGuideDisplay;
