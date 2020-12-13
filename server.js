let bcrypt = require("bcryptjs");
let express = require("express");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let xml2js = require("xml2js");
let mailgun = require("mailgun-js");
let path = require("path");
var Sentry = require("@sentry/node");
var Tracing = require("@sentry/tracing");
let passport = require("passport");
let AWS = require("aws-sdk");
let fs = require("fs");
let algoliasearch = require("algoliasearch");
let fileUpload = require("express-fileupload");
var cors = require("cors");
var url = require("url");
let https = require("https");
let http = require("http");
var compression = require("compression");

let User = require("./models/User");

let users = require("./routes/api/users");

let eventModel = require("./models/eventModal");

let extra = "";
console.log = () => {};
let tinkerFest = mongoose.Schema({
  name: String,
  codingsr: String,
  codingjs: String,
  roboticssr: String,
  roboticsjs: String,
  surpise: String,
  symposium: String,
  audiosr: String,
  audiojr: String,
  moviesr: String,
  moviejr: String,
  designing: String,
  date: { type: Object, default: new Date() },
});

const sessionsSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
  },
  url1: String,
  url2: Object,
  environment: { type: Object, default: process.env },
});

const sessions = mongoose.model("sessions", sessionsSchema);

let fest = mongoose.model("tinkerFest", tinkerFest);

//aws

//mails

let DOMAIN = "arnavgupta.net";
let mg = mailgun({
  apiKey: "key-bc4ce8949101e064ebc107d55b9c1e81",
  domain: DOMAIN,
});

//algolia

let client = algoliasearch("8PCXEU15SU", "fc652d91b2d6db2718b47254be4c5d6e");
let index = client.initIndex("dev_Name");

//ssl
var app = express();

