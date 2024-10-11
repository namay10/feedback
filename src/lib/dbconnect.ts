import mongoose from "mongoose";
type conncetionObject = {
  isConnected?: number;
};
const connection: conncetionObject = {};
async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connection.readyState;
    console.log("DB Connected");
  } catch (error) {
    console.log("DB Connection Failed", error);
    process.exit(1);
  }
}
export default dbConnect;
