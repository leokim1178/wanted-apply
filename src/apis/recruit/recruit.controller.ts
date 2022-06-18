import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Recruit } from './entities/recruit.entity';
import { RecruitService } from './recruit.service';

@Controller()
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  @Get('recruits')
  fetchRecruits() {
    return this.recruitService.find();
  }

  @Get('recruit')
  searchRecruit(
    @Query('search')
    search: string,
  ) {
    try {
      if (!search) throw new NotFoundException('검색어를 입력해주세요');
      return this.recruitService.search({ search });
    } catch (error) {
      return error;
    }
  }

  @Get('recruit/:id')
  async fetchDetail(
    @Param('id')
    recruitId: number,
  ) {
    try {
      const recruit = await this.recruitService.checkExist({ recruitId });
      return this.recruitService.findDetail({ recruit });
    } catch (error) {
      return error;
    }
  }

  @Post('recruit/create/:cId')
  async createRecruit(
    @Param('cId') companyId: number,
    @Body()
    recruitData: Recruit,
  ) {
    try {
      const company = await this.recruitService.checkExist({ companyId });
      return this.recruitService.create({
        company,
        recruitData,
      });
    } catch (error) {
      return error;
    }
  }

  @Patch('recruit/update/:id')
  async updateRecruit(
    @Param('id') recruitId: number, //
    @Body() updateData: Recruit,
  ) {
    try {
      const recruit = await this.recruitService.checkExist({ recruitId });
      return this.recruitService.update({
        recruit,
        updateData,
      });
    } catch (error) {
      return error;
    }
  }

  @Post('recruit/delete/:id')
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

  @Post('recruit/apply')
  async applyRecruit(
    @Body()
    applyData: any,
  ) {
    try {
      const result = await this.recruitService.apply({ applyData });
      return result;
    } catch (error) {
      return error;
    }
  }
}
