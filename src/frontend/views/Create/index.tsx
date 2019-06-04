import * as React from 'react';
import { action, observable } from 'mobx';
import { selectFile } from '../../utils/file';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
const { Option } = Select;
const InputGroup = Input.Group;
const nameReg = /^[0-9a-zA-Z_-]{1,}$/;

import './index.scss';

class CreatehView extends React.Component<any, any> {
  @observable public projectScaffold: string = 'vue-basic';
  @observable public projectName: string = '';
  @observable public projectPath: string = '';
  @observable public projectTemplate: string = 'vue-empty';

  @action
  public projectTypeOnChange(val: string) {
    this.projectScaffold = val;
  }

  @action
  public projectTemplateOnChange(val: string) {
    this.projectTemplate = val;
  }

  @action
  public handleChangeProjectName(val: string) {
    this.projectName = val;
  }

  @action
  public handleSelectDir(el: HTMLInputElement) {
    selectFile(
      {
        message: '选择工程导出目录',
        properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
      },
      (res: string[] | undefined) => {
        if (res) {
          this.projectPath = res[0];
          el.value = res[0];
        }
      }
    );
  }

  @action
  public createProjectHandle() {
    if (!nameReg.test(this.projectName)) {
      message.error('请输入正确的工程名(大小写字母、数字、下划线、横线)！');
    } else if (!this.projectPath) {
      message.error('请选择生成目录！');
    } else {
      const params = {
        projectName: this.projectName,
        projectPath: this.projectPath,
        projectScaffold: this.projectScaffold,
        projectTemplate: this.projectTemplate,
      };
      console.log(params);
    }
  }

  public render() {
    return (
      <div className="sub-page-create">
        <div className="form-table">
          <div className="form-item project-type-selection">
            <div className="label">选择脚手架</div>
            <Select
              style={{ width: 360 }}
              defaultValue={this.projectScaffold}
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
                  style={{ width: '34%' }}
                  placeholder="请输入工程名"
                  onChange={(e: any) => {
                    this.handleChangeProjectName(e.target.value);
                  }}
                />
                <Input
                  style={{ width: '66%' }}
                  placeholder="点击选择生成目录"
                  readOnly={true}
                  defaultValue={this.projectPath}
                  onClick={(e: any) => {
                    this.handleSelectDir(e.target);
                  }}
                  suffix={<Icon type="folder" />}
                />
              </InputGroup>
            </div>
          </div>
          <div className="form-item project-type-selection">
            <div className="label">选择模板</div>
            <Select
              style={{ width: 360 }}
              defaultValue={this.projectTemplate}
              size="large"
              onChange={(val: string) => this.projectTemplateOnChange(val)}
            >
              <Option value="vue-empty">空模板</Option>
              <Option value="vue-hzbank">杭银直销业务模板</Option>
              <Option value="vue-tlbank">泰隆手机银行业务模板</Option>
              <Option value="vue-gfbank">广发信用卡App业务模板</Option>
            </Select>
          </div>
          <div
            className="btn-large create-btn"
            onClick={() => {
              this.createProjectHandle();
            }}
          >
            创建工程
          </div>
        </div>
      </div>
    );
  }
}

export default CreatehView;
