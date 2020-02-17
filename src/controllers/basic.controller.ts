import {Request,Response,NextFunction} from 'express';

export const getData = (req:Request,res:Response,next:NextFunction) =>{
    return res.status(200).json({message:'Hello'});
}