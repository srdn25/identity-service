import {
  BelongsToMany,
  Column,
  DataType,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { swaggerMessages } from '../consts';
import { Provider } from '../provider/provider.entity';
import { CustomerUser } from '../customer/customerUser.entity';
import { Customer } from '../customer/customer.entity';

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
    description: swaggerMessages.entities.user.email.description,
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @ApiProperty({
    example: 'canCreate canUpdate canDelete showNewFeature',
    description: swaggerMessages.entities.user.featureFlag.description,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  featureFlags: string;

  @HasOne(() => Provider)
  provider: Provider;

  @BelongsToMany(() => Customer, () => CustomerUser)
  customers: Customer[];
}
