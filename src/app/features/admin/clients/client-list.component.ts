import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="cl">
      <!-- Header -->
      <div class="cl-header">
        <div class="cl-header-text">
          <h1 class="cl-title">Clientes</h1>
          <p class="cl-subtitle">Gestiona tus clientes y contactos</p>
        </div>
        <a routerLink="/clientes/nuevo" class="cl-cta">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo
        </a>
      </div>

      <!-- Search -->
      <div class="cl-search">
        <svg class="cl-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearchInput()" class="cl-search-input" placeholder="Buscar cliente por nombre, email o celular..." autocomplete="off" />
      </div>

      <!-- List -->
      <div class="cl-list" *ngIf="clients.length > 0 && !loading">
        <div *ngFor="let c of clients; let i = index" class="cl-card" [style.animation-delay]="0.03 * i + 's'">
          <div class="cl-card-top">
            <div class="cl-avatar" [style.background]="avatarGradients[i % avatarGradients.length]">{{ getInitials(c.nombre) }}</div>
            <div class="cl-info">
              <h3 class="cl-name">{{ c.nombre }}</h3>
              <span class="cl-badge" *ngIf="c.totalReservas !== undefined && c.totalReservas > 0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ c.totalReservas }} reservas
              </span>
            </div>
            <button class="cl-menu-btn" (click)="toggleMenu(c.id!)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
            </button>
          </div>

          <div class="cl-contact">
            <span class="cl-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              {{ c.celular }}
            </span>
            <span class="cl-contact-item" *ngIf="c.email">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {{ c.email }}
            </span>
          </div>

          <!-- Menu -->
          <div class="cl-menu-overlay" *ngIf="openMenuId === c.id" (click)="openMenuId = null"></div>
          <div class="cl-menu" *ngIf="openMenuId === c.id">
            <a [routerLink]="['/clientes', c.id, 'editar']" class="cl-menu-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Editar cliente
            </a>
            <button class="cl-menu-item cl-menu-item--danger" (click)="deleteClient(c)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Eliminar cliente
            </button>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div class="cl-empty" *ngIf="clients.length === 0 && !loading">
        <div class="cl-empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <p class="cl-empty-title" *ngIf="!searchTerm">No tienes clientes registrados</p>
        <p class="cl-empty-title" *ngIf="searchTerm">Sin resultados para "{{ searchTerm }}"</p>
        <p class="cl-empty-desc">Los clientes que registres aparecerán aquí.</p>
        <a routerLink="/clientes/nuevo" class="cl-empty-btn">+ Nuevo Cliente</a>
      </div>

      <!-- Loading -->
      <div class="cl-loading" *ngIf="loading">
        <div *ngFor="let _ of [1,2,3]" class="cl-shimmer"></div>
      </div>

      <!-- Confirm Modal -->
      <div class="cl-modal-overlay" *ngIf="showConfirm" (click)="showConfirm = false"></div>
      <div class="cl-modal" *ngIf="showConfirm">
        <div class="cl-modal-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <h3 class="cl-modal-title">Eliminar cliente</h3>
        <p class="cl-modal-desc">¿Estás seguro de eliminar a <strong>{{ deletingClient?.nombre }}</strong>? Esta acción no se puede deshacer.</p>
        <div class="cl-modal-actions">
          <button class="cl-modal-btn cl-modal-btn--cancel" (click)="showConfirm = false">Cancelar</button>
          <button class="cl-modal-btn cl-modal-btn--confirm" (click)="confirmDelete()">Eliminar</button>
        </div>
      </div>

      <!-- Toast -->
      <div class="cl-toast" *ngIf="toastMsg">
        <span class="cl-toast-text">{{ toastMsg }}</span>
        <button class="cl-toast-close" (click)="toastMsg = ''">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

    </div>
  `,
  styles: [`
    /* ============================================================
       CLIENT LIST — MOBILE CRM PREMIUM
       Diseño tipo agenda de contactos bancaria/fintech
       ============================================================ */

    .cl {
      max-width: 560px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-bottom: 24px;
    }

    /* ===== HEADER ===== */
    .cl-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 12px;
    }
    .cl-header-text { flex: 1; min-width: 0; }
    .cl-title {
      font-size: 22px; font-weight: 700;
      color: #1E293B; margin: 0; line-height: 1.2;
    }
    .cl-subtitle {
      font-size: 13px; color: #94A3B8;
      margin: 2px 0 0;
    }
    .cl-cta {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 12px 18px;
      background: #2563EB; color: #fff;
      border-radius: 12px;
      font-size: 13px; font-weight: 700;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(37,99,235,0.25);
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .cl-cta:active { transform: scale(0.95); box-shadow: 0 2px 6px rgba(37,99,235,0.15); }
    .cl-cta svg { flex-shrink: 0; }

    /* ===== SEARCH ===== */
    .cl-search {
      position: relative;
      display: flex;
      align-items: center;
    }
    .cl-search-icon {
      position: absolute; left: 14px;
      color: #94A3B8; pointer-events: none;
    }
    .cl-search-input {
      width: 100%; height: 48px;
      padding: 0 16px 0 42px;
      border: 2px solid #E2E8F0;
      border-radius: 14px;
      font-size: 14px; font-weight: 500; font-family: inherit;
      background: #fff;
      color: #0F172A;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .cl-search-input:focus {
      border-color: #2563EB;
      box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
    }
    .cl-search-input::placeholder { color: #94A3B8; font-weight: 400; }

    /* ===== CARD ===== */
    .cl-list { display: flex; flex-direction: column; gap: 12px; }

    .cl-card {
      background: #fff;
      border-radius: 18px;
      padding: 18px 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04);
      animation: clFadeIn 0.35s ease both;
      position: relative;
      position: relative;
    }
    @keyframes clFadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .cl-card-top {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    /* ===== AVATAR ===== */
    .cl-avatar {
      width: 50px; height: 50px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 18px; font-weight: 700;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    /* ===== INFO ===== */
    .cl-info { flex: 1; min-width: 0; }
    .cl-name {
      font-size: 16px; font-weight: 700;
      color: #1E293B; margin: 0;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .cl-badge {
      display: inline-flex; align-items: center; gap: 4px;
      margin-top: 4px;
      font-size: 11px; font-weight: 600;
      color: #2563EB;
      background: #DBEAFE;
      padding: 3px 10px;
      border-radius: 20px;
    }
    .cl-badge svg { flex-shrink: 0; }

    /* ===== MENU BUTTON ===== */
    .cl-menu-btn {
      width: 36px; height: 36px;
      border: none; border-radius: 50%;
      background: transparent;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #94A3B8;
      transition: all 0.15s;
      flex-shrink: 0;
    }
    .cl-menu-btn:hover { background: #F1F5F9; color: #475569; }
    .cl-menu-btn:active { transform: scale(0.9); }

    /* ===== CONTACT ===== */
    .cl-contact {
      display: flex;
      gap: 16px;
      margin-top: 12px;
      flex-wrap: wrap;
    }
    .cl-contact-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 14px; font-weight: 500;
      color: #64748B;
    }
    .cl-contact-item svg {
      color: #94A3B8;
      flex-shrink: 0;
    }

    /* ===== DROPDOWN MENU ===== */
    .cl-backdrop {
      position: fixed; inset: 0; z-index: 99;
      background: transparent;
    }
    .cl-menu {
      position: absolute;
      right: 12px; top: 56px;
      background: #fff;
      border-radius: 14px;
      padding: 6px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      z-index: 20;
      min-width: 180px;
      animation: clMenuIn 0.15s ease both;
    }
    .cl-menu-overlay {
      position: fixed; inset: 0; z-index: 10;
      background: transparent;
    }
    @keyframes clMenuIn {
      from { opacity: 0; transform: translateY(-6px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .cl-menu-item {
      display: flex; align-items: center; gap: 10px;
      width: 100%; padding: 12px 14px;
      border: none; border-radius: 10px;
      background: transparent;
      font-size: 13px; font-weight: 600; font-family: inherit;
      color: #1E293B;
      cursor: pointer; text-decoration: none;
      transition: background 0.1s;
    }
    .cl-menu-item:hover { background: #F8FAFC; }
    .cl-menu-item svg { flex-shrink: 0; color: #94A3B8; }
    .cl-menu-item--danger { color: #DC2626; }
    .cl-menu-item--danger svg { color: #DC2626; }

    /* ===== EMPTY ===== */
    .cl-empty {
      display: flex; flex-direction: column; align-items: center;
      padding: 40px 16px; text-align: center;
    }
    .cl-empty-icon {
      width: 64px; height: 64px;
      border-radius: 50%;
      background: #F1F5F9;
      display: flex; align-items: center; justify-content: center;
      color: #94A3B8;
      margin-bottom: 16px;
    }
    .cl-empty-title {
      font-size: 16px; font-weight: 600;
      color: #1E293B; margin: 0 0 4px;
    }
    .cl-empty-desc {
      font-size: 14px; color: #94A3B8;
      margin: 0 0 20px;
    }
    .cl-empty-btn {
      padding: 12px 24px;
      background: #2563EB; color: #fff;
      border-radius: 12px;
      font-size: 13px; font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
    }
    .cl-empty-btn:active { transform: scale(0.96); opacity: 0.9; }

    /* ===== LOADING ===== */
    .cl-loading { display: flex; flex-direction: column; gap: 12px; }
    .cl-shimmer {
      height: 96px;
      border-radius: 18px;
      background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
      background-size: 200% 100%;
      animation: clShimmer 1.5s infinite;
    }
    @keyframes clShimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    /* ===== CONFIRM MODAL ===== */
    .cl-modal-overlay {
      position: fixed; inset: 0; z-index: 900;
      background: rgba(0,0,0,0.4);
      animation: clModalFade 0.2s ease both;
    }
    @keyframes clModalFade { from { opacity: 0; } to { opacity: 1; } }
    .cl-modal {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 901;
      background: #fff;
      border-radius: 24px 24px 0 0;
      padding: 24px 20px 28px;
      padding-bottom: max(28px, env(safe-area-inset-bottom));
      animation: clModalUp 0.3s cubic-bezier(0.32,1.2,0.5,1) both;
      text-align: center;
    }
    @keyframes clModalUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }
    .cl-modal-icon {
      width: 48px; height: 48px; border-radius: 50%;
      background: #FEF2F2; color: #DC2626;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 12px;
    }
    .cl-modal-title { font-size: 17px; font-weight: 700; color: #1E293B; margin: 0 0 6px; }
    .cl-modal-desc { font-size: 14px; color: #64748B; margin: 0 0 20px; line-height: 1.4; }
    .cl-modal-desc strong { color: #1E293B; }
    .cl-modal-actions { display: flex; gap: 10px; }
    .cl-modal-btn {
      flex: 1; height: 48px; border-radius: 14px;
      font-size: 15px; font-weight: 700; font-family: inherit;
      cursor: pointer; border: none; transition: all 0.15s;
    }
    .cl-modal-btn:active { transform: scale(0.97); }
    .cl-modal-btn--cancel { background: #F1F5F9; color: #475569; }
    .cl-modal-btn--confirm { background: #DC2626; color: #fff; }

    /* ===== TOAST ===== */
    .cl-toast {
      position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
      z-index: 999;
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px;
      background: #DC2626; color: #fff;
      border-radius: 14px;
      font-size: 14px; font-weight: 600;
      box-shadow: 0 4px 20px rgba(220,38,38,0.3);
      animation: clToastIn 0.25s ease both;
      max-width: 90%;
    }
    @keyframes clToastIn {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    .cl-toast-text { flex: 1; }
    .cl-toast-close {
      width: 24px; height: 24px; border: none; border-radius: 50%;
      background: rgba(255,255,255,0.15); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #fff; flex-shrink: 0;
    }

    /* ===== RESPONSIVE ===== */
    @media (min-width: 769px) {
      .cl { padding: 24px 0; gap: 20px; }
      .cl-card { padding: 22px 20px; }
    }
  `]
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  loading = false;
  searchTerm = '';
  openMenuId: number | null = null;
  showConfirm = false;
  deletingClient: Client | null = null;
  toastMsg = '';
  private router = inject(Router);
  private debounceTimer?: ReturnType<typeof setTimeout>;

  avatarGradients = [
    'linear-gradient(135deg, #2563EB, #3B82F6)',
    'linear-gradient(135deg, #7C3AED, #A855F7)',
    'linear-gradient(135deg, #059669, #10B981)',
    'linear-gradient(135deg, #D97706, #F59E0B)',
    'linear-gradient(135deg, #DC2626, #EF4444)',
    'linear-gradient(135deg, #0891B2, #06B6D4)',
    'linear-gradient(135deg, #4F46E5, #6366F1)',
    'linear-gradient(135deg, #BE185D, #EC4899)',
  ];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void { this.loadClients(); }

  loadClients(): void {
    this.loading = true;
    this.clientService.findAll().subscribe({ next: (data) => { this.clients = data; this.loading = false; }, error: () => this.loading = false });
  }

  onSearchInput(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      const term = this.searchTerm.trim();
      if (!term) { this.loadClients(); return; }
      this.loading = true;
      this.clientService.findAll(term, term, term).subscribe({ next: (data) => { this.clients = data; this.loading = false; }, error: () => this.loading = false });
    }, 300);
  }

  toggleMenu(id: number): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  deleteClient(client: Client): void {
    this.deletingClient = client;
    this.showConfirm = true;
    this.openMenuId = null;
  }

  confirmDelete(): void {
    if (!this.deletingClient?.id) return;
    this.showConfirm = false;
    const id = this.deletingClient.id;
    this.deletingClient = null;
    this.clientService.delete(id).subscribe({
      next: () => this.loadClients(),
      error: () => {
        this.toastMsg = 'Error al eliminar el cliente';
        setTimeout(() => this.toastMsg = '', 3000);
      },
    });
  }
}
