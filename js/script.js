"use strict"

//fare un readme 

// Dichiarazione variabili usate successivamente
const modalFiltro = new bootstrap.Modal("#filter-modal");

//Sfruttati per non far rigenerare i valori per tornare dai preferiti
let showList = true;
let preferiti = false;
let seedAgg;

let seedValue = document.getElementById("testoSeed");
const min = document.getElementById("minValue");
const max = document.getElementById("maxValue");
const savedPeople = new Map(); //Volevo usare un Set ma non permetteva la gestione chiave valore dunque ho optato per un savedPeople così da mantenere anche l'ordine

//Caricamento nel modal delle checkbox nazioni e caricamento prime persone prive di parametri.
caricaNazionalita();
caricaPersone();
creaButtons();

//Metodo che mostra il modale per selezionare i filtri
document.getElementById("Filtro").addEventListener("click", function () {
    modalFiltro.show();
});

//Metodo che attiva il caricamento al cambiamento dei filtri
document.getElementById("cambiamenti").addEventListener("click", function () {
    preferiti = false;
    document.getElementById("Default").textContent = "Ricarica";
    caricaPersone(seedValue.value);
});
//Metodo che attiva il ripristino per tornare dai preferiti
document.getElementById("Default").addEventListener("click", function () {
    if (!preferiti) {
        caricaPersone(seedValue.value);
    }
    else {
        this.textContent = "Ricarica";
        caricaPersone(seedValue.value);
        preferiti = false;
    }
});
//Metodo che copia il seed una volta premuta la label nel modale dei filtri
document.getElementById("copiaSeed").addEventListener("click", function () {
    if (seedValue.value != "") {
        navigator.clipboard.writeText(seedValue.value);
        alert("Copiato con successo!");
    }
});
//Controllo che max sia più grande di min
max.addEventListener("change", function () {
    if (parseInt(this.value) <= parseInt(min.value)) {
        this.value = parseInt(min.value) + 1;
    }
});
//Controllo che min sia più piccolo di max
min.addEventListener("change", function () {
    if (parseInt(this.value) >= parseInt(max.value)) {
        this.value = parseInt(max.value) - 1;
    }
});
//Metodi che impostano la modalità di visualizzazione
document.getElementById("list").addEventListener("click", function () {
    showList = true;
    caricaPersone(seedAgg);
})
document.getElementById("slideshow").addEventListener("click", function () {
    showList = false;
    caricaPersone(seedAgg);
})

//Medoto che fa la richiesta al server e reindiriza i dati verso la creazione dinamica delle card
//Come parametro prende seed così quando il seed deve essere preimpostato si può evitare di fare certi controlli
function caricaPersone(seed) {
    let promise;
    let nPersone = document.getElementById("results").value;
    let radioBtnSalvato = document.querySelector("input[type=radio][name=salvare]:checked").value;
    let caratteri = [...document.querySelectorAll('input[name="chars"]:checked')].map(x => x.value).join();
    //Richiesta base per seed non richiesto
    if ((seed == null || seed == "" || radioBtnSalvato == 'No') && !preferiti) {
        let personGender = document.querySelector("input[type=radio][name=gender]:checked").value;
        let nats = [...document.querySelectorAll("input[type=checkbox]:checked")].map(x => x.value).join();
        let selectedPassword = null;

        //Controllo sulla password visto che la lunghezza è di default mentre 
        if (caratteri != "") {
            selectedPassword = `${caratteri},${min.value}-${max.value}).value}`;
        }

        //Non controllo se i parametri sono null dato che non creerebbe problemi
        promise = ajax.sendRequest("GET", "", { results: nPersone, gender: personGender, nat: nats, password: selectedPassword });
    }
    else {
        //Richiesta con seed e numero di persone
        if (preferiti) {
            promise = ajax.sendRequest("GET", "", { seed: seedAgg, results: nPersone });
        }
        else {
            promise = ajax.sendRequest("GET", "", { seed: seedValue.value, results: nPersone });
        }
    }
    promise.catch(ajax.errore);
    promise.then(function (httpRequest) {
        //Controllo se ho la necessità di salvare il seed
        seedAgg = httpRequest.data.info.seed;
        if (radioBtnSalvato == 'Si') {
            seedValue.value = httpRequest.data.info.seed;
        }
        else {
            seedValue.value = "";
        }

        //Richiamo la creazione dinamica passandoli la struttura dati con all'interno i dati
        if(!preferiti)
        {
            loadCards(httpRequest.data.results);
        }
        else
        {
            loadCards([...savedPeople.values()]);
        }
    });
}

