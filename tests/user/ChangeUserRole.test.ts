import { HTTPStatus } from '../../src/helpers/HTTPStatus';
import UseCase from '../UseCase';
import { UserRole } from '../../src/types/users/UserRole';

describe('Testing change user role use case', () => {
  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  beforeAll(async () => {
    await UseCase.createDefaultAccountsAndLogin();
  });

  describe(`PATCH ${UseCase.PATH_USERS}/:id as admin`, () => {
    it(`should return ${HTTPStatus.OK} status if user exists`, async () => {
      const userToPatch = await UseCase.findFirstInCollection(UseCase.USERS_COLLECTION);

      await UseCase.admin
        .patch(UseCase.PATH_USERS.concat(`/${userToPatch?._id}`))
        .send(UseCase.CHANGE_ROLE_TO_ADMIN_REQUEST)
        .expect(HTTPStatus.OK);
    });

    it(`should update role if user exists`, async () => {
      const userToPatch = await UseCase.findInCollection(UseCase.USERS_COLLECTION, { email: UseCase.USER_EMAIL });

      await UseCase.admin
        .patch(UseCase.PATH_USERS.concat(`/${userToPatch?._id}`))
        .send(UseCase.CHANGE_ROLE_TO_ADMIN_REQUEST);

      const userAfterPatch = await UseCase.findInCollection(UseCase.USERS_COLLECTION, { email: UseCase.USER_EMAIL });
      expect(userAfterPatch?.role).toBe(UserRole.ADMIN);

      await UseCase.admin
        .patch(UseCase.PATH_USERS.concat(`/${userToPatch?._id}`))
        .send(UseCase.CHANGE_ROLE_TO_USER_REQUEST);

      const userAfterSecondPatch = await UseCase.findInCollection(UseCase.USERS_COLLECTION, {
        email: UseCase.USER_EMAIL
      });
      expect(userAfterSecondPatch?.role).toBe(UserRole.USER);
    });

    it(`should return ${HTTPStatus.BAD_REQUEST} status if request is not valid`, async () => {
      const userToPatch = await UseCase.findFirstInCollection(UseCase.USERS_COLLECTION);

      await UseCase.admin
        .patch(UseCase.PATH_USERS.concat(`/${userToPatch?._id}`))
        .send({ role: 'INVALID_ROLE' })
        .expect(HTTPStatus.BAD_REQUEST);
    });

    it(`should return ${HTTPStatus.NOT_FOUND} status if user not exists`, async () => {
      const userToPatch = await UseCase.findFirstInCollection(UseCase.USERS_COLLECTION);
      const fakeId = UseCase.prepareFakeIdFromId(userToPatch?._id.toString() ?? '-1');

      await UseCase.admin
        .patch(UseCase.PATH_USERS.concat(`/${fakeId}`))
        .send(UseCase.CHANGE_ROLE_TO_ADMIN_REQUEST)
        .expect(HTTPStatus.NOT_FOUND);
    });
  });

  describe(`GET ${UseCase.PATH_USERS}:/id as user`, () => {
    it(`should always return ${HTTPStatus.FORBIDDEN} status`, async () => {
      const userToPatch = await UseCase.findFirstInCollection(UseCase.USERS_COLLECTION);

      await UseCase.user
        .patch(UseCase.PATH_USERS.concat(`/${userToPatch?._id}`))
        .send(UseCase.CHANGE_ROLE_TO_ADMIN_REQUEST)
        .expect(HTTPStatus.FORBIDDEN);
    });
  });

  describe(`GET ${UseCase.PATH_USERS_ME} as unauthenticated`, () => {
    it(`should always return ${HTTPStatus.UNAUTHORIZED} status`, async () => {
      const userToPatch = await UseCase.findFirstInCollection(UseCase.USERS_COLLECTION);

      await UseCase.unauthenticated
        .patch(UseCase.PATH_USERS.concat(`/${userToPatch?._id}`))
        .send(UseCase.CHANGE_ROLE_TO_ADMIN_REQUEST)
        .expect(HTTPStatus.UNAUTHORIZED);
    });
  });
});
