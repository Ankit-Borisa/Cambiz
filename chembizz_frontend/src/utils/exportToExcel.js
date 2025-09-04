import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data); // convert JSON to sheet
  const workbook = XLSX.utils.book_new(); // create workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1'); // add worksheet

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const dataBlob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(dataBlob, `${fileName}.xlsx`);
};
