1. Instalación y configuración de PostgreSQL
Paso 1: Actualización e instalación de PostgreSQL
Primero, actualice el sistema y luego instale PostgreSQL y sus contribuciones adicionales con el siguiente comando:

sudo apt update
sudo apt install postgresql postgresql-contrib
Paso 2: Acceder a PostgreSQL como usuario administrador
Por defecto, PostgreSQL crea un usuario llamado postgres. Para ingresar al sistema de base de datos, utilice el siguiente comando:

sudo -i -u postgres
psql
Paso 3: Crear la base de datos y el usuario
Dentro de PostgreSQL, crea una nueva base de datos y un usuario con privilegios para acceder a ella:

sql

CREATE DATABASE admin_db;
CREATE USER postgres WITH ENCRYPTED PASSWORD '12345678';
GRANT ALL PRIVILEGES ON DATABASE admin_db TO postgres;
Paso 4: Salir de PostgreSQL
Para salir de PostgreSQL, simplemente escribe el siguiente comando:

sql

\q

2. Conexión a la base de datos desde la terminal
Paso 1: Conectarse desde la terminal
Con el usuario que has creado, puedes conectarte a la base de datos desde la terminal con el siguiente comando:


psql -U postgres -d admin_db
Paso 2: Verificar la conexión
Una vez conectado, puedes listar las tablas disponibles para verificar que la conexión fue exitosa:

sql

\dt

Paso 3: Conexión desde un script Python
Si deseas hacer una conexión desde un script en Python, usa el siguiente código:

pitón

import psycopg2

try:
    conn = psycopg2.connect(
        dbname='admin_db',
        user='postgres',
        password='12345678',
        host='localhost',
        port='5432'
    )
    print("Conexión exitosa a la base de datos")
    conn.close()
except Exception as e:
    print("Error en la conexión:", e)
3. Creación de la tabla alumnosen PostgreSQL
Paso 1: Crear la tabla
Para almacenar los datos de los alumnos, crea una tabla con los siguientes campos:

sql

CREATE TABLE alumnos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    fecha_nacimiento DATE,
    sexo VARCHAR(10),
    lenguaje_programacion VARCHAR(50),
    promedio_primaria DECIMAL(3,2),
    promedio_secundaria DECIMAL(3,2),
    promedio_preparatoria DECIMAL(3,2),
    promedio_actual DECIMAL(3,2),
    salario_esperado DECIMAL(10,2),
    color_favorito VARCHAR(50),
    marca_ropa VARCHAR(50),
    marca_celular VARCHAR(50),
    materia_favorita VARCHAR(100)
);
Esto creará una tabla llamada alumnoscon varias columnas, incluyendo id, nombre, apellido, y varios promedios académicos, entre otros.

4. Creación de la API con Flask
Paso 1: Instalación de dependencias
Para crear la API con Flask, primero instale Flask y psycopg2 (el conector de PostgreSQL para Python):

pip install flask psycopg2
Paso 2: Crear el archivoapp.py
A continuación, crea un archivo llamado app.py, que contendrá el código de la aplicación Flask:

pitón

from flask import Flask, render_template, request, jsonify
import psycopg2
import os

app = Flask(__name__)

# Conexión a la base de datos
def connect_db():
    return psycopg2.connect(
        dbname='admin_db',
        user='postgres',
        password='12345678',
        host='localhost',
        port='5432'
    )

# Ruta para la página principal
@app.route('/')
def index():
    return open("index.html").read()

# Ruta para servir el archivo JavaScript
@app.route('/app.js')
def serve_js():
    return open("app.js").read(), 200, {'Content-Type': 'application/javascript'}

# Ruta para obtener todos los alumnos
@app.route('/alumnos', methods=['GET'])
def obtener_alumnos():
    with connect_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM alumnos")
        alumnos = cursor.fetchall()
    return jsonify(alumnos)

# Ejecutar el servidor
if __name__ == '__main__':
    app.run(debug=True)
Paso 3: Estructura del proyecto
La estructura del proyecto debe ser algo similar a esto:

texto

Copiar

Editar
/mi_aplicacion
    /static
        app.js
    /templates
        index.html
    app.py
index.html : La plantilla HTML principal donde se mostrará la información.
app.js : El archivo JavaScript que gestionará las interacciones con la API.
app.py : El archivo Python que contiene la API Flask.
Paso 4: Ejecutar el servidor
En la terminal, navegue a la carpeta del proyecto y ejecute el servidor Flask:

python app.py
El servidor se ejecutará en http://127.0.0.1:5000/.

5. Pasos adicionales: Configuración de permisos y ubicación del archivo CSV
Paso Extra 1: Cambiar permisos al archivo CSV
Si necesita importar datos desde un archivo CSV, asegúrese de que los permisos del archivo estén configurados correctamente:

sudo chmod 644 /home/oem/Desktop/Alumnos.csv
Paso Extra 2: Mover el archivo CSV
Mueva el archivo CSV a un directorio accesible para PostgreSQL:

mv /home/oem/Desktop/Alumnos.csv /tmp/Alumnos.csv
6. Pasos adicionales: Importar datos desde un archivo CSV a PostgreSQL
Una vez que tengas el archivo CSV en el directorio adecuado, puedes importar los datos a la tabla alumnosde la base de datos utilizando el siguiente comando en la terminal:

psql -U postgres -d admin_db -c "\copy alumnos(nombre, apellido, fecha_nacimiento, sexo, lenguaje_programacion, promedio_primaria, promedio_secundaria, promedio_preparatoria, promedio_actual, salario_esperado, color_favorito, marca_ropa, marca_celular, materia_favorita) FROM '/tmp/Alumnos.csv' DELIMITER ',' CSV HEADER;"
Este comando copiará los datos del archivo CSV a la tabla alumnos, asegurándose de que el archivo tenga el encabezado adecuado ( CSV HEADER).

7. Pasos adicionales: Ejemplo de CRUD (Crear, Leer, Actualizar, Eliminar)
A continuación se detallan los ejemplos de las operaciones CRUD utilizando Flask.

Paso  1: Crear un alumno
pitón

@app.route('/alumnos', methods=['POST'])
def crear_alumno():
    data = request.get_json()
    nombre = data['nombre']
    apellido = data['apellido']
    fecha_nacimiento = data['fecha_nacimiento']
    sexo = data['sexo']
    # Insertar en la base de datos
    with connect_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO alumnos (nombre, apellido, fecha_nacimiento, sexo)
            VALUES (%s, %s, %s, %s)
        """, (nombre, apellido, fecha_nacimiento, sexo))
        conn.commit()
    return jsonify({'mensaje': 'Alumno creado correctamente'}), 201
Paso Extra 2: Leer alumnos
pitón

@app.route('/alumnos', methods=['GET'])
def obtener_alumnos():
    with connect_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM alumnos")
        alumnos = cursor.fetchall()
    return jsonify(alumnos)
Paso  3: Actualizar un alumno
pitón

@app.route('/alumnos/<int:id>', methods=['PUT'])
def actualizar_alumno(id):
    data = request.get_json()
    nombre = data['nombre']
    apellido = data['apellido']
    with connect_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE alumnos SET nombre = %s, apellido = %s WHERE id = %s
        """, (nombre, apellido, id))
        conn.commit()
    return jsonify({'mensaje': 'Alumno actualizado correctamente'})
Paso  4: Eliminar un alumno
pitón

@app.route('/alumnos/<int:id>', methods=['DELETE'])
def eliminar_alumno(id):
    with connect_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM alumnos WHERE id = %s", (id,))
        conn.commit()
    return jsonify({'mensaje': 'Alumno eliminado correctamente'})
