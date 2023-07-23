import { HTTPStatus } from '../../src/shared/helpers/HTTPStatus';
import UseCase from '../UseCase';

jest.setTimeout(15000);
describe('Testing sign up use case', () => {
  beforeEach(async () => {
    await UseCase.unauthenticated.post(UseCase.PATH_REGISTER).send(UseCase.SIGN_UP_REQUEST);
  });

  afterEach(async () => {
    return await UseCase.dropCollections();
  });

  afterAll(async () => {
    return await UseCase.clearDatabase();
  });

  describe(`POST ${UseCase.PATH_LOGIN} as any user`, () => {
    it(`should return ${HTTPStatus.OK} if user credentials are valid`, async () => {
      await UseCase.unauthenticated.post(UseCase.PATH_LOGIN).send(UseCase.SIGN_IN_REQUEST).expect(HTTPStatus.OK);
    });

    it(`should return user details if user credentials are valid`, async () => {
      const response = await UseCase.unauthenticated.post(UseCase.PATH_LOGIN).send(UseCase.SIGN_IN_REQUEST);
      expect(response.body.email).toBe(UseCase.SIGN_IN_REQUEST.email);
      expect(response.body.password).toBeFalsy();
    });

    it(`should set authorization cookie and refresh token cookie if user credentials are valid`, async () => {
      const response = await UseCase.unauthenticated.post(UseCase.PATH_LOGIN).send(UseCase.SIGN_IN_REQUEST);
      const setCookieHeaders = response.headers['set-cookie'].join('');
      expect(setCookieHeaders).toContain(UseCase.JWT_HEADER);
      expect(setCookieHeaders).toContain(UseCase.REFRESH_TOKEN_HEADER);
    });

    it(`should return ${HTTPStatus.UNAUTHORIZED} if email is not correct`, async () => {
      await UseCase.unauthenticated
        .post(UseCase.PATH_LOGIN)
        .send({ ...UseCase.SIGN_IN_REQUEST, email: 'invalid@email.com' })
        .expect(HTTPStatus.UNAUTHORIZED);
    });

    it(`should return ${HTTPStatus.UNAUTHORIZED} if password is not correct`, async () => {
      await UseCase.unauthenticated
        .post(UseCase.PATH_LOGIN)
        .send({ ...UseCase.SIGN_IN_REQUEST, password: 'invalid' })
        .expect(HTTPStatus.UNAUTHORIZED);
    });

    it(`should return ${HTTPStatus.BAD_REQUEST} if request is not valid`, async () => {
      await UseCase.unauthenticated
        .post(UseCase.PATH_LOGIN)
        .send({ invalid: 'invalid' })
        .expect(HTTPStatus.BAD_REQUEST);
    });
  });
});
