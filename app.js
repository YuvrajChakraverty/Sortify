const express = require("express");
const app = express();
// const PORT = process.env.PORT || 5000
const PORT = 80;
require('dotenv').config();
var cors = require('cors');
const path = require("path");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyparser = require("body-parser");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("--- connection est. w/ sortify db ---");
});


app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
    fav: Array,
    arts: Array,
    pl1: Array,
    pl2: Array,
    pl3: Array
});

const trackSchema = new mongoose.Schema({
    name: String,
    artist: String,
    url: String,
    length: String
});

const artistSchema = new mongoose.Schema({
    name: String,
    url: String
});

const feedbackSchema = new mongoose.Schema({
    feedback: String,
    email: String,
    name: String
})


const User = mongoose.model('User', userSchema);
const track = mongoose.model('track', trackSchema);
const artist = mongoose.model('artist', artistSchema);
const feedback = mongoose.model('feedback', feedbackSchema);

app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  });

//   sign-in

app.get("/", (req, res) => {
    res.status(200).render("sign-in");
});

app.post("/", async(req, res) => {
    var enteredData= req.body;
    const rec= await User.findOne({ email: enteredData.email})
    if(rec==null) {
        res.status(200).render("sign-in", {msg: 1});
    }

    else{
        bcrypt.compare(enteredData.password, rec.password, function(err, isMatch){
            if(err) {
                throw err
            }
            else if(!isMatch){
                res.status(200).render("sign-in", {msg: 2});
            }
            else{
                const user_data = { 
                    id: rec._id,
                    email: rec.email,
                    password: rec.password
                 }
                 const data = {
                     name: rec.name,
                     favArtists: rec.arts,
                     nFav: rec.fav.length,
                     nP1: rec.pl1.length,
                     nP2: rec.pl2.length,
                     nP3: rec.pl3.length
                    }
                const accessToken = jwt.sign(user_data, process.env.JWT_SECURITY_KEY, { expiresIn: '604800s' });
                res.status(200).cookie('token', accessToken, {path: '/', expires: new Date(Date.now() + 604799990), httpOnly: true, secure: true}).render("signinsuccess", data);

            }

        });;
    }
});

// sign-up

app.get("/sign-up", (req, res) => {
    res.status(200).render("sign-up");
});

app.post("/sign-up", async(req, res) => {
    var userData = new User(req.body);
    const rec= await User.find({ email: userData.email });
    if(!rec.length){
        const salt =  await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(userData.password, salt);
        userData.password= hashedPass;
        userData.save().then(()=>{
            res.status(200).render("signupsuccess", {name: userData.name});
        }).catch(()=>{
            res.status(400).send("Error saving!");
        })
    }
    else{
        res.status(200).render("sign-up", {msg: 1});
    }
});

app.get("/T&C", (req, res) => {
    res.status(200).render("u_T&C");
});

// footer

app.get("/about", (req, res) => {
    res.status(200).render("z_about");
});

app.get("/contact", (req, res) => {
    res.status(200).render("z_contactus");
});

app.get("/technologies", (req, res) => {
    res.status(200).render("z_technologies");
});

app.get("/feedback", (req, res) => {
    const token= req.cookies.token;
    if (token == null) {
        return res.redirect('/');
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).redirect('/');
    });
    res.status(200).render("z_feedback");
});

app.post("/feedback", async (req, res) => {
    var id=0;
    const token= req.cookies.token;
    if (token == null) {
        return res.redirect('/');
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
      id=user.id;
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).redirect('/');
    });

    const rec= await User.findById(id);
    if(rec==null){
        res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).redirect('/');
    }
    else{
        var feed = new feedback(req.body);
        feed.email= rec.email;
        feed.name= rec.name;
        feed.save().then(()=>{
            res.status(200).render("feedback_submitted");
        }).catch(()=>{
            res.status(400).send("Error saving!");
        })
    }
});

app.get("/feedback_", (req, res) => {
    res.status(200).render("z_feedback_");
});

// navbar

app.get("/home", (req, res) => {
    const token= req.cookies.token;
    if (token == null) {
        return res.redirect('/');
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).redirect('/');
    });
    res.status(200).render("home");
});

app.get("/artists", (req,res) => {
    const token= req.cookies.token;
    if (token == null) {
        return res.redirect('/');
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).redirect('/');
    });
    res.status(200).render("artists");
});

app.get("/playlists", (req, res) => {
    const token= req.cookies.token;
    if (token == null) {
        return res.redirect('/');
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).redirect('/');
    });
    res.status(200).render("playlists");
});

app.get("/favorites", (req, res) => {
    const token= req.cookies.token;
    if (token == null) {
        return res.redirect('/');
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).redirect('/');
    });
    res.status(200).render("favorites");
});

app.get("/account", (req, res) => {
    const token= req.cookies.token;
    if (token == null) {
        return res.redirect('/');
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).redirect('/');
    });
    res.status(200).render("account");
});



