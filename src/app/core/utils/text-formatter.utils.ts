import { CodeLine } from '../models/poem.model';
import { ColorTheme } from '../models/theme.model';

export class TextFormatter {
  /**
   * Formats a code line with proper indentation and styling
   */
  static formatCodeLine(line: CodeLine, indentSize: number = 2): string {
    const indent = ' '.repeat(indentSize * line.indentation);
    return `${indent}${line.content}`;
  }

  /**
   * Gets the CSS color class for a specific line type
   */
  static getColorClass(lineType: string): string {
    switch (lineType) {
      case 'keyword':
        return 'text-code-keyword';
      case 'string':
        return 'text-code-string';
      case 'comment':
        return 'text-code-comment';
      case 'variable':
        return 'text-code-variable';
      case 'function':
        return 'text-code-function';
      case 'operator':
        return 'text-code-operator';
      case 'class':
        return 'text-code-class';
      case 'number':
        return 'text-code-number';
      default:
        return 'text-white';
    }
  }

  /**
   * Applies a theme's colors to a line based on its type
   */
  static applyThemeToLine(line: CodeLine, theme: ColorTheme): string {
    const type = line.type;
    let color = theme.colors.text; // Default text color
    
    switch (type) {
      case 'keyword':
        color = theme.colors.keyword;
        break;
      case 'string':
        color = theme.colors.string;
        break;
      case 'comment':
        color = theme.colors.comment;
        break;
      case 'variable':
        color = theme.colors.variable;
        break;
      case 'function':
        color = theme.colors.function;
        break;
      case 'operator':
        color = theme.colors.operator;
        break;
      case 'class':
        color = theme.colors.class;
        break;
      case 'number':
        color = theme.colors.number;
        break;
    }
    
    return color;
  }

  /**
   * Creates inline CSS style object from theme for a specific line type
   */
  static createInlineStyle(lineType: CodeLine["type"], theme: ColorTheme): { [key: string]: string } {
    return {
      color: this.applyThemeToLine({ content: '', type: lineType, indentation: 0 }, theme)
    };
  }

  /**
   * Generates a random delay for the typing animation effect
   */
  static generateRandomDelay(min: number = 20, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}