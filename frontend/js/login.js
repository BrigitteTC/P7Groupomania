/*--------------------------
 cart.js
date: 26/02/2022
auteur: BTC

Script pour mettre à jour la page panier

Les donnees spécifiques des produits:
  - id
  - nombre
  - couleur
   sont stockees dans le local storage.

Les autres infos sont à chercher sur le server
*******************************************************************/
//----------------------------------------------------------------
//Definition local storage
//
//  "totaItems", nombre total d'items
// tous les articles de même modele et même couleur
//  "cle", elt
//avec:
// clé:id du canapé_couleur
//      exemple:034707184e8e4eefb46400b5a3774b5f_Pink
//  id
//  nombre
//  couleur
//----------------------------------------------------------------

//----------------------------------------------------------------
// function: addItemInLocalStorage();
//Objet:
//Parametres:
//  Entrée: newItemPanier: produit à ajouter
//  Sortie
// Algo
//  construit la clé = id+couleur
//  lit le local storage pour cette cle
//    si la cle existe, on va recuperer une valeur pour le couple canape couleur
//    Mise à jour de la quantité avec la nouvelle qte achetee si on ne dépasse pas 100 articles
//
//---------------------------------------------------------------
function addItemInLocalStorage(newItemPanier) {
  //init nb total d'elt à 0
  var totalElt = 0;

  var currentPanier; //panier du local storage pour le produit passé en param
  try {
    //cle correspondant au nouveau produit
    //id+couleur
    let cleElt =
      String(newItemPanier.id) + C_separatorKey + newItemPanier.couleur;
    console.log("cle= " + cleElt);

    //teste clé existe déja ds le local storage
    if (cleElt in localStorage) {
      //Récupere le produit dans le local storage pour la cle donnée
      let currentPanierJson = localStorage.getItem(cleElt);
      currentPanier = JSON.parse(currentPanierJson);

      //complete avec le nouveau produit
      newItemPanier.nb = Number(newItemPanier.nb) + Number(currentPanier.nb);

      //Si la quantité dépasse 100, on force à 100
      if (newItemPanier.nb > 100) {
        newItemPanier.nb = 100;
      }
    }
    //Verif quantité à ajouter
    if (verifNewQty(Number(newItemPanier.nb))) {
      //Ajoute le nouveau produit
      // mets le  nouveau produit en string et le range dans le local storage
      let newItemPanierString = JSON.stringify(newItemPanier);
      localStorage.setItem(cleElt, newItemPanierString);
    }
  } catch (e) {
    console.log("addItemInLocalStorage:" + e);
  }
}

//-------------------------------------------------------------------------
//callConfirmation(orderId);
//
// Objet: appelle la page confirmation avec le numéro de commande
//
// Parametres:
//  Entréé: numéro de commande
//  Sortie: rien
//
// Algo
//  maj le HTML pour ajouter un lien sur la page confirmation avec le numéro de commande
//-----------------------------------------------------------------
function callConfirmation(orderId) {
  try {
    //url de destination
    let url = "../html/confirmation.html";

    //On va sur la page confirmation
    window.location.href =
      url + C_separatorURLFirst + "orderId" + C_egal + orderId;
  } catch (e) {
    console.log("callConfirmation:" + e);
  }
}

