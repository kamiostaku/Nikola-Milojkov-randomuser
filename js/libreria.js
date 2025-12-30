"use strict";

class Ajax {
  // Properties
  _URL = "https://randomuser.me/api/";

  // Methods
  // mtehod può essere GET oppure POST
  // url = rappresenta la risorsa da richiedere al server (es /api)
  // parameters = contiene i parametri della richiesta scritti in formato JSON
  // In caso di chiamata GET, sarà sendRequest a convertire questi parametri in url-encoded e accodarli alla URL
  sendRequest(method, url, parameters = {}) {
    let options = { 
      "baseURL": this._URL, // Indirizzo del server
      "url": url, // Risorsa da richiedere
      "method": method.toUpperCase(), // Metodo da usare per la richiesta
      "headers": { "Accept": "application/json" }, // Consiglata
      "responseType": "json", // Indica il formato con cui ci aspettiamo la richiesta
      "timeout": 5000, // Tempo massimo di attesa della risposta (5 secondi)
    };


    if (method.toUpperCase() == "GET") {
      // Definisco il Content-Type dell'urlencoded
      options.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
      // Prende i parameters, li converte in urlencoded e li accoda alla url
      options.params = parameters;
    }
	else {
	   // Nel caso delle chiamate diverse da GET, i parametri saranno passati in JSON
      options.headers["Content-Type"] = "application/json;charset=utf-8";
	  // Scrive i parametri nel body dalla http Request
	  options.data = parameters;
	}

	let promise = axios(options); // axios restituisce una promise
	return promise;
  }

  errore(err) {
    if (!err.response) alert("Connection Refused or Server timeout");
    else if (err.response.status == 200) // 200 significa che lato server NON ci sono stati errori, però il risultato è stato risultato come JSON non valido, per cui il client va in errore durante il parsing
      alert("Formato dei dati non corretto : " + err.response.data);
    else
      alert("Server Error: " + err.response.status + " - " + err.response.data);
  }
}

let ajax = new Ajax();
