/*P7 Groupomania
------------------------------------------
controllers/user.js
Date de création: 21/04/2022
auteur BTC

controleur pour les users
-----------------------------------------
*/
const express = require("Express");
//package de cryptage
const bcrypt = require("bcrypt");

//controle des token
const jwt = require("jsonwebtoken");
//modele users
//const User = require("../models/User");

//configure dotenv pour les variables d'environnement
require("dotenv").config();

const cors = require("cors");

const bodyParser = require("body-parser");

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
        sql =
          "INSERT INTO user (email, passwd, pseudo) VALUES ('" +
          req.body.email +
          "','" +
          hash +
          "','" +
          req.body.pseudo +
          "');";
        connection.query(sql, (err, data, fields) => {
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
        });
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  } catch (err) {
    res.status(500).json({
      error: new Error("Erreur server" + err),
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


  Réponse de mysql avec les infos suivantes:
  [
  RowDataPacket {
    id: 32,
    email: 'titi16.1@test.fr',
    passwd: '$2b$10$IK9u4N/bEGC3oVAwk9UzUOWB2.2O9qAh0zzlpUiublkMpFxWJ.od6',
    pseudo: 'titi16',
    moderator: 0
  }
]



Pour récupérer les infos du  RowDataPacket
const result = Object.values(JSON.parse(JSON.stringify(data)));

result = 1 tableau avec 1 seul elt
result = 
[
{
    id: 32,
    email: 'titi16.1@test.fr',
    passwd: '$2b$10$IK9u4N/bEGC3oVAwk9UzUOWB2.2O9qAh0zzlpUiublkMpFxWJ.od6',
    pseudo: 'titi16',
    moderator: 0
  }
]

obj=result[0]=
{
    id: 32,
    email: 'titi16.1@test.fr',
    passwd: '$2b$10$IK9u4N/bEGC3oVAwk9UzUOWB2.2O9qAh0zzlpUiublkMpFxWJ.od6',
    pseudo: 'titi16',
    moderator: 0
  }

On peut récupérer chaque item par
const id=obj.id
const passwd= obj.passwd 
...

----------------------------------------------------------------*/
exports.login = (req, res, next) => {
  try {
    console.log("fonction exports.login");
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
        try {
          //result est un tableau avec 1 seul elt
          const result = Object.values(JSON.parse(JSON.stringify(data)));

          const obj = result[0];

          const passwd = obj.passwd;
          const moderator = obj.moderator;

          //
          //bcrypt pour vérifier le mot de passe envoyé par l'utilisateur avec le hash enregistré
          //Si correct renvoi du TOKEN au frontend
          //  A completer
          //

          res.status(200).json({ message: "Utilisateur logue" });
        } catch (err) {
          console.log("fail");
          res.status(400).json({ message: "login failed" });
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      error: new Error("Erreur server" + err),
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
    console.log("fonction exports.getAllUsers");

    const sql = "SELECT * FROM user ";

    console.log(sql);

    connection.query(sql, (err, rows, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("erreur" + err);
      } else {
        // test log
        console.log(data);
        try {
          console.log("debut du try");

          console.log(rows);
          console.log(fields);

          const result = Object.values(JSON.parse(JSON.stringify(rows)));
          console.log(result);

          console.log(JSON.parse(result));

          res.status(200).json({ message: "user list" + result });
        } catch (err) {
          console.log("fail");
          res.status(400).json({ message: "probleme" });
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      error: new Error("Erreur server" + err),
    });
  }
};
