
const http = require('http')

const app = require('./app')


const server = http.createServer((req, res) => {
    
        app.handleRequest(req, res)
})

const PORT = process.env.PORT || '8000'
server.listen(PORT, () => console.log(`Server running at port ${PORT}`))