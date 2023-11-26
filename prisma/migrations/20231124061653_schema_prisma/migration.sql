-- CreateTable
CREATE TABLE `USER` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `pw` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `USER_user_name_key`(`user_name`),
    UNIQUE INDEX `USER_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `POST` (
    `post_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `POST_user_id_fkey`(`user_id`),
    PRIMARY KEY (`post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `COMMENT` (
    `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `comment_content` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `comment_name` VARCHAR(191) NOT NULL,

    INDEX `COMMENT_post_id_fkey`(`post_id`),
    INDEX `COMMENT_user_id_fkey`(`user_id`),
    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `POST` ADD CONSTRAINT `POST_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `USER`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `COMMENT` ADD CONSTRAINT `COMMENT_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `POST`(`post_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `COMMENT` ADD CONSTRAINT `COMMENT_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `USER`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
