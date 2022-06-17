import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Company } from '../company/entities/company.entity';
import { Recruit } from './entities/recruit.entity';

@Injectable()
export class RecruitService {
  constructor(
    @InjectRepository(Recruit)
    private readonly recruitRepository: Repository<Recruit>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async find() {
    const result = await this.recruitRepository.find({
      relations: ['company'],
    });
  }

  async search({ search }) {
    const result = await this.recruitRepository
      .createQueryBuilder('recruit')
      .leftJoinAndSelect('recruit.company', 'company')
      .where('company.name like :companyName', { companyName: `%${search}%` })
      .orWhere('recruit.techStack like :techStack', {
        techStack: `%${search}%`,
      })
      .getMany();
    console.log(result);
    return result;
  }

  async findDetail({ recruit }) {
    const result = await this.recruitRepository
      .createQueryBuilder('recruit')
      .where({ id: recruit })
      .leftJoinAndSelect('recruit.company', 'company')
      .getOne();
    return result;
  }
  async create({
    companyId, //
    position,
    incentive,
    detail,
    techStack,
  }) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    const result: Recruit = await this.recruitRepository.save({
      company,
      position,
      incentive,
      detail,
      techStack,
    });
    return result;
  }

  async update({ recruitId, position, incentive, detail, techStack }) {
    const recruit = await this.recruitRepository.findOne({ id: recruitId });
    return await this.recruitRepository.save({
      ...recruit,
      position,
      incentive,
      detail,
      techStack,
    });
  }

  async delete({ recruitId }) {
    const result = await this.recruitRepository.delete({
      id: recruitId,
    });
    return result.affected ? true : false;
  }
}