// artists

   //  artists grid data API
app.get("/artistsdata", async(req,res)=>{
    const token= req.cookies.token;
    if (token == null) {
        return res.status(403);
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)});
    });
    const data= await artist.find().sort({name:1});
    res.send(data);
});

   //  artist page 
app.get("/artist/:name", async(req, res) => {
    const token= req.cookies.token;
    if (token == null) {
        return res.redirect('/');
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).redirect('/');
    });
    
    const {name}= req.params;
    
        const art= await artist.findOne({name: name})
        if(art==null){
            res.status(404).send("Artist not found!");
        }
        else{
            res.status(200).render("artist", art);
        }
    
});


   //  artist's tracks data API
app.get("/tracksdata/:art_name",async(req,res)=>{
    const token= req.cookies.token;
    if (token == null) {
        return res.status(403);
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)});
    });
    const {art_name} = req.params;
    const data =await track.find({artist:art_name}); 
    res.send(data);
});

   // Artist Favorite Status Change

app.get("/artFavStatusChange", async (req,res) => {
    var id=0;
    const token= req.cookies.token;
    if (token == null) {
        return res.status(403);
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
        id=user.id;
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)});
    });
    const rec= await User.findById(id);
    if(rec==null){
        res.send('User not found!');
    }
    else{
        if(req.query.act=='add'){
            if(rec.arts.includes(req.query.art)==false){
                rec.arts.push(req.query.art);
                rec.save();
                res.send('1');
            }
        }
        else if(req.query.act=='rem'){
            if(rec.arts.includes(req.query.art)==true){
                const ind= rec.arts.indexOf(req.query.art);
                rec.arts.splice(ind,1);
                rec.save();
                res.send('1');
            }
        }
        else{
            res.send('URL error');
        }
    }
});


// playlists

app.get("/playlist", async(req, res) => {

    const token= req.cookies.token;
    if (token == null) {
        return res.redirect('/');
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).redirect('/');
    });
    
    let playlist= {
        number:req.query.playlist
    }

    res.status(200).render("playlist", playlist);
    
});

// favorites

app.get("/favorite-songs", (req,res) => {
    const token= req.cookies.token;
    if (token == null) {
        return res.redirect('/');
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).redirect('/');
    });
    res.status(200).render("fav_songs");
});

    // fav artists API

app.get("/favArtists", async(req,res)=>{
    var id=0;
    const token= req.cookies.token;
    if (token == null) {
        return res.status(403);
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
        id=user.id;
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)});
    });
    const rec= await User.findById(id);
    if(rec==null){
        res.send('User not found!');
    }
    else{
        let favArtists=[];
        const data= await artist.find().sort({name:1});
        for(let i=0;i<data.length;i++){
            if(rec.arts.includes(data[i].name)){
                favArtists.push(data[i]);
            }
        }
        res.send(favArtists);
    }
});

// account

app.get("/update-account", (req,res) => {
    const token= req.cookies.token;
    if (token == null) {
        return res.redirect('/');
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).redirect('/');
    });
    res.status(200).render("update");
});

//  Account Update

app.post("/update-account", async (req,res) => {
    var id=0;
    const token= req.cookies.token;
    if (token == null) {
        return res.redirect('/');
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
        id=user.id;
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).redirect('/');
    });

    const rec= await User.findById(id);
    if(rec==null){
        res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).redirect('/');
    }
    else{
        var emailok=false;
        if(req.body.email===rec.email){
            emailok=true;
        }
        else{
            const rec2= await User.findOne({email: req.body.email});
            if(rec2==null){
                emailok=true;
            }
        }
        if(emailok){
            var update={
                email: req.body.email,
                name: req.body.name,
                password: req.body.password
            }
            if(req.body.passChange=='00000000'){
                update.password= rec.password;
                await User.findOneAndUpdate({_id: id}, update).then(()=>{
                    res.status(200).cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).render('updated');
                }).catch(()=>{
                    res.status(400).send("Error saving!");
                })
            }
            else if(req.body.passChange=='11111111'){
                const salt =  await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash(req.body.password, salt);
                update.password= hashedPass;
                await User.findOneAndUpdate({_id: id}, update).then(()=>{
                    res.status(200).cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).render('updated');
                }).catch(()=>{
                    res.status(400).send("Error saving!");
                })
            }
            else{
                res.status(404).send('Error! Sign-In again.');
            }
        }
        else{
            res.render('update', {msg: 1})
        }
        
    }
});

app.get("/deleteAccount", async(req,res)=>{
    var id=0;
    const token= req.cookies.token;
    if (token == null) {
        return res.status(403);
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
      id=user.id;
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)});
    });
    User.deleteOne({_id: id}).then(()=>{
        res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)}).send('1');
    }).catch(()=>{
        res.status(400).send("Error!");
    });

});

app.get("/account-deleted", (req,res)=>{
    res.status(200).render('deleted');
});


// Other APIs

   // User Tracks API

