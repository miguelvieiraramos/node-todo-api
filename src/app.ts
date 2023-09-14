import express, { Express, Request, Response, json } from 'express';
import getAppDataSource from './app-data-source';
import { User } from './entities';
import * as argon2 from "argon2";
import * as dotenv from "dotenv";
import path from 'path';
import jwt from "jsonwebtoken";


dotenv.config({ path: path.resolve(__dirname, '../.env') });

const appDataSource = getAppDataSource(
    process.env.NODE_ENV as string,
);
appDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!"); 
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

const app: Express = express();
app.use(json());

app.post('/signup', async (req: Request, res: Response) => {
    const body = req.body;

    if (!body.username) {
        return res.status(400).send({
            "message": "Missing username parameter."
        });
    }

    if (!body.password) {
        return res.status(400).send({
            "message": "Missing password parameter."
        }); 
    }

    if (!body.passwordConfirmation) {
        return res.status(400).send({
            "message": "Missing passwordConfirmation parameter."
        }); 
    }

    if (!(typeof body.username === "string")) {
        return res.status(400).send({
            "message": "The username parameter must be a string."
        }); 
    }

    if (!(typeof body.password === "string")) {
        return res.status(400).send({
            "message": "The password parameter must be a string."
        }); 
    }

    if (body.username.length > 15) {
        return res.status(400).send({
            "message": "The parameter username must have a maximum of 15 characters."
        }); 
    }

    if (body.password.length < 8) {
        return res.status(400).send({
            "message": "The parameter password must have a minimum of 8 characters."
        }); 
    }

    if (body.password !== body.passwordConfirmation) {
        return res.status(400).send({
            "message": "The parameters password and passwordConfirmation must be equal."
        }); 
    }
    const existingUser = await User.findOneBy({ username: body.username });
    if (existingUser) {
        return res.status(400).send({
            "message": `The username ${body.username} already exists.`
        }); 
    }

    const hashedPassword = await argon2.hash(body.password);

    const user = new User();
    user.username = body.username;
    user.password = hashedPassword;
    await user.save();

    return res.status(201).end();
});

app.post("/signin", async (req: Request, res: Response) => {
    const body = req.body;

    if (!body.username) {
        return res.status(400).send({
            "message": "Missing username parameter."
        });
    }

    if (!body.password) {
        return res.status(400).send({
            "message": "Missing password parameter."
        }); 
    }

    if (!(typeof body.username === "string")) {
        return res.status(400).send({
            "message": "The username parameter must be a string."
        }); 
    }

    if (!(typeof body.password === "string")) {
        return res.status(400).send({
            "message": "The password parameter must be a string."
        }); 
    }

    const user = await User.findOneBy({ username: body.username });
    if (!user) {
        return res.status(400).end();
    }

    const isPasswordCorrect: boolean = await argon2.verify(user.password, body.password);
    if (!isPasswordCorrect) {
        return res.status(400).end();
    }

    return res.send({
        "token": jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                id: user.id
            },
            process.env.SECRET_KEY as string
        )
    });

});

export default app;