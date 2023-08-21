import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { swaggerMessages } from '../../consts';
import { CustomerUser } from '../customer/customerUser.entity';
import { Customer } from '../customer/customer.entity';
import { UserProvider } from './userProvider.entity';

@Table({ tableName: 'user_tbl', freezeTableName: true })
export class User extends Model {
  @ApiProperty({
    example: 1,
    description: swaggerMessages.entities.user.id.description,
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'user@mail.com',
    description: swaggerMessages.entities.user.guid.description,
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  guid: string;

  @BelongsToMany(() => Customer, () => CustomerUser)
  customers: Customer[];

  @HasMany(() => UserProvider)
  providers: UserProvider[];
}
