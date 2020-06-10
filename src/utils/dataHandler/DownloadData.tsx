import * as FileSaver from "file-saver";
import React from "react";
import Button from "src/Components/UI/Button/Button";
import * as XLSX from "xlsx";

export const DownloadData = (csvData: any, fileName: any, type: string) => {
  const formatData = (csvData: any) => {
    const data = [] as any[];
    data[0] = [] as any[];
    csvData.forEach((da: any, index: number) => {
      if (index === 0) {
        data[0].push("Timestamp");
        da.x.forEach((val: any) =>
          data[0].push(new Date(val).getTime().toFixed(4))
        );
      }
      data[index + 1] = [] as any[];
      data[index + 1].push(da.name);
      da.y.forEach((val: any) => data[index + 1].push(val));
    });
    const newTry = data[0].map((col: any, i: number) =>
      data.map((row) => row[i])
    );
    return newTry;
  };

  const exportToCSV = (csvData: any, fileName: string, type: any) => {
    const formatted = formatData(csvData);
    const ws = XLSX.utils.aoa_to_sheet(formatted);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, {
      bookType: type,
      type: "array",
      cellDates: true,
    });
    const data = new Blob([excelBuffer], { type: type });
    FileSaver.saveAs(data, fileName);
  };

  return (
    <Button
      onClick={(e) =>
        exportToCSV(
          csvData.csvData,
          csvData.fileName + "." + csvData.type,
          csvData.type
        )
      }
    >
      Export {csvData.type}
    </Button>
  );
};
