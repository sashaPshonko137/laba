import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePledgeDto } from './dto/create-pledge.dto';
import { UpdatePledgeDto } from './dto/update-pledge.dto';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class PledgesService {
  constructor(private db: PrismaService) {}
  async create(body: CreatePledgeDto) {
    const pledge = await this.db.pledges.create({
      data: {
        ...body,
      },
    });

    return pledge;
  }

  async findAll() {
    const pledges = await this.db.pledges.findMany();
    return pledges;
  }

  async findOne(id: number) {
    const pledge = await this.db.pledges.findFirst({
      where: { pledge_code: id },
    });
    return pledge;
  }

  async update(id: number, body: UpdatePledgeDto) {
    const updatedUser = await this.db.pledges.update({
      where: { pledge_code: id },
      data: body,
    });
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async remove(id: number) {
    const client = await this.db.pledges.findUnique({
      where: { pledge_code: id },
    });

    if (client) {
      const deletedClient = await this.db.pledges.delete({
        where: { pledge_code: id },
      });
      return `Товар ${deletedClient.description} успешно удален`;
    }
    return null;
  }
}
