import * as React from 'react';
import { DeviceContext } from '../context';

class WebviewView extends React.Component<any, any> {
  static contextType = DeviceContext;
  public webview: any = null;

  public componentDidMount() {
    const { target } = this.context;

    if (this.webview) {
      this.webview.src = target;
      this.webview.addEventListener('dom-ready', () => {
        this.webview.insertCSS(`
          body::-webkit-scrollbar {
            width: 4px;
          }
          
          body::-webkit-scrollbar-thumb {
            background-color: rgb(220, 220, 220);
          }
          
          body::-webkit-scrollbar-track-piece {
            background-color: transparent;
          }
        `);

        this.webview.openDevTools();

        setTimeout(() => {
          this.webview.send('ping');
          console.log('send ping');
        }, 3000);

        this.webview.addEventListener('ipc-message', (event: any) => {
          console.log(event.channel);
        });
      });
    }
  }

  public render() {
    const {
      preload,
      descriptors: {
        userAgent,
        viewport: { width, height },
      },
    } = this.context;

    const wvSize = {
      width: width + 'px',
      height: height - 80 + 'px',
    };

    return (
      <div className="app-webview" style={wvSize}>
        <div className="app-webview-wrapper">
          <webview
            ref={node => {
              this.webview = node;
            }}
            useragent={userAgent}
            preload={preload}
            style={wvSize}
          />
        </div>
      </div>
    );
  }
}

export default WebviewView;