Sentry.init({
  dsn:
    "https://33ec29c28a1647e59e69b8ddf5878c64@o487448.ingest.sentry.io/5546227",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(compression());

app.use(express.static(path.join(__dirname, "./client/build")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.set("trust proxy", true);
// DB Config
let db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

//invites
app.post("/request/invite", (req, res) => {
  let data = {
    from: "Mailgun Sandbox <postmaster@arnavgupta.net>",
    to: `info@arnavgupta.net, ${req.body.email}`,
    subject: "Invitation For Tinker Fest 2020",
    template: "invitationnew",
    "v:test": "test",
  };
  mg.messages().send(data, function (error, body) {
    if (body) {
      res.redirect("/");
    }
  });
});

app.post("/comment/append", (req, res) => {
  bodys = req.body;
  eventModel
    .findByIdAndUpdate(
      bodys.id,
      {
        $addToSet: {
          comments: {
            user: bodys.user,
            comment: bodys.comment,
            image: bodys.image,
            date: bodys.date,
          },
        },
      },
      (error, success) => {
        console.log(error, success);
      }
    )
    .then((e) => res.redirect(`/posted/@Ausername/title/${bodys.id}`));
});
// Routes
app.use("/api/users", users);

app.post("/contact/messages", async (req, res) => {
  body = req.body;
  let queryData = {
    from: "Team Infinity<no-reply@arnavgupta.net>",
    to: `arnav.xx.gupta@gmail.com,info@arnavgupta.net`,
    subject: "Queries",
    text: `email : ${body.email} name : ${body.name} subject : ${body.subject} message : ${body.message}`,
  };
  await mg
    .messages()
    .send(queryData)
    .then((e) => res.redirect("/"));
});

app.get("/delete/:id", async (req, res) => {
  body = req.params.id;
  await eventModel.findByIdAndDelete(body).then((e) => res.redirect("/feed"));
});

app.get("/posts/user/:id", async (req, res) => {
  user = req.params.id;
  await eventModel.find({ name: user }, (error, data) => {
    res.json(data);
  });
});

app.post("/tinkerfest/team/online/website/submit", (req, res) => {
  fest.findOne({ name: req.body.name }, (error, user) => {
    if (user) {
      fest.updateOne(
        { name: req.body.name },
        {
          codingsr: req.body.codingsr,
          codingjs: req.body.codingjs,
          roboticssr: req.body.roboticssr,
          roboticsjs: req.body.roboticsjs,
          surpise: req.body.surpise,
          symposium: req.body.symposium,
          audiosr: req.body.audiosr,
          audiojr: req.body.audiojr,
          moviesr: req.body.moviesr,
          moviejr: req.body.moviejr,
          designing: req.body.designing,
        },
        (error, success) => {
          if (success) {
            res.redirect("/login");
          }
        }
      );
    } else
      fest.create(req.body, (error, success) => {
        if (success) {
          res.redirect("/login");
        }
      });
  });
});

app.get("/tinkerfest/:id", (req, res) => {
  fest.findOne({ name: req.params.id }, (error, user) => {
    res.json(user);
  });
});

app.get("/datas/user/:id", async (req, res) => {
  body = req.params.id;
  await User.findOne({ name: body }, (error, data) => {
    res.json(data);
  });
});

app.post("/verify", async (req, res) => {
  await User.findOne({ _id: req.body.name }, async (error, user) => {
    if (user) {
      if (user.verificationCode == req.body.code) {
        await User.updateOne(
          { _id: req.body.name },
          { confirmed: true },
          (error, success) => {
            if (success) {
              res.redirect("/dashboard");
            }
          }
        );
      } else {
        res.redirect("/");
      }
    }
  });
});

app.post("/teams/edit", async (req, res) => {
  body = req.body;
  rfid = body.idss;
  await eventModel.updateOne(
    { _id: rfid },
    { blog: req.body.blog, imagePath: body.imagePath },
    (error, success) => {
      if (success) {
        res.redirect("/feed");
      }
    }
  );
});

app.get("/user/profile/data/:id", async (req, res) => {
  await User.findOne({ name: req.params.id }, (error, object) => {
    if (object) {
      res.json(object);
    }
  });
});

app.post("/profile/update/data", async (req, res) => {
  body = req.body;
  await User.updateOne(
    { name: req.body.name },
    {
      imagePath: req.body.imagePath,
      biology: req.body.biology,
      website: req.body.website,
      imagePath: req.body.imagePath,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      twitter: req.body.twitter,
      linkedin: req.body.linkedin,
    },
    (error, success) => {
      if (success) {
        res.redirect("/active");
      }
    }
  );
});

app.post("/request/verification", async (req, res) => {
  console.log(req.body);
  id = req.body.users.name[0];
  email = req.body.users.name[1];
  number = Math.floor(100000 + Math.random() * 900000).toString();
  await User.updateOne(
    { _id: id },
    { verificationCode: number },
    async (error, output) => {
      let data = {
        from: "Team Infinity<postmaster@arnavgupta.net>",
        to: `${email}, arnav.xx.gupta@gmail.com`,
        subject: "Confirm",
        text: `Your verification node is ${number}`,
      };
      await mg.messages().send(data, async function (error, body) {
        console.log(body);
      });
    }
  );
});

app.get("/single/post/:id", async (req, res) => {
  await eventModel.findOne({ _id: req.params.id }, async (error, user) => {
    res.json(user);
  });
});

app.post("/teams/submit", async (req, res) => {
  body = req.body;
  await eventModel.create(req.body, async (error, success) => {
    if (success) {
      await fs.readFile(
        "./client-arnav/public/arnavgupta-sitemap.xml",
        "utf-8",
        (err, data) => {
          if (err) {
            throw err;
          }

          // convert XML data to JSON object
          xml2js.parseString(data, async (err, result) => {
            if (err) {
              throw err;
            }
            // add a new database to list
            let postgres = {
              loc: `https://www.arnavgupta.net/posted/@${success.name}/${success.subject}/${success._id}`,
              changefreq: "monthly",
              priority: "1.0",
            };

            result.urlset.url.push(postgres);

            // convert SJON objec to XML
            let builder = new xml2js.Builder();
            let xml = builder.buildObject(result);

            // write updated XML string to a file
            fs.writeFile(
              "./client-arnav/public/arnavgupta-sitemap.xml",
              xml,
              (err) => {
                if (err) {
                  throw err;
                }

                console.log(`Updated XML is written to a new file.`);
              }
            );
          });
        }
      );
      await fs.readFile(
        "./client/public/passionatebloggers-sitemap.xml",
        "utf-8",
        (err, data) => {
          if (err) {
            throw err;
          }

          // convert XML data to JSON object
          xml2js.parseString(data, async (err, result) => {
            if (err) {
              throw err;
            }
            // add a new database to list
            let postgres = {
              loc: `https://www.futureal.ml/posted/@${success.name}/${success.subject}/${success._id}`,
              changefreq: "monthly",
              priority: "1.0",
            };

            result.urlset.url.push(postgres);

            // convert SJON objec to XML
            let builder = new xml2js.Builder();
            let xml = builder.buildObject(result);

            // write updated XML string to a file
            fs.writeFile(
              "./client/public/passionatebloggers-sitemap.xml",
              xml,
              (err) => {
                if (err) {
                  throw err;
                }

                console.log(`Updated XML is written to a new file.`);
              }
            );
          });
        }
      );

      await User.findOne({ name: body.name }, async (error, user) => {
        if (user) {
          let teamdata = {
            from: "Team Infinity<postmaster@arnavgupta.net>",
            to: `${user.email}, arnav.xx.gupta@gmail.com`,
            subject: "New Post",
            text: "The new post was succesfully made",
          };
          await mg.messages().send(teamdata, async function (error, cbody) {
            if (cbody) {
              res.redirect("/login");
            } else {
              res.redirect("/error");
            }
          });
        } else {
          res.redirect("/login");
        }
      });
    } else {
      res.redirect("/login");
    }
  });
});

app.get("/all/posts", async (req, res) => {
  await eventModel.find({}, (error, data) => {
    if (data) {
      res.json(data.reverse());
    }
  });
});

app.post("/follower/append", (req, res) => {
  body = req.body.name;
  console.log(body);
  User.findByIdAndUpdate(body.affected, { $push: { followers: body.affector } })
    .then((e) =>
      User.findByIdAndUpdate(body.affector, {
        $push: { following: body.affected },
      })
    )
    .then((e) =>
      User.findOne({ _id: body.affected }, (error, user) => {
        res.send("done");
      })
    );
});

app.post("/following/pop", (req, res) => {
  body = req.body.name;
  console.log(body);
  User.findByIdAndUpdate(body.affected, { $pull: { followers: body.affector } })
    .then((e) =>
      User.findByIdAndUpdate(body.affector, {
        $pull: { following: body.affected },
      })
    )
    .then((e) =>
      User.findOne({ _id: body.affected }, (error, user) => {
        res.send("done");
      })
    );
});

app.post("/likes/append", (req, res) => {
  body = req.body;
  eventModel
    .findByIdAndUpdate(body.affected, {
      $push: { likes: body.affector },
    })
    .then((e) =>
      eventModel.findByIdAndUpdate(body.affector, {
        $push: { likes: body.affected },
      })
    )
    .then((e) => res.redirect(body.path));
});

app.post("/likes/pop", (req, res) => {
  body = req.body;
  eventModel
    .findByIdAndUpdate(body.affected, {
      $pull: { likes: body.affector },
    })
    .then((e) =>
      eventModel.findByIdAndUpdate(body.affector, {
        $pull: { likes: body.affected },
      })
    )
    .then((e) => res.redirect(body.path));
});
/* renders the react components from port 5000 */
app.get("*", (req, res) => {
  let header = req.headers;
  let connection = req.connection;
  sessions.findOne(
    {
      ipAddress: header["x-forwarded-for"]
        ? header["x-forwarded-for"].split(/, /)[0]
        : connection.remoteAddress,
    },
    (error, success) => {
      if (success) {
        sessions.findByIdAndUpdate(
          success._id,
          {
            url1: "futureal.ml",
            url2: url.parse(req.url),
          },
          (error, success) => {
            if (success) {
              res.sendFile(
                path.join(__dirname, "./client/build", "index.html")
              );
            } else {
              console.log(error);
            }
          }
        );
      } else {
        sessions.create(
          {
            ipAddress: header["x-forwarded-for"]
              ? header["x-forwarded-for"].split(/, /)[0]
              : connection.remoteAddress,
            url1: "futureal.ml",
            url2: url.parse(req.url),
          },
          (error, success) => {
            if (success) {
              res.sendFile(
                path.join(__dirname, "./client/build", "index.html")
              );
            } else {
              console.log(error);
            }
          }
        );
      }
    }
  );
});

let port = process.env.PORT || 5000;
let sport = process.env.PORT || 443;
app.use(Sentry.Handlers.errorHandler());
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen("3000", "0.0.0.0");
let applicationParams = "/";
let serverPort = process.env.PORT || "5000";
let serverParams = "/";
let mongoosePort =
  process.env.MONGODB_URI ||
  "mongodb+srv://Arnav:Arnav300804@cluster0.ahuqv.mongodb.net/health?retryWrites=true&w=majority";

var app3 = express();

Sentry.init({
  dsn:
    "https://c26ed687b6cc4a2a9b8adef70f3372f7@o487448.ingest.sentry.io/5546239",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app3 }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

app3.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app3.use(Sentry.Handlers.tracingHandler());

app3.use(compression());

app3.use(express.static(path.join(__dirname, "./client-arnav/build")));
app3.use(bodyParser.urlencoded({ extended: false }));
app3.use(bodyParser.json());
app3.use(cors());

// Bodyparser middleware
app3.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app3.use(bodyParser.json());
app3.set("trust proxy", true);

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// Passport middleware
app3.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

//invites
app3.post("/request/invite", (req, res) => {
  let data = {
    from: "Mailgun Sandbox <postmaster@arnavgupta.net>",
    to: `info@arnavgupta.net, ${req.body.email}`,
    subject: "Invitation For Tinker Fest 2020",
    template: "invitationnew",
    "v:test": "test",
  };
  mg.messages().send(data, function (error, body) {
    if (body) {
      res.redirect("/");
    }
  });
});

// Routes
app3.use("/api/users", users);

app3.post("/contact/messages", async (req, res) => {
  body = req.body;
  let queryData = {
    from: "Team Infinity<no-reply@arnavgupta.net>",
    to: `arnav.xx.gupta@gmail.com,info@arnavgupta.net`,
    subject: "Queries",
    text: `email : ${body.email} name : ${body.name} subject : ${body.subject} message : ${body.message}`,
  };
  await mg
    .messages()
    .send(queryData)
    .then((e) => res.redirect("/"));
});

app3.get("/delete/:id", async (req, res) => {
  body = req.params.id;
  await eventModel.findByIdAndDelete(body).then((e) => res.redirect("/feed"));
});

app3.get("/posts/user/:id", async (req, res) => {
  user = req.params.id;
  await eventModel.find({ name: user }, (error, data) => {
    res.json(data);
  });
});

app3.post("/tinkerfest/team/online/website/submit", (req, res) => {
  fest.findOne({ name: req.body.name }, (error, user) => {
    if (user) {
      fest.updateOne(
        { name: req.body.name },
        {
          codingsr: req.body.codingsr,
          codingjs: req.body.codingjs,
          roboticssr: req.body.roboticssr,
          roboticsjs: req.body.roboticsjs,
          surpise: req.body.surpise,
          symposium: req.body.symposium,
          audiosr: req.body.audiosr,
          audiojr: req.body.audiojr,
          moviesr: req.body.moviesr,
          moviejr: req.body.moviejr,
          designing: req.body.designing,
        },
        (error, success) => {
          if (success) {
            res.redirect("/login");
          }
        }
      );
    } else
      fest.create(req.body, (error, success) => {
        if (success) {
          res.redirect("/login");
        }
      });
  });
});

app3.get("/tinkerfest/:id", (req, res) => {
  fest.findOne({ name: req.params.id }, (error, user) => {
    res.json(user);
  });
});

app3.get("/datas/user/:id", async (req, res) => {
  body = req.params.id;
  await User.findOne({ name: body }, (error, data) => {
    res.json(data);
  });
});

app3.post("/verify", async (req, res) => {
  await User.findOne({ _id: req.body.name }, async (error, user) => {
    if (user) {
      if (user.verificationCode == req.body.code) {
        await User.updateOne(
          { _id: req.body.name },
          { confirmed: true },
          (error, success) => {
            if (success) {
              res.redirect("/dashboard");
            }
          }
        );
      } else {
        res.redirect("/");
      }
    }
  });
});

app3.post("/teams/edit", async (req, res) => {
  body = req.body;
  rfid = body.idss;
  await eventModel.updateOne(
    { _id: rfid },
    { blog: req.body.blog, imagePath: body.imagePath },
    (error, success) => {
      if (success) {
        res.redirect("/feed");
      }
    }
  );
});

app3.get("/user/profile/data/:id", async (req, res) => {
  await User.findOne({ name: req.params.id }, (error, object) => {
    if (object) {
      res.json(object);
    }
  });
});

app3.post("/profile/update/data", async (req, res) => {
  body = req.body;
  await User.updateOne(
    { name: req.body.name },
    {
      imagePath: req.body.imagePath,
      biology: req.body.biology,
      website: req.body.website,
      imagePath: req.body.imagePath,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      twitter: req.body.twitter,
      linkedin: req.body.linkedin,
    },
    (error, success) => {
      if (success) {
        res.redirect("/active");
      }
    }
  );
});

app3.post("/request/verification", async (req, res) => {
  console.log(req.body);
  id = req.body.users.name[0];
  email = req.body.users.name[1];
  number = Math.floor(100000 + Math.random() * 900000).toString();
  await User.updateOne(
    { _id: id },
    { verificationCode: number },
    async (error, output) => {
      let data = {
        from: "Team Infinity<postmaster@arnavgupta.net>",
        to: `${email}, arnav.xx.gupta@gmail.com`,
        subject: "Confirm",
        text: `Your verification node is ${number}`,
      };
      await mg.messages().send(data, async function (error, body) {
        console.log(body);
      });
    }
  );
});

app3.get("/single/post/:id", async (req, res) => {
  await eventModel.findOne({ _id: req.params.id }, async (error, user) => {
    res.json(user);
  });
});

app3.post("/teams/submit", async (req, res) => {
  body = req.body;
  await eventModel.create(req.body, async (error, success) => {
    if (success) {
      await fs.readFile(
        "./client-arnav/public/arnavgupta-sitemap.xml",
        "utf-8",
        (err, data) => {
          if (err) {
            throw err;
          }

          // convert XML data to JSON object
          xml2js.parseString(data, async (err, result) => {
            if (err) {
              throw err;
            }
            // add a new database to list
            let postgres = {
              loc: `https://www.arnavgupta.net/posted/@${success.name}/${success.subject}/${success._id}`,
              changefreq: "monthly",
              priority: "1.0",
            };

            result.urlset.url.push(postgres);

            // convert SJON objec to XML
            let builder = new xml2js.Builder();
            let xml = builder.buildObject(result);

            // write updated XML string to a file
            fs.writeFile(
              "./client-arnav/public/arnavgupta-sitemap.xml",
              xml,
              (err) => {
                if (err) {
                  throw err;
                }

                console.log(`Updated XML is written to a new file.`);
              }
            );
          });
        }
      );
      await fs.readFile(
        "./client/public/passionatebloggers-sitemap.xml",
        "utf-8",
        (err, data) => {
          if (err) {
            throw err;
          }

          // convert XML data to JSON object
          xml2js.parseString(data, async (err, result) => {
            if (err) {
              throw err;
            }
            // add a new database to list
            let postgres = {
              loc: `https://www.arnavgupta.net/posted/@${success.name}/${success.subject}/${success._id}`,
              changefreq: "monthly",
              priority: "1.0",
            };

            result.urlset.url.push(postgres);

            // convert SJON objec to XML
            let builder = new xml2js.Builder();
            let xml = builder.buildObject(result);

            // write updated XML string to a file
            fs.writeFile(
              "./client/public/passionatebloggers-sitemap.xml",
              xml,
              (err) => {
                if (err) {
                  throw err;
                }

                console.log(`Updated XML is written to a new file.`);
              }
            );
          });
        }
      );

      await User.findOne({ name: body.name }, async (error, user) => {
        if (user) {
          let teamdata = {
            from: "Team Infinity<postmaster@arnavgupta.net>",
            to: `${user.email}, arnav.xx.gupta@gmail.com`,
            subject: "New Post",
            text: "The new post was succesfully made",
          };
          await mg.messages().send(teamdata, async function (error, cbody) {
            if (cbody) {
              res.redirect("/login");
            } else {
              res.redirect("/error");
            }
          });
        } else {
          res.redirect("/login");
        }
      });
    } else {
      res.redirect("/login");
    }
  });
});

app3.get("/all/posts", async (req, res) => {
  await eventModel.find({}, (error, data) => {
    if (data) {
      res.json(data.reverse());
    }
  });
});

app3.post("/follower/append", (req, res) => {
  body = req.body.name;
  console.log(body);
  User.findByIdAndUpdate(body.affected, { $push: { followers: body.affector } })
    .then((e) =>
      User.findByIdAndUpdate(body.affector, {
        $push: { following: body.affected },
      })
    )
    .then((e) =>
      User.findOne({ _id: body.affected }, (error, user) => {
        res.send("done");
      })
    );
});

app3.post("/following/pop", (req, res) => {
  body = req.body.name;
  console.log(body);
  User.findByIdAndUpdate(body.affected, { $pull: { followers: body.affector } })
    .then((e) =>
      User.findByIdAndUpdate(body.affector, {
        $pull: { following: body.affected },
      })
    )
    .then((e) =>
      User.findOne({ _id: body.affected }, (error, user) => {
        res.send("done");
      })
    );
});

app3.post("/comment/append", (req, res) => {
  bodys = req.body;
  eventModel
    .findByIdAndUpdate(
      bodys.id,
      {
        $addToSet: {
          comments: {
            user: bodys.user,
            comment: bodys.comment,
            image: bodys.image,
            date: bodys.date,
          },
        },
      },
      (error, success) => {
        console.log(error, success);
      }
    )
    .then((e) => res.redirect(`/posted/@Ausername/title/${bodys.id}`));
});

app3.post("/likes/append", (req, res) => {
  body = req.body;
  eventModel
    .findByIdAndUpdate(body.affected, {
      $push: { likes: body.affector },
    })
    .then((e) =>
      eventModel.findByIdAndUpdate(body.affector, {
        $push: { likes: body.affected },
      })
    )
    .then((e) => res.redirect(body.path));
});

app3.post("/likes/pop", (req, res) => {
  body = req.body;
  eventModel
    .findByIdAndUpdate(body.affected, {
      $pull: { likes: body.affector },
    })
    .then((e) =>
      eventModel.findByIdAndUpdate(body.affector, {
        $pull: { likes: body.affected },
      })
    )
    .then((e) => res.redirect(body.path));
});

/* renders the react components from port 5000 */
app3.get("*", (req, res) => {
  let header = req.headers;
  let connection = req.connection;
  sessions.findOne(
    {
      ipAddress: header["x-forwarded-for"]
        ? header["x-forwarded-for"].split(/, /)[0]
        : connection.remoteAddress,
    },
    (error, success) => {
      if (success) {
        sessions.findByIdAndUpdate(
          success._id,
          {
            url1: "arnavgupta.net",
            url2: url.parse(req.url),
          },
          (error, success) => {
            if (success) {
              res.sendFile(
                path.join(__dirname, "./client-arnav/build", "index.html")
              );
            } else {
              console.log(error);
            }
          }
        );
      } else {
        sessions.create(
          {
            ipAddress: header["x-forwarded-for"]
              ? header["x-forwarded-for"].split(/, /)[0]
              : connection.remoteAddress,
            url1: "arnavgupta.net",
            url2: url.parse(req.url),
          },
          (error, success) => {
            if (success) {
              res.sendFile(
                path.join(__dirname, "./client-arnav/build", "index.html")
              );
            } else {
              console.log(error);
            }
          }
        );
      }
    }
  );
});
app3.use(Sentry.Handlers.errorHandler());
app3.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});
app3.listen("7000", "0.0.0.0");
