//pour l'etat de la commande
export const isid_etat_commandeValid = (id_etat_commande) =>
    typeof id_etat_commande === 'number' &&
    id_etat_commande < 5 && id_etat_commande > 0;
//pour l'id_commande
export const isid_commandeValid = (id_commande) =>
    typeof id_commande === 'number' && id_commande > 0;
//pourr l'id produit
export const isid_produitValid = (id_produit) =>
    typeof id_produit === 'number' && id_produit > 0;
//pour l'id utilisateur
export const isid_utilisateur = (id_utilisateur) =>
    typeof id_utilisateur === 'number' && id_utilisateur > 0;
//nom du produit
export const isnom_produitValid = (nom) =>
    typeof nom === 'string';
//date valide
export const isdate_commandeValid = (date) =>
    typeof date === 'string';
//chemin de l'image
export const ischeminimageValid = (chemin) =>
    typeof chemin === 'string';
//le prix du produit
export const isprixValid = (prix) =>
    typeof prix === 'number';