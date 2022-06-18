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

/**
 * Recruit Service
 */
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

  /**
   * Find one Recruit
   * @param recruitId ID of Recruit
   * @returns `Recruit`
   */
  async findOne({ recruit }): Promise<Recruit> {
    const result: Recruit = await this.recruitRepository
      .createQueryBuilder('recruit')
      .where(recruit)
      .leftJoinAndSelect('recruit.company', 'company')
      .leftJoinAndSelect('company.recruits', 'recruits')
      .getOne();
    return result;
  }

  /**
   * Find All Recruits
   * @returns `[Recruit]`
   */
  async findAll(): Promise<Recruit[]> {
    const result: Recruit[] = await this.recruitRepository.find({
      relations: ['company'],
    });
    return result;
  }

  /**
   * Find All Recruits with 'search'
   * @param {string} search Search keyword of techStack,detail,position,company.name(ex. `원티`,`원티드`,`Python`,`백엔드`)
   * @returns `[Recruit]`
   */
  async search({ search }): Promise<Recruit[]> {
    if (!search) throw new NotFoundException('검색어를 입력해주세요');
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
      .orWhere('recruit.position like :position', {
        position: `%${search}%`,
      })
      .getMany();
    return result;
  }
  /**
   * Create Recruit
   * @param {Company} company
   * @param {CreateRecruitInput} createRecruitInput
   * @returns `Recruit`
   */
  async create({ company, createRecruitInput }): Promise<Recruit> {
    const result: Recruit = await this.recruitRepository.save({
      company,
      ...createRecruitInput,
    });
    return result;
  }

  /**
   * Update Recruit
   * @param {Recruit} recruit
   * @param updateRecruitInput
   * @returns `Recruit`
   */
  async update({ recruit, updateRecruitInput }): Promise<Recruit> {
    const result: Recruit = await this.recruitRepository.save({
      ...recruit,
      ...updateRecruitInput,
    });
    return result;
  }

  /**
   * Delete Recruit
   * @param {Recruit} recruit
   * @returns `Recruit`
   */
  async delete({ recruit }) {
    const result = await this.recruitRepository.delete(recruit);
    return result.affected ? true : false;
  }

  /**
   * Apply Recruit
   * @param applyData
   * @returns `User.applies`
   */
  async apply({ applyData }) {
    const { recruitId, userId } = applyData;
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) throw new NotFoundException('등록되지 않은 유저입니다');
    const recruit = await this.recruitRepository.findOne({
      where: { id: recruitId },
      relations: ['applicants'],
    });
    if (!recruit) throw new NotFoundException('등록되지 않은 채용공고입니다.');

    const applicants = recruit.applicants;
    const filter = applicants.filter((e) => e.id == user.id);
    if (filter.length == 1)
      throw new NotAcceptableException('이미 지원한 채용공고입니다');
    applicants.push(user);
    await this.recruitRepository.save({
      ...recruit,
    });
    const applyResult = await (
      await this.userRepository.findOne({ id: userId })
    ).applies;
    return applyResult;
  }

  /**
   * Check Existence
   * @param {number}recruitId? ID of Recruit
   * @param {number}companyId? ID of Company
   * @returns `Recruit` || `Company`
   */
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
}
