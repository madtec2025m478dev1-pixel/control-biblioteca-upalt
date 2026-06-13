CREATE TABLE Libros (
    id_libro INT AUTO_INCREMENT PRIMARY KEY,
    codigo_barras VARCHAR(50) UNIQUE NOT NULL, -- Nueva columna para el escáner
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    ISBN VARCHAR(20) NOT NULL,
    estado VARCHAR(20) DEFAULT 'Disponible'
);

INSERT INTO Libros (codigo_barras, titulo, autor,  ISBN, estado) VALUES
('LIB-0001', 'El principito', 'Antoine de Saint-Exupéry', '9786074154429', 'Disponible'),
('LIB-0002', 'Harry Potter y la piedra filosofal', 'J.K. Rowling', '9788418173004', 'Disponible'),
('LIB-0003', '1984', 'George Orwell', '9788499890944', 'Disponible'),
('LIB-0004', 'Cien años de soledad', 'Gabriel García Márquez', '9780307474728', 'Prestado'),
('LIB-0005', 'Don Quijote de la Mancha', 'Miguel de Cervantes', '9788468231648', 'Disponible');







