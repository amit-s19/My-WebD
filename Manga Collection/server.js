// Main Server page for the Book System.

// Importing the different modules required.
const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

// Creating instances.
const app = express();
const mustache = mustacheExpress();


mustache.cache = null;

// Defining the directories for express and setting the engine.
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.engine('mustache', mustache);
app.set('view engine', 'mustache');

// Creating the Routes.
app.get('/manga',(req, res)=>{

    // Initialisnig the client.
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'manga',
        password: 'satan',
        port: 5432,
    });

    // Establishing connection.
    client.connect()
        .then(()=>{
            return client.query('SELECT * FROM  books')
        })
        .then((result)=>{
            console.log('results?', result);
            res.render('manga', result);
        });
});

app.get('/add', (req,res)=>{
    res.render('manga-form');
});

// Creating the page for posting the received res.
app.post('/manga/add', (req,res)=>{
    console.log('post body', req.body);
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'manga',
        password: 'satan',
        port: 5432,
    });
    client.connect()
        .then(()=>{
            console.log('Connection established!');
            const sql = 'INSERT INTO books(name, author, price) VALUES($1, $2, $3)'
            const params = [req.body.name, req.body.aname, req.body.price];
            return client.query(sql, params);
        })
        .then((result)=>{
            console.log('results?', result);
            res.redirect('/manga');
        });
});

app.post('/manga/delete/:id', (req, res)=>{

    // Initialisnig the client.
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'manga',
        password: 'satan',
        port: 5432,
    });

    // Establishing connection.
    client.connect()
        .then(()=>{
            const sql = 'DELETE FROM books WHERE bid = $1';
            const params = [req.params.id];
            return client.query(sql, params);
        })
        .then(()=>{
            res.redirect('/manga');
        });
});

app.get('/manga/edit/:id', (req, res)=>{
    // Initialisnig the client.
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'manga',
        password: 'satan',
        port: 5432,
    });

    // Establishing connection.
    client.connect()
        .then(()=>{
            const sql = 'SELECT * FROM books WHERE bid = $1'
            const params = [req.params.id];
            return client.query(sql, params);
        })
        .then((results)=>{
            res.render('manga-edit', {mnga:results.rows[0]});
        });
});

app.post('/manga/edit/:id', (req, res)=>{
    // Initialisnig the client.
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'manga',
        password: 'satan',
        port: 5432,
    });

    // Establishing connection.
    client.connect()
        .then(()=>{
            const sql = 'UPDATE books SET name=$1, author=$2, price=$3 WHERE bid=$4'
            const params = [req.body.name, req.body.author, req.body.price, req.params.id];
            return client.query(sql, params);
        })
        .then(()=>{
            res.redirect('/manga');
        });
});

// Creating the admin dashboard.
app.get('/dashboard', (req, res)=>{
    //Initialising the client.
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'manga',
        password: 'satan',
        port: 5432,
    });
    client.connect()
    .then(()=>{
        return client.query('SELECT SUM(price) FROM books; SELECT COUNT(name) FROM books');
    })
    .then((results)=>{
        console.log('?results', results[0]);
        console.log('?results', results[1]);
        res.render('dashboard', {n1:results[0].rows, n2:results[1].rows}); 
    })

});

// Creating the server to listen.
app.listen(5001, ()=>{
    console.log('Listening motherfucker');
});