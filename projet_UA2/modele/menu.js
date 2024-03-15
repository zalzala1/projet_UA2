import { connectionPromise } from '../connexion.js';
//La liste des produits
export async function getelemenMenu() {
    let connection = await connectionPromise;
    let Menu = await connection.all(
        `SELECT * FROM produit;`
    );
    return Menu;

}
//La somme des quantités
export async function getsommequantite() {
    let connection = await connectionPromise;
    let quantite = await connection.all(
        `SELECT SUM(quantite) AS somme_quantites
        FROM commande_produit;`
    );
    return quantite;

}
//ajouter un produit dans le menu
export async function addelementMenu(nom, chemin_image, prix) {
    let connection = await connectionPromise;
    let result = await connection.run(
        `INSERT INTO produit(nom,chemin_image,prix)
        VALUES(?,?,?);`,
        [nom, chemin_image, prix]
    );
    return result.lastID;

}
//obtenir la liste des commandes
export async function getelemenCommande() {
    let connection = await connectionPromise;
    let commande = await connection.all(
        `SELECT * FROM commande_produit;`
    );
    return commande;

}
// recherche d'un produit
export async function getelemenProduit(id_produit) {
    let connection = await connectionPromise;
    let commande = await connection.all(
        `SELECT * FROM produit WHERE id_produit = ? ;`,
        [id_produit]
    );
    return commande;

}
//Permettre à un utilisateur d’ajouter un élément du menu ou plusieurs fois le même élément de menu dans sa commande/panier
export async function addelementMenu_Commande(id_commande, id_produit) {
    let connection = await connectionPromise;
    // Vérifier si l'élément existe dans la table
    let existingElement = await connection.get(
        `SELECT * FROM commande_produit WHERE id_produit = ?`,
        [id_produit]
    );
    if (existingElement) {
        const quantiteActuelle = existingElement.quantite;
        // Mettre à jour la quantité si l'élément existe déjà
        await connection.run(
            `UPDATE commande_produit SET quantite = ? WHERE id_produit = ?`,
            [quantiteActuelle + 1, id_produit]
        );
    }
    else {
        // Insérer un nouvel élément si l'élément n'existe pas
        let result = await connection.run(
            `INSERT INTO commande_produit (id_commande,id_produit, quantite) VALUES (?,?, ?)`,
            [id_commande, id_produit, 1]
        );
        return result.lastID;
    }

}

//Permettre à un utilisateur de supprimer la commande/panier
export async function deleteelementCommande(id_commande) {
    let connection = await connectionPromise;
    let result = await connection.run(
        `DELETE  FROM commande_produit
        WHERE id_commande=?;`,
        [id_commande]
    );
}
//Permettre à un utilisateur de supprimer certaines parties de la commande/panier
export async function deleteproduitCommande(id_commande, id_produit) {
    let connection = await connectionPromise;
    //verifier la quantité du produit dans la table
    let response = await connection.get(
        `SELECT quantite
        FROM commande_produit
        WHERE id_commande = ? AND id_produit = ?;`,
        [id_commande, id_produit]
    );
    if (response) {
        const quantite = response.quantite;
        //si la quantité est superieure a 0 on met a jour
        if (quantite > 1) {
            let result = await connection.run(
                `UPDATE  commande_produit
                SET quantite = ? - 1
                WHERE id_commande=? AND id_produit=? ;`,
                [quantite, id_commande, id_produit]
            );
        }
        else {
            //sinon supprimer
            let result = await connection.run(
                `DELETE FROM commande_produit
                WHERE id_commande = ? AND id_produit = ? ;`,
                [id_commande, id_produit]
            );
        }
    }
}
//augmenter la quantite du produit dans le panier
export async function augmenterproduitCommande(id_commande, id_produit) {
    let connection = await connectionPromise;
    let result = await connection.run(
        `UPDATE  commande_produit
        SET quantite = quantite + 1
        WHERE id_commande=? AND id_produit=? ;`,
        [id_commande, id_produit]
    );
}
//MODIFIER ETAT DE LA COMMANDE
export async function ModifieretatCommande(id_commande, id_etat_commande) {
    let connection = await connectionPromise;
    let result = await connection.run(
        `UPDATE commande
        SET id_etat_commande = ?
        WHERE id_commande = ?`,
        [id_etat_commande, id_commande]
    );
}
//supprimer la table commande
export async function deletelacommande(id_commande) {
    let connection = await connectionPromise;
    let result = await connection.run(
        `DELETE  FROM commande
        WHERE id_commande=?;`,
        [id_commande]
    );
}
// obtenir etat de la commande
export async function getecommande() {
    let connection = await connectionPromise;
    let commande = await connection.all(
        `SELECT  e.nom AS etat_commande_nom
        FROM commande c
        JOIN etat_commande e ON c.id_etat_commande = e.id_etat_commande
        WHERE c.id_commande = 1;`
    );
    return commande;

}

//ajouter une commande
export async function addelementCommande( id_etat_commande, date) {
    let connection = await connectionPromise;
    let result = await connection.run(
        `INSERT INTO commande(id_utilisateur,id_etat_commande,date)
        VALUES(?,?,?);`,
        [1, id_etat_commande, date]
    );
    return result.lastID;

}
//récupérer id_prduit id_commande le nom, l'image et le prix à partir de la table produit
export async function getinformationProduit() {
    let connection = await connectionPromise;
    let info_produit = await connection.all(
        `SELECT p.id_produit, p.nom, p.chemin_image, p.prix, cp.quantite,cp.id_commande
        FROM commande_produit cp
        JOIN produit p ON cp.id_produit = p.id_produit;`
    );
    return info_produit;

}

// calculer le prix total des produits contenus dans le panier
export async function getsommeprix(id_commande) {
    let connection = await connectionPromise;
    let sommeprix = await connection.all(
        `SELECT
        cp.id_commande,
        IFNULL(SUM(p.prix * cp.quantite), 0) AS somme_prix_produits
     FROM
        commande_produit cp
    JOIN
        produit p ON cp.id_produit = p.id_produit
    WHERE
        cp.id_commande = ?;`,
        [id_commande]
    );
    return sommeprix;

}