//-------------------------------------------
// ft displayItemInHtml(itemPanier);
// Objet: construit la structure html pour l'affichage du produit
//  mets à jour les balises avec le param
//parametres:
//  Entrée: itemPanier: article à ajouter dans le html
//  Sortie: rien
//
// Algo:
//  Cree tous les elts du html
//  Ajoute les enfants en ft de la structure demandée
//  Mets à jour le contenu HTML
//---------------------------------------------
function displayItemInHtml(itemPanier) {
  try {
    //structure html
    //on recupere le id items qui contiendra les articles des canapés
    let eltSection = document.getElementById(C_cart__itemsClass);
    //creation de l'elt article
    let newArticle = document.createElement("article");

    //Creation des div et leurs enfants
    let newDiv1 = document.createElement("div");
    let newDiv1Img = document.createElement("img");

    let newDiv2 = document.createElement("div");
    let newDiv21 = document.createElement("div");

    let newDiv21h2 = document.createElement("h2");
    let newDiv21p1 = document.createElement("p");
    let newDiv21p2 = document.createElement("p");

    let newDiv3 = document.createElement("div");
    let newDiv31 = document.createElement("div");
    let newDiv31p = document.createElement("p");
    let newDiv31Input = document.createElement("input");

    let newDiv32 = document.createElement("div");
    let newDiv32p = document.createElement("p");

    //article =enfant de section
    eltSection.appendChild(newArticle);

    //Div1 avec l'image
    newArticle.appendChild(newDiv1);
    newDiv1.appendChild(newDiv1Img);

    //nouvelle div div2 avec nom couleur et prix
    newArticle.appendChild(newDiv2);
    newDiv2.appendChild(newDiv21);
    newDiv21.appendChild(newDiv21h2);
    newDiv21.appendChild(newDiv21p1);
    newDiv21.appendChild(newDiv21p2);

    //nouvelle div div3
    newArticle.appendChild(newDiv3);

    //div31 enfant de div3 avec quantité et input
    newDiv3.appendChild(newDiv31);
    newDiv31.appendChild(newDiv31p);
    newDiv31.appendChild(newDiv31Input);

    //div32 enfant de div3 avec bouton supprimer
    newDiv3.appendChild(newDiv32);
    newDiv32.appendChild(newDiv32p);

    //Maj classes des balises
    newArticle.classList.add(C_cart__itemClass);
    newDiv1.classList.add("cart__item__img");
    newDiv2.classList.add("cart__item__content");
    newDiv21.classList.add("cart__item__content__description");
    newDiv3.classList.add("cart__item__content__settings");
    newDiv31.classList.add("cart__item__content__settings__quantity");
    newDiv31Input.classList.add(C_itemQuantityClass);
    newDiv32.classList.add("cart__item__content__settings__delete");
    newDiv32p.classList.add(C_deleteItemClass);

    //maj contenu elts:
    newArticle.setAttribute("data-id", itemPanier.nom);
    newArticle.setAttribute("data-color", itemPanier.couleur);

    newArticle.setAttribute(
      "id",
      itemPanier.id + C_separatorKey + itemPanier.couleur
    ); //ajout d'un id avec la cle du local storage

    newDiv1Img.src = itemPanier.imageUrl;
    newDiv1Img.altTxt = itemPanier.altTxt;

    newDiv21h2.innerHTML = itemPanier.nom;
    newDiv21p1.innerHTML = itemPanier.couleur;
    newDiv21p2.innerHTML = itemPanier.prix + "€";

    newDiv31p.innerHTML = "Qté";
    newDiv31Input.type = "number";
    newDiv31Input.name = itemPanier.nb; //A confirmer il faut mettre le nombre ??????//
    newDiv31Input.min = "1";
    newDiv31Input.max = "100";
    newDiv31Input.value = itemPanier.nb;

    newDiv32p.innerHTML = "Supprimer";
  } catch (e) {
    console.log("displayItemInHtml" + e);
  }
}

//----------------------------------------------------------------
//displayPrixTotal(prixTotal);
//Objet: affiche le prix total et quantité totale sur l'ecran
//
// Parametres:
//  Entree:
//    Nouvelle valeur qty produit
//    Ancienne valeur qty produit
//    Prix produit
//  Sortie: rien
//
// Algo:
//  REcherche prix total et qty totale avec balises HTML
//  calcule nouvelle valeurs
//
//  maj HTML avec prix et qty calculée
//
//------------------------------------------------------------
function displayPrixTotal(qtyTotal, prixTotal) {
  try {
    // id quantité:
    let qtyTotalElt = document.getElementById("totalQuantity");

    //id prix
    let prixTotalElt = document.getElementById("totalPrice");

    //maj elt dan sHTML
    qtyTotalElt.innerHTML = Number(qtyTotal);
    prixTotalElt.innerHTML = Number(prixTotal);

    //Maj elt dans local storage
    localStorage.setItem(C_totalElt, JSON.stringify(Number(qtyTotal)));
  } catch (e) {
    console.log("displayPrixTotal" + e);
  }
}

