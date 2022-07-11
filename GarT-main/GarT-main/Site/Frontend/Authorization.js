
const fetch =require("node-fetch")
async function validateToken(token) {

    let message
    let res = await fetch("http://localhost:5000/api/verifyToken", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Append": "*/*",
            "Authorization": `Bearer ${token}`
        },
    }).then((response) => response.json())
        .then((data) => {
            message = data.message
        })
        .catch((error) => {
            console.log(error)
        })

        if(message=="You are not logged in!")
        return false

    return true
}

async function checkIfUserIsAdmin(token) {
    let admin
    let res = await fetch("http://localhost:5000/api/user/admin", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Append": "*/*",
            "Authorization": `Bearer ${token}`
        },
    }).then((response) => response.json())
        .then((data) => {
            admin = data.admin
        })
        .catch(error => console.log(error))

    return admin
}

module.exports={
    validateToken,checkIfUserIsAdmin
}