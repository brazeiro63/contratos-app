import { Injectable } from '@nestjs/common';
import { StaysService, StaysClientesFilters } from '../stays/stays.service';

@Injectable()
export class ClientesService {
  constructor(private readonly staysService: StaysService) {}

  /**
   * Lista todos os clientes da API Stays com paginação
   */
  async findAll(filters?: StaysClientesFilters, page: number = 1, limit: number = 20) {
    const clientes = await this.staysService.listClientes(filters);

    // Implementar paginação manualmente
    const total = clientes.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const paginatedClientes = clientes.slice(skip, skip + limit);

    // Transformar formato Stays para formato CRM
    return {
      data: paginatedClientes.map(cliente => ({
        id: cliente._id,
        nome: `${cliente.fName} ${cliente.lName}`.trim(),
        email: cliente.email,
        tipo: cliente.kind,
        isUsuario: cliente.isUser,
        dataCadastro: new Date().toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Busca um cliente específico por ID (com detalhes completos)
   */
  async findOne(id: string) {
    const cliente = await this.staysService.getClienteById(id);

    if (!cliente) {
      return null;
    }

    return {
      id: cliente._id,
      nome: `${cliente.fName} ${cliente.lName}`.trim(),
      email: cliente.email,
      tipo: cliente.kind,
      isUsuario: cliente.isUser,
      telefones: cliente.phones || [],
      documentos: cliente.documents || [],
      idiomasAlternativos: cliente.alternateLangs || [],
      ultimoAcesso: cliente.lastAccess ? {
        data: cliente.lastAccess._dt,
        ip: cliente.lastAccess.ip,
        dispositivo: cliente.lastAccess.device,
      } : null,
      reservas: (cliente.reservations || []).map(reserva => ({
        id: reserva._id,
        codigo: reserva.id,
        checkIn: {
          data: reserva.checkInDate,
          hora: reserva.checkInTime,
        },
        checkOut: {
          data: reserva.checkOutDate,
          hora: reserva.checkOutTime,
        },
        tipo: reserva.type,
        moeda: reserva.currency,
        valorTotal: reserva.price._f_total,
        hospedes: reserva.guests,
      })),
      dataCadastro: new Date().toISOString(),
    };
  }
}
