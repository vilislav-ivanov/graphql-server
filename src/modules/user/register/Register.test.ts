import { Connection } from 'typeorm';
import { testConnection } from '../../../test-utils/testConnection';
import { gCall } from '../../../test-utils/gCall';

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

describe('Login', () => {
  it('create user', async () => {
    console.log(
      await gCall({
        source: registerMutation,
        variableValues: {
          data: {
            firstName: 'Bob',
            lastName: 'John',
            password: '1234567',
            email: 'bob@bob.com',
          },
        },
      })
    );
  });
});
