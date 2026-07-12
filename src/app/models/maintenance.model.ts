export interface Maintenance {
  id?: number;
  environmentId: number;
  ambienteNombre?: string;
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
  estado?: string;
  creadoPor?: string;
  createdAt?: string;
}
