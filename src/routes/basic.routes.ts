import express from 'express';
const router = express.Router();

//Import controllers
import * as basicController from '../controllers/basic.controller';
// import * as mailController from '../controllers/mail.controller';
router.post('/',basicController.getDocuments);
router.get('/number-occurrences',basicController.getNumbersFrequency);
router.get('/kino-bonus-occurrences',basicController.getBonusFrequency);
router.post('/top-frequent-numbers',basicController.getTopFrequentNumbers);
router.get('/total-draws',basicController.getTotalNumberOfDarws);


//email
// router.post('/send',mailController.sendMail);

export { router };