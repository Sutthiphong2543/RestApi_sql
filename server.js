let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// hompage route 

app.get('/', (req, res) => {
    return res.send({ 
        error: false,
        message: 'welcome to RestFull api crude widt node js',
        written_by:'Sutthiphong',
        published_on:"https://www.facebook.com/profile.php?id=100006417041539"
    

    
    })
})

// connection to database
let dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'nodejs_api'
})

dbCon.connect()

// retrieve all books
app.get('/books', (req, res) => {
    dbCon.query('SELECT * FROM books',(error, results, fields) =>{
        if(error) throw error;

        let message = ""
        if(results === undefined || results.length === 0){
            message = "Books table is empty";
        } else {
            message = "Successfully retrieved books";
        }
        return res.send({ error: false, data: results, message: message});
    })
});

//  add a new book
app.post('/addBook', (req, res) => {
    let name = req.body.name;
    let author = req.body.author;

    // validate 
    if(!name ||  !author) {
        return res.status(400).send({ error: true, message:"Please provide book name and author."});
    } else {
        dbCon.query('INSERT INTO books (name, author) VALUES (?, ?)', [name, author],(error, results, fields) => {
            if(error) throw error;
            return res.send({ error: false , data: results, message: 'Add book successfully added'})
        })
    }
});

// retrieve book by id 
app.get('/books/:id', (req, res) => {
    let id = req.params.id;

    if( !id){
        return res.status(400).send({ error: true, message: "Please provide book id" });
    }else [
        dbCon.query("SELECT * FROM books WHERE id = ?",[id],(error, results, fields) =>{
            if( error ) throw error;

            let message = "";
            if(message === undefined || message.length == 0){
                message = " Book not found";
            }else {
                message = "Successfully retrieved book data";
            }
            return res.send({message: false, data: results[0], message: message});

        })
    ]
})

// update
app.put('/update', (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let author = req.body.author;

    // validate 
    if(!id || !name ||  !author) {
        return res.status(400).send({ error: true, message:"Please provide book name and author."});
    } else {
        dbCon.query("UPDATE books SET name = ? , author = ? WHERE id = ?",[name, author, id], (error, results, fields) =>{
            if( error) throw error;

            let message = "";
            if(results.changedRows == 0) {
                message = " Book not found or data are same";
            } else {
                message = " Book successfully updated";
            }

            return res.send({ error: false, data: results, message: message });
        })
    }
})

// Delete 
app.delete('/delete', (req, res) => {
    let id = req.body.id;
    
    if(!id) {
        return res.status(400).send({ error: false, message: " Please provide  book id"});
    } else {
        dbCon.query("DELETE FROM books WHERE id = ?" ,[id],( error, results, fields)=>{
            if(error) throw error;

            let message = "";
            if(results.affectedRows === 0){
                message = " Book not found";
            } else {
                message = " Book successfully deleted";
            }
            return res.send({ error: false, data: results, message: message });
        })
    }
})



app.listen(3000, ()=>{
    console.log('Node App is running on port 3000')
})

module.exports = app;