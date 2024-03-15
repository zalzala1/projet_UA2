import connectionPromise from "../connexion.js";

export const getCommandes = async (req, res) => {
  try {
    let connection = await connectionPromise;
    let commandes = await getCommande();
    res.status(200).json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDerniereCommandeForUser = async (req, res) => {
  try {
    const { idUtilisateur } = req.params; // Assurez-vous que l'ID utilisateur est transmis en tant que paramètre de route
    let lastCommandeID = await getDerniereCommandeId(idUtilisateur);
    if (lastCommandeID) {
      let derniereCommande = await getDerniereCommande(lastCommandeID);
      res.status(200).json(derniereCommande);
    } else {
      res
        .status(404)
        .json({ message: "Aucune commande trouvée pour cet utilisateur." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const soumettreCommandeUtilisateur = async (req, res) => {
  try {
    const { idUtilisateur } = req.body; // Assurez-vous que l'ID utilisateur est inclus dans le corps de la requête
    let derniereCommande = await soumettreCommande(idUtilisateur);
    res.status(200).json(derniereCommande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const modifierEtatCommande = async (req, res) => {
  try {
    const { idCommande, idEtat } = req.body; // Assurez-vous que l'ID de la commande et le nouvel état sont inclus dans le corps de la requête
    await modifyEtatCommande(idCommande, idEtat);
    res
      .status(200)
      .json({ message: "L'état de la commande a été modifié avec succès." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEtatsCommande = async (req, res) => {
  try {
    let etats = await getEtatCommande();
    res.status(200).json(etats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajoutez ici toutes les autres fonctions dont vous avez besoin pour ce contrôleur
