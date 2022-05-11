//P7 Groupomania

/*--------------------------
signup.js
date: 9/05/2022
auteur: BTC

Script pour mettre à jour la page login

Récupération des données utilisateur et envoi au serveur.
*******************************************************************/

//-------------------------------------------------------------------------------
//function:    waitLoginFillForm()
//
//Objet: Attente des entrées sur les champs du formulaire et affiche un message d'erreur
//  si saisie invalide
//
// Parametres:
//  Entrée: rien
//  Sortie: rien
//
//Algo:
//  Ecoute sur tous les champs du formulaire
//  Affichage message d'erreur si saisie invalide
//
// Liste des id du formulaire:
//    id = "passwd";  type text
//    id = "email";     type email
//-----------------------------------------------------------------------------
async function waitLoginFillForm() {
  try {
    console.log("ft waitLoginFillForm");
    // class de booleans pour verif champs du formulaire
    let newUserCoordCheck = new userCoordCheck(false, false, false);

    //pseudo
    // pour le login: check forcé à true car le champ n'est pas dans le formulaire

    newUserCoordCheck.pseudo = true;

    //passwd
    //    id = "passwd";  type text
    let passwdForm = document.getElementById(C_formpasswd);
    let passwdError = document.getElementById(C_formpasswd + C_formErrorMsg);
    passwdForm.addEventListener("change", function () {
      // Vérif valeur entrée
      newUserCoordCheck.passwd = verifFieldForm(passwdForm, passwdError, "");
    });

    //email
    //    id = "email";     type email

    let emailForm = document.getElementById(C_formemail);
    let emailError = document.getElementById(C_formemail + C_formErrorMsg);
    emailForm.addEventListener("change", function () {
      // Vérif valeur entrée
      newUserCoordCheck.email = verifFieldForm(
        emailForm,
        emailError,
        expressionEmailName
      );
    });

    //bouton Valider
    let eltButton = document.getElementById(C_formorder);
    eltButton.addEventListener("click", function (event) {
      boutonLoginValiderFt(event, newUserCoordCheck);
    });
  } catch (e) {
    console.log("waitLoginFillForm  " + e);
  }
}

//--------------------------------------------------------------------------------
// function: boutonLoginValiderFt(event, newUserCoordCheck);
// Objet: traite le click sur le bouton Valider
//
// Parametres:
//  Entrée: event : evennement cliqué
//    newUserCoordCheck: class de booleens avec tous les champs du formulaire
//
// Algo:
//    Mets à jour les coordonnées en ft des données saisies dans le formulaire

//
//  Format de l'objet à envoyer:
//      {
//        header:{authorization: {bearer:null}}
//        body: {
//          email: string;
//          passwd: string,
//
//    }}
//
//---------------------------------------------------------------------------------------------

async function boutonLoginValiderFt(event, newUserCoordCheck) {
  try {
    console.log("on a cliqué sur le bouton Valider");

    event.preventDefault(); //evite le rechargt de la page

    //test champs du formulaire corrects
    if (newUserCoordCheck.passwd === true && newUserCoordCheck.email === true) {
      var newUserCoord = new userCoord();
      newUserCoord = updateUserLoginforOrder(); //Maj  coordonnées de l'utilisateur

      let passwd = newUserCoord.passwd;

      let email = newUserCoord.email;

      /// envoi data par POST
      let data = { email: email, password: passwd };

      console.log("data = " + JSON.stringify(data));

      const retourServeur = await sendDataLoginToServer(C_routeLOGIN, data);
      if (retourServeur === "OK") {
        //user créé avec succes
        const url = C_page_posts;
        //On change de page
        // DEBUG : on reste sur la page login      window.location.href = url;
      }
      ///
    } else {
      //Au moins un des champs du formulaire n'est pas conrrect
      alerteMsg(
        "Remplissez correctement tous les champs du formulaire avant de cliquer sur Valider"
      );
    }
  } catch (e) {
    console.log("boutonLoginValiderFt  " + e);
  }
}

