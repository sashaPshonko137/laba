import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private db: PrismaService) {}
  async create(body: CreateEmployeeDto) {
    const checkExistPhoneNumber = await this.db.employees.findFirst({
      where: { phone_number: body?.phone_number },
    });
    if (checkExistPhoneNumber) {
      throw new ConflictException('Unique phone number required');
    }

    const employer = await this.db.employees.create({
      data: {
        full_name: body.full_name,
        address: body.address,
        birth_date: new Date(body.birth_date),
        phone_number: body.phone_number,
        position: body.position,
      },
    });

    return employer;
  }

  async findAll() {
    const employees = await this.db.employees.findMany();
    return employees;
  }

  async findOne(id: number) {
    const client = await this.db.employees.findFirst({
      where: { employee_code: id },
    });
    return client;
  }

  async update(id: number, body: UpdateEmployeeDto) {
    const updatedEmployer = await this.db.employees.update({
      where: { employee_code: id },
      data: {
        full_name: body.full_name,
        address: body.address,
        birth_date: new Date(body.birth_date),
        phone_number: body.phone_number,
        position: body.position,
      },
    });
    if (!updatedEmployer) {
      throw new NotFoundException('Employer not found');
    }
    return updatedEmployer;
  }

  async remove(id: number) {
    const employer = await this.db.employees.findUnique({
      where: { employee_code: id },
    });

    if (employer) {
      const deletedEmployer = await this.db.employees.delete({
        where: { employee_code: id },
      });
      return `Работодатель ${deletedEmployer.full_name} успешно удален`;
    }
    return null;
  }
}
