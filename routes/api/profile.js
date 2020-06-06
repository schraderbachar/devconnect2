const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const {check, validationResult} = require('express-validator')
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

//@route    POST api/profile
//@desc     create/update user profile
//@access   private
router.post('/',[auth,
    [
    check('status','Status required').not().isEmpty(),
    check('skills','Skills required').not().isEmpty()
]
], 
    async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    //pull out all fields
    const { 
        company,website,location,bio,status,githubusername,skills,youtube,facebook,twitter,linkedin,instagram
    } = req.body

    // build profile obj
    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim())
    } 

    //build social object
    profileFields.social = {}

    if (youtube) profileFields.social.youtube = youtube
    if (facebook) profileFields.social.facebook = facebook
    if (twitter) profileFields.social.twitter = twitter
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram


    try {
        let profile = await Profile.findOne({user: req.user.id})

        if (profile){
            //update
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true}
            )
            return res.json(profile)
        }

        //create profile
        profile = new Profile(profileFields)
        await profile.save()
        res.json(profile)

    } catch (err) {
           console.error(err.message);
           res.status(500).send('Server error')
            
    }
})

//@route    GET api/profile
//@desc     get all profiles
//@access   public
router.get('/', async(req,res) => {
    try {
        const profiles = await Profile.find().populate('user',['name','avatar'])
        res.json(profiles)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
})

//@route    GET api/profile/user/:user_id
//@desc     get profile by user id
//@access   public
router.get('/user/:user_id', async(req,res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id}).populate('user',['name','avatar'])

        if (!profile) return res.status(400).json({msg: 'Profile not found'})
        res.json(profile)
        
    } catch (err) {
        console.error(err.message);
        //when the id doesn't belong to a user- aka not a valid object id
        if (err.kind == 'ObjectId')  return res.status(400).json({msg: 'Profile not found'})
        res.status(500).send('Server error')
    }
})

//@route    Delete api/profile
//@desc     Delete profile,user,posts
//@access   private
router.delete('/', auth, async(req,res) => {
    try {
        //@todo - remove users posts
        //remove profile
        await Profile.findOneAndRemove({ user: req.user.id})
        //remove user
        await User.findOneAndRemove({ _id: req.user.id})


        res.json({ msg: 'User Deleted'})
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
})

//@route    Put api/profile/experience
//@desc     Add profile experience
//@access   private
router.put('/experience',[auth, 
    [
        check('title','Title is required').not().isEmpty(),
        check('company','Company is Required').not().isEmpty(),
        check('from','From date is Required').not().isEmpty()
    ]
], 
async (req,res)=>{
    const erros = validationResult(req)
    if(!erros.isEmpty()){
        return res.status(400).json({erros: errors.array()})
    }

    //pull stuff out
    const {title,company,location,from,to,current,description} = req.body;


    //create new experience obj
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id})
        profile.experience.unshift(newExp)
        await profile.save()

        res.json(profile)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
        
    }

})


module.exports = router;