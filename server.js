const express = require('express')
const app = express();
const db =  require('./db');


const jwtAutMiddleware =require('./jwt');
require('dotenv').config();
const bodyParser = require('body-parser');//stores in req.body
app.use(bodyParser.json());
 const PORT = process.env.PORT || 3000;
 //import the  router files

 const UserRoute = require('./routes/userRoutes');
 const CandidateRoute = require('./routes/candidateRoutes');

app.use('/user',UserRoute);  
app.use('/Candidate',CandidateRoute);  





 

app.listen(3001,()=>{
    console.log('listening on port 3001');
})