import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { swaggerMessages } from '../consts';

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

  @ApiProperty({
    example: '5c3df910-bdda-416d-83ee-6eecc5c47c48',
    description: swaggerMessages.entities.user.token.description,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  token: string;
}
