<?php
// backend/buscar.php
ini_set('display_errors', 0); // Evitar que errores de PHP rompan el JSON
header('Content-Type: application/json'); 
header('Access-Control-Allow-Origin: *'); 

try {
    require 'conexion.php'; 

    if (isset($_GET['codigo'])) {
        $codigo = $_GET['codigo'];

        // Buscamos coincidencia en nuestra columna original 'codigo'
        $stmt = $pdo->prepare("SELECT * FROM libros WHERE codigo = :codigo");
        $stmt->execute(['codigo' => $codigo]);
        $libro = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($libro) {
            echo json_encode([
                "encontrado" => true,
                "titulo" => $libro['titulo'],
                "autor" => $libro['autor'],
                "estado" => $libro['estado']
            ]);
        } else {
            echo json_encode(["encontrado" => false, "mensaje" => "No se encontró el libro con ese código"]);
        }
    } else {
        echo json_encode(["encontrado" => false, "mensaje" => "Falta el parámetro código"]);
    }
} catch (Throwable $e) {
    // Atrapamos cualquier error de base de datos y lo enviamos como JSON limpio
    echo json_encode([
        "encontrado" => false, 
        "mensaje" => "Error del servidor PHP: " . $e->getMessage()
    ]);
}
?>