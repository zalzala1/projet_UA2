import connectionPromise from "../connexion.js";

/**
 * Retourne une liste de tous les produits, leur quantite et leur total dans
 * le panier dans la base de données.
 * @returns Une liste de tous les produits, leur quantite et leur total.
 */
export const getPanier = async (idUtilisateur) => {
  let connection = await connectionPromise;

  let results = await connection.all(
    `SELECT commande_produit.id_produit, nom, chemin_image, printf("%.2f", prix) AS prix,
            quantite, printf("%.2f", prix * quantite) AS total
        FROM commande_produit 
        INNER JOIN produit ON commande_produit.id_produit = produit.id_produit
        INNER JOIN commande ON commande_produit.id_commande = commande.id_commande
        WHERE id_etat_commande = 1 AND
        id_utilisateur = ?;`,
    [idUtilisateur]
  );

  return results;
};

/**
 * Ajoute un produit dans le panier dans la base de données.
 * @param {Number} idProduit L'identifiant du produit à ajouter.
 * @param {Number} quantite La quantité du produit à ajouter.
 */
export const addToPanier = async (idUtilisateur, idProduit, quantite) => {
  let connection = await connectionPromise;

  // On regarde si la commande du panier existe
  let commandePanier = await connection.get(
    `SELECT id_commande 
        FROM commande 
        WHERE id_etat_commande = 1 AND id_utilisateur = ?;`,
    [idUtilisateur]
  );

  // On ajoute la commande du panier si elle n'existe pas
  let idCommande;
  if (!commandePanier) {
    let result = await connection.run(
      `INSERT INTO commande(id_utilisateur, id_etat_commande)
            VALUES(?, 1)`,
      [idUtilisateur]
    );

    idCommande = result.lastID;
  } else {
    idCommande = commandePanier.id_commande;
  }

  // On recherche si le produit en paramètre existe déjà dans notre panier
  let entreePanier = await connection.get(
    `SELECT quantite 
        FROM commande_produit 
        INNER JOIN commande ON commande_produit.id_commande = commande.id_commande
        WHERE id_etat_commande = 1 AND id_produit = ? AND commande.id_utilisateur = ?;`,
    [idProduit, idUtilisateur]
  );

  if (entreePanier) {
    // Si le produit existe déjà dans le panier, on incrémente sa quantité
    await connection.run(
      `UPDATE commande_produit 
            SET quantite = ?
            FROM commande
            WHERE commande_produit.id_commande = commande.id_commande AND
                id_etat_commande = 1 AND 
                id_produit = ? AND
                commande.id_utilisateur = ?;`,
      [quantite + entreePanier.quantite, idProduit, idUtilisateur]
    );
  } else {
    // Si le produit n'existe pas dans le panier, on l'insère dedans
    await connection.run(
      `INSERT INTO commande_produit(id_commande, id_produit, quantite)
            VALUES(?, ?, ?);`,
      [idCommande, idProduit, quantite]
    );
  }
};

/**
 * Retire un produit du panier dans la base de données.
 * @param {Number} idProduit L'identifiant du produit à retirer.
 */
export const removeFromPanier = async (idUtilisateur, idProduit) => {
  let connection = await connectionPromise;

  await connection.run(
    `DELETE FROM commande_produit
        WHERE 
            id_commande = (
                SELECT id_commande 
                FROM commande 
                WHERE id_etat_commande = 1
                AND id_utilisateur = ?
            ) AND
            id_produit = ?;`,
    [idUtilisateur, idProduit]
  );
};

/**
 * Vide le panier dans la base de données
 */
export const emptyPanier = async (idUtilisateur) => {
  let connection = await connectionPromise;

  await connection.run(
    `DELETE FROM commande_produit
        WHERE id_commande = (
            SELECT id_commande 
            FROM commande 
            WHERE id_etat_commande = 1
            AND id_utilisateur = ?
        );`,
    [idUtilisateur]
  );
};
