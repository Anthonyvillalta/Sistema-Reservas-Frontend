import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyFormat', standalone: true })
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | string | undefined | null): string {
    if (value === null || value === undefined) return 'S/ 0.00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'S/ 0.00';
    return `S/ ${num.toFixed(2)}`;
  }
}
