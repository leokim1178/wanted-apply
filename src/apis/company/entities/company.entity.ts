import { Recruit } from 'src/apis/recruit/entities/recruit.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('increment')
  id: string;
  @Column()
  name: string;
  @OneToMany(() => Recruit, (recruits) => recruits.company)
  recruits: Recruit[];
}
