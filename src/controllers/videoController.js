import Video from "../models/Video";

//globalRoute
export const home = (req, res) => {
  console.log("start");
  Video.find({}, (error, videos) => {
    console.log("finish");
    return res.render("home", { pageTitle: "Home", videos });
  });
  console.log("test");
};

//videoRoute
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  const { title } = req.body;
  return res.redirect("/");
};

export const watch = (req, res) => {
  const { id } = req.params;
  return res.render("watch", { pageTitle: `Watching` });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing` });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};
