/**
 * Print a specific DOM element as a PDF using the browser's print dialog.
 * Temporarily hides everything else on the page.
 */
export function printReportCard(elementId: string) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  // Clone all stylesheets
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((s) => s.outerHTML)
    .join("\n");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Report Card</title>
      ${styles}
      <style>
        @media print {
          body { margin: 0; padding: 16px; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        body { background: white; }
      </style>
    </head>
    <body>
      ${el.innerHTML}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
}
