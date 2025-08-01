-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `santri` (
    `id` VARCHAR(191) NOT NULL,
    `nis` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `birthPlace` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `enrollmentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `graduationDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `waliId` VARCHAR(191) NOT NULL,
    `halaqahId` VARCHAR(191) NULL,

    UNIQUE INDEX `santri_nis_key`(`nis`),
    INDEX `santri_halaqahId_fkey`(`halaqahId`),
    INDEX `santri_waliId_fkey`(`waliId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `musyrif` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `birthPlace` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `specialization` VARCHAR(191) NULL,
    `joinDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `photo` VARCHAR(191) NULL,
    `educationData` VARCHAR(191) NULL,
    `experienceData` VARCHAR(191) NULL,
    `certificatesData` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    INDEX `musyrif_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `halaqah` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `capacity` INTEGER NOT NULL DEFAULT 20,
    `level` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `musyrifId` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'QURAN',

    UNIQUE INDEX `halaqah_musyrifId_key`(`musyrifId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `halaqah_schedules` (
    `id` VARCHAR(191) NOT NULL,
    `dayOfWeek` INTEGER NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `room` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `halaqahId` VARCHAR(191) NOT NULL,

    INDEX `halaqah_schedules_halaqahId_fkey`(`halaqahId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `halaqah_materials` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `content` TEXT NULL,
    `fileUrl` VARCHAR(191) NULL,
    `material_order` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `halaqahId` VARCHAR(191) NOT NULL,

    INDEX `halaqah_materials_halaqahId_fkey`(`halaqahId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `halaqah_progress` (
    `id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'NOT_STARTED',
    `notes` VARCHAR(191) NULL,
    `grade` INTEGER NULL,
    `startDate` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `santriId` VARCHAR(191) NOT NULL,
    `materialId` VARCHAR(191) NOT NULL,

    INDEX `halaqah_progress_santriId_fkey`(`santriId`),
    INDEX `halaqah_progress_materialId_fkey`(`materialId`),
    UNIQUE INDEX `halaqah_progress_santriId_materialId_key`(`santriId`, `materialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hafalan` (
    `id` VARCHAR(191) NOT NULL,
    `surahId` INTEGER NOT NULL,
    `surahName` VARCHAR(191) NOT NULL,
    `ayahStart` INTEGER NOT NULL,
    `ayahEnd` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `grade` INTEGER NULL,
    `notes` VARCHAR(191) NULL,
    `recordedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `santriId` VARCHAR(191) NOT NULL,
    `musyrifId` VARCHAR(191) NOT NULL,
    `audioUrl` VARCHAR(191) NULL,

    INDEX `hafalan_musyrifId_fkey`(`musyrifId`),
    INDEX `hafalan_santriId_fkey`(`santriId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hafalan_progress` (
    `id` VARCHAR(191) NOT NULL,
    `santriId` VARCHAR(191) NOT NULL,
    `surahId` INTEGER NOT NULL,
    `surahName` VARCHAR(191) NOT NULL,
    `totalAyah` INTEGER NOT NULL,
    `memorized` INTEGER NOT NULL DEFAULT 0,
    `inProgress` INTEGER NOT NULL DEFAULT 0,
    `lastAyah` INTEGER NOT NULL DEFAULT 0,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `targetDate` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'IN_PROGRESS',
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `hafalan_progress_santriId_fkey`(`santriId`),
    UNIQUE INDEX `hafalan_progress_santriId_surahId_key`(`santriId`, `surahId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `checkInTime` DATETIME(3) NULL,
    `checkOutTime` DATETIME(3) NULL,
    `notes` VARCHAR(191) NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `photo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `santriId` VARCHAR(191) NOT NULL,
    `halaqahId` VARCHAR(191) NOT NULL,
    `musyrifId` VARCHAR(191) NOT NULL,

    INDEX `attendance_halaqahId_fkey`(`halaqahId`),
    INDEX `attendance_musyrifId_fkey`(`musyrifId`),
    UNIQUE INDEX `attendance_santriId_halaqahId_date_key`(`santriId`, `halaqahId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `paidDate` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `method` VARCHAR(191) NULL,
    `reference` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `midtransToken` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `santriId` VARCHAR(191) NOT NULL,

    INDEX `payments_santriId_fkey`(`santriId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spp_settings` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `level` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spp_records` (
    `id` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `paidDate` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `paidAmount` DOUBLE NOT NULL DEFAULT 0,
    `discount` DOUBLE NOT NULL DEFAULT 0,
    `fine` DOUBLE NOT NULL DEFAULT 0,
    `notes` VARCHAR(191) NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `receiptNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `santriId` VARCHAR(191) NOT NULL,
    `sppSettingId` VARCHAR(191) NOT NULL,
    `transactionId` VARCHAR(191) NULL,

    UNIQUE INDEX `spp_records_transactionId_key`(`transactionId`),
    INDEX `spp_records_sppSettingId_fkey`(`sppSettingId`),
    UNIQUE INDEX `spp_records_santriId_month_year_key`(`santriId`, `month`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `entity` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `oldData` VARCHAR(191) NULL,
    `newData` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,

    INDEX `audit_logs_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `error_logs` (
    `id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `stack` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `severity` VARCHAR(191) NOT NULL DEFAULT 'ERROR',
    `context` VARCHAR(191) NULL,
    `metadata` VARCHAR(191) NULL,
    `resolved` BOOLEAN NOT NULL DEFAULT false,
    `resolvedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `excerpt` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `author` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `views` INTEGER NOT NULL DEFAULT 0,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `whatsapp_logs` (
    `id` VARCHAR(191) NOT NULL,
    `recipientId` VARCHAR(191) NOT NULL,
    `messageType` VARCHAR(191) NOT NULL,
    `messageData` VARCHAR(191) NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `sentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deliveredAt` DATETIME(3) NULL,
    `readAt` DATETIME(3) NULL,
    `failedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `whatsapp_logs_recipientId_fkey`(`recipientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `whatsapp_incoming` (
    `id` VARCHAR(191) NOT NULL,
    `senderId` VARCHAR(191) NOT NULL,
    `senderPhone` VARCHAR(191) NOT NULL,
    `messageType` VARCHAR(191) NOT NULL,
    `messageContent` VARCHAR(191) NOT NULL,
    `receivedAt` DATETIME(3) NOT NULL,
    `processed` BOOLEAN NOT NULL DEFAULT false,
    `processedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `whatsapp_incoming_senderId_fkey`(`senderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_logs` (
    `id` VARCHAR(191) NOT NULL,
    `recipient` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `messageId` VARCHAR(191) NOT NULL,
    `template` VARCHAR(191) NOT NULL DEFAULT '',
    `error` VARCHAR(191) NOT NULL DEFAULT '',
    `sentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `programs` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `features` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `ageGroup` VARCHAR(191) NOT NULL,
    `schedule` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonials` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,
    `isApproved` BOOLEAN NOT NULL DEFAULT false,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `santriId` VARCHAR(191) NULL,
    `waliId` VARCHAR(191) NULL,
    `authorName` VARCHAR(191) NOT NULL,
    `authorRole` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `testimonials_santriId_fkey`(`santriId`),
    INDEX `testimonials_waliId_fkey`(`waliId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `achievement_badges` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `nameArabic` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `criteriaType` VARCHAR(191) NOT NULL,
    `criteriaValue` INTEGER NOT NULL,
    `criteriaCondition` VARCHAR(191) NOT NULL,
    `timeframe` VARCHAR(191) NULL,
    `rarity` VARCHAR(191) NOT NULL,
    `points` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `unlockMessage` VARCHAR(191) NOT NULL,
    `shareMessage` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `santri_achievements` (
    `id` VARCHAR(191) NOT NULL,
    `santriId` VARCHAR(191) NOT NULL,
    `badgeId` VARCHAR(191) NOT NULL,
    `achievedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `progress` INTEGER NOT NULL DEFAULT 100,
    `isUnlocked` BOOLEAN NOT NULL DEFAULT true,
    `notificationSent` BOOLEAN NOT NULL DEFAULT false,
    `certificateGenerated` BOOLEAN NOT NULL DEFAULT false,
    `certificateUrl` VARCHAR(191) NULL,
    `sharedAt` DATETIME(3) NULL,
    `metadata` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `santri_achievements_santriId_fkey`(`santriId`),
    INDEX `santri_achievements_badgeId_fkey`(`badgeId`),
    UNIQUE INDEX `santri_achievements_santriId_badgeId_key`(`santriId`, `badgeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `behavior_criteria` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `nameArabic` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `category` ENUM('AKHLAQ', 'IBADAH', 'ACADEMIC', 'SOCIAL', 'DISCIPLINE', 'LEADERSHIP') NOT NULL,
    `type` ENUM('POSITIVE', 'NEGATIVE', 'NEUTRAL') NOT NULL,
    `severity` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    `points` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `ageGroup` VARCHAR(191) NOT NULL,
    `examples` JSON NOT NULL,
    `consequences` JSON NULL,
    `rewards` JSON NULL,
    `islamicReference` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `behavior_records` (
    `id` VARCHAR(191) NOT NULL,
    `santriId` VARCHAR(191) NOT NULL,
    `halaqahId` VARCHAR(191) NULL,
    `criteriaId` VARCHAR(191) NOT NULL,
    `category` ENUM('AKHLAQ', 'IBADAH', 'ACADEMIC', 'SOCIAL', 'DISCIPLINE', 'LEADERSHIP') NOT NULL,
    `type` ENUM('POSITIVE', 'NEGATIVE', 'NEUTRAL') NOT NULL,
    `severity` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    `points` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `context` VARCHAR(191) NULL,
    `witnesses` JSON NULL,
    `location` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'RESOLVED', 'FOLLOW_UP', 'ESCALATED') NOT NULL,
    `recordedById` VARCHAR(191) NOT NULL,
    `followUpRequired` BOOLEAN NOT NULL DEFAULT false,
    `followUpDate` DATETIME(3) NULL,
    `followUpNotes` VARCHAR(191) NULL,
    `parentNotified` BOOLEAN NOT NULL DEFAULT false,
    `parentNotifiedAt` DATETIME(3) NULL,
    `resolution` JSON NULL,
    `attachments` JSON NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `behavior_records_santriId_idx`(`santriId`),
    INDEX `behavior_records_halaqahId_idx`(`halaqahId`),
    INDEX `behavior_records_criteriaId_idx`(`criteriaId`),
    INDEX `behavior_records_recordedById_idx`(`recordedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `financial_accounts` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NULL,
    `balance` DOUBLE NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `santriId` VARCHAR(191) NULL,
    `donationId` VARCHAR(191) NULL,
    `paymentId` VARCHAR(191) NULL,
    `transactionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NOT NULL,
    `attachments` VARCHAR(191) NULL,
    `tags` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `transactions_accountId_fkey`(`accountId`),
    INDEX `transactions_createdBy_fkey`(`createdBy`),
    INDEX `transactions_donationId_fkey`(`donationId`),
    INDEX `transactions_paymentId_fkey`(`paymentId`),
    INDEX `transactions_santriId_fkey`(`santriId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donations` (
    `id` VARCHAR(191) NOT NULL,
    `donorName` VARCHAR(191) NOT NULL,
    `donorEmail` VARCHAR(191) NULL,
    `donorPhone` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NULL,
    `isAnonymous` BOOLEAN NOT NULL DEFAULT false,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `paymentMethod` VARCHAR(191) NULL,
    `paymentProof` VARCHAR(191) NULL,
    `confirmerId` VARCHAR(191) NULL,
    `confirmedAt` DATETIME(3) NULL,
    `categoryId` VARCHAR(191) NULL,
    `reference` VARCHAR(191) NULL,
    `midtransToken` VARCHAR(191) NULL,
    `method` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `donations_confirmerId_fkey`(`confirmerId`),
    INDEX `donations_categoryId_fkey`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `financial_reports` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `periodStart` DATETIME(3) NOT NULL,
    `periodEnd` DATETIME(3) NOT NULL,
    `totalIncome` DOUBLE NOT NULL,
    `totalExpense` DOUBLE NOT NULL,
    `netIncome` DOUBLE NOT NULL,
    `reportData` VARCHAR(191) NOT NULL,
    `generatedBy` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `financial_reports_generatedBy_fkey`(`generatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `priority` VARCHAR(191) NOT NULL DEFAULT 'NORMAL',
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `channels` VARCHAR(191) NOT NULL,
    `recipientId` VARCHAR(191) NULL,
    `recipientType` VARCHAR(191) NULL,
    `metadata` VARCHAR(191) NULL,
    `scheduledAt` DATETIME(3) NULL,
    `sentAt` DATETIME(3) NULL,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,

    INDEX `notifications_createdBy_fkey`(`createdBy`),
    INDEX `notifications_recipientId_fkey`(`recipientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification_templates` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `channels` VARCHAR(191) NOT NULL,
    `variables` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `notification_templates_name_key`(`name`),
    INDEX `notification_templates_createdBy_fkey`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification_logs` (
    `id` VARCHAR(191) NOT NULL,
    `notificationId` VARCHAR(191) NOT NULL,
    `channel` VARCHAR(191) NOT NULL,
    `recipient` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `response` VARCHAR(191) NULL,
    `attemptCount` INTEGER NOT NULL DEFAULT 1,
    `lastAttemptAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deliveredAt` DATETIME(3) NULL,
    `errorMessage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notification_logs_notificationId_fkey`(`notificationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `whatsapp_messages` (
    `id` VARCHAR(191) NOT NULL,
    `recipient` VARCHAR(191) NOT NULL,
    `messageType` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `whatsappMessageId` VARCHAR(191) NULL,
    `templateName` VARCHAR(191) NULL,
    `parameters` VARCHAR(191) NULL,
    `errorMessage` VARCHAR(191) NULL,
    `context` VARCHAR(191) NULL,
    `sentAt` DATETIME(3) NULL,
    `deliveredAt` DATETIME(3) NULL,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    INDEX `whatsapp_messages_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_messages` (
    `id` VARCHAR(191) NOT NULL,
    `recipient` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `messageId` VARCHAR(191) NULL,
    `priority` VARCHAR(191) NOT NULL DEFAULT 'NORMAL',
    `errorMessage` VARCHAR(191) NULL,
    `context` VARCHAR(191) NULL,
    `sentAt` DATETIME(3) NULL,
    `deliveredAt` DATETIME(3) NULL,
    `bouncedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    INDEX `email_messages_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_templates` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `html` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NULL,
    `variables` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `email_templates_name_key`(`name`),
    INDEX `email_templates_createdBy_fkey`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_settings` (
    `id` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isEncrypted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `system_settings_category_key_key`(`category`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `gateway` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'IDR',
    `status` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `items` VARCHAR(191) NOT NULL,
    `metadata` VARCHAR(191) NULL,
    `gatewayResponse` VARCHAR(191) NULL,
    `paidAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_transactions_paymentId_key`(`paymentId`),
    UNIQUE INDEX `payment_transactions_orderId_key`(`orderId`),
    INDEX `payment_transactions_customerId_fkey`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart_items` (
    `id` VARCHAR(191) NOT NULL,
    `cartId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `itemType` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `metadata` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `cart_items_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_methods` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `gateway` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `icon` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `config` VARCHAR(191) NULL,
    `fees` DOUBLE NULL,
    `minAmount` DOUBLE NULL,
    `maxAmount` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_methods_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `customerEmail` VARCHAR(191) NOT NULL,
    `customerPhone` VARCHAR(191) NULL,
    `items` VARCHAR(191) NOT NULL,
    `subtotal` DOUBLE NOT NULL,
    `tax` DOUBLE NOT NULL DEFAULT 0,
    `discount` DOUBLE NOT NULL DEFAULT 0,
    `total` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `paymentId` VARCHAR(191) NULL,
    `paymentGateway` VARCHAR(191) NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `paidAt` DATETIME(3) NULL,
    `metadata` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `orders_customerId_fkey`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `planType` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'IDR',
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `nextBillingDate` DATETIME(3) NOT NULL,
    `billingCycle` VARCHAR(191) NOT NULL DEFAULT 'MONTHLY',
    `paymentMethod` VARCHAR(191) NULL,
    `gateway` VARCHAR(191) NULL,
    `gatewaySubscriptionId` VARCHAR(191) NULL,
    `autoRenewal` BOOLEAN NOT NULL DEFAULT true,
    `trialEndDate` DATETIME(3) NULL,
    `metadata` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,

    INDEX `subscriptions_studentId_fkey`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_billings` (
    `id` VARCHAR(191) NOT NULL,
    `subscriptionId` VARCHAR(191) NOT NULL,
    `billingDate` DATETIME(3) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `paymentId` VARCHAR(191) NULL,
    `orderId` VARCHAR(191) NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `paidAt` DATETIME(3) NULL,
    `failureReason` VARCHAR(191) NULL,
    `retryCount` INTEGER NOT NULL DEFAULT 0,
    `nextRetryDate` DATETIME(3) NULL,
    `metadata` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `subscription_billings_subscriptionId_fkey`(`subscriptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_plans` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'IDR',
    `billingCycle` VARCHAR(191) NOT NULL,
    `trialDays` INTEGER NOT NULL DEFAULT 0,
    `features` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `metadata` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `site_settings_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `themes` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `colors` JSON NOT NULL,
    `buttons` JSON NOT NULL,
    `fonts` JSON NOT NULL,
    `layout` JSON NOT NULL,
    `logo` JSON NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donation_categories` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `target` DOUBLE NOT NULL,
    `collected` DOUBLE NOT NULL DEFAULT 0,
    `icon` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `bgColor` VARCHAR(191) NOT NULL,
    `urgent` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `donation_categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `santri` ADD CONSTRAINT `santri_halaqahId_fkey` FOREIGN KEY (`halaqahId`) REFERENCES `halaqah`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `santri` ADD CONSTRAINT `santri_waliId_fkey` FOREIGN KEY (`waliId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `musyrif` ADD CONSTRAINT `musyrif_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `halaqah` ADD CONSTRAINT `halaqah_musyrifId_fkey` FOREIGN KEY (`musyrifId`) REFERENCES `musyrif`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `halaqah_schedules` ADD CONSTRAINT `halaqah_schedules_halaqahId_fkey` FOREIGN KEY (`halaqahId`) REFERENCES `halaqah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `halaqah_materials` ADD CONSTRAINT `halaqah_materials_halaqahId_fkey` FOREIGN KEY (`halaqahId`) REFERENCES `halaqah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `halaqah_progress` ADD CONSTRAINT `halaqah_progress_santriId_fkey` FOREIGN KEY (`santriId`) REFERENCES `santri`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `halaqah_progress` ADD CONSTRAINT `halaqah_progress_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `halaqah_materials`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hafalan` ADD CONSTRAINT `hafalan_musyrifId_fkey` FOREIGN KEY (`musyrifId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hafalan` ADD CONSTRAINT `hafalan_santriId_fkey` FOREIGN KEY (`santriId`) REFERENCES `santri`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hafalan_progress` ADD CONSTRAINT `hafalan_progress_santriId_fkey` FOREIGN KEY (`santriId`) REFERENCES `santri`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_halaqahId_fkey` FOREIGN KEY (`halaqahId`) REFERENCES `halaqah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_musyrifId_fkey` FOREIGN KEY (`musyrifId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_santriId_fkey` FOREIGN KEY (`santriId`) REFERENCES `santri`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_santriId_fkey` FOREIGN KEY (`santriId`) REFERENCES `santri`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `spp_records` ADD CONSTRAINT `spp_records_santriId_fkey` FOREIGN KEY (`santriId`) REFERENCES `santri`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `spp_records` ADD CONSTRAINT `spp_records_sppSettingId_fkey` FOREIGN KEY (`sppSettingId`) REFERENCES `spp_settings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `spp_records` ADD CONSTRAINT `spp_records_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `transactions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `whatsapp_logs` ADD CONSTRAINT `whatsapp_logs_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `whatsapp_incoming` ADD CONSTRAINT `whatsapp_incoming_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testimonials` ADD CONSTRAINT `testimonials_santriId_fkey` FOREIGN KEY (`santriId`) REFERENCES `santri`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testimonials` ADD CONSTRAINT `testimonials_waliId_fkey` FOREIGN KEY (`waliId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `santri_achievements` ADD CONSTRAINT `santri_achievements_santriId_fkey` FOREIGN KEY (`santriId`) REFERENCES `santri`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `santri_achievements` ADD CONSTRAINT `santri_achievements_badgeId_fkey` FOREIGN KEY (`badgeId`) REFERENCES `achievement_badges`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `behavior_records` ADD CONSTRAINT `behavior_records_santriId_fkey` FOREIGN KEY (`santriId`) REFERENCES `santri`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `behavior_records` ADD CONSTRAINT `behavior_records_criteriaId_fkey` FOREIGN KEY (`criteriaId`) REFERENCES `behavior_criteria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `behavior_records` ADD CONSTRAINT `behavior_records_recordedById_fkey` FOREIGN KEY (`recordedById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `behavior_records` ADD CONSTRAINT `behavior_records_halaqahId_fkey` FOREIGN KEY (`halaqahId`) REFERENCES `halaqah`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `financial_accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_donationId_fkey` FOREIGN KEY (`donationId`) REFERENCES `donations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_santriId_fkey` FOREIGN KEY (`santriId`) REFERENCES `santri`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donations` ADD CONSTRAINT `donations_confirmerId_fkey` FOREIGN KEY (`confirmerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donations` ADD CONSTRAINT `donations_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `donation_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `financial_reports` ADD CONSTRAINT `financial_reports_generatedBy_fkey` FOREIGN KEY (`generatedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification_templates` ADD CONSTRAINT `notification_templates_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification_logs` ADD CONSTRAINT `notification_logs_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `notifications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `whatsapp_messages` ADD CONSTRAINT `whatsapp_messages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email_messages` ADD CONSTRAINT `email_messages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email_templates` ADD CONSTRAINT `email_templates_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_transactions` ADD CONSTRAINT `payment_transactions_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_billings` ADD CONSTRAINT `subscription_billings_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `subscriptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `themes` ADD CONSTRAINT `themes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

