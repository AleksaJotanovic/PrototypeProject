const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pdf = require("html-pdf");
const mySql = require("mysql");
const nodemailer = require("nodemailer");

//npm install express body-parser cors html-pdf nodemailer

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mySql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'moja_sqlNo1sifra',
  database: 'prototypedb'
});


// Creating the POST request.
app.post("/api/students/add", (req, res) => {
  let details = {
    name: req.body.name,
    course: req.body.course,
    fee: req.body.fee
  };
  let sql = "INSERT INTO students SET ?";
  db.query(sql, details, (error) => {
    if (error) {
      res.send({ status: false, message: "Student creating failed! :(" });
    } else {
      res.send({ status: true, message: "Student created successfully! :D" });
    }
  });
});

// Viewing the records.
app.get("/api/students", (req, res) => {
  let sql = "SELECT * FROM students";
  db.query(sql, (error, result) => {
    if (error) {
      console.log("Error connecting to DB! :(")
    } else {
      res.send({ status: true, data: result });
    }
  });
});

// Search the records.
app.get("/api/students/:id", (req, res) => {
  let studentId = req.params.id;
  let sql = `SELECT * FROM students WHERE id=${studentId}`;
  db.query(sql, (error, result) => {
    if (error) {
      console.log("Error connecting to DB! :(");
    } else {
      res.send({ status: true, data: result });
    }
  });
});

// Update the records.
app.put("/api/students/update/:id", (req, res) => {
  let sql = `UPDATE students SET name='${req.body.name}', course='${req.body.course}',fee='${req.body.fee}' WHERE id=${req.params.id}`;
  let a = db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, message: "Student updating failed! :(" });
    } else {
      res.send({ status: true, message: "Student updated successfully! :)" });
    }
  });
});

// Delete the record.
app.delete("/api/students/delete/:id", (req, res) => {
  let sql = `DELETE FROM students WHERE id=${req.params.id}`;
  let query = db.query(sql, (error) => {
    if (error) {
      res.send({ status: false, message: "Student deleting failed :(" });
    } else {
      res.send({ status: true, message: "Student deleted successfully! :)" });
    }
  });
});

app.post('/send-email', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const price = req.body.price;
  const quantity = req.body.quantity;
  const date = req.body.date;

  const options = { height: '11.25in', width: '8.5in', header: { height: '20mm' }, footer: { height: '20mm' } };
  const html = `
  <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Frontend</title>
        <base href="/">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
          .btn-pdf{
            background-color: blue;
            color: white;
            border: none;
            width: 100px;
            height: 50px;
          }
          .bordered{
            background-color: lightblue;
            color: white;
            width: 80%;
            height: 30%;
            border: 1px solid black;
          }
          .container{
            line-height: 30px;
            background-color: gray;
            color: blue;
          }
        </style>
      </head>
      <body>
        <div>
          <h1>THIS IS MY PDF FILE</h1>
          <p>This is the dummy content of this file.</p>
          <button type="button" class="btn-pdf">CLICK ME</button>
        </div>
        <div class="bordered">
          <p>From: ${name}</p>
          <p>${message}</p>
        </div>
        <div class="container">
          <h2Product Info></h2>
          <p>Price: $${price}</p>
          <p>Availability: ${quantity}</p>
          <p>Date published: ${date}</p>
        </div>
      </body>
    </html>  
  `;
  pdf.create(html, options).toFile('accounting.pdf', (err, data) => {
    if (err) {
      console.log('Node error in pdf.create(): ', err);
    } else {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'jotanovicaleksa@gmail.com', // Replace with your email address
          pass: 'uuafbvdfsqqemzgq' // Replace with your email password(Koristi se App password: moze se podesiti u podesavanjima google account-a.)
        }
      });

      const mailOptions = {
        from: 'jotanovicaleksa@gmail.com',
        to: email && email, // Replace with recipient email address
        subject: 'New Contact Form Submission',
        html: html,
        attachments: [{
          path: data.filename,
          filename: 'accounting.pdf'
        }]
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send('Error sending email');
        } else {
          console.log('sent: ', info.response);
          res.status(200).send('successfully');
        }
      });
    }
  });

});

// Establishing the Port.
app.listen(8085, (error) => {
  if (error) {
    console.log("Error....!!!");
  } else {
    console.log("Started....!!!!");
  }
});