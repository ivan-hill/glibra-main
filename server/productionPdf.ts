function pdfEscape(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, "?");
}

function wrapLine(value: string, max = 92) {
  const words = value.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? current + " " + word : word;
    if (candidate.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function documentLines(text: string) {
  const out: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const cleaned = raw
      .replace(/^#{1,6}\s*/, "")
      .replace(/\*\*/g, "")
      .replace(/^\s*[-*]\s+/, "• ");
    if (!cleaned.trim()) {
      out.push("");
      continue;
    }
    out.push(...wrapLine(cleaned));
  }
  return out;
}

export function createTextPdf(title: string, text: string): Buffer {
  const lines = documentLines(text);
  const perPage = 48;
  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += perPage) pages.push(lines.slice(i, i + perPage));
  if (!pages.length) pages.push([""]);

  const objects: string[] = [];
  const add = (content: string) => {
    objects.push(content);
    return objects.length;
  };

  const fontId = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const boldFontId = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const pagesId = objects.length + 1;
  objects.push(""); // placeholder Pages object
  const pageIds: number[] = [];

  for (const pageLines of pages) {
    const ops: string[] = [
      "BT",
      "/F2 15 Tf",
      "54 750 Td",
      "(" + pdfEscape(title) + ") Tj",
      "/F1 10 Tf",
      "0 -24 Td",
    ];
    pageLines.forEach((line, index) => {
      if (index > 0) ops.push("0 -14 Td");
      ops.push("(" + pdfEscape(line) + ") Tj");
    });
    ops.push("ET");
    const stream = ops.join("\n");
    const contentId = add("<< /Length " + Buffer.byteLength(stream, "latin1") + " >>\nstream\n" + stream + "\nendstream");
    const pageId = add(
      "<< /Type /Page /Parent " + pagesId + " 0 R /MediaBox [0 0 612 792] " +
      "/Resources << /Font << /F1 " + fontId + " 0 R /F2 " + boldFontId + " 0 R >> >> " +
      "/Contents " + contentId + " 0 R >>"
    );
    pageIds.push(pageId);
  }

  objects[pagesId - 1] =
    "<< /Type /Pages /Kids [" + pageIds.map(id => id + " 0 R").join(" ") +
    "] /Count " + pageIds.length + " >>";

  const catalogId = add("<< /Type /Catalog /Pages " + pagesId + " 0 R >>");

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  objects.forEach((obj, index) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += (index + 1) + " 0 obj\n" + obj + "\nendobj\n";
  });

  const xref = Buffer.byteLength(pdf, "latin1");
  pdf += "xref\n0 " + (objects.length + 1) + "\n";
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  pdf += "trailer\n<< /Size " + (objects.length + 1) + " /Root " + catalogId + " 0 R >>\n";
  pdf += "startxref\n" + xref + "\n%%EOF\n";
  return Buffer.from(pdf, "latin1");
}
