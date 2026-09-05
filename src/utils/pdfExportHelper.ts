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

      // Render the card to canvas with good resolution
      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
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
