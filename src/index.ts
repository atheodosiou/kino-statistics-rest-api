import express, { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import { connectToDB } from './utils/db';
//Initialize express
const app = express();
//Initialize dotenv
config();

//Import controllers
import * as basicController from './controllers/basic.controller';


const baseUrl = '/api/kino/stats'

//Connect to mongo db
connectToDB();

app.use(express.json());

//Route configuration
app.use(`${baseUrl}/totalEntries`, basicController.getTotalDocuments);
app.use(`${baseUrl}/draw/:drawId/:lastOrActive`, basicController.getDocumentByDrawId);

//Error handling 404
app.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: `Not found. Try using ${baseUrl} instead...` });
})

app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}...`) });