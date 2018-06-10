/*  Aufgabe: Aufgabe 8: ClientServer - StudiVZ
    Name: Franziska Heiß
    Matrikel: 257745
    Datum: 10.06.18
    
    Hiermit versichere ich, dass ich diesen Code selbst geschrieben habe. Er wurde nicht kopiert und auch nicht diktiert.
    Dieser Code wurde zusammen mit Alena Hurst, Sofia Gschwend, Sabrina Kerl, Anna Lotz und Tim Lieberherr erarbeitet*/

import * as Http from "http";
import * as Url from "url";
import * as Database from "./Database";

let port: number = process.env.PORT;
if (port == undefined)
    port = 8100;

let server: Http.Server = Http.createServer();
server.addListener("request", handleRequest);
server.listen(port);


//Switch Abfrage mit den verschiednene Fällen und den entsprechenden Funktionen, die ausgeführt werden sollen      
function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
    let query: AssocStringString = Url.parse(_request.url, true).query;
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

//Daten des Studi werden als Objekte übergeben      
function insert(query: AssocStringString, _response: Http.ServerResponse): void {
    let obj: Studi = JSON.parse(query["data"]);
    let _firstname: string = obj.firstname;
    let _name: string = obj.name;
    let matrikel: string = obj.matrikel.toString();
    let _age: number = obj.age;
    let _gender: boolean = obj.gender;
    let _studyPath: string = obj.studyPath;
    let studi: Studi;
    studi = {
        firstname: _firstname,
        name: _name,
        matrikel: parseInt(matrikel),
        age: _age,
        gender: _gender,
        studyPath: _studyPath
    };

    Database.insert(studi);
    handleResponse(_response, "Daten wurden gespeichert"); //Rückmeldung für den User
}

function refresh(_response: Http.ServerResponse): void {
    Database.findAll(function(json: string): void {
        handleResponse(_response, json);
    });
}

 function search(query: AssocStringString, _response: Http.ServerResponse): void {
            let searchedMatrikel: number = parseInt(query["searchFor"]);
            Database.findStudent(searchedMatrikel, function (json: string): void {
            handleResponse(_response, json);    
            });
}

function error(): void {
    alert("Error");
}


function handleResponse(_response: Http.ServerResponse, _text: string): void {
    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");
    _response.write(_text);
    _response.end();
}
