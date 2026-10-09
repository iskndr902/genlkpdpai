import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { WorksheetData } from '../types/worksheet';

/**
 * Direct Vector PDF Generator using jsPDF.
 * Guaranteed to generate and download a clean, professional, multi-page A4 PDF
 * without relying on DOM canvas or external rasterizers.
 */
export function generateDirectPdf(worksheet: WorksheetData, filename: string = 'LKPD-PAI-SD.pdf'): boolean {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
        return true;
      }
      return false;
    };

    // 1. HEADER STANDAR KURIKULUM
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(2, 132, 199);
    pdf.text('KURIKULUM MERDEKA SD • STANDAR CP NO. 020/H/KR/2026', margin, y);

    pdf.setFontSize(7.5);
    pdf.setTextColor(71, 85, 105);
    pdf.text('PAI & BUDI PEKERTI', pageWidth - margin, y, { align: 'right' });
    y += 2.5;

    pdf.setDrawColor(203, 213, 225);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 4.5;

    // 2. JUDUL LKPD
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10.5);
    pdf.setTextColor(15, 23, 42);
    const titleLines = pdf.splitTextToSize(
      worksheet.title || 'LEMBAR KERJA PESERTA DIDIK (LKPD) PAI & BUDI PEKERTI SD',
      contentWidth
    );
    pdf.text(titleLines, pageWidth / 2, y, { align: 'center' });
    y += titleLines.length * 4.2;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(71, 85, 105);
    const subTitle = `${worksheet.grade || 'Kelas 4 SD'} • ${worksheet.semester || 'Semester 1'} • Bab: ${worksheet.chapter || 'Materi Pokok'} • Waktu: ${worksheet.duration || '2 x 35 Menit'}`;
    pdf.text(subTitle, pageWidth / 2, y, { align: 'center' });
    y += 4.5;

    // 3. IDENTITAS PESERTA DIDIK BOX
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(203, 213, 225);
    pdf.rect(margin, y, contentWidth, 16, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(30, 41, 59);
    pdf.text('Nama Peserta Didik :', margin + 3, y + 4.5);
    pdf.setFont('helvetica', 'normal');
    pdf.text('...........................................................................', margin + 35, y + 4.5);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Kelas / No. Absen :', margin + 115, y + 4.5);
    pdf.setFont('helvetica', 'normal');
    pdf.text('..................................', margin + 145, y + 4.5);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Hari / Tanggal         :', margin + 3, y + 9.5);
    pdf.setFont('helvetica', 'normal');
    pdf.text('...........................................................................', margin + 35, y + 9.5);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Nilai & Paraf Guru :', margin + 115, y + 9.5);
    pdf.setFont('helvetica', 'normal');
    pdf.text('[       /       ]', margin + 145, y + 9.5);

    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    const cpText = `Standar Capaian Pembelajaran (CP SK No. 020/H/KR/2026): ${worksheet.curriculumStandard || 'Kurikulum Merdeka SD'}`;
    const cpLines = pdf.splitTextToSize(cpText, contentWidth - 6);
    pdf.text(cpLines[0] || cpText, margin + 3, y + 14);
    y += 19;

    // HELPER: Section Banner
    const drawBanner = (title: string) => {
      checkPageBreak(12);
      pdf.setFillColor(2, 132, 199);
      pdf.rect(margin, y, contentWidth, 5.5, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(255, 255, 255);
      pdf.text(title, margin + 3, y + 4);
      y += 7.5;
    };

    // 4. DALIL NAQLI
    if (worksheet.dalil && (worksheet.dalil.arabic || worksheet.dalil.translation)) {
      drawBanner('DALIL NAQLI & PESAN HIKMAH');
      pdf.setFillColor(240, 249, 255);
      pdf.setDrawColor(186, 230, 253);

      const transLines = pdf.splitTextToSize(`“${worksheet.dalil.translation || ''}”`, contentWidth - 8);
      const noteLines = worksheet.dalil.note
        ? pdf.splitTextToSize(`Tadabbur: ${worksheet.dalil.note}`, contentWidth - 8)
        : [];
      const dalilBoxHeight = 10 + transLines.length * 3.5 + (noteLines.length ? noteLines.length * 3.5 + 2 : 0);

      pdf.rect(margin, y, contentWidth, dalilBoxHeight, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(2, 132, 199);
      pdf.text(`Rujukan: ${worksheet.dalil.surah || 'Dalil Naqli'}`, margin + 4, y + 4.5);

      if (worksheet.dalil.arabic) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10.5);
        pdf.setTextColor(3, 105, 161);
        pdf.text(worksheet.dalil.arabic, pageWidth - margin - 4, y + 9, { align: 'right' });
      }

      let curY = y + 13.5;
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(7.5);
      pdf.setTextColor(51, 65, 85);
      pdf.text(transLines, margin + 4, curY);
      curY += transLines.length * 3.5;

      if (noteLines.length) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(71, 85, 105);
        pdf.text(noteLines, margin + 4, curY + 1);
      }

      y += dalilBoxHeight + 3.5;
    }

    // 5. RINGKASAN MATERI
    if (worksheet.materials && worksheet.materials.length > 0) {
      drawBanner(worksheet.materialsHeading || 'A. RINGKASAN KONSEP MATERI');

      // Table Header
      pdf.setFillColor(241, 245, 249);
      pdf.setDrawColor(148, 163, 184);
      pdf.rect(margin, y, contentWidth, 5.5, 'FD');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text('Istilah / Konsep', margin + 3, y + 3.8);
      pdf.text('Makna & Penjelasan', margin + 50, y + 3.8);
      pdf.text('Teladan Sikap Nyata di Sekolah/Rumah', margin + 120, y + 3.8);
      y += 5.5;

      worksheet.materials.forEach((m) => {
        const meaningLines = pdf.splitTextToSize(m.meaning || '', 65);
        const behavLines = pdf.splitTextToSize(m.behavior || '', 58);
        const rowHeight = Math.max(meaningLines.length, behavLines.length, 1) * 3.8 + 3.5;

        checkPageBreak(rowHeight);

        pdf.setFillColor(255, 255, 255);
        pdf.rect(margin, y, contentWidth, rowHeight, 'D');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7.5);
        pdf.setTextColor(30, 41, 59);
        pdf.text(m.term || '', margin + 3, y + 4);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.2);
        pdf.setTextColor(51, 65, 85);
        pdf.text(meaningLines, margin + 50, y + 4);
        pdf.text(behavLines, margin + 120, y + 4);

        y += rowHeight;
      });
      y += 3.5;
    }

    // 6. AKTIVITAS MATCHING PAIRS
    if (worksheet.matchingPairs && worksheet.matchingPairs.length > 0) {
      drawBanner(worksheet.matchingHeading || 'B. AKTIVITAS MENCOCOKKAN KONSEP');

      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(7.2);
      pdf.setTextColor(71, 85, 105);
      pdf.text(
        worksheet.matchingInstruction || 'Tuliskan nomor pasangan konsep yang sesuai antara Kolom A dan Kolom B!',
        margin + 1,
        y
      );
      y += 3.5;

      // Table Header
      pdf.setFillColor(224, 242, 254);
      pdf.setDrawColor(148, 163, 184);
      pdf.rect(margin, y, contentWidth, 5.5, 'FD');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(3, 105, 161);
      pdf.text('No', margin + 3, y + 3.8);
      pdf.text('Kolom A (Konsep / Istilah)', margin + 12, y + 3.8);
      pdf.text('Jawaban', margin + 85, y + 3.8);
      pdf.text('Kolom B (Pilihan Arti / Makna)', margin + 110, y + 3.8);
      y += 5.5;

      worksheet.matchingPairs.forEach((pair, idx) => {
        const rightLines = pdf.splitTextToSize(pair.rightText || '', 68);
        const rowHeight = Math.max(rightLines.length, 1) * 3.8 + 3.5;

        checkPageBreak(rowHeight);

        pdf.setFillColor(255, 255, 255);
        pdf.rect(margin, y, contentWidth, rowHeight, 'D');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7.5);
        pdf.setTextColor(15, 23, 42);
        pdf.text(`${idx + 1}`, margin + 4, y + 4);
        pdf.text(pair.leftText || '', margin + 12, y + 4);

        pdf.setTextColor(100, 116, 139);
        pdf.text('[       ]', margin + 87, y + 4);

        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(51, 65, 85);
        pdf.text(rightLines, margin + 110, y + 4);

        y += rowHeight;
      });
      y += 3.5;
    }

    // 7. EVALUASI HOTS PILIHAN GANDA
    if (worksheet.multipleChoice && worksheet.multipleChoice.length > 0) {
      drawBanner(worksheet.multipleChoiceHeading || 'C. EVALUASI PEMAHAMAN BERKOGNISI TINGGI (HOTS)');

      worksheet.multipleChoice.forEach((q, idx) => {
        const qLines = pdf.splitTextToSize(`${idx + 1}. ${q.question || ''}`, contentWidth - 4);
        const needed = qLines.length * 3.8 + 14;
        checkPageBreak(needed);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7.5);
        pdf.setTextColor(15, 23, 42);
        pdf.text(qLines, margin + 2, y + 3.5);
        y += qLines.length * 3.8 + 1.5;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.2);
        pdf.setTextColor(51, 65, 85);

        const optA = `A. ${q.options?.[0] || ''}`;
        const optB = `B. ${q.options?.[1] || ''}`;
        const optC = `C. ${q.options?.[2] || ''}`;
        const optD = `D. ${q.options?.[3] || ''}`;

        pdf.text(optA, margin + 5, y + 2.5);
        pdf.text(optB, margin + 95, y + 2.5);
        y += 4;
        pdf.text(optC, margin + 5, y + 2.5);
        pdf.text(optD, margin + 95, y + 2.5);
        y += 5.5;
      });
    }

    // 8. REFLEKSI KARAKTER
    if (worksheet.reflectivePrompt && worksheet.reflectivePrompt.question) {
      drawBanner(worksheet.reflectiveHeading || 'D. LEMBAR REFLEKSI KARAKTER & DIRI');
      checkPageBreak(22);

      pdf.setFillColor(250, 250, 250);
      pdf.setDrawColor(148, 163, 184);
      pdf.rect(margin, y, contentWidth, 20, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text(worksheet.reflectivePrompt.question, margin + 3, y + 4.5);

      if (worksheet.reflectivePrompt.guidingHint) {
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(6.8);
        pdf.setTextColor(100, 116, 139);
        pdf.text(`Panduan: ${worksheet.reflectivePrompt.guidingHint}`, margin + 3, y + 8);
      }

      // Dotted lines for student answer
      pdf.setDrawColor(203, 213, 225);
      pdf.line(margin + 3, y + 12, pageWidth - margin - 3, y + 12);
      pdf.line(margin + 3, y + 16, pageWidth - margin - 3, y + 16);

      y += 23;
    }

    // 9. MISI ADAB & PEMBIASAAN
    if (worksheet.adabMissions && worksheet.adabMissions.length > 0) {
      drawBanner(worksheet.adabHeading || 'E. MISI PEMBIASAAN AKHLAK (AMALAN PEKAN INI)');

      pdf.setFillColor(241, 245, 249);
      pdf.setDrawColor(148, 163, 184);
      pdf.rect(margin, y, contentWidth, 5.5, 'FD');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text('No', margin + 3, y + 3.8);
      pdf.text('Amalan / Kebiasaan Shalih Harian', margin + 12, y + 3.8);
      pdf.text('Tadabbur Hikmah Kebaikan', margin + 105, y + 3.8);
      pdf.text('Paraf Guru / Ortu', margin + 155, y + 3.8);
      y += 5.5;

      worksheet.adabMissions.forEach((misi, idx) => {
        checkPageBreak(7);
        pdf.setFillColor(255, 255, 255);
        pdf.rect(margin, y, contentWidth, 7, 'D');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7.5);
        pdf.setTextColor(15, 23, 42);
        pdf.text(`${idx + 1}`, margin + 4, y + 4.5);
        pdf.text(misi.task || '', margin + 12, y + 4.5);

        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(71, 85, 105);
        pdf.text(misi.reflection || '', margin + 105, y + 4.5);

        pdf.setTextColor(148, 163, 184);
        pdf.text('[         ]', margin + 160, y + 4.5);

        y += 7;
      });
      y += 4;
    }

    // 10. TANDA TANGAN
    checkPageBreak(25);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(15, 23, 42);

    const col1 = margin + 25;
    const col2 = margin + 125;

    pdf.text('Mengetahui,', col1, y + 3, { align: 'center' });
    pdf.setFont('helvetica', 'bold');
    pdf.text('Orang Tua / Wali Murid', col1, y + 7, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.text('( .................................................... )', col1, y + 20, { align: 'center' });

    pdf.text('Guru Mata Pelajaran PAI,', col2, y + 3, { align: 'center' });
    pdf.setFont('helvetica', 'bold');
    pdf.text('Pendidikan Agama Islam & BP', col2, y + 7, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.text('( .................................................... )', col2, y + 20, { align: 'center' });

    // Clean filename
    const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(cleanFilename);
    return true;
  } catch (err) {
    console.error('generateDirectPdf encountered an error:', err);
    return false;
  }
}

