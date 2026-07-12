export interface Payment {
  id?: number;
  reservationId: number;
  codigoReserva?: string;
  monto: number;
  tipoPago: 'ADELANTO' | 'SALDO' | 'COMPLETO';
  metodoPago: 'EFECTIVO' | 'TRANSFERENCIA' | 'YAPE' | 'TARJETA';
  estado?: string;
  fechaPago?: string;
  referencia?: string;
  createdAt?: string;
}
