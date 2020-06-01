import express, { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import {setApiKey} from '@sendgrid/mail';

//Initialize express
const app = express();
//Initialize dotenv
config();
setApiKeyForSendGrid();

import { MongoHelper } from './utils/db';

const baseUrl = '/api/kino/stats'
app.use(express.json());

const options:cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token","X-Total-Count"],
    exposedHeaders:["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token","X-Total-Count"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    preflightContinue: false
  };

app.use(cors(options));

//Import routes
import * as basicRoutes from './routes/basic.routes';

//Use Routes
app.use(`${baseUrl}`,cors(), basicRoutes.router);

//Error handling 404
app.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: `Not found. Try using ${baseUrl} instead...` });
})

app.listen(process.env.PORT, async () => {
    console.log(`Server is running on port ${process.env.PORT}...`);
    await MongoHelper.connectToDB(process.env.CONNECTION_STRING as string)
});

//Functions
export function setApiKeyForSendGrid(){
    console.log('SendGrid API key was set!')
    setApiKey(process.env.SENDGRID_API_KEY as string);
}