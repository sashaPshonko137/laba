import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private db: PrismaService) {}
  async create(body: CreateClientDto) {
    const checkExistPassport = await this.db.client.findFirst({
      where: { passport_data: body?.passport_data },
    });
    if (checkExistPassport) {
      throw new ConflictException('Клиент с таким паспортом существует');
    }

    const client = await this.db.client.create({
      data: {
        surname: body.surname,
        name: body.name,
        lastname: body.lastname,
        birthday: new Date(body.birthday),
        passport_data: body.passport_data,
        salary: body.salary,
        workplace: body.workplace,
        address: body.address,
        phone_number: body.phone_number,
      },
    });

    return client;
  }

  async findAll() {
    const clientsWithSums = await this.db.client.findMany({
      include: {
        contract: {
          select: {
            monthly_payment: true,
          },
        },
      },
    });

    return clientsWithSums;
  }

  async findOne(id: number) {
    const client = await this.db.client.findFirst({
      where: { client_code: id },
    });

    if (!client) {
      throw new NotFoundException('Клиент не найден');
    }
    return client;
  }

  async update(id: number, body: UpdateClientDto) {
    const updatedUser = await this.db.client.update({
      where: { client_code: id },
      data: {
        surname: body.surname,
        name: body.name,
        lastname: body.lastname,
        birthday: new Date(body.birthday),
        passport_data: body.passport_data,
        salary: body.salary,
        workplace: body.workplace,
        address: body.address,
        phone_number: body.phone_number,
      },
    });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async remove(id: number) {
    const client = await this.db.client.findUnique({
      where: { client_code: id },
      include: { contract: true },
    });

    if (client) {
      if (client.contract.length > 0) {
        throw new ConflictException(
          `Клиент ${
            client.surname + ' ' + client.name
          } имеет активные кредиты. Его нельзя удалить. (Сначала удалите кредиты связанные с этим клиентом)`,
        );
      }

      const deletedClient = await this.db.client.delete({
        where: { client_code: id },
      });
      return `Клиент ${
        deletedClient.surname + ' ' + deletedClient.name
      } успешно удален, и кредиты, связанные с ним, также удалены.`;
    }

    throw new NotFoundException(`Клиент ${id} не найден.`);
  }
}