// Caricamento preferiti
document.getElementById("Preferiti").addEventListener("click", function () {
    // Se non ci sono dei preferiti viene avvisato l'utente altrimenti carica passando il vettore di persone salvate
    if (savedPeople.size <= 0) {
        const modalPreferiti = new bootstrap.Modal("#preferiti-modal");
        modalPreferiti.show();
    }
    else {
        //.value() è comodo perche permette di ottenere tutti i valori senza avere la chiave
        loadCards([...savedPeople.values()]);
        preferiti = true;
        document.getElementById("Default").textContent = "Torna indietro";
    }
});

//Si occupa dell'intera creazione dinamica
function loadCards(data) {
    //Prende il tag in cui andranno inserite le card e lo svuota
    let cards = document.getElementById("Persone");
    cards.innerHTML = "";
    let span, div, cont, icona, img, hTag, pTag;

    //Cont che uso per tenere separate le icone nelle varie card. Approfondirò la gestione nella creazione di pTag
    cont = 0;

    if (showList) {
        Buttons.style.display = "none";
        for (let person of data) {
            //Creazione carta
            span = document.createElement("span");
            span.style.display = "inline-block";
            span.classList.add("mt-3", "ms-3", "me-3", "card");

            //Inserimento immagine carta
            img = document.createElement("img");
            img.src = person.picture.large;
            img.alt = "immagine persona";
            img.classList.add("img-fluid");
            span.appendChild(img);

            //Inserimento sezione dedita al contenuto della carta
            div = document.createElement("div");
            div.classList.add("card-body");
            span.appendChild(div);

            // Crezione sotto titolo della card
            hTag = document.createElement("h8");
            hTag.style.opacity = "0.43";
            hTag.id = `sottoTesto${cont}`;
            hTag.textContent = "Hi, My name is";
            div.appendChild(hTag);

            // Creazione titolo della card, ovverosia il valore
            hTag = document.createElement("h5");
            hTag.classList.add("card-title", "text-break")
            hTag.id = `testo${cont}`;
            hTag.textContent = `${person.name.first} ${person.name.last}`;
            div.appendChild(hTag);

            //Creazione tag p in cui avverrà la gestione delle icone
            pTag = document.createElement("p");
            //Il dataset è usato per tenere traccia del cont nel programma
            pTag.dataset.number = cont;
            pTag.classList.add("card-text");

            //Sfrutto i delegated events per poter gestire dal tag padre l'evento di quello figlio così da non dover creare un'evento per ogni tag i visto che se generassimo molte persone rallenterebbe notevolmente il sito
            //Passo e come parametro visto che è l'evento
            //Comunque il metodo si occupa nel gestire l'over sulle icone
            pTag.addEventListener("mouseover", function (e) {
                //Prendo il tag che ha subito l'evento
                let iconaCambiata = e.target;
                if (iconaCambiata.id == `icone${this.dataset.number}`) {
                    document.querySelectorAll(`#icone${this.dataset.number}`).forEach(x => x.style.color = "");
                    iconaCambiata.style.color = "green";
                    document.getElementById(`testo${this.dataset.number}`).textContent = iconaCambiata.dataset.attr;
                    document.getElementById(`sottoTesto${this.dataset.number}`).textContent = iconaCambiata.dataset.title;
                }
            });
            //Il metodo sfrutta i delegated events come quello sopra e gestisce il salvataggio delle persone
            pTag.addEventListener("click", function (e) {
                let stella = e.target;
                if (stella.id == "stella") {
                    if (stella.classList.contains("bi-star")) {
                        stella.classList.remove("bi-star");
                        stella.classList.add("bi-star-fill");
                        savedPeople.set(person.login.uuid, person);
                    }
                    else {
                        stella.classList.remove("bi-star-fill");
                        stella.classList.add("bi-star");
                        savedPeople.delete(person.login.uuid);
                    }
                }
            });
            div.appendChild(pTag);

            //Da qui in giù c'è la creazione delle varie icone. Trovo opportuno soffermarmi solo sui dataset per dire che gestiscono il sottotitolo e titolo.
            icona = creaIcona();
            icona.id = `icone${cont}`;
            icona.dataset.title = "Hi, My name is";
            icona.dataset.attr = `${person.name.first} ${person.name.last}`;
            icona.classList.add("bi-person-circle")
            icona.style.color = "green";
            pTag.appendChild(icona);

            icona = creaIcona();
            icona.id = `icone${cont}`;
            icona.dataset.title = "My email address is";
            icona.dataset.attr = `${person.email}`;
            icona.classList.add("bi-envelope")
            pTag.appendChild(icona);

            icona = creaIcona();
            icona.id = `icone${cont}`;
            icona.dataset.title = "My birthday is";
            icona.dataset.attr = `${new Date(person.dob.date).toLocaleDateString()}`;
            icona.classList.add("bi-calendar3")
            pTag.appendChild(icona);

            icona = creaIcona();
            icona.id = `icone${cont}`;
            icona.dataset.title = "My address is";
            icona.dataset.attr = `${person.location.street.number} ${person.location.street.name}`;
            icona.classList.add("bi-map")
            pTag.appendChild(icona);

            icona = creaIcona();
            icona.id = `icone${cont}`;
            icona.dataset.title = "My phone number is";
            icona.dataset.attr = `${person.phone}`;
            icona.classList.add("bi-phone");
            pTag.appendChild(icona);

            icona = creaIcona();
            icona.id = `icone${cont}`;
            icona.dataset.title = "My password is";
            icona.dataset.attr = `${person.login.password}`;
            icona.classList.add("bi-lock");
            pTag.appendChild(icona);

            icona = creaIcona();
            icona.id = `stella`;
            icona.classList.add(`${savedPeople.has(person.login.uuid) ? "bi-star-fill" : "bi-star"}`);
            icona.style.color = "blue";
            pTag.appendChild(icona);

            cont++;
            cards.append(span);
        }
    }
    else {
        Buttons.style.display = "";
        document.getElementById("first").disabled = cont === 0;
        document.getElementById("prev").disabled = cont === 0;
        document.getElementById("next").disabled = cont === data.length - 1;
        document.getElementById("last").disabled = cont === data.length - 1;
        document.getElementById("conteggio").textContent = `${cont + 1}/${data.length}`;
        generaCartaSingola(cards, data[cont]);
        Buttons.addEventListener("click", function (e) {
            if (e.target.classList.contains("btn")) {
                switch (e.target.id) {
                    case "first":
                        cont = 0;
                        break;

                    case "prev":
                        if (cont > 0) cont--;
                        break;

                    case "next":
                        if (cont < data.length - 1) cont++;
                        break;

                    case "last":
                        cont = data.length - 1;
                        break;
                }

                /* Render card */
                generaCartaSingola(cards, data[cont]);

                /* Update counter */
                document.getElementById("conteggio").textContent = `${cont + 1}/${data.length}`;

                /* Button states */
                document.getElementById("first").disabled = cont === 0;
                document.getElementById("prev").disabled = cont === 0;
                document.getElementById("next").disabled = cont === data.length - 1;
                document.getElementById("last").disabled = cont === data.length - 1;
            }
        })
    }
}

