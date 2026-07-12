export interface Environment {
  id?: number;
  nombre: string;
  tipo: 'EVENTO' | 'HORAS';
  descripcion?: string;
  precioBase: number;
  capacidadMaxima?: number;
  estado: 'ACTIVO' | 'MANTENIMIENTO';
  imagenUrl?: string;
  createdAt?: string;
}
