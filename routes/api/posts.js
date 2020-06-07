const express = require('express')
const router = express.Router()
const { check, validationResult} = require('express-validator')
const auth = require('../../middleware/auth')
const Post = require('../../models/Post')
const User = require('../../models/User')
const Profile = require('../../models/Profile')

//@route    Post api/posts
//@desc     Create Post
//@access   private
router.post('/',[auth, [
    check('text','Text is required').not().isEmpty()
]],async (req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const user = await User.findById(req.user.id).select('-password')

    const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    })
//save the new post into a variable so we can send it as a response
    const post = await newPost.save()

    res.json(post)
        
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
    
})

//@route    get api/posts
//@desc     get all posts
//@access   private
router.get('/', auth, async (req,res)=> {
    try { 
                                        // this part gets the most recent posts
        const posts = await Post.find().sort({date: -1})
        res.json(posts)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
        
    }

})


//@route    get api/posts/:id
//@desc     get post by id
//@access   private
router.get('/:id', auth, async (req,res)=> {
    try { 
        const post = await Post.findById(req.params.id) 

        if (!post){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.json(post)
    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Server error')
        
    }

})

//@route    delete api/posts/:id
//@desc     delete post
//@access   private
router.delete('/:id', auth, async (req,res)=> {
    try { 
        const post = await Post.findById(req.params.id)

        //checks if posts exits
        if (!post){
            return res.status(404).json({msg: 'Post not found'})
        }

        //check user to see if they match the one that is logged in
        if (post.user.toString() !== req.user.id) return res.status(401).json({msg: 'User not authorized'})


        await post.remove()

        res.json({msg: 'Post removed'})
    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Server error')
        
    }

})

//@route    Put api/posts/like/:id
//@desc     like a post
//@access   private
router.put('/like/:id',auth, async(req,res) => {
    try {
        const post = await Post.findById(req.params.id)

        //check if post has already been liked by user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
        return res.status(400).json({msg:'You have already liked this post'})
        }
        //adds the user to the likes array at the top of the stack by getting the id
        post.likes.unshift({user: req.user.id})

        await post.save()

        res.json(post.likes)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
        
    }
})

//@route    Put api/posts/unlike/:id
//@desc     unlike a post
//@access   private
router.put('/unlike/:id',auth, async(req,res) => {
    try {
        const post = await Post.findById(req.params.id)

        //check if post hasn't already been liked by user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
        return res.status(400).json({msg:'Post hasnt been liked yet'})
        }
    
        //get remove index - matches it to the index of the user's id in the likes array- splice to remove it
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex,1)

        await post.save()

        res.json(post.likes)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
        
    }
})

//@route    Post api/posts/comment/:id
//@desc     comment on a post
//@access   private
router.post('/comment/:id',[auth, [
    check('text','Text is required').not().isEmpty()
]],async (req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const user = await User.findById(req.user.id).select('-password')

        const post = await Post.findById(req.params.id)

    const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    }

    post.comments.unshift(newComment)

    await post.save()


    res.json(post.comments)
        
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
    
})

//@route    delete api/posts/comment/:id/:comment_id
//@desc     delete a comment on a post
//@access   private
router.delete('/comment/:id/:comment_id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)

        //pull out comment from that post
        const comment = post.comments.find(comment => comment.id ===req.params.comment_id)

        //make sure comment exists
        if (!comment) return res.status(404).json({msg:'Comment not found'})

        //make sure user that wants to delete is the one who made it
        if (comment.user.toString() !== req.user.id) return res.status(401).json({msg: 'User not authorized to delete comment'})

        //find the index of the comment in the comments array so we can remove it
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id) 
        
        post.comments.splice(removeIndex,1)

        await post.save()

        res.json(post.comments)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports = router;