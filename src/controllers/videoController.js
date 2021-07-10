export const search = (req, res) =>
  res.render("search", { pageTitle: "Search" });
export const trending = (req, res) => res.render("home", { pageTitle: "Home" });
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const remove = (req, res) =>
  res.render("delete", { pageTitle: "Delete" });
export const upload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });
