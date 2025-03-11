export interface CodeLine {
  content: string;
  type: 'keyword' | 'string' | 'comment' | 'variable' | 'function' | 'operator' | 'class' | 'number' | 'plain';
  indentation: number;
  delay?: number; // For typing animation effect
}

export interface CodePoem {
  id: string;
  title: string;
  lines: CodeLine[];
  theme: string;
  createdAt: Date;
  inputs: {
    words: string[];
    emotion: string;
    theme: string;
  };
  likes?: number;
  imageUrl?: string;
}

export type PoemEmotion = 'joy' | 'sadness' | 'anger' | 'fear' | 'love' | 'surprise' | 'neutral';