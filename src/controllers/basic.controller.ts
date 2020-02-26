import { Request, Response, NextFunction } from 'express';
import { KinoModel } from '../models/last-and-active.model';
import { errorHandler } from '../utils/error-handler';

export const getDocuments = async (req: Request, res: Response, next: NextFunction) => {
    const hrstart = process.hrtime();
    const projection = { 
        "last.winningNumbers.list": 1, 
        "last.winningNumbers.bonus": 1, 
        "last.drawId": 1, 
        "last.drawTime": 1,
        "last.winningNumbers.sidebets.winningParity":1,
        "last.winningNumbers.sidebets.winningColumn":1
    };
    try {
        const docs = await KinoModel.find({}, projection)
            .skip(parseInt(req.body.offset))
            .limit(parseInt(req.body.limit)).sort({ "last.drawId": -1 });

        // res.setHeader('X-Total-Count', await KinoModel.find({}).countDocuments());
        res.header('X-Total-Count', (await KinoModel.countDocuments()).toString())

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

//Find number occurences
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
        
        const totalDraws=await KinoModel.countDocuments();

        const result={
            drawCount:totalDraws,
            occurences:occurences.map(oc=>{
                const percentage = (oc.count*100)/totalDraws;
                oc.percentage=Math.round((percentage+Number.EPSILON)*100)/100;
                return oc;
            })
        }
        res.header('X-Total-Count', totalDraws.toString())
        return res.status(200).json(result);

    } catch (error) {
        errorHandler(req, res, next, error, error.status);
    }

}

//Find kinobonus occurences
export const getBonusFrequency = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const numberFrequency = await KinoModel.aggregate([
            { $unwind: "$last.winningNumbers.bonus" },
            { $group: { "_id": "$last.winningNumbers.bonus", "count": { $sum: 1 } } },
            {
                $group: {
                    "_id": null,
                    "occurrence": {
                        $push: {
                            "kinobonus": "$_id",
                            "count": "$count"
                        }
                    }
                }
            },
            {$unwind:"$occurrence"},
            {$sort:{"occurrence.kinobonus":1}},
            { $project: { _id: 0, "occurrence": 1 } }
        ]);
        const occurences = numberFrequency.map(x=>{return x.occurrence});
        
        const totalDraws=await KinoModel.countDocuments();

        const result={
            drawCount:totalDraws,
            occurences:occurences.map(oc=>{
                const percentage = (oc.count*100)/totalDraws;
                oc.percentage=Math.round((percentage+Number.EPSILON)*100)/100;
                return oc;
            })
        }
        res.header('X-Total-Count', totalDraws.toString())
        return res.status(200).json(result);

    } catch (error) {
        errorHandler(req, res, next, error, error.status);
    }

}

//Find list occurences
export const getTopFrequentNumbers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const topFrequent = await KinoModel.aggregate([
            { $unwind: "$last.winningNumbers.list" },
            { $group: { "_id": "$last.winningNumbers.list", "count": { $sum: 1 } } },
            { $sort:{"count":-1}},
            {
                $group: {
                    "_id": null,
                    "frequent": {
                        $push: {
                            "number": "$_id",
                            "count": "$count"
                        }
                    }
                }
            },
            {$unwind:"$frequent"},
            { $project: { _id: 0,"frequent":1, "count": 1 } }
        ]).limit(parseInt(req.body.top));

        res.header('X-Total-Count', (await KinoModel.countDocuments()).toString())
        return res.status(200).json(topFrequent);

    } catch (error) {
        errorHandler(req, res, next, error, error.status);
    }

    

}

export const getTotalNumberOfDarws = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({totalDraws:await KinoModel.countDocuments()});
}