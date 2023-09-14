import { DataSource } from "typeorm";
import { Todo, User } from "./entities";
import * as dotenv from "dotenv";
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface DatabaseMap {
    [environment: string]: string
}
const database: DatabaseMap = {
    development: "database.sql",
    test: "test_database.sql",
};

const appDataSource = new DataSource({
    type: "sqlite",
    database: database[process.env.NODE_ENV as string],
    entities: [User, Todo],
    migrations: ['src/migrations/**/*.ts'],
});


export default appDataSource;
