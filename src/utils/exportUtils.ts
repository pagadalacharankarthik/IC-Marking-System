import { ICInspection } from '@/types/auth';

export const generateCSV = (data: ICInspection[], filename: string) => {
  const headers = [
    'ID',
    'Worker Name',
    'Worker Email',
    'Batch Number',
    'IC Text',
    'Status',
    'Confidence',
    'Timestamp',
    'Notes',
    'Reviewed By',
    'Review Action',
    'Review Comments'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(item => [
      item.id,
      `"${item.workerName}"`,
      item.workerEmail,
      item.batchNumber,
      `"${item.extractedText}"`,
      item.status,
      item.confidence,
      item.timestamp.toISOString(),
      `"${item.notes || ''}"`,
      `"${item.supervisorReview?.reviewedBy || ''}"`,
      item.supervisorReview?.action || '',
      `"${item.supervisorReview?.comments || ''}"`
    ].join(','))
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
};

export const generatePDF = (data: ICInspection[], filename: string) => {
  // Create a simple PDF-like text content
  let pdfContent = `IC MARKING INSPECTION REPORT\n`;
  pdfContent += `Generated: ${new Date().toLocaleDateString()}\n`;
  pdfContent += `Total Records: ${data.length}\n\n`;
  
  data.forEach((item, index) => {
    pdfContent += `Record ${index + 1}:\n`;
    pdfContent += `  IC: ${item.extractedText}\n`;
    pdfContent += `  Status: ${item.status.toUpperCase()}\n`;
    pdfContent += `  Confidence: ${item.confidence}%\n`;
    pdfContent += `  Worker: ${item.workerName}\n`;
    pdfContent += `  Batch: ${item.batchNumber}\n`;
    pdfContent += `  Date: ${item.timestamp.toLocaleDateString()}\n`;
    if (item.notes) pdfContent += `  Notes: ${item.notes}\n`;
    if (item.supervisorReview) {
      pdfContent += `  Review: ${item.supervisorReview.action} by ${item.supervisorReview.reviewedBy}\n`;
    }
    pdfContent += '\n';
  });

  downloadFile(pdfContent, filename, 'text/plain');
};

export const generateExcel = (data: ICInspection[], filename: string) => {
  // Create tab-separated values for Excel compatibility
  const headers = [
    'ID', 'Worker Name', 'Worker Email', 'Batch Number', 'IC Text', 
    'Status', 'Confidence', 'Timestamp', 'Notes', 'Reviewed By', 
    'Review Action', 'Review Comments'
  ];

  const excelContent = [
    headers.join('\t'),
    ...data.map(item => [
      item.id,
      item.workerName,
      item.workerEmail,
      item.batchNumber,
      item.extractedText,
      item.status,
      item.confidence,
      item.timestamp.toISOString(),
      item.notes || '',
      item.supervisorReview?.reviewedBy || '',
      item.supervisorReview?.action || '',
      item.supervisorReview?.comments || ''
    ].join('\t'))
  ].join('\n');

  downloadFile(excelContent, filename, 'application/vnd.ms-excel');
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};