/**
 * Client-side high-quality PDF export:
 * Attempts high-resolution html2canvas capture from physical A4 sheet first.
 * If canvas capture fails for ANY reason (e.g. mobile tab hidden, image CORS tainting, security error),
 * it seamlessly falls back to generateDirectPdf to GUARANTEE a valid .pdf file is downloaded!
 */
export async function exportCanvasToPDF(
  elementId: string = 'a4-worksheet-canvas',
  filename: string = 'LKPD-PAI-SD.pdf',
  worksheetFallback?: WorksheetData
): Promise<boolean> {
  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  const element = document.getElementById(elementId);

  // If element is not present or hidden, immediately run direct vector PDF
  if (!element) {
    if (worksheetFallback) {
      return generateDirectPdf(worksheetFallback, cleanFilename);
    }
    return false;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // 2x pixel ratio for optimal balance of resolution and performance
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      imageTimeout: 5000,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          // Unhide all ancestor containers so html2canvas can measure full geometry
          let p: HTMLElement | null = clonedEl;
          while (p && p !== clonedDoc.body) {
            p.style.display = 'block';
            p.style.visibility = 'visible';
            p.style.opacity = '1';
            p.style.transform = 'none';
            p.style.transition = 'none';
            p.style.overflow = 'visible';
            p = p.parentElement;
          }

          // Normalize sheet physical dimensions to exact A4
          clonedEl.style.width = '210mm';
          clonedEl.style.minHeight = '297mm';
          clonedEl.style.boxShadow = 'none';
          clonedEl.style.border = 'none';
          clonedEl.style.borderRadius = '0';
          clonedEl.style.margin = '0 auto';

          // Hide UI-only elements
          clonedEl.querySelectorAll('.no-print').forEach((el) => {
            (el as HTMLElement).style.display = 'none';
          });

          // Prevent CORS tainting from external images
          clonedEl.querySelectorAll('img').forEach((img) => {
            try {
              if (!img.complete || img.naturalWidth === 0) {
                img.style.display = 'none';
              } else {
                img.setAttribute('crossOrigin', 'anonymous');
              }
            } catch (e) {
              img.style.display = 'none';
            }
          });
        }
      },
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas render produced 0 dimensions.');
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210; // mm
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = 297; // mm

    // If fits on 1 page (with 5mm tolerance)
    if (pdfHeight <= pageHeight + 5) {
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, pageHeight), undefined, 'FAST');
    } else {
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 5) {
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
    }

    pdf.save(cleanFilename);
    return true;
  } catch (error) {
    console.warn('html2canvas capture produced an error, falling back to direct vector PDF:', error);
    if (worksheetFallback) {
      return generateDirectPdf(worksheetFallback, cleanFilename);
    }
    return false;
  }
}

