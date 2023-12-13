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
    const checkExistPassport = await this.db.clients.findFirst({
      where: { passport_data: body?.passport_data },
    });
    if (checkExistPassport) {
      throw new ConflictException('Unique passport required');
    }

    const client = await this.db.clients.create({
      data: {
        ...body,
      },
    });

    return client;
  }

  async findAll() {
    const clients = await this.db.clients.findMany();
    return clients;
  }

  async findOne(id: number) {
    const clientWithSum = await this.db.clients.findFirst({
      where: { client_code: id },
      include: {
        contracts: {
          select: {
            payout_to_client: true,
          },
        },
      },
    });

    if (!clientWithSum) {
      throw new NotFoundException('Клиент не найден');
    }
    const totalPayout = clientWithSum.contracts.reduce(
      (sum, contract) => sum + (contract.payout_to_client?.toNumber() ?? 0),
      0,
    );
    return { client: clientWithSum, totalPayout };
  }

  async update(id: number, body: UpdateClientDto) {
    const updatedUser = await this.db.clients.update({
      where: { client_code: id },
      data: body,
    });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async remove(id: number) {
    const client = await this.db.clients.findUnique({
      where: { client_code: id },
      include: { contracts: true },
    });

    if (client) {
      if (client.contracts.length > 0) {
        throw new ConflictException(
          `Клиент ${client.full_name} имеет активные контракты. Его нельзя удалить. (Сначала удалите контракты связанные с этим клиентом)`,
        );
      }

      const deletedClient = await this.db.clients.delete({
        where: { client_code: id },
      });
      return `Клиент ${deletedClient.full_name} успешно удален, и контракты, связанные с ним, также удалены.`;
    }

    throw new NotFoundException(`Клиент ${id} не найден.`);
  }
}
