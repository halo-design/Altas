import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Input from 'antd/lib/input';
import Switch from 'antd/lib/switch';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
const { TextArea } = Input;

const mockerCreate = Form.create({ name: 'mocker' });

const stringifyObject = require('stringify-object');

@inject((stores: any) => {
  const { mockerVisible, mockData, autoSave } = stores.monitor;
  return {
    mockerVisible,
    mockData,
    autoSave,
    setAutoSave: (state: boolean) => stores.monitor.setAutoSave(state),
  };
})
@observer
class MockerView extends React.Component<any> {
  public handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: object) => {
      console.log(values);
    });
  };

  public render() {
    const { form, mockerVisible, mockData, autoSave } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
      },
    };

    const dataSource = mockData || {};
    const dataKeys = Object.keys(dataSource);

    return mockerVisible ? (
      <div className="app-mocker">
        <div className="mock-list">
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            {dataKeys.map((key: string, index: number) => (
              <Form.Item label={key} key={index}>
                {getFieldDecorator(key, {
                  initialValue: stringifyObject(dataSource[key], {
                    indent: '  ',
                  }),
                })(<TextArea autosize={{ minRows: 3, maxRows: 20 }} />)}
              </Form.Item>
            ))}
            <Form.Item label="自动缓存应用数据">
              {getFieldDecorator('autoSave', {
                initialValue: autoSave,
                valuePropName: 'checked',
              })(<Switch />)}
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                block={true}
              >
                更新配置
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    ) : (
      ''
    );
  }
}

export default mockerCreate(MockerView);
