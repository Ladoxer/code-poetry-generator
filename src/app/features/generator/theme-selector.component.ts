import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorTheme } from '../../core/models/theme.model';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      @for (theme of themes; track theme.id) {
      <div
        (click)="onSelectTheme(theme.id)"
        class="cursor-pointer transition-transform duration-200 hover:scale-105 focus:outline-none"
      >
        <div
          [style.background-color]="theme.colors.background"
          [class]="
            selectedTheme === theme.id
              ? 'border-2 border-primary-500 rounded-md overflow-hidden shadow-lg'
              : 'border border-gray-700 rounded-md overflow-hidden shadow-lg'
          "
        >
          <!-- Theme preview -->
          <div class="p-3 h-28">
            <div class="flex items-center mb-1">
              <div class="w-2 h-2 rounded-full bg-red-500 mr-1.5"></div>
              <div class="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></div>
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
            </div>

            <div class="space-y-1 mt-2 text-xs">
              <div [style.color]="theme.colors.keyword">
                function hello() {{ '{' }}
              </div>
              <div [style.color]="theme.colors.variable" class="ml-2">
                const msg =
              </div>
              <div [style.color]="theme.colors.string" class="ml-4">
                "Hello World";
              </div>
              <div [style.color]="theme.colors.comment" class="ml-2">
                // Beautiful code
              </div>
              <div [style.color]="theme.colors.keyword">{{ '}' }}</div>
            </div>
          </div>

          <!-- Theme name -->
          <div
            class="bg-opacity-80 px-2 py-1 text-center bg-black text-white text-sm"
          >
            {{ theme.name }}
          </div>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ThemeSelectorComponent {
  @Input() themes: ColorTheme[] = [];
  @Input() selectedTheme = '';
  @Output() themeSelected = new EventEmitter<string>();

  onSelectTheme(themeId: string): void {
    this.themeSelected.emit(themeId);
  }
}
