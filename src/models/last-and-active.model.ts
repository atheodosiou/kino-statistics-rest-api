import mongoose, { Schema, Document } from 'mongoose';
const addOnSchema = new Schema({
    amount: Number,
    gameType: String
});

const wagerStatisticsSchema = new Schema({
    columns: Number,
    wagers: Number,
    addOn: [addOnSchema]
});

const prizeCategoriesSchema = new Schema({
    id: Number,
    divident: Number,
    winners: Number,
    distributed: Number,
    jackpot: Number,
    fixed: Number,
    categoryType: Number,
    gameType: String
});

//
const columnNumbersSchema = new Schema({
    1: [Number],
    2: [Number],
    3: [Number],
    4: [Number],
    5: [Number],
    6: [Number],
    7: [Number],
    8: [Number],
    9: [Number],
    10: [Number],
});

//

const sidebetsSchema = new Schema({
    evenNumbersCount: Number,
    oddNumbersCount: Number,
    winningColumn: Number,
    winningParity: String,
    oddNumbers: [Number],
    evenNumbers: [Number],
    columnNumbers: { type: columnNumbersSchema }
});


//
const winningNumbersSchema = new Schema({
    list: [Number],
    bonus: [Number],
    sidebets: { type: sidebetsSchema }
});


//


//
const pricePointsSchema = new Schema({
    addOn: [addOnSchema],
    amount: Number
});

//
const lastOrActiveSchema = new Schema({
    gameId: Number,
    drawId: Number,
    drawTime: Number,
    status: String,
    drawBreak: Number,
    visualDraw: Number,
    pricePoints: { type: pricePointsSchema },
    winningNumbers: { type: winningNumbersSchema },
    prizeCategories: [prizeCategoriesSchema],
    wagerStatistics: { type: wagerStatisticsSchema }
});

const lastAndActiveSchema = new Schema({
    last: { type: lastOrActiveSchema },
    active: { type: lastOrActiveSchema }
});

const KinoModel = mongoose.model('LastAndActive', lastAndActiveSchema);

export { KinoModel };