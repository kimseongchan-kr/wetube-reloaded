export const search = (req, res) =>
  res.render("search", { pageTitle: "Search" });
export const trending = (req, res) => {
  const videos = [
    {
      title: "Hello ",
    },
    {
      title: "Video #2",
    },
    {
      title: "Video #3",
    },
  ];
  return res.render("home", { pageTitle: "Home", videos });
};
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const remove = (req, res) =>
  res.render("delete", { pageTitle: "Delete" });
export const upload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });
