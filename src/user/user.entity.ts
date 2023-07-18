import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'user_tbl', freezeTableName: true })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  featureFlags: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  token: string;
}
