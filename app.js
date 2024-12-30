const express = require('express');
const path = require("path");
const connection = require("./config");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2'); // mysql included.

app.use(bodyParser.json());
app.use(express.static('public'));


const db = mysql.createConnection({   // database connection.
    host: "localhost",
    user: "root",
    password: "",
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
});

/* app.get('/books', (req, res) => {
    const query = `SELECT 
                    Barcode AS id,
                    BName AS name,
                    Author AS author,
                    BDescription AS description,
                    BType AS type,
                    StarRate AS starRate,
                    ReviewCount AS reviewCount,
                    Stock AS stock,
                    Price AS price,
                    OldPrice AS oldPrice,
                    ImgSource AS imgSource
                   FROM books`;

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});
 */

app.get("/books", (req, res) => {
    const { type } = req.query; // Filtre tipini alıyoruz
    let query = `
      SELECT 
        Barcode AS id,
        BName AS name,
        Author AS author,
        BDescription AS description,
        BType AS type,
        StarRate AS starRate,
        ReviewCount AS reviewCount,
        Stock AS stock,
        Price AS price,
        OldPrice AS oldPrice,
        ImgSource AS imgSource
      FROM books`;

    if (type && type !== "ALL") {
        query += ` WHERE BType = '${type}'`; // Eğer bir tür seçildiyse WHERE ekliyoruz
    }

    db.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching books:", error);
            return res.status(500).send("Error fetching books");
        }

        res.json(results); // Kitapları JSON olarak döndürüyoruz
    });
});

app.get("/books/types", (req, res) => {
    db.query("SELECT DISTINCT BType FROM books", (error, results) => {
        if (error) {
            console.error("Error fetching book types:", error);
            return res.status(500).send("Error fetching book types");
        }

        const types = results.map((row) => row.BType); // Türleri alıyoruz
        res.json(types); // Türleri JSON olarak döndürüyoruz
    });
});



// /checkSubscription/:UserId endpoint'i
app.get('/checkSubscription/:UserId', (req, res) => {
    const { UserId } = req.params;

    // Kullanıcının abonelik durumunu kontrol et
    const query = `SELECT * FROM subscriptions WHERE SubId = ?`;
    db.query(query, [UserId], (err, results) => {
        if (err) {
            console.error('Error while checking subscription:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Sonuçlara göre true (abonelik yok) veya false (abonelik var) döndür
        if (results.length === 0) {
            res.json(true); // Abonelik yok
        } else {
            res.json(false); // Abonelik var
        }
    });
});


// /addOrder endpoint'i
app.post('/addOrder', (req, res) => {
    const { Barcode, BName, UserId, UserName, OrderDate, DiscountCheck, OrderQuantity, TotalAmount } = req.body;

    // Gelen verilerin doğruluğunu kontrol et
    if (!Barcode || !BName || !UserId || !UserName || !OrderDate || DiscountCheck === undefined || !OrderQuantity || !TotalAmount) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Sipariş verilerini veritabanına ekle
    const query = `
      INSERT INTO orders (Barcode, BName, UserId, UserName, OrderDate, DiscountCheck, OrderQuantity, TotalAmount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [Barcode, BName, UserId, UserName, OrderDate, DiscountCheck, OrderQuantity, TotalAmount];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error while adding order:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({ message: 'Order added successfully', orderId: result.insertId });
    });
});



app.post('/addEmployee', (req, res) => {
    const newEmployee = req.body;

    // Tüm alanlar doldurulmuş mu kontrol et
    if (
        !newEmployee.EmployeeId ||
        !newEmployee.EmployeeName ||
        !newEmployee.EmployeeField
    ) {
        return res.status(400).send('All fields are required.');
    }

    const query =
        'INSERT INTO employees (EmployeeId, EmployeeName, EmployeeField) VALUES (?, ?, ?)';
    const values = [
        newEmployee.EmployeeId,
        newEmployee.EmployeeName,
        newEmployee.EmployeeField,
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error adding employee');
        } else {
            res.status(201).json({ ...newEmployee });
        }
    });
});


app.post('/addBook', (req, res) => {
    const newBook = req.body;

    // Tüm alanlar doldurulmuş mu kontrol et
    if (
        !newBook.Barcode ||
        !newBook.BName ||
        !newBook.Author ||
        !newBook.Price ||
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
        newBook.OldPrice || null,
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

/*  app.delete('/deletebook/:barcode', (req, res) => {
    const { barcode } = req.params;
    const query = 'DELETE FROM books WHERE Barcode = ?';
    db.query(query, [barcode], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ success: true });
    });
}); 
 */

app.delete('/deletebook/:barcode', (req, res) => {
    const { barcode } = req.params;
    console.log('Received barcode:', barcode);  // Bu satırı ekleyin
    const query = 'DELETE FROM books WHERE Barcode = ?';
    db.query(query, barcode, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ success: true });
    });
});


app.get("/orders", (req, res) => {
    const sql = "SELECT * from Orders";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    })
})

app.get("/employees", (req, res) => {
    const sql = "SELECT * from Employees";
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

app.get("/feedbacks", (req, res) => {
    const sql = "SELECT * from Contact";
    db.query(sql, (err, data) => {
        if (err) return res.json("Error");
        return res.json(data);
    })
})

app.post('/submitContact', (req, res) => {
    const { UserId, UserName, UserMessage, EmployeeId, MessageSubject } = req.body;

    const query = `INSERT INTO contact (UserId, UserName, UserMessage, EmployeeId, MessageSubject) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [UserId, UserName, UserMessage, EmployeeId, MessageSubject], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ success: true });
        console.log(results);
    });
});

