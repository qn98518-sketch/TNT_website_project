-- TNT CMS: MySQL 8.0+ / MariaDB 10.4+, utf8mb4, InnoDB.
-- Run with: php backend/bin/console.php migrate
-- No default credentials are inserted. Create the single admin using the CLI.
CREATE TABLE IF NOT EXISTS cms_users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
  display_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','editor','viewer') NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  admin_slot TINYINT GENERATED ALWAYS AS (CASE WHEN role = 'admin' THEN 1 ELSE NULL END) STORED,
  auth_version INT UNSIGNED NOT NULL DEFAULT 1,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY one_fixed_admin (admin_slot)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_leads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email_or_phone VARCHAR(254) NOT NULL,
  company VARCHAR(160) NOT NULL,
  interest VARCHAR(160) NOT NULL,
  industry VARCHAR(160) NOT NULL DEFAULT '',
  company_size VARCHAR(80) NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  consent BOOLEAN NOT NULL,
  context ENUM('general','food-processing','erp','outsourcing','body-shop') NOT NULL,
  source VARCHAR(300) NOT NULL,
  details JSON NOT NULL,
  status ENUM('new','contacted','in_progress','closed','spam') NOT NULL DEFAULT 'new',
  notes TEXT NOT NULL,
  submission_key CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NULL UNIQUE,
  payload_hash CHAR(64) CHARACTER SET ascii NULL,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lead_created_by FOREIGN KEY (created_by) REFERENCES cms_users(id) ON DELETE SET NULL,
  CONSTRAINT lead_updated_by FOREIGN KEY (updated_by) REFERENCES cms_users(id) ON DELETE SET NULL,
  KEY lead_status_created (status, created_at),
  KEY lead_context_created (context, created_at),
  KEY lead_created (created_at, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_audit_log (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_id BIGINT UNSIGNED NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(30) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  metadata JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT audit_actor FOREIGN KEY (actor_id) REFERENCES cms_users(id) ON DELETE SET NULL,
  KEY audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_rate_limits (
  bucket CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  hits INT UNSIGNED NOT NULL DEFAULT 1,
  expires_at DATETIME NOT NULL,
  KEY rate_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER $$
CREATE TRIGGER cms_protect_admin_delete BEFORE DELETE ON cms_users FOR EACH ROW
BEGIN
  IF OLD.role = 'admin' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The fixed admin cannot be deleted';
  END IF;
END$$
CREATE TRIGGER cms_protect_admin_update BEFORE UPDATE ON cms_users FOR EACH ROW
BEGIN
  IF OLD.role = 'admin' AND (NEW.role <> 'admin' OR NEW.active <> 1 OR NEW.username <> OLD.username) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The fixed admin identity and role are immutable';
  END IF;
END$$
DELIMITER ;
