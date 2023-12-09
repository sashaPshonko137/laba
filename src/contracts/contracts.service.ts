import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class ContractsService {
  constructor(private db: PrismaService) {}
  async create(body: CreateContractDto) {
    const contract = await this.db.contracts.create({
      data: {
        contract_type: body.contract_type,
        payment_date: new Date(body.payment_date),
        termination_date: new Date(body.termination_date),
        payout_to_client: body.payout_to_client,
        client_code: body.client_code,
        pledge_code: body.pledge_code,
        employee_code: body.employee_code,
      },
    });

    return contract;
  }

  async findAll() {
    const contracts = await this.db.contracts.findMany();
    return contracts;
  }

  async findOne(id: number) {
    const contract = await this.db.contracts.findFirst({
      where: { contract_code: id },
    });
    return contract;
  }

  async update(id: number, body: UpdateContractDto) {
    const updatedСontract = await this.db.contracts.update({
      where: { contract_code: id },
      data: {
        contract_type: body.contract_type,
        payment_date: new Date(body.payment_date),
        termination_date: new Date(body.termination_date),
        payout_to_client: body.payout_to_client,
        client_code: body.client_code,
        pledge_code: body.pledge_code,
        employee_code: body.employee_code,
      },
    });
    if (!updatedСontract) {
      throw new NotFoundException('Сontract not found');
    }
    return updatedСontract;
  }

  async remove(id: number) {
    const contract = await this.db.contracts.findUnique({
      where: { contract_code: id },
    });

    if (contract) {
      const deletedContract = await this.db.contracts.delete({
        where: { contract_code: id },
      });
      return `Контракт №${deletedContract.contract_code} успешно удален`;
    }
    return null;
  }
}
