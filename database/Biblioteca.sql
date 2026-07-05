-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-07-2026 a las 11:03:30
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `biblioteca_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros`
--

CREATE TABLE `libros` (
  `id` int(11) NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `autor` varchar(150) NOT NULL,
  `estado` varchar(20) DEFAULT 'Disponible'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`id`, `codigo`, `titulo`, `autor`, `estado`) VALUES
(2, '9788496886384', 'Ronaldo: su asombrosa historia', 'Michael Part', 'Disponible'),
(5, '9781688821231', 'EDUCANDO A LA REALEZA \"Regresando al modelo educativo divino\"', 'Isaias Valdivia', 'Disponible'),
(6, '9786071401779', 'Diccionario de Química', 'Javier Rosas', 'Disponible'),
(7, '9786076221990', 'Informatica Basica', 'MEDIActive', 'Disponible'),
(8, '9789684443648', 'UML Gota a Gota', 'Martin Fowler y Kendall Scott.', 'Disponible'),
(9, '97888478978533', 'Domine Microsoft Office 2007', 'Francisco Pascual y Mª Carmen Morales.', 'Disponible'),
(10, '9786077854326', 'Mecatronica', 'William Bolton.', 'Disponible'),
(11, '9783642057489', 'Logical and Relational Learning', 'Luc De Raedt.', 'Disponible'),
(12, '9701703995', 'Organizacion y arquitecturas de computadoras', 'William Stallings.', 'Disponible'),
(13, '9789701063859', 'Mecatronica y los sistemas de medicion', 'David G. Alciatore y Michael B. Histand.', 'Disponible'),
(14, '9788420531342', 'Seguridad en Java', 'Jamie Jaworski y Paul J. Perrone.', 'Disponible'),
(15, '9686199373', 'Algebra Lovaglia', 'Florence M. Lovaglia', 'Disponible'),
(16, '9786077071143', 'Ciencia de materiales', 'James Newell.', 'Disponible');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `libros`
--
ALTER TABLE `libros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
