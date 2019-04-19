const users = require('../data/users.json')
const media = require('../data/media.json')

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
    const results = media.filter(d => d.user_id === userId)

    return res.json({data: results})
}

module.exports = {
    userDetails,
    userMedia
}