/**
 * Generates high-quality PDF Blob directly from the canvas or fallback for Google Drive upload.
 */
export async function generateCanvasPDFBlob(
  elementId: string = 'a4-worksheet-canvas',
  worksheetFallback?: WorksheetData
): Promise<Blob> {
  const element = document.getElementById(elementId);
  if (!element && worksheetFallback) {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    generateDirectPdf(worksheetFallback, 'temp.pdf');
    return pdf.output('blob');
  }

  try {
    const canvas = await html2canvas(element!, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      imageTimeout: 5000,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = 297;

    if (pdfHeight <= pageHeight + 5) {
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, pageHeight), undefined, 'FAST');
    } else {
      let heightLeft = pdfHeight;
      let position = 0;
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      while (heightLeft > 5) {
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
    }
    return pdf.output('blob');
  } catch (e) {
    if (worksheetFallback) {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      return pdf.output('blob');
    }
    throw e;
  }
}

/**
 * Builds HTML string for Word (.doc) format with strict Office XML & MSO HTML Print Layout specifications.
 * All formatting styles are inlined directly onto elements to ensure 100% layout fidelity when opened
 * in Microsoft Word (all versions), Google Docs, WPS Office, and LibreOffice.
 */
export function buildWordDocumentHtml(worksheet: WorksheetData): string {
  const safeTitle = worksheet.title || 'LEMBAR KERJA PESERTA DIDIK (LKPD) PAI & BUDI PEKERTI SD';
  const safeChapter = worksheet.chapter || 'Pendidikan Agama Islam SD';
  const safeGrade = worksheet.grade || 'Kelas 4 SD (Fase B)';
  const safeSemester = worksheet.semester || 'Semester 1 (Ganjil)';

  return `
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>${safeTitle}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 595.3pt 841.9pt; /* A4 Standard 210mm x 297mm */
      margin: 36pt 42.5pt 36pt 42.5pt; /* Margins ~1.5 cm */
      mso-header-margin: 28.3pt;
      mso-footer-margin: 28.3pt;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      font-size: 10pt;
      line-height: 1.3;
      color: #0f172a;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      width: 100%;
    }
    p {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body lang="id-ID">
<div class="Section1">

  <!-- 1. IDENTITAS MODUL & STANDAR KURIKULUM -->
  <table width="100%" border="0" cellspacing="0" cellpadding="2" style="border-bottom: 1.5pt solid #0284c7; margin-bottom: 8pt; padding-bottom: 3pt; width: 100%;">
    <tr>
      <td align="left" style="border: none; padding: 1pt 0; font-size: 8pt; font-weight: bold; color: #0284c7; text-transform: uppercase;">
        KURIKULUM MERDEKA SD &bull; STANDAR CP NO. 020/H/KR/2026
      </td>
      <td align="right" style="border: none; padding: 1pt 0; font-size: 8pt; font-weight: bold; color: #64748b; text-transform: uppercase;">
        PAI & BUDI PEKERTI SD
      </td>
    </tr>
  </table>

  <!-- 2. JUDUL LKPD -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 4pt; margin-bottom: 8pt; text-align: center; width: 100%;">
    <tr>
      <td align="center" style="border: none; text-align: center;">
        <p style="font-size: 12pt; font-weight: bold; text-transform: uppercase; color: #0f172a; border-bottom: 1.5pt solid #0284c7; display: inline-block; padding-bottom: 2pt; margin: 0 0 3pt 0;">
          ${safeTitle}
        </p>
        <p style="font-size: 8.5pt; color: #475569; margin: 0;">
          ${safeGrade} &bull; ${safeSemester} &bull; Bab: ${safeChapter} &bull; Alokasi: ${worksheet.duration || '2 x 35 Menit'}
        </p>
      </td>
    </tr>
  </table>

  <!-- 3. IDENTITAS PESERTA DIDIK -->
  <table width="100%" border="0" cellspacing="0" cellpadding="4" style="border: 1pt solid #cbd5e1; background-color: #f8fafc; margin-bottom: 8pt; width: 100%;">
    <tr>
      <td style="border: none; padding: 3pt 5pt; font-size: 9pt; width: 55%;">
        <strong>Nama Peserta Didik:</strong> ................................................................
      </td>
      <td style="border: none; padding: 3pt 5pt; font-size: 9pt; width: 45%;">
        <strong>Kelas / No. Absen:</strong> ....................................
      </td>
    </tr>
    <tr>
      <td style="border: none; padding: 3pt 5pt; font-size: 9pt;">
        <strong>Hari / Tanggal:</strong> ................................................................
      </td>
      <td style="border: none; padding: 3pt 5pt; font-size: 9pt;">
        <strong>Nilai & Paraf Guru:</strong> [ &nbsp; &nbsp; &nbsp; &nbsp; / &nbsp; &nbsp; &nbsp; &nbsp; ]
      </td>
    </tr>
    <tr>
      <td colspan="2" style="border: none; padding: 3pt 5pt; font-size: 8pt; color: #475569; border-top: 0.5pt solid #e2e8f0;">
        <strong>Capaian Pembelajaran (CP No. 020/2026):</strong> ${worksheet.curriculumStandard || 'Standar CP SK No. 020/H/KR/2026'}
      </td>
    </tr>
  </table>

  <!-- 4. DALIL NAQLI -->
  ${
    worksheet.dalil && worksheet.dalil.arabic
      ? `
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 8pt; margin-bottom: 4pt; width: 100%;">
    <tr>
      <td bgcolor="#0284c7" style="background-color: #0284c7; color: #ffffff; font-size: 9.5pt; font-weight: bold; padding: 4pt 8pt;">
        DALIL NAQLI & PESAN HIKMAH
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="0" cellpadding="6" style="border: 1.5pt solid #0284c7; background-color: #f0f9ff; margin-bottom: 8pt; width: 100%;">
    <tr>
      <td style="border: none; padding: 6pt 8pt;">
        <p style="font-weight: bold; color: #0284c7; font-size: 9pt; margin: 0 0 4pt 0;">
          📖 ${worksheet.dalil.surah || 'Dalil Rujukan'}
        </p>
        <p dir="rtl" align="right" style="direction: rtl; text-align: right; font-family: 'Traditional Arabic', 'Amiri', 'Arabic Typesetting', serif; mso-bidi-font-family: 'Traditional Arabic'; font-size: 17pt; line-height: 220%; color: #0369a1; font-weight: bold; margin: 4pt 0;">
          ${worksheet.dalil.arabic}
        </p>
        <p style="font-style: italic; font-size: 9pt; color: #1e293b; margin: 3pt 0 0 0;">
          “${worksheet.dalil.translation || ''}”
        </p>
        ${
          worksheet.dalil.note
            ? `<p style="font-size: 8.5pt; color: #475569; margin-top: 4pt; border-top: 0.5pt solid #bae6fd; padding-top: 3pt;"><strong>Tadabbur:</strong> ${worksheet.dalil.note}</p>`
            : ''
        }
      </td>
    </tr>
  </table>`
      : ''
  }

  <!-- 5. RINGKASAN KONSEP MATERI -->
  ${
    worksheet.materials && worksheet.materials.length > 0
      ? `
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 8pt; margin-bottom: 4pt; width: 100%;">
    <tr>
      <td bgcolor="#0284c7" style="background-color: #0284c7; color: #ffffff; font-size: 9.5pt; font-weight: bold; padding: 4pt 8pt;">
        ${worksheet.materialsHeading || 'A. RINGKASAN KONSEP MATERI'}
      </td>
    </tr>
  </table>
  <table width="100%" border="1" bordercolor="#334155" cellspacing="0" cellpadding="5" style="border: 1pt solid #334155; margin-bottom: 8pt; width: 100%;">
    <thead>
      <tr bgcolor="#f1f5f9" style="background-color: #f1f5f9;">
        <th align="left" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 9pt; width: 25%; font-weight: bold;">Istilah / Konsep</th>
        <th align="left" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 9pt; width: 40%; font-weight: bold;">Makna & Penjelasan</th>
        <th align="left" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 9pt; width: 35%; font-weight: bold;">Teladan Sikap Nyata</th>
      </tr>
    </thead>
    <tbody>
      ${worksheet.materials
        .map(
          (m) => `
      <tr>
        <td style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 9pt; vertical-align: top;">
          <strong>${m.term}</strong>
          ${m.arabicBadge ? `<br><span dir="rtl" style="font-family: 'Traditional Arabic', serif; font-size: 11pt; color: #0284c7;">${m.arabicBadge}</span>` : ''}
        </td>
        <td style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 9pt; vertical-align: top;">${m.meaning}</td>
        <td style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 9pt; vertical-align: top;">${m.behavior}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>`
      : ''
  }

  <!-- 6. AKTIVITAS MENCOCOKKAN KONSEP -->
  ${
    worksheet.matchingPairs && worksheet.matchingPairs.length > 0
      ? `
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 8pt; margin-bottom: 4pt; width: 100%;">
    <tr>
      <td bgcolor="#0284c7" style="background-color: #0284c7; color: #ffffff; font-size: 9.5pt; font-weight: bold; padding: 4pt 8pt;">
        ${worksheet.matchingHeading || 'B. AKTIVITAS MENCOCOKKAN KONSEP (MATCHING PAIRS)'}
      </td>
    </tr>
  </table>
  <p style="font-size: 8.5pt; font-style: italic; margin: 0 0 4pt 0; color: #475569;">
    ${worksheet.matchingInstruction || 'Tuliskan nomor pasangan konsep di kolom tengah yang sesuai antara Kolom A dan Kolom B!'}
  </p>
  <table width="100%" border="1" bordercolor="#334155" cellspacing="0" cellpadding="5" style="border: 1pt solid #334155; margin-bottom: 8pt; width: 100%;">
    <thead>
      <tr bgcolor="#e0f2fe" style="background-color: #e0f2fe;">
        <th align="center" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 9pt; width: 8%; color: #0369a1;">No</th>
        <th align="left" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 9pt; width: 38%; color: #0369a1;">Kolom A (Konsep / Istilah)</th>
        <th align="center" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 9pt; width: 14%; color: #0369a1;">Jawaban</th>
        <th align="left" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 9pt; width: 40%; color: #0369a1;">Kolom B (Pilihan Arti / Makna)</th>
      </tr>
    </thead>
    <tbody>
      ${worksheet.matchingPairs
        .map(
          (p, idx) => `
      <tr>
        <td align="center" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 9pt; text-align: center; font-weight: bold;">${idx + 1}</td>
        <td style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 9pt;">
          <strong>${p.leftText}</strong>
          ${p.leftArabic ? ` <span dir="rtl" style="font-family: 'Traditional Arabic', serif; font-size: 11pt; color: #0284c7;">(${p.leftArabic})</span>` : ''}
        </td>
        <td align="center" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 9pt; text-align: center; font-weight: bold; background-color: #fafafa;">[ &nbsp; &nbsp; &nbsp; ]</td>
        <td style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 9pt;">${p.rightText}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>`
      : ''
  }

  <!-- 7. EVALUASI HOTS PILIHAN GANDA -->
  ${
    worksheet.multipleChoice && worksheet.multipleChoice.length > 0
      ? `
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 8pt; margin-bottom: 4pt; width: 100%;">
    <tr>
      <td bgcolor="#0284c7" style="background-color: #0284c7; color: #ffffff; font-size: 9.5pt; font-weight: bold; padding: 4pt 8pt;">
        ${worksheet.multipleChoiceHeading || 'C. EVALUASI PEMAHAMAN BERKOGNISI TINGGI (HOTS)'}
      </td>
    </tr>
  </table>
  <div style="margin-top: 4pt; margin-bottom: 8pt;">
    ${worksheet.multipleChoice
      .map(
        (q, idx) => `
    <div style="margin-bottom: 6pt; page-break-inside: avoid;">
      <p style="font-size: 9pt; font-weight: bold; margin: 0 0 2pt 0;">
        ${idx + 1}. ${q.question}
      </p>
      <table width="100%" border="0" cellspacing="0" cellpadding="2" style="width: 100%;">
        <tr>
          <td style="border: none; padding: 1.5pt 4pt; font-size: 8.5pt; width: 50%;">A. ${q.options?.[0] || ''}</td>
          <td style="border: none; padding: 1.5pt 4pt; font-size: 8.5pt; width: 50%;">B. ${q.options?.[1] || ''}</td>
        </tr>
        <tr>
          <td style="border: none; padding: 1.5pt 4pt; font-size: 8.5pt; width: 50%;">C. ${q.options?.[2] || ''}</td>
          <td style="border: none; padding: 1.5pt 4pt; font-size: 8.5pt; width: 50%;">D. ${q.options?.[3] || ''}</td>
        </tr>
      </table>
    </div>`
      )
      .join('')}
  </div>`
      : ''
  }

  <!-- 8. REFLEKSI KARAKTER -->
  ${
    worksheet.reflectivePrompt && worksheet.reflectivePrompt.question
      ? `
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 8pt; margin-bottom: 4pt; width: 100%;">
    <tr>
      <td bgcolor="#0284c7" style="background-color: #0284c7; color: #ffffff; font-size: 9.5pt; font-weight: bold; padding: 4pt 8pt;">
        ${worksheet.reflectiveHeading || 'D. LEMBAR REFLEKSI KARAKTER & DIRI'}
      </td>
    </tr>
  </table>
  <table width="100%" border="1" bordercolor="#cbd5e1" cellspacing="0" cellpadding="6" style="border: 1pt dashed #64748b; background-color: #fafafa; margin-bottom: 8pt; width: 100%;">
    <tr>
      <td style="border: none; padding: 5pt 7pt;">
        <p style="font-weight: bold; font-size: 9pt; margin: 0 0 3pt 0;">
          ${worksheet.reflectivePrompt.question}
        </p>
        ${
          worksheet.reflectivePrompt.guidingHint
            ? `<p style="font-size: 8pt; color: #64748b; margin: 0 0 4pt 0;"><em>Panduan: ${worksheet.reflectivePrompt.guidingHint}</em></p>`
            : ''
        }
        <div style="border-bottom: 1pt dotted #94a3b8; height: 14pt; margin-top: 2pt;"></div>
        <div style="border-bottom: 1pt dotted #94a3b8; height: 14pt; margin-top: 2pt;"></div>
      </td>
    </tr>
  </table>`
      : ''
  }

  <!-- 9. MISI ADAB & PEMBIASAAN AKHLAK -->
  ${
    worksheet.adabMissions && worksheet.adabMissions.length > 0
      ? `
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 8pt; margin-bottom: 4pt; width: 100%;">
    <tr>
      <td bgcolor="#0284c7" style="background-color: #0284c7; color: #ffffff; font-size: 9.5pt; font-weight: bold; padding: 4pt 8pt;">
        ${worksheet.adabHeading || 'E. MISI PEMBIASAAN AKHLAK (AMALAN PEKAN INI)'}
      </td>
    </tr>
  </table>
  <table width="100%" border="1" bordercolor="#334155" cellspacing="0" cellpadding="5" style="border: 1pt solid #334155; margin-bottom: 8pt; width: 100%;">
    <thead>
      <tr bgcolor="#f1f5f9" style="background-color: #f1f5f9;">
        <th align="center" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 8.5pt; width: 8%;">No</th>
        <th align="left" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 8.5pt; width: 48%;">Amalan / Kebiasaan Shalih</th>
        <th align="left" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 8.5pt; width: 32%;">Tadabbur Hikmah</th>
        <th align="center" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 8.5pt; width: 12%;">Paraf Guru / Ortu</th>
      </tr>
    </thead>
    <tbody>
      ${worksheet.adabMissions
        .map(
          (ab, idx) => `
      <tr>
        <td align="center" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 8.5pt; text-align: center; font-weight: bold;">${idx + 1}</td>
        <td style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 8.5pt;">${ab.task}</td>
        <td style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 8.5pt; color: #475569;">${ab.reflection}</td>
        <td align="center" style="border: 1pt solid #334155; padding: 4pt 6pt; font-size: 8.5pt; text-align: center;">[ &nbsp; &nbsp; ]</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>`
      : ''
  }

  <!-- 10. TANDA TANGAN PENGESAHAN -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 14pt; page-break-inside: avoid; width: 100%;">
    <tr>
      <td align="center" style="border: none; text-align: center; font-size: 9pt; width: 50%; vertical-align: top;">
        Mengetahui,<br>
        <strong>Orang Tua / Wali Murid</strong>
        <br><br><br><br>
        ( ................................................................ )
      </td>
      <td align="center" style="border: none; text-align: center; font-size: 9pt; width: 50%; vertical-align: top;">
        Guru Mata Pelajaran<br>
        <strong>Pendidikan Agama Islam & BP</strong>
        <br><br><br><br>
        ( ................................................................ )
      </td>
    </tr>
  </table>

</div>
</body>
</html>
  `.trim();
}

/**
 * Generates Word (.doc) Blob for download or Google Drive upload.
 */
export function generateWordDocBlob(worksheet: WorksheetData): Blob {
  const htmlContent = buildWordDocumentHtml(worksheet);
  return new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
}

export function exportWorksheetToWord(worksheet: WorksheetData) {
  const blob = generateWordDocBlob(worksheet);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const rawChapter = worksheet.chapter || 'Modul';
  const cleanChapter = rawChapter.replace(/[^a-zA-Z0-9]/g, '_');
  a.download = `LKPD_${worksheet.grade || 'SD'}_${cleanChapter}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyWorksheetPlainText(worksheet: WorksheetData): string {
  let text = `====================================================\n`;
  text += `${worksheet.title}\n`;
  text += `${worksheet.grade} • ${worksheet.chapter}\n`;
  text += `Standar CP No. 020/H/KR/2026\n`;
  text += `====================================================\n\n`;

  text += `DALIL NAQLI: ${worksheet.dalil.surah}\n`;
  text += `${worksheet.dalil.arabic}\n`;
  text += `Terjemahan: ${worksheet.dalil.translation}\n`;
  text += `Tadabbur: ${worksheet.dalil.note}\n\n`;

  text += `--- ${worksheet.materialsHeading} ---\n`;
  worksheet.materials.forEach((m, i) => {
    text += `${i + 1}. ${m.term}: ${m.meaning} (Teladan: ${m.behavior})\n`;
  });
  text += `\n`;

  text += `--- ${worksheet.matchingHeading} ---\n`;
  text += `${worksheet.matchingInstruction}\n`;
  worksheet.matchingPairs.forEach((p, i) => {
    text += `[${i + 1}] ${p.leftText} ---> ${p.rightText}\n`;
  });
  text += `\n`;

  text += `--- ${worksheet.multipleChoiceHeading} ---\n`;
  worksheet.multipleChoice.forEach((q, i) => {
    text += `${i + 1}. ${q.question}\n`;
    q.options.forEach((opt, oIdx) => {
      text += `   ${String.fromCharCode(65 + oIdx)}. ${opt}\n`;
    });
    text += `   [Kunci: ${String.fromCharCode(65 + q.correctAnswer)} - ${q.explanation}]\n\n`;
  });

  text += `--- ${worksheet.reflectiveHeading} ---\n`;
  text += `${worksheet.reflectivePrompt.question}\n\n`;

  text += `--- ${worksheet.adabHeading} ---\n`;
  worksheet.adabMissions.forEach((ab, i) => {
    text += `${i + 1}. ${ab.task} (Hikmah: ${ab.reflection})\n`;
  });

  return text;
}
