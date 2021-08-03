'use strict'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const server = express();
const mongoose = require('mongoose');
const { default: axios } = require('axios');
const PORT = process.env.PORT || 3005

server.use(cors());
server.use(express.json());
mongoose.connect('mongodb://localhost:27017/color', { useNewUrlParser: true, useUnifiedTopology: true });

// http://localhost:3005
server.get('/', (req, res) => {
    res.send('HELLO')
})


const colorSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,

});

const userSchema = new mongoose.Schema({
    email: String,
    colordata: [colorSchema]

});

const userModel = mongoose.model('user', userSchema);
const colorModel = mongoose.model('color', colorSchema);


function seedUser() {
    let userData = new userModel({
        email: 'algourabrar@gmail,com',
        colordata: [{
            "title": "Black",
            "imageUrl": "http://www.colourlovers.com/img/000000/100/100/Black.png",
        },

        {
            "title": "dutch teal",
            "imageUrl": "http://www.colourlovers.com/img/1693A5/100/100/dutch_teal.png",
        },
        {
            "title": "heart of gold",
            "imageUrl": "http://www.colourlovers.com/img/FBB829/100/100/heart_of_gold.png",
        },]
    })
    let userData2 = new userModel({
        email: 'quraanrazan282@gmail.com',
        colordata: [{
            "title": "Black",
            "imageUrl": "http://www.colourlovers.com/img/000000/100/100/Black.png",
        },

        {
            "title": "dutch teal",
            "imageUrl": "http://www.colourlovers.com/img/1693A5/100/100/dutch_teal.png",
        },
        {
            "title": "heart of gold",
            "imageUrl": "http://www.colourlovers.com/img/FBB829/100/100/heart_of_gold.png",
        },]
    })
    userData.save();
    userData2.save();
}


// seedUser();
// http://localhost:3005/datafromdb
server.get('/datafromdb', getdatafromDB);
function getdatafromDB (req,res){
    let email =req.query.email
    userModel.find({email:email},(error,userData)=>{  
        console.log(userData[0]);
        console.log(email);
        if(error){
            res.send(error)

        }else{
            console.log(userData);
            res.send(userData[0].colordata)
        }
      
    })
}
// https://ltuc-asac-api.herokuapp.com/allColorData

server.get('/allColorData',getapidata)
async function getapidata (req,res){
    const url ='https://ltuc-asac-api.herokuapp.com/allColorData';
    const apiData= await axios.get(url);
    const apiMap= apiData.data.map(item=>{
        return new Dataobj(item);
    })
}
class Dataobj {
    constructor(data){
        this.title=data.title;
        this.imageUrl=data.imageUrl;
    }
}

// http://localhost:3005/addtofav
server.post('/addtofav',addtofavfun);
function addtofavfun(req,res){
    const {email,title,imageUrl} =req.body;
    userModel.find({email:email},(error,favedata)=>{
        if(error){
            res.send(error)

        }else{
            const newfav={
                title:title,
                imageUrl:imageUrl
            }
            favedata[0].colordata.push(newfav);
        }
        favedata[0].save();
            res.send(favedata[0].colordata);
    })
}
http://localhost:3005/delete/index
server.delete('/delete/:id',deletedata)
function deletedata(req,res){
    let id= req.params.id
    let email= req.query.email
    userModel.findOne({email:email},(error,deletdata) => {
        deletdata.colordata.splice(id,1);
        deletdata.save();
        res.send(deletdata.colordata)
    })
}
server.listen(PORT, () => {
    console.log(`listen to ${PORT}`);
})