app.post('/postSubscription', (req, res) => {
    const { SubId, SubName, DiscountRate, SubPeriod } = req.body;

    const query = `INSERT INTO subscriptions (SubId, SubName, DiscountRate, SubPeriod) VALUES (?, ?, ?, ?)`;
    db.query(query, [SubId, SubName, DiscountRate, SubPeriod], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ success: true });
        console.log(results);
    });
});


app.get("/getCurrentUserId", (req, res) => {
    const sql = "SELECT UserId, UserName FROM currentUsers LIMIT 1";
    db.query(sql, (err, data) => {
        if (err) return res.json({ error: "Error" });
        if (data.length === 0) {
            return res.json({ error: "No user found" });
        }
        return res.json(data[0]);
    });
});

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


/* app.post("/signup", async (req, res) => {

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
*/
const { addUser } = require("./config");

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password,
    }
    const query = "SELECT * FROM users WHERE UserName = ?"
    // Veritabanında mevcut kullanıcıyı kontrol etme
    db.query(query, [data.name], async (err, results) => {
        if (err) {
            console.error("Error checking user existence", err);
            res.status(500).send('An error occurred while checking the user.');
            return;
        }

        if (results.length > 0) {
            // Kullanıcı zaten var
            res.render("nosignup");
        } else {
            try {
                addUser(data.name, data.password, (err, result) => {
                    if (err) {
                        console.error("Error creating user", err);
                        res.status(500).send('An error occurred during user creation.');
                    } else {
                        res.render("oklogin"); // Kullanıcı başarıyla oluşturuldu
                    }
                });

            } catch (error) {
                console.error(error);
                res.status(500).send('An error occurred during user creation.');
            }
        }
    });
});

app.use(express.static(path.join(__dirname, 'static')));

const { loginUser } = require('./config');

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    loginUser(username, password, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).send("An error occurred during login.");
        }

        if (!user) {
            // Kullanıcı adı bulunamadığında
            return res.render("nologin");
        }

        const userid = user.UserId;

        const querylogout = 'DELETE FROM currentusers';

        db.query(querylogout, (err, result) => {
            if (err) {
                console.error("Error deleting current users:", err);
                return res.status(500).send("An error occurred while logging out.");
            }

            console.log("All rows successfully deleted from currentusers table.");
        });

        const query = 'INSERT INTO currentusers (UserId, UserName, UserPassword) VALUES (? ,?, ?)';
        db.query(query, [userid, username, password], (err) => {
            if (err) {
                console.error("Database insertion error:", err);
                return res.status(500).send("An error occurred while saving the user data.");
            };

            console.log("User data successfully saved to currentusers table.");
            res.sendFile(path.join(__dirname, "static", "logged.html"));
        });

    });
});




/* app.post("/logout", (req, res) => {
    const query = 'DELETE FROM currentusers';

    db.query(query, (err, result) => {
        if (err) {
            console.error("Error deleting current users:", err);
            return res.status(500).send("An error occurred while logging out.");
        }

        console.log("All rows successfully deleted from currentusers table.");
    });
});
 */
/* app.post("/login", async (req, res) => {
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
*/



/* 
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

 function readBooksFile() {
  const data = fs.readFileSync(booksFilePath);
  return JSON.parse(data);
} 

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
 */


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('The server is running on port 3000...');
});


