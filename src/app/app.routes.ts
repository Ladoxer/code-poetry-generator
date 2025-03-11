import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/generator/generator.component').then(m => m.GeneratorComponent),
    title: 'Code Poetry Generator'
  },
  {
    path: 'gallery',
    loadComponent: () => import('./features/gallery/gallery.component').then(m => m.GalleryComponent),
    title: 'Poetry Gallery'
  },
  {
    path: 'poem/:id',
    loadComponent: () => import('./features/generator/code-display.component').then(m => m.CodeDisplayComponent),
    title: 'View Poem'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
