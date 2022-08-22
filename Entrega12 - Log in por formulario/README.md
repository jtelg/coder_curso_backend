!!!!!!!!!!!!!!!!!!!!!!!!!

Mapa de rutas:

http://localhost:3000/session/login http://localhost:3000/session/register http://localhost:3080/ http://localhost:3080/productos

si se ingresa con el usuario "admin" contraseña "admin" se accede a permisos especiales.

Para setear una base de datos desde el archivo .env las opciones son:

variable DATABASE_USE opcion 1: 'SqliteDB' opcion 2: 'MariaDB' opcion 3: 'JSON' opcion 4: 'Firebase' opcion 5: 'MongoDB'

Esta variable es utilizada cuando se declara el Contenedor creado en el archivo src/utils/DB_functions.js, donde se setea el nombre de la tabla u coleccion y base de datos que se utiliza, en este caso usa la variable de .env pero se pueden utilizar todas las bases de datos que sean necesarias solo declarando en el nombre del contenedor