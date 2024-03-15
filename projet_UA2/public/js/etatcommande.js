const etatcommande=document.getElementById('etatcommande');
async function affichageEtat()
{
    let etat = await fetch('/api/info_commande');
    if (etat.ok) {
        let etatData = await etat.json();
        let nom_etat;
        for (let i = 0; i < etatData.length; i++) {
            nom_etat = etatData[i].etat_commande_nom
        }
        etatcommande.textContent=nom_etat;
    }
    
}
affichageEtat();