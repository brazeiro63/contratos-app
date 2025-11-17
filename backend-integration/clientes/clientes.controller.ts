import { Controller, Get, Query, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ClientesService } from './clientes.service';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  /**
   * GET /api/clientes
   * Lista todos os clientes da Stays com filtros e paginação
   */
  @Get()
  async findAll(
    @Query('hasReservations') hasReservations?: string,
    @Query('reservationFilter') reservationFilter?: 'arrival' | 'departure',
    @Query('reservationFrom') reservationFrom?: string,
    @Query('reservationTo') reservationTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: any = {};

    if (hasReservations !== undefined) {
      filters.hasReservations = hasReservations === 'true';
    }
    if (reservationFilter) {
      filters.reservationFilter = reservationFilter;
    }
    if (reservationFrom) {
      filters.reservationFrom = reservationFrom;
    }
    if (reservationTo) {
      filters.reservationTo = reservationTo;
    }

    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;

    return this.clientesService.findAll(filters, pageNum, limitNum);
  }

  /**
   * GET /api/clientes/:id
   * Busca um cliente específico por ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cliente = await this.clientesService.findOne(id);

    if (!cliente) {
      throw new HttpException('Cliente não encontrado', HttpStatus.NOT_FOUND);
    }

    return cliente;
  }
}
