export interface ColorTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    text: string;
    keyword: string;
    string: string;
    comment: string;
    variable: string;
    function: string;
    operator: string;
    class: string;
    number: string;
    lineNumber: string;
    cursor: string;
    selection: string;
  };
  fontFamily: string;
}

export const PRESET_THEMES: ColorTheme[] = [
  {
    id: 'monokai',
    name: 'Monokai',
    description: 'Dark theme with vibrant colors',
    colors: {
      background: '#272822',
      text: '#f8f8f2',
      keyword: '#f92672',
      string: '#a6e22e',
      comment: '#75715e',
      variable: '#9e86c8',
      function: '#66d9ef',
      operator: '#f92672',
      class: '#a6e22e',
      number: '#ae81ff',
      lineNumber: '#90908a',
      cursor: '#f8f8f2',
      selection: '#49483e'
    },
    fontFamily: 'Fira Code'
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    description: 'Dark theme inspired by GitHub',
    colors: {
      background: '#0d1117',
      text: '#c9d1d9',
      keyword: '#ff7b72',
      string: '#a5d6ff',
      comment: '#8b949e',
      variable: '#c9d1d9',
      function: '#d2a8ff',
      operator: '#ff7b72',
      class: '#d2a8ff',
      number: '#79c0ff',
      lineNumber: '#6e7681',
      cursor: '#c9d1d9',
      selection: '#3b4451'
    },
    fontFamily: 'JetBrains Mono'
  },
  {
    id: 'ayu-mirage',
    name: 'Ayu Mirage',
    description: 'Calm, dark blue theme',
    colors: {
      background: '#1f2430',
      text: '#cbccc6',
      keyword: '#ffad66',
      string: '#bbe67e',
      comment: '#5c6773',
      variable: '#cbccc6',
      function: '#5ccfe6',
      operator: '#f29e74',
      class: '#ffd173',
      number: '#ff8f40',
      lineNumber: '#5c6773',
      cursor: '#cbccc6',
      selection: '#34455a'
    },
    fontFamily: 'Fira Code'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Dark theme optimized for night coding',
    colors: {
      background: '#011627',
      text: '#d6deeb',
      keyword: '#c792ea',
      string: '#ecc48d',
      comment: '#637777',
      variable: '#82aaff',
      function: '#82aaff',
      operator: '#c792ea',
      class: '#ffcb8b',
      number: '#f78c6c',
      lineNumber: '#4b6479',
      cursor: '#7e57c2',
      selection: '#1d3b53'
    },
    fontFamily: 'JetBrains Mono'
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'Dark theme with gothic colors',
    colors: {
      background: '#282a36',
      text: '#f8f8f2',
      keyword: '#ff79c6',
      string: '#f1fa8c',
      comment: '#6272a4',
      variable: '#bd93f9',
      function: '#50fa7b',
      operator: '#ff79c6',
      class: '#8be9fd',
      number: '#bd93f9',
      lineNumber: '#6272a4',
      cursor: '#f8f8f2',
      selection: '#44475a'
    },
    fontFamily: 'Fira Code'
  }
];