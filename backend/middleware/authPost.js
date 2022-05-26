//Groupomania

/*----------------------------------------
middleware/authPost.js
Date de création: 27/04/2022
auteur: BTC

Gestion authentification des utilisateurs pour les posts
pour protéger les routes sensibles

Algo:
Test user authentifié
avec le token envoye dans le header décodé avec la clé secrete




------------------------------------------------*/

//jsonwebtoken pour vérifier les token

const jwt = require("jsonwebtoken");

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
