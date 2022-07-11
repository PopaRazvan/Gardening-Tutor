const { getPostData } = require('../utils')
const { Pool } = require('pg')

//const pool = new Pool({
 //   connectionString: process.env.DATABASE_URL,
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


async function addQuestionToCourse(req, res, idCourse) {
    const body = await getPostData(req)

    console.log(body)

    const question = JSON.parse(body)

    pool.query(`SELECT MAX(id) FROM questions`, (err, result) => {
        if (err) { console.log(err); }
        else {
            const idQuestion = result.rows[0].max + 1

            pool.query(`INSERT INTO questions(id,id_course,name,answer1,answer2,answer3,answer4,correct_answer,points) 
                    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
                [idQuestion, idCourse, question.name, question.answer1, question.answer2, question.answer3, question.answer4, question.correctAnswer, question.points], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.writeHead(201, { 'Content-Type': 'application/json' })
                        res.end(JSON.stringify({ message: 'Question was added!' }))
                    }
                })
        }
    })

}

async function getQuestionsFromCourse(req, res, idCourse) {
    pool.query(`SELECT name,answer1,answer2,answer3,answer4,correct_answer,points from questions where id_course=$1`, [idCourse], (err, result) => {
        try {
            let questions = result.rows
            let index = 1
            questions.forEach(question => {
                question.number = index
                index++
            })
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(questions))
        } catch (err) { console.log(err) }
    }
    )
}

module.exports = {
    addQuestionToCourse,
    getQuestionsFromCourse
}