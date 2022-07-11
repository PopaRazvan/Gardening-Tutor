const fs = require('fs');
const RSS = require('rss');
const { Pool } = require('pg')

//const pool = new Pool({
//    connectionString: process.env.DATABASE_URL,
//   ssl: {
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


async function buildRss(req, res) {


    pool.query(`SELECT name,points FROM users WHERE admin=false ORDER BY points DESC`, (err, result) => {
        try {
            let users = result.rows
            console.log(users)

            const articles = []
            users.forEach(user => {
                custom_elements=[{points:user.points}]
                const element = { title: user.name, custom_elements:custom_elements }
                articles.push(element)
            })

            let blog = {
                title: 'Users',
                description: 'The score board whit all the users.',
                author: 'GarT',
                articles: articles
            };

            let feed = new RSS({
                title: blog.title,
                description: blog.description,
                author: blog.author
            });
            

            blog.articles.forEach(articles => {
                console.log(articles)
                feed.item(articles);
            })


            const xml = feed.xml({ indent: true });
            fs.writeFileSync('feed.xml', xml);

            try {
                fs.readFile('feed.xml', function (err, data) {
                    if (err) throw err;
                    res.writeHead(200, { 'Content-Type': 'text/xml' });
                    res.end(data.toString());
                });
            } catch (error) {
                console.log(error);
            }
        }
        catch (err) { console.log(err); }
    })


}

module.exports = {
    buildRss
}