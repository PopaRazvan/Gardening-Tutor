const { getPostData } = require('../utils')
const { Pool } = require('pg')

//const pool = new Pool({
//    connectionString: process.env.DATABASE_URL,
//    ssl: {
 //       rejectUnauthorized: false
//   }
//})

const pool = new Pool({
    user: "postgres",
    password: "STUDENT",
    host: "localhost",
    port: 5432,
    database: "Garden"
})
async function getAllCourses(req, res) {
    pool.query(`SELECT id,name,url,points from courses`, (err, result) => {
        try {
            const courses = result.rows
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(courses))
        } catch (err) { console.log(err) }
    }
    )
}

async function addCourse(req, res) {
    const body = await getPostData(req)

    console.log(body)

    const course = JSON.parse(body)

    console.log(course.name)
    console.log(course.url)
    console.log(course.points)

    pool.query(`SELECT name from courses`, (err, result) => {
        try {
            const data = result.rows
            const nameValide = 1
            data.forEach(row => {
                if (row.name == course.name) {
                    res.writeHead(400, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ message: 'Name already taken!' }))
                    nameValide = 0
                }
            })
            if (nameValide === 1) {

                pool.query(`SELECT MAX(id) FROM courses`, (err, result) => {
                    if (err) { console.log(err); }
                    const idCourse = result.rows[0].max + 1

                    pool.query(`INSERT INTO courses(id,name,url,points) VALUES($1,$2,$3,$4)`,
                        [idCourse, course.name, course.url, course.points], (err, result) => {
                            if (err) { console.log(err); }
                            else {
                                res.writeHead(201, { 'Content-Type': 'application/json' })
                                res.end(JSON.stringify({ message: 'Course added!' }))
                            }
                        })
                })
            }


        } catch (err) { console.log(err) }
    }
    )
}

async function getCourse(req, res, idCourse) {
    pool.query(`SELECT * FROM courses WHERE id=$1`, [idCourse], (err, result) => {
        try {
            const data = result.rows[0]

            if (!data) {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Course not found!' }))
            }
            else {

                const { name, url, points } = data

                const course = {
                    name,
                    url,
                    points
                }

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(course))
            }
        } catch (err) {
            console.log(err)
        }
    })
}

async function deleteCourse(req, res, idCourse) {
    pool.query(`DELETE FROM courses WHERE id=$1`, [idCourse], (err, result) => {
        try {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Courses deleted!' }))

        } catch (err) {
            console.log(err)
        }
    })
}

async function getContinueCourses(req, res, idUser) {
    pool.query(`SELECT courses.id,courses.name,courses.url,courses.points,continue_course.done FROM courses
                JOIN continue_course ON continue_course.id_course=courses.id
                JOIN users ON users.id=continue_course.id_user
                WHERE users.id=$1 AND continue_course.done=false`, [idUser], (err, result) => {
        try {
            const data = result.rows
            console.log(data)
            if (!data) {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Courses not found!' }))
            }
            else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(data))
            }
        } catch (err) {
            console.log(err)
        }
    })
}

async function getContinueCourse(req, res, idUser, idCourse) {
    pool.query(`SELECT courses.id,courses.name,courses.url,courses.points,continue_course.done FROM courses
                JOIN continue_course ON continue_course.id_course=courses.id
                JOIN users ON users.id=continue_course.id_user
                WHERE users.id=$1 AND courses.id=$2`, [idUser, idCourse], (err, result) => {
        try {
            const data = result.rows
            console.log(data)
            if (!data) {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Course not found!' }))
            }
            else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(data))
            }
        } catch (err) {
            console.log(err)
        }
    })
}

async function getFinishedCourses(req, res, idUser) {
    pool.query(`SELECT courses.id,courses.name,courses.url,courses.points,continue_course.done FROM courses
    JOIN continue_course ON continue_course.id_course=courses.id
    JOIN users ON users.id=continue_course.id_user
    WHERE users.id=$1 AND continue_course.done=true`, [idUser], (err, result) => {
        try {
            const data = result.rows
            console.log(data)
            if (!data) {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Courses not found!' }))
            }
            else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(data))
            }
        } catch (err) {
            console.log(err)
        }
    })
}

async function startNewCourse(req, res, idCourse, idUser) {

    let ok = 1

    pool.query(`SELECT * from continue_course`, (err, result) => {
        try {
            const data = result.rows

            data.forEach(row => {
                if (idUser == row.id_user && idCourse == row.id_course && ok === 1) {
                    ok = 0
                    res.writeHead(400, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ message: 'User already started this course!' }))
                }
            })
        } catch (err) {
            console.log(err)
        }
    })

    if (ok === 1) {
        pool.query(`SELECT MAX(id) from continue_course`, (err, result) => {
            if (err) { console.log(err); }
            const idContinueCourse = result.rows[0].max + 1

            pool.query(`INSERT INTO continue_course(id,id_user,id_course,progress,done) VALUES($1,$2,$3,0,false)`, [idContinueCourse, idUser, idCourse], (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.writeHead(201, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ message: 'User started a new course!' }))
                }
            })
        })
    }
}

async function updateProgressCourse(req, res, idCourse, idUser) {

    const body = await getPostData(req)

    const course = JSON.parse(body)

    pool.query(`SELECT * FROM continue_course`, (err, result) => {

        if (err)
            console.log(err)
        else {
            let ok = 0
            const data = result.rows
            data.forEach(row => {
                if (idUser == row.id_user && idCourse == row.id_course) {
                    ok = 1
                }
            })

            if (ok === 1) {
                pool.query(`UPDATE continue_course SET progress=$1 WHERE id_user=$2 and id_Course=$3`, [course.progres, idUser, idCourse], (err, result) => {
                    if (err)
                        console.log(err)
                    else {
                        res.writeHead(200, { 'Content-Type': 'application/json' })
                        res.end(JSON.stringify({ message: 'Progress has been updated!' }))
                    }

                })
            }
            else {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'The User did not start this course!' }))
            }
        }
    })
}

async function updateUserPoints(req, res, idUser) {
    const body = await getPostData(req)

    const question = JSON.parse(body)
    pool.query(`UPDATE users SET points=points+$1 WHERE id=$2`, [question.points, idUser], (err, result) => {
        if (err)
            console.log(err)
        else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Points has been updated!' }))
        }

    })
}

async function updateUserCourseDone(req, res, idCourse, idUser,) {
    pool.query(`UPDATE continue_course SET done=true WHERE id_user=$1 AND id_course=$2`, [idUser, idCourse], (err, result) => {
        if (err)
            console.log(err)
        else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Points has been updated!' }))
        }

    })

}

module.exports = {
    getAllCourses,
    addCourse,
    getCourse,
    getContinueCourses,
    getContinueCourse,
    deleteCourse,
    updateProgressCourse,
    startNewCourse,
    updateUserCourseDone,
    updateUserPoints,
    getFinishedCourses,
}