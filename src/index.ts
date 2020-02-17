import express, { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';

//Initialize express
const app = express();
//Initialize dotenv
config();

//Import controllers
import * as basicController from './controllers/basic.controller';
import { MongoHelper } from './utils/db';

const baseUrl = '/api/kino/stats'
app.use(express.json());

//Routes
app.use(`${baseUrl}/totalEntries`, basicController.getTotalDocuments);
app.use(`${baseUrl}/draw/:drawId/:lastOrActive`, basicController.getDocumentByDrawId);

//Error handling 404
app.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: `Not found. Try using ${baseUrl} instead...` });
})

app.listen(process.env.PORT, async () => {
    console.log(`Server is running on port ${process.env.PORT}...`);
    await MongoHelper.connectToDB(process.env.CONNECTION_STRING as string)
});