import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface PdfExportProgress {
  current: number;
  total: number;
  status: string;
}

/**
 * Exports elements with data-printable-card attribute into a multi-page A4 PDF document
 */
export async function exportWeeklyRphToPdf(
  containerId: string,
  filename: string = 'e-RPH_Minggu_SK_Merbau_Pulas.pdf',
  onProgress?: (progress: PdfExportProgress) => void
): Promise<boolean> {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('PDF Container not found:', containerId);
    window.print();
    return false;
  }

  // Find all individual printable RPH cards
  const cards = container.querySelectorAll<HTMLElement>('[data-printable-card="true"]');
  if (!cards || cards.length === 0) {
    console.warn('No printable cards found, falling back to window.print');
    window.print();
    return false;
  }

  try {
    // Standard A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const maxContentHeight = pageHeight - margin * 2;

    const totalCards = cards.length;

    for (let i = 0; i < totalCards; i++) {
      const card = cards[i];

      if (onProgress) {
        onProgress({
          current: i + 1,
          total: totalCards,
          status: `Menjana Muka Surat ${i + 1} daripada ${totalCards}...`
        });
      }

      // Render the card to canvas with good resolution and vibrant cheerful print colors
      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (_clonedDoc, clonedElement) => {
          // Reset main card to crisp white background and clear text
          clonedElement.style.backgroundColor = '#ffffff';
          clonedElement.style.color = '#0f172a';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.width = '794px';
          clonedElement.style.padding = '18px 22px';
          clonedElement.style.boxSizing = 'border-box';
          clonedElement.style.display = 'flex';
          clonedElement.style.flexDirection = 'column';
          clonedElement.style.justifyContent = 'space-between';

          // Hide on-screen only elements (buttons, selectors, controls)
          clonedElement.querySelectorAll('.print\\:hidden, .no-print, [data-no-print="true"]').forEach((el) => {
            (el as HTMLElement).style.display = 'none';
          });

          // Show print-only elements
          clonedElement.querySelectorAll('.print\\:block, .print\\:flex').forEach((el) => {
            (el as HTMLElement).style.display = 'block';
          });

          // Apply cheerful themed background and border colors to content boxes
          clonedElement.querySelectorAll<HTMLElement>('[data-print-bg]').forEach((el) => {
            const bg = el.getAttribute('data-print-bg');
            if (bg) {
              el.style.setProperty('background-color', bg, 'important');
            }
          });
          clonedElement.querySelectorAll<HTMLElement>('[data-print-border]').forEach((el) => {
            const border = el.getAttribute('data-print-border');
            if (border) {
              el.style.setProperty('border-color', border, 'important');
              el.style.setProperty('border-width', '2px', 'important');
              el.style.setProperty('border-style', 'solid', 'important');
            }
          });
          clonedElement.querySelectorAll<HTMLElement>('[data-print-color]').forEach((el) => {
            const color = el.getAttribute('data-print-color');
            if (color) {
              el.style.setProperty('color', color, 'important');
            }
          });

          // Ensure card outer boundary has distinct theme border
          const cardBorder = clonedElement.getAttribute('data-print-border');
          if (cardBorder) {
            clonedElement.style.setProperty('border-color', cardBorder, 'important');
            clonedElement.style.setProperty('border-width', '2px', 'important');
            clonedElement.style.setProperty('border-style', 'solid', 'important');
            clonedElement.style.borderRadius = '10px';
          }

          // Natural vertical rhythm to fill page comfortably
          clonedElement.querySelectorAll<HTMLElement>('.space-y-4, .space-y-3\\.5, .space-y-3, .space-y-2\\.5').forEach((el) => {
            Array.from(el.children).forEach((child, idx) => {
              if (idx > 0) {
                (child as HTMLElement).style.marginTop = '8px';
              }
            });
          });
          clonedElement.querySelectorAll<HTMLElement>('.space-y-2').forEach((el) => {
            Array.from(el.children).forEach((child, idx) => {
              if (idx > 0) {
                (child as HTMLElement).style.marginTop = '6px';
              }
            });
          });
          clonedElement.querySelectorAll<HTMLElement>('.space-y-1\\.5').forEach((el) => {
            Array.from(el.children).forEach((child, idx) => {
              if (idx > 0) {
                (child as HTMLElement).style.marginTop = '4px';
              }
            });
          });
          clonedElement.querySelectorAll<HTMLElement>('.gap-3, .gap-2\\.5').forEach((el) => {
            el.style.gap = '8px';
          });

          // Comfortable box sizing
          clonedElement.querySelectorAll<HTMLElement>('.rph-box').forEach((box) => {
            box.style.padding = '8px 12px';
            box.style.borderRadius = '8px';
            box.style.borderWidth = '2px';
          });

          // Box headers / labels
          clonedElement.querySelectorAll<HTMLElement>('.rph-box-header').forEach((hdr) => {
            hdr.style.fontSize = '10.5px';
            hdr.style.marginBottom = '3px';
            hdr.style.lineHeight = '1.2';
            hdr.style.fontWeight = '900';
          });

          // Lesson Topic Heading
          clonedElement.querySelectorAll<HTMLElement>('h3').forEach((h3) => {
            h3.style.fontSize = '16.5px';
            h3.style.lineHeight = '1.3';
            h3.style.margin = '0';
            h3.style.fontWeight = '900';
            h3.style.color = '#0f172a';
          });

          // Metadata text
          clonedElement.querySelectorAll<HTMLElement>('.rph-box > span:not(.rph-box-header)').forEach((el) => {
            el.style.fontSize = '12px';
            el.style.lineHeight = '1.3';
            el.style.fontWeight = '700';
          });

          // Text elements
          clonedElement.querySelectorAll<HTMLElement>('p, li').forEach((el) => {
            if (!el.getAttribute('data-print-color') && !el.classList.contains('rph-box-header')) {
              el.style.color = '#0f172a';
            }
            el.style.fontSize = '11.5px';
            el.style.lineHeight = '1.35';
          });

          clonedElement.querySelectorAll<HTMLElement>('ul, ol').forEach((el) => {
            el.style.margin = '0';
            el.style.paddingLeft = '16px';
          });
          clonedElement.querySelectorAll<HTMLElement>('li').forEach((el) => {
            el.style.marginBottom = '2px';
          });

          // Jawi typography adjustment for single-page harmony
          clonedElement.querySelectorAll<HTMLElement>('.font-jawi').forEach((el) => {
            const isHeading = el.tagName.toLowerCase() === 'h3';
            el.style.fontSize = isHeading ? '18px' : '13.5px';
            el.style.lineHeight = '1.4';
          });

          // Reflection print text: ensure all lines and words are fully visible
          clonedElement.querySelectorAll<HTMLElement>('textarea').forEach((ta) => {
            ta.style.display = 'none';
          });
          clonedElement.querySelectorAll<HTMLElement>('.reflection-print-content, [data-reflection-print="true"]').forEach((el) => {
            el.style.display = 'block';
            el.style.whiteSpace = 'pre-wrap';
            el.style.wordBreak = 'break-word';
            el.style.color = '#0f172a';
            const isJawi = el.classList.contains('font-jawi') || el.getAttribute('dir') === 'rtl';
            el.style.fontSize = isJawi ? '13.5px' : '11.5px';
            el.style.lineHeight = isJawi ? '1.45' : '1.35';
            el.style.padding = '0';
            el.style.margin = '0';
          });
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Calculate aspect ratio
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Fit within page if too tall
      const finalHeight = imgHeight > maxContentHeight ? maxContentHeight : imgHeight;
      const finalWidth = imgHeight > maxContentHeight ? (canvas.width * finalHeight) / canvas.height : imgWidth;
      const posX = margin + (contentWidth - finalWidth) / 2;
      const posY = margin;

      pdf.addImage(imgData, 'JPEG', posX, posY, finalWidth, finalHeight, undefined, 'FAST');
    }

    if (onProgress) {
      onProgress({
        current: totalCards,
        total: totalCards,
        status: 'Memuat turun fail PDF...'
      });
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF with jsPDF/html2canvas, falling back to browser print:', error);
    window.print();
    return false;
  }
}
