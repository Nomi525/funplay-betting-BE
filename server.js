import {
  express,
  cors,
  dbConnection,
  adminRoutes,
  userRoutes,
  commonRoutes,
  cron,
  createAllGamePeriodFromCronJob,
  createAllGameWinnerFromCronJob,
  twelveHourAgoPeriod, transferAllData, transferData,
} from "./src/index.js";
import { server, app } from "./src/config/Socket.config.js";
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/images", express.static("./public/uploads"));

//SET HEADER
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type",
    "application/form-data",
    "multipart/form-data"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/common", commonRoutes);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//cron run for every seconds
cron.schedule("* * * * * *", () => {
  createAllGamePeriodFromCronJob();
});

// // cron run for every seconds
cron.schedule('* * * * * *', () => {
  createAllGameWinnerFromCronJob();
});
// cron.schedule("0 0 * * * *", () => {
//   twelveHourAgoPeriod();
// });




cron.schedule('0 */4 * * *', () => {
  console.log('Running data transfer job every 4 hours');
  transferData();
});

cron.schedule('0 */4 * * *', () => {
  console.log('Running data transfer job every 4 hours');
  transferAllData();
});


// cron.schedule('* * * * *', () => {
//   console.log('Running data transfer job every minute');
//   transferData();
// });

// cron.schedule('* * * * *', () => {
//   console.log('Running data transfer job every minute');
//   transferAllData();
// });

const appServer = server.listen(process.env.PORT, () => {
  dbConnection();
  console.log(`server running on port: ${process.env.PORT}`);
});

export { appServer };
