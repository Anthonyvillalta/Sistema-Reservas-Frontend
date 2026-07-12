import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <h1>Clientes</h1>
        <a routerLink="/clientes/nuevo" class="btn-primary btn-sm">+ Nuevo</a>
      </div>

      <!-- Buscador -->
      <div class="search-bar card">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (input)="onSearch()"
          placeholder="Buscar por nombre, email o celular..."
          class="search-input"
        />
      </div>

      <!-- Lista -->
      <div class="card">
        <div *ngIf="loading" class="loading-container">Cargando...</div>

        <div *ngIf="!loading && clients.length === 0" class="empty-state">
          No se encontraron clientes
        </div>

        <div *ngFor="let c of clients" class="client-row">
          <div class="client-info">
            <div class="client-avatar">{{ getInitials(c.nombre) }}</div>
            <div class="client-details">
              <span class="client-name">{{ c.nombre }}</span>
              <span class="client-contact">{{ c.celular }} <span *ngIf="c.email">| {{ c.email }}</span></span>
            </div>
          </div>
          <div class="client-meta">
            <span class="client-reservas">{{ c.totalReservas }} reservas</span>
            <div class="client-actions">
              <a [routerLink]="['/clientes', c.id, 'editar']" class="btn-icon" title="Editar">✏️</a>
              <button (click)="deleteClient(c)" class="btn-icon" title="Eliminar">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-bar {
      margin-bottom: 16px;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid var(--border);
      border-radius: 10px;
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      border-color: var(--primary);
    }

    .client-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid var(--border);
    }

    .client-row:last-child { border-bottom: none; }

    .client-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .client-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .client-details {
      display: flex;
      flex-direction: column;
    }

    .client-name {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .client-contact {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .client-meta {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .client-reservas {
      font-size: 0.8rem;
      color: var(--text-light);
    }

    .client-actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      font-size: 1.1rem;
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    .btn-icon:hover { opacity: 1; }

    .btn-sm {
      padding: 8px 20px;
      font-size: 0.85rem;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      color: var(--text-light);
    }
  `],
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  searchTerm = '';
  loading = false;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.findAll().subscribe({
      next: (data) => {
        this.clients = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onSearch(): void {
    this.loading = true;
    this.clientService
      .findAll(this.searchTerm, this.searchTerm, this.searchTerm)
      .subscribe({
        next: (data) => {
          this.clients = data;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  deleteClient(client: Client): void {
    if (confirm(`¿Eliminar a ${client.nombre}?`)) {
      this.clientService.delete(client.id!).subscribe(() => this.loadClients());
    }
  }
}
