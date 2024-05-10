import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ReactNode } from "react";
import { useCalcOffset } from "../hooks/useCalcOffset";

type ColProps<T extends object> = {
  id: keyof T;
  title: string;
  template?: (row: T) => ReactNode;
};

type Props<T extends { id: string }> = {
  cols: readonly ColProps<T>[];
  rows: T[];
  onClickRow?: (row: T, index: number) => void;
};

export const DataTable = <T extends { id: string }>({
  cols,
  rows,
  onClickRow,
}: Props<T>) => {
  const { ref, offset } = useCalcOffset<HTMLTableSectionElement>();

  return (
    <TableContainer
      ref={ref}
      sx={{
        overflowY: "scroll",
        width: "100%",
        height: `calc(100vh - ${offset}px)`,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {cols.map((col) => (
              <TableCell key={col.id as string}>{col.title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": { background: "#f5f5f5" },
                cursor: "pointer",
              }}
              onClick={() => onClickRow?.(row, index)}
            >
              {cols.map((col) => {
                const id = col.id;
                const value = row[id];
                const templateFn = col.template;
                if (templateFn && typeof templateFn === "function") {
                  return (
                    <TableCell key={id as string}>{templateFn(row)}</TableCell>
                  );
                }
                return (
                  <TableCell key={id as string}>{value as ReactNode}</TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
