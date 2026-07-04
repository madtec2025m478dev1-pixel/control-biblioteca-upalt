// frontend/js/app.js - ARQUITECTURA COMPLETA VUE.JS 3 + AXIOS

const { createApp } = Vue;

createApp({
    data() {
        return {
            // Estado de la lista de libros y buscador
            libros: [],
            busqueda: "",
            
            // Estado de la cámara y escáner
            camaraEncendida: false,
            procesandoCodigo: false,
            mensajeEscaner: "Escáner apagado.",
            
            // Objeto reactivo para el Registro Manual (Botón Morado - Altas)
            nuevoLibro: {
                codigo: "",
                titulo: "",
                autor: ""
            },
            
            // Motor del lector de código de barras (Ignora QR y texto)
            codeReader: new ZXing.BrowserBarcodeReader(),
            ultimoCodigoLeido: "",
            conteoLecturas: 0,
            LECTURAS_NECESARIAS: 3
        };
    },
    
    computed: {
        librosFiltrados() {
            if (!this.busqueda) return this.libros;
            const termino = this.busqueda.toLowerCase();
            return this.libros.filter(libro => {
                const tit = (libro.titulo || libro.nombre || "").toLowerCase();
                const aut = (libro.autor || libro.writer || "").toLowerCase();
                const cod = (libro.codigo || libro.codigo_barras || libro.isbn || "").toString().toLowerCase();
                
                return tit.includes(termino) || aut.includes(termino) || cod.includes(termino);
            });
        }
    },

    mounted() {
        // En cuanto carga la página, pedimos los libros a MySQL
        this.cargarLibros();
    },

    methods: {
        // ==========================================
        // 1. CONSULTAS (READ) - CARGAR E INVENTARIO
        // ==========================================
        async cargarLibros() {
            try {
                const respuesta = await axios.get('../backend/obtener_libros.php');
                this.libros = respuesta.data.libros || respuesta.data;
            } catch (error) {
                console.error("Error al obtener libros:", error);
                this.alerta("Error de Conexión", "No se pudo conectar con obtener_libros.php", "error");
            }
        },

        verDetalles(libro) {
            const titulo = libro.titulo || libro.nombre || 'Sin Título';
            const autor = libro.autor || 'No registrado';
            const codigo = libro.codigo || libro.codigo_barras || 'N/A';
            const id = libro.id || 'N/A';

            Swal.fire({
                title: `<strong>${titulo}</strong>`,
                icon: 'info',
                html: `
                    <p><b>Autor:</b> ${autor}</p>
                    <p><b>Código / ISBN:</b> <span class="badge bg-primary">${codigo}</span></p>
                    <p><b>ID BD:</b> ${id}</p>
                `,
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#0d6efd'
            });
        },

        // ==========================================
        // 2. ALTAS (CREATE) - BOTÓN MORADO MANUAL
        // ==========================================
        async guardarLibroManual() {
            // Validamos que no dejen cajas vacías
            if (!this.nuevoLibro.codigo || !this.nuevoLibro.titulo || !this.nuevoLibro.autor) {
                Swal.fire('Atención', 'Por favor llena los 3 campos para registrar el libro.', 'warning');
                return;
            }

            try {
                // Enviamos a MySQL usando Axios (Como exige el examen)
                const respuesta = await axios.post('../backend/crear_libro.php', this.nuevoLibro);
                
                if (respuesta.data.exito) {
                    Swal.fire({
                        title: '¡Libro Registrado! 📚',
                        text: respuesta.data.mensaje,
                        icon: 'success',
                        confirmButtonColor: '#10b981'
                    });
                    
                    // Limpiamos el formulario morado automáticamente
                    this.nuevoLibro.codigo = "";
                    this.nuevoLibro.titulo = "";
                    this.nuevoLibro.autor = "";
                    
                    // Recargamos la tabla al instante para ver el nuevo libro
                    this.cargarLibros();
                } else {
                    Swal.fire('Atención', respuesta.data.mensaje || 'No se pudo guardar el libro.', 'warning');
                }
            } catch (error) {
                console.error("Error al guardar libro:", error);
                this.alerta("Error en PHP", "Verifica que el archivo crear_libro.php exista en la carpeta backend.", "error");
            }
        },

        // ==========================================
        // 3. MODIFICACIONES (UPDATE) - EDITAR LIBRO
        // ==========================================
        async editarLibro(libro) {
            const { value: formValues } = await Swal.fire({
                title: '✏️ Editar Libro',
                html: `
                    <div class="text-start">
                        <label class="form-label small fw-bold">Código de Barras:</label>
                        <input id="swal-input-codigo" class="form-control mb-2" value="${libro.codigo || libro.codigo_barras || ''}">
                        <label class="form-label small fw-bold">Título del Libro:</label>
                        <input id="swal-input-titulo" class="form-control mb-2" value="${libro.titulo || libro.nombre || ''}">
                        <label class="form-label small fw-bold">Autor:</label>
                        <input id="swal-input-autor" class="form-control mb-2" value="${libro.autor || ''}">
                        <label class="form-label small fw-bold">Estado:</label>
                        <select id="swal-input-estado" class="form-select">
                            <option value="Disponible" ${libro.estado === 'Disponible' ? 'selected' : ''}>Disponible</option>
                            <option value="Prestado" ${libro.estado === 'Prestado' ? 'selected' : ''}>Prestado</option>
                            <option value="En Reparación" ${libro.estado === 'En Reparación' ? 'selected' : ''}>En Reparación</option>
                        </select>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: '💾 Guardar Cambios',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#0d6efd',
                preConfirm: () => {
                    return {
                        id: libro.id,
                        codigo: document.getElementById('swal-input-codigo').value,
                        titulo: document.getElementById('swal-input-titulo').value,
                        autor: document.getElementById('swal-input-autor').value,
                        estado: document.getElementById('swal-input-estado').value
                    }
                }
            });

            if (formValues) {
                try {
                    const respuesta = await axios.post('../backend/editar_libro.php', formValues);
                    if (respuesta.data.exito) {
                        Swal.fire('¡Actualizado! ✨', respuesta.data.mensaje, 'success');
                        this.cargarLibros();
                    } else {
                        Swal.fire('Atención', respuesta.data.mensaje, 'warning');
                    }
                } catch (error) {
                    console.error("Error al editar:", error);
                    this.alerta("Error", "No se pudo conectar con editar_libro.php", "error");
                }
            }
        },

        // ==========================================
        // 4. BAJAS (DELETE) - ELIMINAR LIBRO
        // ==========================================
        async eliminarLibro(libro) {
            const titulo = libro.titulo || libro.nombre || 'este libro';
            
            // Requisito: Confirmación previa al borrado
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: `Vas a eliminar "${titulo}" del inventario. ¡Esto no se puede deshacer!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: '🗑️ Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                try {
                    const respuesta = await axios.post('../backend/eliminar_libro.php', { id: libro.id });
                    if (respuesta.data.exito) {
                        Swal.fire('¡Eliminado! 🗑️', respuesta.data.mensaje, 'success');
                        this.cargarLibros();
                    } else {
                        Swal.fire('Error', respuesta.data.mensaje, 'error');
                    }
                } catch (error) {
                    console.error("Error al eliminar:", error);
                    this.alerta("Error", "No se pudo conectar con eliminar_libro.php", "error");
                }
            }
        },

        // ==========================================
        // 5. LECTOR DE CÓDIGO DE BARRAS CON CÁMARA
        // ==========================================
        toggleCamara() {
            if (!this.camaraEncendida) {
                this.iniciarCamara();
            } else {
                this.detenerCamara();
            }
        },

        async iniciarCamara() {
            try {
                this.codeReader.reset();
                this.procesandoCodigo = false;
                this.ultimoCodigoLeido = "";
                this.conteoLecturas = 0;
                this.mensajeEscaner = "Buscando cámara...";

                const videoInputDevices = await this.codeReader.listVideoInputDevices();
                
                if (videoInputDevices.length === 0) {
                    this.alerta("Sin Cámara", "No se detectó ninguna cámara conectada.", "error");
                    return;
                }

                let selectedDeviceId = videoInputDevices[0].deviceId; 
                let esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                let camaraTraseraEncontrada = false;

                for (const device of videoInputDevices) {
                    const label = device.label.toLowerCase();
                    if (label.includes('back') || label.includes('rear') || label.includes('trasera') || label.includes('environment')) {
                        selectedDeviceId = device.deviceId;
                        camaraTraseraEncontrada = true;
                        break;
                    }
                }

                if (esMovil && !camaraTraseraEncontrada && videoInputDevices.length > 1) {
                    selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;
                }

                this.camaraEncendida = true;
                this.mensajeEscaner = "Apunta al código de barras del libro...";

                const restricciones = {
                    video: {
                        deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
                        width: { min: 1280, ideal: 1920 }, 
                        height: { min: 720, ideal: 1080 }
                    }
                };

                if (esMovil) {
                    restricciones.video.advanced = [{ focusMode: "continuous" }];
                }

                this.codeReader.decodeFromConstraints(restricciones, 'video', (result, err) => {
                    if (result && this.camaraEncendida && !this.procesandoCodigo) {
                        const codigoLeido = result.text.trim();
                        
                        if (codigoLeido.length >= 4) {
                            if (codigoLeido === this.ultimoCodigoLeido) {
                                this.conteoLecturas++; 
                            } else {
                                this.ultimoCodigoLeido = codigoLeido; 
                                this.conteoLecturas = 1;
                            }

                            if (this.conteoLecturas >= this.LECTURAS_NECESARIAS) {
                                this.procesandoCodigo = true;
                                this.mensajeEscaner = `¡Código detectado: ${codigoLeido}! Buscando en BD...`;
                                this.buscarEnBaseDeDatos(codigoLeido);
                            }
                        }
                    }
                });
            } catch (err) {
                console.error("Error al iniciar la cámara:", err);
                this.alerta("Bloqueo de Cámara", "El navegador bloqueó la cámara o está en uso por otra app.", "error");
                this.detenerCamara();
            }
        },

        detenerCamara() {
            this.codeReader.reset();
            this.procesandoCodigo = false; 
            this.ultimoCodigoLeido = "";
            this.conteoLecturas = 0;
            
            const videoElement = document.getElementById('video');
            if (videoElement && videoElement.srcObject) {
                videoElement.srcObject.getTracks().forEach(track => track.stop());
                videoElement.srcObject = null;
            }

            this.camaraEncendida = false;
            this.mensajeEscaner = "Escáner apagado.";
        },

        async buscarEnBaseDeDatos(codigo) {
            try {
                const respuesta = await axios.get(`../backend/buscar.php?codigo=${codigo}`);
                const data = respuesta.data;

                if (data.encontrado) {
                    this.detenerCamara();
                    
                    const titulo = data.libro?.titulo || data.libro?.nombre || data.titulo || data.nombre || 'Sin Título';
                    const autor = data.libro?.autor || data.libro?.writer || data.autor || 'N/A';

                    Swal.fire({
                        title: '✅ ¡Libro Encontrado!',
                        html: `
                            <div class="text-start">
                                <p><b>Título:</b> ${titulo}</p>
                                <p><b>Autor:</b> ${autor}</p>
                                <p><b>Código:</b> <span class="badge bg-success">${codigo}</span></p>
                            </div>
                        `,
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#10b981'
                    });
                } else {
                    this.mensajeEscaner = `El código ${codigo} no está registrado.`;
                    
                    Swal.fire({
                        title: '❌ No registrado',
                        text: `El código de barras "${codigo}" no existe en la biblioteca.`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: '📷 Escanear otro',
                        cancelButtonText: 'Cerrar',
                        confirmButtonColor: '#ef4444'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.procesandoCodigo = false;
                            this.ultimoCodigoLeido = "";
                            this.conteoLecturas = 0;
                            this.mensajeEscaner = "Apunta a un nuevo código de barras...";
                        } else {
                            this.detenerCamara();
                        }
                    });
                }
            } catch (error) {
                console.error("Error en Axios:", error);
                this.alerta("Error en PHP", "Hubo un problema al consultar la base de datos MySQL.", "error");
                this.detenerCamara();
            }
        },

        alerta(titulo, texto, icono) {
            Swal.fire({ title: titulo, text: texto, icon: icono, confirmButtonColor: '#0d6efd' });
        }
    }
}).mount('#app'); // <-- MONTAJE OBLIGATORIO DE VUE 3