import { Db } from 'mongodb';
import { UserRole } from '../src/shared/types/User';

module.exports = {
  async up(db: Db) {
    const collection = db.collection('users');
    await collection.updateMany({ role: { $exists: false } }, { $set: { role: UserRole.USER } });
  },

  async down(db: Db) {}
};
