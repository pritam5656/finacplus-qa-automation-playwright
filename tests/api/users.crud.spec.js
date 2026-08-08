const { test } = require('../../src/fixtures/api.fixture');
const { users } = require('../../src/data/users');
const { UserPayloadBuilder } = require('../../src/builders/UserPayloadBuilder');

test.describe('ReqRes Users API — create, get, update', () => {
  test('creates a user, retrieves details, and updates the name', async ({ userService }) => {
    const createPayload = UserPayloadBuilder.create(users.create).build();
    const updatePayload = UserPayloadBuilder.create(users.update).build();
    let userId = '';
    let createBody = {};

    await test.step('POST /api/users — create user', async () => {
      ({ userId, createBody } = await userService.createAndValidate(createPayload));
    });

    await test.step('GET /api/users/:id — fetch created user', async () => {
      await userService.getAndValidate(userId, createPayload, createBody);
    });

    await test.step('PUT /api/users/:id — update user name', async () => {
      await userService.updateAndValidate(userId, updatePayload, createPayload.name);
    });
  });
});
