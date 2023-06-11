import DatabaseConfig from './src/config/DatabaseConfig'
import process from 'process'

require('dotenv').config();
const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

module.exports = {
    mongodb: {
        url: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`,

        databaseName: "",

        options: {
            useNewUrlParser: true
        }
    },

    migrationsDir: "migrations",
    changelogCollectionName: "changelog",
    migrationFileExtension: ".ts",
    useFileHash: false
};