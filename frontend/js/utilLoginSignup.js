//P7groupomania

//-------------------------------------------------
// Fonctions et variables utiles pour java script
//
//fonctions supplémentaires spéciales login et signup
//---------------------------------------------------
// 11/05/2022
//---------------------------------------------------

//------------------------------------------------------------------------------
// function: initMsgForm
// Objet: initialise les messages d'erreur sous chaque champ du formulaire
//
//-------------------------------------------------------------------------------

function initMsgForm(label) {
  try {
    let labelErrorMsg = label + C_formErrorMsg;
    let eltLabel = document.getElementById(labelErrorMsg);
    eltLabel.innerHTML = C_msgForm_vide;
  } catch (e) {
    console.log("initMsgForm  " + e);
  }
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
