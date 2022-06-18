import { Company } from 'src/apis/company/entities/company.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Recruit {
  @PrimaryGeneratedColumn('increment')
  id: number;

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

  @JoinTable()
  @ManyToMany(() => User, (applicant) => applicant.applies)
  applicants: User[];
}
