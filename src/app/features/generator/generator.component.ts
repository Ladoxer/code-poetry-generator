import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ColorTheme, PRESET_THEMES } from '../../core/models/theme.model';
import { PoemGeneratorService } from '../../core/services/poem-generator.service';
import { StorageService } from '../../core/services/storage.service';
import { CodePoem, PoemEmotion } from '../../core/models/poem.model';
import { HeaderComponent } from '../../shared/components/header.component';
import { FooterComponent } from '../../shared/components/footer.component';
import { ButtonComponent } from '../../shared/components/button.component';
import { CodeDisplayComponent } from './code-display.component';
import { ThemeSelectorComponent } from './theme-selector.component';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    ButtonComponent,
    CodeDisplayComponent,
    ThemeSelectorComponent
  ],
  template: `
    <main class="min-h-screen flex flex-col bg-gradient-to-b from-dark-100 to-dark-300 text-white">
      <app-header></app-header>
      
      <div class="container mx-auto px-4 py-8 flex-grow">
        <section class="max-w-4xl mx-auto">
          <div class="mb-8 text-center">
            <h1 class="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary-300 to-secondary-300 text-transparent bg-clip-text">
              Interactive Code Poetry Generator
            </h1>
            <p class="text-gray-300 max-w-2xl mx-auto">
              Create beautiful poems rendered as syntax-highlighted code. Blend programming with poetry to express your emotions in a digital form.
            </p>
          </div>
          
          <div class="bg-dark-200 rounded-lg shadow-xl p-6 mb-8">
            <form [formGroup]="poemForm" (ngSubmit)="generatePoem()" class="space-y-6">
              <div>
                <label for="words" class="block text-gray-300 mb-2">Keywords (comma separated)</label>
                <input 
                  type="text" 
                  id="words" 
                  formControlName="words"
                  placeholder="ocean, stars, digital, dream, whisper"
                  class="w-full px-4 py-3 rounded-md bg-dark-300 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                @if (poemForm.get('words')?.invalid && (poemForm.get('words')?.dirty || poemForm.get('words')?.touched)) {
                  <p class="mt-1 text-sm text-red-400">Please enter at least one keyword</p>
                }
              </div>
              
              <div>
                <label class="block text-gray-300 mb-2">Emotion</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  @for (emotion of emotions; track emotion) {
                    <div 
                      (click)="poemForm.get('emotion')?.setValue(emotion)"
                      [class]="poemForm.get('emotion')?.value === emotion ? 
                        'cursor-pointer px-4 py-2 rounded-md text-center border-2 border-primary-500 bg-primary-500 bg-opacity-20' : 
                        'cursor-pointer px-4 py-2 rounded-md text-center border border-gray-700 hover:border-primary-400 transition-colors'"
                    >
                      {{ emotion | titlecase }}
                    </div>
                  }
                </div>
              </div>
              
              <div>
                <label class="block text-gray-300 mb-2">Theme</label>
                <app-theme-selector 
                  [themes]="themes" 
                  [selectedTheme]="selectedTheme()"
                  (themeSelected)="selectTheme($event)"
                ></app-theme-selector>
              </div>
              
              <div class="flex justify-center pt-2">
                <app-button type="submit" [disabled]="poemForm.invalid || isGenerating()">
                  <div class="flex items-center">
                    @if (isGenerating()) {
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    }
                    {{ isGenerating() ? 'Composing Poetry...' : 'Generate Code Poem' }}
                  </div>
                </app-button>
              </div>
            </form>
          </div>
          
          @if (currentPoem()) {
            <div class="bg-dark-200 rounded-lg shadow-xl overflow-hidden">
              <app-code-display 
                [poem]="currentPoem()!" 
                [theme]="selectedThemeObject()"
                [showControls]="true"
                (poemSaved)="onPoemSaved()"
              ></app-code-display>
            </div>
          }

          <!-- Success notification -->
          @if (showSuccess()) {
            <div class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-out">
              Poem saved successfully!
            </div>
          }
        </section>
      </div>
      
      <app-footer></app-footer>
    </main>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(-20px); }
      10% { opacity: 1; transform: translateY(0); }
      90% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-20px); }
    }
    
    .animate-fade-in-out {
      animation: fadeInOut 3s forwards;
    }
  `]
})
export class GeneratorComponent implements OnInit {
  poemForm!: FormGroup;
  themes = PRESET_THEMES;
  emotions: PoemEmotion[] = ['joy', 'sadness', 'anger', 'fear', 'love', 'surprise', 'neutral'];
  
  selectedTheme = signal<string>(this.themes[0].id);
  currentPoem = signal<CodePoem | null>(null);
  isGenerating = signal<boolean>(false);
  showSuccess = signal<boolean>(false);
  
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  constructor(
    private fb: FormBuilder,
    private poemGenerator: PoemGeneratorService,
    private storageService: StorageService
  ) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.poemForm = this.fb.group({
      words: ['ocean, stars, digital, dream', [Validators.required]],
      emotion: ['joy', [Validators.required]]
    });
  }
  
  selectTheme(themeId: string): void {
    this.selectedTheme.set(themeId);
  }
  
  selectedThemeObject(): ColorTheme {
    return this.themes.find(theme => theme.id === this.selectedTheme()) || this.themes[0];
  }
  
  generatePoem(): void {
    if (this.poemForm.invalid) return;
    
    this.isGenerating.set(true);
    
    const formValues = this.poemForm.value;
    const words = formValues.words.split(',').map((word: string) => word.trim()).filter((word: string) => word.length > 0);
    const emotion = formValues.emotion as PoemEmotion;
    
    setTimeout(() => {
      const poem = this.poemGenerator.generatePoem(words, emotion, this.selectedTheme());
      this.currentPoem.set(poem);
      this.isGenerating.set(false);
    }, 1200); // Adding a delay for UX
  }
  
  onPoemSaved(): void {
    // Show success message
    this.showSuccess.set(true);
    setTimeout(() => this.showSuccess.set(false), 3000);
    
    // Trigger confetti animation
    if (this.isBrowser) {
      this.triggerConfetti();
    }
  }
  
  private async triggerConfetti(): Promise<void> {
    try {
      // Dynamically import the canvas-confetti library
      const confetti = (await import('canvas-confetti')).default;
      
      // Fire the confetti with customized options
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#ec4899', '#a3e635', '#fbbf24', '#8b5cf6']
      });
      
      // Fire another round after a slight delay
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#0ea5e9', '#ec4899', '#a3e635', '#fbbf24', '#8b5cf6']
        });
      }, 250);
      
      // And another from the other side
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#0ea5e9', '#ec4899', '#a3e635', '#fbbf24', '#8b5cf6']
        });
      }, 400);
      
    } catch (error) {
      console.error('Failed to load confetti animation', error);
    }
  }
}