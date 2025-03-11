import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button 
      [ngClass]="[
        'px-4 py-2 rounded-md font-medium transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-opacity-50 active:scale-95',
        variant === 'primary' ? 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-400' : '',
        variant === 'secondary' ? 'bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-400' : '',
        variant === 'outline' ? 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400' : '',
        variant === 'ghost' ? 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400' : '',
        small ? 'text-sm' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      ]"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary';
  @Input() small = false;
  @Input() disabled = false;
  @Input() className = '';
  @Output() onClick = new EventEmitter<MouseEvent>();
}