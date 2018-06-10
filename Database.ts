/*  Aufgabe: Aufgabe 8: ClientServer - StudiVZ
    Name: Franziska Heiß
    Matrikel: 257745
    Datum: 10.06.18
    
    Hiermit versichere ich, dass ich diesen Code selbst geschrieben habe. Er wurde nicht kopiert und auch nicht diktiert.
    Dieser Code wurde zusammen mit Alena Hurst, Sofia Gschwend, Sabrina Kerl, Anna Lotz und Tim Lieberherr erarbeitet*/

import * as Mongo from "mongodb";
console.log("Database starting");



let databaseURL: string = "mongodb://localhost:27017";
let databaseName: string = "Test";
let db: Mongo.Db;
let students: Mongo.Collection;

// wenn wir auf heroku sind...
if (process.env.NODE_ENV == "production") {
    //    databaseURL = "mongodb://username:password@hostname:port/database";
    databaseURL = "mongodb://testuser:testpassword1@ds245170.mlab.com:45170/database-mongodb";
    databaseName = "database-mongodb";
}

// handleConnect wird aufgerufen wenn der Versuch, die Connection zur Datenbank herzustellen, erfolgte
Mongo.MongoClient.connect(databaseURL, handleConnect);


function handleConnect(_e: Mongo.MongoError, _db: Mongo.Db): void {
    if (_e)
        console.log("Unable to connect to database, error: ", _e);
    else {
        console.log("Connected to database!");
        db = _db.db(databaseName);
        students = db.collection("students");
    }
}

export function insert(_doc: Studi): void {
    students.insertOne(_doc, handleInsert);
}

function handleInsert(_e: Mongo.MongoError): void {
    console.log("Database insertion returned -> " + _e);
}


export function findAll(_callback: Function): void {
    var cursor: Mongo.Cursor = students.find();
    cursor.toArray(prepareAnswer);

    function prepareAnswer(_e: Mongo.MongoError, studentArray: Studi[]): void {
        if (_e) {
            _callback("Error" + _e);
        } else {
            let line: string = "";
            for (let i: number = 0; i < studentArray.length; i++) {
                line += studentArray[i].matrikel + ": " + studentArray[i].name + ", " + studentArray[i].firstname + ", " + studentArray[i].studyPath + ", " + studentArray[i].age + ", ";
                line += studentArray[i].gender ? "(M)" : "(F)";
                line += "\n";
            }
            _callback(line);
        }
    }
}

export function findStudent(searchedMatrikel: number, _callback: Function): void {
    var myCursor: Mongo.Cursor = students.find({ "matrikel": searchedMatrikel }).limit(1);
    myCursor.next(prepareStudent);

    function prepareStudent(_e: Mongo.MongoError, studi: Studi): void {
        if (_e) {
            _callback("Error" + _e);
        }

        if (studi) {
            let line: string = studi.matrikel + ": " + studi.name + ", " + studi.firstname + ", " + studi.studyPath + ", " + studi.age + ", ";
            line += studi.gender ? "(M)" : "(F)";
            _callback(line);
        } else {
            _callback("No Match found");
        }
    }
}