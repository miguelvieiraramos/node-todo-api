import { DataSource } from "typeorm";
import { User } from "./entities";

interface DatabaseMap {
    [environment: string]: string
}

const getAppDataSource = (environment: string): DataSource => {
    const database: DatabaseMap = {
        development: "database.sql",
        test: "test_database.sql",
    };

    return new DataSource({
        type: "sqlite",
        database: database[environment],
        entities: [User],
        migrations: ['src/migrations/**/*.ts'],
    });
};

export default getAppDataSource;
