import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { EmployeesModule } from './employees/employees.module';
import { PledgesModule } from './pledges/pledges.module';

@Module({
  imports: [ClientsModule, EmployeesModule, PledgesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
