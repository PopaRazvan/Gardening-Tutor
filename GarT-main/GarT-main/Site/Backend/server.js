const { Client } = require('pg')
const client = new Client({
    user: "feqvtbjpzcbizd",
    password: "321d6c8cb05f915eb2f2a7fde6832720628aefa27100c7b6357b91579c2a651d",
    host: "ec2-54-75-184-144.eu-west-1.compute.amazonaws.com",
    port: 5432,
    database: "d5mqql84iqkdpu"
})
/*
const client = new Client({
    user: "postgres",
    password: "STUDENT",
    host: "localhost",
    port: 5432,
    database: "Garden"
})
*/
const http = require('http')

const { Login, Register, getIdFromToken,getNameUser,checkIfUserIsAdmin } = require('./Controllers/AuthenticationController')
const { getAllCourses,getFinishedCourses, deleteCourse,addCourse, getCourse, getContinueCourses,getContinueCourse,updateUserCourseDone, updateProgressCourse, startNewCourse,updateUserPoints } = require('./Controllers/CoursesController')
const { getAllUsers,changeEmail,changeName,sendMessage,getMessages } = require('./Controllers/UsersControllers')
const { addQuestionToCourse, getQuestionsFromCourse } = require('./Controllers/QuestionController')
const { checkAuthentication } = require('./Middleware/checkAuth')
const { buildRss } = require('./RSSFeed/rssCreate')

const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
    }

    //Login
    if (req.url === '/api/login' && req.method === 'POST') {
        Login(req, res)
    }
    else if (req.url === '/api/register' && req.method === 'POST') {
        Register(req, res)
    }
    else if (req.url === '/api/verifyToken' && req.method === 'POST') {
        if(checkAuthentication(req,res)===true)
        {
            res.writeHead(200, {  'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'You are logged in!' }))
        }
        else{
            res.writeHead(401, {  'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'You are not logged in!'}))
        }
    }
    else if (req.url.match(/\/api\/user\/course\/[0-9]+/) && req.method === 'POST') {
        const idCourse = req.url.split('/')[4]
        console.log(idCourse)
        const idUser = getIdFromToken(req, res)
        startNewCourse(req, res, idCourse, idUser)
    }
    else if (req.url.match(/\/api\/user\/course_progress\/[0-9]+/) && req.method === 'PUT') {

        const idCourse = req.url.split('/')[4]
        console.log(idCourse)
        const idUser = getIdFromToken(req, res)
        updateProgressCourse(req, res, idCourse, idUser)
    }
    else if (req.url.match(/\/api\/user\/course_done\/[0-9]+/) && req.method === 'PUT') {
        const idCourse = req.url.split('/')[4]
        console.log(idCourse)
        const idUser = getIdFromToken(req, res)
        updateUserCourseDone(req, res, idCourse, idUser)
    }
    else if (req.url.match(/\/api\/course\/[0-9]+\/question/) && req.method === 'POST') {
        const idCourse = req.url.split('/')[3]
        console.log(idCourse)
        addQuestionToCourse(req, res, idCourse)
    }
    else if (req.url.match(/\/api\/course\/[0-9]+\/questions/) && req.method === 'GET') {
        const idCourse = req.url.split('/')[3]
        console.log(idCourse)
        getQuestionsFromCourse(req, res, idCourse)
    }
    else if (req.url.match('/api/user/points') && req.method === 'PUT') {
        const idUser = getIdFromToken(req, res)
        updateUserPoints(req,res,idUser)
    }
    else if (req.url === '/api/courses' && req.method === 'GET') {
        getAllCourses(req, res)
    }
    else if (req.url === '/api/course' && req.method === 'POST') {
        addCourse(req, res)
    }
    else if (req.url.match(/\/api\/course\/\w+/) && req.method === 'GET') {
        const idCourse = req.url.split('/')[3]
        console.log(idCourse)
        getCourse(req, res, idCourse)
    }
    else if (req.url.match(/\/api\/course\/\w+/) && req.method === 'DELETE') {
        const idCourse = req.url.split('/')[3]
        console.log(idCourse)
        deleteCourse(req, res, idCourse)
    }
     else if (req.url.match('/api/user/courses/done') && req.method === 'GET') {
        const idUser = getIdFromToken(req, res)
        getFinishedCourses(req, res, idUser)
    }
    else if (req.url.match('/api/user/courses') && req.method === 'GET') {
        const idUser = getIdFromToken(req, res)
        getContinueCourses(req, res, idUser)
    }
    else if (req.url.match(/\/api\/user\/course\/\w+/) && req.method === 'GET') {
        const idUser = getIdFromToken(req, res)
        const idCourse = req.url.split('/')[4]
        getContinueCourse(req, res, idUser,idCourse)
    }
    else if (req.url === '/api/users' && req.method === 'GET') {
        getAllUsers(req, res)
    }
    else if (req.url === '/api/user/name' && req.method === 'GET') {
        getNameUser(req, res)
    }
    else if (req.url === '/api/user/admin' && req.method === 'GET') {
        checkIfUserIsAdmin(req, res)
    }
    else if (req.url === '/api/rss' && req.method === 'GET') {
        buildRss(req,res)
    }
    else if (req.url.match('/api/user/name') && req.method === 'PUT') {
        const idUser = getIdFromToken(req, res)
        changeName(req,res,idUser)
    }
    else if (req.url.match('/api/user/email') && req.method === 'PUT') {
        const idUser = getIdFromToken(req, res)
        changeEmail(req,res,idUser)
    }
    else if (req.url.match('/api/user/message') && req.method === 'POST') {
        const idUser = getIdFromToken(req, res)
        sendMessage(req,res,idUser)
    }
    else if (req.url.match('/api/messages') && req.method === 'GET') {
        getMessages(req,res)
    }
})

const PORT = process.env.PORT || '5000'
server.listen(PORT, () => console.log(`Server running at port ${PORT}`))


