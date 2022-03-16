const router = require('express').Router();
const infosController = require('../controllers/infos.controller');


//infos sur les gains 
router.get('/admin', infosController.gainAdmin);
router.get('/agence/:id', infosController.gainAgence);
router.get('/branche/:id', infosController.gainBranche);


//infos sur l'historique simple branche

router.get('/branche/historique/:id', infosController.histoBranche);

//infos sur l'historique avec filtre  branche
router.post('/branche/historiquefiltre/:id', infosController.historique);

//historique agence simple 
router.get('/agence/historique/:id', infosController.historiqueAgence);


//historique agence filtre
router.post('/agence/historiquefiltre/:id', infosController.historiqueAgenceFiltre);

//statistiques 

router.get('/branche/statistique/:id', infosController.statistiqueBranche);


//colis livre
router.get('/branche/colislivre/:id', infosController.livreBranche);


//signaler un colis 
router.post('/signaler', infosController.signaler);


//voire les colis signalé
router.get('/colissignale', infosController.colisSignale);


module.exports =  router ;