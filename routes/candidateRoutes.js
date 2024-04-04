const express= require('express');
const router = express.Router();
const User = require('./../models/user')
const candidate= require('./../models/candidate');
const {jwtAutMiddleware,generateToken} =require('../jwt');

const checkAdminRole = async(userId)=>{
    try{
        const user = await User.findById(userId);
        return user.role =='admin';

    }catch(err){
        return false;
    }
}


// post route to add a candidate
router.post('/',jwtAutMiddleware,async(req,res)=>{
    try{
        if(! await checkAdminRole(req.user.id)){
            return res.status(404).json({message:' user has not admin role'});
        }
    const data =req.body;//assuming the request body constains the person data
    // create a new userdocument using the mongoose model
    const newCandidate=new candidate(data);
    const response = await newCandidate.save();
    console.log("data saved");  
    res.status(200).json({response:response});
    }
    
    catch(err){
      console.log(err);
      res.status(500).json({error:'internal ki server error'});
    }
});







    // for updation
    router.put('/:candidateID',jwtAutMiddleware,async (req,res)=>{

      try{
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message:' user has not admin role'});
        }
       
      
        const candidateID  =req.params.id;//extract the id from the url parameter
        const updatedCandidateData = req.body;//updated data for the person

         const response = await Person.findByIdAndUpdate(candidateID,updatedCandidateData,{
          new: true,//retuen the  updated document
          runValidators :true,//run mongoose validation
         })
          if(!response){
            return res.status(403).json({error:'candidate  not found'});
          }
         console.log("data is updated");
         res.status(200).json(response);

      }catch(err){
        console.log(err);
        res.status(500).json({error:'interval  server error'});
      }


    });
     router .delete('/:canididateID',jwtAutMiddleware,async(req,res)=>{
      try{
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message:' user has not admin role'});
        }
        const candidateId =req.params.id;//extract the id from the url parameter
       
         const response = await User.findByIdAndDelete(candidateId);
        
         
          if(!response){
            return res.status(403).json({error:'candidate  not found'});
          }
         console.log("data is delete");
         res.status(200).json({message:'candidate deleted sucessfully'});

      }catch(err){
        console.log(err);
        res.status(500).json({error:'interval  server error'});
      }


     });

     router.post('/vote/:candidateID',jwtAutMiddleware , async (req, res)=>{
        // no admin can vote
        // user can only vote once
        
        candidateID = req.params.candidateID;
        userId = req.user.id;
    
        try{
            // Find the Candidate document with the specified candidateID
            const Candidate = await candidate.findById(candidateID);
            if(!Candidate){
                return res.status(404).json({ message: 'Candidate not found' });
            }
    
            const user = await User.findById(userId);
            if(!user){
                return res.status(404).json({ message: 'user not found' });
            }
            if(user.role == 'admin'){
                return res.status(403).json({ message: 'admin is not allowed'});
            }
            if(user.isVoted){
                return res.status(400).json({ message: 'You have already voted' });
            }
    
            // Update the Candidate document to record the vote
            Candidate.votes.push({user: userId})
            Candidate.VoteCount++;
            await Candidate.save();
    
            // update the user document
            user.isVoted = true
            await user.save();
    
            return res.status(200).json({ message: 'Vote recorded successfully' });
        }catch(err){
            console.log(err);
            return res.status(500).json({error: 'Internal Server Error'});
        }
    });
    router.get('/vote/:userId',async (req, res) => {
        const userId = req.user.id
        const user =  await User.find( user.id === userId);
    
        if (!user) {
            return res.status(404).send('User not found');
        }
    
        if (user.age < 18) {
            return res.status(403).send('You must be 18 or older to vote');
        }
    })
    
     //vote count
     router.get('/vote/count',async(req,res)=>{
        try{
            const candiadate =await candidate.find().sort({VoteCount:'desc'});
            //map the  candidate to only return  to only yheir nmae and votecount
            const voterecord = candiadate.map((data)=>{
                return {
                    party:data.party,
                    count:data.VoteCount
                }
            })
            return res.status(200).json(voterecord);
            
        }catch(err){
            console.log(err);
            res.status(500).json({error:'interval  server error'});

        }
     })
   
   
     // comment added
     

    module.exports= router;