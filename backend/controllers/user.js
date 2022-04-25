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
          "INSERT INTO user (email, passwd, pseudo) VALUES ('" +
            req.body.email +
            "','" +
            hash +
            "','" +
            req.body.pseudo +
            "');",
          (err) => {
            if (err) {
              // Reponse avec code et message d'erreur
              res.status(400).json({
                message: "code: " + err.code + " message: " + err.sqlMessage,
              });
              console.log("erreur" + err);
            } else {
              // OK utilisateur cree
              console.log("utilisateur cree" + req.body.pseudo);

              res
                .status(201)
                .json({ message: "Utilisateur créé : " + req.body.pseudo });
            }
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
    const secretKey = process.env.SECRET_KEY;
    const sql = "SELECT * FROM user WHERE email = '" + req.body.email + "';";
    console.log(sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("erreur" + err);
      } else {
        // test log
        console.log(data);

        //test passwd

        res.status(200).json({ message: "Utilisateur logue" });
      }
    });
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
