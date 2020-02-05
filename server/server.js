var verboseMode = true;

console.verbose = function(text)
{
    if (verboseMode == true) console.log(text)
}


require("./modules/database")
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override')
var cors = require('cors');
var fs  = require('fs');


var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use("/client", express.static(__dirname + "/client"));


app.get("/", function(req, res)  {  res.sendFile(__dirname + "/client/index.html");});   

/////////////////////////////////////////////////////////////////////////UTENTI

//RICEVI ID UTENTE
app.post('/userID', function(req, res)
{
    console.log(req.body.id)
});

//GESTISCI ACCETTAZIONE INVITI
app.get('/invito', function(req, res)
{
    let evento = req.query.evento
    let categoria = req.query.categoria

    let data = fs.readFileSync(__dirname + '/client/index.html', "utf8");
    if(data)
        res.send(data.replace('window.invito = null','window.invito = {"evento":"'+evento+'","categoria":"'+categoria+'"}'));
});


app.post('/accetta', function(req, res)
{
    let response = database.addUser(req.body.id, req.body.evento, req.body.categoria, req.body.nome)

    res.send(
    {
        error : response
    });
});

app.post('/notificheGet', function(req, res)
{
    let response = database.addUser(req.body.id, req.body.evento, req.body.categoria, req.body.nome)

    res.send(
    {
        error : response
    });
});

/////////////////////////////////////////////////////////////////////////EVENTI

//RICEVI NUOVO EVENTO
app.post('/eventCreate', function(req, res)
{
    let response = database.eventCreate(req.body.id, req.body.name, req.body.startDate, req.body.endDate, req.body.desc)

    res.send(
    {
        error : response
    });
});

//ELIMINA EVENTO
app.post('/eventDelete', function(req, res)
{
    let response = database.eventDelete(req.body.eventID)

    res.send(
    {
        error : response
    });
});

//MODIFICA EVENTO
app.post('/eventEdit', function(req, res)
{
    let response = database.eventEdit(req.body.id, req.body.name ,req.body.startDate ,req.body.endDate, req.body.desc)

    res.send(
    {
        error : response
    });
});

//OTTIENI LISTA EVENTI DATO IL LORO CREATORE
app.post('/eventList', function(req, res)
{
    console.log("Get Events")

    database.eventGetByCreator(req.body.id, function(RESULT)
    {
        res.send(
        {
            eventList : RESULT
        });
    })

});

//OTTIENI EVENTO DATO IL SUO ID
app.post('/eventGet', function(req, res)
{
    console.log("Get Events For = "+req.body.eventID)

    database.eventGet(req.body.eventID, function(RESULT)
    {
        res.send(
        {  
            name : RESULT.name,
            dateStart : RESULT.dateStart,
            dateEnd : RESULT.dateEnd,
            desc : RESULT.desc,
        });
    })

});

/////////////////////////////////////////////////////////////////////////CATEGORIE

//RICEVI RICHIESTA DI CREARE UNA NUOVA CATEGORIA
app.post('/categoryCreate', function(req, res)
{
    let response = database.categoryCreate(req.body.eventID,req.body.name)

    res.send(
    {
        error : response
    });
});

//RICEVI RICHIESTA DI CREARE UNA NUOVA CATEGORIA
app.post('/categoryEdit', function(req, res)
{
    let response = database.categoryEdit(req.body.categoryID,req.body.name)

    res.send(
    {
        error : response
    });
});

//RICEVI RICHIESTA DI CREARE UNA NUOVA CATEGORIA
app.post('/categoryDelete', function(req, res)
{
    let response = database.categoryDelete(req.body.categoryID)

    res.send(
    {
        error : response
    });
});

//PRENDI LE INFORMAZIONI SU TUTTE LE CATEGORIE
app.post('/categoryList', function(req, res)
{
    console.log("Get Category For ="+req.body.id)
    
    database.categoryList(req.body.id, function(RESULT)
    {
        res.send(
        {
            categoryList : RESULT
        });
    })
});


app.listen(process.env.PORT || 8200);
console.log("server started");