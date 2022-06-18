import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRecruitInput } from './dto/createRecruitInput';
import { UpdateRecruitInput } from './dto/updateRecruitInput';
import { Recruit } from './entities/recruit.entity';
import { RecruitService } from './recruit.service';

/**
 * Recruit Controller
 * @APIS `fetchRecruit`,`fetchRecruits`,`searchRecruit`, `createRecruit`,`updateRecruit`, `deleteRecruit`, `applyRecruit`
 */
@Controller()
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  /**
   * Fetch certain Recruit's Detail API
   * @type [`Get`]
   * @param recruitId : number ID of Recruit ex. 1
   * @returns `Recruit`
   */
  @Get('recruit/:id')
  async fetchRecruit(
    @Param('id')
    recruitId: number,
  ): Promise<Recruit> {
    try {
      const recruit = await this.recruitService.checkExist({ recruitId });
      return await this.recruitService.findOne({ recruit });
    } catch (error) {
      return error;
    }
  }

  /**
   * Fetch All Recruits API
   * @type [`Get`]
   * @returns `[Recruit]`
   */
  @Get('recruits')
  async fetchRecruits(): //
  Promise<Recruit[]> {
    try {
      return await this.recruitService.findAll();
    } catch (error) {
      return error;
    }
  }

  /**
   * Fetch All Recruits with search option API
   * @type [`Get`]
   * @query @param {string} search Search keyword of techStack,detail,position,company.name(ex. `원티`,`원티드`,`Python`,`백엔드`)
   * @returns `[Recruit]`
   */
  @Get('recruit')
  async searchRecruit(
    @Query('search')
    search: string,
  ): Promise<Recruit[]> {
    try {
      return await this.recruitService.search({ search });
    } catch (error) {
      return error;
    }
  }

  /**
   * Create Recruit API
   * @type [`Post`]
   * @param {number} companyId  ID of Company ex. 5
   * @param {CreateRecruitInput} createRecruitInput : Body(JSON for createRecruit)
   * @returns `Recruit`
   */
  @Post('recruit/create/:cid')
  async createRecruit(
    @Param('cid') companyId: number,
    @Body()
    createRecruitInput: CreateRecruitInput,
  ) {
    try {
      const company = await this.recruitService.checkExist({ companyId });
      return await this.recruitService.create({
        company,
        createRecruitInput,
      });
    } catch (error) {
      return error;
    }
  }

  /**
   * Update Recruit API
   * @type [`Patch`]
   * @param {number} recruitId ID of Recruit ex. 15
   * @param {UpdateRecruitInput}updateRecruitInput : Body(JSON for createRecruit)
   * @returns `Recruit`
   */
  @Patch('recruit/update/:id')
  async updateRecruit(
    @Param('id') recruitId: number,
    @Body() updateRecruitInput: UpdateRecruitInput,
  ) {
    try {
      const recruit = await this.recruitService.checkExist({ recruitId });
      return await this.recruitService.update({
        recruit,
        updateRecruitInput,
      });
    } catch (error) {
      return error;
    }
  }

  /**
   * Delete Recruit API
   * @type [`Delete`]
   * @param {number} recruitId ID of Recruit ex. 15
   * @returns `Recruit`
   */
  @Delete('recruit/:id')
  async deleteRecruit(
    @Param('id') recruitId: number, //
  ) {
    try {
      const recruit = await this.recruitService.checkExist({ recruitId });
      return this.recruitService.delete({ recruit });
    } catch (error) {
      return error;
    }
  }

  /**
   * Apply Recruit API
   * @type [`Post`]
   * @body applyData : JSON type for updateRecruit
   *  @param {number} recruitId ID of Recruit ex. 15
   *  @param {number} userId ID('uuid') of User ex. `123e4567-e89b-12d3-a456-426614174000`
   * @returns `Recruit`
   */
  @Post('recruit/apply')
  async applyRecruit(
    @Body()
    applyData: any,
  ) {
    try {
      return await this.recruitService.apply({ applyData });
    } catch (error) {
      return error;
    }
  }
}
