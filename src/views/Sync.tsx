import * as React from "react";
import { withRouter } from "react-router";
import { decode, encode } from "../utils/aes";
import createAppMenu from "../utils/createAppMenu";
import CreateContextMenu from "../utils/CreateContextMenu";

class SyncView extends React.Component<any> {
  public contextMenu: any = null;
  public cryptoStrEl: any = null;
  public cryptoPswdrEl: any = null;
  public cryptoRztEl: any = null;
  public notify: any = null;

  public componentDidMount() {
    // 右键菜单
    this.contextMenu = new CreateContextMenu(window, [
      {
        click: () => {
          this.props.history.push("/refresh");
        },
        label: "刷新"
      },
      {
        type: "separator"
      },
      {
        checked: true,
        click: (e: any) => {
          console.log(e.checked ? "已选中" : "未选中");
        },
        label: "第二个菜单",
        type: "checkbox"
      }
    ]);
  }

  public encodeHandle = () => {
    encode(this.cryptoStrEl.value, this.cryptoPswdrEl.value, data => {
      this.cryptoRztEl.value = data;
    });
  };

  public decodeHandle = () => {
    decode(this.cryptoStrEl.value, this.cryptoPswdrEl.value, data => {
      this.cryptoRztEl.value = data;
    });
  };

  public componentWillMount() {
    createAppMenu(tpl => {
      const editTpl = {
        label: "独占",
        submenu: [
          {
            accelerator: "CmdOrCtrl+J",
            click: (e: any) => {
              this.notify = new Notification("独占功能", {
                body: "显示通知正文内容"
              });
            },
            label: "功能",
            role: "功能"
          }
        ]
      };

      tpl.unshift(editTpl);

      return tpl;
    });
  }

  public componentWillUnmount() {
    this.contextMenu.unbind();

    createAppMenu();
  }

  public render() {
    return (
      <div>
        <br />
        <input
          type="text"
          ref={node => {
            this.cryptoStrEl = node;
          }}
          placeholder="请输入加密/解密字符"
        />
        <input
          type="text"
          ref={node => {
            this.cryptoPswdrEl = node;
          }}
          placeholder="请输入加密/解密密码"
        />
        <button onClick={this.encodeHandle}>加密</button>
        <button onClick={this.decodeHandle}>解密</button>
        <div>
          ∞加密/解密结果：
          <input
            type="text"
            ref={node => {
              this.cryptoRztEl = node;
            }}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(SyncView);
