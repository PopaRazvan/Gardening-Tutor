
const { Pool } = require('pg')
const { getPostData } = require('../utils')

/*
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
}})
*/


const pool = new Pool({
    user: "postgres",
    password: "STUDENT",
    host: "localhost",
    port: 5432,
    database: "Garden"
})


async function getAllUsers(req, res) {
    pool.query(`SELECT name,points FROM users WHERE admin=false ORDER BY points DESC`, (err, result) => {
        try {
            const data = result.rows
            console.log(data)
            if (!data) {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Users not found!' }))
            }
            else {
                res.writeHead(202, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(data))
            }
        }
        catch (err) { console.log(err); }
    })
}

async function changeEmail(req, res, idUser) {

    const body = await getPostData(req)
    const user = JSON.parse(body)
    console.log(user.email)
    const regx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (regx.test(user.email))
        pool.query(`UPDATE users SET email=$1 WHERE id=$2`, [user.email, idUser], (err, result) => {
            if (err)
                console.log(err)
            else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Email updated!' }))
            }
        })
    else {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Email invalide!' }))
    }
}


async function changeName(req, res, idUser) {

    const body = await getPostData(req)

    const user = JSON.parse(body)

    console.log(user.name)



    pool.query(`UPDATE users SET name=$1 WHERE id=$2`, [user.name, idUser], (err, result) => {
        if (err)
            console.log(err)
        else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Name updated!' }))
        }
    })

}

async function sendMessage(req, res, idUser) {
    const body = await getPostData(req)

    const user = JSON.parse(body)

    console.log(user.message)

    pool.query(`SELECT name,email FROM users WHERE id=$1`, [idUser], (err, result) => {
        try {
            const data = result.rows
            let name = data[0].name
            let email = data[0].email

            pool.query(`SELECT MAX(id) from messages`, (err, result) => {
                if (err) { console.log(err); }
                const idMessage = result.rows[0].max + 1
    
                pool.query(`INSERT INTO messages(id,id_user,name,email,message) VALUES($1,$2,$3,$4,$5)`, [idMessage, idUser, name,email,user.message], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.writeHead(201, { 'Content-Type': 'application/json' })
                        res.end(JSON.stringify({ message: 'Message send!' }))
                    }
                })
            })
        }
        catch (err) { console.log(err); }
    })
}

async function getMessages(req, res) {
    pool.query(`SELECT name,email,message from messages`, (err, result) => {
        try {
            const messages = result.rows
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(messages))
        } catch (err) { console.log(err) }
    }
    )
}


module.exports = { getAllUsers, changeEmail, changeName,sendMessage,getMessages}