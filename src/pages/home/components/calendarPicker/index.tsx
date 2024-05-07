import { Col, DatePicker, Row, Select } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import dayLocaleData from 'dayjs/plugin/localeData'
import './index.less'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

dayjs.extend(dayLocaleData)

interface CalendarPickerProps {
  value: Dayjs
  onChange: any
  picker: string
}
const CalendarPicker = (props: CalendarPickerProps) => {
  const { value, onChange, picker } = props
  const start = 0
  const end = 12
  const monthOptions = []

  const current = value.clone()
  const localeData = value?.localeData()
  const months = []
  for (let i = 0; i < 12; i++) {
    current.month(i)
    months.push(localeData.monthsShort(current))
  }

  for (let index = start; index < end; index++) {
    monthOptions.push(
      <Select.Option className="month-item" key={`${index}`} value={index}>
        {months[index]}
      </Select.Option>
    )
  }

  const getFormat = () => {
    let formatStr = 'YYYY年MM月DD日'
    if (picker === 'week') {
      formatStr = 'YYYY年WW周'
    } else if (picker === 'month') {
      formatStr = 'YYYY年MM月'
    }
    return formatStr
  }

  return (
    <Row className="calendarPicker">
      <Col>
        <div className="yearPicker">
          <div
            className="yearPickerLeft"
            onClick={() => {
              let type: any = 'day'
              if (picker === 'week') {
                type = 'week'
              } else if (picker === 'month') {
                type = 'month'
              }
              const newValue = value.subtract(1, type).clone()
              onChange(newValue)
            }}
            style={{ marginRight: -1 }}
          >
            <LeftOutlined />
          </div>
          <DatePicker
            allowClear={false}
            picker={picker as any}
            suffixIcon={null}
            style={{ width: '115px', height: '32px' }}
            size="middle"
            format={getFormat()}
            className="my-year-select"
            onChange={newDate => {
              onChange(newDate)
            }}
            value={value}
          />
          {/* {options} */}
          <div
            className="yearPickerRight"
            onClick={() => {
              let type: any = 'day'
              if (picker === 'week') {
                type = 'week'
              } else if (picker === 'month') {
                type = 'month'
              }
              const newValue = value.add(1, type).clone()
              onChange(newValue)
            }}
            style={{ marginLeft: -1 }}
          >
            <RightOutlined />
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default CalendarPicker
