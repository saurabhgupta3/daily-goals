require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Data = require("./models/data.js");
const methodOverride = require("method-override");
const Record = require("./models/record.js");

main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log("err in connecting db", err);
    });

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));

const port = process.env.PORT || 8080;

app.listen(port, () => {
    // console.log(port);
    console.log("listening to port 8080");
});

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({
            username,
            password,
        });
        await newUser.save();
        const allData = await Data.find({ username });
        res.render("dashboard", { username, allData });
    } catch (err) {
        if (err.code === 11000) {
            res.render("signup", { duplicate: true });
        } else {
            res.render("signup", { duplicate: false });
        }
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        res.send("user not found");
    } else {
        if (user.password === password) {
            const allData = await Data.find({ username });
            res.render("dashboard", { allData, username });
        } else {
            res.send("wrong password");
        }
    }
});

app.get("/add", (req, res) => {
    const { username } = req.query;
    // console.log(username);
    res.render("add", { username });
});

app.post("/saveit", async (req, res) => {
    const { username, title, description } = req.body;
    try {
        const newData = new Data({
            username,
            title,
            description,
        });
        await newData.save();
        const allData = await Data.find({ username });
        res.render("dashboard", { allData, username });
    } catch (err) {
        console.log(err);
        res.send("error in saving");
    }
});

app.post("/update", async (req, res) => {
    const { username, check, _id } = req.body;
    try {
        const data = await Data.findById(_id);
        if (data) {
            data.check = !data.check;
            await data.save();
        }
    } catch (err) {
        console.log(err);
    }
    const allData = await Data.find({ username });
    res.render("dashboard", { username, allData });
});

app.delete("/delete", async (req, res) => {
    const { _id, username } = req.body;
    const data = await Data.findByIdAndDelete(_id);
    console.log(data);
    const allData = await Data.find({ username });
    res.render("dashboard", { username, allData });
});

app.get("/record", (req, res) => {
    const { username, percentage } = req.query;
    res.render("date", { username, percentage });
});

app.post("/record", async (req, res) => {
    const { date, username, percentage } = req.body;
    const newRecord = new Record({
        username,
        date,
        percentage,
    });
    try {
        await newRecord.save();
        const allData = await Data.find({ username });
        res.render("dashboard", { username, allData });
    } catch (err) {
        console.log(err);
        res.send("error");
    }
});

app.get("/details", async (req, res) => {
    const { username } = req.query;
    const allRecords = await Record.find({ username });
    res.render("details", { allRecords, username });
});

app.delete("/remove", async (req, res) => {
    let { _id, username } = req.body;
    try {
        console.log(await Record.findByIdAndDelete(_id));
        const allRecords = await Record.find({ username });
        res.render("details", { allRecords, username });
    } catch (err) {
        console.log(err);
        res.send("err in deleting");
    }
});