//----------------------------------------------------------------
//changePrixTotal(prixTotal);
//Objet: affiche le prix total et quantité totale sur l'ecran
//
// Parametres:
//  Entree:
//    Nouvelle valeur qty produit
//    Ancienne valeur qty produit
//    Prix produit
//  Sortie: rien
//
// Algo:
//  REcherche prix total et qty totale avec balises HTML
//  calcule nouvelle valeurs
//
//  maj HTML avec prix et qty calculée
//
//------------------------------------------------------------
function changePrixTotal(newQty, oldQty, prix) {
  try {
    // quantité:
    let qtyTotalElt = document.getElementById("totalQuantity");
    let qtyTotal = Number(qtyTotalElt.value);

    //prix
    let prixTotalElt = document.getElementById("totalPrice");
    let prixTotal = Number(prixTotalElt.value);

    //Affiche prix total
    prixTotal =
      Number(prixTotal) + Number(prix) * (Number(newQty) - Number(oldQty));

    qtyTotal = qtyTotal + newQty - oldQty;

    //creation de l'elt article
    qtyTotalElt.innerHTML = qtyTotal;
    prixTotalElt.innerHTML = prixTotal;
  } catch (e) {
    console.log("changePrixTotal" + e);
  }
}

//-----------------------------------------------------------
//Fonction: waitClickOnSupprimer();
// Objet: Attend le click sur le bouton "supprimer" d'un elt
//
// Parametres:
//  entrée: rien
//  sortie: rien
//
//  Algo
//    REcherche ts les elts avec la classe "supprimer"
//    Ecoute sur tous les elts de cette class
//    Si click sur un elt
//       REcherche l'id de l'Article parent
//        Supprime cet elt dans le local stortage
//        Supprime l'article de la page html
//        Affiche la nouvelle page html
//----------------------------------------------------------------
async function waitClickOnSupprimer() {
  try {
    //recherche de ts les elts qui ont la classe deleteItem
    //à l'intérieur d'un elt ayant l'ID "cart__items"
    let eltSection = document.getElementById(C_cart__itemsClass);
    let eltsSupprimer = eltSection.getElementsByClassName(C_deleteItemClass); //tableau avec tous les elts de la class

    for (let i = 0; i < eltsSupprimer.length; i++) {
      //Element html "supprimer" correspondant à la clé

      eltsSupprimer[i].addEventListener("click", async function () {
        //on a cliqué sur l'elt supprimer
        // on remonte la filiere poru avoir l'article correspondant
        //Article est 3 niveaux au dessous du bouton supprimer
        let eltArticle = eltsSupprimer[i].parentNode.parentNode.parentNode;
        console.log("waitClickOnSupprimer: clic bouton supprimer =");

        //HTML: supprime le noeud avec l'article supprimé
        eltSection.removeChild(eltArticle);

        //recupere les infos du local storage avant de supprimer l'elt

        let cle = eltArticle.id; //cle du local storage

        //supprime la cle dans le local storage
        localStorage.removeItem(cle);

        //Calcule et affiche nouveau prix total et nb elt
        await searchProductsInServer();
      });
    }
  } catch (e) {
    console.log("waitClickOnSupprimer  " + e);
  }
}

//-------------------------------------------------------------------------
// changeQtyProduct()
//
//Objet: Change la quantité du produit en ft de la selection de l' utilisateur
//
// Params
//  entrée: eltSelect: element cliqué par l'utilisateur
//              = le input avec le nombre de canapés pour un produit donné
//  sortie: rien
//
// Algo:
//  Récupère le parent article de l'élement cliqué
//  La clé de l'elt dan sle local stot=rage = l'id de l'article
//  A partir de la clé de cet elt, récupère les infos dan sle local storage
//  Vérifie le nouveau nombre rentré et si correct:
//    Mets à jour le produit dan sle local storage
//    mets à jour le nb total d'elt
//--------------------------------------------------------------------------------

async function changeQtyProduct(eltSelect) {
  try {
    //on a cliqué sur l'elt input de l'article
    // on remonte la filiere pour avoir l'article correspondant
    //Article est 3 niveaux au dessus du bouton input

    //SI le nombre rentré dépasse 100, on le force à 100
    if (eltSelect.value > 100) {
      eltSelect.value = 100;
      alerteMsg(C_msgAlert_Max100);
    }

    if (eltSelect.value < 1) {
      eltSelect.value = 1;
      alerteMsg(C_msgAlert_Min1 + C_msgAlert_Suppr);
    }

    if (Number.isInteger(Number(eltSelect.value)) === false) {
      alerteMsg(C_msgAlert_Entier);
      eltSelect.value = 1;
    }

    //
    let eltArticle = eltSelect.parentNode.parentNode.parentNode;
    console.log("waitChangeOnNbElt: change nb elt" + eltArticle.id);

    //recupere les infos du local storage de l elt
    let cle = eltArticle.id; //id de l'article = cle du local storage

    let ProductSelected = JSON.parse(localStorage.getItem(cle)); //elt selectionné
    let oldEltNb = Number(ProductSelected.nb); //nb d'elt actuel dans le local storage

    //nouveau nombre pour l'article selectionné
    let newEltNb = eltSelect.value;

    //Teste le nouveau nombre rentré par l'utilisateur
    if (verifNewQty(Number(newEltNb))) {
      //maj  nb elt total dans local storage
      //localStorage.setItem(C_totalElt, JSON.stringify(qtyTotal));

      //maj produit dans local storage
      ProductSelected.nb = Number(newEltNb);
      localStorage.setItem(cle, JSON.stringify(ProductSelected));

      //Recherche infos dans le serveur pour calcul qty et prix total
      await searchProductsInServer();
    }
  } catch (e) {
    console.log("changeQtyProduct  " + e);
  }
}

