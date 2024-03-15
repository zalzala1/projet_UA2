let listePanier = document.getElementById("ListeItems");
let Effacer = document.getElementById("Effacer");
let total = document.getElementById("total");
let soumission = document.getElementById("Soumettre");
let mon_id_commande; // pour recuperer id commande localement
function initialiserPanier(
  id_produit,
  nom,
  chemin_image,
  prix,
  quantite,
  devise,
  id_commande
) {
  total.dataset.id_commande = id_commande;
  Totalprix();
  mon_id_commande = id_commande;
  let newli = document.createElement("li");
  newli.classList.add("itempanier");
  newli.dataset.id_produit = id_produit;
  newli.dataset.id_commande = id_commande;
  Effacer.dataset.id_commande = id_commande;

  const imgElement = document.createElement("img");
  imgElement.src = chemin_image;
  const nomDiv = document.createElement("div");
  nomDiv.className = "nompanier";
  nomDiv.textContent = nom;
  const prixDiv = document.createElement("div");
  prixDiv.className = "prixpanier";
  prixDiv.textContent = prix + "CAD";
  const elementquan = document.createElement("div");
  elementquan.className = "elementquan";

  const increquant = document.createElement("button");
  increquant.textContent = "+";
  increquant.dataset.id_produit = id_produit;
  increquant.dataset.id_commande = id_commande;
  increquant.addEventListener("click", IncrementerQuantite);
  increquant.className = "increquant";

  const quantitepro = document.createElement("div");
  quantitepro.className = "quantitepanier";
  quantitepro.textContent = quantite;

  const decrequant = document.createElement("button");
  decrequant.dataset.id_commande = id_commande;
  decrequant.dataset.id_produit = id_produit;
  decrequant.addEventListener("click", DecrementerQuantite);
  decrequant.textContent = "-";
  decrequant.className = "decrequant";

  elementquan.appendChild(increquant);
  elementquan.appendChild(quantitepro);
  elementquan.appendChild(decrequant);

  const conteneur = document.createElement("div");
  conteneur.className = "conteneur";
  newli.appendChild(imgElement);
  conteneur.appendChild(nomDiv);
  conteneur.appendChild(prixDiv);
  conteneur.appendChild(elementquan);
  newli.appendChild(conteneur);
  listePanier.appendChild(newli);
}

async function AjouterProduitPanier() {
  let response = await fetch("/api/info_produit");

  if (response.ok) {
    let PANIER = await response.json();

    if (PANIER.length > 0) {
      console.log("Données récupérées avec succès :", PANIER);

      for (let i = 0; i < PANIER.length; i++) {
        initialiserPanier(
          PANIER[i].id_produit,
          PANIER[i].nom,
          PANIER[i].chemin_image,
          PANIER[i].prix,
          PANIER[i].quantite,
          PANIER[i].devise,
          PANIER[i].id_commande
        );
      }
    } else {
      console.log("Aucune donnée retournée par le serveur.");
    }
  } else {
    console.log(
      "Erreur lors de la récupération des données du serveur :",
      response.status
    );
  }
}
AjouterProduitPanier();
async function IncrementerQuantite(event) {
  event.preventDefault();
  let data = {
    id_commande: parseInt(event.currentTarget.dataset.id_commande),
    id_produit: parseInt(event.currentTarget.dataset.id_produit),
  };

  let response = await fetch("/api/augmenterquantite", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    console.log("cest fait");
    location.reload(); // Recharge la page après une modification
  }
}
async function DecrementerQuantite(event) {
  event.preventDefault();
  let data = {
    id_commande: parseInt(event.currentTarget.dataset.id_commande),
    id_produit: parseInt(event.currentTarget.dataset.id_produit),
  };
  let response = await fetch("/api/produitcommande", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    console.log("cest fait");
    location.reload(); // Recharge la page après une modification
  }
}
Effacer.addEventListener("click", EffacerFonction);
async function EffacerFonction(event) {
  event.preventDefault();
  let data = {
    id_commande: parseInt(event.currentTarget.dataset.id_commande),
  };
  let response = await fetch("/api/commande", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    location.reload(); // Recharge la page après une modification
    ModifierEtatcommande_Effacer();
  } else {
    console.error(
      "Erreur lors de la suppression de la commande :",
      response.status
    );
  }
}
//retourne le total des prix
async function Totalprix() {
  let id_commande = total.dataset.id_commande;
  let sommeprixreponse = await fetch(
    `/api/sommeprix?id_commande=${id_commande}`
  );
  if (sommeprixreponse.ok) {
    let sommeprixeData = await sommeprixreponse.json();
    let sommeprix;
    for (let i = 0; i < sommeprixeData.length; i++) {
      sommeprix = sommeprixeData[i].somme_prix_produits;
    }
    console.log(sommeprix);
    if (sommeprix > 0) total.textContent = sommeprix;
    else {
      console.log("sommeprix =0");
      const titre = document.createElement("h1");
      titre.textContent = "Aucun Element dans la Panier";
      const contenant = document.getElementById("paniervide");
      contenant.appendChild(titre);
      total.textContent = "0";
    }
  }
}
async function ModifierEtatcommande(event) {
  event.preventDefault();
  let data = {
    id_commande: 1,
    id_etat_commande: 2,
  };

  try {
    let response = await fetch("/api/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      let responseData = await response.json();
      console.log("Réponse JSON reçue :", responseData);
    } else {
      console.error("Réponse du serveur non OK :", response.status);
    }
  } catch (error) {}
}
async function supprimercommande(id_commande) {
  let data = {
    id_commande: id_commande,
  };
  let response = await fetch("/api/supprime_commande", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.ok) {
  }
}

soumission.addEventListener("click", ModifierEtatcommande);
//efface la COMMANDE
async function _EffacerEtatCommande() {
  let data = {
    id_commande: 1,
  };

  try {
    let response = await fetch("/api/commande", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      let responseData = await response.json();
      console.log("Réponse JSON reçue :", responseData);
    } else {
      console.error("Réponse du serveur non OK :", response.status);
    }
  } catch (error) {}
}
