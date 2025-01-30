import mongoose from "mongoose";

export const dbConnect = async ()=>{
    try{
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("DB connected");

    } catch(error){
        console.log('DB connection error', error);
    }
}

