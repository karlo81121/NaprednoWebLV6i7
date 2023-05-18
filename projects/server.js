const express = require("express");
const app = express();

//routes
const indexRoute = require("./routes/index");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");

const port = 3000;

const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");

const MongoClient = require("mongodb").MongoClient;
const connString =
  "mongodb+srv://adzickarlo74:ltdh-101fm8112@projects.6ncim3k.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(connString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");

    const db = client.db("projects");
    const projectsCollection = db.collection("projects");
    const usersCollection = db.collection("users");

    app.set("view engine", "ejs");
    app.use(express.json());

    app.use("/", indexRoute);
    app.use("/register", registerRoute);
    app.use("/login", loginRoute);

    app.use(express.static("public"));

    app.use(bodyParser.urlencoded({ extended: true }));

    app.get("/projects", (req, res) => {
      projectsCollection
        .find()
        .toArray()
        .then((results) => {
          res.render("projects.ejs", { projects: results });
        })
        .catch((error) => console.error(error));
    });

    app.get("/projects/edit/:id", (req, res) => {
      projectsCollection
        .findOne({ _id: new ObjectId(req.params.id) })
        .then((data) => {
          res.render("edit-project.ejs", { project: data });
        });
    });

    app.get("/projects/details/:id", (req, res) => {
      projectsCollection
        .findOne({ _id: new ObjectId(req.params.id) })
        .then((data) => {
          res.render("project-details.ejs", { project: data });
        });
    });

    app.post("/projects", (req, res) => {
      projectsCollection
        .insertOne(req.body)
        .then(() => {
          res.redirect("/projects");
        })
        .catch((error) => console.error(error));
    });

    app.put("/projects/edit/:id/update", (req, res) => {
      projectsCollection
        .updateOne(
          { _id: new ObjectId(req.params.id) },
          {
            $set: {
              name: req.body.name,
              description: req.body.description,
              price: req.body.price,
              jobs: req.body.jobs,
              start: req.body.start,
              end: req.body.end,
              members: req.body.members,
            },
          }
        )
        .then(() => {
          res.redirect("/projects");
        });
    });

    app.put("/projects/:id/edit", (req, res) => {
      projectsCollection
        .updateOne(
          { _id: new ObjectId(req.params.id) },
          {
            $set: {
              jobs: req.body.jobs
            },
          }
        )
        .then(() => {
          res.redirect("/projects");
        });
    });

    app.delete("/projects/delete/:id", (req, res) => {
      projectsCollection
        .remove({ _id: new ObjectId(req.params.id) })
        .then(() => {
          res.redirect("/projects");
        });
    });

    app.post("/register/user", (req, res) => {
      usersCollection.insertOne(req.body);

      usersCollection.findOne({ email: req.body.email }).then(() => {
        res.redirect("/projects");
      });
    });

    app.all("/login/user", (req, res) => {
      usersCollection
        .findOne({ email: req.body.email, password: req.body.password })
        .then(() => {
          res.redirect("/projects");
        });
    });
    
    app.get("/login", (req, res) => {
      res.render('login.ejs')
    })

    app.get("/register", (req, res) => {
      res.render('register.ejs')
    })

    app.post("/register/user", (req, res) => {
      usersCollection
        .insertOne(req.body)
        .then(() => {
          res.redirect("/projects");
        })
        .catch((error) => console.error(error));
    });

    app.get("/logout", (req, res) => {
      res.redirect("/");
    });

    app.get("/projects/archive", (req, res) => {
      res.render('project-archive.ejs')
    })

    app.listen(port, () => {
      console.log("Listening on port " + port);
    });
  })
  .catch((error) => console.error(error));
