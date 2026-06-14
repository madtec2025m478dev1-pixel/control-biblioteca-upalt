<?php
// backend/conexion.php
$host = 'localhost';
$db   = 'biblioteca_db';
$user = 'root'; // Usuario por defecto en XAMPP
$pass = '';     // Sin contraseña por defecto en XAMPP

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    // Configurar PDO para que lance excepciones si hay errores
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Si falla la conexión, devolvemos el error en formato JSON
    die(json_encode(["error" => "Error de conexión a la BD: " . $e->getMessage()]));
}
?>