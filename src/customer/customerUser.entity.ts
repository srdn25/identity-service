import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Customer } from './customer.entity';
import { ApiProperty } from '@nestjs/swagger';
import { swaggerMessages } from '../consts';

@Table({
  tableName: 'customer_user_tbl',
  freezeTableName: true,
  indexes: [{ fields: ['userId', 'customerId'], unique: true }],
})
export class CustomerUser extends Model {
  @ApiProperty({
    example: 'canCreate canUpdate canDelete showNewFeature',
    description: swaggerMessages.entities.user.featureFlag.description,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  featureFlags: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ForeignKey(() => Customer)
  @Column({ type: DataType.INTEGER })
  customerId: number;

  @BelongsTo(() => User)
  user: User;
}
