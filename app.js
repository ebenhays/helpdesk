const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();
require("./database/models");
const indexRouter = require("./api");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
//const csrf = require("csurf");
const compression = require("compression");
const flash = require("connect-flash");
const winston = require("./commons/winston");

//change all to prod when building
var options = {
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE
};

const sessionStore = new MySQLStore(options);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const sessionOptions = {
  key: process.env.SESSION_KEY,
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
};
app.use(session(sessionOptions));

app.use(flash());

// if (app.get("env") === "production") {
//   sessionOptions.cookie.secure = true;
// }

// const csrfProtection = csrf();
// app.use(csrfProtection);

// app.use((req, res, next) => {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: winston.stream }));
app.use(express.static(path.join(__dirname, "public"), { maxAge: 18000000 }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server Started on port ", process.env.PORT);
});
module.exports = app;
