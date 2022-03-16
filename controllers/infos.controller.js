const colisModel = require("../models/colis.model");
const { find } = require("../models/gerantAgence.model");
const gerantModel = require("../models/gerantAgence.model");
const brancheModel = require("../models/gerantBranche.model");
const ISODate = require("isodate");
const etatModel = require("../models/etat.model");





module.exports.gainAdmin = async (req, res)=>{


    try {

        let  som=0;
        const gain = await colisModel.find().select().exec();
       // res.status(200).json(gain);
        for(i=0; i<gain.length; i++){
                som+=gain[i].prix;
           // console.log(gain[i].prix);
        }
        res.status(200).json(som);
       

    } catch (error) {
        console.log(error);
    }
}
//on recherche le gain de toute l'agence, on reherche d'abord le tableau regroupant toute les branche dans le gérant ensuite dans 
//chaque branche on parcours aussi le tableau contenant les id des colis enregistré et a chaque fois on récupere le prix et on somme
module.exports.gainAgence = async (req, res)=>{
   let som=0;
   let date = new Date();
   let mois =date.getMonth();
   let dateDebut = new Date(date.getFullYear(), mois, date.getDate(),1,0);

let dateFin = new Date(date.getFullYear(), (mois), (date.getDate())+1 ,1,0);

    try {
        const agence = await gerantModel.findById(req.params.id);
      
        for(let i=0; i<agence.idBranche.length; i++){
            const branche = await brancheModel.findById(agence.idBranche[i]);
            

            for(j=0; j<branche.idColis.length; j++){
               
                    let colis =await  colisModel.findOne({
                        $and: [
                            {_id: branche.idColis[j]},
                            {
                                createdAt: { $gte:ISODate(dateDebut),
                                             $lte:ISODate(dateFin)
                                 },
                                            
                            }
                        ]});

                       
                
                if(colis){

                    som+=colis.prix ;
                }
               
                
            }
        }
       res.status(200).json(som);  
    } catch (error) {
        console.log(error)
        res.status(200).json(error);
    }
}

module.exports.gainBranche = async (req, res)=>{
    let som=0;
    let date = new Date();
    let mois =date.getMonth();

    let dateDebut = new Date(date.getFullYear(), mois, date.getDate(),1,0);

let dateFin = new Date(date.getFullYear(), (mois), (date.getDate())+1 ,1,0)

    try {
        const branche = await brancheModel.findById(req.params.id) ;

        for(i=0; i<branche.idColis.length; i++){
            const colis = await colisModel.findOne(
                {
                $and: [
                    {_id: branche.idColis[i]},
                    {
                        createdAt: { $gte:ISODate(dateDebut),
                                     $lte:ISODate(dateFin)
                         },
                                    
                    }
                ]
            }
                );
            if(colis){

                som+=colis.prix ;
            }
        }
        
        res.status(200).json(som);

    } catch (error) {
        console.log(error);
        res.status(200).json(error);
    }
}
//historique de la journé declenché automatiquement
module.exports.histoBranche = async (req, res) => {
let date = new Date();
let mois =date.getMonth();
let jour = date.getDate()+1;
//on filtre ici avec le debut du jour et le debut du jour suivant
let dateDebut = new Date(date.getFullYear(), mois, date.getDate(),1,0);

let dateFin = new Date(date.getFullYear(), (mois+1), jour,1,0)


//(date.getFullYear(), mois, date.getDate())


  console.log(" jour "+date.getDate() +" mois "+ mois +" annee "+date.getFullYear());
    try {
        const colis = await colisModel.find({$and: [
            {reference: req.params.id},
            {
                createdAt: { $gte:ISODate(dateDebut),
                             $lte:ISODate(dateFin)
                 },
                            
            }
        ]})
        console.log("automatique");
        console.log(ISODate(dateDebut));
       
        console.log(ISODate(dateFin) );
       
        

        res.status(200).json(colis)
    } catch (error) {
        res.status(200).json(error) 
    }
}
//historique de la branche par filtrage 
module.exports.historique = async (req, res )=>{
    let dateDebut =  new Date(req.body.datedebut);
    let tempo = new Date(req.body.datefin);
    let dateFin = new Date(tempo.getFullYear(), tempo.getMonth(), tempo.getDate(),1,0);
    try {
        
        const colis = await colisModel.find({$and: [
            {reference: req.params.id},
            {
                createdAt: { $gte:ISODate(dateDebut),
                             $lte:ISODate(dateFin)}
            }
        ]}
            
        )
        console.log(ISODate(dateDebut));
        console.log(ISODate(dateFin))
        res.status(200).json(colis);

    } catch (err) {
        res.status(200).json(err);
        console.log(err)
    }
}

module.exports.historiqueAgence = async (req, res)=>{

    let date = new Date();
let mois =date.getMonth();
let jour = date.getDate()+1;
//on filtre ici avec le debut du jour et le debut du jour suivant
let dateDebut = new Date(date.getFullYear(), mois, date.getDate(),1,0);

let dateFin = new Date(date.getFullYear(), (mois), jour,1,0)

    try {
        let som =0;
        let histo = [];
        const agence = await gerantModel.findById(req.params.id).select('idBranche');
       
        for(let i=0; i<agence.idBranche.length ; i++){
            const branche = await brancheModel.findById(agence.idBranche[i]).select();
           /* for(let j=0; j<branche.idColis.length; j++){
                const colis = await colisModel.find({$and: [
                    {id: branche.idColis[j]},
                    {
                        createdAt: { $gte:ISODate(dateDebut),
                                     $lte:ISODate(dateFin)
                         },
                                    
                    }
                ]} )
                 console.log(colis.prix)
                som+= colis.prix ;
            }*/

            const colis = await colisModel.find({$and: [
                {reference: branche.id},
                {
                    createdAt: { $gte:ISODate(dateDebut),
                                 $lte:ISODate(dateFin)
                     },
                                
                }
            ]} )

            for(let j=0; j<colis.length; j++){
                som+= colis[j].prix
            }
          
            histo.push({nom: branche.nomBranche, som, nombre: colis.length});
            som=0;
         
        }
        console.log(ISODate(dateDebut));
        console.log(ISODate(dateFin));
        res.status(200).json(histo);
    } catch (error) {
        console.log(error);
    }
}

