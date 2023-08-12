import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { swaggerMessages } from '../../consts';

@Table({
  tableName: 'provider_type_tbl',
  freezeTableName: true,
  createdAt: false,
  updatedAt: false,
})
export class ProviderType extends Model {
  @ApiProperty({
    example: 1,
    description: swaggerMessages.entities.providerType.id.description,
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Google',
    description: swaggerMessages.entities.providerType.type.description,
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
