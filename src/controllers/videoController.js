let videos = [
  {
    title: "First Video",
    rating: 5,
    commentts: 2,
    createdAt: "2 miuntes ago",
    views: 1,
    id: 1,
  },
  {
    title: "second Video",
    rating: 5,
    commentts: 2,
    createdAt: "2 miuntes ago",
    views: 59,
    id: 2,
  },
  {
    title: "third Video",
    rating: 5,
    commentts: 2,
    createdAt: "2 miuntes ago",
    views: 59,
    id: 3,
  },
];

export const search = (req, res) =>
  res.render("search", { pageTitle: "Search" });

export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", videos });

export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];

  res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};

export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });

export const remove = (req, res) =>
  res.render("delete", { pageTitle: "Delete" });

export const upload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });
