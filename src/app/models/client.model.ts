export interface Client {
  id?: number;
  nombre: string;
  celular: string;
  email?: string;
  documentoIdentidad?: string;
  direccion?: string;
  createdAt?: string;
  totalReservas?: number;
  ultimasReservas?: ReservationSummary[];
}

export interface ReservationSummary {
  id: number;
  codigoReserva: string;
  ambienteNombre: string;
  fechaEvento: string;
  estado: string;
  precioTotal: number;
  estadoPago: string;
}
