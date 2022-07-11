const jwt = require('jsonwebtoken');

const secret="jkgfd9849j9Ht98hd(&f0ksd78y)J()0sdy8fkj0g82-0949uJ"

function checkAuthentication (req, res) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, secret);
        req.userData = decoded;
        console.log(decoded)
        return true;
    } catch (error) {
        return false;
    }
};

module.exports={
    checkAuthentication
}