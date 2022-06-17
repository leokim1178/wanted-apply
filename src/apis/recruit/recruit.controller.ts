import { Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Recruit } from './entities/recruit.entity';
import { RecruitService } from './recruit.service';

interface IRecruit {
  position: string;
}

@Controller()
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  @Get('recruit/fetchall')
  fetchRecruit() {
    return this.recruitService.find();
  }

  @Get('/recruit/search')
  searchRecruit(
    @Req()
    req: Request,
  ) {
    const { search } = req.query;
    console.log(search);

    return this.recruitService.search({ search });
  }

  @Get('/recruit/fetchdetail')
  fetchDetail(
    @Req()
    req: Request,
  ) {
    const { recruit } = req.query;
    return this.recruitService.findDetail({ recruit });
  }

  @Post('/recruit/create')
  createRecruit(
    @Req()
    req: Request,
  ) {
    const { companyId, position, incentive, detail, techStack } = req.body;

    return this.recruitService.create({
      companyId,
      position,
      incentive,
      detail,
      techStack,
    });
  }

  @Post('/recruit/update')
  updateRecruit(
    @Req()
    req: Request,
  ) {
    const { recruitId, position, incentive, detail, techStack } = req.body;
    return this.recruitService.update({
      recruitId,
      position,
      incentive,
      detail,
      techStack,
    });
  }

  @Post('/recruit/delete')
  deleteRecruit(
    @Req()
    req: Request,
  ) {
    const { recruitId } = req.body;
    return this.recruitService.delete({ recruitId });
  }
}
