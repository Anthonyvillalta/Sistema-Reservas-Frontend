import { Payment } from './payment.model';

export interface Reservation {
  id?: number;
  codigoReserva?: string;
  clientId: number;
  clienteNombre?: string;
  clienteCelular?: string;
  clienteEmail?: string;
  environmentId: number;
  ambienteNombre?: string;
  ambienteTipo?: string;
  fechaEvento: string;
  horaInicio?: string;
  horaFin?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: string;
  precioTotal: number;
  totalPagado?: number;
  saldoPendiente?: number;
  estadoPago?: string;
  adelantoRequerido?: boolean;
  notas?: string;
  tipoEvento?: string;
  precioSillas?: number;
  precioMotor?: number;
  createdBy?: number;
  creadoPorNombre?: string;
  createdAt?: string;
  pagos?: Payment[];
}

export interface Disponibilidad {
  environmentId: number;
  ambienteNombre: string;
  fecha: string;
  disponible: boolean;
  mensaje: string;
  horariosDisponibles: string[];
  horariosOcupados: string[];
}
