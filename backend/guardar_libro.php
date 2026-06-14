<?php
// backend/guardar_libro.php
ini_set('display_errors', 0);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    require 'conexion.php';
    $datos = json_decode(file_get_contents("php://input"), true);

    if (isset($datos['codigo']) && isset($datos['titulo']) && isset($datos['autor']) && isset($datos['estado'])) {
        
        $check = $pdo->prepare("SELECT codigo FROM libros WHERE codigo = ?");
        $check->execute([$datos['codigo']]);
        
        if ($check->rowCount() > 0) {
            echo json_encode(["exito" => false, "mensaje" => "El código ya está registrado"]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO libros (codigo, titulo, autor, estado) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $datos['codigo'],
            $datos['titulo'],
            $datos['autor'],
            $datos['estado']
        ]);

        echo json_encode(["exito" => true, "mensaje" => "Libro registrado en la Base de Datos"]);
    } else {
        echo json_encode(["exito" => false, "mensaje" => "Faltan datos en el formulario"]);
    }

} catch (Throwable $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error PHP: " . $e->getMessage()]);
}
?>