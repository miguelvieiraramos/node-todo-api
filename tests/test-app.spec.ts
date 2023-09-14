import { DataSource } from "typeorm";
import app from "../src/app";
import request from "supertest";
import getAppDataSource from "../src/app-data-source";
import { User } from "../src/entities";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

let appDataSource: DataSource;

beforeEach(async () => {
    process.env.NODE_ENV = "test";
    appDataSource = getAppDataSource(process.env.NODE_ENV as string);
    await appDataSource.initialize();
    await appDataSource.synchronize(true);
});

afterEach(async () => {
    await appDataSource.dropDatabase();
});

afterAll(async () => {
    await appDataSource.destroy();
});

describe('SignUp', () => {
    test("Should create user", async () => {
        let userCount = await appDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .getCount();

        expect(userCount).toBe(0);

        const { status, body } = await request(app)
        .post("/signup")
        .send({
            "username": "miguel.ramos",
            "password": "coxinha123",
            "passwordConfirmation": "coxinha123"
        });

        expect(status).toBe(201);
        expect(body).toEqual({});

        userCount = await appDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .getCount();
        expect(userCount).toBe(1);

        const user = await User.findOneBy({id: 1});
        expect(user).toBeTruthy();
        
        let isPasswordVerified = false;
        if (user) {
            isPasswordVerified = await argon2.verify(user.password, "coxinha123");
        }

        expect(isPasswordVerified).toBeTruthy();
    });
});

describe('SignIn', () => {
    test("Should return JWT Token", async () => {
        let userCount = await appDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .getCount();

        expect(userCount).toBe(0);

        await request(app)
        .post("/signup")
        .send({
            "username": "miguel.ramos",
            "password": "coxinha123",
            "passwordConfirmation": "coxinha123"
        });

        userCount = await appDataSource
        .getRepository(User)
        .createQueryBuilder("user")
        .getCount();
        expect(userCount).toBe(1);

        const user = await User.findOneBy({id: 1});
        expect(user).toBeTruthy();
        
        const { status, body } = await request(app)
        .post("/signin")
        .send({
            "username": "miguel.ramos",
            "password": "coxinha123",
        });
        expect(status).toBe(200);
    
        const token = body.token;
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY as string);

        expect(decodedToken).toEqual({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            id: user?.id,
            iat: Math.floor(Date.now() / 1000),
        });
    });
});