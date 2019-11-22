const defaultTheme = {
  foreground: '#eff0eb',
  background: '#1d2028',
  cursor: '#97979b',
  selection: 'rgba(151, 151, 155, 0.2)',
  black: '#1d2028',
  red: '#ff5c57',
  brightRed: '#ff5c57',
  green: '#5af78e',
  brightGreen: '#5af78e',
  brightYellow: '#f3f99d',
  yellow: '#f3f99d',
  magenta: '#ff6ac1',
  brightMagenta: '#ff6ac1',
  cyan: '#9aedfe',
  brightBlue: '#57c7ff',
  brightCyan: '#9aedfe',
  blue: '#57c7ff',
  white: '#f1f1f0',
  brightBlack: '#686868',
  brightWhite: '#eff0eb',
};

export default (config: any) => ({
  cols: 80,
  rows: 24,
  fontSize: 12,
  scrollback: 1500,
  fontFamily:
    'Monaco, Consolas, Source Code Pro, Menlo, "DejaVu Sans Mono", "Lucida Console", monospace',
  theme: defaultTheme,
  allowTransparency: true,
  ...config,
});
