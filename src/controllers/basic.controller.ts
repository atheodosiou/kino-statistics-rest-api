import { Request, Response, NextFunction } from 'express';
import { KinoModel } from '../models/last-and-active.model';
import { errorHandler } from '../utils/error-handler';

export const getDocuments = async (req: Request, res: Response, next: NextFunction) => {
    const hrstart = process.hrtime();
    try {
        const docs = await KinoModel.find({}, { "last.winningNumbers.list": 1, "last.winningNumbers.bonus": 1, "last.drawId": 1, "last.drawTime": 1 })
            .skip(parseInt(req.body.offset))
            .limit(parseInt(req.body.limit)).sort({ "last.drawId": -1 });

        // res.setHeader('X-Total-Count', await KinoModel.find({}).countDocuments());
        res.header('X-Total-Count', (await KinoModel.find({}).countDocuments()).toString())

        // res.set('X')
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

//Find list occurences
export const getNumbersFrequency = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const numberFrequency = await KinoModel.aggregate([
            { $unwind: "$last.winningNumbers.list" },
            { $group: { "_id": "$last.winningNumbers.list", "count": { $sum: 1 } } },
            {
                $group: {
                    "_id": null,
                    "occurrence": {
                        $push: {
                            "number": "$_id",
                            "count": "$count"
                        }
                    }
                }
            },
            {$unwind:"$occurrence"},
            {$sort:{"occurrence.number":1}},
            { $project: { _id: 0, "occurrence": 1 } }
        ]);
        const occurences = numberFrequency.map(x=>{return x.occurrence});
        const result={
            drawCount:await KinoModel.find({}).countDocuments(),
            occurences
        }
        return res.status(200).json(result);

    } catch (error) {
        errorHandler(req, res, next, error, error.status);
    }

}
