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
    console.log("DEBUG: ft signup");
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
    console.log("DEBUG : fonction exports.login");
    const secretKey = process.env.SECRET_KEY;

    const sql = "SELECT * FROM user WHERE email = '" + req.body.email + "';";

    console.log("DEBUG: requete sql = " + sql);

    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("DEBUG: erreur" + err);
      } else {
        // test log
        console.log("DEBUG  data= " + data);
        try {
          //result est un tableau avec 1 seul elt
          const result = Object.values(JSON.parse(JSON.stringify(data)));

          const obj = result[0];

          const passwd = obj.passwd;
          const moderator = obj.moderator;
          const id = obj.id;

          console.log("DEBUG: id= " + id);
          //
          //bcrypt pour vérifier le mot de passe envoyé par l'utilisateur avec le hash enregistré
          //Si correct renvoi du TOKEN au frontend
          //  A completer

          bcrypt
            .compare(req.body.password, passwd)
            .then((valid) => {
              console.log("DEBUG: bcrypt");
              if (!valid) {
                console.log("DEBUG: bcrypt: passwd incorrect");

                return res
                  .status(401)
                  .json({ error: "Mot de passe incorrect" });
              }

              console.log("DEBUG: bcrypt: passwd correct renvoi du token");
              //token signé avec clé secrete et qui expire dans 24h avec chaine alleatoire
              const token = jwt.sign(
                {
                  userId: id,
                },
                secretKey,
                { expiresIn: "24h" }
              );
              console.log("DEBUG: login  token:  " + token);
              res.status(200).json({
                userId: id,
                moderator: moderator,
                token: token,
              });
            })
            .catch((err) =>
              res.status(500).json({ error: new Error("Erreur server" + err) })
            ); //500 = error serveur
          //
        } catch (err) {
          console.log("login failed" + err);
          res.status(400).json({ message: "login failed" });
        }
      }
    });
  } catch (err) {
    console.log("erreur  " + err);
    res.status(500).json({
      error: new Error("Erreur server" + err),
    });
  }
};

/*----------------------------------------------------------------------------
ft modifyUser

Objet: modifier le profil d'un utilisateur.

verbe: PUT

Algo:
  Idem signup
  On mets à jour les 3 paramètres email, passwd haxhe et pseudo
  Hash du passwd 

----------------------------------------------------------------*/

exports.modifyUser = (req, res, next) => {
  try {
    console.log("DEBUG: ft modifyUser");
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        sql =
          "UPDATE user SET email ='" +
          req.body.email +
          "', passwd ='" +
          hash +
          "', pseudo = '" +
          req.body.pseudo +
          "' WHERE id= '" +
          req.params.id +
          "';";

        console.log("DEBUG ft ModifyUser: sql=" + sql);
        connection.query(sql, (err, data, fields) => {
          if (err) {
            // Reponse avec code et message d'erreur
            res.status(400).json({
              message: "code: " + err.code + " message: " + err.sqlMessage,
            });
            console.log("erreur" + err);
          } else {
            // OK utilisateur modifie
            console.log("DEBUG: utilisateur modifie" + req.body.pseudo);

            res
              .status(201)
              .json({ message: "Utilisateur modifie : " + req.body.pseudo });
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
ft deleteUser

Objet: supprimer les utilisateurs.

verbe: DELETE

Algo:
  Vérif de l'utilisateur
  Delete User

----------------------------------------------------------------*/
exports.deleteUser = (req, res, next) => {
  try {
    console.log("DEBUG : fonction exports.deleteUser");

    const sql = "DELETE  FROM user WHERE id = '" + req.params.id + "';";

    console.log("DEBUG: requete sql = " + sql);

    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur
        res.status(400).json({
          message: "code: " + err.code + " message: " + err.sqlMessage,
        });
        console.log("erreur" + err);
      } else {
        try {
          //result est un tableau avec 1 seul elt

          console.log("DEBUG: data= " + data);
          console.log("DEBUG: fields= " + fields);
          //

          res.status(200).json({ message: "Utilisateur supprimé" });

          //
        } catch (err) {
          console.log("erreur" + err);
          res.status(400).json({ message: "delete failed" });
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      error: new Error("Erreur server" + err),
    });
  }
};
