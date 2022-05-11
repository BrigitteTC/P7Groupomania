//P7 Groupomania

/*--------------------------
signup.js
date: 9/05/2022
auteur: BTC

Script pour mettre à jour la page signup

Récupération des données utilisateur et envoi au serveur.
*******************************************************************/

//-------------------------------------------------------------------------
//callPosts();
//
// Objet: appelle la page posts
//
// Parametres:
//  Entréé: nrien
//  Sortie: rien
//
// Algo
//  maj le HTML pour changer de page
//-----------------------------------------------------------------
function callPosts() {
  try {
    //url de destination
    let url = "../html/posts.html";

    //On va sur la page confirmation
    window.location.href = url;
  } catch (e) {
    console.log("callPosts:" + e);
  }
}

//-------------------------------------------------------------------------
//callLogin;
//
// Objet: appelle la page login
//
// Parametres:
//  Entréé: rien
//  Sortie: rien
//
// Algo
//  appell page login
//-----------------------------------------------------------------
function callLogin() {
  try {
    //url de destination
    let url = "../html/login.html";

    //On va sur la page confirmation
    window.location.href = url;
  } catch (e) {
    console.log("callLogin:" + e);
  }
}

//-------------------------------------------------------------------------------
//function:    waitFillForm()
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
//    id = "pseudo"  type text
//    id = "passwd";  type text
//    id = "email";     type email
//
// format: /^[A-Za-zé'ïöëè -]+$/;
// un ou plusieurs caractères en majuscules
// ou minuscules, un tiret, une apostrophe ou une espace.
// et aussi les e i et o accentués
//-----------------------------------------------------------------------------
async function waitFillForm() {
  try {
    console.log("ft waitFillForm");
    // class de booleans pour verif champs du formulaire
    let newUserCoordCheck = new userCoordCheck(false, false, false);

    //pseudo
    let pseudoForm = document.getElementById(C_formpseudo);
    let pseudoError = document.getElementById(C_formpseudo + C_formErrorMsg);

    //Listener sur les champs du formulaire
    pseudoForm.addEventListener("change", function () {
      // Vérif valeur entrée
      newUserCoordCheck.pseudo = verifFieldForm(pseudoForm, pseudoError, "");
    });

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
      boutonValiderFt(event, newUserCoordCheck);
    });
  } catch (e) {
    console.log("waitFillForm  " + e);
  }
}

//--------------------------------------------------------------------------------
// function: boutonValiderFt(event, newUserCoordCheck);
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
//      dataToPost={
//        header:{authorization: {bearer:null}}
//        body: {
//          email: string;
//          passwd: string,
//          pseudo: string,
//    }}
//
//---------------------------------------------------------------------------------------------

async function boutonValiderFt(event, newUserCoordCheck) {
  try {
    console.log("on a cliqué sur le bouton Valider");

    event.preventDefault(); //evite le rechargt de la page

    //test champs du formulaire corrects
    if (
      newUserCoordCheck.pseudo === true &&
      newUserCoordCheck.passwd === true &&
      newUserCoordCheck.email === true
    ) {
      var newUserCoord = new userCoord();
      newUserCoord = updateUserforOrder(); //Maj  coordonnées de l'utilisateur

      let pseudo = newUserCoord.pseudo;

      let passwd = newUserCoord.passwd;

      let email = newUserCoord.email;

      //Objet à envoyer

      //Envoi la commande à l'API
      //let response = await sendDataToServer(C_serverPOST, dataToPost).then(
      // await sendDataToServer(C_routeSIGNUP, dataToPost).then((data) => {
      //  console.log("retour serveur = " + data); // JSON data parsed by `data.json()` call
      //   console.log(response);
      //Envoi validation/
      // test retour serveur
      // message d'alerte si ou message OK si OK avec affichage page login
      //callLogin();
      //url de destination
      //let url = "../index.html";

      //On va sur la page confirmation
      //window.location.href = url;
      //});

      /// envoi POST
      let data = { email: email, password: passwd, pseudo: pseudo };

      console.log("data = " + JSON.stringify(data));

      //const retourServeur = await sendDataToServer(C_routeSIGNUP, data);
      const retourServeur = await sendDataToServer(C_routeSIGNUP, data);
      if (retourServeur === "OK") {
        //user créé avec succes
        const url = "../index.html";
        //On va sur la page confirmation
        //window.location.href = url;
      } else {
        //probleme ds la creatino du user
        alerteMsg(retourServeur);
      }

      ///
    } else {
      //Au moins un des champs du formulaire n'est pas conrrect
      alerteMsg(
        "Remplissez correctement tous les champs du formulaire avant de cliquer sur Valider"
      );
    }
  } catch (e) {
    console.log("boutonValiderFt  " + e);
  }
}

//--------------------------------------------------------------------------------
//sendDataToServer
//
//Format du message
//{
// body: {
//    pseudo: string,
//    passwd: string,
//    email: string
// }

//
//body, qui contient tous les champs du formulaire
// (email, passwd et pseudo) préalablement vérifiés.
//-------------------------------------------------------------------------------

async function sendDataToServer(url = "", data = {}) {
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
    // nouveau user cree

    console.log("retourServer.message     : " + retourServer.message);

    if (reponseStatus === 201) {
      alerteMsg(
        "user cree avec succes  - Vous devez vous connecter à votre compte"
      );
    } else {
      //error
      alerteMsg(retourServer.message);
    }

    retourFt = reponseStatus + " " + retourServer.message;
  } catch (e) {
    console.log("Erreur sendDataToServer  " + e);
  }

  console.log("retour sendDataToServer  : " + retourFt);
  return retourFt;
}

