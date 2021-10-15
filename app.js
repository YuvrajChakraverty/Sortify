const express = require("express");
const app = express();
// const PORT = process.env.PORT || 5000
const PORT = 80
var cors = require('cors')
const path = require("path");
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const { match } = require("assert");
mongoose.connect('mongodb+srv://YuvrajChakraverty:security%40101@sortify.gjlg6.mongodb.net/Sortify?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("--- connection est. w/ sortify db ---");
});


app.use('/static', express.static('static'));
app.use(express.urlencoded());
app.use(cors())
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
    fav: Array,
    pl1: Array,
    pl2: Array,
    pl3: Array
});

const trackSchema = new mongoose.Schema({
    name: String,
    artist: String,
    url: String
});

const artistSchema = new mongoose.Schema({
    name: String,
    tracks: Number,
    url: String
});

const User = mongoose.model('User', userSchema);
const track = mongoose.model('track', trackSchema);
const artist = mongoose.model('artist', artistSchema);

app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  })

app.get("/", (req, res) => {
    res.status(200).render("home");
})

app.get("/artists", (req, res) => {
    res.status(200).render("artists");
}) 

app.get("/playlists", (req, res) => {
    res.status(200).render("playlists");
})

app.get("/sign-in", (req, res) => {
    res.status(200).render("sign-in");
})

app.post("/sign-in", (req, res) => {
    res.status(200).render("unavailable");
})

app.get("/sign-up", (req, res) => {
    res.status(200).render("sign-up");
})

app.post("/sign-up", async(req, res) => {
    var userData = new User(req.body);
    const rec= await User.find({ email: userData.email })
    if(!rec.length){
        userData.save().then(()=>{
            res.status(200).render("u_acc_created");
        }).catch(()=>{
            res.status(400).send("Error saving!");
        })
    }
    else{
        res.status(200).render("sign-up", {msg: 1});
    }
})

app.get("/unavailable", (req, res) => {
    res.status(200).render("unavailable");
})

app.post("/unavailable", (req, res) => {
    res.status(200).render("unavailable");
})

app.get("/T&C", (req, res) => {
    res.status(200).render("u_T&C");
})

app.get("/about", (req, res) => {
    res.status(200).render("z_about");
})

app.get("/contactus", (req, res) => {
    res.status(200).render("z_contactus");
})

app.get("/technologies", (req, res) => {
    res.status(200).render("z_technologies");
})

app.get("/feedback", (req, res) => {
    res.status(200).render("z_feedback");
})

var art_name

app.get("/artist", async(req, res) => {
    var _id = req.query.id;
    
    await artist.findById(_id, (err, art)=> {
        if(err){
            res.status(404).send("Artist not found!");
        }
        else{
            art_name=art.name;
            res.status(200).render("artist", art);
        }
    })
})

app.get("/tracksdata/:art_name",async(req,res)=>{
    const {art_name} = req.params;
    const data =await track.find({artist:art_name}); 
    res.send(data);
})

app.get("/artistdp/:art_name",async(req,res)=>{
    const {art_name} = req.params;
    const data =await artist.findOne({name:art_name}); 
    res.send(data);
})

app.listen(PORT, () => {
    console.log(`--- 'Sortify' is live on port: ${PORT} ---`);
});