function generaCartaSingola(cards, person) {
    let span, div, cont, icona, img, hTag, pTag;

    cards.innerHTML = "";
    span = document.createElement("span");
    span.style.display = "inline-block";
    span.classList.add("mt-3", "ms-3", "me-3", "card");

    //Inserimento immagine carta
    img = document.createElement("img");
    img.src = person.picture.large;
    img.alt = "immagine persona";
    img.classList.add("img-fluid");
    span.appendChild(img);

    //Inserimento sezione dedita al contenuto della carta
    div = document.createElement("div");
    div.classList.add("card-body");
    span.appendChild(div);

    // Crezione sotto titolo della card
    hTag = document.createElement("h8");
    hTag.style.opacity = "0.43";
    hTag.id = `sottoTesto${cont}`;
    hTag.textContent = "Hi, My name is";
    div.appendChild(hTag);

    // Creazione titolo della card, ovverosia il valore
    hTag = document.createElement("h5");
    hTag.classList.add("card-title", "text-break")
    hTag.id = `testo${cont}`;
    hTag.textContent = `${person.name.first} ${person.name.last}`;
    div.appendChild(hTag);

    //Creazione tag p in cui avverrà la gestione delle icone
    pTag = document.createElement("p");
    //Il dataset è usato per tenere traccia del cont nel programma
    pTag.dataset.number = cont;
    pTag.classList.add("card-text");

    //Sfrutto i delegated events per poter gestire dal tag padre l'evento di quello figlio così da non dover creare un'evento per ogni tag i visto che se generassimo molte persone rallenterebbe notevolmente il sito
    //Passo e come parametro visto che è l'evento
    //Comunque il metodo si occupa nel gestire l'over sulle icone
    pTag.addEventListener("mouseover", function (e) {
        //Prendo il tag che ha subito l'evento
        let iconaCambiata = e.target;
        if (iconaCambiata.id == `icone${this.dataset.number}`) {
            document.querySelectorAll(`#icone${this.dataset.number}`).forEach(x => x.style.color = "");
            iconaCambiata.style.color = "green";
            document.getElementById(`testo${this.dataset.number}`).textContent = iconaCambiata.dataset.attr;
            document.getElementById(`sottoTesto${this.dataset.number}`).textContent = iconaCambiata.dataset.title;
        }
    });
    //Il metodo sfrutta i delegated events come quello sopra e gestisce il salvataggio delle persone
    pTag.addEventListener("click", function (e) {
        let stella = e.target;
        if (stella.id == "stella") {
            if (stella.classList.contains("bi-star")) {
                stella.classList.remove("bi-star");
                stella.classList.add("bi-star-fill");
                savedPeople.set(person.login.uuid, person);
            }
            else {
                stella.classList.remove("bi-star-fill");
                stella.classList.add("bi-star");
                savedPeople.delete(person.login.uuid);
            }
        }
    });
    div.appendChild(pTag);

    //Da qui in giù c'è la creazione delle varie icone. Trovo opportuno soffermarmi solo sui dataset per dire che gestiscono il sottotitolo e titolo.
    icona = creaIcona();
    icona.id = `icone${cont}`;
    icona.dataset.title = "Hi, My name is";
    icona.dataset.attr = `${person.name.first} ${person.name.last}`;
    icona.classList.add("bi-person-circle")
    icona.style.color = "green";
    pTag.appendChild(icona);

    icona = creaIcona();
    icona.id = `icone${cont}`;
    icona.dataset.title = "My email address is";
    icona.dataset.attr = `${person.email}`;
    icona.classList.add("bi-envelope")
    pTag.appendChild(icona);

    icona = creaIcona();
    icona.id = `icone${cont}`;
    icona.dataset.title = "My birthday is";
    icona.dataset.attr = `${new Date(person.dob.date).toLocaleDateString()}`;
    icona.classList.add("bi-calendar3")
    pTag.appendChild(icona);

    icona = creaIcona();
    icona.id = `icone${cont}`;
    icona.dataset.title = "My address is";
    icona.dataset.attr = `${person.location.street.number} ${person.location.street.name}`;
    icona.classList.add("bi-map")
    pTag.appendChild(icona);

    icona = creaIcona();
    icona.id = `icone${cont}`;
    icona.dataset.title = "My phone number is";
    icona.dataset.attr = `${person.phone}`;
    icona.classList.add("bi-phone");
    pTag.appendChild(icona);

    icona = creaIcona();
    icona.id = `icone${cont}`;
    icona.dataset.title = "My password is";
    icona.dataset.attr = `${person.login.password}`;
    icona.classList.add("bi-lock");
    pTag.appendChild(icona);

    icona = creaIcona();
    icona.id = `stella`;
    icona.classList.add(`${savedPeople.has(person.login.uuid) ? "bi-star-fill" : "bi-star"}`);
    icona.style.color = "blue";
    pTag.appendChild(icona);

    cards.append(span);
}
// Metodo che crea un'icona base
function creaIcona() {
    let icona = document.createElement("i");

    icona.classList.add("bi", "ms-2", "me-2")
    icona.style.fontSize = "25px";

    return icona;
}

