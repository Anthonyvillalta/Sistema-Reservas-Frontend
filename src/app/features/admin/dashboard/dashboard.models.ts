export interface QuickAction {
  icon: string;
  label: string;
  route: string;
  color: string;
}

export interface MonthlyStat {
  icon: string;
  value: string;
  label: string;
  color: string;
  trend?: string;
}

export interface UpcomingReservation {
  id: number;
  ambienteNombre: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
  imagenUrl?: string;
  clienteNombre?: string;
}

export interface IngresoMensual {
  mes: string;
  ingresos: number;
}
