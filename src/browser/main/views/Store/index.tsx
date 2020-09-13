import * as React from 'react';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Route, Switch, NavLink, Redirect } from 'react-router-dom';
import Demo from './Demo';
import Plugins from './Plugins';
import Example from './Example';
import Tools from './Tools';
import Tooltip from 'antd/lib/tooltip';
import Drawer from 'antd/lib/drawer';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';

const { Option } = Select;
const InputGroup = Input.Group;
const Search = Input.Search;

import './index.scss';

@inject((stores: any) => {
  return {
    setMonitorVisible: (state: boolean) =>
      stores.workBench.setMonitorVisible(state),
  };
})
@observer
class StoreView extends React.Component<any, any> {
  @observable public uploadDrawerVisible: boolean = false;
  @observable public projectType: string = '';
  @observable public authorName: string = '佚名';
  @observable public teamName: string = '易诚互动';

  @action
  public handleUploadDrawerVisible(state: boolean): void {
    this.uploadDrawerVisible = state;
  }

  @action
  public handleChangeAuthorName(val: string): void {
    this.authorName = val;
  }

  @action
  public handleChangeTeamName(val: string): void {
    this.teamName = val;
  }

  public componentDidMount() {
    this.props.setMonitorVisible(false);
  }

  public componentWillUnmount() {
    this.props.setMonitorVisible(true);
  }

  @action
  public projectTypeOnChange(val: any) {
    this.projectType = val;
  }

  public render() {
    return (
      <div className="page-store">
        <div className="app-switch-wrap-fixed">
          <div className="app-switch">
            <NavLink
              exact={true}
              to="/store/plugins"
              className="item-btn"
              activeClassName="active"
            >
              插件
            </NavLink>
            <NavLink
              exact={true}
              to="/store/example"
              className="item-btn"
              activeClassName="active"
            >
              案例
            </NavLink>
            <NavLink
              exact={true}
              to="/store/demo"
              className="item-btn"
              activeClassName="active"
            >
              演示
            </NavLink>
            <NavLink
              exact={true}
              to="/store/tools"
              className="item-btn"
              activeClassName="active"
            >
              工具
            </NavLink>
          </div>
          <div className="search-filter-input">
            <Search
              style={{ width: 200 }}
              placeholder="请输入搜索关键字"
              onSearch={value => console.log(value)}
            />
          </div>
        </div>
        <Switch>
          <Route path="/store/plugins" component={Plugins} />
          <Route path="/store/example" component={Example} />
          <Route path="/store/demo" component={Demo} />
          <Route path="/store/tools" component={Tools} />
          <Route
            path="/store"
            component={() => <Redirect to="/store/plugins" />}
          />
        </Switch>
        <Tooltip placement="top" title="我要贡献">
          <i
            className="iconfont i-want-contribute"
            onClick={() => {
              this.handleUploadDrawerVisible(true);
            }}
          >
            &#xe950;
          </i>
        </Tooltip>
        <Drawer
          title="贡献组件/工具"
          placement="right"
          closable={true}
          width={420}
          onClose={() => {
            this.handleUploadDrawerVisible(false);
          }}
          visible={this.uploadDrawerVisible}
        >
          <div className="form-table drawer-upload">
            <div className="form-item project-type-selection">
              <div className="label require">上传类别</div>
              <Select
                style={{ width: '100%' }}
                size="large"
                placeholder="请选择上传类别"
                onChange={(val: string) => this.projectTypeOnChange(val)}
              >
                <Option value="plugin">插件</Option>
                <Option value="ui-lib">案例</Option>
                <Option value="demo">演示demo</Option>
                <Option value="tools">工具</Option>
              </Select>
            </div>
            <div className="form-item">
              <div className="label require">创作者信息</div>
              <div className="form-item-row">
                <InputGroup size="large" compact={true}>
                  <Input
                    style={{ width: '34%' }}
                    placeholder="姓名"
                    onChange={(e: any) => {
                      this.handleChangeAuthorName(e.target.value);
                    }}
                    suffix={<Icon type="idcard" />}
                  />
                  <Input
                    style={{ width: '66%' }}
                    placeholder="所属部门"
                    onChange={(e: any) => {
                      this.handleChangeTeamName(e.target.value);
                    }}
                    suffix={<Icon type="team" />}
                  />
                </InputGroup>
              </div>
            </div>
            <div className="form-item">
              <div className="label require">上传资源</div>
              <Input
                size="large"
                style={{ width: '100%' }}
                placeholder="请选择上传资源（zip压缩包形式）"
                readOnly={true}
                suffix={<Icon type="file-zip" />}
              />
            </div>
            <div className="form-item">
              <div className="label">上传封面</div>
              <Input
                size="large"
                style={{ width: '100%' }}
                placeholder="请选择封面图片（尺寸：480*320）"
                readOnly={true}
                suffix={<Icon type="file-image" />}
              />
            </div>
            <div className="form-item">
              <div className="label">预览地址</div>
              <Input
                size="large"
                style={{ width: '100%' }}
                placeholder="请输入预览地址"
                suffix={<Icon type="global" />}
              />
            </div>
            <div className="btn-large create-btn">上传项目</div>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default StoreView;
