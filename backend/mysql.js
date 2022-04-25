//P7 Groupomania

//----------------------------------------------------------------
//mysql.js
// date de création: 25/04/2022
// auteur: BTC
//
// Connexion à la base de données mySQL
//
//-------------------------------------------
//configure dotenv pour les variables d'environnement
require("dotenv").config();

//connexion a mySQL

const user = process.env.USER;
const passwd = process.env.USER_PASSWD;
const database = process.env.DATABASE;

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: user,
  password: passwd,
  database: database,
});

connection.connect(() => {
  try {
    console.log("Connecté mySQL groupomania");
  } catch (err) {
    console.log(err);
  }
});

//Fermeture de la connexion:
connection.end((err) => {
  // La connexion se termine normalement
  // Garantit que toutes les requêtes restantes sont exécutées
  // Envoie ensuite un paquet de sortie au serveur MySQL.
});
