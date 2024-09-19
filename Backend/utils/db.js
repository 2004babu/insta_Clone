import mongoose from 'mongoose'
const  dbConnection =async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{}).then(()=>{
            console.log('Data Base Connect Successfully');
            
        }).catch((er)=>{
            console.log(er);
            
        })
        mongoose.set('strictPopulate',false)
    } catch (error) {
        console.log(error);
        
    }
}


export default dbConnection;