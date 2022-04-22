/*P7 Groupomania
------------------------------------------
controllers/user.js
Date de création: 21/04/2022
auteur BTC

controleur pour les users
-----------------------------------------
*/

//package de cryptage
const bcrypt = require("bcrypt");

//controle des token
const jwt = require("jsonwebtoken");
//modele users
//const User = require("../models/User");

//configure dotenv pour les variables d'environnement
require("dotenv").config();

//Base de données mysql
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.USER,
  password: process.env.USER_PASSWD,
  database: process.env.DATABASE,
});

/*--------------------------------------------------------------------------
 ft signup :
 
 Objet: pour enregistrement de nouveaux utilisateurs

 verbe: POST

 Algo: 
   hash du mot de passe
   Sauvegarde utilisateur crée
------------------------------------------------------------*/
exports.signup = (req, res, next) => {
  try {
    console.log("signup");
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        connection.query(
          "INSERT INTO user (email, passwd, pseudo) VALUES ('titi4@test.fr', 'titi', 'titi1');",
          (err, lignes) => {
            if (err) throw err;

            console.log("Données reçues de Db:");
            console.log(lignes);
          }
        );
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  } catch {
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};

/*----------------------------------------------------------------------------
ft login 

Objet: pour connecter les utilisateurs.

verbe: POST

Algo:
  Vérif de l'utilisateur
  Si utilisateur connu: verif du passwd avec la clé secréte

----------------------------------------------------------------*/
exports.login = (req, res, next) => {
  try {
  } catch {
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};

/*----------------------------------------------------------------------------
ft deleteUser

Objet: supprimer les utilisateurs.

verbe: DELETE

Algo:
  Vérif de l'utilisateur
  Delete User

----------------------------------------------------------------*/
exports.deleteUser = (req, res, next) => {
  try {
  } catch {
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};

/*----------------------------------------------------------------------------
ft getAllUsers

Objet: Affiche la liste des utilisateurs les utilisateurs.

verbe: GET

Algo:
  SELECT * sur table users

----------------------------------------------------------------*/
exports.getAllUsers = (req, res, next) => {
  try {
  } catch {
    res.status(500).json({
      error: new Error("Erreur server"),
    });
  }
};
