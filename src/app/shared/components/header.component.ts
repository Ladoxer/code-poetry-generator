import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  template: `
    <header class="bg-gradient-to-r from-dark-200 to-dark-300 text-white shadow-lg">
      <div class="container mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
            </svg>
            <h1 class="text-xl font-mono font-bold tracking-tight">
              <span class="text-primary-400">Code</span>
              <span class="text-secondary-400">Poetry</span>
            </h1>
          </div>
          
          <nav>
            <ul class="flex space-x-6">
              <li>
                <a 
                  routerLink="/" 
                  routerLinkActive="text-primary-400 font-medium"
                  [routerLinkActiveOptions]="{exact: true}" 
                  class="text-gray-300 hover:text-white transition-colors duration-200">
                  Create
                </a>
              </li>
              <li>
                <a 
                  routerLink="/gallery" 
                  routerLinkActive="text-primary-400 font-medium"
                  class="text-gray-300 hover:text-white transition-colors duration-200">
                  Gallery
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent {}