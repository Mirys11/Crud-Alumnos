from flask import Flask, render_template, request, jsonify
import psycopg2
import os

app = Flask(__name__)

# Configuración de la conexión a la base de datos
def connect_db():
    return psycopg2.connect(
        dbname='admin_db',  
        user='postgres',
        password='12345678',
        host='localhost',
        port='5432'
    )

@app.route('/')
def index():
    return open("index.html").read()

@app.route('/app.js')
def serve_js():
    return open("app.js").read(), 200, {'Content-Type': 'application/javascript'}

@app.route('/alumnos', methods=['GET'])
def obtener_alumnos():
    with connect_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM alumnos")
        alumnos = cursor.fetchall()
    return jsonify(alumnos)

@app.route('/alumnos/<int:id>', methods=['GET'])
def obtener_alumno(id):
    with connect_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM alumnos WHERE id=%s", (id,))
        alumno = cursor.fetchone()
    if alumno:
        return jsonify(alumno)
    else:
        return jsonify({'error': 'Alumno no encontrado'}), 404

@app.route('/alumnos', methods=['POST'])
def agregar_alumno():
    data = request.get_json()
    with connect_db() as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO alumnos (\"Nombre\", \"Apellido\", \"Fecha de nacimiento\", \"Sexo\", \"Lenguaje de programación favorito\", \"Promedio final de primaria\", \"Promedio final secundaria\", \"Promedio final preparatoria\", \"Promedio actual\", \"Salario esperado\", \"Color favorito\", \"Marca de ropa favorita\", \"Marca de celular favorita\", \"Materia favorita\") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
                       (data['nombre'], data['apellido'], data['fecha_nacimiento'], data['sexo'], data['lenguaje_programacion'], data['promedio_primaria'], data['promedio_secundaria'], data['promedio_preparatoria'], data['promedio_actual'], data['salario_esperado'], data['color_favorito'], data['marca_ropa'], data['marca_celular'], data['materia_favorita']))
        conn.commit()
    return jsonify({'message': 'Alumno agregado'}), 201

@app.route('/alumnos/<int:id>', methods=['PUT'])
def actualizar_alumno(id):
    data = request.get_json()
    with connect_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE alumnos SET \"Nombre\"=%s, \"Apellido\"=%s, \"Fecha de nacimiento\"=%s, \"Sexo\"=%s, \"Lenguaje de programación favorito\"=%s, \"Promedio final de primaria\"=%s, \"Promedio final secundaria\"=%s, \"Promedio final preparatoria\"=%s, \"Promedio actual\"=%s, \"Salario esperado\"=%s, \"Color favorito\"=%s, \"Marca de ropa favorita\"=%s, \"Marca de celular favorita\"=%s, \"Materia favorita\"=%s WHERE id=%s", 
                       (data['nombre'], data['apellido'], data['fecha_nacimiento'], data['sexo'], data['lenguaje_programacion'], data['promedio_primaria'], data['promedio_secundaria'], data['promedio_preparatoria'], data['promedio_actual'], data['salario_esperado'], data['color_favorito'], data['marca_ropa'], data['marca_celular'], data['materia_favorita'], id))
        conn.commit()
    return jsonify({'message': 'Alumno actualizado'})

@app.route('/alumnos/<int:id>', methods=['DELETE'])
def eliminar_alumno(id):
    with connect_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM alumnos WHERE id=%s", (id,))
        conn.commit()
    return jsonify({'message': 'Alumno eliminado'})

if __name__ == '__main__':
    app.run(debug=True)
