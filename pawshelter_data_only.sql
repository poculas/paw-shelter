-- Pawshelter DATA-ONLY import
-- Imports records into tables that already exist; CREATE TABLE statements are omitted.
-- Import into the existing pawshelter database only after making a fresh export/backup.
-- This file contains sample/application records from the supplied dump.
-- Do not import repeatedly: duplicate primary keys may cause errors.
-- Session records are intentionally omitted because they are temporary and may be stale.

SET NAMES utf8mb4;
SET time_zone = '+00:00';
START TRANSACTION;

INSERT INTO `animals` (`id`, `name`, `breed`, `weight`, `age`, `gender`, `description`, `personality`, `image`, `category`, `created_at`, `updated_at`) VALUES

(4, 'Nora', 'Persian', 4.00, 4, 'Female', 'Abandoned by previous owners as they claim the cat was possessed.', 'Very loving, watches over you... ALL-THE-TIME.', 'https://res.cloudinary.com/dn64fatsy/image/upload/v1791890209/paw-shelter/es3ttu8aldtjr9yvuhal.jpg', 'normal', '2026-10-13 03:16:50', '2026-10-13 03:18:09'),

(5, 'Fredric', 'Unknown', 2.00, 1, 'Male', 'Rescued from an illegal Russian-led experimental lab in Chicago.', 'Shaking but super friendly and purrs all the time', 'https://res.cloudinary.com/dn64fatsy/image/upload/v1791890379/paw-shelter/rmsderhpudbwdk5qoomg.jpg', 'priority', '2026-10-13 03:19:41', '2026-10-13 03:19:41');

INSERT INTO `adoption_requests` (`id`, `animal_id`, `applicant_name`, `email`, `phone`, `address`, `housing_type`, `pet_experience`, `notes`, `status`, `created_at`, `updated_at`) VALUES

(2, 5, 'Salucop, Rochelle Ann C.', 'poculas.nna@gmail.com', '09155836243', '2195 N. Cuevas street', 'House with fenced yard', '3 American Bullies, 1 Corgi, 1 askal all living peacefully', 'does the animal have allergies?', 'Pending', '2026-10-13 03:21:31', '2026-10-13 03:21:31');

COMMIT;
