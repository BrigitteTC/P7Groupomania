//Groupomania

/*----------------------------------------
middleware/authPost.js
Date de création: 27/04/2022
auteur: BTC

Gestion authentification des utilisateurs pour les posts
pour protéger les routes sensibles


ATTENTION: pour DELETE et PUT
  Utilisation de req.auth pour authentifier l'utilisateur
  car la vérification du user envoyé par le body peut être falsifiée
  par une personne malveillante qui utiliserait POSTMAN par exemple pour envoyer une
  requete.


  req.auth.userId: est l'id déduit du token du header.
  req.params.id: est l'id du post donné dans l'URL
  userId = id du user proprietaire du post.

  Por authentifier un post:
  Il faut vérifier que celui qui envoie la requete est bien le proprietaire du post.
------------------------------------------------*/

//configure dotenv pour les variables d'environnement
require("dotenv").config();

//jsonwebtoken pour vérifier les token

const jwt = require("jsonwebtoken");

//Base de données mysql
// connection database groupomania
const connection = require("../mysqlp7").connection;

/*-----------------------------------------------------------
function: getPostOwner

Objet: donne le proprietaire d'un post

Parametres:
  entrée: id du post
  sortie: userId du post

Algorithme
  requete sql sur table post
    recherche userId correspondant à l'Id du post
----------------------------------------------------------------------
*/
function getPostOwner(postId) {
  console.log("DEBUG : getPostOwner");
  var postUserId = "";

  try {
    // Requete sql pour lire tour les post
    sql = "SELECT userId FROM post WHERE id ='" + postId + "';";

    console.log("DEBUG  getPostOwner sql: " + sql);
    connection.query(sql, (err, data, fields) => {
      if (err) {
        // Reponse avec code et message d'erreur

        console.log("erreur getPostOwner  " + err);
      } else {
        // OK
        console.log("DEBUG: getPostOwner OK");
        console.log(data);
        //const result = Object.values(JSON.parse(JSON.stringify(data)));
        const result = JSON.parse(JSON.stringify(data));
        postUserId = result.userId;
      }
    });
  } catch (err) {
    console.log("getPostOwner erreur: " + err);
  }
  return postUserId;
}

/*------------------------------------------------------------------------



--------------------------------------------------------------------------
*/

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

    //REcherche propriétaire du post
    const postUserId = getPostOwner(req.params.id);

    //verif user du token = proprietaire du post

    console.log("DEBUG : fonction authPost: req.params.id : " + req.params.id);

    console.log("DEBUG ft authPost postUserId  " + postUserId);

    if (postUserId == userId) {
      console.log("DEBUG : fonction authPost: decodedToken.userId : " + userId);

      req.auth = { userId }; //attribue le userId à l'objet requete (clé et var du meme nom)
      console.log("DEBUG : fonction authPost: req.auth : " + req.auth.userId);

      // verif userId de la requete correspond à celui du token
      // test à faire plus tard
      // verifier user = moderateur
      // ou user = proprietaire du post ou du comment
      //       cad: il faut req.auth.userId = req.boby.userId si req.boby.userId existe
      next();
    }
  } catch (err) {
    console.log("erreur authPost:  " + err);
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
