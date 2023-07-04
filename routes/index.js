const { Router } = require('express');
const router = Router();
const { defectoUsers, getUsers, login, getUserById, createUser, recuperarContraseña, updateUser, deleteUser,
    getMascotasById, getMascotas, createMascotas, updateMascotas, deleteMascotas,
    createAdopciones, getAdopcion, getAdopcionById, deleteAdopciones, updateAdopciones, getAdiestramiento, createAdiestramientos,
    updateAdiestramientos, deleteAdiestramientos
} = require('../controllers/index.controller');

//router usuarios
router.get('/', defectoUsers);
router.get('/users', getUsers);
router.get('/usrs', login);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.post('/recuperar', recuperarContraseña);
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser);

//router Mascotas
router.get('/mascotas', getMascotas);
router.get('/mascotas/:id', getMascotasById);
router.post('/mascotas', createMascotas);
router.put('/mascotas/:id', updateMascotas)
router.delete('/mascotas/:id', deleteMascotas);

//router adoopciionnees
router.get('/adopciones/', getAdopcion);
router.get('/adopciones/:idcedula', getAdopcionById);
router.post('/adopciones', createAdopciones);
router.delete('/adopciones/:idadopcion', deleteAdopciones);
router.put('/adopciones/:id', updateAdopciones)

//router adestramientos
router.get('/adiestramientos', getAdiestramiento);
//router.get('/mascotas/:id', getAdiestramientosById);
router.post('/adiestramientos', createAdiestramientos);
router.put('/adiestramientos/:id', updateAdiestramientos)
router.delete('/adiestramientos/:id', deleteAdiestramientos);

module.exports = router;