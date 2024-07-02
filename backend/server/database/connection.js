import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const URI = process.env.MONGO_URI

const connection = async() => {
    try {
        const db = await mongoose.connect(URI)
        console.log('API REST ucv-fhye-deploy iniciada');
        return db;

    } catch (error) {
        console.log(error);
        throw new Error('No se pudo conectar a la base de datos');
    }
}

export default connection;
