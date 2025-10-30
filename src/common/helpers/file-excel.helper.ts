export const cloneRows = async (worksheet, sourceRowNum, targetRowNum) => {
  const sourceRow = worksheet.getRow(sourceRowNum);
  const newRow = worksheet.insertRow(targetRowNum);
  sourceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    const newCell = newRow.getCell(colNumber);
    if (cell.style) {
      newCell.style = { ...cell.style };
    }
  });
  newRow.height = sourceRow.height;
};
