document.addEventListener("DOMContentLoaded", function () {
    obtenerAlumnos();
    document.getElementById("alumno-form").addEventListener("submit", function (event) {
        event.preventDefault();
        agregarAlumno();
    });
});

function obtenerAlumnos() {
    fetch("/alumnos")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("alumnos-table");
            tableBody.innerHTML = "";

            // Ordenar por ID (ascendente)
            data.sort((a, b) => a[0] - b[0]);

            data.forEach(alumno => {
                let row = `<tr id="fila-${alumno[0]}">
                    <td>${alumno[0]}</td> <!-- ID -->
                    <td>${alumno[1]}</td> <!-- Nombre -->
                    <td>${alumno[2]}</td> <!-- Apellido -->
                    <td>${formatearFecha(alumno[3])}</td> <!-- Fecha de nacimiento -->
                    <td>${alumno[4]}</td> <!-- Sexo -->
                    <td>${alumno[5]}</td> <!-- Lenguaje de programación favorito -->
                    <td>${parseFloat(alumno[6]).toFixed(2)}</td> <!-- Promedio final primaria -->
                    <td>${parseFloat(alumno[7]).toFixed(2)}</td> <!-- Promedio final secundaria -->
                    <td>${parseFloat(alumno[8]).toFixed(2)}</td> <!-- Promedio final preparatoria -->
                    <td>${parseFloat(alumno[9]).toFixed(2)}</td> <!-- Promedio actual -->
                    <td>${parseFloat(alumno[10]).toFixed(2)}</td> <!-- Salario esperado -->
                    <td>${alumno[11]}</td> <!-- Color favorito -->
                    <td>${alumno[12]}</td> <!-- Marca de ropa favorita -->
                    <td>${alumno[13]}</td> <!-- Marca de celular favorita -->
                    <td>${alumno[14]}</td> <!-- Materia favorita -->
                    <td>
                        <button onclick="editarAlumno(${alumno[0]})">Editar</button>
                        <button onclick="eliminarAlumno(${alumno[0]})">Eliminar</button>
                    </td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error('Error al obtener alumnos:', error));
}

function agregarAlumno() {
    const id = document.getElementById("alumno-id").value;
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
    const sexo = document.getElementById("sexo").value;
    const lenguaje_programacion = document.getElementById("lenguaje_programacion").value;
    const promedio_primaria = parseFloat(document.getElementById("promedio_primaria").value);
    const promedio_secundaria = parseFloat(document.getElementById("promedio_secundaria").value);
    const promedio_preparatoria = parseFloat(document.getElementById("promedio_preparatoria").value);
    const promedio_actual = parseFloat(document.getElementById("promedio_actual").value);
    const salario_esperado = parseFloat(document.getElementById("salario_esperado").value);
    const color_favorito = document.getElementById("color_favorito").value;
    const marca_ropa = document.getElementById("marca_ropa").value;
    const marca_celular = document.getElementById("marca_celular").value;
    const materia_favorita = document.getElementById("materia_favorita").value;

    const alumnoData = {
        nombre, apellido, fecha_nacimiento, sexo, lenguaje_programacion,
        promedio_primaria, promedio_secundaria, promedio_preparatoria, promedio_actual,
        salario_esperado, color_favorito, marca_ropa, marca_celular, materia_favorita
    };

    const url = id ? `/alumnos/${id}` : '/alumnos';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alumnoData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || "Alumno guardado correctamente");
        document.getElementById("alumno-form").reset();
        document.getElementById("alumno-id").value = ""; // Reset ID
        obtenerAlumnos();
    })
    .catch(error => console.error('Error al agregar o modificar alumno:', error));
}

function editarAlumno(id) {
    fetch(`/alumnos/${id}`)
        .then(response => response.json())
        .then(alumno => {
            document.getElementById("nombre").value = alumno[1];
            document.getElementById("apellido").value = alumno[2];
            document.getElementById("fecha_nacimiento").value = formatearFechaParaInput(alumno[3]);
            document.getElementById("sexo").value = alumno[4];
            document.getElementById("lenguaje_programacion").value = alumno[5];
            document.getElementById("promedio_primaria").value = alumno[6];
            document.getElementById("promedio_secundaria").value = alumno[7];
            document.getElementById("promedio_preparatoria").value = alumno[8];
            document.getElementById("promedio_actual").value = alumno[9];
            document.getElementById("salario_esperado").value = alumno[10];
            document.getElementById("color_favorito").value = alumno[11];
            document.getElementById("marca_ropa").value = alumno[12];
            document.getElementById("marca_celular").value = alumno[13];
            document.getElementById("materia_favorita").value = alumno[14];
            document.getElementById("alumno-id").value = id;
        })
        .catch(error => console.error('Error al obtener alumno:', error));
}

function eliminarAlumno(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este alumno?")) {
        fetch(`/alumnos/${id}`, { method: "DELETE" })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                alert(data.message || "Alumno eliminado correctamente");
                obtenerAlumnos();
            })
            .catch(error => console.error('Error al eliminar alumno:', error));
    }
}

// Formatear fecha de "aaaa-mm-dd" a "dd/mm/aaaa" (para mostrar en la tabla)
function formatearFecha(fecha) {
    if (!fecha) return "";
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
}

// Formatear fecha de "dd/mm/aaaa" a "aaaa-mm-dd" (para los inputs)
function formatearFechaParaInput(fecha) {
    if (!fecha) return "";
    const [day, month, year] = fecha.split("/");
    return `${year}-${month}-${day}`;
}
