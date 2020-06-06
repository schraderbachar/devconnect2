const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

//@route    GET api/profile/me
//@desc     get current users profile
//@access   private
router.get('/me',auth, async (req,res) => {
    try {
        //sets the profile to the profile thats attacthed to the id of the user   populate gets the vals in array from user model
        const profile = await Profile.findOne({ user: req.user.id}).populate(
            'user',
            ['name','avatar']
            )

        //no profile logic
        if (!profile){
            return res.status(400).json({msg: 'No profile for this user'})
        }
        //if found- send profile
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
        
    }
})

module.exports = router;