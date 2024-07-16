const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/Users");
const Place = require("./models/Place");
const Booking = require("./models/Booking");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const imageDownloader = require("image-downloader");
const fs = require("fs");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "asdfghjkl";
const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("uploads", express.static(__dirname + "/uploads"));
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    if (error.codeName === "AtlasError") {
      console.error(
        "Atlas-specific error details:",
        error[Symbol.for("errorLabels")]
      );
    }
});

const getUserDataFromReq = (req) =>
{
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
        if(err) throw err
        resolve(userData)
    })
  })
}

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  // res.json(userDoc);
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("password not ok");
    }
  } else {
    res.status(422).json(" not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});


app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  if (!link) {
    return res.status(400).json({ error: 'The "link" parameter is required.' });
  }
  const newName = Date.now() + "photo" + ".jpg";

  try {
    await imageDownloader.image({
      url: link,
      dest: __dirname + "/uploads/" + newName,
    });

    res.json(newName);
  } catch (error) {
    console.error("Image download error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

const photosMiddleWare = multer({ dest: "uploads" });
app.post("/upload", photosMiddleWare.array("photos", 100), async (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("/uploads", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price
    });
    // console.log(placeDo);
  });
});

app.get("/user-places", (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {id} = userData;
        res.json(await Place.find({owner:id}))
    });
});

app.get("/places/:id", async (req, res) => {
    const {id} =req.params;
    res.json(await Place.findById(id))
});

app.put("/places", async (req, res) => {
    const { token } = req.cookies;
    const {id,title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests, price} = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if(err) throw err;
        const placesDoc = await Place.findById(id)
        if (userData.id === placesDoc.owner.toString()) {
            placesDoc.set({ title,address,photos: addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price})
            await placesDoc.save()
            res.json('ok')
        }
    });
});

app.get("/places", async (req, res) => {
    // const {id} =req.params;
    res.json(await Place.find())
});

app.post("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  // place is properties id number for example in above request i use it as id
  const {place,checkIn,checkOut, numberOfGuests, name, phone, price } = req.body;
   Booking.create({place,checkIn,checkOut, numberOfGuests, name, phone, price, user:userData.id}).then((doc) => {
    res.json(doc)
  }).catch((err) => {
    throw err;
  });
});


app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({user:userData.id}).populate('place'))
});


app.listen(3002, () => {
  console.log("server connected");
});
