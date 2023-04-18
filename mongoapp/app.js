const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const {
    MONGO_DB_HOSTNAME,
    MONGO_DB_PORT,
    MONGO_DB
} = process.env

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

const url = `mongodb://${MONGO_DB_HOSTNAME}:${MONGO_DB_PORT}/${MONGO_DB}`;
 
const clinicscheme = new Schema({name: String, rating: Number, type: String}, {versionKey: false});
const Clinic = mongoose.model("Clinic", clinicscheme);
 
app.use(express.static(__dirname + "/public"));

mongoose.connect(url, options)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, function(){
            console.log("Сервер очікує підключення...");
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB', error);
    });
  
app.get("/api/clinics", async function(req, res){
    const clinics = await Clinic.find({}).exec();
    res.send(clinics);
});
 
app.get("/api/clinics/:id", async function(req, res){
         
    const id = req.params.id;
    const clinic = await Clinic.findOne({_id: id});
    res.send(clinic);
});
    
app.post("/api/clinics", jsonParser, async function (req, res) {
        
    if(!req.body) return res.sendStatus(400);
        
    const clinicName = req.body.name;
    const clinicRating = req.body.rating;
    const clinicType = req.body.type;
    const clinic = new Clinic({name: clinicName, rating: clinicRating, type: clinicType});
        
    await clinic.save();
    res.send(clinic);
});
     
app.delete("/api/clinics/:id", async function(req, res){
         
    const id = req.params.id;
    const clinic = await Clinic.findByIdAndDelete(id);
    res.send(clinic);
});
    
app.put("/api/clinics", jsonParser, async function(req, res){
         
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const clinicName = req.body.name;
    const clinicRating = req.body.rating;
    const clinicType = req.body.type;
    const newclinic= {name: clinicName, rating: clinicRating, type: clinicType};
     
    const clinic = await Clinic.findOneAndUpdate({_id: id}, newclinic, {new: true});
    res.send(clinic);
});