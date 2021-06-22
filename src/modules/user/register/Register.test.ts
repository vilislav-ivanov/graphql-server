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

const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    id
    firstName
    lastName
    email
    name
  }
}`;

describe('Register', () => {
  it('create user', async () => {
    const user = {
      firstName: name.firstName(),
      lastName: name.lastName(),
      email: internet.email(),
      password: internet.password(),
    };

    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: user,
      },
    });

    expect(response).toMatchObject({
      data: {
        register: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });

    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();

    expect(dbUser!.confirmed).toBeFalsy();

    expect(dbUser!.firstName).toBe(user.firstName);
  });
});
