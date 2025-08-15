-- eMunicipality patch on top of fmt_db
-- Keeps old tables (harmless), adds new ones

CREATE TABLE IF NOT EXISTS municipalities (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    province    VARCHAR(50),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wards (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    municipality_id INT NOT NULL,
    name        VARCHAR(100),
    geom        POLYGON,               -- for future GIS queries
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (municipality_id) REFERENCES municipalities(id)
);

CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(50),
    last_name   VARCHAR(50),
    email       VARCHAR(100) UNIQUE,
    phone       VARCHAR(20),
    password_hash CHAR(60),
    role        ENUM('citizen','admin','worker') DEFAULT 'citizen',
    ward_id     INT,
    verified    BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ward_id) REFERENCES wards(id)
);

CREATE TABLE IF NOT EXISTS complaints (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    ward_id     INT,
    category    ENUM('water','roads','electricity','waste','other'),
    title       VARCHAR(255),
    description TEXT,
    location    POINT NOT NULL SRID 4326,
    photo_url   VARCHAR(512),
    status      ENUM('open','assigned','in_progress','resolved','closed') DEFAULT 'open',
    assigned_worker BIGINT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (assigned_worker) REFERENCES users(id),
    FOREIGN KEY (ward_id) REFERENCES wards(id),
    SPATIAL INDEX(location)
);

CREATE TABLE IF NOT EXISTS tasks (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    worker_id   BIGINT NOT NULL,
    due_date    DATE,
    status      ENUM('pending','started','completed','overdue') DEFAULT 'pending',
    notes       TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id),
    FOREIGN KEY (worker_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS news (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255),
    body        TEXT,
    image_url   VARCHAR(512),
    priority    ENUM('low','medium','high','emergency') DEFAULT 'medium',
    created_by  BIGINT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    type        ENUM('complaint_update','task_assigned','news','system'),
    title       VARCHAR(255),
    body        TEXT,
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Seed one municipality + one ward (Johannesburg)
INSERT INTO municipalities(name,province) VALUES ('Johannesburg','Gauteng');
INSERT INTO wards(municipality_id,name) VALUES (1,'Ward 1');