import { useCallback } from 'react';
import { utils, writeFile } from 'xlsx';
import dayjs from 'dayjs';

const useExcel = () => {
  const exportExcel = useCallback((data: any[], fileName = '工作日历') => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
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