//--------------------------------------------------------------------------------
//sendDataLoginToServer
//
//Objet: envoi login au serveur.
//
//  parametres:
//    entrée: URL
//    data
// Algo
//    envoi requete POST  avec
//      Route de login
//      Format du message
//        {
//         body: {
//            passwd: string,
//            email: string
//                }
//
//    Test retour du serveur
//        Si connexion OK (status = 200)
//            Affiche msg à l'ecran
//            Stock les infos utilisateur dans le local storage.
//-------------------------------------------------------------------------------

async function sendDataLoginToServer(url = "", data = {}) {
  let response; //réponse du fetch
  let retourFt = "KO"; //retour de la ft
  try {
    console.log("envoi de des données au serveur" + JSON.stringify(data));

    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer null",
      },
      body: JSON.stringify(data),
    });

    const retourServer = await response.json();
    const reponseStatus = response.status;
    console.log("response.status  :  " + reponseStatus);

    if (reponseStatus === 200) {
      // user connecté
      alerteMsg("Connexion OK  - Bonjour " + retourServer.pseudo);

      // Maj local storage avec le nouveau user connecté

      let userConnected = new localStorageUser("", 0, "", 0, false);
      userConnected.userId = retourServer.userId;
      userConnected.moderator = retourServer.moderator;
      userConnected.token = retourServer.token;
      userConnected.pseudo = retourServer.pseudo;
      userConnected.userInLocalStorageOK = true;

      // Maj de la clé user dans le local storage
      localStorage.setItem("user", JSON.stringify(userConnected));

      // Verif lecture du local storage
      let ProductSelected = JSON.parse(localStorage.getItem("user")); //elt selectionné
      console.log("lecture du local storage : " + ProductSelected.token);
      alerteMsg("lecture du local storage : " + ProductSelected.token);

      retourFt = "OK";
    } else {
      //error
      console.log("retourServer.message     : " + retourServer.message);
      alerteMsg(retourServer.message);
    }
  } catch (e) {
    console.log("Erreur sendDataLoginToServer  " + e);
  }

  console.log("retour sendDataLoginToServer  : " + retourFt);
  return retourFt;
}

//-------------------------------------------------------------------------------
//function: updateUserLoginforOrder;
//Objet: Mise à jour de l'objet avec les coordonnées de l'utilisateur à envoyer dans la requete POST
//
// Parametres:
//  Entrée: aucun
//  Sortie: parametre de class Coord mis à jour
//
// Algo:
//  Va chercher les elements retrés dans le formulaire en ft des ids
//---------------------------------------------------------------------------------------------
function updateUserLoginforOrder() {
  newUserCoord = new userCoord("", "", "");

  try {
    //email
    newUserCoord.email = document.getElementById(C_formemail).value;
    //passwd
    newUserCoord.passwd = document.getElementById(C_formpasswd).value;
  } catch (e) {
    console.log("updateUserLoginforOrder  " + e);
  }

  return newUserCoord;
}

//------------------------------------------------------------------------------
// function: displayLoginForm();
//
// Objet: Affiche les messages de requis en dessous les champs du formulaire
//
// Parametres: aucun
//
// Algo:
//  Affiche un message sous chaque ligne du formulaire avec les consignes
//  Invalide le bouton "Valider"
//------------------------------------------------------------------------------
function displayLoginForm() {
  try {
    console.log("ft displayLoginForm ");
    //email
    //    id = "email";     type email
    initMsgForm(C_formemail);

    //Passwd:
    initMsgForm(C_formpasswd);
  } catch (e) {
    console.log("Erreur displayLoginForm  " + e);
  }
}

//----------------------------------------------------------------
// ft login
// nom: login
// Objet: Point d'entrée de la ft
//
//  retour: rien
//
// algo:
//
//-------------------------------------------------------------
async function loginFt() {
  try {
    //on récupère les infos du produit passé dans l'URL
    console.log("ft login");
    //Affichage msg pour remplir le formulaire
    displayLoginForm();

    //Validation des entrées dans le formulaire
    waitLoginFillForm();
  } catch (e) {
    console.log("Erreur signupFt: " + e);
  }
}

// Appel de la ft point d'entrée

loginFt();
