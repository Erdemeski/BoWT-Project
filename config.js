const mysql = require("mysql2");

// MySQL bağlantısını oluşturma
const connection = mysql.createConnection({
    host: "localhost",
    user: "root", // MySQL kullanıcı adı
    password: "", // MySQL şifresi
    database: "bookdb" // Kullanılacak veritabanı
});

connection.connect((err) => {
    if (err) {
        console.log("Database cannot be connected", err);
        return;
    }
    console.log("Database connected Successfully");
});

function loginUser(name, password, callback) {
    const query = "SELECT * FROM users WHERE UserName = ? AND UserPassword = ?";

    connection.query(query, [name, password], (err, results) => {
        if (err) {
            console.error("Error executing query", err);
            callback(err, null);
            return;
        }

        if (results.length > 0) {
            console.log("User found:", results);
            callback(null, results[0]);
        } else {
            console.log("No user found with given credentials.");
            callback(null, null);
        }
    });
}

function addUser(name, password, callback) {
    const query = "INSERT INTO users (UserName, UserPassword) VALUES (?, ?)";

    connection.query(query, [name, password], (err, results) => {
        if (err) {
            console.error("Error executing query", err);
            callback(err, null);
            return;
        }

        console.log("User added successfully:", results);
        callback(null, results);
    });
}

module.exports = {loginUser, addUser};
