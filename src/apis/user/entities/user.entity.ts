import { Recruit } from 'src/apis/recruit/entities/recruit.entity';
import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Recruit, (recruit) => recruit.applicants, { eager: true })
  applies: Recruit[];
}
