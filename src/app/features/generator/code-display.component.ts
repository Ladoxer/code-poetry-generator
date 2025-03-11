import { Component, Input, Output, EventEmitter, signal, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TextFormatter } from '../../core/utils/text-formatter.utils';
import { CodePoem, CodeLine } from '../../core/models/poem.model';
import { ColorTheme, PRESET_THEMES } from '../../core/models/theme.model';
import { StorageService } from '../../core/services/storage.service';
import { ButtonComponent } from '../../shared/components/button.component';
import { HeaderComponent } from '../../shared/components/header.component';
import { FooterComponent } from '../../shared/components/footer.component';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-code-display',
  standalone: true,
  imports: [CommonModule, ButtonComponent, HeaderComponent, FooterComponent],
  template: `
    @if (embeddedMode) {
      <!-- Embedded mode shows just the code display -->
      <div class="relative">
        <!-- Code Editor Display -->
        <div 
          #codeContainer
          class="font-mono text-sm sm:text-base antialiased overflow-x-auto p-4"
          [style.background-color]="theme?.colors?.background"
        >
          <div class="whitespace-pre">
            <!-- Title as comment -->
            <div 
              class="mb-4 text-lg font-medium"
              [style.color]="theme?.colors?.comment"
            >
              /* {{ poem?.title }} */
            </div>
            
            <!-- Code lines -->
            @for (line of poem?.lines || []; track $index) {
              <div class="code-line">
                <span 
                  [style.color]="getLineColor(line.type)"
                >{{ getFormattedLine(line) }}</span>
              </div>
            }
          </div>
        </div>
        
        <!-- Controls Overlay -->
        @if (showControls) {
          <div class="mt-4 p-4 flex flex-wrap gap-2 justify-between items-center bg-dark-200 rounded-b-lg">
            <div class="flex gap-2">
              <app-button 
                variant="primary"
                (onClick)="savePoem()"
              >
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save to Gallery
                </div>
              </app-button>
              
              <app-button 
                variant="secondary"
                (onClick)="exportAsImage()"
              >
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Export as Image
                </div>
              </app-button>
            </div>
            
            <div class="flex gap-2">
              <app-button 
                variant="outline"
                (onClick)="regenerate()"
              >
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate
                </div>
              </app-button>
            </div>
          </div>
        }
      </div>
    } @else {
      <!-- Full page mode with header and footer -->
      <main class="min-h-screen flex flex-col bg-gradient-to-b from-dark-100 to-dark-300 text-white">
        <app-header></app-header>
        <div class="container mx-auto px-4 py-8 flex-grow">
          <div class="relative">
            <!-- Code Editor Display -->
            <div 
              #codeContainer
              class="font-mono text-sm sm:text-base antialiased overflow-x-auto p-4"
              [style.background-color]="theme?.colors?.background"
            >
              <div class="whitespace-pre">
                <!-- Title as comment -->
                <div 
                  class="mb-4 text-lg font-medium"
                  [style.color]="theme?.colors?.comment"
                >
                  /* {{ poem?.title }} */
                </div>
                
                <!-- Code lines -->
                @for (line of poem?.lines || []; track $index) {
                  <div class="code-line">
                    <span 
                      [style.color]="getLineColor(line.type)"
                    >{{ getFormattedLine(line) }}</span>
                  </div>
                }
              </div>
            </div>
            
            <!-- Controls Overlay -->
            @if (showControls) {
              <div class="mt-4 p-4 flex flex-wrap gap-2 justify-between items-center bg-dark-200 rounded-b-lg">
                <div class="flex gap-2">
                  <app-button 
                    variant="primary"
                    (onClick)="savePoem()"
                  >
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save to Gallery
                    </div>
                  </app-button>
                  
                  <app-button 
                    variant="secondary"
                    (onClick)="exportAsImage()"
                  >
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Export as Image
                    </div>
                  </app-button>
                </div>
                
                <div class="flex gap-2">
                  <app-button 
                    variant="outline"
                    (onClick)="regenerate()"
                  >
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate
                    </div>
                  </app-button>
                </div>
              </div>
            }
          </div>
        </div>
        <app-footer></app-footer>
      </main>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .code-line {
      min-height: 1.5em;
    }
  `]
})
export class CodeDisplayComponent implements OnInit {
  @Input() poem: CodePoem | null = null;
  @Input() theme: ColorTheme | null = null;
  @Input() showControls = false;
  @Input() embeddedMode = false;
  @Output() poemSaved = new EventEmitter<void>();
  @Output() regenerateRequested = new EventEmitter<void>();
  
  @ViewChild('codeContainer') codeContainer!: ElementRef;
  
  fullPage = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  isExporting = signal<boolean>(false);
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private storageService = inject(StorageService);
  
  ngOnInit(): void {
    const poemId = this.route.snapshot.paramMap.get('id');
    
    if (poemId && !this.poem) {
      this.fullPage.set(true);
      this.showControls = true;
      
      const storedPoem = this.storageService.getPoem(poemId);
      if (storedPoem) {
        this.poem = storedPoem;
        this.theme = PRESET_THEMES.find(theme => theme.id === storedPoem.theme) || PRESET_THEMES[0];
      } else {
        this.router.navigate(['/']);
      }
    }
  }
  
  getFormattedLine(line: CodeLine): string {
    return TextFormatter.formatCodeLine(line);
  }
  
  getLineColor(lineType: string): string {
    if (!this.theme) return 'white';
    return TextFormatter.applyThemeToLine({ content: '', type: lineType as any, indentation: 0 }, this.theme);
  }
  
  savePoem(): void {
    if (!this.poem) return;
    
    this.isSaving.set(true);
    
    try {
      this.storageService.savePoem(this.poem);
      this.poemSaved.emit();
      
      // Show success feedback
      setTimeout(() => {
        this.isSaving.set(false);
      }, 500);
    } catch (error) {
      console.error('Error saving poem', error);
      this.isSaving.set(false);
    }
  }
  
  exportAsImage(): void {
    if (!this.codeContainer) return;
    
    this.isExporting.set(true);
    
    const element = this.codeContainer.nativeElement;
    const bgColor = this.theme?.colors.background || '#272822';
    
    htmlToImage.toPng(element, { 
      backgroundColor: bgColor,
      style: {
        padding: '20px',
        borderRadius: '8px'
      }
    })
    .then((dataUrl) => {
      saveAs(dataUrl, `${this.poem?.title || 'code-poem'}.png`);
      this.isExporting.set(false);
    })
    .catch((error) => {
      console.error('Error exporting image', error);
      this.isExporting.set(false);
    });
  }
  
  regenerate(): void {
    this.regenerateRequested.emit();
  }
}