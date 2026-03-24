/**
 * Generate and download a PDF from table data using a print window.
 * No external dependencies required.
 */
export function downloadTableAsPdf(
  title: string,
  headers: string[],
  rows: string[][],
  meta?: { student?: string; class?: string; term?: string; session?: string }
) {
  const metaHtml = meta
    ? `<div style="margin-bottom:16px;font-size:13px;color:#333;">
        ${meta.student ? `<span><b>Student:</b> ${meta.student}</span>&nbsp;&nbsp;` : ""}
        ${meta.class ? `<span><b>Class:</b> ${meta.class}</span>&nbsp;&nbsp;` : ""}
        ${meta.term ? `<span><b>Term:</b> ${meta.term}</span>&nbsp;&nbsp;` : ""}
        ${meta.session ? `<span><b>Session:</b> ${meta.session}</span>` : ""}
       </div>`
    : "";

  const tableHtml = `
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead>
        <tr style="background:#13A541;color:#fff;">
          ${headers.map((h) => `<th style="padding:10px 14px;text-align:left;border:1px solid #ddd;">${h}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row, i) =>
              `<tr style="background:${i % 2 === 0 ? "#fff" : "#f9f9f9"};">
                ${row.map((cell) => `<td style="padding:8px 14px;border:1px solid #ddd;">${cell}</td>`).join("")}
              </tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; }
        h2 { color: #13A541; margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <h2>${title}</h2>
      ${metaHtml}
      ${tableHtml}
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
}
