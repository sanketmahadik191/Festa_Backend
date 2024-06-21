import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
import "dotenv/config";
import authRoute from "./routes/auth.route.js"
import restRoute from "./routes/rest.route.js"
import twiloRoute from "./routes/twilo.route.js"
import scrapingRoute from "./routes/scraping.js"
import cookieParser from 'cookie-parser';
import menuRoute from './routes/menu.route.js'

const app = express();

const PORT = process.env.PORT || 10000;

mongoose
.connect(process.env.MONGO_URL)
.then(()=>{console.log("Conneted To mongoDB")})
.catch((err)=>{console.log(err)});

app.get('/',(req,res)=>{
  res.send("hello")
})

app.use(cors());
app.use(express.json())
app.use(cookieParser());

app.use('/api/auth',authRoute);
app.use('/api/rest',restRoute);
app.use('/api/rest',menuRoute);
// app.use('/api/twilo',twiloRoute);
// app.use('/api',scrapingRoute);

app.use((err,req,res,next)=>{
  const statusCode = err.statusCode || 500;
  const message = err.message|| 'Internal server error';

  return res.status(statusCode).json({
    success:false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});