import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { client } from './services.ts';
import { TodoRoutes } from './routes/TodoRoutes.ts';
import { validationResult } from 'express-validator';
import morgan from 'morgan';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello World!');
});

TodoRoutes.forEach((route) => {
    (app as any)[route.method](
        route.route,
        route.validation,
        async (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                /* If there are any validation errors, send a resposne wtih error messages */
                return res.status(400).send({ errors: errors.array() });
            }

            try {
                await route.action(
                    req,
                    res,
                    next
                );
            } catch (err) {
                console.log(err);
                return res.sendStatus(500); // Don't expose internal server workings
            }
        }
    )
})

client.connect().then(() => {
    console.log('Connected to MongoDB');

    app.listen(process.env.PORT, () => {
        console.log('Now listening on port ' + process.env.PORT);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    client.close();
});