//--------------------------------------------------------------------------------
// searchInfoOneProductInServer
// nom: searchInfoOneProductInServer
// Objet: Cherche les infos d'un produit sur le serveur
//
// Paramètres:
//  Entrée: itemdu local storage
//  Sortie: Produit class paramPanier avec infos du serveur
//
// Algo:
//    Fetch sur route du produit pour récupérer les infos
//--------------------------------------------------------------------------------
async function searchInfoOneProductInServer(itemLocalStorage) {
  let newItemPanier = new paramPanier(0, "", 0, "", 0, "", "", ""); //produit à mettre à jour
  try {
    newItemPanier.id = itemLocalStorage.id;
    serverPd = C_serverGET + "/" + itemLocalStorage.id; //Route server du produit
    // Recherche data du produit sur le serveur
    let response = await fetch(serverPd);
    if (response.ok) {
      //le produit à afficher
      let product = await response.json();
      //On complète avec les infos du server

      newItemPanier.prix = product.price; //prix
      newItemPanier.nom = product.name; //nom
      newItemPanier.imageUrl = product.imageUrl;
      newItemPanier.altTxt = product.altTxt;
      newItemPanier.description = product.description;
    } //fin if (response.ok)
    else {
      console.error("Retour du serveur:", response.status);
    }

    // on complete avec les infos du local storage
    newItemPanier.nb = itemLocalStorage.nb;
    newItemPanier.couleur = itemLocalStorage.couleur;

    console.log("prix produit= " + newItemPanier.prix);
    console.log("nom du canape= " + newItemPanier.nom);
  } catch (e) {
    console.log("searchInfoOneProductInServer  " + e);
  }

  return newItemPanier;
}

//------------------------------------------------------------------
// fonction: displayLocalStorageInHtml
//
// Objet: recherche les infos du produit dans le serveur et les affiche dans le HTML
//
// Parametres:
//  Entrée:
//    rien
//
//  Sortie: rien
//
// Algo:
//  Boucle sur tous les elts du local serveur et pour chaque elt
//
//    Utilise fetch pour joinde le serveur et attend la promesse
//    Mets à jour les infos du produit
//    Affiche le produit dans le html
//    Affiche prix total et quantité totale.
//-------------------------------------------------------------------

async function displayLocalStorageInHtml() {
  let qtyTotal = 0;
  let prixTotal = 0;

  try {
    // Boucle sur tous les produits du local storage
    // localstorage.forEach ( element => elemnt)
    for (let i = 0; i < localStorage.length; i++) {
      console.log("cle " + i + " " + localStorage.key(i));

      if (localStorage.key(i) != C_totalElt) {
        //recupere le produit dans le local storage
        let itemLocalStorageJSON = localStorage.getItem(localStorage.key(i));
        let itemLocalStorage = JSON.parse(itemLocalStorageJSON);

        //cherche les infos de l'article sur le server
        let newItemPanier = new paramPanier();

        //Recherche infos sur le serveur
        newItemPanier = await searchInfoOneProductInServer(itemLocalStorage);

        //Affiche l'item dans le HTML
        displayItemInHtml(newItemPanier);

        //calcule prix total
        prixTotal =
          Number(prixTotal) +
          Number(Number(newItemPanier.prix) * Number(newItemPanier.nb));

        //calcule quantité totale:
        qtyTotal = Number(qtyTotal) + Number(newItemPanier.nb);
      } //fin if (localStorage.key(i) != C_totalElt)
    } // fin boucle for

    //Affiche  qty et prix total dans l'ecran
    displayPrixTotal(qtyTotal, prixTotal);

    //Attente click sur les boutons <supprimer> des elts du panier
    waitClickOnSupprimer();

    //Attente changement nombre d'elts
    waitChangeOnNbElt();
  } catch (e) {
    console.log("displayLocalStorageInHtml  " + e);
  }
}

