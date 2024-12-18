-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema goodhabits
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `goodhabits` ;

-- -----------------------------------------------------
-- Schema goodhabits
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `goodhabits` DEFAULT CHARACTER SET utf8mb3 ;
USE `goodhabits` ;

-- -----------------------------------------------------
-- Table `goodhabits`.`address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goodhabits`.`address` (
  `idAddress` INT NOT NULL AUTO_INCREMENT,
  `streetAddress` VARCHAR(100) NULL DEFAULT NULL,
  `city` VARCHAR(50) NULL DEFAULT NULL,
  `state` VARCHAR(45) NULL DEFAULT NULL,
  `postalCode` INT NULL DEFAULT NULL,
  `country` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`idAddress`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `goodhabits`.`childaccount`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goodhabits`.`childaccount` (
  `idChildAccount` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(30) NULL DEFAULT NULL,
  `lastName` VARCHAR(30) NULL DEFAULT NULL,
  `emailAddress` VARCHAR(40) NULL DEFAULT NULL,
  `password` VARCHAR(20) NULL DEFAULT NULL,
  `totalPoints` INT NULL DEFAULT NULL,
  PRIMARY KEY (`idChildAccount`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `goodhabits`.`shop`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goodhabits`.`shop` (
  `idShop` INT NOT NULL AUTO_INCREMENT,
  `rewardName` VARCHAR(45) NULL DEFAULT NULL,
  `rewardDescription` VARCHAR(60) NULL DEFAULT NULL,
  `pointsRequired` INT NULL DEFAULT NULL,
  PRIMARY KEY (`idShop`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `goodhabits`.`redemption`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goodhabits`.`redemption` (
  `idRedemption` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NULL DEFAULT NULL,
  `pointsSpent` INT NULL DEFAULT NULL,
  `Shop_idShop` INT NOT NULL,
  PRIMARY KEY (`idRedemption`, `Shop_idShop`),
  INDEX `fk_Redemption_Shop1_idx` (`Shop_idShop` ASC) VISIBLE,
  CONSTRAINT `fk_Redemption_Shop1`
    FOREIGN KEY (`Shop_idShop`)
    REFERENCES `goodhabits`.`shop` (`idShop`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `goodhabits`.`childaccount_has_redemption`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goodhabits`.`childaccount_has_redemption` (
  `ChildAccount_idChildAccount` INT NOT NULL,
  `Redemption_idRedemption` INT NOT NULL,
  `Redemption_Shop_idShop` INT NOT NULL,
  PRIMARY KEY (`ChildAccount_idChildAccount`, `Redemption_idRedemption`, `Redemption_Shop_idShop`),
  INDEX `fk_ChildAccount_has_Redemption_Redemption1_idx` (`Redemption_idRedemption` ASC, `Redemption_Shop_idShop` ASC) VISIBLE,
  INDEX `fk_ChildAccount_has_Redemption_ChildAccount1_idx` (`ChildAccount_idChildAccount` ASC) VISIBLE,
  CONSTRAINT `fk_ChildAccount_has_Redemption_ChildAccount1`
    FOREIGN KEY (`ChildAccount_idChildAccount`)
    REFERENCES `goodhabits`.`childaccount` (`idChildAccount`),
  CONSTRAINT `fk_ChildAccount_has_Redemption_Redemption1`
    FOREIGN KEY (`Redemption_idRedemption` , `Redemption_Shop_idShop`)
    REFERENCES `goodhabits`.`redemption` (`idRedemption` , `Shop_idShop`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `goodhabits`.`guardianaccount`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goodhabits`.`guardianaccount` (
  `idGuardianAccount` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(30) NULL DEFAULT NULL,
  `lastName` VARCHAR(30) NULL DEFAULT NULL,
  `emailAddress` VARCHAR(40) NULL DEFAULT NULL,
  `password` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`idGuardianAccount`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `goodhabits`.`guardianaccount_has_address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goodhabits`.`guardianaccount_has_address` (
  `GuardianAccount_idGuardianAccount` INT NOT NULL,
  `Address_idAddress` INT NOT NULL,
  PRIMARY KEY (`GuardianAccount_idGuardianAccount`, `Address_idAddress`),
  INDEX `fk_GuardianAccount_has_Address_Address1_idx` (`Address_idAddress` ASC) VISIBLE,
  INDEX `fk_GuardianAccount_has_Address_GuardianAccount1_idx` (`GuardianAccount_idGuardianAccount` ASC) VISIBLE,
  CONSTRAINT `fk_GuardianAccount_has_Address_Address1`
    FOREIGN KEY (`Address_idAddress`)
    REFERENCES `goodhabits`.`address` (`idAddress`),
  CONSTRAINT `fk_GuardianAccount_has_Address_GuardianAccount1`
    FOREIGN KEY (`GuardianAccount_idGuardianAccount`)
    REFERENCES `goodhabits`.`guardianaccount` (`idGuardianAccount`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `goodhabits`.`guardianaccount_has_childaccount`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goodhabits`.`guardianaccount_has_childaccount` (
  `GuardianAccount_idGuardianAccount` INT NOT NULL,
  `ChildAccount_idChildAccount` INT NOT NULL,
  PRIMARY KEY (`GuardianAccount_idGuardianAccount`, `ChildAccount_idChildAccount`),
  INDEX `fk_GuardianAccount_has_ChildAccount_ChildAccount1_idx` (`ChildAccount_idChildAccount` ASC) VISIBLE,
  INDEX `fk_GuardianAccount_has_ChildAccount_GuardianAccount1_idx` (`GuardianAccount_idGuardianAccount` ASC) VISIBLE,
  CONSTRAINT `fk_GuardianAccount_has_ChildAccount_ChildAccount1`
    FOREIGN KEY (`ChildAccount_idChildAccount`)
    REFERENCES `goodhabits`.`childaccount` (`idChildAccount`),
  CONSTRAINT `fk_GuardianAccount_has_ChildAccount_GuardianAccount1`
    FOREIGN KEY (`GuardianAccount_idGuardianAccount`)
    REFERENCES `goodhabits`.`guardianaccount` (`idGuardianAccount`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `goodhabits`.`paymentdetails`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goodhabits`.`paymentdetails` (
  `idPaymentDetails` INT NOT NULL AUTO_INCREMENT,
  `paymentMethod` VARCHAR(20) NULL DEFAULT NULL,
  `cardHolderName` VARCHAR(80) NULL DEFAULT NULL,
  `cardNumber` VARCHAR(20) NULL DEFAULT NULL,
  `expirationDate` DATE NULL DEFAULT NULL,
  `cvv` VARCHAR(5) NULL DEFAULT NULL,
  `GuardianAccount_idGuardianAccount` INT NOT NULL,
  PRIMARY KEY (`idPaymentDetails`, `GuardianAccount_idGuardianAccount`),
  INDEX `fk_PaymentDetails_GuardianAccount1_idx` (`GuardianAccount_idGuardianAccount` ASC) VISIBLE,
  CONSTRAINT `fk_PaymentDetails_GuardianAccount1`
    FOREIGN KEY (`GuardianAccount_idGuardianAccount`)
    REFERENCES `goodhabits`.`guardianaccount` (`idGuardianAccount`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `goodhabits`.`tasks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goodhabits`.`tasks` (
  `idTasks` INT NOT NULL AUTO_INCREMENT,
  `taskName` VARCHAR(45) NULL DEFAULT NULL,
  `taskDescription` VARCHAR(60) NULL DEFAULT NULL,
  `pointsAwarded` INT NULL DEFAULT NULL,
  `dueDate` VARCHAR(10) NULL DEFAULT NULL,
  `status` VARCHAR(30) NULL DEFAULT NULL,
  PRIMARY KEY (`idTasks`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `goodhabits`.`childaccount_has_tasks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goodhabits`.`childaccount_has_tasks` (
  `childaccount_idChildAccount` INT NOT NULL,
  `tasks_idTasks` INT NOT NULL,
  `childaccount_has_taskscol` VARCHAR(45) NULL,
  PRIMARY KEY (`childaccount_idChildAccount`, `tasks_idTasks`),
  INDEX `fk_childaccount_has_tasks_tasks1_idx` (`tasks_idTasks` ASC) VISIBLE,
  INDEX `fk_childaccount_has_tasks_childaccount1_idx` (`childaccount_idChildAccount` ASC) VISIBLE,
  CONSTRAINT `fk_childaccount_has_tasks_childaccount1`
    FOREIGN KEY (`childaccount_idChildAccount`)
    REFERENCES `goodhabits`.`childaccount` (`idChildAccount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_childaccount_has_tasks_tasks1`
    FOREIGN KEY (`tasks_idTasks`)
    REFERENCES `goodhabits`.`tasks` (`idTasks`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
