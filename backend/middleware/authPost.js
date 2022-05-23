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
    // console.log("DEBUG : fonction authPost: secretKey : " + secretKey);

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
      console.log("DEBUG : user authentifié on passe à la suite");
      next();
    } // FIN if (userId)
  } catch (err) {
    console.log("erreur authPost:  " + err);
    res.status(401).json({
      error: new Error("Invalid request!" + err),
    });
  }
};
