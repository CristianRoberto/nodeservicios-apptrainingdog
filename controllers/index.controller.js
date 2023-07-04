const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { DB_HOST } = require('../config.js');
const { DB_USER } = require('../config.js');
const { DB_PASSWORD } = require('../config.js');
const { DB_NAME } = require('../config.js');
const { DB_PORT } = require('../config.js');

//creo clientePool y me conecto a la base de datos postgrets
const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false

});


const defectoUsers = async (req, res) => {
    res.send('Este es el metodo get por defecto!');
};

const login = async (req, res) => {
//console.log("login");
const usuario= (req.query.usuario);
const password=(req.query.password);
console.log(usuario);
console.log(password);
const response = await pool.query('SELECT * FROM users WHERE correoelectronico = $1 and password = $2 ',[usuario, password]);
res.status(200).json(response.rows);
console.log(response.rows);

}


const getUsers = async (req, res) => {
const response = await pool.query('SELECT * FROM users ORDER BY id ASC');
res.status(200).json(response.rows);
console.log(response.rows);
};

const getUserById = async (req, res) => {
const id = parseInt(req.params.id);
const response = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
res.json(response.rows);
};


//ruta para crear un nuevo usuario y guardarlo en la base de datos.
const createUser = async (req, res) => {
const {cedula,correoelectronico, nombre, apellidos, direccion, telefono, password,foto } = req.body;
const response = await pool.query('INSERT INTO users ( cedula, correoelectronico, nombre, apellidos, direccion, telefono, password, foto ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [cedula, correoelectronico, nombre, apellidos, direccion, telefono, password, foto]);
//res.json(response.rows);
//console.log(response);
res.json({
   message: 'Se creo un nuevo usuario',
    body: {
      user: {cedula, correoelectronico, nombre, apellidos, direccion, telefono, password, foto}
    }
})
console.log("se creo el nuevo usuario en la base de datos");
};





const recuperarContraseña = async (req, res) => {
const { correoelectronico } = req.body;

// Verificar que el correo electrónico exista en la base de datos
const query = 'SELECT * FROM users WHERE correoelectronico = $1';
const values = [correoelectronico];
const result = await pool.query(query, values);

if (result.rows.length === 0) {
  // Si el correo electrónico no existe, devolver un error 404
  return res.status(404).json({ error: 'El correo electrónico no se encuentra registrado' });
}

// Generar un token único y temporal para el enlace de recuperación de contraseña
const token = jwt.sign({ correoelectronico }, 'mi-secreto', { expiresIn: '1h' });

// Configurar el transporte de correo electrónico con nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ssistems26@gmail.com',
    pass: 'kacbaeeznwuwimfb'
  }
});

// Configurar el mensaje de correo electrónico
const mensaje = {
  from: 'ssistems26@gmail.com',
  to: correoelectronico,
  subject: 'Recuperación de contraseña',
  text: `Hola Estimado Usuario bienvenido,\n\nHaz clic en el siguiente enlace para restablecer tu contraseña:\n\n http://localhost:8100/restablecer/${token}`
};

// Enviar el correo electrónico
try {
    await transporter.sendMail(mensaje);
    res.status(200).json({ mensaje: 'Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al enviar el correo electrónico' });
  }
};



const updateUser = async (req, res) => {
const id = parseInt(req.params.id);
const {cedula, correoelectronico, nombre,apellidos, direccion, telefono, password, foto } = req.body;
const response = await pool.query('UPDATE users SET id = $1, cedula = $2, correoelectronico = $3, nombre = $4, apellidos = $5, direccion = $6 , telefono = $7, password = $8, foto = $9 WHERE id = $1', [
    id,
    cedula,
    correoelectronico, 
    nombre,
    apellidos, 
    direccion, 
    telefono,   
    password, 
    foto,
]);
res.json({
    message: 'Se  modifico el usuario',
     body: {
       user: {cedula, correoelectronico, nombre, apellidos, direccion, telefono, password, foto}
     }
 })
};

const deleteUser = async (req, res) => {
const id = parseInt(req.params.id);
await pool.query('DELETE FROM users where id = $1', [
    id
]);
res.json(`Usuario ${id} eliminado Correctamente`);
};

//ControlerMascotas
const getMascotas = async (req, res) => {
const response = await pool.query('SELECT * FROM mascotas ORDER BY id ASC');
res.status(200).json(response.rows);
console.log(response.rows);     
};

const getMascotasById = async (req, res) => {
const id = parseInt(req.params.id);
const response = await pool.query('SELECT * FROM mascotas WHERE id = $1', [id]);
res.json(response.rows);
};

