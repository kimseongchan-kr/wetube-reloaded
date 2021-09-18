import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  const exists = await User.exists({ $or: [{ username }, { email }] });

  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }

  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }

  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res
      .status(400)
      .render("join", { pageTitle, errorMessage: error._message });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with username does not exist.",
    });
  }

  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "The password is incorrect.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const config = {
    client_id: process.env.CLIENT_ID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const baseUrl = "https://github.com/login/oauth/authorize";
  const githubLoginUrl = `${baseUrl}?${params}`;

  return res.redirect(githubLoginUrl);
};

export const finishGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";

  const config = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: req.query.code,
  };

  fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(config),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.access_token) {
        const { access_token } = data;

        fetch("https://api.github.com/user", {
          method: "GET",
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
          .then((response) => response.json())
          .then((userData) => {
            fetch("https://api.github.com/user/emails", {
              method: "GET",
              headers: {
                Authorization: `token ${access_token}`,
              },
            })
              .then((response) => response.json())
              .then((emailDatas) => {
                for (const emailData of emailDatas) {
                  if (emailData.primary) {
                    userData.email = emailData.email;
                  }
                }
                return res.send(JSON.stringify(userData));
              });
          });
      } else {
        return res.redirect("/login");
      }
    });
};

export const logout = (req, res) => res.send("Logout");
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const see = (req, res) => res.send("See User");
