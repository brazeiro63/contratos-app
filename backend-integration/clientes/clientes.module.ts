import { Module } from '@nestjs/common';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { StaysModule } from '../stays/stays.module';

@Module({
  imports: [StaysModule],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}
