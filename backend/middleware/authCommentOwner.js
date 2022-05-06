//Groupomania

/*----------------------------------------
middleware/authCommentOwner.js
Date de création: 06/05/2022
auteur: BTC

Gestion authentification des utilisateurs pour les commentaires
pour protéger les routes sensibles

Algo:

Middleware appelé si le user est authentifié.

    Si (utilisateur = moderateur)
      next()
    Sinon
      Si (utilisateur = comment owner)
        next()
      sinon
        Retour requete non autorisée
      FSI
    FSI





  req.auth.userId: est l'id déduit du token du header.
  req.params.postId: est l'id du post donné dans l'URL
  userId = id du user proprietaire du post.


------------------------------------------------*/

//jsonwebtoken pour vérifier les token

const jwt = require("jsonwebtoken");

//Base de données mysql
// connection database groupomania
const connection = require("../mysqlp7").connection;

//Tables des posts et des commentaires
const usersTable = require("../mysqlp7").usersTable;

const commentsTable = require("../mysqlp7").commentsTable;

/*------------------------------------------------------------------------
authCommentOwner


-------------------------------------------------------------------------**/

module.exports = (req, res, next) => {
  console.log("DEBUG : fonction authCommentOwner");
  try {
    // verifier user = moderateur
    const userId = req.auth.userId;
    // Is moderator Begin
    // Requete sql pour verifier moderateur oui/non
    sqlModerator =
      "SELECT moderator FROM " +
      usersTable +
      " WHERE userId ='" +
      userId +
      "';";

    console.log("DEBUG  ft authCommentOwner isModerator sql: " + sqlModerator);
    connection.query(sqlModerator, (err, data, fields) => {
      //Query SQL moderator
      if (err) {
        // Reponse avec code et message d'erreur

        console.log("erreur isModerator  " + err);
        console.log("erreur authCommentOwner:  " + err);
        res.status(401).json({
          error: new Error("Invalid request!"),
        });
      } else {
        //  query SQL moderator OK
        //
        console.log("DEBUG: ft isModerator: retour sql OK");
        console.log("DEBUG data " + data);
        console.log("DEBUG fields " + fields);
        console.log("DEBUG data length  " + JSON.stringify(data).length);
        // test longueur des data >2 = on a un objet json rempli
        if (JSON.stringify(data).length > 2) {
          const result = Object.values(JSON.parse(JSON.stringify(data)));
          const obj = result[0];

          console.log("DEBUG: ft isModerator: isModerator = " + obj.moderator);

          //SI Moderateur
          if (obj.moderator == 1) {
            console.log(
              "DEBUG: authCommentOwner: user moderator on passe a la suite"
            );
            next();

            // SINON  Test user = owner
          } else {
            // le user n'est pas moderateur. Verif si il est propriétaire
            // Verif propriétaire
            sqlCommentOwner =
              "SELECT userId FROM " +
              commentsTable +
              " WHERE commentId ='" +
              req.params.commentId +
              "';";
            console.log(
              "DEBUG  ft authCommentOwner sqlCommentOwner: " + sqlCommentOwner
            );

            connection.query(sqlCommentOwner, (err, data, fields) => {
              if (err) {
                // retour query en erreur: Reponse avec code et message d'erreur

                console.log("erreur sqlPostOwner  " + err);

                res.status(401).json({
                  error: new Error("Invalid request!"),
                });
              } else {
                // Retour query OK
                // Verif userId retourné = userId de celui qui a lancé la requete
                // Debut Verif userId
                console.log("DEBUG: sqlPostOwner: retour sql OK");
                console.log("DEBUG sqlPostOwner data " + data);
                console.log("DEBUG sqlPostOwner fields " + fields);
                console.log(
                  "DEBUG data length  " + JSON.stringify(data).length
                );
                // test longueur des data >2 = on a un objet json rempli
                if (JSON.stringify(data).length > 2) {
                  // Data non vide
                  const resultOwner = Object.values(
                    JSON.parse(JSON.stringify(data))
                  );
                  const objOwner = resultOwner[0];

                  console.log("DEBUG: sqlPostOwner = " + objOwner.userId);
                  //SI Owner
                  if (objOwner.userId == userId) {
                    console.log(
                      "DEBUG: authCommentOwner: user propriétaire on passe a la suite"
                    );
                    next();
                  } else {
                    //REtour user invalide
                    console.log(
                      "DEBUG : fonction auth: 403: unauthorized request"
                    );
                    res.status(403).json({
                      error: new Error("unauthorized request"),
                    });
                  } // FIN SI Owner
                } else {
                  console.log("DEBUG: invalid request");
                  res.status(401).json({
                    error: new Error("Invalid request!"),
                  });
                } // Fin test data non vides
              } // FIN verif userId = owner du post
            });
          } // Fin verif propriétaire
        } // Fin test data non vides au retour de la requete moderator
        else {
          console.log("DEBUG: invalid request");
          res.status(401).json({
            error: new Error("Invalid request!"),
          });
        } // cas data vides
      } // Fin traitement query SQL moderator OK
    }); // End query SQL moderator
  } catch (err) {
    console.log("erreur authCommentOwner:  " + err);
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  } //fin catch ft
}; //fin module.exports
