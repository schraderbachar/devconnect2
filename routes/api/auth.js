const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
//@route    GET api/auth
//@desc     Test route
//@access   public
router.get('/',auth, async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch (err) {
     console.error(err.message);
     res.status(500).send('Server error')
        
    }
})

//login user
//@route    post api/auth
//@desc     auth user and get token
//@access   public
router.post('/', 
[
    check('email','Please include valid email').isEmail(),
    check('password','Password is required').exists()
],
async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
//using this so we dont have to right req.body.var each time
    const {email,password} = req.body;

    
    try {
        //check if credentials are correct
        let user = await User.findOne({email});
        if (!user){
            return res.status(400).json({errors: [{ msg: 'email or password is incorrect'}]})
        }
        
        //check to see if pass entered is same as in db
        const isMatch = await bcrypt.compare(password,user.password)

        if (!isMatch){

            return res.status(400).json({errors: [{ msg: 'email or password is incorrect'}]})
        }

        //return jwt- to get logged in right away in front en
        
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn:360000}, 
            (err,token) => {
                if (err) throw err
                res.json({token})

            }    
            )
        
    } catch (err) {
     console.error(err.message);
     res.status(500).send('Server error');   
    }


    

});


module.exports = router;