import { Pipe, PipeTransform } from '@angular/core';

const statusMap: Record<string, string> = {
  'RESERVADO': 'Reservado',
  'CONFIRMADO': 'Confirmado',
  'EN_PROCESO': 'En Proceso',
  'FINALIZADO': 'Finalizado',
  'CANCELADO': 'Cancelado',
  'PENDIENTE': 'Pendiente',
  'PARCIAL': 'Parcial',
  'PAGADO': 'Pagado',
  'ACTIVO': 'Activo',
  'MANTENIMIENTO': 'En Mantenimiento',
};

@Pipe({ name: 'statusTranslate', standalone: true })
export class StatusTranslatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    // Return mapped value or the original if not found, but title-cased
    return statusMap[value.toUpperCase()] || value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