app.get("/userTracks", async(req,res)=>{
    var id=0;
    const token= req.cookies.token;
    if (token == null) {
        return res.status(403);
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
        id=user.id;
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)});
    });
    const rec= await User.findById(id);
    if(rec==null){
        res.send('User not found!');
    }
    else{
        let tracks=[];
        const data= await track.find();
        if(req.query.list=='fav'){
            for(let i=0;i<rec.fav.length;){
                for(let j=0;j<data.length;j++){
                    if(rec.fav[i]==(data[j].name)){
                        tracks.push(data[j]);
                        i++;
                        break;
                    }
                }
            }
        }
        else if(req.query.list=='pl1'){
            for(let i=0;i<rec.pl1.length;){
                for(let j=0;j<data.length;j++){
                    if(rec.pl1[i]==(data[j].name)){
                        tracks.push(data[j]);
                        i++;
                        break;
                    }
                }
            }
        }
        else if(req.query.list=='pl2'){
            for(let i=0;i<rec.pl2.length;){
                for(let j=0;j<data.length;j++){
                    if(rec.pl2[i]==(data[j].name)){
                        tracks.push(data[j]);
                        i++;
                        break;
                    }
                }
            }
        }
        else if(req.query.list=='pl3'){
            for(let i=0;i<rec.pl3.length;){
                for(let j=0;j<data.length;j++){
                    if(rec.pl3[i]==(data[j].name)){
                        tracks.push(data[j]);
                        i++;
                        break;
                    }
                }
            }
        }
        else{
            res.send('error in URL');
        }


        res.send(tracks);
    }
});

   // Add Track API

app.get("/addTrack", async(req,res) => {
    var id=0;
    const token= req.cookies.token;
    if (token == null) {
        return res.status(403);
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
        id=user.id;
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)});
    });
    const rec= await User.findById(id);
    if(rec==null){
        res.send('User not found!');
    }
    else{
        var song=req.query.track;
        if(req.query.list=='fav'){
            if(rec.fav.includes(song)==false){
                rec.fav.push(song);
                rec.save();
                res.send('1');
            }
            else{
                res.send('2');
            }
        }
        else if(req.query.list=='pl1'){
            if(rec.pl1.includes(song)==false){
                rec.pl1.push(song);
                rec.save();
                res.send('1');
            }
            else{
                res.send('2');
            }
        }
        else if(req.query.list=='pl2'){
            if(rec.pl2.includes(song)==false){
                rec.pl2.push(song);
                rec.save();
                res.send('1');
            }
            else{
                res.send('2');
            }
        }
        else if(req.query.list=='pl3'){
            if(rec.pl3.includes(song)==false){
                rec.pl3.push(song);
                rec.save();
                res.send('1');
            }
            else{
                res.send('2');
            }
        }
        else{
            res.send('Error in URL!');
        }
    }
});

    // remove track API 

app.get("/removeTrack", async(req,res) => {
    var id=0;
    const token= req.cookies.token;
    if (token == null) {
        return res.status(403);
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
        id=user.id;
      if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)});
    });
    const rec= await User.findById(id);
    if(rec==null){
        res.send('User not found!');
    }
    else{
        var song=req.query.track;
        if(req.query.list=='fav'){
            if(rec.fav.includes(song)){
                const ind= rec.fav.indexOf(song);
                rec.fav.splice(ind, 1);
                rec.save();
                res.send('1');
            }
        }
        else if(req.query.list=='pl1'){
            if(rec.pl1.includes(song)){
                const ind= rec.pl1.indexOf(song);
                rec.pl1.splice(ind, 1);
                rec.save();
                res.send('1');
            }
        }
        else if(req.query.list=='pl2'){
            if(rec.pl2.includes(song)){
                const ind= rec.pl2.indexOf(song);
                rec.pl2.splice(ind, 1);
                rec.save();
                res.send('1');
            }
        }
        else if(req.query.list=='pl3'){
            if(rec.pl3.includes(song)){
                const ind= rec.pl3.indexOf(song);
                rec.pl3.splice(ind, 1);
                rec.save();
                res.send('1');
            }
        }
        else{
            res.send('Error in URL!');
        }
    }
});

   // get email API

app.get("/getEmail", async(req,res)=>{
    var email='';
    const token= req.cookies.token;
    if (token == null) {
        return res.status(403);
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
        email=user.email;
        if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)});
    });
    res.status(200).send(email);
});

//    get ID API

app.get("/getID", async(req,res)=>{
    var id='';
    const token= req.cookies.token;
    if (token == null) {
        return res.status(403);
    }
    jwt.verify(token, process.env.JWT_SECURITY_KEY, (err, user) => {
        id=user.id;
        if (err) return res.cookie('token', '', {path: '/', expires: new Date(Date.now() - 100000)});
    });
    res.status(200).send(id);
});


app.listen(PORT, () => {
    console.log(`--- 'Sortify' is live on port: ${PORT} ---`);
});