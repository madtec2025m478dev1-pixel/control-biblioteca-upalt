<?php
// Permisos de cabecera para recibir peticiones JSON de Axios
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 1. Conexión a la base de datos MySQL (XAMPP)
$servidor = "localhost";
$usuario = "root";
$password = "";
// ⚠️ OJO: Verifica si tu base de datos se llama 'biblioteca' o cámbialo aquí al nombre exacto de tu BD
$base_datos = "biblioteca_db"; 

try {
    $conexion = new PDO("mysql:host=$servidor;dbname=$base_datos;charset=utf8", $usuario, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error de conexión a BD: " . $e->getMessage()]);
    exit();
}

// 2. Recibir los datos enviados por Axios desde Vue 3
$datos = json_decode(file_get_contents("php://input"));

// 3. Validación obligatoria del servidor (Que no vengan campos vacíos)
if (!empty($datos->codigo) && !empty($datos->titulo) && !empty($datos->autor)) {
    
    // Limpieza de datos (Sanitización básica)
    $codigo = htmlspecialchars(strip_tags(trim($datos->codigo)));
    $titulo = htmlspecialchars(strip_tags(trim($datos->titulo)));
    $autor = htmlspecialchars(strip_tags(trim($datos->autor)));
    $estado = "Disponible"; // Por defecto al registrarlo

    // 4. Consulta Preparada (Prepared Statement anti Inyección SQL)
    $sql = "INSERT INTO libros (codigo, titulo, autor, estado) VALUES (:codigo, :titulo, :autor, :estado)";
    
    try {
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':codigo', $codigo);
        $stmt->bindParam(':titulo', $titulo);
        $stmt->bindParam(':autor', $autor);
        $stmt->bindParam(':estado', $estado);
        
        if ($stmt->execute()) {
            echo json_encode(["exito" => true, "mensaje" => "Libro registrado correctamente en MySQL."]);
        } else {
            echo json_encode(["exito" => false, "mensaje" => "No se pudo guardar el registro."]);
        }
    } catch(PDOException $e) {
        echo json_encode(["exito" => false, "mensaje" => "Error al insertar en BD: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["exito" => false, "mensaje" => "Todos los campos son obligatorios en el servidor."]);
}
?>