import { Db } from 'mongodb'
import { UserRole } from '../src/types/users/UserRole'
import ApplicationConfig from '../src/config/ApplicationConfig'
import bcrypt from 'bcrypt'

module.exports = {
    async up(db: Db) {
        const collection = db.collection('users');
        const maybeAdmin = await collection.findOne({email: ApplicationConfig.adminEmail});
        if (!maybeAdmin) {
            const encryptedPassword = bcrypt.hash(ApplicationConfig.adminPassword, 10);
            await collection.insertOne({name: 'Admin', email: ApplicationConfig.adminEmail, password: encryptedPassword, role: UserRole.ADMIN, birthdate: new Date().toString()})
        }
    },

    async down(db: Db) {}
};