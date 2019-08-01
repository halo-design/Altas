import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Input from 'antd/lib/input';
import Switch from 'antd/lib/switch';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import message from 'antd/lib/message';
import Tooltip from 'antd/lib/tooltip';
const { TextArea } = Input;

const mockerCreate = Form.create({ name: 'mocker' });

const stringifyObject = require('stringify-object');

message.config({
  top: 50,
});

@inject((stores: any) => {
  const { mockData, autoSave } = stores.monitor;
  return {
    mockData,
    autoSave,
    setAutoSave: (state: boolean) => stores.monitor.setAutoSave(state),
    setMockData: (config: object) => stores.monitor.setMockData(config),
    resetMockData: () => stores.monitor.resetMockData(),
  };
})
@observer
class MockerView extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      edited: false,
    };
  }

  public handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      const data = {};
      const settings = {};
      let hasError = false;

      Object.keys(values).forEach((key: string) => {
        if (key !== 'autoSave') {
          const val = values[key].replace(/[\r\n]/g, '').replace(/\ +/g, '');
          try {
            data[key] = eval(`() => (${val})`)();
          } catch (err) {
            if (err) {
              hasError = true;
              message.error('请正确填写"' + key + '"参数！');
            }
          }
        } else {
          settings[key] = values[key];
        }
      });

      if (!hasError) {
        const params = { data, settings };
        this.props.setMockData(params);
        console.log(params);
      }
    });
  };

  public render() {
    const { form, mockData, autoSave, resetMockData } = this.props;
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

    return (
      <div className="app-mocker">
        <div className="mock-list">
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            {dataKeys.map((key: string, index: number) => (
              <Form.Item label={key} key={index}>
                {getFieldDecorator(key, {
                  initialValue: stringifyObject(dataSource[key], {
                    indent: '  ',
                  }),
                })(
                  <TextArea
                    onChange={() => {
                      this.setState({ edited: true });
                    }}
                    autosize={{ minRows: 3, maxRows: 20 }}
                  />
                )}
              </Form.Item>
            ))}
            <Form.Item label="自动缓存应用调试数据">
              {getFieldDecorator('autoSave', {
                initialValue: autoSave,
                valuePropName: 'checked',
              })(
                <Switch
                  onChange={() => {
                    this.setState({ edited: true });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                block={true}
                disabled={!this.state.edited}
              >
                保存配置修改
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Tooltip placement="right" title="重置参数配置">
          <i
            className="iconfont reset-btn"
            onClick={() => {
              resetMockData();
            }}
          >
            &#xe651;
          </i>
        </Tooltip>
      </div>
    );
  }
}

export default mockerCreate(MockerView);