//-------------------------------------------------------------------------------
//function: updateUserforOrder;
//Objet: Mise à jour de l'objet avec les coordonnées de l'utilisateur à envoyer dans la requete POST
//
// Parametres:
//  Entrée: aucun
//  Sortie: parametre de class Coord mis à jour
//
// Algo:
//  Va chercher les elements retrés dans le formulaire en ft des ids
//---------------------------------------------------------------------------------------------
function updateUserforOrder() {
  newUserCoord = new userCoord("", "", "");

  try {
    //pseudo
    newUserCoord.pseudo = document.getElementById(C_formpseudo).value;

    //passwd
    newUserCoord.passwd = document.getElementById(C_formpasswd).value;

    //email
    newUserCoord.email = document.getElementById(C_formemail).value;
  } catch (e) {
    console.log("updateUserforOrder  " + e);
  }

  return newUserCoord;
}

//-------------------------------------------------------------------------------
//function:    verifFieldForm()
//
//Objet: Vérifie un champ de formulaire en ft d'une regex passée en param
//
// Parametres:
//  Entrée:
//    id du champ à vérifier
//    id champ erreur correspondant
//    regex
//
//  Sortie: boolean true si verif OK, false sinon
//
//Algo:
//  Récupère la chaine de caracteres rentrée.
//  la compare avec la regex
//  retourne vrai si comparaison OK et false sinon
//-----------------------------------------------------------------------------
function verifFieldForm(paramIdElt, paramErrorIdElt, patern) {
  let B_paramVerif = true; //valeur de retour vrai/false
  let entree = String(paramIdElt.value);

  console.log("verifFieldForm");
  try {
    if (entree !== "") {
      if (patern !== "") {
        //Teste la valeur rentrée correspond à la patern
        if (patern.test(entree)) {
          // S'il y a un message d''erreur affiché et que le champ
          // est valide, on retire l'erreur
          paramErrorIdElt.innerHTML = ""; // On réinitialise le contenu
          console.log("entrée  " + paramIdElt.value + " OK");
        } else {
          paramErrorIdElt.innerHTML = C_msgForm_invalid;
          console.log("entrée  " + paramIdElt.value + " KO");
          B_paramVerif = false;
        }
      } else {
        //pas de patern à verifier on valide la valeur saisie
        paramErrorIdElt.innerHTML = ""; // On réinitialise le contenu
        console.log("entrée  " + paramIdElt.value + " OK");
      }
    } else {
      //entrée vide
      paramErrorIdElt.innerHTML = C_msgForm_vide;
      console.log("entrée  " + "vide");
      B_paramVerif = false;
    }
  } catch (e) {
    console.log("verifFieldForm  " + entree + e);
    B_paramVerif = false;
  }
  return B_paramVerif;
}
//-------------------------------------------------------------------------------
//function:    waitClickOrder()
//
//Objet: Attente click sur bouton Valider et traitement correspondant
//
// Parametres:
//  Entrée: rien
//  Sortie: rien
//
//Algo:
//  Ecoute sur l'elet avec id="order"
//
//-----------------------------------------------------------------------------
function waitClickOrder() {
  try {
    const eltButton = document.getElementById(C_formorder);
    eltButton.addEventListener("click", function () {
      console.log("on a cliqué sur le bouton Valider");
      // Envoi des infos vers page confirmation
    });
  } catch (e) {
    console.log("waitClickOrder  " + e);
  }
}

//------------------------------------------------------------------------------
// function: initMsgForm
// Objet: initialise les messages d'erreur sous chaque champ du formulaire
//

function initMsgForm(label) {
  try {
    let labelErrorMsg = label + C_formErrorMsg;
    let eltLabel = document.getElementById(labelErrorMsg);
    eltLabel.innerHTML = C_msgForm_vide;
  } catch (e) {
    console.log("initMsgForm  " + e);
  }
}

//------------------------------------------------------------------------------
// function: displayForm();
//
// Objet: Affiche les messages de requis en dessous les champs du formulaire
//
// Parametres: aucun
//
// Algo:
//  Affiche un message sous chaque ligne du formulaire avec les consignes
//  Invalide le bouton "Valider"
//------------------------------------------------------------------------------
function displayForm() {
  try {
    console.log("ft displayForm ");
    //email
    //    id = "email";     type email
    initMsgForm(C_formemail);

    //Passwd:
    initMsgForm(C_formpasswd);

    //Pseudo
    initMsgForm(C_formpseudo);

    //invalide le bouton "Valider"
    const eltButton = document.getElementById(C_formorder);
    //eltButton.disabled = true;
  } catch (e) {
    console.log("displayForm  " + e);
  }
}

//----------------------------------------------------------------
// ft signup
// nom: signup
// Objet: Point d'entrée de la ft
//
//  retour: rien
//
// algo:
//
//-------------------------------------------------------------
async function signupFt() {
  try {
    //on récupère les infos du produit passé dans l'URL
    console.log("ft signup");
    //Affichage msg pour remplir le formulaire
    displayForm();

    //Validation des entrées dans le formulaire
    waitFillForm();
  } catch (e) {
    console.log("Erreur signupFt: " + e);
  }
}

// Appel de la ft point d'entrée

signupFt();
