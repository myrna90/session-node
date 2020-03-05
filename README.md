# Session con Node.js y Express

Este repositorio contine un ejercicio en el cual se hace las autenticaciones correspondientes para poderlas utilizar en una pagina web.

## Herramientas 

Aquí nos encontramos con todos nuestros requerimientos que necesitamos para que nuestra aplicación funcione.

### instalaciones NPM

- Node.js intalar desde la página oficial.

- Node mon, npm i -g nodemon (esto hace más vasil nuestra visualización sin tener que estar reiniciando, se muestran los cambios en tiempo real cada actualización).

- Express, npm i --save express express-session.

- Express session  (este facilita el manejo de las sesiones).

- Mongodb instalar desde la página oficial.

- Connect mongo, npm i --save connect-mongo.

- Mongoose, npm install mongoose --save (mongoose nos va a permitir modelar la información de cada usuario (correo electronico, contraseña, nombre perfil, etc...).

- Passport, npm i --save passport passport-local (relación entre la base de datos y el navegador para identificar cual es el usurio que esta ingresando).

- Passport local.

- Body-parser, npm i --save body-parser (Agregar las rutas para soportar las llamadas a login y sigin up).