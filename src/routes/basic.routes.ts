import express from 'express';
const router = express.Router();

//Import controllers
import * as basicController from '../controllers/basic.controller';

router.post('/',basicController.getDocuments);
router.get('/number-frequency',basicController.getNumbersFrequency);


export { router };