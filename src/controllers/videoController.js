export const search = (req, res) => res.send("Search Video");
export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home!" });
export const see = (req, res) => res.render("watch");
export const edit = (req, res) => res.render("edit");
export const remove = (req, res) => res.send("Remove Video");
export const upload = (req, res) => res.send("Upload Video");
