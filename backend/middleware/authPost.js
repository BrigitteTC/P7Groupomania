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
  req.params.id: est l'id donné dans l'URL

  Por authentifier un post:
  Il faut vérifier que celui qui envoie la requete est bien le proprietaire du post.
------------------------------------------------*/

//configure dotenv pour les variables d'environnement
require("dotenv").config();

//jsonwebtoken pour vérifier les token

const jwt = require("jsonwebtoken");

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

    const userId = decodedToken.userId;
    if (req.body.userId) {
      console.log(
        "DEBUG : fonction authPost: req.body.userId : " + req.body.userId
      );
    }
    console.log("DEBUG : fonction authPost: decodedToken.userId : " + userId);
    req.auth = { userId }; //attribue le userId à l'objet requete (clé et var du meme nom)
    console.log("DEBUG : fonction authPost: req.auth : " + req.auth.userId);

    // verif userId de la requete correspond à celui du token
    // test à faire plus tard
    // verifier user = moderateur
    // ou user = proprietaire du post ou du comment
    //       cad: il faut req.auth.userId = req.boby.userId si req.boby.userId existe
    next();
  } catch (err) {
    console.log("authPost:  " + err);
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
