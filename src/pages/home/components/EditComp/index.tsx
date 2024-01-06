import NiceModal, { antdModal, useModal } from '@ebay/nice-modal-react';
import { Modal, Input, Form, Radio, Row, Col } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { FC, useEffect } from 'react';

type ContentType = {
  id?: number;
  content: string;
};

type DateItemType = {
  workDate: string;
  isHoliday: boolean;
  detail: ContentType;
};

const EditComp: FC<any> = ({ workDate, isHoliday, detail }: DateItemType) => {
  const { id, content } = detail || {};
  const modal = useModal();
  const [form] = Form.useForm();

  const onOk = () => {
    form.submit();
  };

  const onFinish = (values: any) => {
    modal.resolve({ ...values, id: id || uuidv4(), workDate });
    modal.hide();
  };

  useEffect(() => {
    form.setFieldsValue({ content: content, isHoliday });
  }, [content]);

  return (
    <Modal
      {...antdModal(modal)}
      onOk={onOk}
      title={
        <div style={{ display: 'flex', alignItems: 'center  ' }}>
          <div>{id ? '编辑' : '新增'}</div>
          <div style={{ fontSize: 14, color: '#999', marginLeft: 8, fontWeight: 400 }}>{workDate}</div>
        </div>
      }
      bodyStyle={{
        paddingTop: 16
      }}
    >
      <Form form={form} onFinish={onFinish} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Row>
          {!id ? (
            <Col span={24}>
              <Form.Item name='isHoliday' label='是否休假' initialValue={false}>
                <Radio.Group>
                  <Radio value={true}> 是 </Radio>
                  <Radio value={false}> 否 </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          ) : null}
        </Row>
        <Col span={24}>
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.isHoliday !== currentValues.isHoliday}>
            {({ getFieldValue }) =>
              !getFieldValue('isHoliday') ? (
                <Form.Item name='content' label='内容' rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  );
};

export default NiceModal.create(EditComp);
