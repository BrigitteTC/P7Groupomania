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

//configure dotenv pour les variables d'environnement
require("dotenv").config();

// connection database groupomania
const connection = require("../mysqlp7").connection;

//table des utilisateurs
const usersTable = require("../mysqlp7").usersTable;

/*--------------------------------------------------------------------------
 ft signup :
 
 Objet: pour enregistrement de nouveaux utilisateurs

 verbe: POST

 Algo: 
   hash du mot de passe
   mysql: INSERT INTO users pour créer le user
------------------------------------------------------------*/
exports.signup = (req, res, next) => {
  try {
    console.log("DEBUG: ft signup");
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        sql =
          "INSERT INTO " +
          usersTable +
          " (email, passwd, pseudo) VALUES ('" +
          req.body.email +
          "','" +
          hash +
          "','" +
          req.body.pseudo +
          "');";

        console.log("DEBUG signup: sql = " + sql);
        connection.query(sql, (err, data, fields) => {
          if (err) {
            // Reponse avec code et message d'erreur
            res.status(400).json({
              message: "code: " + err.code + " message: " + err.sqlMessage,
            });
            console.log("DEBUG: createUser: erreur  " + err);
          } else {
            // OK utilisateur cree
            console.log(
              "DEBUG: createUser: utilisateur cree  " + req.body.pseudo
            );

            res
              .status(201)
              .json({ message: "Utilisateur créé : " + req.body.pseudo });
          }
        });
      })
      .catch((err) => {
        console.log("createUser: erreur:  " + err);
        res.status(500).json({ err });
      });
  } catch (err) {
    console.log("createUser: erreur:  " + err);
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
    userId: 32,
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
    userId: 32,
    email: 'titi16.1@test.fr',
    passwd: '$2b$10$IK9u4N/bEGC3oVAwk9UzUOWB2.2O9qAh0zzlpUiublkMpFxWJ.od6',
    pseudo: 'titi16',
    moderator: 0
  }
]

obj=result[0]=
{
    userId: 32,
    email: 'titi16.1@test.fr',
    passwd: '$2b$10$IK9u4N/bEGC3oVAwk9UzUOWB2.2O9qAh0zzlpUiublkMpFxWJ.od6',
    pseudo: 'titi16',
    moderator: 0
  }

On peut récupérer chaque item par
const userId=obj.userId
const passwd= obj.passwd 
...

----------------------------------------------------------------*/
exports.login = (req, res, next) => {
  try {
    console.log("DEBUG : fonction exports.login");
    const secretKey = process.env.SECRET_KEY;

    const sql =
      "SELECT * FROM " +
      usersTable +
      " WHERE email = '" +
      req.body.email +
      "';";

    console.log("DEBUG: login  requete sql = " + sql);

    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("DEBUG: login erreur  " + err);
      } else {
        // test log
        console.log("DEBUG login  data= " + data);
        try {
          //result est un tableau avec 1 seul elt
          const result = Object.values(JSON.parse(JSON.stringify(data)));

          const obj = result[0];

          const passwd = obj.passwd;
          const moderator = obj.moderator;
          const userId = obj.userId;
          const pseudo = obj.pseudo;

          console.log("DEBUG: login  userId= " + userId);
          //
          //bcrypt pour vérifier le mot de passe envoyé par l'utilisateur avec le hash enregistré
          //Si correct renvoi du TOKEN au frontend
          //  A completer

          bcrypt
            .compare(req.body.password, passwd)
            .then((valuserId) => {
              console.log("DEBUG: bcrypt");
              if (!valuserId) {
                console.log("DEBUG: bcrypt: passwd incorrect");

                return res
                  .status(401)
                  .json({ error: "Mot de passe incorrect" });
              }

              console.log("DEBUG: bcrypt: passwd correct renvoi du token");
              //token signé avec clé secrete et qui expire dans 24h avec chaine alleatoire
              const token = jwt.sign(
                {
                  userId: userId,
                },
                secretKey,
                { expiresIn: "24h" }
              );
              console.log("DEBUG: login  token:  " + token);
              res.status(200).json({
                userId: userId,
                moderator: moderator,
                token: token,
                pseudo: pseudo,
              });
            })
            .catch((err) =>
              res.status(500).json({ error: new Error("Erreur server" + err) })
            ); //500 = error serveur
          //
        } catch (err) {
          console.log("login: login failed  " + err);
          res.status(400).json({ message: "login failed" });
        }
      }
    });
  } catch (err) {
    console.log("login: erreur  " + err);
    res.status(500).json({
      error: new Error("Erreur server  " + err),
    });
  }
};

