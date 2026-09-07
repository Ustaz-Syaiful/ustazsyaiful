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
          clonedElement.style.width = '780px';
          clonedElement.style.padding = '10px 14px';
          clonedElement.style.boxSizing = 'border-box';

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
              el.style.setProperty('border-width', '1.5px', 'important');
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
            clonedElement.style.borderRadius = '8px';
          }

          // Top Header Banner in cloned element
          const topBanner = clonedElement.querySelector<HTMLElement>(':scope > div:first-child');
          if (topBanner) {
            topBanner.style.padding = '5px 8px';
            topBanner.style.borderRadius = '6px';
            topBanner.style.marginBottom = '4px';
          }

          // Compact vertical rhythm: suppress large space-y and gaps
          clonedElement.querySelectorAll<HTMLElement>('.space-y-4, .space-y-3\\.5, .space-y-3, .space-y-2\\.5').forEach((el) => {
            Array.from(el.children).forEach((child, idx) => {
              if (idx > 0) {
                (child as HTMLElement).style.marginTop = '4px';
              }
            });
          });
          clonedElement.querySelectorAll<HTMLElement>('.space-y-1\\.5').forEach((el) => {
            Array.from(el.children).forEach((child, idx) => {
              if (idx > 0) {
                (child as HTMLElement).style.marginTop = '2px';
              }
            });
          });
          clonedElement.querySelectorAll<HTMLElement>('.gap-3\\.5, .gap-2\\.5').forEach((el) => {
            el.style.gap = '4px';
          });

          // Compact box sizing
          clonedElement.querySelectorAll<HTMLElement>('.rph-box').forEach((box) => {
            box.style.padding = '5px 7px';
            box.style.borderRadius = '5px';
            box.style.borderWidth = '1.5px';
          });

          // Box headers / labels
          clonedElement.querySelectorAll<HTMLElement>('.rph-box-header').forEach((hdr) => {
            hdr.style.fontSize = '8.5px';
            hdr.style.marginBottom = '2px';
            hdr.style.lineHeight = '1.15';
            hdr.style.fontWeight = '900';
          });

          // Headings
          clonedElement.querySelectorAll<HTMLElement>('h4').forEach((h4) => {
            h4.style.fontSize = '11.5px';
            h4.style.lineHeight = '1.2';
            h4.style.margin = '0';
            h4.style.fontWeight = '800';
          });

          // Text elements
          clonedElement.querySelectorAll<HTMLElement>('p, li, .rph-box > span:not(.rph-box-header)').forEach((el) => {
            if (!el.getAttribute('data-print-color') && !el.classList.contains('rph-box-header')) {
              el.style.color = '#0f172a';
            }
            el.style.fontSize = '10px';
            el.style.lineHeight = '1.25';
          });

          clonedElement.querySelectorAll<HTMLElement>('ul, ol').forEach((el) => {
            el.style.margin = '0';
            el.style.paddingLeft = '14px';
          });
          clonedElement.querySelectorAll<HTMLElement>('li').forEach((el) => {
            el.style.marginBottom = '1.5px';
          });

          // Jawi typography adjustment for single-page harmony
          clonedElement.querySelectorAll<HTMLElement>('.font-jawi').forEach((el) => {
            const isHeading = el.tagName.toLowerCase() === 'h4';
            el.style.fontSize = isHeading ? '12.5px' : '11px';
            el.style.lineHeight = '1.3';
          });

          // Textarea: compact and readable without overflow
          clonedElement.querySelectorAll('textarea').forEach((ta) => {
            ta.style.backgroundColor = '#ffffff';
            ta.style.color = '#0f172a';
            const border = ta.getAttribute('data-print-border') || '#cbd5e1';
            ta.style.borderColor = border;
            ta.style.borderWidth = '1.5px';
            ta.style.borderStyle = 'solid';
            ta.style.fontSize = '10px';
            ta.style.lineHeight = '1.25';
            ta.style.padding = '3px 5px';
            ta.style.minHeight = '28px';
            ta.style.maxHeight = '36px';
            ta.style.height = '32px';
            ta.style.borderRadius = '4px';
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
