<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servidor = "localhost";
$usuario = "root";
$password = "";
$base_datos = "biblioteca_db"; // <-- Verifica que sea el nombre de tu BD

try {
    $conexion = new PDO("mysql:host=$servidor;dbname=$base_datos;charset=utf8", $usuario, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error de conexión: " . $e->getMessage()]);
    exit();
}

$datos = json_decode(file_get_contents("php://input"));

if (!empty($datos->id) && !empty($datos->codigo) && !empty($datos->titulo) && !empty($datos->autor)) {
    
    $id = intval($datos->id);
    $codigo = htmlspecialchars(strip_tags(trim($datos->codigo)));
    $titulo = htmlspecialchars(strip_tags(trim($datos->titulo)));
    $autor = htmlspecialchars(strip_tags(trim($datos->autor)));
    $estado = !empty($datos->estado) ? $datos->estado : "Disponible";

    $sql = "UPDATE libros SET codigo = :codigo, titulo = :titulo, autor = :autor, estado = :estado WHERE id = :id";
    
    try {
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':codigo', $codigo);
        $stmt->bindParam(':titulo', $titulo);
        $stmt->bindParam(':autor', $autor);
        $stmt->bindParam(':estado', $estado);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            echo json_encode(["exito" => true, "mensaje" => "¡El libro se actualizó correctamente!"]);
        } else {
            echo json_encode(["exito" => false, "mensaje" => "No se realizaron cambios en la base de datos."]);
        }
    } catch(PDOException $e) {
        echo json_encode(["exito" => false, "mensaje" => "Error SQL al editar: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["exito" => false, "mensaje" => "Faltan datos obligatorios para poder editar el libro."]);
}
?>