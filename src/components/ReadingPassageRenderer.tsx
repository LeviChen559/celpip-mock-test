interface Segment {
  type: "text" | "table";
  lines: string[];
}

function parsePassage(passage: string): Segment[] {
  const lines = passage.split("\n");
  const segments: Segment[] = [];
  let current: Segment | null = null;

  for (const line of lines) {
    const isTableRow = /^\s*\|/.test(line);

    if (isTableRow) {
      if (current?.type !== "table") {
        if (current) segments.push(current);
        current = { type: "table", lines: [] };
      }
      current.lines.push(line);
    } else {
      if (current?.type !== "text") {
        if (current) segments.push(current);
        current = { type: "text", lines: [] };
      }
      current.lines.push(line);
    }
  }
  if (current) segments.push(current);
  return segments;
}

function parseTableRow(line: string): string[] {
  return line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function isSeparatorRow(line: string): boolean {
  return /^\s*\|[\s\-:|]+\|/.test(line);
}

function renderTable(lines: string[]) {
  const dataRows = lines.filter((l) => !isSeparatorRow(l));
  if (dataRows.length === 0) return null;

  const [headerRow, ...bodyRows] = dataRows;
  const headers = parseTableRow(headerRow);

  return (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-xs border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[#6b4c9a] text-white">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left font-semibold border border-[#5a3d85] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ri) => {
            const cells = parseTableRow(row);
            const isEven = ri % 2 === 0;
            return (
              <tr
                key={ri}
                className={isEven ? "bg-white" : "bg-[#faf8f5]"}
              >
                {cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-3 py-2 border border-[#e2ddd5] whitespace-nowrap ${
                      ci === 0 ? "font-medium text-[#1a1a2e]" : "text-[#444]"
                    } ${cell === "Closed" || cell === "Closed*" ? "text-red-500 font-medium" : ""}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function ReadingPassageRenderer({ passage }: { passage: string }) {
  const segments = parsePassage(passage);

  return (
    <div className="text-sm leading-relaxed">
      {segments.map((seg, i) => {
        if (seg.type === "table") {
          return <div key={i}>{renderTable(seg.lines)}</div>;
        }
        const text = seg.lines.join("\n").trim();
        if (!text) return null;
        return (
          <p key={i} className="whitespace-pre-line mb-2">
            {text}
          </p>
        );
      })}
    </div>
  );
}
