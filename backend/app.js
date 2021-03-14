const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const ExpressValidator = require("express-validator");
require("dotenv").config();

const app = express();

//connecting to the database
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error);
  });

//bring in routes
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

//middleware

app.use(morgan("dev"));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(ExpressValidator());
app.use(cors());

//all routes
app.use("/", postRoutes);
app.use("/", userRoutes);

//error detection
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  }
});

//listening to the server
const Port = process.env.PORT || 3000;

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  // const path = require('path');
  // app.get("*",(req,res)=>{
  //   res.sendFile(path.resolve(__dirname,))
  // })
}
app.listen(Port, () => {
  console.log(`App is listening in Port :${Port}`);
});
