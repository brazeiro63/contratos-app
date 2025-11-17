import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface StaysCliente {
  _id: string;
  kind: string;
  fName: string;
  lName: string;
  email: string;
  isUser: boolean;
}

export interface StaysClienteDetalhado {
  _id: string;
  kind: string;
  fName: string;
  lName: string;
  email: string;
  isUser: boolean;
  phones?: Array<{
    num: string;
    hint?: string;
  }>;
  documents?: Array<{
    type: string;
    numb: string;
  }>;
  alternateLangs?: string[];
  lastAccess?: {
    _dt: string;
    ip: string;
    ua: string;
    device: string;
  };
  reservations?: Array<{
    _id: string;
    id: string;
    checkInDate: string;
    checkInTime: string;
    checkOutDate: string;
    checkOutTime: string;
    _idlisting: string;
    _idclient: string;
    type: string;
    currency: string;
    price: {
      _f_total: number;
    };
    guests: number;
  }>;
}

export interface StaysClientesFilters {
  hasReservations?: boolean;
  reservationFilter?: 'arrival' | 'departure';
  reservationFrom?: string; // YYYY-MM-DD
  reservationTo?: string;   // YYYY-MM-DD
}

@Injectable()
export class StaysService {
  private readonly apiUrl: string;
  private readonly authHeader: string;

  constructor(private configService: ConfigService) {
    const staysUrl = this.configService.get<string>('STAYS_API_URL');
    this.apiUrl = staysUrl ?? 'https://brazeiro.stays.net/external/v1/booking';

    const login = this.configService.get<string>('STAYS_LOGIN') ?? '';
    const password = this.configService.get<string>('STAYS_PASSWORD') ?? '';

    // Validar se as credenciais foram fornecidas
    if (!login || !password) {
      throw new Error('STAYS_LOGIN e STAYS_PASSWORD devem ser configurados no .env');
    }

    // Criar Basic Auth header
    const credentials = Buffer.from(`${login}:${password}`).toString('base64');
    this.authHeader = `Basic ${credentials}`;
  }

  /**
   * Lista clientes da API Stays
   */
  async listClientes(filters?: StaysClientesFilters): Promise<StaysCliente[]> {
    try {
      const url = new URL(`${this.apiUrl}/clients`);

      // Adicionar filtros se fornecidos
      if (filters) {
        if (filters.hasReservations !== undefined) {
          url.searchParams.append('hasReservations', String(filters.hasReservations));
        }
        if (filters.reservationFilter) {
          url.searchParams.append('reservationFilter', filters.reservationFilter);
        }
        if (filters.reservationFrom) {
          url.searchParams.append('reservationFrom', filters.reservationFrom);
        }
        if (filters.reservationTo) {
          url.searchParams.append('reservationTo', filters.reservationTo);
        }
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new HttpException(
          `Erro ao buscar clientes da Stays: ${response.statusText}`,
          response.status,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao conectar com API Stays',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Busca um cliente específico por ID (versão detalhada)
   */
  async getClienteById(id: string): Promise<StaysClienteDetalhado | null> {
    try {
      const url = `${this.apiUrl}/clients/${id}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new HttpException(
          `Erro ao buscar cliente da Stays: ${response.statusText}`,
          response.status,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao conectar com API Stays',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
