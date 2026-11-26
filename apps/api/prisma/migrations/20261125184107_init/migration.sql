-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `edition` VARCHAR(191) NOT NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'LAST_ARCHIVED', 'HIDDEN') NOT NULL DEFAULT 'DRAFT',
    `tagline` VARCHAR(191) NOT NULL,
    `slogan` VARCHAR(191) NOT NULL,
    `dateText` VARCHAR(191) NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `distanceLabel` VARCHAR(191) NOT NULL,
    `realDistance` VARCHAR(191) NOT NULL,
    `whatsappNumber` VARCHAR(191) NOT NULL,
    `socialHandle` VARCHAR(191) NOT NULL,
    `desktopCoverId` VARCHAR(191) NULL,
    `mobileCoverId` VARCHAR(191) NULL,
    `stats` JSON NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Event_edition_key`(`edition`),
    INDEX `Event_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PricingTier` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NOT NULL,
    `priceSoles` INTEGER NOT NULL,
    `status` ENUM('ACTIVE', 'UPCOMING', 'SOLD_OUT') NOT NULL DEFAULT 'UPCOMING',
    `totalSlots` INTEGER NOT NULL DEFAULT 100,
    `availableSlots` INTEGER NOT NULL DEFAULT 100,
    `benefits` JSON NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PricingTier_eventId_status_idx`(`eventId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaItem` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `type` ENUM('IMAGE', 'VIDEO') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `driveFileId` VARCHAR(191) NULL,
    `youtubeId` VARCHAR(191) NULL,
    `thumbnailDriveId` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MediaItem_eventId_type_idx`(`eventId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Registration` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `pricingTierId` VARCHAR(191) NOT NULL,
    `dni` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `shirtSize` VARCHAR(191) NOT NULL,
    `emergencyContact` VARCHAR(191) NOT NULL,
    `emergencyPhone` VARCHAR(191) NOT NULL,
    `amountPaid` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `paymentRef` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Registration_eventId_status_idx`(`eventId`, `status`),
    UNIQUE INDEX `Registration_eventId_dni_key`(`eventId`, `dni`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PricingTier` ADD CONSTRAINT `PricingTier_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MediaItem` ADD CONSTRAINT `MediaItem_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_pricingTierId_fkey` FOREIGN KEY (`pricingTierId`) REFERENCES `PricingTier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
