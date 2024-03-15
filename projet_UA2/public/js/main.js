let ouvrirPanier = document.getElementById('counter');
let Retour_Menu = document.querySelector('.Retour_Menu');

let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantiteelement = document.querySelector('.quantite');
let listePlat = document.getElementById('liste_plat');


let boutonId = 1;
function initialiserPage(nom, chemin_image, prix) {


    let newDiv = document.createElement('div');
    newDiv.classList.add('item');
    const imgElement = document.createElement('img');
    imgElement.src = chemin_image;
    const nomDiv = document.createElement('div');
    nomDiv.className = 'nom';
    nomDiv.textContent = nom;
    const prixDiv = document.createElement('div');
    prixDiv.className = 'prix';
    prixDiv.textContent = prix;
    const boutonAjouter = document.createElement('button');
    boutonAjouter.textContent = 'Ajouter Panier';
    //modifier l'identifaint de l'id a 1
    boutonAjouter.dataset.id = boutonId;

    boutonAjouter.addEventListener('click', AjouterProduitPanier);
    boutonId++;
    newDiv.appendChild(imgElement);
    newDiv.appendChild(nomDiv);
    newDiv.appendChild(prixDiv);
    newDiv.appendChild(boutonAjouter);
    listePlat.appendChild(newDiv);
}
async function AjouterProduitPage() {
    let response = await fetch('/api/menu');


    if (response.ok) {
        let menu = await response.json();

        for (let i = 0; i < menu.length; i++) {
            initialiserPage(
                menu[i].nom,
                menu[i].chemin_image,
                menu[i].prix
            );
        }
    }
}

AjouterProduitPage();


async function AjouterProduitPanier(event) {
    try {
        event.preventDefault();

        let data = {
            id_commande: 1,//commande s'incrementera lorsqu'on clique dans soumettre la commande
            id_produit: parseInt(event.currentTarget.dataset.id)

        };

        let response = await fetch('/api/commande', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            quantite();
            MettreEtatcommande(data.id_commande);
        }

    } catch (error) {
        console.error("Erreur inattendue :", error);
    }
}

async function quantite() {
    let sommequantitereponse = await fetch('/api/sommequantite');
    if (sommequantitereponse.ok) {
        let sommequantitedata = await sommequantitereponse.json();
        let quantitesom;
        for (let i = 0; i < sommequantitedata.length; i++) {
            quantitesom = sommequantitedata[i].somme_quantites

        }
        if (quantitesom > 0)
            quantiteelement.textContent = quantitesom;
        else
            quantiteelement.textContent = "0";
    }
}
quantite();
ouvrirPanier.addEventListener('click', function () {
    window.location.href = '/panier.html';
});
async function MettreEtatcommande(id_commande) {
    var currentDate = new Date();
    var dateString = currentDate.toISOString().slice(0, 10);
    let data = {
        id_commande: id_commande,
        id_etat_commande: 1,
        date: dateString
    };

    let response = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (response.ok) {

    }
}
