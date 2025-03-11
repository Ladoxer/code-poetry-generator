import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { CodePoem } from '../../core/models/poem.model';
import { PoemCardComponent } from './poem-card.component';
import { HeaderComponent } from '../../shared/components/header.component';
import { FooterComponent } from '../../shared/components/footer.component';
import { ButtonComponent } from '../../shared/components/button.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    PoemCardComponent, 
    HeaderComponent, 
    FooterComponent,
    ButtonComponent
  ],
  template: `
    <main class="min-h-screen flex flex-col bg-gradient-to-b from-dark-100 to-dark-300 text-white">
      <app-header></app-header>
      
      <div class="container mx-auto px-4 py-8 flex-grow">
        <section class="max-w-6xl mx-auto">
          <div class="mb-8 text-center">
            <h1 class="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary-300 to-secondary-300 text-transparent bg-clip-text">
              Poetry Gallery
            </h1>
            <p class="text-gray-300 max-w-2xl mx-auto">
              Your collection of saved code poems. Each piece is a unique blend of programming and poetic expression.
            </p>
          </div>
          
          @if (poems().length === 0) {
            <div class="py-16 text-center">
              <div class="text-gray-500 text-lg mb-4">
                You haven't created any poems yet.
              </div>
              <app-button variant="primary" routerLink="/">
                Create Your First Poem
              </app-button>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (poem of poems(); track poem.id) {
                <app-poem-card 
                  [poem]="poem"
                  (likeClicked)="likePoem($event)"
                ></app-poem-card>
              }
            </div>
          }
        </section>
      </div>
      
      <app-footer></app-footer>
    </main>
  `,
  styles: []
})
export class GalleryComponent implements OnInit {
  poems = signal<CodePoem[]>([]);
  
  constructor(private storageService: StorageService) {}
  
  ngOnInit(): void {
    this.loadPoems();
  }
  
  loadPoems(): void {
    this.storageService.getAllPoems().subscribe(poems => {
      this.poems.set(poems.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }));
    });
  }
  
  likePoem(id: string): void {
    this.storageService.likePoem(id);
  }
}