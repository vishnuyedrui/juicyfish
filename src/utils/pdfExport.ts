import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Course } from '@/types/calculator';

interface PDFExportData {
  courses: Course[];
  sgpa: number;
  totalCredits: number;
  cgpa?: number;
  previousCGPA?: number;
  previousCredits?: number;
  newTotalCredits?: number;
}

export function exportResultsToPDF(data: PDFExportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(99, 102, 241); // Indigo
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Academic Grade Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, pageWidth / 2, 32, { align: 'center' });

  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  let yPos = 55;

  // Course Details Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Course Details', 14, yPos);
  yPos += 8;

  // Prepare table data
  const validCourses = data.courses.filter(c => c.finalGradePoint !== null && c.name.trim() !== '');
  const tableData = validCourses.map((course, index) => [
    (index + 1).toString(),
    course.name || `Course ${index + 1}`,
    course.credits.toString(),
    course.letterGrade || '-',
    course.finalGradePoint?.toString() || '-',
    (course.credits * (course.finalGradePoint || 0)).toFixed(0)
  ]);

  // Course table
  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Course Name', 'Credits', 'Grade', 'Grade Points', 'Credits × GP']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'left' },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'center', cellWidth: 20 },
      4: { halign: 'center', cellWidth: 25 },
      5: { halign: 'center', cellWidth: 30 }
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    }
  });

  // Get Y position after table
  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Summary Box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(14, yPos, pageWidth - 28, data.cgpa ? 70 : 50, 5, 5, 'F');
  
  yPos += 12;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Semester Summary', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 12;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // SGPA Display
  doc.setTextColor(99, 102, 241);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(data.sgpa.toFixed(2), pageWidth / 2, yPos + 5, { align: 'center' });
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('SGPA', pageWidth / 2, yPos + 14, { align: 'center' });
  
  yPos += 22;
  
  // Credits info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`Total Credits: ${data.totalCredits}`, pageWidth / 2, yPos, { align: 'center' });

  // CGPA Section (if available)
  if (data.cgpa !== undefined && data.previousCGPA !== undefined && data.previousCredits !== undefined) {
    yPos += 25;
    
    // CGPA Box
    doc.setFillColor(255, 237, 213); // Orange tint
    doc.roundedRect(14, yPos, pageWidth - 28, 65, 5, 5, 'F');
    
    yPos += 12;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Cumulative GPA Summary', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 15;
    
    // Previous CGPA and New CGPA side by side
    const leftX = pageWidth / 4;
    const rightX = (3 * pageWidth) / 4;
    
    // Previous CGPA
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(data.previousCGPA.toFixed(2), leftX, yPos, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Previous CGPA', leftX, yPos + 8, { align: 'center' });
    
    // Arrow
    doc.setFontSize(16);
    doc.text('→', pageWidth / 2, yPos, { align: 'center' });
    
    // New CGPA
    doc.setTextColor(234, 88, 12); // Orange
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(data.cgpa.toFixed(2), rightX, yPos, { align: 'center' });
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('New CGPA', rightX, yPos + 8, { align: 'center' });
    
    yPos += 20;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Total Credits Completed: ${data.newTotalCredits}`, pageWidth / 2, yPos, { align: 'center' });
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated by Academic Grade Calculator | teamdino.in', pageWidth / 2, footerY, { align: 'center' });

  // Save
  const fileName = data.cgpa 
    ? `Grade_Report_SGPA_${data.sgpa.toFixed(2)}_CGPA_${data.cgpa.toFixed(2)}.pdf`
    : `Grade_Report_SGPA_${data.sgpa.toFixed(2)}.pdf`;
  
  doc.save(fileName);
}
