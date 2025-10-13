
# Informe Técnico del Proyecto: Control+

**Versión:** 1.0
**Fecha:** Noviembre 2025

---

## A. Fundamentos del Proyecto

### Resumen
Este documento abarca la propuesta y el desarrollo de "Control+", una plataforma web diseñada para la gestión de finanzas personales y de microemprendimientos. El enfoque principal es la simplicidad y la eficiencia, permitiendo a los usuarios registrar ingresos y gastos, crear presupuestos mensuales, y visualizar resúmenes claros de su actividad financiera, todo operando en Pesos Colombianos (COP).

### Palabras Clave
Aplicación web, Control de gastos, Finanzas personales, Next.js, MySQL, API REST.

### Introducción
La gestión de finanzas se ha convertido en una necesidad creciente en la vida cotidiana. A pesar de la existencia de múltiples aplicaciones en el mercado, muchas presentan una curva de aprendizaje elevada, interfaces sobrecargadas o carecen de soporte para contextos locales. **Control+** emerge como una solución tecnológica moderna, accesible y centrada en el usuario para quienes buscan tomar el control de sus finanzas de manera estratégica e intuitiva.

### Objetivo General
Diseñar y desplegar una aplicación web funcional (MVP) que permita a un usuario registrar y analizar sus finanzas personales (COP), con un sistema de autenticación seguro, presupuestos mensuales y un dashboard resumido, completamente funcional y lista para su despliegue en un entorno de producción.

### Objetivos Específicos

1.  **Implementar autenticación segura:** Crear un sistema robusto de registro e inicio de sesión de usuarios basado en tokens (JWT) y cookies seguras.
2.  **Crear módulos CRUD funcionales:** Desarrollar una API REST completa para la gestión de Cuentas, Categorías, Transacciones y Presupuestos.
3.  **Permitir importación CSV (Previsto):** Diseñar la estructura para una futura implementación que permita importar extractos bancarios en formato genérico.
4.  **Implementar Presupuesto mensual:** Permitir al usuario definir presupuestos por categoría y visualizar su ejecución en tiempo real en función de los gastos registrados.
5.  **Desarrollar Dashboard interactivo:** Mostrar métricas clave como balance mensual, distribución de gastos por categoría y tendencias de ingresos vs. gastos a lo largo del tiempo.
6.  **Desplegar en la nube:** Preparar la aplicación para un despliegue profesional en un proveedor de servicios en la nube que soporte Node.js y MySQL.

### Justificación
El proyecto **Control+** surge como una respuesta directa a la necesidad de una herramienta financiera digital que sea a la vez potente y sencilla. A diferencia de otras soluciones, evita:
*   **Interfaces complejas:** Se prioriza un diseño limpio y una experiencia de usuario intuitiva.
*   **Sobrecarga de funciones:** El MVP se centra en las características esenciales que el 90% de los usuarios necesitan, evitando la confusión.
*   **Barreras de acceso:** Es una solución de código abierto, sin costos de suscripción y adaptada a la moneda local (COP).

Este proyecto no solo resuelve un problema práctico, sino que también sirve como una demostración de la aplicación de tecnologías web modernas para crear productos robustos y escalables.

### Nombre del Proyecto y Tecnologías Utilizadas

*   **Nombre del Proyecto:** Control+
*   **Tecnologías:**
    *   **Framework Frontend/Backend:** Next.js con React y TypeScript.
    *   **Estilos:** Tailwind CSS con componentes de ShadCN UI.
    *   **Base de Datos:** MySQL (Relacional).
    *   **Entorno de Ejecución:** Node.js.
    *   **Autenticación:** JWT (JSON Web Tokens) sobre cookies HttpOnly.

---

## B. Ajuste Avanzado: Desarrollo y Arquitectura

### 1. Actualización de la Estructura del Proyecto

#### Cambios o mejoras respecto al planteamiento inicial:
El planteamiento inicial consideraba un enfoque más tradicional con tecnologías separadas (HTML, CSS, JS para el frontend y un backend aparte). Sin embargo, se tomó la decisión estratégica de migrar a una arquitectura unificada y moderna utilizando **Next.js**.

**¿Por qué el cambio a Next.js?**
*   **Full-Stack Integrado:** Next.js nos permite construir tanto el frontend interactivo (con React) como el backend (API Routes) dentro del mismo proyecto. Esto simplifica el desarrollo, el despliegue y el mantenimiento.
*   **Rendimiento y SEO:** Aunque es una aplicación que requiere inicio de sesión, Next.js ofrece optimizaciones de rendimiento superiores, como el renderizado en el servidor, que la hacen rápida y eficiente.
*   **Seguridad:** Las API Routes se ejecutan exclusivamente en el servidor, lo que nos permite conectar de forma segura a la base de datos sin exponer jamás las credenciales al cliente.

