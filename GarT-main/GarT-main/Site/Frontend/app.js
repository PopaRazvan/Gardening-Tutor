let url = require("url");
let fs = require("fs");
let Path = require("path");
var cookie = require('cookie');

const { validateToken, checkIfUserIsAdmin } = require('./Authorization')

function renderHtml(path, response) {
    fs.readFile(path,
        null,
        function (error, data) {
            if (error) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.writeHead(404);
                response.write("Page not found or route not defined.");
            } else {
                response.writeHead(200, { "Content-Type": "text/html" });
                response.write(data);
            }
            response.end();
        });
}


async function handleRequest(request, response) {

    var cookies = cookie.parse(request.headers.cookie || '');
    let token = cookies.username_form


    let path = request.url;
    let ext = Path.extname(path);
    var contentType;


    switch (ext) {
        case ".html":
            contentType = "text/html";
            break;

        case ".css":
            contentType = "text/css";
            break;
        case ".js":
            contentType = "text/javascript";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".jpg":
            contentType = "image/png";
            break;
        case ".jpeg":
            contentType = "image/jpeg";
            break;
        case ".ico":
            contentType = "image/x-icon";
            break;
        default: contentType = "0";
            break;
    }

  
    // response.writeHead(200, { 'Content-Type': contentType });


    if (path == "/")
        renderHtml("./landing.html", response);

    else if (path == "/login")
        renderHtml("./login.html", response);

    else if (path == "/register")
        renderHtml("./register.html", response);

    else if (path == "/home") {
        if (await validateToken(token) == false)
            renderHtml("./login.html", response);
        else if (await checkIfUserIsAdmin(token) == true)
            renderHtml("./admin.html", response);
        else
            renderHtml("./home.html", response);
    }
    else if (path == "/profile") {
        if (await validateToken(token) == false)
            renderHtml("./landing.html", response);
        else if (await checkIfUserIsAdmin(token) == true)
            renderHtml("./admin.html", response);
        else
            renderHtml("./profile.html", response);

    }
    else if (path.match(/\/course\?id=[0-9]+/)) {
        let id = path.split('=')[1]
       
        let setCookie = cookie.serialize('course_id', id, {
            maxAge: 60 * 60 * 24 // 1 day
        });
        response.setHeader('Set-Cookie', setCookie)

        if (await validateToken(token) == false)
            renderHtml("./landing.html", response);
        else if (await checkIfUserIsAdmin(token) == true)
            renderHtml("./admin.html", response);
        else
            renderHtml("./curs.html", response);
    }
    else if (path == "/admin") {
        if (await validateToken(token) == false)
            renderHtml("./landing.html", response);
        else if (await checkIfUserIsAdmin(token) == true)
            renderHtml("./admin.html", response);
        else
            renderHtml("./landing.html", response);
    }
    else if (path == "/raport") {
        renderHtml("./raport.html", response);
    }
    else {
        
        fs.readFile("." + path,
            null,
            function (error, data) {
                if (error) {
                    response.writeHead(500, { "Content-Type": "text/plain" });
                    response.writeHead(404);
                    
                    response.write("Page not found or route not defined.");
                } else {
                    response.writeHead(200, { "Content-Type": contentType });
                    response.write(data);
                }
                response.end();
            });
        //response.end();
    }
}

module.exports = {
    handleRequest
};