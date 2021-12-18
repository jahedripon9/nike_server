const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000

// Midleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.piqtj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            req.decodedEmail = decodedUser.email;
        }
        catch {

        }

    }
    next();
}


async function run(){

    try{
        await client.connect();
        const database = client.db('NikeOfficial');
            const nikeproductsCollection = database.collection('NikeProducts');
            const nikewomanproductsCollection = database.collection('NikeWomanProducts');
            const nikekidsproductsCollection = database.collection('NikeKidsProducts');
            const nikecollectionsproductsCollection = database.collection('NikeCollectionsProducts');
            const nikeOrdersCollection = database.collection('orderProducts');
            const usersCollection = database.collection('users');
            const reviewCollection = database.collection('review');
            
            

            // GET API
            app.get('/nikeproducts', async(req, res)=>{
                const cursor = nikeproductsCollection.find({});
                const nikeproducts = await cursor.toArray();
                res.send(nikeproducts);
            })
            app.get('/nikewomanproducts', async(req, res)=>{
                const cursor = nikewomanproductsCollection.find({});
                const nikeproducts = await cursor.toArray();
                res.send(nikeproducts);
            })
            app.get('/nikekidsproducts', async(req, res)=>{
                const cursor = nikekidsproductsCollection.find({});
                const nikeproducts = await cursor.toArray();
                res.send(nikeproducts);
            })
            app.get('/nikecollectionsproducts', async(req, res)=>{
                const cursor = nikecollectionsproductsCollection.find({});
                const nikeproducts = await cursor.toArray();
                res.send(nikeproducts);
            })
            
            



            // GET SINGLE Item
            app.get('/nikeproducts/:id', async(req, res)=>{
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const nikeproduct = await nikeproductsCollection.findOne(query);
                res.json(nikeproduct)
            })
            app.get('/nikewomanproducts/:id', async(req, res)=>{
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const nikeproduct = await nikewomanproductsCollection.findOne(query);
                res.json(nikeproduct)
            })
            app.get('/nikekidsproducts/:id', async(req, res)=>{
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const nikeproduct = await nikekidsproductsCollection.findOne(query);
                res.json(nikeproduct)
            })
            app.get('/nikecollectionsproducts/:id', async(req, res)=>{
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const nikeproduct = await nikecollectionsproductsCollection.findOne(query);
                res.json(nikeproduct)
            })

            // POST API
            

            app.post('/nikeproducts', async(req, res)=>{
                const nikeproduct = req.body;

               console.log('Hit the post api', nikeproduct)
                const result = await nikeproductsCollection.insertOne(nikeproduct);
                console.log(result);
                res.json(result);
            })
            app.post('/nikewomanproducts', async(req, res)=>{
                const nikeproduct = req.body;

               console.log('Hit the post api', nikeproduct)
                const result = await nikewomanproductsCollection.insertOne(nikeproduct);
                console.log(result);
                res.json(result);
            })
            app.post('/nikekidsproducts', async(req, res)=>{
                const nikeproduct = req.body;

               console.log('Hit the post api', nikeproduct)
                const result = await nikekidsproductsCollection.insertOne(nikeproduct);
                console.log(result);
                res.json(result);
            })
            app.post('/nikecollectionsproducts', async(req, res)=>{
                const nikeproduct = req.body;

               console.log('Hit the post api', nikeproduct)
                const result = await nikecollectionsproductsCollection.insertOne(nikeproduct);
                console.log(result);
                res.json(result);
            })

             // DELETE API

             app.delete('/nikeproducts/:id', async(req, res )=>{
                const id = req.params.id;
                const query = {_id:ObjectId(id)};
                const result = await nikeproductsCollection.deleteOne(query);
                res.json(result);
                
            })
             app.delete('/nikewomansproducts/:id', async(req, res )=>{
                const id = req.params.id;
                const query = {_id:ObjectId(id)};
                const result = await nikewomanproductsCollection.deleteOne(query);
                res.json(result);
                
            })
             app.delete('/nikekidsproducts/:id', async(req, res )=>{
                const id = req.params.id;
                const query = {_id:ObjectId(id)};
                const result = await nikekidsproductsCollection.deleteOne(query);
                res.json(result);
                
            })
             app.delete('/nikecollectionsproducts/:id', async(req, res )=>{
                const id = req.params.id;
                const query = {_id:ObjectId(id)};
                const result = await nikecollectionsproductsCollection.deleteOne(query);
                res.json(result);
                
            })



            // __________________________

                // confirm order
            app.post('/confirmOrder', async (req, res) => {
                const result = await nikeOrdersCollection.insertOne(req.body);
                res.send(result);
            });
            
            // my confirmOrder
        
            app.get('/myOrders/:email', async (req, res) => {
                const result = await nikeOrdersCollection
                .find({ email: req.params.email })
                .toArray();
                res.send(result);
            });
        
            // delete order
        
            app.delete('/deleteOrder/:id', async (req, res) => {
                const result = await nikeOrdersCollection.deleteOne({
                _id: ObjectId(req.params.id),
                });
                res.send(result);
            });

            
            app.get('/users/:email', async(req, res) => {
                const email = req.params.email;
                const query = { email: email};
                const user = await usersCollection.findOne(query);
                let isAdmin = false;
                if(user?.role === 'admin'){
                    isAdmin = true;
                }
                res.json({admin: isAdmin});
              })
      
              app.post('/users', async (req, res) => {
                const user = req.body;
                const result = await usersCollection.insertOne(user);
                console.log(result);
                res.json(result);
            });



            app.put('/users', async(req, res)=>{
                const user = req.body;
                const filter = {email: user.email};
                const options = {upsert: true};
                const updateDoc = {$set: user};
                const result = await usersCollection.updateOne(filter, updateDoc, options);
                res.json(result)
            })
      
            app.put('/users/admin', verifyToken, async(req, res)=>{
              const user = req.body;
              const requester = req.decodedEmail;
              if(requester){
                const requesterAccount = await usersCollection.findOne({email: requester});
                if(requesterAccount.role === 'admin'){
                  const filter = {email: user.email};
                  const updateDoc = {$set:{role:'admin'}};
                  const result = await usersCollection.updateOne(filter, updateDoc);
                  res.json(result);
      
                }
              }
              else {
                res.status(403).json({message: 'You do not have access to make Admin'})
              }
            })


            // all order
            app.get("/allOrders", async (req, res) => {
                const result = await nikeOrdersCollection.find({}).toArray();
                res.send(result);
            });
        
            // update statuses
        
            app.put("/status/:id", (req, res) => {
                const id = req.params.id;
                const updatedStatus = req.body.status;
                const filter = { _id: ObjectId(id) };
                console.log(updatedStatus);
                ordersCollection
                .updateOne(filter, {
                    $set: { status: updatedStatus },
                })
                .then((result) => {
                    res.send(result);
                });
            });

            // review
            app.post("/addReview", async (req, res) => {
                const result = await reviewCollection.insertOne(req.body);
                res.send(result);
            });
            // GET review API
            app.get('/addReview', async(req, res)=>{
                const cursor = reviewCollection.find({});
                const reviws = await cursor.toArray();
                res.send(reviws);
            })



    }
    finally{
        // await client.close();
    }

}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello Nike!')
})

app.listen(port, () => {
  console.log(`Example app listening at ${port}`)
})