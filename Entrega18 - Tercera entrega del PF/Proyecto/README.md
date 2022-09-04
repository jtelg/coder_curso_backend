!!!!!!!!!!!!!!!!!!!!!!!!!

Mapa de rutas:

- http://127.0.0.1:8080/
- http://127.0.0.1:8080/?admin=true
- http://127.0.0.1:8080/productos?admin=true

datos de administrador:
- usuario: admin
- password: admin
s
Para ver editar y agregar un nuevo producto se debe ingresar como administrador u envier la veriable de admin en la URL.


Para inicializar modo FORK o modo CLUSTER en nodemoon se puede utilizar la variable MODE_INIT creada en el archivo.env

MODE_INIT:
 - CLUSTER
 - FORK



Para setear una base de datos desde el archivo .env las opciones son:

variable DATABASE_USE 
-    opcion 1: 'SqliteDB'
-    opcion 2: 'MariaDB'
-    opcion 3: 'JSON'
-    opcion 4: 'Firebase'
-    opcion 5: 'MongoDB'


Esta variable es utilizada cuando se declara el Contenedor
creado en el archivo src/utils/DB_functions.js, donde se setea el nombre de la tabla u 
coleccion y base de datos que se utiliza, en este caso usa la variable de .env
pero se pueden utilizar todas las bases de datos que sean necesarias solo declarando en el nombre del contenedor






