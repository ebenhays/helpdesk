const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
require("dotenv").config();
require("./database/models");
const indexRouter = require("./api");
const session = require("express-session");
const Store = require("express-mysql-session")(session);

// var options = {
//   host: process.env.DB_HOST,
//   port: 3306,
//   user: process.env.SESSION_USER,
//   password: process.env.SESSION_PWD,
//   database: process.env.SESSION_DB,
//   createDatabaseTable: true
// };

//var sessionStore = new Store(options);

const app = express();

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  //store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {}
};
app.use(session(sessionOptions));

if (app.get("env") === "production") {
  sessionOptions.cookie.secure = true;
}
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(helmet());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { message: err.message });
});

app.listen(process.env.WORKING_PORT, () => {
  console.log("Server Started on port ", process.env.WORKING_PORT);
});
module.exports = app;
