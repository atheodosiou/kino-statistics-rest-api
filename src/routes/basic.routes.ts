import express from 'express';
const router = express.Router();

//Import controllers
import * as basicController from '../controllers/basic.controller';

router.post('/',basicController.getDocuments);
router.get('/total',basicController.getDocumentsLength);

export { router };