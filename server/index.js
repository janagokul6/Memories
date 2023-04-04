import Express from "express";
import mongoose from "mongoose"
import bodyParser from "body-parser";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js"
import * as dotenv from 'dotenv'

dotenv.config()
const app = Express()
const PORT = process.env.PORT || 5000;
app.use(cors())
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))

app.use("/posts", postRoutes);
app.use("/user", userRoutes);

const MONGODB_URI = process.env.MONGODB_NEW_URL || 'Use your own mongodb database link'


const mongoDbServer = async () => {
    await mongoose.connect(MONGODB_URI, async (err, res) => {
        if (err) {

            console.log("..... error in connnecting mongodb server")
        } else {
            console.log("mongoDb server is Connected");

            // const fetchedData = await res.db.collection("postmessages");
            // fetchedData.find({}).toArray(function (err, data) {
            //     if (err) console.log(err);
            //     else console.log(data);
            // })
        }
    })

}





mongoDbServer()

app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>")
})




app.listen(PORT, () => {
    console.log(`listing to the port at ${PORT}`);
})