const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Movie = require("./models/movie");
const User = require("./models/user");

const dbURI = `mongodb+srv://sikemaster:sike123@sike.y3egs.mongodb.net/sike-data?retryWrites=true&w=majority`;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use("public", express.static(__dirname + "/public"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("index", { title: "Register", success: false, fax: false });
});

app.get("/admin", function (req, res) {
  Movie.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("movies/admin", { title: "Home", movies: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/user", (req, res) => {
  Movie.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("movies/user", { title: "Home", movies: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});
app.get("/aboutAdmin", (req, res) => {
  res.render("aboutAdmin", { title: "About" });
});
app.get("/admin/create", (req, res) => {
  res.render("create", { title: "New Movie" });
});

app.post("/admin", (req, res) => {
  const movie = new Movie(req.body);

  movie
    .save()
    .then((result) => {
      res.redirect("/admin");
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post("/index", (req, res) => {
  const user = new User(req.body);
  User.findOne({ email: user.email }, function (err, existingUser) {
    if (existingUser == null) {
      user
        .save()
        .then((result) => {
          res.render("index", { title: "Register", success: false, fax: true });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.render("index", { title: "Register", success: true, fax: false });
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login", success: false, fax: false });
});
app.post("/login", (req, res) => {
  const user = new User(req.body);

  User.findOne({ email: user.email }, function (err, existingUser) {
    if (user.email === "admin@gmail.com") {
      if (user.password === "admin") {
        Movie.find()
          .sort({ createdAt: -1 })
          .then((result) => {
            res.redirect("/admin");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.render("login", { title: "login", success: false, fax: true });
      }
    } else if (existingUser) {
      if (existingUser.password === user.password) {
        Movie.find()
          .sort({ createdAt: -1 })
          .then((result) => {
            res.redirect("/user");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.render("login", { title: "login", success: false, fax: true });
      }
    } else {
      res.render("login", { title: "login", success: true, fax: false });
    }
  });
});

app.get("/admin/:id", (req, res) => {
  const id = req.params.id;
  Movie.findById(id)
    .then((result) => {
      res.render("movies/adminDetails", { movie: result });
    })
    .catch((err) => {
      res.status(404).render("404", { title: "404" });
    });
});

app.get("/user/:id", (req, res) => {
  const id = req.params.id;
  Movie.findById(id)
    .then((result) => {
      res.render("movies/details", { movie: result });
    })
    .catch((err) => {
      res.status(404).render("404", { title: "404" });
    });
});

app.post("/user", (req, res) => {
  const value = req.body.search;

  Movie.findOne({ name: value.toLowerCase() })
    .then((result) => {
      const id = result._id;
      Movie.findById(id)
        .then((result) => {
          res.render("movies/details", { movie: result, title: "Details" });
        })
        .catch((err) => {
          res.status(404).render("404", { title: "404" });
        });
    })
    .catch((err) => {
      res.render("404", { title: "404" });
    });
});

app.get("/update/:id", (req, res) => {
  const id = req.params.id;
  Movie.findById(id)
    .then((result) => {
      res.render("update", { title: "Update", movieData: result });
    })
    .catch((err) => {
      res.status(404).render("404", { title: "404" });
    });
});

app.post("/update/:id", (req, res) => {
  Movie.findOneAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      url: req.body.url,
      urlPoster: req.body.urlPoster,
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/admin");
      }
    }
  );
});

app.delete("/admin/:id", (req, res) => {
  const id = req.params.id;

  Movie.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/movies/admin" });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use((req, res) => {
  res.status(400).render("404", { title: "404" });
});
