import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CodePoem } from '../../core/models/poem.model';
import { ColorTheme, PRESET_THEMES } from '../../core/models/theme.model';
import { ButtonComponent } from '../../shared/components/button.component';

@Component({
  selector: 'app-poem-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div 
      class="rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      [style.background-color]="getTheme().colors.background"
    >
      <!-- Preview -->
      <div class="p-3 h-48 overflow-hidden">
        <div class="mb-2" [style.color]="getTheme().colors.comment">
          /* {{ poem.title }} */
        </div>
        
        <div class="text-xs">
          @for (line of getPreviewLines(); track $index) {
            <div class="whitespace-pre-wrap">
              <span [style.color]="getLineColor(line.type)">
                {{ getLineContent(line) }}
              </span>
            </div>
          }
        </div>
      </div>
      
      <!-- Footer -->
      <div class="p-3 bg-opacity-90 bg-black text-white">
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm font-medium">{{ poem.title }}</div>
          <div class="text-xs text-gray-400">{{ poem.createdAt | date }}</div>
        </div>
        
        <div class="flex justify-between mt-2">
          <app-button 
            variant="ghost" 
            [small]="true"
            className="text-primary-400"
            (onClick)="onLike()"
          >
            <div class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {{ poem.likes || 0 }}
            </div>
          </app-button>
          
          <app-button 
            variant="primary" 
            [small]="true"
            [routerLink]="['/poem', poem.id]"
          >
            View
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PoemCardComponent {
  @Input() poem!: CodePoem;
  @Output() likeClicked = new EventEmitter<string>();
  
  getTheme(): ColorTheme {
    return PRESET_THEMES.find(theme => theme.id === this.poem.theme) || PRESET_THEMES[0];
  }
  
  getPreviewLines() {
    return this.poem.lines.slice(0, 10);
  }
  
  getLineContent(line: any) {
    const indentation = ' '.repeat(line.indentation * 2);
    return `${indentation}${line.content}`;
  }
  
  getLineColor(lineType: string): string {
    const theme = this.getTheme();
    switch (lineType) {
      case 'keyword':
        return theme.colors.keyword;
      case 'string':
        return theme.colors.string;
      case 'comment':
        return theme.colors.comment;
      case 'variable':
        return theme.colors.variable;
      case 'function':
        return theme.colors.function;
      case 'operator':
        return theme.colors.operator;
      case 'class':
        return theme.colors.class;
      case 'number':
        return theme.colors.number;
      default:
        return theme.colors.text;
    }
  }
  
  onLike() {
    this.likeClicked.emit(this.poem.id);
  }
}