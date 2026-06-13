// --- LÓGICA DE JAVASCRIPT (script.js) ---

// 1. Datos iniciales (Si no hay nada en localStorage, cargamos estos de muestra)
let libros = JSON.parse(localStorage.getItem('libros')) || [
    { id: 1, titulo: "El Aleph", autor: "Jorge Luis Borges", estado: "Disponible" },
    { id: 2, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", estado: "Prestado" }
];

const form = document.getElementById('libro-form');
const tabla = document.getElementById('tabla-libros');

// 2. Función para renderizar la lista en el HTML
function renderizarLibros() {
    tabla.innerHTML = ''; // Limpiar tabla
    
    libros.forEach(libro => {
        const row = document.createElement('tr');
        
        // Determinar la clase CSS según el estado
        const claseEstado = libro.estado === 'Disponible' ? 'status-disponible' : 'status-prestado';

        row.innerHTML = `
            <td><strong>${libro.titulo}</strong></td>
            <td>${libro.autor}</td>
            <td><span class="status ${claseEstado}">${libro.estado}</span></td>
            <td>
                <button class="btn-action" onclick="cambiarEstado(${libro.id})">
                    ${libro.estado === 'Disponible' ? 'Prestar' : 'Devolver'}
                </button>
                | 
                <button class="btn-action" style="color: #ef4444;" onclick="eliminarLibro(${libro.id})">
                    Eliminar
                </button>
            </td>
        `;
        tabla.appendChild(row);
    });

    // Guardar en el almacenamiento del navegador
    localStorage.setItem('libros', JSON.stringify(libros));
}

// 3. Evento para registrar un nuevo libro
form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const nuevoLibro = {
        id: Date.now(), 
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        estado: document.getElementById('estado').value
    };

    libros.push(nuevoLibro);
    renderizarLibros();
    form.reset(); 
});

// 4. Función para cambiar el estado (Prestar/Devolver)
window.cambiarEstado = function(id) {
    libros = libros.map(libro => {
        if (libro.id === id) {
            libro.estado = libro.estado === 'Disponible' ? 'Prestado' : 'Disponible';
        }
        return libro;
    });
    renderizarLibros();
};

// 5. NUEVA FUNCIÓN: Eliminar un libro por completo
window.eliminarLibro = function(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
        libros = libros.filter(libro => libro.id !== id);
        renderizarLibros();
    }
};

// Inicializar la vista al cargar la página
renderizarLibros();