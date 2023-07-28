import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { swaggerMessages } from '../consts';
import { CustomerUser } from './customerUser.entity';
import { User } from '../user/user.entity';

@Table({ tableName: 'customer_tbl', freezeTableName: true })
export class Customer extends Model {
  @ApiProperty({
    example: 1,
    description: swaggerMessages.entities.customer.id.description,
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Sell Cars Dealer',
    description: swaggerMessages.entities.customer.name.description,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

  @ApiProperty({
    example: 'sell-cars-dealer1',
    description: swaggerMessages.entities.customer.name.description,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  login: string;

  @ApiProperty({
    example: '5c3df9106eecc5c47c48',
    description: swaggerMessages.entities.customer.name.description,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @BelongsToMany(() => User, () => CustomerUser)
  users: User[];
}
