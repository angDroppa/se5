// app/components/table.tsx
"use client";

type Column<T> = {
  header: string;
  render: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  maxHeight?: string;
};

export default function Table<T>({ data, columns, keyExtractor, onRowClick, maxHeight }: TableProps<T>) {
  return (
    <div className="overflow-x-auto w-full" style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              className={onRowClick ? "cursor-pointer hover" : ""}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.header}>{col.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}