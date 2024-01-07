import { useCallback } from 'react';
import { utils, writeFile } from 'xlsx';
import dayjs from 'dayjs';

const useExcel = () => {
  const exportExcel = useCallback((data: any[], fileName = '工作日历') => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    console.log('worksheet', worksheet, worksheet['!ref']!.split(':')[0].charCodeAt(0));
    // 假设 ws 是你的工作表

    // for(let )
    for (let R = worksheet['!ref']!.split(':')[0].charCodeAt(0); R <= worksheet['!ref']!.split(':')[1].charCodeAt(0); ++R) {
      const cell_address = { c: 2, r: R - 49 }; // 假设 c 列是第3列（即字母C，所以数字索引为2）
      const cell_ref = utils.encode_cell(cell_address);

      // 检查单元格是否存在且包含换行符
      if (worksheet[cell_ref] && typeof worksheet[cell_ref].w === 'string' && worksheet[cell_ref].w.includes('\n')) {
        // 设置自动换行样式
        if (!worksheet[cell_ref].s) worksheet[cell_ref].s = {};
        worksheet[cell_ref].s.wrapText = true;
      }
    }

    console.log('worksheet2', worksheet);

    utils.book_append_sheet(workbook, worksheet, fileName);

    utils.sheet_add_aoa(worksheet, [['工作日', '是否休假', '事项']], { origin: 'A1' });

    const max_width = data.reduce((w, r) => Math.max(w, r.details.length), 20);
    worksheet['!cols'] = [{ wch: max_width }];

    const today = dayjs().format('YYYY-MM-DD HH:mm:ss');

    writeFile(workbook, `${fileName}-${today}.xlsx`, { compression: true });
  }, []);

  return { exportExcel };
};

export default useExcel;
