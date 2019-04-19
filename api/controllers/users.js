const users = require('../data/users.json')
const media = require('../data/media.json')
const tweets = require('../data/tweets.json')

function userDetails(req, res) {
    const userId = Number(req.swagger.params.userId.value)
    const targetUser = users.find(u => u.id === userId)
    
    if(targetUser) {
        return res.json({
            data: targetUser
        })
    }

    return res.status(400).json({
        message: "User with the given ID does not exist"
    })
}

function userMedia(req, res) {
    const userId = Number(req.swagger.params.userId.value)
    const userData = users.find(u => u.id === userId)
    if(!userData) {
        return res.status(400).json({
            message: "User with the given ID does not exist"
        })
    }

    const results = media.filter(d => d.user_id === userId)

    return res.json({ data: results })
}

function userFollowersSuggestions(req, res) {
    const userId = Number(req.swagger.params.userId.value)
    const userData = users.find(u => u.id === userId)
    if(!userData) {
        return res.status(400).json({
            message: "User with the given ID does not exist"
        })
    }

    const currentlyFollowing = userData.following || []
    const suggestions = users.filter(u => u.id !== userId && !currentlyFollowing.includes(u.id))

    return res.json({ data: suggestions })
}

/**
 * Tweets made by the people the user is following
 */
function userFollowingTweets(req, res) {
    const userId = Number(req.swagger.params.userId.value)
    const userData = users.find(u => u.id === userId)
    if(!userData) {
        return res.status(400).json({
            message: "User with the given ID does not exist"
        })
    }

    const currentlyFollowing = userData.following || []
    const data = tweets.filter(t => currentlyFollowing.includes(t.userId)).map(t => ({
        ...t,
        user: users.find(u => u.id === t.userId) || {}
    }))
    return res.json({ data })
}

function userTweets(req, res) {
    const userId = Number(req.swagger.params.userId.value)
    const userData = users.find(u => u.id === userId)
    if(!userData) {
        return res.status(400).json({
            message: "User with the given ID does not exist"
        })
    }

    const data = tweets.filter(t => t.userId === userId).map(t => ({
        ...t,
        user: users.find(u => u.id === t.userId) || {}
    }))
    return res.json({ data })
}

module.exports = {
    userDetails,
    userMedia,
    userFollowersSuggestions,
    userFollowingTweets,
    userTweets
}