//relación entre la base de datos y el navegador para identificar cual es el usurio que esta ingresando
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../modelos/Usuario');

//metodo para serializar usuarios
passport.serializeUser((usuario, done) => {
    /*invocar el callback done que significa que estamos listos el id es el que le da 
    mongodb a cada usuario para identificarlos es un id unico, aquí se utiliza el id para hacer el match con la base de datos*/
    done(null, usuario._id);
})

//tengo este id. ¿a que usuario pertenece?
//metodo deserializar usuario
passport.deserializeUser((id, done) => {
    /*encontrar al usuario que tenga el id que nos esta pasando passport, creamos una funcion 
    anonima que recibe dos parametros el primero un err y el segundo el usuario si es que lo encontro*/
    Usuario.findById(id, (err, usuario) => {
        //esto invoca al callback dependiendo si hay error o si encntro al usuario
        done(err, usuario);
    })
})

/*estrategia local de passport, aquí es donde se hace el maching de la contraseña y 
el email para autenticar que si exista en nuestra base de dato, para poder hacer login al usuario*/
passport.use(new LocalStrategy(
    {usernameField: 'email'},
    (email, password, done) => {
        Usuario.findOne({email}, (err, usuario) => {
            if(!usuario){
                return done(null, false, {message: `Este email: ${email} no esta registrado`});
            } else {
                Usuario.compararPassword(password, (err, sonIguales) => {
                    if(sonIguales) {
                        return done(null, usuario);
                    } else {
                        return done(null, false, {message: `La contraseña no es valida`})
                    }
                })
            }
        })
    }
))

/*Metodo para marcar las rutas que necesitan que el usuario este autenticado */
exports.estaAutenticado = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.status(401).send('Tienes que hacer login para acceder a este recurso');
}

