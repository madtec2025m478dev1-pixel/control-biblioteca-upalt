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

if (!empty($datos->id)) {
    $sql = "DELETE FROM libros WHERE id = :id";
    try {
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id', $datos->id, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            echo json_encode(["exito" => true, "mensaje" => "El libro fue eliminado del inventario."]);
        } else {
            echo json_encode(["exito" => false, "mensaje" => "No se pudo eliminar el libro."]);
        }
    } catch(PDOException $e) {
        echo json_encode(["exito" => false, "mensaje" => "Error SQL al borrar: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["exito" => false, "mensaje" => "ID no válido para eliminar."]);
}
?>