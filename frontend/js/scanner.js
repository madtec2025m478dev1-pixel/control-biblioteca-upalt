// frontend/js/scanner.js

// LÓGICA DEL ESCÁNER CON ZXING
const codeReader = new ZXing.BrowserMultiFormatReader();
const btnScanner = document.getElementById('btn-iniciar-scanner');
const videoContainer = document.getElementById('video-container');
const resultadoDiv = document.getElementById('resultado-escaner');

let camaraEncendida = false;
let procesandoCodigo = false; 

btnScanner.addEventListener('click', () => {
    if (!camaraEncendida) {
        iniciarCamara();
    } else {
        detenerCamara();
    }
});

async function iniciarCamara() {
    try {
        codeReader.reset();
        procesandoCodigo = false;
        resultadoDiv.innerHTML = "<span style='color: #4b5563;'>Iniciando cámara...</span>";
        
        const videoInputDevices = await codeReader.listVideoInputDevices();
        
        if (videoInputDevices.length === 0) {
            resultadoDiv.innerHTML = "<span style='color: red;'>❌ No se detectó ninguna cámara.</span>";
            return;
        }

        // === LÓGICA INTELIGENTE PARA ELEGIR CÁMARA ===
        let selectedDeviceId = videoInputDevices[0].deviceId; // Por defecto (Laptop)
        let esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        let camaraTraseraEncontrada = false;

        // 1. Intentamos buscar la trasera por su nombre (label)
        for (const device of videoInputDevices) {
            const label = device.label.toLowerCase();
            if (label.includes('back') || label.includes('rear') || label.includes('trasera') || label.includes('environment')) {
                selectedDeviceId = device.deviceId;
                camaraTraseraEncontrada = true;
                break;
            }
        }

        // 2. Si es celular pero las cámaras no tienen nombre, usamos la última (suele ser la trasera)
        if (esMovil && !camaraTraseraEncontrada && videoInputDevices.length > 1) {
            selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;
        }
        // ===============================================

        videoContainer.style.display = 'block';
        btnScanner.textContent = "Apagar Cámara 🛑";
        btnScanner.style.backgroundColor = "#ef4444";
        camaraEncendida = true;
        resultadoDiv.innerHTML = "<span style='color: #2563eb;'>Apunta al código QR o de barras...</span>";

        codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
            if (result && camaraEncendida && !procesandoCodigo) {
                const codigoLeido = result.text.trim();
                
                if (codigoLeido.length >= 4) {
                    procesandoCodigo = true; 
                    resultadoDiv.innerHTML = `<span style="color: #2563eb; font-weight: bold;">Buscando código: ${codigoLeido}...</span>`;
                    buscarEnBaseDeDatos(codigoLeido);
                }
            }
        });
    } catch (err) {
        console.error("Error al iniciar la cámara:", err);
        resultadoDiv.innerHTML = "<span style='color: red;'>❌ El navegador bloqueó la cámara o está en uso.</span>";
        detenerCamara();
    }
}

function detenerCamara() {

    try {
        codeReader.reset();
    } catch(e) {
        console.log(e);
    }

    const videoElement = document.getElementById('video');

    if (videoElement && videoElement.srcObject) {

        videoElement.srcObject.getTracks().forEach(track => {
            track.stop();
        });

        videoElement.srcObject = null;
    }

    videoContainer.style.display = 'none';
    btnScanner.textContent = "Encender Cámara 📷";
    btnScanner.style.backgroundColor = "#10b981";
    camaraEncendida = false;
}

// CONEXIÓN AL BACKEND (PHP) USANDO FETCH
function buscarEnBaseDeDatos(codigo) {
    fetch(`../backend/buscar.php?codigo=${codigo}`)
        .then(response => {
            if (!response.ok) throw new Error("Backend no disponible");
            return response.json();
        })
        .then(data => {
            if (data.encontrado) {
                detenerCamara(); 
                
                const jsonFormateado = JSON.stringify(data, null, 4);
                resultadoDiv.innerHTML = `
                    <div style="background: #1e293b; padding: 15px; border-radius: 8px; margin-top: 10px; border: 1px solid #334155; text-align: left; overflow-x: auto;">
                        <strong style="color: #22c55e; font-size: 1.1em;">✅ JSON Recibido del Backend:</strong><br>
                        <pre style="color: #38bdf8; font-family: monospace; font-size: 14px; margin-top: 10px;"><code>${jsonFormateado}</code></pre>
                    </div>`;
            } else {
                resultadoDiv.innerHTML = `
                    <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin-top: 10px; border: 1px solid #ef4444;">
                        <strong style="color: #b91c1c; font-size: 1.1em;">❌ No encontrado</strong><br><br>
                        El código <strong>${codigo}</strong> no está registrado. Intenta con otro.
                    </div>`;
                
                setTimeout(() => {
                    if (camaraEncendida) {
                        procesandoCodigo = false; 
                        resultadoDiv.innerHTML = "<span style='color: #2563eb;'>Listo. Apunta a un nuevo código...</span>";
                    }
                }, 2500);
            }
        })
        .catch(error => {
            console.error("Error en Fetch:", error);
            resultadoDiv.innerHTML = `
                <div style="background: #fee2e2; padding: 10px; border-radius: 8px; margin-top: 10px;">
                    <strong style="color: #b91c1c;">❌ Error de Sistema</strong><br>
                    Hubo un error al conectar con PHP. Verifica XAMPP.
                </div>`;
            
            setTimeout(() => {
                if (camaraEncendida) {
                    procesandoCodigo = false;
                }
            }, 2500);
        });
}