-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema GoodHabits
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema GoodHabits
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `GoodHabits` DEFAULT CHARACTER SET utf8 ;
USE `GoodHabits` ;

-- -----------------------------------------------------
-- Table `GoodHabits`.`Address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GoodHabits`.`Address` (
  `idAddress` INT NOT NULL,
  `streetAddress` VARCHAR(100) NULL,
  `city` VARCHAR(50) NULL,
  `state` VARCHAR(45) NULL,
  `postalCode` INT NULL,
  `country` VARCHAR(100) NULL,
  PRIMARY KEY (`idAddress`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodHabits`.`Tasks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GoodHabits`.`Tasks` (
  `idTasks` INT NOT NULL,
  `taskName` VARCHAR(45) NULL,
  `taskDescription` VARCHAR(60) NULL,
  `pointsAwarded` INT NULL,
  `dueDate` DATE NULL,
  `status` VARCHAR(30) NULL,
  PRIMARY KEY (`idTasks`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodHabits`.`GuardianAccount`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GoodHabits`.`GuardianAccount` (
  `idGuardianAccount` INT NOT NULL,
  `firstName` VARCHAR(15) NULL,
  `lastName` VARCHAR(30) NULL,
  `dateOfBirth` DATE NULL,
  `emailAddress` VARCHAR(20) NULL,
  `password` VARCHAR(15) NULL,
  `phoneNumber` VARCHAR(20) NULL,
  PRIMARY KEY (`idGuardianAccount`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodHabits`.`PaymentDetails`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GoodHabits`.`PaymentDetails` (
  `idPaymentDetails` INT NOT NULL,
  `paymentMethod` VARCHAR(20) NULL,
  `cardHolderName` VARCHAR(45) NULL,
  `cardNumber` VARCHAR(20) NULL,
  `expirationDate` DATE NULL,
  `cvv` VARCHAR(5) NULL,
  `Parent_idParent` INT NOT NULL,
  `Parent_Account_idAccount` INT NOT NULL,
  `GuardianAccount_idGuardianAccount` INT NOT NULL,
  PRIMARY KEY (`idPaymentDetails`, `Parent_idParent`, `Parent_Account_idAccount`, `GuardianAccount_idGuardianAccount`),
  INDEX `fk_PaymentDetails_GuardianAccount1_idx` (`GuardianAccount_idGuardianAccount` ASC) VISIBLE,
  CONSTRAINT `fk_PaymentDetails_GuardianAccount1`
    FOREIGN KEY (`GuardianAccount_idGuardianAccount`)
    REFERENCES `GoodHabits`.`GuardianAccount` (`idGuardianAccount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodHabits`.`Shop`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GoodHabits`.`Shop` (
  `idShop` INT NOT NULL,
  `rewardName` VARCHAR(45) NULL,
  `rewardDescription` VARCHAR(60) NULL,
  `pointsRequired` INT NULL,
  PRIMARY KEY (`idShop`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodHabits`.`Redemption`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GoodHabits`.`Redemption` (
  `idRedemption` INT NOT NULL,
  `date` DATE NULL,
  `pointsSpent` INT NULL,
  `Shop_idShop` INT NOT NULL,
  PRIMARY KEY (`idRedemption`, `Shop_idShop`),
  INDEX `fk_Redemption_Shop1_idx` (`Shop_idShop` ASC) VISIBLE,
  CONSTRAINT `fk_Redemption_Shop1`
    FOREIGN KEY (`Shop_idShop`)
    REFERENCES `GoodHabits`.`Shop` (`idShop`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodHabits`.`ChildAccount`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GoodHabits`.`ChildAccount` (
  `idChildAccount` INT NOT NULL,
  `firstName` VARCHAR(15) NULL,
  `lastName` VARCHAR(30) NULL,
  `dateOfBirth` DATE NULL,
  `emailAddress` VARCHAR(20) NULL,
  `password` VARCHAR(15) NULL,
  `totalPoints` INT NULL,
  PRIMARY KEY (`idChildAccount`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodHabits`.`GuardianAccount_has_Tasks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GoodHabits`.`GuardianAccount_has_Tasks` (
  `GuardianAccount_idGuardianAccount` INT NOT NULL,
  `Tasks_idTasks` INT NOT NULL,
  PRIMARY KEY (`GuardianAccount_idGuardianAccount`, `Tasks_idTasks`),
  INDEX `fk_GuardianAccount_has_Tasks_Tasks1_idx` (`Tasks_idTasks` ASC) VISIBLE,
  INDEX `fk_GuardianAccount_has_Tasks_GuardianAccount1_idx` (`GuardianAccount_idGuardianAccount` ASC) VISIBLE,
  CONSTRAINT `fk_GuardianAccount_has_Tasks_GuardianAccount1`
    FOREIGN KEY (`GuardianAccount_idGuardianAccount`)
    REFERENCES `GoodHabits`.`GuardianAccount` (`idGuardianAccount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_GuardianAccount_has_Tasks_Tasks1`
    FOREIGN KEY (`Tasks_idTasks`)
    REFERENCES `GoodHabits`.`Tasks` (`idTasks`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodHabits`.`GuardianAccount_has_Address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GoodHabits`.`GuardianAccount_has_Address` (
  `GuardianAccount_idGuardianAccount` INT NOT NULL,
  `Address_idAddress` INT NOT NULL,
  PRIMARY KEY (`GuardianAccount_idGuardianAccount`, `Address_idAddress`),
  INDEX `fk_GuardianAccount_has_Address_Address1_idx` (`Address_idAddress` ASC) VISIBLE,
  INDEX `fk_GuardianAccount_has_Address_GuardianAccount1_idx` (`GuardianAccount_idGuardianAccount` ASC) VISIBLE,
  CONSTRAINT `fk_GuardianAccount_has_Address_GuardianAccount1`
    FOREIGN KEY (`GuardianAccount_idGuardianAccount`)
    REFERENCES `GoodHabits`.`GuardianAccount` (`idGuardianAccount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_GuardianAccount_has_Address_Address1`
    FOREIGN KEY (`Address_idAddress`)
    REFERENCES `GoodHabits`.`Address` (`idAddress`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodHabits`.`GuardianAccount_has_ChildAccount`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GoodHabits`.`GuardianAccount_has_ChildAccount` (
  `GuardianAccount_idGuardianAccount` INT NOT NULL,
  `ChildAccount_idChildAccount` INT NOT NULL,
  PRIMARY KEY (`GuardianAccount_idGuardianAccount`, `ChildAccount_idChildAccount`),
  INDEX `fk_GuardianAccount_has_ChildAccount_ChildAccount1_idx` (`ChildAccount_idChildAccount` ASC) VISIBLE,
  INDEX `fk_GuardianAccount_has_ChildAccount_GuardianAccount1_idx` (`GuardianAccount_idGuardianAccount` ASC) VISIBLE,
  CONSTRAINT `fk_GuardianAccount_has_ChildAccount_GuardianAccount1`
    FOREIGN KEY (`GuardianAccount_idGuardianAccount`)
    REFERENCES `GoodHabits`.`GuardianAccount` (`idGuardianAccount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_GuardianAccount_has_ChildAccount_ChildAccount1`
    FOREIGN KEY (`ChildAccount_idChildAccount`)
    REFERENCES `GoodHabits`.`ChildAccount` (`idChildAccount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `GoodHabits`.`ChildAccount_has_Redemption`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `GoodHabits`.`ChildAccount_has_Redemption` (
  `ChildAccount_idChildAccount` INT NOT NULL,
  `Redemption_idRedemption` INT NOT NULL,
  `Redemption_Shop_idShop` INT NOT NULL,
  PRIMARY KEY (`ChildAccount_idChildAccount`, `Redemption_idRedemption`, `Redemption_Shop_idShop`),
  INDEX `fk_ChildAccount_has_Redemption_Redemption1_idx` (`Redemption_idRedemption` ASC, `Redemption_Shop_idShop` ASC) VISIBLE,
  INDEX `fk_ChildAccount_has_Redemption_ChildAccount1_idx` (`ChildAccount_idChildAccount` ASC) VISIBLE,
  CONSTRAINT `fk_ChildAccount_has_Redemption_ChildAccount1`
    FOREIGN KEY (`ChildAccount_idChildAccount`)
    REFERENCES `GoodHabits`.`ChildAccount` (`idChildAccount`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ChildAccount_has_Redemption_Redemption1`
    FOREIGN KEY (`Redemption_idRedemption` , `Redemption_Shop_idShop`)
    REFERENCES `GoodHabits`.`Redemption` (`idRedemption` , `Shop_idShop`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
