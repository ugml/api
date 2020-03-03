-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema ugamela
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ugamela` DEFAULT CHARACTER SET latin1 ;
USE `ugamela` ;

--
-- Table structure for table `users`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
                         `userID` int(11) NOT NULL,
                         `username` varchar(20) NOT NULL,
                         `password` varchar(60) NOT NULL,
                         `email` varchar(64) NOT NULL,
                         `lastTimeOnline` varchar(10) NOT NULL,
                         `currentPlanet` int(11) NOT NULL,
                         PRIMARY KEY (`userID`),
                         UNIQUE KEY `id_UNIQUE` (`userID`),
                         UNIQUE KEY `username_UNIQUE` (`username`),
                         UNIQUE KEY `email_UNIQUE` (`email`),
                         UNIQUE KEY `currentPlanet_UNIQUE` (`currentPlanet`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `planets`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `planets` (
                           `planetID` int(11) NOT NULL,
                           `ownerID` int(11) NOT NULL,
                           `name` varchar(45) DEFAULT NULL,
                           `posGalaxy` int(11) NOT NULL,
                           `posSystem` int(11) NOT NULL,
                           `posPlanet` int(11) NOT NULL,
                           `lastUpdate` int(11) DEFAULT NULL,
                           `planetType` int(1) NOT NULL,
                           `image` char(32) NOT NULL,
                           `diameter` int(11) NOT NULL,
                           `fieldsCurrent` int(3) NOT NULL DEFAULT 0,
                           `fieldsMax` int(3) NOT NULL,
                           `tempMin` int(3) NOT NULL,
                           `tempMax` int(3) NOT NULL,
                           `metal` double(16,6) NOT NULL DEFAULT 500.000000,
                           `crystal` double(16,6) NOT NULL DEFAULT 500.000000,
                           `deuterium` double(16,6) NOT NULL DEFAULT 0.000000,
                           `energyUsed` int(11) NOT NULL DEFAULT 0,
                           `energyMax` int(11) NOT NULL DEFAULT 0,
                           `metalMinePercent` int(3) NOT NULL DEFAULT 100,
                           `crystalMinePercent` int(3) NOT NULL DEFAULT 100,
                           `deuteriumSynthesizerPercent` int(3) NOT NULL DEFAULT 100,
                           `solarPlantPercent` int(3) NOT NULL DEFAULT 100,
                           `fusionReactorPercent` int(3) NOT NULL DEFAULT 100,
                           `solarSatellitePercent` int(3) NOT NULL DEFAULT 100,
                           `bBuildingId` int(3) DEFAULT NULL,
                           `bBuildingEndTime` int(10) DEFAULT NULL,
                           `bBuildingDemolition` bool default FALSE not null,
                           `bTechID` int(3) DEFAULT NULL,
                           `bTechEndTime` int(10) DEFAULT NULL,
                           `bHangarQueue` text default NULL,
                           `bHangarStartTime` int(11) NOT NULL DEFAULT 0,
                           `bHangarPlus` tinyint(1) NOT NULL DEFAULT 0,
                           `destroyed` tinyint(1) NOT NULL DEFAULT 0,
                           PRIMARY KEY (`planetID`),
                           KEY `fk_planet_ownerid` (`ownerID`),
                           CONSTRAINT `fk_planet_ownerid` FOREIGN KEY (`ownerID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `buildings`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buildings` (
                             `planetID` int(11) NOT NULL,
                             `metalMine` int(11) NOT NULL DEFAULT 0,
                             `crystalMine` int(11) NOT NULL DEFAULT 0,
                             `deuteriumSynthesizer` int(11) NOT NULL DEFAULT 0,
                             `solarPlant` int(11) NOT NULL DEFAULT 0,
                             `fusionReactor` int(11) NOT NULL DEFAULT 0,
                             `roboticFactory` int(11) NOT NULL DEFAULT 0,
                             `naniteFactory` int(11) NOT NULL DEFAULT 0,
                             `shipyard` int(11) NOT NULL DEFAULT 0,
                             `metalStorage` int(11) NOT NULL DEFAULT 0,
                             `crystalStorage` int(11) NOT NULL DEFAULT 0,
                             `deuteriumStorage` int(11) NOT NULL DEFAULT 0,
                             `researchLab` int(11) NOT NULL DEFAULT 0,
                             `terraformer` int(11) NOT NULL DEFAULT 0,
                             `allianceDepot` int(11) NOT NULL DEFAULT 0,
                             `missileSilo` int(11) NOT NULL DEFAULT 0,
                             UNIQUE KEY `planetid_UNIQUE` (`planetID`),
                             CONSTRAINT `fk_building_planetid` FOREIGN KEY (`planetID`) REFERENCES `planets` (`planetID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `defenses`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `defenses` (
                            `planetID` int(11) NOT NULL,
                            `rocketLauncher` int(11) NOT NULL DEFAULT 0,
                            `lightLaser` int(11) NOT NULL DEFAULT 0,
                            `heavyLaser` int(11) NOT NULL DEFAULT 0,
                            `ionCannon` int(11) NOT NULL DEFAULT 0,
                            `gaussCannon` int(11) NOT NULL DEFAULT 0,
                            `plasmaTurret` int(11) NOT NULL DEFAULT 0,
                            `smallShieldDome` int(11) NOT NULL DEFAULT 0,
                            `largeShieldDome` int(11) NOT NULL DEFAULT 0,
                            `antiBallisticMissile` int(11) NOT NULL DEFAULT 0,
                            `interplanetaryMissile` int(11) NOT NULL DEFAULT 0,
                            UNIQUE KEY `planetid_UNIQUE` (`planetID`),
                            CONSTRAINT `fk_defense_planetid` FOREIGN KEY (`planetID`) REFERENCES `planets` (`planetID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `errors`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `errors` (
                          `id` int(11) NOT NULL AUTO_INCREMENT,
                          `class` text NOT NULL,
                          `method` text NOT NULL,
                          `line` text NOT NULL,
                          `exception` text NOT NULL,
                          `description` text NOT NULL,
                          `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                          PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `ships`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ships` (
                         `planetID` int(11) NOT NULL,
                         `smallCargoShip` int(11) NOT NULL DEFAULT 0,
                         `largeCargoShip` int(11) NOT NULL DEFAULT 0,
                         `lightFighter` int(11) NOT NULL DEFAULT 0,
                         `heavyFighter` int(11) NOT NULL DEFAULT 0,
                         `cruiser` int(11) NOT NULL DEFAULT 0,
                         `battleship` int(11) NOT NULL DEFAULT 0,
                         `colonyShip` int(11) NOT NULL DEFAULT 0,
                         `recycler` int(11) NOT NULL DEFAULT 0,
                         `espionageProbe` int(11) NOT NULL DEFAULT 0,
                         `bomber` int(11) NOT NULL DEFAULT 0,
                         `solarSatellite` int(11) NOT NULL DEFAULT 0,
                         `destroyer` int(11) NOT NULL DEFAULT 0,
                         `battlecruiser` int(11) NOT NULL DEFAULT 0,
                         `deathstar` int(11) NOT NULL DEFAULT 0,
                         UNIQUE KEY `planetid_UNIQUE` (`planetID`),
                         CONSTRAINT `fk_ships_planetid` FOREIGN KEY (`planetID`) REFERENCES `planets` (`planetID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `events`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
                          `eventID` int(11) NOT NULL AUTO_INCREMENT,
                          `ownerID` int(11) NOT NULL,
                          `mission` tinyint(1) NOT NULL,
                          `fleetlist` text NOT NULL,
                          `startID` int(11) NOT NULL,
                          `startType` tinyint(1) NOT NULL,
                          `startTime` int(11) NOT NULL,
                          `endID` int(11) NOT NULL,
                          `endType` tinyint(1) NOT NULL,
                          `endTime` int(11) NOT NULL,
                          `loadedMetal` int(11) NOT NULL DEFAULT 0,
                          `loadedCrystal` int(11) NOT NULL DEFAULT 0,
                          `loadedDeuterium` int(11) NOT NULL DEFAULT 0,
                          `returning` tinyint(1) NOT NULL DEFAULT 0,
                          `processed` tinyint(1) NOT NULL DEFAULT 0,
                          PRIMARY KEY (`eventID`),
                          KEY `fk_event_ownerid` (`ownerID`),
                          CONSTRAINT `fk_event_ownerid` FOREIGN KEY (`ownerID`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `galaxy`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `galaxy` (
                          `planetID` int(11) NOT NULL DEFAULT 0,
                          `posGalaxy` int(2) NOT NULL,
                          `posSystem` int(3) NOT NULL,
                          `posPlanet` int(2) NOT NULL,
                          `debrisMetal` int(11) NOT NULL DEFAULT 0,
                          `debrisCrystal` int(11) NOT NULL DEFAULT 0,
                          UNIQUE KEY `planetid_UNIQUE` (`planetID`),
                          CONSTRAINT `fk_galaxy_planetid` FOREIGN KEY (`planetID`) REFERENCES `planets` (`planetID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `messages`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
                            `messageID` int(11) NOT NULL AUTO_INCREMENT,
                            `senderID` int(11) NOT NULL,
                            `receiverID` int(11) NOT NULL,
                            `sendtime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                            `type` tinyint(1) NOT NULL,
                            `subject` varchar(45) NOT NULL,
                            `body` text NOT NULL,
                            `deleted` int(1) NOT NULL DEFAULT 0,
                            PRIMARY KEY (`messageID`),
                            UNIQUE KEY `messageID_UNIQUE` (`messageID`),
                            KEY `fk_messages_users1_idx` (`senderID`),
                            KEY `fk_messages_users2_idx` (`receiverID`),
                            CONSTRAINT `fk_messages_users1` FOREIGN KEY (`senderID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION,
                            CONSTRAINT `fk_messages_users2` FOREIGN KEY (`receiverID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=latin1;

--
-- Table structure for table `stats`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stats` (
                         `userID` int(11) NOT NULL,
                         `points` bigint(11) NOT NULL DEFAULT 0,
                         `oldRank` tinyint(4) NOT NULL DEFAULT 0,
                         `currentRank` tinyint(4) NOT NULL DEFAULT 0,
                         UNIQUE KEY `userid_UNIQUE` (`userID`),
                         CONSTRAINT `fk_stats_userid` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `techs`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `techs` (
                         `userID` int(11) NOT NULL,
                         `espionageTech` tinyint(2) NOT NULL DEFAULT 0,
                         `computerTech` tinyint(2) NOT NULL DEFAULT 0,
                         `weaponTech` tinyint(2) NOT NULL DEFAULT 0,
                         `armourTech` tinyint(2) NOT NULL DEFAULT 0,
                         `shieldingTech` tinyint(2) NOT NULL DEFAULT 0,
                         `energyTech` tinyint(2) NOT NULL DEFAULT 0,
                         `hyperspaceTech` tinyint(2) NOT NULL DEFAULT 0,
                         `combustionDriveTech` tinyint(2) NOT NULL DEFAULT 0,
                         `impulseDriveTech` tinyint(2) NOT NULL DEFAULT 0,
                         `hyperspaceDriveTech` tinyint(2) NOT NULL DEFAULT 0,
                         `laserTech` tinyint(2) NOT NULL DEFAULT 0,
                         `ionTech` tinyint(2) NOT NULL DEFAULT 0,
                         `plasmaTech` tinyint(2) NOT NULL DEFAULT 0,
                         `intergalacticResearchTech` tinyint(2) NOT NULL DEFAULT 0,
                         `gravitonTech` tinyint(2) NOT NULL DEFAULT 0,
                         UNIQUE KEY `userid_UNIQUE` (`userID`),
                         CONSTRAINT `fk_research_userid` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `resetTokens`
--

CREATE TABLE `resetTokens` (
  `email` varchar(64) NOT NULL,
  `ipRequested` varchar(45) NOT NULL,
  `resetToken` varchar(64) NOT NULL,
  `requestedAt` int(10) NOT NULL,
  `usedAt` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- -----------------------------------------------------
-- procedure getFreePosition
-- -----------------------------------------------------

DELIMITER $$
USE `ugamela`$$
CREATE DEFINER=`root`@`%` PROCEDURE `getFreePosition`(IN maxGalaxy int, IN maxSystem int, IN minPlanet int, IN maxPlanet int)
BEGIN
    DECLARE posGalaxy INT;
    DECLARE posSystem INT;
    DECLARE posPlanet INT;

    DECLARE taken TINYINT(1) DEFAULT 1;

    WHILE taken > 0 DO
    SET posGalaxy = ROUND(RAND()*(maxGalaxy-1)+1);
    SET posSystem = ROUND(RAND()*(maxSystem-1)+1);
    SET posPlanet = ROUND(RAND()*(maxPlanet-minPlanet)+minPlanet);

    SET taken = (SELECT 1 FROM ugamela.planets WHERE 'galaxy' = CONCAT('', posGalaxy) AND 'system' = CONCAT('', posSystem) AND 'planet' = CONCAT('', posPlanet));

    -- if the userID was free
    IF(taken IS NULL) THEN
        SET taken = 0;
    END IF;

    END WHILE;

    SELECT posGalaxy AS `posGalaxy`, posSystem AS `posSystem`, posPlanet AS `posPlanet`;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure getNewPlanetId
-- -----------------------------------------------------

DELIMITER $$
USE `ugamela`$$
CREATE DEFINER=`root`@`%` PROCEDURE `getNewPlanetId`()
BEGIN
    DECLARE idtaken TINYINT(1) DEFAULT 1;
    DECLARE planet_id INT;

    SET idtaken = 1;
    SET planet_id = 0;

    WHILE idtaken > 0 DO
    SET planet_id = FLOOR(RAND()*(2147483648-200+1)+200);

    SET idtaken = (SELECT 1 FROM ugamela.planets WHERE planetID = planet_id);

    -- if the userID was free
    IF(idtaken IS NULL) THEN
        SET idtaken = 0;
    END IF;

    END WHILE;

    SELECT planet_id AS `planetID`;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure getNewUserId
-- -----------------------------------------------------

DELIMITER $$
USE `ugamela`$$
CREATE DEFINER=`root`@`%` PROCEDURE `getNewUserId`()
BEGIN
    DECLARE idtaken TINYINT(1) DEFAULT 1;
    DECLARE usr_userid INT;

    SET idtaken = 1;
    SET usr_userid = 0;

    WHILE idtaken > 0 DO
    SET usr_userid = FLOOR(RAND()*(2147483648-200+1)+200);

    SET idtaken = (SELECT 1 FROM ugamela.users WHERE userID = usr_userid);

    -- if the userID was free
    IF(idtaken IS NULL) THEN
        SET idtaken = 0;
    END IF;

    END WHILE;

    SELECT usr_userid AS `userID`;

END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
