<?php
// backend/obtener_libros.php
ini_set('display_errors', 0);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    require 'conexion.php';
    
    // Hacemos la consulta para traer todos los libros ordenados por el último agregado
    $stmt = $pdo->query("SELECT * FROM libros ORDER BY id DESC");
    $libros = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Devolvemos la lista de libros en formato JSON
    echo json_encode([
        "exito" => true, 
        "libros" => $libros
    ]);

} catch (Throwable $e) {
    // Si hay un error, devolvemos el mensaje sin romper el JSON
    echo json_encode([
        "exito" => false, 
        "mensaje" => "Error al obtener inventario: " . $e->getMessage()
    ]);
}
?>