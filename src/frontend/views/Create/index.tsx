import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { remote } from 'electron';
import { action, observable } from 'mobx';
import { selectFile } from '../../utils/file';
import * as project from '../../utils/project';
import LineProgress from '../../components/LineProgress';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import Switch from 'antd/lib/switch';
import { isMac } from '../../utils/env';
const { Option } = Select;
const InputGroup = Input.Group;
const nameReg = /^[0-9a-zA-Z_-]{1,}$/;

const { confirm } = Modal;

import './index.scss';

@inject((stores: any) => {
  const { systemEnvObject } = stores.workStation;
  return {
    systemEnvObject,
    shell: (str: string) => stores.terminal.shell(str),
    setUserDefaultProjerctPath: (str: string) =>
      stores.workStation.setUserDefaultProjerctPath(str),
  };
})
@observer
class CreatehView extends React.Component<any, any> {
  @observable public projectScaffold: string = 'ynet-vue-basic-pc';
  @observable public projectName: string = '';
  @observable public projectPath: string = '';
  @observable public projectDir: string = '';
  @observable public userPassword: string = '';
  @observable public projectTemplate: string = 'vue-empty-typical';
  @observable public installPackages: boolean = true;
  @observable public inputUserPasswordModalVisible: boolean = false;
  @observable public isYarn: boolean = true;

  constructor(props: any) {
    super(props);
    this.state = {
      creating: false,
      createInfo: '',
    };
  }

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
  public handleChangeUserPassword(val: string) {
    this.userPassword = val;
  }

  @action
  public setInputUserPasswordVisible() {
    if (!this.userPassword) {
      message.warn('密码不能为空！');
    } else {
      this.props.shell(`${this.userPassword}\n`);
      this.setInstallConfirmModal(false);
      this.installConfirm();
    }
  }

  @action
  public installConfirm() {
    confirm({
      title: '是否立即安装该项目依赖包？',
      content: '若取消该次安装，可下次手动进行安装。安装过程中请勿重复操作！',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const sudo = isMac ? 'sudo ' : '';
        const cmd = this.isYarn ? 'yarn' : 'npm';
        this.props.shell(`${sudo}${cmd} install\n`);
        remote.shell.showItemInFolder(this.projectDir);
        remote.getCurrentWindow().focus();
      },
      onCancel: () => {
        remote.shell.showItemInFolder(this.projectDir);
      },
    });
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
        installPackages: this.installPackages,
        autoInstall: this.installPackages,
      };
      this.setState({
        creating: true,
        createInfo: '开始创建工程',
      });
      project.create(params, (data: any) => {
        const { step, state, status } = data;
        if (step === 'download') {
          if (status === 'running') {
            this.setState({
              createInfo: `正在下载工程...(${~~(state.progress * 100)}%)`,
            });
          } else if (status === 'error') {
            this.setState({
              createInfo: `工程下载出错！`,
              creating: false,
            });
          } else if (status === 'finished') {
            this.setState({
              createInfo: `工程下载完成！`,
            });
          }
        } else if (step === 'unzip') {
          if (status === 'running') {
            this.setState({
              createInfo: `正在解压工程...(${~~(
                (state.fileIndex / state.fileCount) *
                100
              )}%)`,
            });
          } else if (status === 'finished') {
            this.setState({
              createInfo: `工程解压完毕！`,
              creating: false,
            });
            this.props.setUserDefaultProjerctPath(state.optputDir);

            if (this.installPackages) {
              this.props.shell(`cd ${state.optputDir}\n`);

              if (isMac) {
                this.props.shell('sudo -s\n');
                this.setInstallConfirmModal(true);
              } else {
                this.installConfirm();
              }
              this.projectDir = state.optputDir;
            }
          }
        }
      });
    }
  }

  public setTaobaoMirror() {
    this.props.shell(
      'npm config set registry https://registry.npm.taobao.org/\n' +
        'npm config set sass-binary-site http://npm.taobao.org/mirrors/node-sass\n'
    );
  }

  public setInstallConfirmModal(state: boolean) {
    this.inputUserPasswordModalVisible = state;
  }

  public componentDidMount() {
    this.isYarn = this.props.systemEnvObject['Yarn'].version;
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
              <Option value="ynet-vue-basic-pc">Vue内管系统基础脚手架</Option>
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
              <Option value="vue-empty-typical">默认典型模板</Option>
              <Option value="vue-hzbank">杭银直销业务模板</Option>
              <Option value="vue-tlbank">泰隆手机银行业务模板</Option>
              <Option value="vue-gfbank">广发信用卡App业务模板</Option>
            </Select>
          </div>
          <div className="tips">
            <span>为防止安装失败，建议使用淘宝镜像源</span>
            <div
              className="btn-default env-set-btn"
              onClick={() => {
                this.setTaobaoMirror();
              }}
            >
              一键设置
            </div>
          </div>
          <div className="form-item install-packages">
            <span className="label">自动安装依赖包</span>
            <Switch
              onChange={(e: boolean) => {
                this.installPackages = e;
              }}
              defaultChecked={this.installPackages}
            />
          </div>
          <div
            className="btn-large create-btn"
            onClick={() => {
              this.createProjectHandle();
            }}
          >
            创建项目
          </div>
        </div>
        <LineProgress
          hide={!this.state.creating}
          title={this.state.createInfo}
          mask={true}
        />
        <Modal
          title="请输入管理员密码"
          visible={this.inputUserPasswordModalVisible}
          onOk={() => this.setInputUserPasswordVisible()}
          onCancel={() => this.setInstallConfirmModal(false)}
          okText="确认"
          cancelText="取消"
        >
          <Input
            placeholder="请输入密码"
            type="password"
            onChange={(e: any) => {
              this.handleChangeUserPassword(e.target.value);
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default CreatehView;
