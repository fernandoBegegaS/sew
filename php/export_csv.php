<?php
session_start();
require_once 'db.php';

$database = new Database();
$db = $database->getConnection();

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=publicaciones.csv');

$output = fopen('php://output', 'w');

fwrite($output, "\xEF\xBB\xBF");

fputcsv($output, ['Título', 'Contenido', 'Categorías', 'Autor', 'Comentarios'], ';');

$query = "
    SELECT p.id, p.title, p.content, u.username,
    GROUP_CONCAT(DISTINCT c.name ORDER BY c.name ASC SEPARATOR ',') AS categories,
    GROUP_CONCAT(DISTINCT CONCAT(cu.username, ':', com.content) ORDER BY com.id ASC SEPARATOR ',') AS comments
    FROM posts p
    INNER JOIN users u ON p.user_id = u.id
    LEFT JOIN post_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.name
    LEFT JOIN comments com ON com.post_id = p.id
    LEFT JOIN users cu ON com.user_id = cu.id
    GROUP BY p.id
";
$stmt = $db->prepare($query);
$stmt->execute();

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    fputcsv($output, [
        $row['title'],
        $row['content'],
        $row['categories'],
        $row['username'],
        $row['comments']
    ], ';');
}

fclose($output);
?>