**Justificación del uso de MySQL:**
Mientras que bases de datos NoSQL como Firestore son excelentes para prototipado rápido, se eligió **MySQL** por su naturaleza relacional, que es ideal para datos financieros:
*   **Integridad de Datos:** Las transacciones, cuentas y usuarios tienen relaciones claras y estrictas. MySQL nos permite forzar esta integridad mediante claves foráneas (`FOREIGN KEY`), garantizando que no se puedan crear transacciones para cuentas que no existen, por ejemplo.
*   **Consultas Complejas:** El análisis financiero a menudo requiere `JOINs` y agregaciones complejas (ej. "sumar todos los gastos de la categoría 'Comida' en los últimos 3 meses"). SQL es un lenguaje extremadamente potente y optimizado para este tipo de consultas.
*   **Transaccionalidad (ACID):** MySQL garantiza que operaciones complejas (como una transferencia entre cuentas, que implica un débito y un crédito) se completen en su totalidad o no se realicen en absoluto, evitando inconsistencias en los datos.

#### Nuevas funcionalidades implementadas:
*   **Sistema de Autenticación Seguro:** Se implementó un flujo de autenticación completo usando **JWT** almacenados en **cookies `HttpOnly`**. Esto es más seguro que `localStorage` ya que protege contra ataques XSS.
*   **Middleware de Protección de Rutas:** Se creó un `middleware` en Next.js que intercepta todas las peticiones para verificar la validez de la sesión del usuario. Si el usuario no está autenticado, es redirigido automáticamente a la página de login.
*   **API RESTful Completa:** Se desarrollaron endpoints en `src/app/api/` para todas las entidades de la base de datos, gestionando las operaciones CRUD (Crear, Leer, Actualizar, Borrar) de forma centralizada.

#### Estado actual del desarrollo:
El proyecto se encuentra en una fase funcional. El modelo relacional está validado e implementado, la carga de datos iniciales (categorías) está automatizada, y las API para gestionar usuarios, cuentas, transacciones y presupuestos están completas y conectadas con la interfaz de usuario. El sistema de autenticación es robusto y aísla correctamente los datos de cada usuario.

### 2. Modelo Relacional (Ajustado y Validado)

El modelo de datos se ha diseñado para ser escalable y mantener la integridad.

*   **`users`**: Almacena la información básica de los usuarios para la autenticación.
*   **`accounts`**: Modela las distintas cuentas financieras. Utiliza un diseño polimórfico con campos `NULL` para diferenciar entre cuentas de débito/efectivo y tarjetas de crédito.
*   **`categories`**: Guarda las categorías de ingresos y gastos. Incluye un `user_id` que es `NULL` para las categorías predeterminadas y que apunta al usuario para futuras categorías personalizadas.
*   **`transactions`**: Es la tabla principal que registra cada movimiento financiero, conectando un usuario, una cuenta y una categoría.
*   **`budgets`**: Permite a los usuarios definir un límite de gasto mensual para una categoría específica.

#### Diagrama Relacional

*AQUÍ PUEDES INSERTAR LA CAPTURA DE PANTALLA DEL DIAGRAMA RELACIONAL GENERADO POR PHPMYADMIN, WORKBENCH O DBEAVER.*

