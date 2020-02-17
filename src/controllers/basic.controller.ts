import { Request, Response, NextFunction } from 'express';
import { KinoModel } from '../models/last-and-active.model';
import { errorHandler } from '../utils/error-handler';

export const getTotalDocuments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const total = await KinoModel.find({}).countDocuments();
        return res.status(200).json({ totalDocuments: total });
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