//Groupomania

/*----------------------------------------
middleware/authPost.js
Date de création: 27/04/2022
auteur: BTC

Gestion authentification des utilisateurs pour les posts
pour protéger les routes sensibles

Algo:
Test user authentifié

SI authentifié
  Si methode = POST ou GET
    next()
  sinon
    Si (utilisateur = moderateur)
      next()
    Sinon
      Si (utilisateur = post/comment owner)
        next()
      sinon
        Retour requete non autorisée
      FSI
    FSI
  FSI
FSI


ATTENTION: pour DELETE et PUT
  Ne pas mettre le userId dans le body mais:
  Utilisation de req.auth pour authentifier l'utilisateur
  car la vérification du user envoyé par le body peut être falsifiée
  par une personne malveillante qui utiliserait POSTMAN par exemple pour envoyer une
  requete.


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
const postsTable = require("../mysqlp7").postsTable;
const commentsTable = require("../mysqlp7").commentsTable;

/*------------------------------------------------------------------------
authPost


-------------------------------------------------------------------------**/

module.exports = (req, res, next) => {
  console.log("DEBUG : fonction authPost");
  try {
    //on récupère le token dans le header = 2ieme elt du header apres le bearer
    const token = req.headers.authorization.split(" ")[1];
    console.log(
      "DEBUG : fonction authPost: req.headers.authorization : " +
        req.headers.authorization
    );
    console.log("DEBUG : fonction authPost: token : " + token);
    const secretKey = process.env.SECRET_KEY;
    console.log("DEBUG : fonction authPost: secretKey : " + secretKey);

    // on décode le token avec verify et clé secrete
    const decodedToken = jwt.verify(token, secretKey);
    console.log("DEBUG : fonction authPost: decodedToken : " + decodedToken);

    const userId = decodedToken.userId; //userId deduit du token
    console.log("DEBUG : fonction authPost: userId : " + userId);

    // verifie user authentifie
    if (userId) {
      console.log("DEBUG : fonction authPost: decodedToken.userId : " + userId);

      req.auth = { userId }; //attribue le userId à l'objet requete (clé et var du meme nom)
      console.log("DEBUG : fonction authPost: req.auth : " + req.auth.userId);

      // Verifs à faire plus tard:
      //
      //
      // verifier user = moderateur

      // Is moderator Begin
      // Requete sql pour verifier moderateur oui/non
      sqlModerator =
        "SELECT moderator FROM " +
        usersTable +
        " WHERE userId ='" +
        userId +
        "';";

      console.log("DEBUG  ft authPost isModerator sql: " + sqlModerator);
      connection.query(sqlModerator, (err, data, fields) => {
        if (err) {
          // Reponse avec code et message d'erreur

          console.log("erreur isModerator  " + err);
          console.log("erreur authPost:  " + err);
          res.status(401).json({
            error: new Error("Invalid request!"),
          });
        } else {
          // OK
          console.log("DEBUG: ft isModerator: retour sql OK");
          console.log("DEBUG data " + data);
          console.log("DEBUG fields " + fields);
          console.log("DEBUG data length  " + JSON.stringify(data).length);
          // test longueur des data >2 = on a un objet json rempli
          if (JSON.stringify(data).length > 2) {
            const result = Object.values(JSON.parse(JSON.stringify(data)));
            const obj = result[0];

            console.log(
              "DEBUG: ft isModerator: isModerator = " + obj.moderator
            );

            //SI Moderateur
            if (obj.moderator == 1) {
              console.log(
                "DEBUG: authPost: user moderator on passe a la suite"
              );
              next();

              // Is Moderator: End

              // SINON  SI Methode = POST ou GET
            } else {
              //SI methode = POST ou GET
              console.log("DEBUG: methode:" + req.method);
              if (req.method == "POST" || req.method == "GET") {
                //POST: user authentifie
                // PUT ou DELETE: test proprietaire du post pour un PUT ou DELETE
                // ou user = proprietaire du post ou du comment
                //       cad: il faut req.auth.userId = req.boby.userId si req.boby.userId

                console.log(
                  "DEBUG: authPost: POST ou GET user authentifie on passe à la suite"
                );
                next();
              } //FIN SI methode = POST ou GET
              else {
                //SI methode = PUT ou DELETE
                console.log(
                  "DEBUG: authPost: PUT OU DELETE user authentifie on passe à la suite"
                );
                //SI user = post owner
                // Requete sql pour verifier post owner
                sqlPostOwner =
                  "SELECT userId FROM " +
                  postsTable +
                  " WHERE postId ='" +
                  req.params.postId +
                  "';";
                console.log("DEBUG  ft authPost postOwnersql: " + sqlPostOwner);

                ////////// A completer *****************************////////
                next();
              }
            } // FIN SI moderator
          } else {
            console.log("DEBUG: invalid request");
            res.status(401).json({
              error: new Error("Invalid request!"),
            });
          }
        }
      }); // Fin sql query moderator
    } // FIN if (userId)
  } catch (err) {
    console.log("erreur authPost:  " + err);
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
