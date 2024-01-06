import React, { useEffect, useState } from 'react';
import type { Dayjs } from 'dayjs';
import { Button, CalendarProps, message } from 'antd';
import { Badge, Calendar } from 'antd';
import { HolidayUtil } from 'lunar-typescript';
import { useModal } from '@ebay/nice-modal-react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import EditComp from './components/EditComp';
import './index.less';
import { cloneDeep } from 'lodash';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CalendarPicker from './components/calendarPicker';

dayjs.locale('zh-cn');

type ContentType = {
  id: number;
  content: string;
};

type DateItemType = {
  workDate: string;
  isHoliday: boolean;
  details: ContentType[];
};

const colors = ['red', 'green', 'orange', 'cyan', 'blue', 'volcano', 'gold', 'lime'];
const Home: React.FC = () => {
  const [dataSource, setDataSource] = useState<DateItemType[]>([]);
  const editModal = useModal(EditComp);
  // 是否为节假日
  const isHoliday = (date: Dayjs) => {
    // 通过年月日获取法定节假日
    return !!HolidayUtil.getHoliday(date.get('year'), date.get('month') + 1, date.get('date'));
  };

  const isWork = (date: Dayjs) => {
    const h = HolidayUtil.getHoliday(date.get('year'), date.get('month') + 1, date.get('date'));
    return !h?.isWork();
  };

  // 新增
  const onAdd = (date: Dayjs) => {
    editModal.show({ workDate: date.format('YYYY-MM-DD') }).then((res: any) => {
      const { id, content, isHoliday, workDate } = res;
      const newDataSource = cloneDeep(dataSource);

      const targetIdx = newDataSource?.findIndex((item: any) => item.workDate === workDate);
      const isFirstAdd = targetIdx === -1;

      if (isFirstAdd) {
        setDataSource([
          ...dataSource,
          {
            workDate,
            isHoliday,
            details: [{ id, content }]
          }
        ]);
      } else {
        const cloneData = cloneDeep(newDataSource);
        const newDetails = [...(cloneDeep(newDataSource[targetIdx].details) || []), { id, content }];
        cloneData.splice(targetIdx, 1, {
          workDate,
          isHoliday,
          details: newDetails
        });
        setDataSource(cloneData);
      }
    });
  };

  // 编辑
  const onEdit = (e: any, item: DateItemType, info?: ContentType) => {
    e.stopPropagation();
    editModal.show({ workDate: item.workDate, isHoliday: item.isHoliday, detail: info }).then((res: any) => {
      const { id, content, isHoliday, workDate } = res;
      const newDataSource = cloneDeep(dataSource);

      const targetIdx = newDataSource?.findIndex((item: any) => item.workDate === workDate);
      const editItemDetailIdx = newDataSource[targetIdx].details.findIndex((item: any) => item.id === id);

      newDataSource[targetIdx].isHoliday = isHoliday;
      if (editItemDetailIdx !== -1) {
        newDataSource[targetIdx].details.splice(editItemDetailIdx, 1, {
          id,
          content
        });
      } else {
        newDataSource[targetIdx].details = [
          {
            id,
            content
          }
        ];
      }

      setDataSource(newDataSource);
    });
  };

  // 删除
  const onDel = (e: any, detail: DateItemType, info?: ContentType) => {
    e.stopPropagation();
    const newDataSource = cloneDeep(dataSource);

    const targetIdx = newDataSource?.findIndex((item: any) => item.workDate === detail.workDate);
    const editItemDetailIdx = newDataSource[targetIdx].details.findIndex((item: any) => item.id === info?.id);

    newDataSource[targetIdx].details.splice(editItemDetailIdx, 1);

    setDataSource(newDataSource);
  };

  // 保存数据到本地
  const onSave = () => {
    try {
      localStorage.setItem('word_record', JSON.stringify(dataSource));
      message.success('本地保存成功！');
    } catch (err) {
      console.log('err', err);
      message.warning('保存失败，请注意备份此次数据！');
    }
  };

  // 获取不可不编辑的日期
  const getDisabledDay = (date: Dayjs): boolean => {
    // 周末，但是去除周末需要上班的
    const weeklyDisabled = (date.day() === 0 || date.day() === 6) && isWork(date);
    // 周内，但是需要调休的
    const inWeekDisabled = isHoliday(date) && isWork(date);
    return weeklyDisabled || inWeekDisabled;
  };

  const dateCellRender = (value: Dayjs, item: DateItemType) => {
    if (item.isHoliday) {
      return (
        <div className='date-cell' onClick={e => onEdit(e, item)}>
          <div className='isSelfHoliday'>假</div>
        </div>
      );
    } else {
      const { details } = item;
      return (
        <div className='date-cell' onClick={() => onAdd(value)}>
          <ul className='content-wrap'>
            {details?.map((info, index) => (
              <li key={info.id} className='content-item'>
                <Badge color={colors[index % 8]} text={info.content} />
                <div className='content-options'>
                  <EditOutlined className='content-icon' onClick={e => onEdit(e, item, info)} />
                  <DeleteOutlined className='content-icon' onClick={e => onDel(e, item, info)} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = current => {
    // 通过年月日获取法定节假日
    const h = HolidayUtil.getHoliday(current.get('year'), current.get('month') + 1, current.get('date'));
    // 关联日节日是否等于日期，是的话显示节日的名称，否则返回空
    const displayHoliday = h?.getTarget() === h?.getDay() ? h?.getName() : undefined;
    // 获取调休日
    const isRest = !h?.isWork();
    const isHoliday = !!h;
    if (isHoliday && isRest) {
      return (
        <div className='date-cell'>
          <div className='holiday-wrap'>
            <div className='holiday-mark'>休</div>
            <div className='holiday-name'>{displayHoliday}</div>
          </div>
        </div>
      );
    }
    for (const item of dataSource) {
      if (current.format('YYYY-MM-DD') === item.workDate) {
        return dateCellRender(current, item);
      }
    }
    return <div className='date-cell' onClick={() => onAdd(current)}></div>;
  };

  const headerRender = ({ value, _, onChange }: any) => {
    return (
      <div className='topView'>
        <div style={{ marginRight: 16 }}>
          <Button type='primary' onClick={onSave}>
            保存
          </Button>
        </div>
        <div className='rightView'>
          <CalendarPicker value={value} picker='month' onChange={onChange} />
        </div>
      </div>
    );
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('word_record') || '[]');
    setDataSource(data);
  }, []);

  return (
    <div className='date-picker'>
      <Calendar
        headerRender={headerRender}
        cellRender={cellRender}
        disabledDate={currentDate => getDisabledDay(currentDate)}
        // onSelect={onAdd}
      />
    </div>
  );
};

export default Home;
