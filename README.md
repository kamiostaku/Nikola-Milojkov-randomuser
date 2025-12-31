# Nikola Milojkov RandomUser

Questo progetto è una semplice interfaccia grafica per l’[RandomUser](https://randomuser.me/) API, che permette di visualizzare dati casuali di persone. Anche se l’interfaccia è minimale, il sito offre alcune funzioni extra che lo rendono davvero pratico da usare.

## Funzionalità

### Navbar
La barra in alto contiene tutto ciò che serve, da sinistra a destra:
1. **Icona e titolo della pagina** – così sai subito dove ti trovi.
2. **Pulsante filtro** – apre un modal dove puoi scegliere i parametri della ricerca.
> [!NOTE]
> Se premi **“Seed di ricerca”** dopo aver salvato un seed, questo verrà copiato automaticamente. Il seed salvato verrà usato per le ricerche successive; se non lo salvi, invece, non verrà considerato. Attenzione: se non premi **“Salvare cambiamenti”**, le modifiche fatte nel filtro non saranno applicate fino a quando non userai il tasto di **ricarica**. Inoltre la lunghezza della password non si applica a meno che non si scelgono i tipi di caratteri.
3. **Tendina display** – puoi decidere se vedere gli utenti in **lista** o una **carta alla volta**, con una gestione comoda dei pulsanti.
4. **Tasto di ricarica** – aggiornare i dati non è mai stato così semplice: niente più apertura continua del filtro.
5. **Preferiti** – mostra tutti gli utenti che hai salvato come preferiti. In questa modalità, il tasto **Ricarica** diventa **Torna indietro**, così puoi tornare ai dati precedenti senza perderli.
6. **Mostra JSON** – se vuoi vedere il dato “puro”, puoi aprire il JSON a schermo intero in un modal.

### Cards
Le schede mostrano tutte le informazioni degli utenti in maniera chiara.

- Passando il cursore sulle icone, cambiano anche i valori mostrati.
- Premendo l’**icona a forma di stella**, puoi aggiungere quella persona ai preferiti.
> [!WARNING]
> Non preoccuparti se due utenti sembrano identici: RandomUser genera i dati casualmente. Gli utenti sono salvati tramite il loro **UUID (Universally Unique Identifier)**, che si trova nella sezione `login` del JSON.

## Strumenti utilizzati

- HTML – per creare la struttura della pagina
- CSS – per dare stile e rendere tutto più bello
- JavaScript – per rendere la pagina interattiva
- [Bootstrap](https://getbootstrap.com/) – per componenti pronti all’uso e design responsive
- [Prism.js](https://prismjs.com/) – per evidenziare il codice direttamente nella pagina
- [RandomUser](https://randomuser.me/) – per ottenere dati casuali di utenti
