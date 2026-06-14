// frontend/js/app.js

let librosLocales = [];

// NUEVO: Función para cargar libros desde la base de datos al iniciar la página
function cargarLibrosDesdeBD() {
    fetch('../backend/obtener_libros.php')
        .then(response => {
            if (!response.ok) throw new Error("Error en el servidor");
            return response.json();
        })
        .then(data => {
            if (data.exito) {
                // Si la consulta fue exitosa, guardamos los libros y pintamos la tabla
                librosLocales = data.libros;
                renderizarTabla();
            } else {
                console.error("Error al cargar inventario:", data.mensaje);
            }
        })
        .catch(error => {
            console.error("Error en petición fetch:", error);
        });
}

// Función para pintar la tabla con los datos que tenemos en memoria
function renderizarTabla() {
    const tabla = document.getElementById('tabla-libros');
    tabla.innerHTML = ''; 
    
    // Si no hay libros, mostramos un mensaje
    if (librosLocales.length === 0) {
        tabla.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#6b7280;">No hay libros en el inventario.</td></tr>';
        return;
    }

    // Recorremos los libros y los pintamos en el HTML
    librosLocales.forEach(libro => {
        // Aseguramos el estado, si no trae, le ponemos Disponible por defecto
        const estadoLibro = libro.estado ? libro.estado : 'Disponible';
        const claseEstado = estadoLibro === 'Disponible' ? 'status-disponible' : 'status-prestado';
        
        tabla.innerHTML += `
            <tr>
                <td><code>${libro.codigo}</code></td>
                <td><strong>${libro.titulo}</strong></td>
                <td>${libro.autor}</td>
                <td><span class="status ${claseEstado}">${estadoLibro}</span></td>
            </tr>`;
    });
}

// EJECUTAR AL CARGAR LA PÁGINA: Traer los libros de la base de datos
document.addEventListener('DOMContentLoaded', cargarLibrosDesdeBD);

// Escuchar el clic en "Agregar a Biblioteca"
document.getElementById('libro-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Capturamos lo que el usuario escribió
    const nuevoLibro = {
        codigo: document.getElementById('codigo').value,
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        estado: "Disponible" // Por defecto al registrar, está disponible
    };

    // Usamos fetch para enviarlo al servidor PHP (Backend)
    fetch('../backend/guardar_libro.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoLibro)
    })
    .then(response => response.json())
    .then(data => {
        if (data.exito) {
            // Si PHP dice que se guardó bien, volvemos a cargar la lista desde la BD
            // para que traiga el ID real y se mantenga sincronizada
            cargarLibrosDesdeBD();
            alert("✅ " + data.mensaje);
            e.target.reset(); // Limpia el formulario
        } else {
            // Si hubo un error (ej. código duplicado), mostramos el mensaje
            alert("❌ Error: " + data.mensaje);
        }
    })
    .catch(error => {
        console.error("Error en la petición:", error);
        alert("❌ Error de conexión con el servidor.");
    });
});