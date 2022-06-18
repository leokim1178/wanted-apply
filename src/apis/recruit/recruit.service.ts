import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../company/entities/company.entity';
import { User } from '../user/entities/user.entity';
import { Recruit } from './entities/recruit.entity';

@Injectable()
export class RecruitService {
  constructor(
    @InjectRepository(Recruit)
    private readonly recruitRepository: Repository<Recruit>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async find(): Promise<Recruit[]> {
    const result: Recruit[] = await this.recruitRepository.find({
      relations: ['company'],
    });
    return result;
  }

  async search({ search }): Promise<Recruit[]> {
    const result: Recruit[] = await this.recruitRepository
      .createQueryBuilder('recruit')
      .leftJoinAndSelect('recruit.company', 'company')
      .where('company.name like :companyName', { companyName: `%${search}%` })
      .orWhere('recruit.techStack like :techStack', {
        techStack: `%${search}%`,
      })
      .orWhere('recruit.detail like :detail', {
        detail: `%${search}%`,
      })
      .getMany();
    return result;
  }

  async findDetail({ recruit }): Promise<Recruit> {
    const result: Recruit = await this.recruitRepository
      .createQueryBuilder('recruit')
      .where(recruit)
      .leftJoinAndSelect('recruit.company', 'company')
      .leftJoinAndSelect('company.recruits', 'recruits')
      .getOne();
    return result;
  }
  async create({ company, recruitData }): Promise<Recruit> {
    const result: Recruit = await this.recruitRepository.save({
      company,
      ...recruitData,
    });
    return result;
  }

  async update({ recruit, updateData }): Promise<Recruit> {
    const result: Recruit = await this.recruitRepository.save({
      ...recruit,
      ...updateData,
    });
    return result;
  }

  async delete({ recruit }) {
    const result = await this.recruitRepository.delete(recruit);
    return result.affected ? true : false;
  }

  async checkExist({
    recruitId,
    companyId,
  }: {
    recruitId?: number;
    companyId?: number;
  }) {
    if (recruitId) {
      const recruit: Recruit = await this.recruitRepository.findOne({
        id: recruitId,
      });
      if (!recruit)
        throw new NotFoundException('등록되지 않은 채용공고입니다.');
      return recruit;
    }
    if (companyId) {
      const company: Company = await this.companyRepository.findOne({
        id: companyId,
      });
      if (!company) throw new NotFoundException('등록되지 않은 회사입니다.');
      return company;
    }
  }

  async apply({ applyData }) {
    const { recruitId, userId } = applyData;
    const user = await this.userRepository.findOne({ id: userId });
    const recruit = await this.recruitRepository.findOne({
      where: { id: recruitId },
      relations: ['applicants'],
    });

    const applicants = recruit.applicants;
    const filter = applicants.filter((e) => e.id == user.id);
    if (filter.length == 1)
      throw new NotAcceptableException('이미 지원한 채용공고입니다');
    applicants.push(user);
    const result = await this.recruitRepository.save({
      ...recruit,
    });
    return result;
  }
}
