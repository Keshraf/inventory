import * as XLSX from "xlsx";

type Props = {
  data: any;
  fileName: string;
  sheetName?: string;
};

export default function exportExcel({
  data,
  fileName,
  sheetName = "Sheet1",
}: Props) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
