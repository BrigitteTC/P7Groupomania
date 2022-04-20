//groupomania

/*----------------------------------------------------
user.js
router pour les utilisateurs.
Auteur: BTC/
Date de création: 20/04/2022
----------------------------------------------------------
*/
//declaration express et son router
const express = require("express");
const router = express.Router();

// controleur pour associer les fonctions aux différentes routes
const userCtrl = require("../controllers/user");

//routes POST pour signup et login envoyé par le frontend
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

//Suppression d'un utilisateur  DELETE
router.delete("/:id", auth, userCtrl.deleteUser);

//export du router
module.exports = router;