module.exports.historiqueAgenceFiltre = async (req, res) =>{
    let dateDebut =  new Date(req.body.datedebut);
    let tempo = new Date(req.body.datefin);
    let dateFin = new Date(tempo.getFullYear(), tempo.getMonth(), tempo.getDate(),1,0);

    try {
        let som =0;
        let histo = [];
        const agence = await gerantModel.findById(req.params.id).select('idBranche');
       
        for(let i=0; i<agence.idBranche.length ; i++){
            const branche = await brancheModel.findById(agence.idBranche[i]).select();
           

            const colis = await colisModel.find({$and: [
                {reference: branche.id},
                {
                    createdAt: { $gte:ISODate(dateDebut),
                                 $lte:ISODate(dateFin)
                     },
                                
                }
            ]} )

            for(let j=0; j<colis.length; j++){
                som+= colis[j].prix
            }
          
            histo.push({nom: branche.nomBranche, som, nombre: colis.length});
            som=0;
         
        }
        console.log(ISODate(dateDebut));
        console.log(ISODate(dateFin));
        res.status(200).json(histo);
    } catch (error) {
        console.log(error);
    }
    
}

//statistique de la branche 

module.exports.statistiqueBranche = async (req, res) =>{

    let date = new Date();
let mois =date.getMonth();
let jour = date.getDate()-6 ;

console.log("initial "+jour)
console.log("init"+date.getDay())


//on filtre ici avec le debut du jour et le debut du jour suivant
//let dateDebut = new Date(date.getFullYear(), mois, date.getDate(),1,0);

//let dateFin = new Date(date.getFullYear(), (mois), (date.getDate())+1 ,1,0)

    try {
        let som =0;
        let histo = [];

        const branche = await brancheModel.findById(req.params.id).select('idColis');
       
        for(let i=0; i< 7; i++){
                
            
                if(jour > date.getDate()){
                    jour = jour%date.getDate() ;
                }
                let dateDebut = new Date(date.getFullYear(), mois, jour,1,0);
                    let day = dateDebut.getDay();
                let dateFin = new Date(date.getFullYear(), (mois), jour+1 ,1,0)
                console.log("--------------"+jour)
                console.log("------jour reel "+day)
                console.log(ISODate(dateDebut));
                console.log(ISODate(dateFin));

            const colis = await colisModel.find({$and: [
                {reference: branche.id},
                {
                    createdAt: { $gte:ISODate(dateDebut),
                                 $lte:ISODate(dateFin)
                     },
                                
                }
            ]} )
                let total =0 ;
            for(let j=0 ; j<colis.length; j++){
                total+=colis[j].prix ;
            }
                            jour++
                            histo.push({total, day});
                           

        }
        res.status(200).json(histo);
    }catch(err){
        console.log(err);
    res.status(200).json(err);
    console.log(ISODate(dateDebut));
    console.log(ISODate(dateFin));
    }
    

}


//statistique agence 

module.exports.statistiqueAgence = async (req, res) =>{

    let date = new Date();
let mois =date.getMonth();
let jour = date.getDate()+2 ;


//on filtre ici avec le debut du jour et le debut du jour suivant
let dateDebut = new Date(date.getFullYear(), mois, date.getDate(),1,0);

let dateFin = new Date(date.getFullYear(), (mois), (date.getDate())+1 ,1,0)

    try {
        let som =0;
        let histo = [];
        const agence = await gerantModel.findById(req.params.id).select('idBranche');
       

        for(let i=0; i< 7; i++){
                
            
            if(jour > date.getDate()){
                jour = jour%date.getDate() ;
            }
            let dateDebut = new Date(date.getFullYear(), mois, jour,1,0);
                    let day = dateDebut.getDay();
                let dateFin = new Date(date.getFullYear(), (mois), jour+1 ,1,0)



      
             

            const colis = await colisModel.find({$and: [
                {reference: branche.id},
                {
                    createdAt: { $gte:ISODate(dateDebut),
                                 $lte:ISODate(dateFin)
                     },
                                
                }
            ]} )
                            jour++
                            histo.push(colis);
                            

        }
        res.status(200).json(histo);
    }catch(err){
        console.log(err);
    res.status(200).json(err);
    console.log(ISODate(dateDebut));
    console.log(ISODate(dateFin));
    }
    

}







//colis livre 

 module.exports.livreBranche = async (req,res)=>{

 }


 //signaler un colis



 module.exports.signaler = async (req,res)=>{
    const {code} = req.body;

    try {
        
        const colis = await colisModel.findOneAndUpdate({code: code},
          
          
                {
                    $set: {
                        status: "signaler"
                    }
               },
               {new: true, upsert: true},
            
           );
        res.status(200).json(colis) ;
    } catch (err) {
        res.status(200).json(err) ;
    }
 }

 //voire les colis signalés

 module.exports.colisSignale = async (req, res) =>{
    let tab = [];
   try {
     let col ="signaler" ;
    const colis = await colisModel.find({status: col}).select();

  
    res.status(200).json(colis);

   } catch (err) {
    res.status(200).json({err: err});
   }
 }