import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { IUserProfile } from '../provider/providers/google/userProfile.interface';
import { User } from './user.entity';
import { Provider } from '../provider/provider.entity';

@Table({
  tableName: 'user_provider_tbl',
  freezeTableName: true,
  indexes: [{ fields: ['userId', 'providerId'], unique: true }],
})
export class UserProvider extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ForeignKey(() => Provider)
  @Column({ type: DataType.INTEGER })
  providerId: number;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  config: object;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  profile: IUserProfile | object;

  @BelongsTo(() => Provider)
  provider: Provider;
}
