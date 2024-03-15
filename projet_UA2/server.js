import 'dotenv/config';
import express, { json } from "express";
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import { engine } from 'express-handlebars'
import { addelementMenu,deletelacommande,getsommeprix,getecommande, augmenterproduitCommande, getsommequantite, getinformationProduit, getelemenProduit, deleteelementCommande, addelementCommande, deleteproduitCommande, ModifieretatCommande, addelementMenu_Commande, getelemenCommande, getelemenMenu, } from './modele/menu.js'
import { isid_commandeValid,isprixValid,ischeminimageValid,isdate_commandeValid,isnom_produitValid, isid_produitValid,isid_utilisateur,isid_etat_commandeValid } from './validation.js'
const app = express();    //creation du serveur
//configuration de L'engin
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
//appel des middlewares
app.use(helmet()); //protection du serveur
app.use(cors()); //appel d'autres serveurs
app.use(compression()); //compresser les requetes
app.use(json());//comprendre le json
app.use(express.static('public'));
// programmation des routes
app.get('/', async (request, response) => {
   response.render('index',
      {
         titre: 'Menu',
         styles: ['/css/style.css'],
         scripts: ['/js/main.js'],
        
      });
});
app.get('/panier.html', async (request, response) => {
   response.render('panier',
      {
         titre: 'Panier',
         styles: ['/css/style.css'],
         scripts: ['/js/panier.js'],
        
      });
});
app.get('/commande', async (request, response) => {
   response.render('commandesoumise',
      {
         titre: 'Commande',
         styles: ['/css/style.css'],
         scripts: ['/js/commandesoumise.js'],
         
      });
});

//les get
//retourne les produits présents dans la table produit
app.get('/api/menu', async (request, response) => {
   let menu = await getelemenMenu();
   response.status(200).json(menu);
});
//recherche d'un produit dans le menu
app.get('/api/menu_produit', async (request, response) => {
   const id_produit = request.query.id_produit;
   let produit = await getelemenProduit(id_produit);
   response.status(200).json(produit);
});
//la somme des quantités
app.get('/api/sommequantite', async (request, response) => {

   let somme_quantites = await getsommequantite();
   response.status(200).json(somme_quantites);
});
// retourne l'etat de la commande
app.get('/api/info_commande', async (request, response) => {

   let commande = await getecommande();
   response.status(200).json(commande);
});
//la somme du total des prix contenus dans  le panier
app.get('/api/sommeprix', async (request, response) => {
   let id_commande= request.query.id_commande;
   let sommeprix = await getsommeprix(id_commande);
   response.status(200).json(sommeprix);
});
////obtenir la liste des commandes
app.get('/api/commande', async (request, response) => {
   let commande = await getelemenCommande();
   response.status(200).json(commande);
});
////récupérer id_prduit id_commande le nom, l'image et le prix à partir de la table produit
app.get('/api/info_produit', async (request, response) => {

   let info_produit = await getinformationProduit();
   response.status(200).json(info_produit);
});
//les add
//ajouter dans le menu un produit
app.post('/api/menu', async (request, response) => {
   if(!isnom_produitValid(request.body.nom))
   {
      response.status(400).end();
   }
   if(!ischeminimageValid(request.body.chemin_image))
   {
      response.status(400).end();
   }
   if(!isprixValid(request.body.prix))
   {
      response.status(400).end();
   }
   let id = await addelementMenu(request.body.nom, request.body.chemin_image, request.body.prix);
   response.status(201).json({ id: id });


});
//chemin pour ajouter un produit à la commande
app.post('/api/commande', async (request, response) => {

   //validation
   if(!isid_commandeValid(request.body.id_commande))
   {
      response.status(400).end();
   }
   if(!isid_produitValid( request.body.id_produit))
   {
      response.status(400).end();
   }
   let id = await addelementMenu_Commande(request.body.id_commande, request.body.id_produit);
   response.status(201).json({ id: id });


});
//ajouter une commande
app.post('/api/commandes', async (request, response) => {
   if(!isid_etat_commandeValid(request.body.id_etat_commande))
   {
      response.status(400).end();
   }
   if(!isdate_commandeValid(request.body.date))
   {
      response.status(400).end();
   }

   let id = await addelementCommande( request.body.id_etat_commande, request.body.date);
   response.status(201).json({ id: id });


});
//les modification
//modifier l'etat de la commande
app.put('/api/status', async (request, response) => {
   if(!isid_commandeValid(request.body.id_commande))
   {
      response.status(400).end();
   }
   if(!isid_etat_commandeValid(request.body.id_etat_commande))
   {
      response.status(400).end();
   }

   await ModifieretatCommande(request.body.id_commande, request.body.id_etat_commande);
   response.status(200).end();


});
//augmenter la quantité dun produit
app.put('/api/augmenterquantite', async (request, response) => {
   if(!isid_commandeValid(request.body.id_commande))
   {
      response.status(400).end();
   }
   if(!isid_produitValid( request.body.id_produit))
   {
      response.status(400).end();
   }
   await augmenterproduitCommande(request.body.id_commande, request.body.id_produit);
   response.status(200).end();


});
//les deletes
//supprimer une commande du panier
app.delete('/api/commande', async (request, response) =>
{
   if(!isid_commandeValid(request.body.id_commande))
   {
      response.status(400).end();
   }
   await deleteelementCommande(request.body.id_commande);
   response.status(200).end();
});
//supprimer un produit de la commande
app.delete('/api/produitcommande', async (request, response) => {
   if(!isid_commandeValid(request.body.id_commande))
   {
      response.status(400).end();
   }
   if(!isid_produitValid( request.body.id_produit))
   {
      response.status(400).end();
   }
   await deleteproduitCommande(request.body.id_commande, request.body.id_produit);
   response.status(200).end();
});
//supprimer la commande
app.delete('/api/commande', async (request, response) => {
   if(!isid_commandeValid(request.body.id_commande))
   {
      response.status(400).end();
   }
  
   await deletelacommande(request.body.id_commande);
   response.status(200).end();
});
console.log("server crée");
app.listen(process.env.PORT);   //demarrer le serveur avec le port 5000
console.log('serveur demarré:http://localhost:' + process.env.PORT);      