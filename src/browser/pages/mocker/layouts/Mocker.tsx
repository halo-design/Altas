import * as React from 'react';
import { inject, observer } from 'mobx-react';
import Input from 'antd/lib/input';
import Switch from 'antd/lib/switch';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import message from 'antd/lib/message';
import Tooltip from 'antd/lib/tooltip';
import Modal from 'antd/lib/modal';
import Icon from 'antd/lib/icon';
import CreateContextMenu from '../../../main/bridge/modules/CreateContextMenu';
import { numAndLetter } from '../../../main/constants/Reg';
const { TextArea } = Input;
const { confirm } = Modal;

const mockerCreate = Form.create({ name: 'mocker' });

const stringifyObject = require('stringify-object');

message.config({
  top: 50,
});

@inject((stores: any) => {
  const { filterMockData, autoSave } = stores.monitor;
  return {
    filterMockData,
    autoSave,
    delMockDataItemByName: (name: string) =>
      stores.monitor.delMockDataItemByName(name),
    mockDataFilterHandle: (keyword: string) =>
      stores.monitor.mockDataFilterHandle(keyword),
    getMockData: () => stores.monitor.getMockData(),
    setAutoSave: (state: boolean) => stores.monitor.setAutoSave(state),
    setMockData: (data: any, settings: any) =>
      stores.monitor.setMockData(data, settings),
    addNewMockDataItem: (name: string, params: any) =>
      stores.monitor.addNewMockDataItem(name, params),
    resetMockData: () => stores.monitor.resetMockData(),
  };
})
@observer
class MockerView extends React.Component<any, any> {
  public eventList: any = [];
  public filterTimer: any = null;

  constructor(props: any) {
    super(props);
    this.state = {
      edited: false,
      addItemModalVisible: false,
      addItemName: '',
      addItemParams: stringifyObject(
        {
          error: '0',
          errorMessage: 'success',
        },
        {
          indent: '  ',
        }
      ),
      searchKeywords: '',
    };
  }

  public resetModal() {
    this.setState({
      addItemModalVisible: false,
      addItemName: '',
      addItemParams: '',
    });
  }

  public initEvent(dom: any, name: string, index: number) {
    const itemEvent = new CreateContextMenu(dom, [
      {
        click: () => {
          confirm({
            title: '删除参数',
            content: `确定删除参数“${name}”？`,
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
              this.setState({ edited: true });
              this.props.delMockDataItemByName(name);
              message.success('删除成功！');
            },
            onCancel: () => void 0,
          });
        },
        label: '删除该条参数',
      },
    ]);
    if (this.eventList[index]) {
      this.eventList[index].unbind();
    }
    this.eventList[index] = itemEvent;
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
        this.props.setMockData(data, settings);
        this.setState({ searchKeywords: '' });
        console.log(data, settings);
      }
    });
  };

  public componentWillUnmount() {
    this.props.getMockData();
    this.eventList.forEach((ev: any) => {
      ev.unbind();
    });
  }

  public addNewItem() {
    const { addItemName, addItemParams } = this.state;
    if (!numAndLetter.test(addItemName)) {
      message.error('请输入正确的API名称！');
    } else {
      try {
        const params = eval(`() => (${addItemParams})`)();
        if (Object.keys(params).length > 0) {
          this.props.addNewMockDataItem(addItemName, params);
          this.setState({ edited: true, searchKeywords: '' });
          this.resetModal();
          message.success('添加成功！');
        } else {
          message.error('请输入正确API参数格式和内容！');
        }
      } catch (err) {
        if (err) {
          message.error('请正确填写"' + addItemName + '"参数内容！');
        }
      }
    }
  }

  public filterHandle(e: any) {
    const val = e.target.value;

    this.setState({
      searchKeywords: val,
    });

    this.filterTimer && clearTimeout(this.filterTimer);
    this.filterTimer = setTimeout(() => {
      this.props.mockDataFilterHandle(val);
      clearTimeout(this.filterTimer);
    }, 300);
  }

  public render() {
    const { form, filterMockData, autoSave, resetMockData } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
      },
    };

    const dataSource = filterMockData || {};
    const dataKeys = Object.keys(dataSource);

    return (
      <div className="app-mocker">
        <div className="search-bar">
          <Input
            placeholder="输入关键字搜索接口"
            value={this.state.searchKeywords}
            onChange={(e: any) => {
              this.filterHandle(e);
            }}
          />
        </div>
        <div className="mock-list">
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            {dataKeys.map((key: string, index: number) => (
              <div
                key={index}
                className="form-item-wrapper"
                ref={(node: any) => {
                  this.initEvent(node, key, index);
                }}
              >
                <Form.Item label={key}>
                  {getFieldDecorator(key, {
                    initialValue: stringifyObject(dataSource[key], {
                      indent: '  ',
                    }),
                  })(
                    <TextArea
                      onChange={() => {
                        this.setState({ edited: true });
                      }}
                      autoSize={{ minRows: 3, maxRows: 20 }}
                    />
                  )}
                </Form.Item>
              </div>
            ))}
            {dataKeys.length === 0 && <div className="nofound" />}
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
            <Form.Item
              wrapperCol={{ span: 12, offset: 6 }}
              style={{ textAlign: 'center' }}
            >
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  this.setState({ addItemModalVisible: true });
                }}
              >
                增加配置项
              </Button>
              <Button
                type="danger"
                size="large"
                htmlType="submit"
                // block={true}
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
        <Modal
          className="add-mock-data-params-modal"
          title="添加参数"
          visible={this.state.addItemModalVisible}
          okText="保存"
          cancelText="取消"
          onOk={() => {
            this.addNewItem();
          }}
          onCancel={() => {
            this.resetModal();
          }}
        >
          <Input
            size="large"
            placeholder="新增API名称（仅支持数字和英文大小写）"
            addonBefore={<Icon type="profile" />}
            value={this.state.addItemName}
            onChange={(e: any) => {
              this.setState({ addItemName: e.target.value });
            }}
          />
          <div className="data-wrapper">
            <TextArea
              placeholder="新增API详细参数（JSON数组）"
              value={this.state.addItemParams}
              onChange={(e: any) => {
                this.setState({ addItemParams: e.target.value });
              }}
              autoSize={{ minRows: 3, maxRows: 10 }}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default mockerCreate(MockerView);
