import { Injectable } from '@angular/core';
import { CodeLine, CodePoem, PoemEmotion } from '../models/poem.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class PoemGeneratorService {
  private readonly keywordTemplates = [
    'import', 'class', 'function', 'const', 'let', 'var', 
    'if', 'else', 'while', 'for', 'return', 'export',
    'async', 'await', 'try', 'catch', 'throw', 'new',
    'extends', 'implements', 'interface', 'type'
  ];

  private readonly languagePatterns = {
    javascript: {
      commentPrefix: '//',
      stringDelimiter: "'",
      template: '`',
      functionPrefix: 'function',
      endLine: ';'
    },
    python: {
      commentPrefix: '#',
      stringDelimiter: '"',
      functionPrefix: 'def',
      endLine: ''
    },
    ruby: {
      commentPrefix: '#',
      stringDelimiter: "'",
      functionPrefix: 'def',
      endLine: 'end'
    }
  };

  private readonly emotionPatterns: Record<PoemEmotion, string[]> = {
    joy: ['bloom', 'shine', 'dance', 'celebrate', 'flow', 'radiate', 'illuminate'],
    sadness: ['fade', 'sink', 'descend', 'diminish', 'dissolve', 'wither', 'darken'],
    anger: ['burn', 'crash', 'explode', 'shatter', 'destroy', 'fracture', 'rupture'],
    fear: ['hide', 'freeze', 'tremble', 'shrink', 'retreat', 'collapse', 'vanish'],
    love: ['embrace', 'connect', 'unite', 'intertwine', 'merge', 'harmonize', 'resonate'],
    surprise: ['spark', 'transform', 'evolve', 'morph', 'shift', 'emerge', 'awaken'],
    neutral: ['observe', 'process', 'analyze', 'compile', 'execute', 'render', 'implement']
  };

  generatePoem(words: string[], emotion: PoemEmotion, theme: string): CodePoem {
    const lines: CodeLine[] = [];
    const language = this.getRandomLanguagePattern();
    
    // Add import/library statements
    lines.push(this.generateImportLine(language, words));
    lines.push({ content: '', type: 'plain', indentation: 0 });
    
    // Add class or function definition
    const className = this.generateClassName(words);
    lines.push(this.generateClassDefinition(className));
    
    // Add constructor or initialization
    lines.push(this.generateConstructor(className, words, language, 1));
    
    // Add a few method definitions
    const methods = this.generateMethods(words, emotion, language, 1);
    lines.push(...methods);
    
    // Add closing bracket or end statement
    if (language !== this.languagePatterns.python && language !== this.languagePatterns.ruby) {
      lines.push({ content: '}', type: 'plain', indentation: 0 });
    }
    
    // Generate final poem object
    return {
      id: uuidv4(),
      title: this.generateTitle(words, emotion),
      lines,
      theme,
      createdAt: new Date(),
      inputs: {
        words,
        emotion,
        theme
      }
    };
  }

  private getRandomLanguagePattern() {
    const languages = Object.values(this.languagePatterns);
    return languages[Math.floor(Math.random() * languages.length)];
  }

  private generateImportLine(language: any, words: string[]): CodeLine {
    let importWord = words[Math.floor(Math.random() * words.length)];
    importWord = this.capitalize(importWord);
    
    if (language === this.languagePatterns.javascript) {
      return {
        content: `import { ${importWord} } from "${words.join('-').toLowerCase()}";`,
        type: 'keyword',
        indentation: 0
      };
    } else if (language === this.languagePatterns.python) {
      return {
        content: `import ${importWord.toLowerCase()} from "${words.join('_').toLowerCase()}"`,
        type: 'keyword',
        indentation: 0
      };
    } else {
      return {
        content: `require "${words.join('_').toLowerCase()}"`,
        type: 'keyword',
        indentation: 0
      };
    }
  }

  private generateClassName(words: string[]): string {
    // Combine 1-2 random words and capitalize them
    const numWords = Math.min(words.length, Math.floor(Math.random() * 2) + 1);
    let name = '';
    
    for (let i = 0; i < numWords; i++) {
      const index = Math.floor(Math.random() * words.length);
      name += this.capitalize(words[index]);
    }
    
    return name;
  }

  private generateClassDefinition(className: string): CodeLine {
    return {
      content: `class ${className} {`,
      type: 'class',
      indentation: 0
    };
  }

  private generateConstructor(className: string, words: string[], language: any, indentation: number): CodeLine {
    if (language === this.languagePatterns.javascript) {
      return {
        content: `constructor() {`,
        type: 'function',
        indentation
      };
    } else if (language === this.languagePatterns.python) {
      return {
        content: `def __init__(self):`,
        type: 'function',
        indentation
      };
    } else {
      return {
        content: `initialize`,
        type: 'function',
        indentation
      };
    }
  }

  private generateMethods(words: string[], emotion: PoemEmotion, language: any, indentation: number): CodeLine[] {
    const lines: CodeLine[] = [];
    const numMethods = Math.floor(Math.random() * 3) + 2; // Generate 2-4 methods
    
    for (let i = 0; i < numMethods; i++) {
      // Add empty line before method
      lines.push({ content: '', type: 'plain', indentation: 0 });
      
      // Method name based on emotion and words
      const emotionVerbs = this.emotionPatterns[emotion];
      const verb = emotionVerbs[Math.floor(Math.random() * emotionVerbs.length)];
      const word = words[Math.floor(Math.random() * words.length)];
      const methodName = `${verb}${this.capitalize(word)}`;
      
      // Method definition
      if (language === this.languagePatterns.javascript) {
        lines.push({ content: `${methodName}() {`, type: 'function', indentation });
      } else if (language === this.languagePatterns.python) {
        lines.push({ content: `def ${methodName.toLowerCase()}(self):`, type: 'function', indentation });
      } else {
        lines.push({ content: `def ${methodName.toLowerCase()}`, type: 'function', indentation });
      }
      
      // Method body
      lines.push(...this.generateMethodBody(words, emotion, language, indentation + 1));
      
      // Method closing
      if (language === this.languagePatterns.javascript) {
        lines.push({ content: `}`, type: 'plain', indentation });
      } else if (language === this.languagePatterns.ruby) {
        lines.push({ content: `end`, type: 'keyword', indentation });
      }
    }
    
    return lines;
  }

  private generateMethodBody(words: string[], emotion: PoemEmotion, language: any, indentation: number): CodeLine[] {
    const lines: CodeLine[] = [];
    const numLines = Math.floor(Math.random() * 4) + 2; // Generate 2-5 lines
    
    // Generate variable declarations
    for (let i = 0; i < numLines; i++) {
      const lineType = Math.random();
      
      if (lineType < 0.3) {
        // Variable declaration
        lines.push(this.generateVariableLine(words, language, indentation));
      } else if (lineType < 0.6) {
        // Comment line
        lines.push(this.generateCommentLine(words, emotion, language, indentation));
      } else if (lineType < 0.8) {
        // Function call
        lines.push(this.generateFunctionCallLine(words, emotion, language, indentation));
      } else {
        // String output
        lines.push(this.generateStringLine(words, emotion, language, indentation));
      }
    }
    
    return lines;
  }

  private generateVariableLine(words: string[], language: any, indentation: number): CodeLine {
    const word = words[Math.floor(Math.random() * words.length)];
    const variableName = word.toLowerCase();
    const value = Math.floor(Math.random() * 100);
    
    if (language === this.languagePatterns.javascript) {
      return {
        content: `const ${variableName} = ${value};`,
        type: 'variable',
        indentation
      };
    } else if (language === this.languagePatterns.python) {
      return {
        content: `${variableName} = ${value}`,
        type: 'variable',
        indentation
      };
    } else {
      return {
        content: `${variableName} = ${value}`,
        type: 'variable',
        indentation
      };
    }
  }

  private generateCommentLine(words: string[], emotion: PoemEmotion, language: any, indentation: number): CodeLine {
    const emotionVerbs = this.emotionPatterns[emotion];
    const verb = emotionVerbs[Math.floor(Math.random() * emotionVerbs.length)];
    const word = words[Math.floor(Math.random() * words.length)];
    
    return {
      content: `${language.commentPrefix} ${verb} through the ${word} like digital whispers`,
      type: 'comment',
      indentation
    };
  }

  private generateFunctionCallLine(words: string[], emotion: PoemEmotion, language: any, indentation: number): CodeLine {
    const emotionVerbs = this.emotionPatterns[emotion];
    const verb = emotionVerbs[Math.floor(Math.random() * emotionVerbs.length)];
    const word = words[Math.floor(Math.random() * words.length)];
    const functionName = `${verb}${this.capitalize(word)}`;
    
    if (language === this.languagePatterns.javascript) {
      return {
        content: `this.${functionName}();`,
        type: 'function',
        indentation
      };
    } else if (language === this.languagePatterns.python) {
      return {
        content: `self.${functionName.toLowerCase()}()`,
        type: 'function',
        indentation
      };
    } else {
      return {
        content: `${functionName.toLowerCase}`,
        type: 'function',
        indentation
      };
    }
  }

  private generateStringLine(words: string[], emotion: PoemEmotion, language: any, indentation: number): CodeLine {
    const word1 = words[Math.floor(Math.random() * words.length)];
    const word2 = words[Math.floor(Math.random() * words.length)];
    const emotionVerbs = this.emotionPatterns[emotion];
    const verb = emotionVerbs[Math.floor(Math.random() * emotionVerbs.length)];
    
    const content = `${language.stringDelimiter}${word1} ${verb}s into ${word2}${language.stringDelimiter}`;
    
    return {
      content,
      type: 'string',
      indentation
    };
  }

  private generateTitle(words: string[], emotion: PoemEmotion): string {
    const emotionVerbs = this.emotionPatterns[emotion];
    const verb = emotionVerbs[Math.floor(Math.random() * emotionVerbs.length)];
    const word = words[Math.floor(Math.random() * words.length)];
    
    return `${this.capitalize(verb)} ${this.capitalize(word)}`;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}