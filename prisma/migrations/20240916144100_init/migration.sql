-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'APPROVER', 'ADMIN') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Team` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Card` (
    `id` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `network` ENUM('MC', 'VISA') NOT NULL DEFAULT 'VISA',
    `las4` VARCHAR(191) NOT NULL,
    `cardStatus` ENUM('PENDING', 'ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `cardId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `datetime` DATETIME(3) NOT NULL,
    `merchant` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Approver` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `role` ENUM('USER', 'APPROVER', 'ADMIN') NULL,
    `policyId` VARCHAR(191) NOT NULL,
    `hierarchy` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Approver_userId_policyId_role_key`(`userId`, `policyId`, `role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApprovalRequest` (
    `id` VARCHAR(191) NOT NULL,
    `policyId` VARCHAR(191) NOT NULL,
    `approverId` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `approvedById` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Policy` (
    `id` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `isForAll` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HierarchyRequirement` (
    `id` VARCHAR(191) NOT NULL,
    `policyId` VARCHAR(191) NOT NULL,
    `hierarchy` INTEGER NOT NULL,
    `minApprovers` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Condition` (
    `id` VARCHAR(191) NOT NULL,
    `policyId` VARCHAR(191) NOT NULL,
    `field` ENUM('amount', 'merchant', 'cardId', 'userId') NOT NULL,
    `operator` ENUM('EQUALS', 'GREATER_THAN', 'LESS_THAN') NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Approver` ADD CONSTRAINT `Approver_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Approver` ADD CONSTRAINT `Approver_policyId_fkey` FOREIGN KEY (`policyId`) REFERENCES `Policy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalRequest` ADD CONSTRAINT `ApprovalRequest_policyId_fkey` FOREIGN KEY (`policyId`) REFERENCES `Policy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalRequest` ADD CONSTRAINT `ApprovalRequest_approverId_fkey` FOREIGN KEY (`approverId`) REFERENCES `Approver`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalRequest` ADD CONSTRAINT `ApprovalRequest_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApprovalRequest` ADD CONSTRAINT `ApprovalRequest_approvedById_fkey` FOREIGN KEY (`approvedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Policy` ADD CONSTRAINT `Policy_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HierarchyRequirement` ADD CONSTRAINT `HierarchyRequirement_policyId_fkey` FOREIGN KEY (`policyId`) REFERENCES `Policy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Condition` ADD CONSTRAINT `Condition_policyId_fkey` FOREIGN KEY (`policyId`) REFERENCES `Policy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- -------------------------------------------------------------
-- TablePlus 6.1.2(568)
--
-- https://tableplus.com/
--
-- Database: Clyr
-- Generation Time: 2024-09-16 14:58:34.8420
-- -------------------------------------------------------------
-- -------------------------------------------------------------
-- TablePlus 6.1.2(568)
--
-- https://tableplus.com/
--
-- Database: Clyr
-- Generation Time: 2024-09-16 15:46:50.4140
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


INSERT INTO `ApprovalRequest` (`id`, `policyId`, `approverId`, `transactionId`, `status`, `approvedById`) VALUES
('ecc3184d-41be-4228-8e56-13ea6d6a5483', 'ecc3184d-41be-4228-8e56-13ea6d6a5481', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', 'PENDING', 'ecc3184d-41be-4228-8e56-13ea6d6a5482'),
('ecc3184d-41be-4228-8e56-13ea6d6a54832', 'ecc3184d-41be-4228-8e56-13ea6d6a5481', 'ecc3184d-41be-4228-8e56-13ea6d6a5482', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', 'PENDING', 'ecc3184d-41be-4228-8e56-13ea6d6a5482'),
('ecc3184d-41be-4228-8e56-13ea6d6a5484', 'ecc3184d-41be-4228-8e56-13ea6d6a5481', 'ecc3184d-41be-4228-8e56-13ea6d6a5484', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', 'PENDING', 'ecc3184d-41be-4228-8e56-13ea6d6a5482');

INSERT INTO `Approver` (`id`, `userId`, `role`, `policyId`, `hierarchy`) VALUES
('11fb1497-e500-4c83-9ca9-4c6b6d4469b0', NULL, 'USER', '0ca80d46-2732-49ba-a9a5-0505944f6160', 4),
('3ce722ca-19c2-4615-956e-1d87b934bf56', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', NULL, '0ca80d46-2732-49ba-a9a5-0505944f6160', 3),
('ecc3184d-41be-4228-8e56-13ea6d6a5482', NULL, 'APPROVER', 'ecc3184d-41be-4228-8e56-13ea6d6a5481', 0),
('ecc3184d-41be-4228-8e56-13ea6d6a5483', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', NULL, 'ecc3184d-41be-4228-8e56-13ea6d6a5481', 0),
('ecc3184d-41be-4228-8e56-13ea6d6a5484', 'ecc3184d-41be-4228-8e56-13ea6d6a5482', NULL, 'ecc3184d-41be-4228-8e56-13ea6d6a5481', 1);

INSERT INTO `Card` (`id`, `teamId`, `userId`, `network`, `las4`, `cardStatus`) VALUES
('ecc3184d-41be-4228-8e56-13ea6d6a5482', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', 'ecc3184d-41be-4228-8e56-13ea6d6a5482', 'MC', '1234', 'ACTIVE'),
('ecc3184d-41be-4228-8e56-13ea6d6a5483', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', 'VISA', '1234', 'ACTIVE');

INSERT INTO `Condition` (`id`, `policyId`, `field`, `operator`, `value`) VALUES
('be0f1979-24f3-4c12-9e31-78aae692e406', '0ca80d46-2732-49ba-a9a5-0505944f6160', 'amount', 'GREATER_THAN', '1000'),
('ddeb748d-2003-4d4b-aa74-493c1def8f47', '0ca80d46-2732-49ba-a9a5-0505944f6160', 'merchant', 'EQUALS', 'Amazon'),
('ecc3184d-41be-4228-8e56-13ea6d6a5481', 'ecc3184d-41be-4228-8e56-13ea6d6a5481', 'amount', 'GREATER_THAN', '100'),
('ecc3184d-41be-4228-8e56-13ea6d6a5483', 'ecc3184d-41be-4228-8e56-13ea6d6a5481', 'cardId', 'EQUALS', 'ecc3184d-41be-4228-8e56-13ea6d6a5483');

INSERT INTO `HierarchyRequirement` (`id`, `policyId`, `hierarchy`, `minApprovers`) VALUES
('62da94a7-f0b5-40c1-a8c7-04a9d6eff4d2', '0ca80d46-2732-49ba-a9a5-0505944f6160', 3, 1),
('a19c07fb-6433-457b-a691-82d4ef8f6af3', '0ca80d46-2732-49ba-a9a5-0505944f6160', 4, 2),
('ecc3184d-41be-4228-8e56-13ea6d6a5482', 'ecc3184d-41be-4228-8e56-13ea6d6a5481', 1, 1),
('ecc3184d-41be-4228-8e56-13ea6d6a5483', 'ecc3184d-41be-4228-8e56-13ea6d6a5481', 0, 2);

INSERT INTO `Policy` (`id`, `teamId`, `isForAll`) VALUES
('0ca80d46-2732-49ba-a9a5-0505944f6160', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', 0),
('ecc3184d-41be-4228-8e56-13ea6d6a5481', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', 0);

INSERT INTO `Team` (`id`, `name`) VALUES
('ecc3184d-41be-4228-8e56-13ea6d6a5483', 'Team1');

INSERT INTO `Transaction` (`id`, `teamId`, `cardId`, `amount`, `datetime`, `merchant`, `status`) VALUES
('ecc3184d-41be-4228-8e56-13ea6d6a5483', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', 1000, '2024-09-16 17:58:15.494', 'Home Depot', 'PENDING');

INSERT INTO `User` (`id`, `teamId`, `name`, `email`, `phone`, `role`) VALUES
('ecc3184d-41be-4228-8e56-13ea6d6a5482', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', 'User 2', 'myEmailClyr2@mailinator.com', '1234567891', 'APPROVER'),
('ecc3184d-41be-4228-8e56-13ea6d6a5483', 'ecc3184d-41be-4228-8e56-13ea6d6a5483', 'User 1', 'myEmailClyr1@mailinator.com', '1234567890', 'ADMIN');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
