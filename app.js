const express = require('express');
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2'); // mysql included.

app.use(bodyParser.json());
app.use(express.static('public'));


const db = mysql.createConnection({   // database connection.
    host: "localhost",
    user: "root",
    database: "bookdb"
})

db.connect((error) => {
    if (error) throw error;
    console.log("Connected.");
});

app.get("/boooks", (req, res) => {
    const sql = "SELECT * from Books";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    })
})

app.post('/addBook', (req, res) => {
    const newBook = req.body;

    // Tüm alanlar doldurulmuş mu kontrol et
    if (
        !newBook.Barcode ||
        !newBook.BName ||
        !newBook.Author ||
        !newBook.Price ||
        !newBook.OldPrice ||
        !newBook.BDescription ||
        !newBook.StarRate ||
        !newBook.ReviewCount ||
        !newBook.Stock ||
        !newBook.ImgSource ||
        !newBook.BType
    ) {
        return res.status(400).send('All fields are required.');
    }

    const query =
        'INSERT INTO books (Barcode, BName, Author, Price, OldPrice, BDescription, StarRate, ReviewCount, Stock, ImgSource, BType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
        newBook.Barcode,
        newBook.BName,
        newBook.Author,
        newBook.Price,
        newBook.OldPrice,
        newBook.BDescription,
        newBook.StarRate,
        newBook.ReviewCount,
        newBook.Stock,
        newBook.ImgSource,
        newBook.BType,
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error adding book');
        } else {
            res.status(201).json({ ...newBook });
        }
    });
});

app.get("/orders", (req, res) => {
    const sql = "SELECT * from Orders";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    })
})

app.get("/employers", (req, res) => {
    const sql = "SELECT * from Employers";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    })
})

app.get("/subs", (req, res) => {
    const sql = "SELECT * from Subscriptions";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    })
})

app.use(express.json());

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");


app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'admin.html'));
});


app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});


app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        //res.send('User already exists. Please choose a different username.');
        res.render("nosignup");
    } else {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPassword;

            //const userdata = await collection.insertMany(data);
            //console.log(userdata);
            await collection.insertMany(data);
            //res.send('User created successfully!');
            res.render("oklogin");
        } catch {
            console.error(error);
            res.status(500).send('An error occurred during user creation.');
        }

    }

});

app.use(express.static(path.join(__dirname, 'static')));

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            //res.send("User name cannot found")
            return res.render("nologin");
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.sendFile(path.join(__dirname, 'static', 'logged.html'));
        }
        else {
            //res.send("wrong Password");
            return res.render("nologin");
        }
    }
    catch (error) {
        //res.send("wrong Details");
        console.error(error);
        res.status(500).send('An error occurred during login.');
    }
});


const fs = require('fs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const booksFilePath = path.join(__dirname, './static/products.json');



// Kitapları oku
function readBooksFile() {
    return new Promise((resolve, reject) => {
        // Veritabanından kitapları seç
        connection.query('SELECT * FROM books', (err, results) => {
            if (err) {
                return reject(err); // Hata varsa reddet
            }
            resolve(results); // Verileri döndür
        });
    });
}

/* function readBooksFile() {
  const data = fs.readFileSync(booksFilePath);
  return JSON.parse(data);
} */

// Kitapları yaz
function writeBooksFile(books) {
    fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
}



// Tüm kitapları getir
app.get('/books', async (req, res) => {
    try {
        const books = await readBooksFile();
        res.json(books);
    } catch (error) {
        console.error("Hata: ", error.message)
        res.status(500).json({ error: "There's something wrong." })
    }
});

// Yeni kitap ekle
app.post('/books', (req, res) => {
    const newBook = req.body;
    const books = readBooksFile();
    newBook.id = books.length ? books[books.length - 1].id + 1 : 1;
    books.push(newBook);
    writeBooksFile(books);
    res.status(201).json(newBook);
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('The server is running on port 3000...');
});


