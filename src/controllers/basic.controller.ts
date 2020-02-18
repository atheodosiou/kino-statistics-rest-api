import { Request, Response, NextFunction } from 'express';
import { KinoModel } from '../models/last-and-active.model';
import { errorHandler } from '../utils/error-handler';

export const getDocuments = async (req: Request, res: Response, next: NextFunction) => {
    const hrstart = process.hrtime();
    try {
        const projection = { "last.winningNumbers.list": 1, "last.winningNumbers.bonus": 1, "last.drawTime": 1 };
        const docs = await KinoModel.find({}, projection)
            .skip(parseInt(req.body.offset))
            .limit(parseInt(req.body.limit))
            .sort({ "last.drawTime": -1 });

        res.setHeader('X-Total-Count', await KinoModel.find({}).countDocuments());
        const hrend = process.hrtime(hrstart);
        console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
        return res.status(200).json(docs);

    } catch (error) {
        errorHandler(req, res, next, error, error.status);
    }


}

export const getDocumentByDrawId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const drawId = req.params.drawId;
        let doc: any;
        if (req.params.lastOrActive === 'last') {
            doc = await KinoModel.findOne({ "last.drawId": drawId });
        } else if (req.params.lastOrActive === 'active') {
            doc = await KinoModel.findOne({ "active.drawId": drawId })
        } else {
            errorHandler(req, res, next, 'You can choose the las or the active draw!', 400);
        }
        return res.status(200).json(doc);
    } catch (error) {
        errorHandler(req, res, next, error, error.status);
    }
}

export const getDocumentsLength = async (req: Request, res: Response, next: NextFunction) => {
    const hrstart = process.hrtime();
    try {
        const projection = { _id:0 };
        const total = await KinoModel.aggregate([
            { $group: { _id: null, myCount: { $sum: 1 } } },
            { $project: projection}
        ]);

        // res.setHeader('X-Total-Count', await KinoModel.find({}).countDocuments());
        const hrend = process.hrtime(hrstart);
        console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
        return res.status(200).json({ "total-documents": total[0].myCount });

    } catch (error) {
        errorHandler(req, res, next, error, error.status);
    }
};