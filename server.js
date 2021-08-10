'use strict'


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const server = express();
const mongoose = require('mongoose');
const { default: axios } = require('axios');
const PORT = process.env.PORT;

server.use(cors());
server.use(express.json());
// mongodb://abrar:12345@cluster0-shard-00-00.bezrw.mongodb.net:27017,cluster0-shard-00-01.bezrw.mongodb.net:27017,cluster0-shard-00-02.bezrw.mongodb.net:27017/color?ssl=true&replicaSet=atlas-wtxjwi-shard-0&authSource=admin&retryWrites=true&w=majority
// mongodb://localhost:27017/color
mongoose.connect(process.env.MONGODB , { useNewUrlParser: true, useUnifiedTopology: true });

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



function seedUser() {
    let userData = new userModel({
        email: 'algourabrar@gmail.com',
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
    // userData2.save();
}

let memory={};

// seedUser();
// http://localhost:3005/datafromdb
// http://localhost:3005/datafromdb?email=
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
// http://localhost:3005/allColorData
server.get('/allColorData',getapidata)
async function getapidata (req,res){
    const url ='https://ltuc-asac-api.herokuapp.com/allColorData';


    if(memory["apidata"] !== undefined){
        console.log("from memory");
        res.send(memory["apidata"])
    }else{const apiData= await axios.get(url);

        // console.log(apiData.data);
        const apiMap= apiData.data.map(item=>{
            return new Dataobj(item);
        })
        memory["apidata"]=apiMap;
        console.log("from api");
        res.send(apiMap)}
    

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
            res.send(favedata[0]);
    })
}
//http://localhost:3005/delete?email=
server.delete('/delete/:idx',deletedata)
function deletedata(req,res){

    let idx= req.params.idx
    let email= req.query.email

    userModel.findOne({email:email},(error,deletdata) => {

        if(error){
            res.send(error)

        }else{
        deletdata.colordata.splice(idx,1);
        deletdata.save();
        res.send(deletdata.colordata)
    }

    })
}

//http://localhost:3005/update
server.put('/update/:idx',updatedata)
function updatedata(req,res){

    let idx= req.params.idx
    const {email,title,imageUrl} =req.body;

    userModel.findOne({email:email},(error,updatedata) => {

        if(error){
            res.send(error)

        }else{
            updatedata.colordata.splice(idx,1,{
                title:title,
                imageUrl:imageUrl,
            });
            updatedata.save();
        res.send(updatedata.colordata)
    }

    })
}



server.listen(PORT, () => {
    console.log(`listen to ${PORT}`);
})
