import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'decimal',
  })
  price!: number;

  @Column()
  make!: string;

  @Column()
  model!: string;

  @Column()
  year!: number;

  @Column({
    type: 'decimal',
  })
  lng!: number;

  @Column({
    type: 'decimal',
  })
  lat!: number;

  @Column()
  mileage!: number;

  @Column({
    default: false,
  })
  approved!: boolean;

  @ManyToOne(() => User, (user) => user.reports)
  user!: User;
}
