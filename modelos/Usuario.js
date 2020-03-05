//dentro de este archivo vamos a estar depositando nuestro modelo
//Intalaciones npm i --save bcrypt-nodejs
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//esquema de nuestro usuario
const usuarioSchema = new Schema({
    email: {type: String, unique: true, lowercase: true, required: true},
    password: {type: String, required: true},
    nombre: {type: String, required: true}
}, {
    timestamps: true
})
/*Times tamps mongoose se encarga de agregar algunas propiedades para saber cuando 
nuestro usuario fue creado y actualizado cual sea el caso.*/

//Metodo que se ejecuta antes de guardar nuestros objetos
/*esto es para encriptar la contraseña del usuario, esto para resguardar las contraseñas de 
posibles violaciones a la base de datos, en la base de datos de nuestra aplicación solo se encontrara la contraseña encriptada*/
usuarioSchema.pre('save', function(next){
    //saber si la contraseña a sido modificada o esta siendo creada
    const usuario = this;
    if(!usuario.isModified('password')){
        return next()
    }
    //recibe la contraseña y crea un salt 
    bcrypt.genSalt(10, (err, salt) => {
        if(err){
            next(err);
        }
    /*utilizo ese salt en el metodo de hash con la contraeña proporcionada por el usuario y 
    este hash me da una nueva contraseña encriptada y substituyo la contraseña del usuario con el hash*/
    bcrypt.hash(usuario.password, salt, null, (err, hash) => {
        if(err){
            next(err);
        }
        usuario.password = hash;
        next()
        //este ultimo next que se llama sin el error es para que la información sea almacenada en nuestra base de datos.
        })
    })
})

/*metodo para comparar la contraseña que creo el usuario con el hash que se almaceno en la base de datos*/
usuarioSchema.methods.compararPassword = function(password, cd) {
    //aquí esta tomando la contraseña que ingreso el usuario y el hash que esta en la base de datos para compararlos
    bcrypt.compare(password, this.password, (err, sonIguales) => {
        if(err){
            return cd(err)
        }
        cb(null, sonIguales)
    })
}

module.exports = mongoose.model('Usuario', usuarioSchema);
