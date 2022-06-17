import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../company/entities/company.entity';
import { User } from '../user/entities/user.entity';
import { Recruit } from './entities/recruit.entity';
import { RecruitController } from './recruit.controller';
import { RecruitService } from './recruit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Recruit, User, Company])],
  controllers: [RecruitController],
  providers: [RecruitService],
})
export class RecruitModule {}
