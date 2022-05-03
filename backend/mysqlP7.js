//P7 Groupomania

//----------------------------------------------------------------
//mysqlP7.js
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

//tables
const usersTable = "users"; //table des utilisateurs

exports.connection = connection;
exports.usersTable = usersTable;
