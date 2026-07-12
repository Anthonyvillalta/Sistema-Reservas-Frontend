import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-bar">
      <span class="search-icon">🔍</span>
      <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange()"
             [placeholder]="placeholder" class="search-input" />
    </div>
  `,
  styles: [`
    .search-bar {
      display: flex; align-items: center; gap: var(--space-3);
      padding: 12px 16px; background: var(--color-surface);
      border-radius: var(--radius-md); box-shadow: var(--shadow-sm);
      border: 2px solid transparent; transition: border-color var(--transition-fast);
    }
    .search-bar:focus-within { border-color: var(--color-primary); }
    .search-icon { font-size: 1rem; }
    .search-input {
      flex: 1; border: none; outline: none; font-size: var(--text-base);
      font-family: var(--font-family); background: none; color: var(--color-text-primary);
    }
    .search-input::placeholder { color: var(--color-text-tertiary); }
  `]
})
export class SearchBarComponent {
  @Input() placeholder = 'Buscar...';
  @Output() onSearch = new EventEmitter<string>();
  searchTerm = '';

  private debounceTimer?: ReturnType<typeof setTimeout>;

  onSearchChange(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.onSearch.emit(this.searchTerm);
    }, 300);
  }
}
