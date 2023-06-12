import { SportDiscipline } from '../src/types/sports/SportDiscipline.interface';
import mongoose from 'mongoose';
import request, { SuperAgentTest } from 'supertest';
import { UserRole } from '../src/types/users/UserRole';
const app = require('../src/server');

export default class UseCase {
  public static BASE_PATH = '/api';
  public static PATH_USERS = this.BASE_PATH.concat('/users');
  public static PATH_SPORTS = this.BASE_PATH.concat('/sports');
  public static PATH_AUTH = this.BASE_PATH.concat('/auth');

  public static SPORT_DISCIPLINE: SportDiscipline = { _id: 'a12c', name: 'Volleyball' };

  public static ADMIN_EMAIL = 'admin@email.com';
  public static USER_EMAIL = 'user@email.com';
  public static PASSWORD = 'UserPassword';

  public static admin = request.agent(app);
  public static user = request.agent(app);

  public static closeDatabase = async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
    }

    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  };

  public static registerAndLoginAs = async (as: SuperAgentTest, email: string, role: UserRole) => {
    await as.post(this.PATH_AUTH.concat('/register')).send({
      name: 'User',
      email: email,
      password: this.PASSWORD,
      birthdate: '2000-01-01'
    });
    await mongoose.connection.db
      .collection('users')
      .findOneAndUpdate({ email: email }, { $set: { role: role } });
    await as.post(this.PATH_AUTH.concat('/login')).send({ email: email, password: this.PASSWORD });
  };

  public static logoutAs = async (as: SuperAgentTest) => {
    await as.post(this.PATH_AUTH.concat('/logout'));
  };
}
