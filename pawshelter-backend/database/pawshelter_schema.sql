-- Paw Shelter Database Schema & Initial Seed
-- For phpMyAdmin import or direct MySQL execution

CREATE DATABASE IF NOT EXISTS `pawshelter` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `pawshelter`;

-- Table structure for animals
CREATE TABLE IF NOT EXISTS `animals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `breed` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `weight` decimal(8,2) NOT NULL,
  `age` int unsigned DEFAULT NULL,
  `gender` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `personality` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for adoption_requests
CREATE TABLE IF NOT EXISTS `adoption_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `animal_id` bigint unsigned NOT NULL,
  `applicant_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `housing_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pet_experience` text COLLATE utf8mb4_unicode_ci,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `adoption_requests_animal_id_foreign` (`animal_id`),
  CONSTRAINT `adoption_requests_animal_id_foreign` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Seed Animals
INSERT INTO `animals` (`name`, `breed`, `weight`, `age`, `gender`, `description`, `personality`, `image`, `category`)
VALUES
('Farquad', 'Shih Tzu Mix', 5.20, 2, 'Male', 'Rescued from an abandoned building in Manila. Gentle-natured, loves treats, and gets along well with other small dogs.', 'Affectionate, quiet, couch-potato, easygoing with humans.', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80', 'priority'),
('Blacky', 'Aspin (Native)', 14.50, 3, 'Male', 'High-energy rescue found wandering near Quezon City circle. Fully vaccinated and eager to find an active family.', 'Loyal, energetic, great watch-companion, highly trainable.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80', 'priority'),
('Beverly', 'Domestic Shorthair', 3.80, 1, 'Female', 'Playful kitten rescued from a drainage pipe. She loves feather wands, warm laps, and window watching.', 'Curious, purrs constantly, friendly with children.', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80', 'priority'),
('Abdul', 'Labrador Mix', 21.00, 4, 'Male', 'Rescued as a stray pup, now a gentle giant who walks smoothly on a leash and loves belly rubs.', 'Calm, patient, friendly with dogs and kids alike.', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80', 'normal'),
('Lee', 'Tabby Cat', 4.20, 2, 'Male', 'Calm feline rescued near our Katipunan shelter. Fully neutered and litter-trained.', 'Independent, serene, loves sunbathing and chin scratches.', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80', 'normal'),
('Ismail', 'Calico Cat', 3.50, 2, 'Female', 'Sweet and social calico looking for a calm home. Gets along well with other friendly pets.', 'Gentle, vocal when dinner is served, cuddly.', 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80', 'normal')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);
