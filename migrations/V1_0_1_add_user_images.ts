import { Db } from 'mongodb';
import { DEFAULT_IMAGE } from '../src/shared/helpers/Constants';

module.exports = {
  async up(db: Db) {
    const collection = db.collection('users');
    await collection.updateMany({ image: { $exists: false } }, { $set: { image: DEFAULT_IMAGE } });
  },

  async down(db: Db) {}
};
