import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { action, observable } from 'mobx';
// import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
// import message from 'antd/lib/message';
// import Switch from 'antd/lib/switch';
import { selectFile } from '../../utils/file';
// const { Option } = Select;
// const InputGroup = Input.Group;

import './index.scss';

@inject((stores: any) => {
  return {
    shell: (str: string) => stores.terminal.shell(str),
  };
})
@observer
class RunnerView extends React.Component<any, any> {
  @observable public projectPath: string = '';

  @action
  public handleSelectDir(el: HTMLInputElement) {
    selectFile(
      {
        message: '选择工程目录',
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

  public render() {
    return (
      <div className="sub-page-runner">
        <div className="form-table">
          <div className="form-item">
            <div className="label">选择工程目录</div>
            <div className="form">
              <Input
                size="large"
                placeholder="点击选择工程目录"
                readOnly={true}
                defaultValue={this.projectPath}
                onClick={(e: any) => {
                  this.handleSelectDir(e.target);
                }}
                suffix={<Icon type="project" />}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RunnerView;