//------------------------------------------------------------------
// fonction: searchProductsInServer
//
// Objet: recherche les infos des produits dans le serveur
//
// Parametres:
//  Entrée:
//    rien
//
//  Sortie: rien
//
// Algo:
//  Boucle sur tous les elts du local storage et pour chaque elt
//
//    REcherche les infos du produit sur le serveur
//    Mets à jour les infos du produit
//    Maj et Affiche prix total et quantité totale.
//-------------------------------------------------------------------

async function searchProductsInServer() {
  let qtyTotal = 0;
  let prixTotal = 0;

  try {
    // Boucle sur tous les produits du local storage
    // localstorage.forEach ( element => elemnt)
    for (let i = 0; i < localStorage.length; i++) {
      let cle = localStorage.key(i);
      console.log("cle " + i + " " + localStorage.key(i));
      let newItemPanier = new paramPanier(0, "", 0, "", 0, "", "", "");
      if (cle != C_totalElt) {
        //recupere le produit dans le local storage
        let itemLocalStorageJSON = localStorage.getItem(cle);
        let itemLocalStorage = JSON.parse(itemLocalStorageJSON);

        //cherche les infos de l'article sur le server
        newItemPanier = await searchInfoOneProductInServer(itemLocalStorage);
      } //fin if (localStorage.key(i) != C_totalElt)
      //calcule prix total
      prixTotal =
        Number(prixTotal) +
        Number(Number(newItemPanier.prix) * Number(newItemPanier.nb));

      //calcule quantité totale:
      qtyTotal = Number(qtyTotal) + Number(newItemPanier.nb);
    } // fin boucle for
    //Affiche le prix et qty total dans l'ecran
    displayPrixTotal(qtyTotal, prixTotal);
  } catch (e) {
    console.log("searchProductsInServer  " + e);
  }
}

//------------------------------------------------------------------
// fonction: waitClickOnNbElt()
//
//
// Objet: Attend le click sur le nb d'elt d'un elt du panier
//
// Parametres:
//  entrée: rien
//  sortie: rien
//
//  Algo
//    REcherche ts les elts avec la classe "supprimer"
//    Ecoute sur tous les elts de cette class
//    Si click sur un elt
//       REcherche l'id de l'Article parent
//        Supprime cet elt dans le local stortage
//        Supprime l'article de la page html
//        Affiche la nouvelle page html
//----------------------------------------------------------------
function waitClickOnNbElt() {
  try {
    //recherche de ts les elts qui ont la classe deleteItem
    //à l'intérieur d'un elt ayant l'ID "cart__items"
    let eltSection = document.getElementById(C_cart__itemsClass);
    let eltsClass = eltSection.getElementsByClassName(C_itemQuantityClass); //tableau avec tous les elts de la class

    for (let i = 0; i < eltsClass.length; i++) {
      //Element html  correspondant à la clé

      //    eltsClass[i].addEventListener(onclick, () =>
      eltsClass[i].addEventListener(onclick, function () {
        //on a cliqué sur l'elt input de l'article
        // on remonte la filiere pour avoir l'article correspondant
        //Article est 3 niveaux au dessus du bouton input
        let eltArticle = eltsClass[i].parentNode.parentNode.parentNode;
        console.log("waitClickOnNbElt: clic nb elt" + eltArticle.id);

        //recupere les infos du local storage de l elt

        let cle = eltArticle.id; //cle du local storage

        let ProductSelected = JSON.parse(localStorage.getItem(cle)); //elt selectionné
        let oldEltNb = Number(ProductSelected.nb); //nb d'elt actuel dans le local storage
        let eltPrix = Number(ProductSelected.prix); //prix du produit selectionné
        //nouveau nombre
        let newEltNb = eltsClass[i].value;

        //Teste le nouveau nombre rentré par l'utilisateur
        if (verifNewQty(Number(newEltNb))) {
          let qtyTotal = JSON.parse(localStorage.getItem(C_totalElt)); //qty total ds localstorage

          //maj prix et nb total
          prixTotal =
            Number(prixTotal) +
            Number(eltPrix) * (Number(newEltNb) - Number(oldEltNb));

          qtyTotal = Number(qtyTotal) - Number(oldEltNb) + Number(newEltNb);

          //maj prix et nb elt total dans local storage
          localStorage.setItem(C_totalElt, JSON.stringify(qtyTotal));

          //maj produit dans local storage
          ProductSelected.nb = Number(newEltNb);
          localStorage.setItem(cle, JSON.stringify(ProductSelected));
          //Affiche nouveau prix dans l'ecran
          displayPrixTotal(qtyTotal, prixTotal);
        }
      });
    }
  } catch (e) {
    console.log("waitClickOnNbElt  " + e);
  }
}

