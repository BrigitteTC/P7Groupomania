//Groupomania

/*----------------------------------------
middleware/auth.js
Date de création: 26/04/2022
auteur: BTC

Gestion authentification des utilisateurs
pour protéger les routes sensibles


ATTENTION: pour DELETE et PUT
  Utilisation de req.auth pour authentifier l'utilisateur
  car la vérification du user envoyé par le body peut être falsifiée
  par une personne malveillante qui utiliserait POSTDAM par exemple pour envoyer une
  requete.


  req.auth.userId: est l'id déduit du token du header.
  req.params.id: est l'id donné dans l'URL
------------------------------------------------*/

//configure dotenv pour les variables d'environnement
require("dotenv").config();

//jsonwebtoken pour vérifier les token

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("DEBUG : fonction auth");
  try {
    //on récupère le token dans le header = 2ieme elt du header apres le bearer
    const token = req.headers.authorization.split(" ")[1];
    console.log(
      "DEBUG : fonction auth: req.headers.authorization : " +
        req.headers.authorization
    );
    console.log("DEBUG : fonction auth: token : " + token);
    const secretKey = process.env.SECRET_KEY;
    console.log("DEBUG : fonction auth: secretKey : " + secretKey);

    // on décode le token avec verify et clé secrete
    const decodedToken = jwt.verify(token, secretKey);
    console.log("DEBUG : fonction auth: decodedToken : " + decodedToken);

    const userId = decodedToken.userId;
    console.log("DEBUG : fonction auth: userId : " + userId);
    req.auth = { userId }; //attribue le userId à l'objet requete (clé et var du meme nom)
    console.log("DEBUG : fonction auth: req.auth : " + req.auth.userId);

    // verif userId de la requete correspond à celui du token
    console.log(
      "DEBUG : fonction auth: verif req.auth.userId: " + req.auth.userId
    );
    console.log(
      "DEBUG : fonction auth: verif req.params.id : " + req.params.id
    );

    // test id du token correspond à l'Id de la route DELETE
    if (req.params.id != req.auth.userId) {
      console.log("DEBUG : fonction auth: 403: unauthorized request");
      throw "403: unauthorized request";
    } else {
      // tout va bien on peut passer la requete on passe à la suite

      next();
    }
  } catch (e) {
    console.log("erreur auth:  " + e);
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
