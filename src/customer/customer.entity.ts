import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { swaggerMessages } from '../consts';
import { CustomerUser } from './customerUser.entity';
import { User } from '../user/user.entity';
import { Exclude } from 'class-transformer';
import { ReturnCustomerDataDto } from './dto/returnCustomerData.dto';
import { Provider } from '../provider/provider.entity';

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
    unique: true,
  })
  name: string;

  @ApiProperty({
    example: 'sell-cars-dealer1',
    description: swaggerMessages.entities.customer.name.description,
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  @Index({ unique: true })
  login: string;

  @Exclude()
  @ApiProperty({
    example: '5c3df9106eecc5c47c48',
    description: swaggerMessages.entities.customer.name.description,
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @ApiProperty({
    example: '123456gjfkdsldkfjgfkds-jk',
    description: swaggerMessages.entities.customer.staticToken.description,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  staticToken: string;

  @BelongsToMany(() => User, () => CustomerUser)
  users: User[];

  @HasMany(() => Provider)
  providers: Provider[];

  public serialize(): ReturnCustomerDataDto {
    const data = this.get();

    delete data.password;

    return data;
  }
}
