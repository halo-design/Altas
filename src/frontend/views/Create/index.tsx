import * as React from 'react';
import { action, observable } from 'mobx';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
const { Option } = Select;
const InputGroup = Input.Group;

import './index.scss';

class CreatehView extends React.Component<any, any> {
  @observable public projectTemplate: string = 'vue-basic';
  @observable public projectName: string = '';
  @observable public projectPath: string = '';

  @action
  public projectTypeOnChange(val: string) {
    console.log(val);
    this.projectTemplate = val;
  }

  @action
  public handleChangeProjectName(val: string) {
    this.projectName = val;
  }

  public render() {
    return (
      <div className="page-create">
        <div className="form-table">
          <div className="form-item project-type-selection">
            <div className="label">选择工程模板</div>
            <Select
              style={{ width: 360 }}
              defaultValue={this.projectTemplate}
              size="large"
              onChange={(val: string) => this.projectTypeOnChange(val)}
            >
              <Option value="vue-basic">Vue基础SPA脚手架</Option>
              <Option value="cheetah-vue-mobile">
                猎豹移动端Vue基础脚手架
              </Option>
            </Select>
          </div>
          <div className="form-item">
            <div className="label">工程创建导出</div>
            <div className="form">
              <InputGroup size="large" compact={true}>
                <Input
                  style={{ width: '40%' }}
                  placeholder="请输入工程名"
                  onChange={(val: any) => {
                    this.handleChangeProjectName(val);
                  }}
                />
                <Input
                  style={{ width: '60%' }}
                  placeholder="点击择生成目录"
                  readOnly={true}
                  value={this.projectPath}
                  suffix={<Icon type="folder" />}
                />
              </InputGroup>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreatehView;
