import session from "express-session";
import MongoStore from "connect-mongo";
import config from "../../DB/config/config.js";
const advancedOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const sessionMidle = {
  initialize: (app) => {
    const ses = session({
      store: MongoStore.create({
        mongoUrl: config.mongodb.cnxStr,
        mongoOptions: advancedOptions,
      }),
      cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: 600000000,
      },
      secret: "usersession",
      resave: false,
      saveUninitialized: true,
      rolling: true,
    });
    app.use(ses);
    return ses;
  },
};

export default sessionMidle;
