const express= require('express');
const router = express.Router();
const User= require('./../models/user');
const {jwtAutMiddleware,generateToken} =require('./../jwt');



router.post('/signup',async(req,res)=>{
    try{
    const data =req.body;//assuming the request body constains the person data
    // create a new userdocument using the mongoose model
    const newUser=new User(data);
    const response = await newUser.save();
    console.log("data saved");  

    const payload={
      id:response.id
     
    }
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("token is:", token);

    res.status(200).json({response: response, token: token});
    }
    catch(err){
      console.log(err);
      res.status(500).json({error:'internal ki server error'});
    }
});
router.post('/login', async(req,res)=>{
    try{
      // extract the username and passworf from the request body
      const{ aadharCardNumber,password}= req.body;
      //find the user by username
      const user = await Person.findOne({ aadharCardNumber: aadharCardNumber});
      //if  user doesnot exist or passwword doesnot match ,return error
      if(!user ||!(await user.comparePassword(password))){
        return res.status(401).json({error:'invalid username and password'});
      }
      const payload ={
        id :user.id
      
      }
      const token = generateToken(payload);
      //return token as response
      res.json({token})
    }catch(err){
      console.error(err);
      res.status(500).json({error:'internal server error'});
    }

   });

router.get('/Profile',jwtAutMiddleware,async(req,res)=>{
  try{
    const userData = req.user;
    console.log("user Data :",userData);
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({user});

  }catch(err){
    console.error(err);
    res.status(500).json({error :"internal server error"});
  }
});




    // for updation
    router.put('/profile/password',async(req,res)=>{

      try{
        const userId =req.user//extract the id from  the token
        const{currentPassword,newPassword} = req.body;//extract current password and new password from the requesr body
        // find user by id

         const response = await User.findById(userId);
         //if  password doesnot match ,return error
         if(!(await User.comparePassword(password))){
            return res.status(401).json({error:'invalid username and password'});
          }
          //update the password userpassword
          User.password =new Password;
          await User.save();

       
         console.log("password updated");
         res.status(200).json({error:'internal Server Error'});


      }catch(err){
        console.log(err);
        res.status(500).json({error:'interval  server error'});
      }

    });
     router .delete('/:id',async(req,res)=>{
      try{
        const personId =req.params.id;//extract the id from the url parameter
       
         const response = await User.findByIdAndDelete(personId);
        
         
          if(!response){
            return res.status(404).json({error:'person not found'});
          }
         console.log("data is delete");
         res.status(200).json({message:'person deleted sucessfully'});

      }catch(err){
        console.log(err);
        res.status(500).json({error:'interval  server error'});
      }


     });
   
   
     // comment added
     

    module.exports= router;