![Diagrama Relacional](https://placehold.co/800x400?text=Insertar+Diagrama+Relacional+Aqu%C3%AD)

### 3. Script de Creación de la Base de Datos (DDL)

El siguiente script SQL contiene todas las sentencias `CREATE TABLE` y `INSERT` necesarias para inicializar la base de datos y cargar los datos por defecto.

```sql
-- Creación de la base de datos con el cotejamiento correcto
CREATE DATABASE control_plus_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos recién creada
USE control_plus_db;

-- Creación de la tabla `users`
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fullName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL COMMENT 'Contraseña hasheada',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Creación de la tabla `accounts`
CREATE TABLE `accounts` (
  `id` VARCHAR(255) PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('Bank', 'Cash', 'Wallet', 'Credit Card') NOT NULL,
  `currency` VARCHAR(3) DEFAULT 'COP',
  `initial_balance` DECIMAL(15, 2) DEFAULT 0.00,
  `credit_limit` DECIMAL(15, 2) DEFAULT 0.00,
  `closing_date` INT DEFAULT NULL,
  `initial_debt` DECIMAL(15, 2) DEFAULT 0.00,
  CONSTRAINT `fk_accounts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Creación de la tabla `categories`
CREATE TABLE `categories` (
  `id` VARCHAR(255) PRIMARY KEY,
  `user_id` INT DEFAULT NULL COMMENT 'NULL si es categoría por defecto',
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('Income', 'Expense') NOT NULL,
  `icon` VARCHAR(50) DEFAULT NULL,
  CONSTRAINT `fk_categories_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Creación de la tabla `transactions`
CREATE TABLE `transactions` (
  `id` VARCHAR(255) PRIMARY KEY,
  `account_id` VARCHAR(255) NOT NULL,
  `category_id` VARCHAR(255) NOT NULL,
  `user_id` INT NOT NULL,
  `date` DATETIME NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `type` ENUM('Income', 'Expense') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_transactions_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_transactions_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_transactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Creación de la tabla `budgets`
CREATE TABLE `budgets` (
  `id` VARCHAR(255) PRIMARY KEY,
  `category_id` VARCHAR(255) NOT NULL,
  `user_id` INT NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `month` VARCHAR(7) NOT NULL COMMENT 'Formato YYYY-MM',
  CONSTRAINT `fk_budgets_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_budgets_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_budget_per_user_month_category` (`user_id`, `category_id`, `month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar las categorías por defecto
INSERT INTO `categories` (`id`, `user_id`, `name`, `type`, `icon`) VALUES
('cat-1', NULL, 'Salario', 'Income', 'Briefcase'),
('cat-2', NULL, 'Mercado', 'Expense', 'ShoppingCart'),
('cat-3', NULL, 'Arriendo', 'Expense', 'Home'),
('cat-4', NULL, 'Transporte', 'Expense', 'Car'),
('cat-5', NULL, 'Entretenimiento', 'Expense', 'Ticket'),
('cat-6', NULL, 'Freelance', 'Income', 'Laptop'),
('cat-7', NULL, 'Servicios', 'Expense', 'Lightbulb'),
('cat-8', NULL, 'Salud', 'Expense', 'HeartPulse');
```

### 4. Consultas Básicas y Avanzadas (SQL)

A continuación se presentan ejemplos de consultas SQL que son fundamentales para la lógica de la aplicación.

#### A. Consultas Básicas

1.  **Seleccionar todas las transacciones de un usuario específico:**
    ```sql
    SELECT * FROM transactions WHERE user_id = 1;
    ```
2.  **Seleccionar los nombres de todas las cuentas bancarias ('Bank') de un usuario:**
    ```sql
    SELECT name, initial_balance FROM accounts WHERE user_id = 1 AND type = 'Bank';
    ```
3.  **Seleccionar todas las transacciones de gastos (`Expense`) realizadas en el mes de noviembre de 2025 para un usuario:**
    ```sql
    SELECT description, amount, date FROM transactions WHERE user_id = 1 AND type = 'Expense' AND date BETWEEN '2025-11-01' AND '2025-11-30';
    ```
4.  **Seleccionar los presupuestos de un usuario que superan los $500,000 COP:**
    ```sql
    SELECT * FROM budgets WHERE user_id = 1 AND amount > 500000;
    ```
5.  **Buscar transacciones cuya descripción contenga la palabra "mercado":**
    ```sql
    SELECT * FROM transactions WHERE user_id = 1 AND description LIKE '%mercado%';
    ```

#### B. Consultas con JOIN

1.  **Obtener las últimas 5 transacciones de un usuario con el nombre de la cuenta y el nombre de la categoría (INNER JOIN):**
    Esta consulta es clave para el componente "Transacciones Recientes" del dashboard.
    ```sql
    SELECT
        t.date,
        t.description,
        t.amount,
        t.type,
        a.name AS account_name,
        c.name AS category_name
    FROM transactions AS t
    INNER JOIN accounts AS a ON t.account_id = a.id
    INNER JOIN categories AS c ON t.category_id = c.id
    WHERE t.user_id = 1
    ORDER BY t.date DESC
    LIMIT 5;
    ```

2.  **Obtener todos los presupuestos de un usuario para un mes específico, junto con el total gastado en esa categoría, incluso si no ha habido gastos (LEFT JOIN):**
    Esta consulta es fundamental para la página de "Presupuestos", ya que nos permite mostrar "Gastado: $0" en las categorías donde aún no hay movimientos.
    ```sql
    SELECT
        b.id AS budget_id,
        c.name AS category_name,
        b.amount AS budget_amount,
        COALESCE(SUM(t.amount), 0) AS total_spent
    FROM budgets AS b
    INNER JOIN categories AS c ON b.category_id = c.id
    LEFT JOIN transactions AS t ON b.category_id = t.category_id AND b.user_id = t.user_id AND t.type = 'Expense' AND DATE_FORMAT(t.date, '%Y-%m') = b.month
    WHERE b.user_id = 1 AND b.month = '2025-11'
    GROUP BY b.id, c.name, b.amount
    ORDER BY category_name;
    ```

### 5. Evidencia del Desarrollo

En esta sección se deben incluir capturas de pantalla que demuestren el funcionamiento del sistema.

#### Estructura de la Base de Datos en phpMyAdmin

*AQUÍ PUEDES INSERTAR UNA CAPTURA DE PANTALLA DE PHPMYADMIN MOSTRANDO LA LISTA DE TABLAS (`accounts`, `users`, etc.) DENTRO DE LA BASE DE DATOS `control_plus_db`.*

![Estructura de la BD](https://placehold.co/800x400?text=Insertar+Captura+de+phpMyAdmin+Aqu%C3%AD)

#### Datos Insertados en las Tablas

*AQUÍ PUEDES INSERTAR CAPTURAS DE PANTALLA DE LA PESTAÑA "EXAMINAR" DE PHPMYADMIN PARA LAS TABLAS `users`, `accounts` Y `transactions`, MOSTRANDO ALGUNOS DATOS DE EJEMPLO.*

![Datos en Tabla Users](https://placehold.co/800x300?text=Insertar+Captura+de+Datos+de+la+Tabla+Users)

![Datos en Tabla Transactions](https://placehold.co/800x300?text=Insertar+Captura+de+Datos+de+la+Tabla+Transactions)

#### Resultados de Consultas SQL

*AQUÍ PUEDES INSERTAR CAPTURAS DE PANTALLA DE LA PESTAÑA "SQL" DE PHPMYADMIN DESPUÉS DE EJECUTAR ALGUNA DE LAS CONSULTAS `JOIN` PARA MOSTRAR LOS RESULTADOS TABULADOS.*

![Resultado de Consulta JOIN](https://placehold.co/800x400?text=Insertar+Captura+del+Resultado+de+una+Consulta+SQL)

#### Interfaz de la Aplicación

*AQUÍ PUEDES INSERTAR CAPTURAS DE PANTALLA DE LA APLICACIÓN FUNCIONANDO, COMO EL DASHBOARD, LA PÁGINA DE CUENTAS O EL FORMULARIO DE NUEVA TRANSACCIÓN.*

![Dashboard de Control+](https://placehold.co/800x450?text=Insertar+Captura+del+Dashboard+de+la+App)

### 6. Conclusión y Retos Técnicos

#### Reflexión Final
El desarrollo de **Control+** ha sido un ejercicio práctico de gran valor que ha permitido evolucionar desde un concepto simple a una aplicación web full-stack robusta y segura. La decisión de migrar de una arquitectura básica a una basada en Next.js y MySQL ha elevado significativamente la calidad y el potencial del proyecto, sentando las bases para un producto escalable y listo para el mundo real. La arquitectura actual garantiza la integridad de los datos, la seguridad del usuario y una experiencia de desarrollo moderna y eficiente.

#### Dificultades Técnicas Encontradas
1.  **Gestión de Sesiones y Autenticación:** El principal reto fue pasar de un sistema de identificación de usuario inseguro y no persistente (basado en `localStorage`) a un sistema profesional con cookies `HttpOnly` y un middleware de protección. Esto requirió una reestructuración significativa de la lógica de autenticación tanto en el cliente como en el servidor.
2.  **Aislamiento de Datos del Usuario:** Inicialmente, las consultas a la API no filtraban correctamente por `user_id`, lo que provocaba que todos los usuarios vieran los mismos datos. Corregir esto implicó refactorizar todas las API Routes para obtener el ID del usuario desde la sesión del servidor en lugar de confiar en el cliente, lo cual fue un paso crítico para la seguridad y la privacidad.
3.  **Cálculos Financieros Dinámicos:** Implementar la lógica para que el balance de las cuentas y el progreso de los presupuestos se actualizaran en tiempo real en función de las transacciones fue un desafío. Requirió combinar de manera eficiente la lógica del lado del cliente (para la reactividad de la UI) con consultas precisas en el lado del servidor (`data-service.ts`).

#### Aspectos Pendientes o a Mejorar
*   **Importación de CSV:** Implementar el módulo completo para que los usuarios puedan subir sus extractos bancarios.
*   **Edición y Personalización:** Permitir a los usuarios editar cuentas existentes y crear sus propias categorías de gastos/ingresos.
*   **Notificaciones:** Desarrollar un sistema de notificaciones para alertar sobre presupuestos a punto de excederse o fechas de corte de tarjetas de crédito.
*   **Optimización de Consultas:** A medida que la cantidad de transacciones crezca, será necesario analizar y optimizar las consultas SQL más complejas para mantener el rendimiento de la aplicación.

#### Aprendizajes Obtenidos
El proyecto ha reforzado la importancia de diseñar una arquitectura de backend sólida desde el principio. Se ha obtenido un aprendizaje profundo sobre la creación de API RESTful seguras con Next.js, la gestión de sesiones con JWT y cookies, y el diseño de un modelo de datos relacional eficiente en MySQL para una aplicación financiera. La transición de un prototipo a una aplicación funcional ha sido la lección más valiosa del proceso.
