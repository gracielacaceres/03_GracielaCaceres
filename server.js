
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const connection = require("./configBD");


const app = express();
const path = require("path");


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'public')));





app.post("/procesar-formulario", async (req, res) => {
  console.log(req.body);
  // Verificar campos vacíos
  for (const campo in req.body) {
    if (!req.body[campo]) {
      res.send(`Error: El campo ${campo} está vacío.`);
      return;
    }
  }


  const { nombre_alumno, email_alumno, curso_alumno } = req.body;
  try {
 
    const query =
      "INSERT INTO estudiantes (nombre_alumno, email_alumno, curso_alumno, created_at) VALUES (?, ?, ?, ?)";
    await connection.execute(query, [
      nombre_alumno,
      email_alumno,
      curso_alumno,
      new Date(),
    ]);

    res.render("inicio", {
      rutaActual: "/",
    });

  } catch (error) {
    console.error("Error al insertar en la base de datos: ", error);
    console.log(error);
    res.send("Error al procesar el formulario");
  }
});

app.post("/procesar-formulario2", (req, res) => {
  console.log(req.body);
  const { nombre_alumno, email_alumno, curso_alumno } = req.body;
  try {
    const query =
      "INSERT INTO estudiantes (nombre_alumno, email_alumno, curso_alumno, created_at) VALUES (?, ?, ?,?)";
    connection.query(
      query,
      [nombre_alumno, email_alumno, curso_alumno, new Date()],
      (error, result) => {
        if (error) {
          console.error("Error al insertar en la base de datos: ", error);
          res.send("Error al procesar el formulario");
          return;
        }

        if (result && result.affectedRows > 0) {
          res.send("¡Formulario procesado correctamente!");
        } else {
          res.send("Error al procesar el formulario");
        }
      }
    );
  } catch (error) {
    console.error("Error al insertar en la base de datos: ", error);
    res.send("Error al procesar el formulario");
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
