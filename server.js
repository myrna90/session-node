//Conectar la base de datos con la aplicación
// Aquí nos encontramos con todos nuestros requerimientos que necesitamos para que nuestra aplicación funcione.
//intalaciones requeridas:
/*npm i --save connect-mongo, npm i -g nodemon, npm i --save express y express-session junto o separado, 
npm install mongoose --save, npm i --save passport passport-local, npm i --save body-parser*/
const express = require('express');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
//mongoose nos va a permitir modelar la información de cada usuario (correo electronico, contraseña, nombre perfil, etc...)
const mongoose = require('mongoose');
/*Agregar las rutas para soportar las llamadas a login y sigin up */
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./config/passport');

const MONGO_URL = 'mongodb://127.0.0.1:27017/auth';
const app = express();

//configurar mongoose
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (err) => {
    throw err;
    process.exit(1);
});



/*
const Usuario = require('./modelos/Usuario');
Prueba se crea un nuevo usuario para guardar en la base de datos
const u = new Usuario({
    email: 'myrnamares90@gmail.com',
    nombre: 'Myrna',
    password: '123456'
})

//le decimos a este objeto que guarde la información en la base de datos
//el metodo save retorna una promesa , esta promesa imprimira en consola un resultado o que muestre que ocurrio un error
u.save()
    .then(() =>{
    console.log('guardado')
})
    .catch((error) => {
        console.log(error);
    })*/


//que va a tomar de la sesiones y el lugar donde va a almacenar esa información.
app.use(session({
    secret: 'ESTO ES SECRETO',
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
        url: MONGO_URL,
        autoReconnect: true
    })
}))

//inicializar passport
app.use(passport.initialize());
//utilizar las sesiones de passort
app.use(passport.session());

/*utilice de body parser la codificación a json y la url esto cuando se llama 
un metodo post de un formulario la transforma en json para poder manipularla*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*Aquí nos podemos dar cuenta que nuestra sesiones estan funcionando y se guarda cuantas veces la sesión visto la pagina
app.get('/', (req, res) => {
    req.session.cuenta =req.session.cuenta ? req.session.cuenta + 1 : 1;
    res.send(`Hola! Has visto esta pagina: ${req.session.cuenta}`);
})*/

//importar nuestro contralador de usuarios
const controladorUsuario = require('./controladores/usuario');
app.post('/signup', controladorUsuario.postSignup);
app.post('/login', controladorUsuario.postLogin);
//se le agrega para saber si los usuarios estan autenticados, si no para que hacer la función logout.
app.get('/logout', passportConfig.estaAutenticado, controladorUsuario.logout);

//ver la informacion de los usuarios, esto nos va a ayudar a verificar que nuestros usuarios estan autenticados correctamente.
app.get('/usuarioInfo', passportConfig.estaAutenticado, (req, res) => {
    res.json(req.user);
})

//listen es para decir quien esta escuchando en este caso el puerto 3000 si no se configura por ende será en el puerto 8080
app.listen(3000, () => {
    console.log('escuchando en el puerto 3000')
})
