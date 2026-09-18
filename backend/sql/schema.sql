-- Smart Scheduler — MySQL schema
-- Run this once against a fresh database: mysql -u root -p smart_scheduler < sql/schema.sql

CREATE DATABASE IF NOT EXISTS smart_scheduler CHARACTER SET utf8mb4;
USE smart_scheduler;

-- The staff roster: everyone who can be assigned to an event.
-- A user account with role='Staff' links here via users.staff_id.
CREATE TABLE IF NOT EXISTS staff (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  skills JSON NOT NULL,
  seniority ENUM('Junior','Mid','Senior','Lead') NOT NULL DEFAULT 'Junior',
  hours_available INT NOT NULL DEFAULT 20,
  hours_booked INT NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) NOT NULL DEFAULT 4.0,
  next_available DATE NULL,
  assigned_events INT NOT NULL DEFAULT 0
);

-- Login accounts. role='Staff' accounts should always have a matching staff_id
-- (created automatically at registration) — this is the exact bug class the
-- old localStorage version hit, so the backend enforces it at creation time.
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Admin','Manager','Staff') NOT NULL,
  staff_id BIGINT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS events (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(200) NOT NULL,
  status ENUM('open','scheduled','in-progress','completed') NOT NULL DEFAULT 'open',
  required_skills JSON NOT NULL,
  required_seniority ENUM('Junior','Mid','Senior','Lead') NOT NULL DEFAULT 'Mid',
  required_staff INT NOT NULL DEFAULT 1,
  assigned_staff INT NOT NULL DEFAULT 0,
  budget DECIMAL(12,2) NOT NULL DEFAULT 0,
  spent DECIMAL(12,2) NOT NULL DEFAULT 0,
  attendees INT NOT NULL DEFAULT 0,
  complexity DECIMAL(3,2) NOT NULL DEFAULT 0.5,
  check_in_code VARCHAR(8) NOT NULL
);

CREATE TABLE IF NOT EXISTS assignments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  staff_id BIGINT NOT NULL,
  event_id BIGINT NOT NULL,
  UNIQUE KEY uniq_staff_event (staff_id, event_id),
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  staff_id BIGINT NOT NULL,
  event_id BIGINT NOT NULL,
  staff_name VARCHAR(120) NOT NULL, -- denormalized snapshot, see ScheduleContext history
  status ENUM('pending','approved','declined') NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS checkins (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  staff_id BIGINT NOT NULL,
  event_id BIGINT NOT NULL,
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_checkin (staff_id, event_id),
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  action VARCHAR(40) NOT NULL,
  detail VARCHAR(255) NOT NULL,
  user VARCHAR(120) NOT NULL,
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
