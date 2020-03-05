/*los contralodores se encargan de manejar las llamadas que ocurren a nuestra aplicación y de interactuar con los modelos */
//importar:
const passport = require('passport');
const Usuario = require('../modelos/Usuario');

//ruta que se encarga de crear nuestros usuarios
//requerimientos que se reciben un req, un res y un next
exports.postSignup = (req, res, next) => {
    const nuevoUsuario = new Usuario({
        //cuerpo de los requerimientos
        email: req.body.email,
        nombre: req.body.nombre,
        password: req.body.password
    });
    /*revisar si existe un usuario con el email que se 
    esta ingresando, solo puede haber un usuario por email esto para no tener emails repetidos*/
    Usuario.findOne({email: req.body.email}, (err, usuarioExistente) => {
        if(usuarioExistente) {
            return res.status(400).send('Este email ya esta registrado');
        }
        nuevoUsuario.save((err) => {
            if(err) {
                next(err);
            }
            req.logIn(nuevoUsuario, (err) => {
                if(err) {
                    next(err);
                }
                res.send('Usuario creado exitosamente');
            })
        })
    })
}

//Metodo login para cuando el usuario ya este dado de alta pueda hacer login
exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, usuario, info) => {
        if(err) {
            next(err);
        }
        if(!usuario) {
            return res.status(400).send('Email o contraseña invalidos');
        }
        req.logIn(usuario, (err) => {
            if(err) {
                next(err)
            }
            res.send('Login exitoso')
        })(req, res, next);
    })
}

//Metod para logout
exports.logout = (req, res) => {
    req.logout();
    res.send('Logout exitoso');
}