const createMascotas = async (req, res) => {
const { foto, nombreraza, color, edad, estatura, vacunas, descripcion, sexo } = req.body;
const response = await pool.query('INSERT INTO mascotas ( foto, nombreraza, color, edad, estatura, vacunas, descripcion, sexo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [  foto, nombreraza, color, edad, estatura, vacunas, descripcion , sexo ]);
//res.json(response.rows);
res.json({
   message: 'Se registro mascota',
    body: {
      user: { foto, nombreraza, color, edad, estatura, vacunas, descripcion, sexo }
    }
})
console.log("se guardo la mascota");
};

const updateMascotas = async (req, res) => {
const id = parseInt(req.params.id);
const { foto, nombreraza, color, edad, estatura, vacunas, descripcion} = req.body;
const response =await pool.query('UPDATE mascotas SET id = $1, foto = $2, nombreraza = $3, color = $4, edad = $5, estatura = $6 , vacunas = $7, descripcion = $8 WHERE id = $1', [
    id,
    foto,
    nombreraza,
    color,
    edad,
    estatura,
    vacunas,
    descripcion       
]);
res.json('Se actualizaron correctamente los datos');
};

const deleteMascotas = async (req, res) => {
const id = parseInt(req.params.id);
await pool.query('DELETE FROM mascotas where id = $1', [
    id
]);
res.json(`Mascota ${id} eliminado Correctamente`);
};


//ControlersAdopciones
const getAdopcion = async (req, res) => {
const response = await pool.query('SELECT * FROM adopcion');
res.status(200).json(response.rows);
console.log(response.rows);     
};



const getAdopcionById = async (req, res) => {
const idcedula = parseInt(req.params.idcedula);
const response = await pool.query('SELECT * FROM adopcion WHERE idcedula = $1', [idcedula]);
res.json(response.rows);
};


const createAdopciones = async (req, res) => {
const { foto, idcedula,idmascota,nombreusuario,apellidousuario, fecharetiro, pass } = req.body;
const response = await pool.query('INSERT INTO adopcion (foto, idcedula,idmascota,nombreusuario,apellidousuario, fecharetiro, pass) VALUES ($1, $2, $3, $4, $5, $6, $7)', [ 
    foto, idcedula,idmascota,nombreusuario,apellidousuario, fecharetiro, pass ]);
//res.json(response.rows);
res.json({
   message: 'Adopcion Exitosa',
    body: {
      user: {foto, idcedula,idmascota,nombreusuario,apellidousuario, fecharetiro, pass}
    }
})
console.log("se Realizo correctamente su Adopcion");
};

const deleteAdopciones = async (req, res) => {
const idadopcion = parseInt(req.params.idadopcion);
await pool.query('DELETE FROM adopcion where idadopcion = $1', [
    idadopcion
]);
res.json(`Mascota ${idadopcion} eliminado Correctamente`);
};


const updateAdopciones = async (req, res) => {
const idadopcion = parseInt(req.params.id);
const {idcedula, idmascota, nombreusuario,apellidousuario, fecharetiro, password } = req.body;
const response = await pool.query('UPDATE adopcion SET idadopcion = $1, idcedula = $2, idmascota = $3, nombreusuario = $4, apellidousuario = $5, fecharetiro = $6 , password = $7  WHERE idadopcion = $1', [
    idadopcion,
    idcedula, 
    idmascota, 
    nombreusuario,
    apellidousuario, 
    fecharetiro, 
    password
]);
res.json({
    message: 'Se  modifico el usuario',
     body: {
       user: {idcedula, idmascota, nombreusuario,apellidousuario, fecharetiro, password}
     }
 })
};


//ControlersAdiestramientos
const getAdiestramiento = async (req, res) => {
try {
  const response = await pool.query('SELECT id, foto, detalle, titulo, extra, encode(video, \'base64\') AS video_base64 FROM adiestramientos');

  const adiestramientos = response.rows.map(row => {

    return {
      id: row.id,
      foto: row.foto,
      detalle: row.detalle,
      titulo: row.titulo,
      extra: row.extra,
      video: row.video_base64 ? Buffer.from(row.video_base64, 'base64') : null
    };
  });
  res.status(200).json(adiestramientos);
} catch (error) {
  console.error(error);
  res.status(500).send('Error al obtener los adiestramientos');
}
};

const createAdiestramientos = async (req, res) => {
const { foto, detalle, titulo, extra, video } = req.body;
const response = await pool.query('INSERT INTO adiestramientos (foto, detalle, titulo, extra, video) VALUES ($1,$2,$3,$4,$5)', [ foto, detalle, titulo, extra, video ]);
//res.json(response.rows);
res.json({
   message: 'Se Agrego el Nuevo Tips de Adiestramiento',
    body: {
      user: { foto, detalle, titulo, extra, video }
    }
})
console.log("se guardo nuevo TipsAdiestramiento Canino");
};

const updateAdiestramientos = async (req, res) => {
const id = parseInt(req.params.id);
const { foto, nombreraza, color, edad, estatura, vacunas, descripcion} = req.body;
const response =await pool.query('UPDATE mascotas SET id = $1, foto = $2, nombreraza = $3, color = $4, edad = $5, estatura = $6 , vacunas = $7, descripcion = $8 WHERE id = $1', [
    id,
    foto,
    nombreraza,
    color,
    edad,
    estatura,
    vacunas,
    descripcion       
]);
res.json('Se actualizaron correctamente los datos');
};

const deleteAdiestramientos = async (req, res) => {
const id = parseInt(req.params.id);
await pool.query('DELETE FROM adiestramientos where id = $1', [
    id
]);
res.json(`Tips Adiestramiento #${id} eliminado Correctamente`);
};






module.exports = {
defectoUsers,
getUsers,
getUserById,
login,
createUser,
updateUser,
deleteUser,
getMascotas,
getMascotasById,
createMascotas,
updateMascotas,
deleteMascotas,
createAdopciones,
getAdopcion,
getAdopcionById,
deleteAdopciones,
updateAdopciones,
getAdiestramiento,
createAdiestramientos,
deleteAdiestramientos,
updateAdiestramientos,
recuperarContraseña

};