//-----------------------------------------------------------------
// Fonction: waitChangeOnNbElt();
//
//
// Objet: Attend le changement du nb d'elt d'un elt du panier
//
// Parametres:
//  entrée: rien
//  sortie: rien
//
//  Algo
//    Recherche ts les elts avec la classe "supprimer"
//    Ecoute sur tous les elts de cette class
//    Si click sur un elt
//       REcherche l'id de l'Article parent
//        Supprime cet elt dans le local storage
//        Supprime l'article de la page html
//        Affiche la nouvelle page html
//
//
//----------------------------------------------------------------
async function waitChangeOnNbElt() {
  try {
    //recherche de ts les elts qui ont la classe deleteItem
    //à l'intérieur d'un elt ayant l'ID "cart__items"
    let eltSection = document.getElementById(C_cart__itemsClass);
    let eltsClass = eltSection.getElementsByClassName(C_itemQuantityClass); //tableau avec tous les elts de la class

    for (let i = 0; i < eltsClass.length; i++) {
      //Element html  correspondant à la clé

      // Ecoute evt: Utilisation de input par rapport à change car le input réagit tout de suite
      // le change ne réagit qu'après un retour chariot.

      eltsClass[i].addEventListener("input", async function () {
        changeQtyProduct(eltsClass[i]);
      });
    }
  } catch (e) {
    console.log("waitChangeOnNbElt  " + e);
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
//    id = "firstName"  type text
//    id = "lastName";  type text
//    id = "address";   type text
//    id = "city";      type text
//    id = "email";     type email
//
// format: /^[A-Za-zé'ïöëè -]+$/;
// un ou plusieurs caractères en majuscules
// ou minuscules, un tiret, une apostrophe ou une espace.
// et aussi les e i et o accentués
//-----------------------------------------------------------------------------
async function waitFillForm() {
  try {
    // class de blleans poru verif champs du formulaire
    let newUserCoordCheck = new userCoordCheck(
      false,
      false,
      false,
      false,
      false
    );

    //First name
    let firstNameForm = document.getElementById(C_formfirstName);
    let firstNameError = document.getElementById(
      C_formfirstName + C_formErrorMsg
    );

    //Listener sur les champs du formulaire
    firstNameForm.addEventListener("change", function () {
      // Vérif valeur entrée
      newUserCoordCheck.firstName = verifFieldForm(
        firstNameForm,
        firstNameError,
        expressionRegName
      );
    });

    //LastName
    //    id = "lastName";  type text
    let lastNameForm = document.getElementById(C_formlastName);
    let lastNameError = document.getElementById(
      C_formlastName + C_formErrorMsg
    );
    lastNameForm.addEventListener("change", function () {
      // Vérif valeur entrée
      newUserCoordCheck.lastName = verifFieldForm(
        lastNameForm,
        lastNameError,
        expressionRegName
      );
    });
    //Adresse:
    //    id = "addres";   type text
    // pour l'adresse on accepte tous les caractères mais on vérifie que le champ n'est pas nul
    let addressForm = document.getElementById(C_formaddress);
    let addressError = document.getElementById(C_formaddress + C_formErrorMsg);
    addressForm.addEventListener("change", function () {
      // Vérif valeur entrée
      newUserCoordCheck.address = verifFieldForm(
        addressForm,
        addressError,
        expressionRegAdress
      );
    });
    //City
    //    id = "city";      type text
    let cityNameForm = document.getElementById(C_formcity);
    let cityNameError = document.getElementById(C_formcity + C_formErrorMsg);
    cityNameForm.addEventListener("change", function () {
      // Vérif valeur entrée
      newUserCoordCheck.city = verifFieldForm(
        cityNameForm,
        cityNameError,
        expressionRegCity
      );
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

    //bouton commander
    let eltButton = document.getElementById(C_formorder);
    eltButton.addEventListener("click", function (event) {
      boutonCommanderFt(event, newUserCoordCheck);
    });
  } catch (e) {
    console.log("waitFillForm  " + e);
  }
}

//--------------------------------------------------------------------------------
// function: boutonCommanderFt(event, newUserCoordCheck);
// Objet: traite le click sur le bouton commander
//
// Parametres:
//  Entrée: event : evennement cliqué
//    newUserCoordCheck: class de booleens avec tous les champs du formulaire
//
// Algo:
//    Mets à jour les coordonnées et ft des données saisies dans le formulaire
//    mets à jour la liste des produits dan sle local storage
//    Mets en forme un objet à envoyer à l'API avec les coordonnées et le tableau des produits.
//    Envoi la commande à l'API
//
//  Format de l'objet à envoyer:
//      dataToPost={
//        contact: {
//          firstName: string,
//          lastName: string,
//          address: string,
//          city: string,
//          email: string
//      }
//          products: [string]
//      }
//---------------------------------------------------------------------------------------------

async function boutonCommanderFt(event, newUserCoordCheck) {
  try {
    console.log("on a cliqué sur le bouton commander");

    event.preventDefault(); //evite le rechargt de la page

    //test champs du formulaire corrects
    if (
      newUserCoordCheck.firstName === true &&
      newUserCoordCheck.lastName === true &&
      newUserCoordCheck.address === true &&
      newUserCoordCheck.city === true &&
      newUserCoordCheck.email === true
    ) {
      //Verif il y a des elts dans le local stotage

      //Tous les champs sont corrects, on peut envoyer la confirmation
      var newUserCoord = new userCoord();
      newUserCoord = updateUserforOrder(); //Maj objet avec les coordonnées de l'utilisateur
      let products = updateProductforOrder(); //maj du tableau avec les produits
      if (products.length > 0) {
        // le panier n'est pas vide on envoie la commande
        let firstName = newUserCoord.firstName;

        let lastName = newUserCoord.lastName;
        let address = newUserCoord.address;
        let city = newUserCoord.city;
        let email = newUserCoord.email;

        //Objet à envoyer

        dataToPost = {
          contact: {
            firstName,
            lastName,
            address,
            city,
            email,
          },
          products,
        };
        console.log("dataToPost = " + dataToPost.contact);

        //Envoi la commande à l'API
        //let response = await sendOrder(C_serverPOST, dataToPost).then(
        await sendOrder(C_serverPOST, dataToPost).then((dataToPost) => {
          console.log("numero de commande= " + dataToPost.orderId); // JSON data parsed by `data.json()` call
          //   console.log(response);
          //Envoi id commande dans l'URL et Appelle la page confirmation
          callConfirmation(dataToPost.orderId);
        });
      }
    } else {
      //Au moins un des champs du formulaire n'est pas conrrect
      alerteMsg(
        "Remplissez correctement tous les champs du formulaire avant de cliquer sur Commander"
      );
    }
  } catch (e) {
    console.log("boutonCommanderFt  " + e);
  }
}

//--------------------------------------------------------------------------------
//sendOrder
//
//Format du message
//{
//  contact: {
//    firstName: string,
//    lastName: string,
//    address: string,
//    city: string,
//    email: string
// }
//  products: [string]
//}
//L'objet est en deux parties :
//
//1) contact, qui contient tous les champs du formulaire
// (prénom, nom, adresse, ville et email) préalablement vérifiés.
//L'ordre n'a pas d'importance.
//
//2) products, qui est un tableau regroupant les identifiants des canapés dans la panier.
//Il n' y a pas de notions de couleurs ou de quantités à mettre dedans, comme je t'en ai parlé hier.
//

//-------------------------------------------------------------------------------

async function sendOrder(url = "", data = {}) {
  let response; //réponse du fetch
  let orderIdJson = ""; //réponse du serveur
  try {
    console.log("envoi de la commande");

    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      orderIdJson = response.json();
    } else {
      console.error("REtour du serveur:", response.status);
    }
  } catch (e) {
    console.log("sendOrder  " + e);
  }

  console.log("sendOrder response.json=" + orderIdJson);
  return orderIdJson;
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
  newUserCoord = new userCoord("", "", "", "", "");

  try {
    //First name

    newUserCoord.firstName = document.getElementById(C_formfirstName).value;

    //LastName
    //    id = "lastName";  type text
    newUserCoord.lastName = document.getElementById(C_formlastName).value;

    //Adresse:
    //    id = "addres";   type text

    newUserCoord.address = document.getElementById(C_formaddress).value;

    //City
    //    id = "city";      type text
    newUserCoord.city = document.getElementById(C_formcity).value;

    //email
    //    id = "email";     type email
    newUserCoord.email = document.getElementById(C_formemail).value;
  } catch (e) {
    console.log("updateUserforOrder  " + e);
  }

  return newUserCoord;
}

//-------------------------------------------------------------------------------
//function: updateProductforOrder;
//Objet: Mise à jour de la liste des id des produits commandés à partir du local storage
//
// Parametres:
//  Entrée: aucun
//  Sortie: tableau avec liste des id
//
// Algo:
//  Boucle sur le local storage poru récupérer tous les ids
//---------------------------------------------------------------------------------------------
function updateProductforOrder() {
  //Def tableau de produits
  let productList = [];

  try {
    //boucle sur le local storage

    for (let i = 0; i < localStorage.length; i++) {
      console.log("cle " + i + " " + localStorage.key(i));

      if (localStorage.key(i) != C_totalElt) {
        //recupere le produit dans le local storage
        let itemLocalStorageJSON = localStorage.getItem(localStorage.key(i));
        let itemLocalStorage = JSON.parse(itemLocalStorageJSON);

        // on l'ajoute à la fin du tableau
        productList.push(itemLocalStorage.id);
      } //fin if (localStorage.key(i) != C_totalElt)
    } // fin boucle for
  } catch (e) {
    console.log("updateProductforOrder  " + e);
  }

  return productList;
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
  try {
    if (entree !== "") {
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
//Objet: Attente click sur bouton commander et traitement correspondant
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
      console.log("on a cliqué sur le bouton commander");
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
//  Invalide le bouton "commander"
//------------------------------------------------------------------------------
function displayForm() {
  try {
    //First name
    initMsgForm(C_formfirstName);

    //LastName
    //    id = "lastName";  type text
    initMsgForm(C_formlastName);

    //Adresse:
    //    id = "addres";   type text

    initMsgForm(C_formaddress);

    //City
    //    id = "city";      type text
    initMsgForm(C_formcity);

    //email
    //    id = "email";     type email
    initMsgForm(C_formemail);

    //invalide le bouton "commander"
    const eltButton = document.getElementById(C_formorder);
    //eltButton.disabled = true;
  } catch (e) {
    console.log("displayForm  " + e);
  }
}

//----------------------------------------------------------------
// ft affichePanier
// nom: affichePanier
// Objet: Récupère les infos du produit passées dans l'URL
//    les affiche dans le panier
//    ecoute les evennements sur les boutons "supprimer" et nb d'elts de chaque item du  panier
//    et appelle la page confirmation si click sur le bouton commander.
// Paramètres:
//  entrée: les params sont passés par l'URL
//
//  retour: rien
//
// algo:
// Récupère l'id , le nb et la couleur passés dans l'URL
// récupère le prix dans le serveur pour cet ID
//  Maj du local storage
//  Si click sur le bouton: envoie le panier à la page confirmation.
//
// await: attend le retour de la promese
//
// REmarque:
//    On peut arriver dans la page panier
//  - à partir de la page d'accueil:
//      -> Dans ce car il n'y aura pas de nouveau produit dan sl'URL
//  - A partir de la page produit
//    -> Dans ce cas, on aura un produit passé dans l'URL
//-------------------------------------------------------------
async function affichePanier() {
  try {
    //on récupère les infos du produit passé dans l'URL

    let newItemPanier = getInfoInURL();

    console.log("id produit= " + newItemPanier.id);

    //Verif params de l'URL valides
    if (
      newItemPanier.id != 0 &&
      newItemPanier.nb != 0 &&
      newItemPanier.couleur !== ""
    ) {
      // DEBUG: affichage pd dans la console

      console.log("nb produits=" + newItemPanier.nb);
      console.log("couleur produit = " + newItemPanier.couleur);

      // stockage nouveau produit dans le local storage
      addItemInLocalStorage(newItemPanier);
    }

    //Affichage du panier dans le HTML
    await displayLocalStorageInHtml();

    //Affichage msg pour remplir le formulaire
    displayForm();

    //Validation des entrées dans le formulaire
    waitFillForm();

    // Traitement du click sur le bouton commander
    //waitClickOrder();
  } catch (e) {
    console.log("affichePanier: " + e);
  }
}

// Appel de la ft pour afficher le panier et récupérer le produit avec le nb et sa couleur

affichePanier();
