
const { getPostData } = require('../utils')
const { Pool } = require('pg')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const { checkAuthentication } = require('../Middleware/checkAuth');


//const pool = new Pool({
//    connectionString: process.env.DATABASE_URL,
//    ssl: {
//        rejectUnauthorized: false
//    }
//})



const pool = new Pool({
    user: "postgres",
    password: "STUDENT",
    host: "localhost",
    port: 5432,
    database: "Garden"
})


const secret = "jkgfd9849j9Ht98hd(&f0ksd78y)J()0sdy8fkj0g82-0949uJ"
const expire = "24h"

// POST /login
async function Login(req, res) {
    const body = await getPostData(req)

    console.log(body)

    const user = JSON.parse(body)

    console.log(user.email)
    console.log(user.password)

    pool.query(`SELECT * FROM users WHERE email=$1`, [user.email], async (err, result) => {
        try {
            const data = result.rows
            let done = 0;
            console.log(data)
            if(data[0]==null)
            {
               
                    res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
                    res.end(JSON.stringify({ message: 'Incorect email' }))
                
            }
            else{
            console.log(data[0].password)
            const valid = await bcrypt.compare(user.password, data[0].password);
            console.log(valid)

            if (done === 0)
                data.forEach(row => {

                    if (row.email === user.email && valid == true) {
                        console.log("ok")
                        done = 1
                        let payload = {
                            id: row.id,
                            name: row.name,
                            points: row.points,
                            admin: row.admin
                        }
                        const token = jwt.sign(payload, secret, {
                            algorithm: "HS256",
                            expiresIn: expire,
                        })
                        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
                        res.end(JSON.stringify({ message: 'Authentication complete!', id: row.id, token: token }))
                    }
                })

            if (done === 0) {
                data.forEach(row => {

                    if (row.email === user.email) {

                        if (valid == false) {
                            res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
                            res.end(JSON.stringify({ message: 'Incorect password!' }))
                        }
                        done = 1;
                    }
                })
                if (done === 0) {
                    res.writeHead(401, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
                    res.end(JSON.stringify({ message: 'Incorect email!' }))
                }
            }

        }}
        catch (err) {
            console.log(err);

        }

    })
}

//Post Register
async function Register(req, res) {
    const body = await getPostData(req)

    console.log(body)

    const user = JSON.parse(body)

    console.log(user.name)
    console.log(user.email)
    console.log(user.password)
    console.log(user.repeatPassword)

    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(user.password, saltRounds);


    pool.query(`SELECT * FROM users`, (err, result) => {
        try {
            const data = result.rows
            console.log(data)
            let nameValide = 1
            let emailValide = 1
            const regx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!regx.test(user.email)) {
                res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
                res.end(JSON.stringify({ message: 'Email invalide!' }))
            }
            else {
                data.forEach(row => {
                    if (row.name === user.name)
                        nameValide = 0
                    if (row.email === user.email)
                        emailValide = 0
                })

                if (nameValide === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
                    res.end(JSON.stringify({ message: 'Name already taken!' }))
                }
                else
                    if (emailValide === 0) {
                        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
                        res.end(JSON.stringify({ message: 'Email already taken!' }))
                    }
                    else {
                        if (user.password == "") {
                            res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
                            res.end(JSON.stringify({ message: 'Password invalide' }))
                        }
                        else
                            if (user.password.length < 8) {

                                res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
                                res.end(JSON.stringify({ message: 'Your password must be at at least 8 characters long' }))
                            }
                            else if (user.password !== user.repeatPassword) {

                                res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
                                res.end(JSON.stringify({ message: 'Passwords are not the same' }))
                            }
                            else {

                                pool.query(`SELECT MAX(id) FROM users`, (err, result) => {
                                    if (err) { console.log(err); }
                                    const idUser = result.rows[0].max + 1

                                    pool.query(`INSERT INTO users(id,name,email,password,points,admin) VALUES ($1,$2,$3,$4,0,false)`, [idUser, user.name, user.email, encryptedPassword], (err, result) => {
                                        if (err) { console.log(err); }
                                        else {
                                            res.writeHead(201, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
                                            res.end(JSON.stringify({ message: 'Register completed!' }))
                                        }
                                    })
                                })
                            }
                    }
            }

        }
        catch (err) {
            console.log(err);
        }
    })
}

function getIdFromToken(req, res) {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, secret)

        return decoded.id

    } catch (error) {
        console.log(error)
    }
};

function checkIfUserIsAdmin(req, res) {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, secret)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ admin: decoded.admin }))

    } catch (error) {
        console.log(error)
    }
};

async function getNameUser(req, res) {
    if (checkAuthentication(req, res) === true)
        try {
            const token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, secret)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: decoded.name }))

        } catch (error) {
            console.log(error)
        }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Unauthorized!' }))
    }

}

async function checkIfUserIsAdmin(req, res) {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, secret)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ admin: decoded.admin }))

    } catch (error) {
        console.log(error)
    }
};

async function getNameUser(req, res) {
    if (checkAuthentication(req, res) === true)
        try {
            const token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, secret)

            pool.query(`SELECT name FROM users WHERE id=$1`, [decoded.id], (err, result) => {
                try {
                    const data = result.rows
                    res.writeHead(200, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ message: data[0].name }))
                }
                catch (error) {
                    console.log(error)
                }
            })

        } catch (error) {
            console.log(error)
        }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Unauthorized!' }))
    }

}

module.exports = { Login, Register, getIdFromToken, getNameUser, checkIfUserIsAdmin }