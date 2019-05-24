import * as React from 'react';
import { Terminal } from 'xterm';
import { shell } from 'electron';
import { spawn, spawnKill } from '../../utils/terminal';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
Terminal.applyAddon(fit);
Terminal.applyAddon(webLinks);

import './index.scss';

const defaultTheme = {
  foreground: '#2c3e50',
  background: '#fff',
  cursor: 'rgba(0, 0, 0, .4)',
  selection: 'rgba(0, 0, 0, 0.3)',
  black: '#000000',
  red: '#e83030',
  brightRed: '#e83030',
  green: '#42b983',
  brightGreen: '#42b983',
  brightYellow: '#ea6e00',
  yellow: '#ea6e00',
  magenta: '#e83030',
  brightMagenta: '#e83030',
  cyan: '#03c2e6',
  brightBlue: '#03c2e6',
  brightCyan: '#03c2e6',
  blue: '#03c2e6',
  white: '#d0d0d0',
  brightBlack: '#808080',
  brightWhite: '#ffffff',
};

const darkTheme = {
  ...defaultTheme,
  foreground: '#fff',
  background: '#1d2935',
  cursor: 'rgba(255, 255, 255, .4)',
  selection: 'rgba(255, 255, 255, 0.3)',
  magenta: '#e83030',
  brightMagenta: '#e83030',
};

class HomeView extends React.Component {
  public terminalEl: any = null;
  public $_terminal: any = null;
  public textareaEl: any = null;
  public darkMode: boolean = false;

  public componentDidMount() {
    this.initTerm();
  }

  public shell() {
    const commands = this.textareaEl.value.split('\n');
    spawn(commands.join('\r') + '\r', data => {
      this.addLog({
        text: data,
        type: 'stdout',
      });
    });
    this.textareaEl.value = '';
  }

  public initTerm() {
    if (this.$_terminal) {
      this.$_terminal.destroy();
    }
    const term = new Terminal({
      cols: 80,
      rows: 24,
      fontSize: 12,
      scrollback: 1500,
      fontFamily: 'Monaco, Consolas, Source Code Pro',
      theme: this.darkMode ? darkTheme : defaultTheme,
    });
    this.$_terminal = term;
    term.open(this.terminalEl);
    term.on('blur', () => term.blur);
    term.on('focus', () => term.focus);

    webLinks.webLinksInit(term, this.handleLink);
  }

  public handleLink(event: any, uri: string) {
    shell.openExternal(uri);
  }

  public setContent(value: string, ln = true) {
    if (value.indexOf('\n') !== -1) {
      value.split('\n').forEach(t => this.setContent(t));
    } else {
      if (typeof value === 'string') {
        this.$_terminal[ln ? 'writeln' : 'write'](value);
      } else {
        this.$_terminal.writeln('');
      }
    }
  }

  public switchTheme() {
    this.darkMode = !this.darkMode;
    this.initTerm();
  }

  public addLog(log: { text: string; type: string }) {
    this.setContent(log.text, log.type === 'stdout');
  }

  public clear() {
    this.$_terminal.clear();
  }

  public stopSpawn() {
    spawnKill();
    this.clear();
  }

  public scrollToBottom() {
    this.$_terminal.scrollToBottom();
  }

  public componentWillUnmount() {
    this.$_terminal.destroy();
  }

  public render() {
    return (
      <div className="page-home">
        <textarea
          style={{
            width: '300px',
            height: '120px',
            border: '1px solid #eee',
          }}
          ref={node => {
            this.textareaEl = node;
          }}
        />
        <button
          onClick={e => {
            this.clear();
          }}
        >
          清除控制台
        </button>
        <button
          onClick={e => {
            this.shell();
          }}
        >
          执行命令
        </button>
        <button
          onClick={e => {
            this.stopSpawn();
          }}
        >
          结束进程
        </button>
        <button
          onClick={e => {
            this.switchTheme();
          }}
        >
          切换主题
        </button>
        <div
          className="app-terminal"
          ref={node => {
            this.terminalEl = node;
          }}
        />
      </div>
    );
  }
}

export default HomeView;
