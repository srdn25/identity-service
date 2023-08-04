import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { swaggerMessages } from '../consts';
import { ProviderType } from './providerType.entity';
import { ConfigValidation } from './providers/google/googleConfig.validation';
import { Customer } from '../customer/customer.entity';
import { UserProvider } from '../user/userProvider.entity';

@Table({ tableName: 'provider_tbl', freezeTableName: true })
export class Provider extends Model {
  @ApiProperty({
    example: 1,
    description: swaggerMessages.entities.provider.id.description,
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'my google provider',
    description: swaggerMessages.entities.provider.name.description,
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: 123,
    description: swaggerMessages.entities.provider.customerId.description,
  })
  @ForeignKey(() => Customer)
  @Column({ type: DataType.INTEGER })
  customerId: number;

  @ApiProperty({
    example: true,
    description: swaggerMessages.entities.provider.active.description,
  })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  active: boolean;

  @ApiProperty({
    example: 123,
    description: swaggerMessages.entities.provider.providerTypeId.description,
  })
  @ForeignKey(() => ProviderType)
  @Column({ type: DataType.INTEGER, allowNull: false })
  providerTypeId: number;

  @ApiProperty({
    example: {
      client_id: 'hjdks135',
      client_secret: '5c3df910-bdda-416d-83ee-6eecc5c47c48',
    },
    description: swaggerMessages.entities.provider.config.description,
  })
  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  config: ConfigValidation;

  @BelongsTo(() => ProviderType)
  type: ProviderType;

  @BelongsTo(() => Customer)
  customer: Customer;

  @HasMany(() => UserProvider)
  users: UserProvider[];
}
