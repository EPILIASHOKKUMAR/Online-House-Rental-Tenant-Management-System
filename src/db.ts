
import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "house_rental"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});
