import { Connection } from 'typeorm';
import { testConnection } from '../../../test-utils/testConnection';
import { gCall } from '../../../test-utils/gCall';

import { name, internet } from 'faker';
import { User } from '../../../entity/User';

let conn: Connection;

beforeAll(async () => {
  conn = await testConnection();
});

afterAll(async () => {
  await conn.close();
});

const meQuery = `
{
  me {
    id
    firstName
    lastName
    email
  }
}`;

describe('Me', () => {
  it('get user', async () => {
    const user = await User.create({
      firstName: name.firstName(),
      lastName: name.lastName(),
      email: internet.email(),
      password: internet.password(),
    }).save();

    const response = await gCall({
      source: meQuery,
      userId: user.id,
    });

    expect(response).toMatchObject({
      data: {
        me: {
          id: `${user.id}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });
  });

  it('return null', async () => {
    const response = await gCall({
      source: meQuery,
    });
    expect(response).toMatchObject({
      data: {
        me: null,
      },
    });
  });
});
