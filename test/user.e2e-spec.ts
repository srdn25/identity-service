import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { User } from '../src/user/user.entity';
import { AppModule } from '../src/app.module';
import { userStub } from './stubs/user.stub';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let model: User;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [User],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    model = moduleFixture.get(User);
    await model.sequelize.sync({ force: true });
  });

  it('/users (POST)', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/users')
      .send(userStub[0])
      .expect(HttpStatus.CREATED);

    expect(body).toEqual({
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
      id: body.id,
      ...userStub[0],
    });
  });

  it('/users (GET)', async () => {
    await User.bulkCreate([userStub[1]]);

    const { body } = await request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK);

    expect(body).toEqual([
      {
        createdAt: body[0].createdAt,
        updatedAt: body[0].updatedAt,
        id: body[0].id,
        ...userStub[1],
      },
    ]);
  });

  it('/users/:idOrEmail by email (GET)', async () => {
    await User.bulkCreate(userStub);

    const { body } = await request(app.getHttpServer())
      .get(`/users/${userStub[0].email}`)
      .expect(HttpStatus.OK);

    expect(!!body).toBeTruthy();
    expect(body).toEqual({
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
      id: body.id,
      ...userStub[0],
    });
  });

  it('/users/:idOrEmail by id (GET)', async () => {
    await User.bulkCreate([userStub[0]]);

    const { body } = await request(app.getHttpServer())
      .get('/users/1')
      .expect(HttpStatus.OK);

    expect(!!body).toBeTruthy();
    expect(body).toEqual({
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
      id: body.id,
      ...userStub[0],
    });
  });

  it('/users/:idOrEmail (DELETE) by id', async () => {
    await User.bulkCreate(userStub);
    const existingUser = await User.findOne({
      where: { email: userStub[0].email },
    });

    const { body } = await request(app.getHttpServer())
      .delete(`/users/${existingUser.id}`)
      .expect(HttpStatus.OK);

    expect(body).toEqual(1);

    const deletedUser = await User.findOne({
      where: { email: userStub[0].email },
    });

    expect(!!deletedUser).toBeFalsy();
  });

  it('/users/:idOrEmail (DELETE) by email', async () => {
    await User.bulkCreate(userStub);
    const existingUser = await User.findOne({
      where: { email: userStub[0].email },
    });

    const { body } = await request(app.getHttpServer())
      .delete(`/users/${existingUser.email}`)
      .expect(HttpStatus.OK);

    expect(body).toEqual(1);

    const deletedUser = await User.findOne({
      where: { email: userStub[0].email },
    });

    expect(!!deletedUser).toBeFalsy();
  });
});