/*----------------------------------------------------------------------------
ft modifyUser

Objet: modifier le profil d'un utilisateur.

verbe: PUT

Algo:
  test valeur à modifier.
  On ne peux modifier qu'un seul param à la fois
  Test email
    puis pseudo
      puis passwd
  On mets à jour un des  3 paramètres email, passwd hash et pseudo
  Hash du passwd 

----------------------------------------------------------------*/

exports.modifyUser = (req, res, next) => {
  try {
    console.log("DEBUG: ft modifyUser");
    console.log(
      req.body.email + " " + req.body.pseudo + " " + req.body.password
    );

    // partie sql correspondant à chaque param
    // req SQL en ft du param à modifier
    let dataToModify = "";

    //test email
    if (req.body.email !== undefined) {
      dataToModify = " email = '" + req.body.email + "'";
    }
    //test pseudo
    else if (req.body.pseudo !== undefined) {
      dataToModify = " pseudo = '" + req.body.pseudo + "'";
    }

    // Cas avec passwd modifié on doit le hasher
    if (req.body.password !== undefined) {
      console.log("DEBUG: cas avec passwd " + req.body.password);
      //modif du passwd
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          sql =
            "UPDATE " +
            usersTable +
            " SET " +
            "passwd ='" +
            hash +
            "' WHERE userId= '" +
            req.params.userId +
            "';";

          console.log("DEBUG ft modifyUser: sql=" + sql);
          connection.query(sql, (err, data, fields) => {
            if (err) {
              // Reponse avec code et message d'erreur
              res.status(400).json({
                message: "code: " + err.code + " message: " + err.sqlMessage,
              });
              console.log("modifyUser: erreur  " + err);
            } else {
              // OK utilisateur modifie
              console.log("DEBUG: modifyUser: utilisateur modifie  ");

              res.status(201).json({ message: "Utilisateur modifie  " });
            }
          });
        })
        .catch((err) => {
          console.log("modifyUser: erreur:  " + err);
          res.status(500).json({ message: "modify failed" });
        });
    }
    //-------------------------------------------------------------------------
    // Cas modif pseudo ou email: req sql simple
    else if (dataToModify !== "") {
      console.log("DEBUG dataToModify = " + dataToModify);

      sql =
        "UPDATE " +
        usersTable +
        " SET " +
        dataToModify +
        " WHERE userId= '" +
        req.params.userId +
        "';";

      console.log("DEBUG ft modifyUser: sql=" + sql);
      connection.query(sql, (err, data, fields) => {
        if (err) {
          // Reponse avec code et message d'erreur
          res.status(400).json({
            message: "code: " + err.code + " message: " + err.sqlMessage,
          });
          console.log("modifyUser: erreur  " + err);
        } else {
          // OK utilisateur modifie
          console.log("DEBUG: modifyUser: utilisateur modifie  ");

          res.status(201).json({
            message: "Utilisateur modifie  ",
          });
        }
      });
    } // fin Cas modif pseudo ou email
    else {
      // cas où tous les params passés sont undefined = on ne modifie rien
      res.status(500).json({ message: "modify failed" });
    }
    // fin du try
    //--------------------------------------------------------
  } catch (err) {
    console.log("modifyUser: erreur:  " + err);
    res.status(500).json({
      error: new Error("Erreur server " + err),
    });
  }
}; // fin modifyUser

/*----------------------------------------------------------------------------
ft deleteUser

Objet: supprimer les utilisateurs.

verbe: DELETE

Algo:
  Vérif de l'utilisateur
  query mysal: DELETE from "table user" avec userId du user

----------------------------------------------------------------*/
exports.deleteUser = (req, res, next) => {
  try {
    console.log("DEBUG : fonction exports.deleteUser");

    const sql =
      "DELETE  FROM " +
      usersTable +
      " WHERE userId = '" +
      req.params.userId +
      "';";

    console.log("DEBUG: deleteUser: requete sql = " + sql);

    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("erreur" + err);
      } else {
        try {
          //Retour message avec status

          res.status(200).json({ message: "Utilisateur supprimé" });

          //
        } catch (err) {
          console.log("deleteUser: erreur" + err);
          res.status(400).json({ message: "delete failed" });
        }
      }
    });
  } catch (err) {
    console.log("deleteUser: erreur:  " + err);
    res.status(500).json({
      error: new Error("Erreur server:  " + err),
    });
  }
};
