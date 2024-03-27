const express = require('express');
const cors = require('cors');
//const {v4:uuidv4} = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const dbSource = "todo.db";
const db = new sqlite3.Database(dbSource);
const HTTP_PORT = 8000;
console.log("Listening on port " + HTTP_PORT);
var app = express();
app.use(cors());

class Task {
    constructor(strLocation,strInstruction,strStatus,strTaskID){
        this.location = strLocation;
        this.instruction = strInstruction;
        this.status = strStatus;
        this.taskID = strTaskID;
    }
}
//let strID = uuidv4();
var arrTask = [];
/* let objBanana = new Fruit('banana','yellow');
let objApple = new Fruit('apple','red');
let objGrape = new Fruit('grape','purple');
arrFruit.push(objBanana);
arrFruit.push(objApple);
arrFruit.push(objGrape);
arrFruit.push(new Fruit('kiwi','brown'));
app.get("/", (req,res,next) => {
    res.status(200).send(arrFruit);
}) */

app.post("/task",(req,res,next) => {
    let strTaskName = req.query.taskID;
    let strDueDate = req.query.dueDate;
    let strLocation = req.query.location;
    let strInstruction = req.query.instruction;
    let strStatus = req.query.status;
    let strTaskID = req.query.taskID;

    let strCommand = "INSERT INTO tblTasks VALUES(?,?)";
    if(strLocation && strInstruction && strStatus && strTaskID){
        let arrParameters = [strTaskName,strDueDate,strLocation,strInstruction,strStatus,strTaskID];
        let objTask = new Task(strTaskName, strDueDate, strLocation, strInstruction, strStatus, strTaskID);
        db.run(strCommand,arrParameters, function(err,result){
            if(err){
                res.status(400).json({error:err.message})
            } else {
                res.status(201).json({
                    message:"success",
                    task:objTask
                })
            }
        })
    } else {
        res.status(400).json({error:"Not all parameters provided"})
    }
})

app.get("/task",(req,res,next) => {
    let strName = req.params.name;
    if(strName){
        let strCommand = "SELECT * FROM tblFruit WHERE name = ?";
        let arrParameters = [strName];
        db.all(strCommand,arrParameters,(err,row) => {
            if(err){
                res.status(400).json({error:err.message});
            } else {
                if(row.length < 1){
                    res.status(200).json({message:"error: not found"})
                } else{
                    res.status(200).json({message:"success",fruit:row})
                }
            }
        })
    } else {
        res.status(400).json({error:"No fruit name provided"});
    }
})

app.delete("/fruit",(req,res,next) => {
    let strName = req.query.name;
    if(strName){
        arrFruit.forEach(function(fruit,index){
            if(fruit.name == strName){
                arrFruit.splice(index,-1);
                res.status(200).send(fruit);
            }
        })
        res.status(200).send({message:'Fruit Not Found'});
    } else {
        arrFruit = [];
        res.status(200).send(arrFruit);
    }
})

app.get("/hello", (req,res,next) => {
    let strCommand = 'SELECT * FROM tblFruit';
    db.all(strCommand,(err, row) => {
        if(err){
            res.status(400).json({error:err.message});
        } else {
            res.status(200).json({message:"success",fruit:row})
        }
    })
})

app.listen(HTTP_PORT);