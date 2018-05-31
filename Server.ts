/*  Aufgabe: Aufgabe 6: ClientServer - StudiVZ
    Name: Franziska Heiß
    Matrikel: 257745
    Datum: 27.05.18
    
    Hiermit versichere ich, dass ich diesen Code selbst geschrieben habe. Er wurde nicht kopiert und auch nicht diktiert.*/ 
    

import * as Http from "http";
import * as Url from "url";

namespace Server {

    interface AssocStringString {
        [key: string]: string;
    }

    // Interface lässt sich warum auch immer hier nicht einbinden, darum hier nochmal deklariert 
    interface Studi {
        firstname: string;
        name: string;       
        matrikel: number;
        age: number;
        gender: boolean; 
        studyPath: string;      
    }

    // Homogenes assoziatives Array, in dem der Matrikelnummer die Daten aus dem Interface Studi zugeodrnet werden
    interface Studis {
        [matrikel: string]: Studi;
    }
    
    // Homogenes assoziatives Array in dem die einzelnen Studenten mit ihrer Matrikelnummer gspeichert werden
    let studiHomoAssoc: Studis = {};
    
    let port: number = process.env.PORT;
    if (port == undefined)
        port = 8100;

    let server: Http.Server = Http.createServer((_request: Http.IncomingMessage, _response: Http.ServerResponse) => {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
    });
    server.addListener("request", handleRequest);
    server.listen(port);

    //Switch Abfrage mit den verschiednene Fällen und den entsprechenden Funktionen, die ausgeführt werden sollen      
    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {       
        let query: AssocStringString = Url.parse(_request.url, true).query;
        console.log(query["command"]);
        if (query["command"] ) {
            switch (query["command"] ) {
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
        studiHomoAssoc[matrikel] = studi;
        _response.write("Daten wurden gespeichert"); //Rückmeldung für den User
    }
   
    function refresh(_response: Http.ServerResponse): void {
        //console.log(studiHomoAssoc);
        for (let matrikel in studiHomoAssoc) {  
            let studi: Studi = studiHomoAssoc[matrikel];
            let line: string = matrikel + ": ";
            line += studi.studyPath + ", " + studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)"; 
            _response.write(line + "\n");                                          
            }
    } 
      
    function search(query: AssocStringString, _response: Http.ServerResponse): void {
        let studi: Studi = studiHomoAssoc[query["searchFor"]];
        if (studi) {
            let line: string = query["searchFor"] + ": ";
            line += studi.studyPath + ", " + studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(M)" : "(F)";
            _response.write(line);
            } else {
                _response.write("No match found");    
            }    
    }
        
    function error(): void {
            alert("Error"); 
    }        
    
}