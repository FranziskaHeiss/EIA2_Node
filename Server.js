/*  Aufgabe: Aufgabe 6: ClientServer - StudiVZ
    Name: Franziska Hei�
    Matrikel: 257745
    Datum: 27.05.18
    
    Hiermit versichere ich, dass ich diesen Code selbst geschrieben habe. Er wurde nicht kopiert und auch nicht diktiert.*/
"use strict";
const Http = require("http");
const Url = require("url");
var Server;
(function (Server) {
    // Homogenes assoziatives Array in dem die einzelnen Studenten mit ihrer Matrikelnummer gspeichert werden
    let studiHomoAssoc = {};
    let port = process.env.PORT;
    if (port == undefined)
        port = 8100;
    let server = Http.createServer((_request, _response) => {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
    });
    server.addListener("request", handleRequest);
    server.listen(port);
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
        _response.end();
    }
    //Daten des Studi werden als Objekte �bergeben      
    function insert(query, _response) {
        let obj = JSON.parse(query["data"]);
        let _firstname = obj.firstname;
        let _name = obj.name;
        let _studyPath = obj.studyPath;
        let matrikel = obj.matrikel.toString();
        let _age = obj.age;
        let _gender = obj.gender;
        let studi;
        studi = {
            firstname: _firstname,
            name: _name,
            studyPath: _studyPath,
            matrikel: parseInt(matrikel),
            age: _age,
            gender: _gender
        };
        studiHomoAssoc[matrikel] = studi;
        _response.write("Daten wurden gespeichert"); //R�ckmeldung f�r den User
    }
    function refresh(_response) {
        //console.log(studiHomoAssoc);
        for (let matrikel in studiHomoAssoc) {
            let studi = studiHomoAssoc[matrikel];
            let line = matrikel + ": ";
            line += studi.studyPath + ", " + studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)";
            _response.write(line + "\n");
        }
    }
    function search(query, _response) {
        let studi = studiHomoAssoc[query["searchFor"]];
        if (studi) {
            let line = query["searchFor"] + ": ";
            line += studi.studyPath + ", " + studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)";
            _response.write(line);
        }
        else {
            _response.write("No match found");
        }
    }
    function error() {
        alert("Error");
    }
})(Server || (Server = {}));
//# sourceMappingURL=Server.js.map