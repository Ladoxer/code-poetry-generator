import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-dark-200 text-gray-400 py-4 mt-8">
      <div class="container mx-auto px-4 text-center">
        <p class="text-sm">
          <span>Built with </span>
          <span class="text-primary-400">Angular 18</span>
          <span> & </span>
          <span class="text-secondary-400">Tailwind CSS</span>
        </p>
        <p class="text-xs mt-1 font-mono">
          &lt;/&gt; with ❤️ by code poets
        </p>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {}