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
            clonedElement.style.setProperty('border-width', '2.5px', 'important');
            clonedElement.style.setProperty('border-style', 'solid', 'important');
          }

          // Ensure readable text contrast inside boxes
          clonedElement.querySelectorAll<HTMLElement>('.rph-box p, .rph-box li, .rph-box h4, .rph-box > span').forEach((el) => {
            if (!el.getAttribute('data-print-color') && !el.classList.contains('rph-box-header')) {
              el.style.color = '#0f172a';
            }
          });

          // Ensure textareas render content cleanly with full visibility
          clonedElement.querySelectorAll('textarea').forEach((ta) => {
            ta.style.backgroundColor = '#ffffff';
            ta.style.color = '#0f172a';
            const border = ta.getAttribute('data-print-border') || '#cbd5e1';
            ta.style.borderColor = border;
            ta.style.borderWidth = '1.5px';
            ta.style.borderStyle = 'solid';
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
