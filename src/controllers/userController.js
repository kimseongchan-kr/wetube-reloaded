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
  const user = await User.findOne({ username, socialOnly: false });
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

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const apiUrl = "https://api.github.com";

  const config = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: req.query.code,
  };

  //AccessToken을 가져오는 부분
  const accessTokenObj = await (
    await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(config),
    })
  ).json();

  const { access_token } = accessTokenObj;

  //AccessToken이 있다면 유저의 정보를 가져온다.
  if (access_token) {
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        method: "GET",
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    if (!userData.email) {
      const emailDatas = await (
        await fetch(`${apiUrl}/user/emails`, {
          method: "GET",
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
      ).json();

      for (const emailData of emailDatas) {
        if (emailData.primary === true && emailData.verified === true) {
          userData.email = emailData.email;
        }
      }

      if (!userData.email) {
        //이메일이 없을 경우 로그인 창으로 돌려보냄
        return res.redirect("/login");
      }
    }

    let user = await User.findOne({
      email: userData.email,
    });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        socialOnly: true,
        name: userData.name ? userData.name : "Unknown",
        username: userData.login,
        email: userData.email,
        password: "",
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = async (req, res) => {
  return res.render("profile", { pageTitle: "Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { avatarUrl, name, email, username, location },
  } = req;

  const exists = await User.exists({
    $and: [{ _id: { $ne: _id } }, { $or: [{ username }, { email }] }],
  });

  if (exists) {
    return res.status(400).render("profile", {
      pageTitle: "Profile",
      errorMessage: "This username/email is already taken.",
    });
  }

  const user = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl,
      name,
      email,
      username,
      location,
    },
    { returnDocument: "after" }
  );

  req.session.user = user;
  return res.redirect("edit");
};

export const remove = (req, res) => res.send("Remove User");
export const see = (req, res) => res.send("See User");
