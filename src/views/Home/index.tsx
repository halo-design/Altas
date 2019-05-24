import * as React from 'react';
import { Terminal } from 'xterm';
import { commander, bindReadStdout } from '../../utils/terminal';
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

  public componentDidMount() {
    this.initTerm();

    bindReadStdout(data => {
      this.addLog({
        text: data,
        type: 'stdout',
      });
    });
  }

  public shell() {
    commander(
      'cd /Users/owlaford/Documents/WorkSpace/carbon-altas\rls\rnpm -v\rnpm run build\r'
    );
  }

  public initTerm() {
    const term = new Terminal({
      cols: 80,
      rows: 24,
      fontSize: 12,
      scrollback: 1500,
      fontFamily: 'Monaco, Consolas, Source Code Pro',
      theme: darkTheme,
    });
    this.$_terminal = term;
    term.open(this.terminalEl);
    term.on('blur', () => term.blur);
    term.on('focus', () => term.focus);
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

  public addLog(log: { text: string; type: string }) {
    this.setContent(log.text, log.type === 'stdout');
  }

  public clear() {
    this.$_terminal.clear();
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
        <div
          className="logo"
          onClick={e => {
            this.clear();
          }}
        />
        <h1
          onClick={e => {
            this.shell();
          }}
        >
          Awesome Electron!
        </h1>
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
