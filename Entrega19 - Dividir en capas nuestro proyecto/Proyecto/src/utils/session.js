import logger from "../utils/logger.js";
const SessionMidle = {
  ctrlUser: (req, res, next) => {
    if (
      req.session?.passport?.user &&
      req.session?.passport?.user !== "" &&
      new Date(req.session?.cookie.expires) >= new Date()
    ) {
      return next();
    }
    logger.warn(`REDIRECT > Tiempo de sesion expirado - utils/session.js:12`);
    return res.redirect("/session/login/?Mesage=Tiempo de sesion expirado");
  },
  ctrlAdmin: (req, res, next) => {
    if (
      req.session?.user?.toLowerCase() === "admin" ||
      req.session?.passport?.user?.toLowerCase() === "admin" ||
      req.session?.admin ||
      req.query.admin
    ) {
      return next();
    }
    logger.warn(`REDIRECT > Permisos denegados - utils/session.js:23`);
    return res.redirect("/session/login/?Mesage=Permisos denegados");
  },
};

export default SessionMidle;
