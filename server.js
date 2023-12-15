
import { express, cors, dbConnection, adminRoutes, userRoutes, commonRoutes, cron, createNumberAndCommunityGamePeriodFromCronJob, createColorBettingGamePeriodFromCronJob } from "./src/index.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('./public/uploads'));

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

// cron run for every minute
cron.schedule('* * * * *', () => { 
  createNumberAndCommunityGamePeriodFromCronJob();
});

//cron run for every 30 seconds
cron.schedule('*/30 * * * * * ', () => {
  createColorBettingGamePeriodFromCronJob();
});


const appServer = app.listen(process.env.PORT, () => {
  dbConnection();
  console.log(`server running on port: ${process.env.PORT}`);
});

export { appServer }
