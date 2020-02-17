import { connect } from 'mongoose';

export class MongoHelper {
    public static async connectToDB(connectionString: string) {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        await connect(
            connectionString,
            options,
            (err) => {
                if (err) return console.error('Failed to connect in db!', err);
                console.info('Connection to db was successfull!')
            })
    };
}