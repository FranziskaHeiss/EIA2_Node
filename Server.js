/*  Aufgabe: Aufgabe 8: ClientServer - StudiVZ
    Name: Franziska Hei�
    Matrikel: 257745
    Datum: 10.06.18
    
    Hiermit versichere ich, dass ich diesen Code selbst geschrieben habe. Er wurde nicht kopiert und auch nicht diktiert.
    Dieser Code wurde zusammen mit Alena Hurst, Sofia Gschwend, Sabrina Kerl, Anna Lotz und Tim Lieberherr erarbeitet*/
"use strict";
const Http = require("http");
const Url = require("url");
const Database = require("./Database");
let port = process.env.PORT;
if (port == undefined)
    port = 8100;
let server = Http.createServer();
server.addListener("request", handleRequest);
server.listen(port);
function handleResponse(_response, _text) {
    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");
    _response.write(_text);
    _response.end();
}
//Switch Abfrage mit den verschiednene F�llen und den entsprechenden Funktionen, die ausgef�hrt werden sollen      
function handleRequest(_request, _response) {
    let query = Url.parse(_request.url, true).query;
    console.log(query["command"]);
    if (query["command"]) {
        switch (query["command"]) {
            case "insert":
                insert(query, _response);
                break;
            case "refresh":
                refresh(_response);
                break;
            case "search":
                search(query, _response);
                break;
            default:
                error();
        }
    }
    //_response.end();
}
//Daten des Studi werden als Objekte �bergeben      
function insert(query, _response) {
    let obj = JSON.parse(query["data"]);
    let _firstname = obj.firstname;
    let _name = obj.name;
    let matrikel = obj.matrikel.toString();
    let _age = obj.age;
    let _gender = obj.gender;
    let _studyPath = obj.studyPath;
    let studi;
    studi = {
        firstname: _firstname,
        name: _name,
        matrikel: parseInt(matrikel),
        age: _age,
        gender: _gender,
        studyPath: _studyPath
    };
    Database.insert(studi);
    handleResponse(_response, "Daten wurden gespeichert"); //R�ckmeldung f�r den User
}
function refresh(_response) {
    Database.findAll(function (json) {
        handleResponse(_response, json);
    });
}
function search(query, _response) {
    let searchedMatrikel = parseInt(query["searchFor"]);
    Database.findStudent(searchedMatrikel, function (json) {
        handleResponse(_response, json);
    });
}
function error() {
    alert("Error");
}
//# sourceMappingURL=Server.js.map