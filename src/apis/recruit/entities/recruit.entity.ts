import { Company } from 'src/apis/company/entities/company.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Recruit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  position: string;

  @Column()
  incentive: number;

  @Column({ type: 'longtext' })
  detail: string;

  @Column()
  techStack: string;

  @Column({ default: '한국' })
  country: string;

  @Column({ default: '서울' })
  region: string;

  @ManyToOne(() => Company, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @ManyToMany(() => User, (user) => user.applies, { nullable: true })
  applicants: User[];
}
