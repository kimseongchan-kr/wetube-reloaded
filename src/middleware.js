import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return res.redirect("/login");
  }
  next();
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return res.redirect("/");
  }
  next();
};

export const uploadFiles = multer({ dest: "uploads/" });

const objTest = (dest) => {
  const b = {
    create: function () {
      const test = (req, res, next) => {
        console.log("hahaha");
        next();
      };

      return test;
    },
    distory: function (req, res, next) {
      console.log("test!!");
    },
  };

  return b;
};

export const loadFiles = objTest({ dest: "uploads/" });