//Metodo che usa due vettori paralleli per creare le checkbox nazioni
function caricaNazionalita() {
    let nat = ["AU", "BR", "CA", "CH", "DE", "DK", "ES", "FI", "FR", "GB", "IE", "IN", "IR", "MX", "NL", "NO", "NZ", "RS", "TR", "UA", "US"];
    let natNames = ["Australia", "Brazil", "Canada", "Switzerland", "Germany", "Denmark", "Spain", "Finland", "France", "United Kingdom", "Ireland", "India", "Iran", "Mexico", "Netherlands", "Norway", "New Zealand", "Serbia", "Turkey", "Ukraine", "United States"];
    const labels = document.getElementById("nazionalita");
    let label;

    for (let i = 0; i < nat.length; i++) {
        label = document.createElement("label");
        label.innerHTML = `<input type=checkbox name=nat value=${nat[i]}> ${natNames[i]} `
        labels.append(label, document.createElement("br"));
    }
}

function creaButtons(data) {
    let span,div;

    div = document.createElement("div");
    let btn = document.createElement("button");
    btn.id = "first";
    btn.style.width = "50px";
    btn.classList.add("btn", "btn-secondary", "me-2", "ms-2");
    btn.textContent = "First";
    div.appendChild(btn);

    btn = document.createElement("button");
    btn.id = "prev";
    btn.classList.add("btn", "btn-secondary", "me-2", "ms-2");
    btn.textContent = "prev";
    div.appendChild(btn);

    Buttons.appendChild(div);

    div = document.createElement("div");
    span = document.createElement("span");
    span.classList.add("me-3", "ms-3", "text-center", "text-white");
    span.id = "conteggio";
    span.textContent = `1/${document.getElementById("results").value}`;
    div.appendChild(span);
    Buttons.appendChild(div);

    div = document.createElement("div");
    btn = document.createElement("button");
    btn.id = "next";
    btn.classList.add("btn", "btn-secondary", "me-2", "ms-2");
    btn.textContent = "Next";
    div.appendChild(btn);

    btn = document.createElement("button");
    btn.id = "last";
    btn.classList.add("btn", "btn-secondary", "me-2", "ms-2");
    btn.textContent = "Last";
    div.appendChild(btn);
    Buttons.appendChild(div);
}