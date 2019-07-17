import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const helloHttp = functions.https.onRequest((req, res) => {
    switch (req.method) {
        case 'GET':
            res.status(403).send('Forbidden!');
            break;
        case 'PUT':
            res.status(403).send('Forbidden!');
            break;
        case 'POST':
            var BatchesRef = admin.firestore().collection('Batches');
            BatchesRef.get().then(snapshot => {
                let arrayR = snapshot.docs.map(doc => {
                   return {id: doc.id, data: doc.data()}
                });
                let half = 1800000;
                let date = new Date();
                let Actualtimestamp = date.getTime();
                var goodToGo = true;
                while(goodToGo){
                    let random = Math.floor(Math.random() * arrayR.length + 1);
                        if(arrayR[random].data.status === "Scrapping" && (Actualtimestamp - arrayR[random].data.LastModifiedAt >= half)){
                            goodToGo = false;
                            return res.json(arrayR[random].data);  
                        }else if( arrayR[random].data.status === "Not Scrapped") {
                            admin.firestore().collection('Batches').doc(arrayR[random].id).set({status: 'Scrapping'}).then( () => {
                                console.log("all good");
                            }).catch((error)=>{
                                console.log(error);
                            });
                            goodToGo = false;
                            return res.json(arrayR[random]);  
                    }
                }
                return res.status(500).send('No batch found');
            }).catch(error => {
                return res.status(500).send('There was an error2');
            }) 
        break;
        case 'DELETE':
            res.status(403).send('Forbidden!');
        break;
      default:
        res.status(405).send({error: 'Something blew up!'});
        break;
    }
  });

//   export const Scrapped = functions.https.onRequest((req, res) => {
//       req.body
//   })
