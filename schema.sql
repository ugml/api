-- MySQL dump 10.13  Distrib 5.7.23, for osx10.14 (x86_64)
--
-- Host: 62.77.154.132    Database: ugamela
-- ------------------------------------------------------
-- Server version	5.5.5-10.0.38-MariaDB-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

create schema ugamela collate latin1_swedish_ci;

USE ugamela;

--
-- Table structure for table `buildings`
--

DROP TABLE IF EXISTS `buildings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buildings` (
                             `planetID` int(11) NOT NULL,
                             `metal_mine` int(11) NOT NULL DEFAULT '0',
                             `crystal_mine` int(11) NOT NULL DEFAULT '0',
                             `deuterium_synthesizer` int(11) NOT NULL DEFAULT '0',
                             `solar_plant` int(11) NOT NULL DEFAULT '0',
                             `fusion_reactor` int(11) NOT NULL DEFAULT '0',
                             `robotic_factory` int(11) NOT NULL DEFAULT '0',
                             `nanite_factory` int(11) NOT NULL DEFAULT '0',
                             `shipyard` int(11) NOT NULL DEFAULT '0',
                             `metal_storage` int(11) NOT NULL DEFAULT '0',
                             `crystal_storage` int(11) NOT NULL DEFAULT '0',
                             `deuterium_storage` int(11) NOT NULL DEFAULT '0',
                             `research_lab` int(11) NOT NULL DEFAULT '0',
                             `terraformer` int(11) NOT NULL DEFAULT '0',
                             `alliance_depot` int(11) NOT NULL DEFAULT '0',
                             `missile_silo` int(11) NOT NULL DEFAULT '0',
                             UNIQUE KEY `planetid_UNIQUE` (`planetID`),
                             CONSTRAINT `fk_building_planetid` FOREIGN KEY (`planetID`) REFERENCES `planets` (`planetID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `defenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `defenses` (
                            `planetID` int(11) NOT NULL,
                            `rocket_launcher` int(11) NOT NULL DEFAULT '0',
                            `light_laser` int(11) NOT NULL DEFAULT '0',
                            `heavy_laser` int(11) NOT NULL DEFAULT '0',
                            `ion_cannon` int(11) NOT NULL DEFAULT '0',
                            `gauss_cannon` int(11) NOT NULL DEFAULT '0',
                            `plasma_turret` int(11) NOT NULL DEFAULT '0',
                            `small_shield_dome` int(11) NOT NULL DEFAULT '0',
                            `large_shield_dome` int(11) NOT NULL DEFAULT '0',
                            `anti_ballistic_missile` int(11) NOT NULL DEFAULT '0',
                            `interplanetary_missile` int(11) NOT NULL DEFAULT '0',
                            UNIQUE KEY `planetid_UNIQUE` (`planetID`),
                            CONSTRAINT `fk_defense_planetid` FOREIGN KEY (`planetID`) REFERENCES `planets` (`planetID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `errors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `errors` (
                          `id` int(11) NOT NULL AUTO_INCREMENT,
                          `class` text NOT NULL,
                          `method` text NOT NULL,
                          `line` text NOT NULL,
                          `exception` text NOT NULL,
                          `description` text NOT NULL,
                          `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `fleet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fleet` (
                         `planetID` int(11) NOT NULL,
                         `small_cargo_ship` int(11) NOT NULL DEFAULT '0',
                         `large_cargo_ship` int(11) NOT NULL DEFAULT '0',
                         `light_fighter` int(11) NOT NULL DEFAULT '0',
                         `heavy_fighter` int(11) NOT NULL DEFAULT '0',
                         `cruiser` int(11) NOT NULL DEFAULT '0',
                         `battleship` int(11) NOT NULL DEFAULT '0',
                         `colony_ship` int(11) NOT NULL DEFAULT '0',
                         `recycler` int(11) NOT NULL DEFAULT '0',
                         `espionage_probe` int(11) NOT NULL DEFAULT '0',
                         `bomber` int(11) NOT NULL DEFAULT '0',
                         `solar_satellite` int(11) NOT NULL DEFAULT '0',
                         `destroyer` int(11) NOT NULL DEFAULT '0',
                         `battlecruiser` int(11) NOT NULL DEFAULT '0',
                         `deathstar` int(11) NOT NULL DEFAULT '0',
                         UNIQUE KEY `planetid_UNIQUE` (`planetID`),
                         CONSTRAINT `fk_fleet_planetid` FOREIGN KEY (`planetID`) REFERENCES `planets` (`planetID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `flights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `flights` (
                           `flightID` int(11) NOT NULL AUTO_INCREMENT,
                           `ownerID` int(11) NOT NULL,
                           `mission` tinyint(1) NOT NULL,
                           `fleetlist` text NOT NULL,
                           `start_id` int(11) NOT NULL,
                           `start_type` tinyint(1) NOT NULL,
                           `start_time` int(11) NOT NULL,
                           `end_id` int(11) NOT NULL,
                           `end_type` tinyint(1) NOT NULL,
                           `end_time` int(11) NOT NULL,
                           `loaded_metal` int(11) NOT NULL DEFAULT '0',
                           `loaded_crystal` int(11) NOT NULL DEFAULT '0',
                           `loaded_deuterium` int(11) NOT NULL DEFAULT '0',
                           `returning` tinyint(1) NOT NULL DEFAULT '0',
                           `deleted` tinyint(1) NOT NULL DEFAULT '0',
                           PRIMARY KEY (`flightID`),
                           KEY `fk_flight_ownerid` (`ownerID`),
                           CONSTRAINT `fk_flight_ownerid` FOREIGN KEY (`ownerID`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `galaxy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;


CREATE TABLE `galaxy` (
                          `planetID` int(11) NOT NULL DEFAULT '0',
                          `pos_galaxy` int(2) not null,
                          `pos_system` int(3) not null,
                          `pos_planet` int(2) not null,
                          `debris_metal` int(11) NOT NULL DEFAULT '0',
                          `debris_crystal` int(11) NOT NULL DEFAULT '0',
                          UNIQUE KEY `planetid_UNIQUE` (`planetID`),
                          CONSTRAINT `fk_galaxy_planetid` FOREIGN KEY (`planetID`) REFERENCES `planets` (`planetID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
                            `messageID` int(11) NOT NULL AUTO_INCREMENT,
                            `senderID` int(11) NOT NULL,
                            `receiverID` int(11) NOT NULL,
                            `sendtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            `type` tinyint(1) NOT NULL,
                            `subject` varchar(45) NOT NULL,
                            `body` text NOT NULL,
                            `deleted` int(1) default 0 NOT NULL,
                            PRIMARY KEY (`messageID`),
                            UNIQUE KEY `messageID_UNIQUE` (`messageID`),
                            KEY `fk_messages_users1_idx` (`senderID`),
                            KEY `fk_messages_users2_idx` (`receiverID`),
                            CONSTRAINT `fk_messages_users1` FOREIGN KEY (`senderID`) REFERENCES `users` (`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
                            CONSTRAINT `fk_messages_users2` FOREIGN KEY (`receiverID`) REFERENCES `users` (`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `planets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `planets` (
                           `planetID` int(11) NOT NULL,
                           `ownerID` int(11) NOT NULL,
                           `name` varchar(45) DEFAULT NULL,
                           `galaxy` int(11) NOT NULL,
                           `system` int(11) NOT NULL,
                           `planet` int(11) NOT NULL,
                           `last_update` int(11) DEFAULT NULL,
                           `planet_type` int(1) NOT NULL,
                           `image` char(32) NOT NULL,
                           `diameter` int(11) NOT NULL,
                           `fields_current` int(3) NOT NULL DEFAULT '0',
                           `fields_max` int(3) NOT NULL,
                           `temp_min` int(3) NOT NULL,
                           `temp_max` int(3) NOT NULL,
                           `metal` double(16,6) NOT NULL DEFAULT '500.000000',
                           `crystal` double(16,6) NOT NULL DEFAULT '500.000000',
                           `deuterium` double(16,6) NOT NULL DEFAULT '0.000000',
                           `energy_used` int(11) NOT NULL DEFAULT '0',
                           `energy_max` int(11) NOT NULL DEFAULT '0',
                           `metal_mine_percent` int(3) NOT NULL DEFAULT '100',
                           `crystal_mine_percent` int(3) NOT NULL DEFAULT '100',
                           `deuterium_synthesizer_percent` int(3) NOT NULL DEFAULT '100',
                           `solar_plant_percent` int(3) NOT NULL DEFAULT '100',
                           `fusion_reactor_percent` int(3) NOT NULL DEFAULT '100',
                           `solar_satellite_percent` int(3) NOT NULL DEFAULT '100',
                           `b_building_id` int(3) DEFAULT NULL,
                           `b_building_endtime` int(10) DEFAULT NULL,
                           `b_tech_id` int(3) DEFAULT NULL,
                           `b_tech_endtime` int(10) DEFAULT NULL,
                           `b_hangar_id` text,
                           `b_hangar_start_time` int(11) NOT NULL DEFAULT '0',
                           `b_hangar_plus` tinyint(1) NOT NULL DEFAULT '0',
                           `destroyed` tinyint(1) NOT NULL DEFAULT '0',
                           PRIMARY KEY (`planetID`),
                           KEY `fk_planet_ownerid` (`ownerID`),
                           CONSTRAINT `fk_planet_ownerid` FOREIGN KEY (`ownerID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stats` (
                         `userID` int(11) NOT NULL,
                         `points` bigint(11) NOT NULL DEFAULT '0',
                         `old_rank` tinyint(4) NOT NULL DEFAULT '0',
                         `rank` tinyint(4) NOT NULL DEFAULT '0',
                         UNIQUE KEY `userid_UNIQUE` (`userID`),
                         CONSTRAINT `fk_stats_userid` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `techs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `techs` (
                         `userID` int(11) NOT NULL,
                         `espionage_tech` tinyint(2) NOT NULL DEFAULT '0',
                         `computer_tech` tinyint(2) NOT NULL DEFAULT '0',
                         `weapon_tech` tinyint(2) NOT NULL DEFAULT '0',
                         `armour_tech` tinyint(2) NOT NULL DEFAULT '0',
                         `shielding_tech` tinyint(2) NOT NULL DEFAULT '0',
                         `energy_tech` tinyint(2) NOT NULL DEFAULT '0',
                         `hyperspace_tech` tinyint(2) NOT NULL DEFAULT '0',
                         `combustion_drive_tech` tinyint(2) NOT NULL DEFAULT '0',
                         `impulse_drive_tech` tinyint(2) NOT NULL DEFAULT '0',
                         `hyperspace_drive_tech` tinyint(2) NOT NULL DEFAULT '0',
                         `laser_tech` tinyint(2) NOT NULL DEFAULT '0',
                         `ion_tech` tinyint(2) NOT NULL DEFAULT '0',
                         `plasma_tech` tinyint(2) NOT NULL DEFAULT '0',
                         `intergalactic_research_tech` tinyint(2) NOT NULL DEFAULT '0',
                         `graviton_tech` tinyint(2) NOT NULL DEFAULT '0',
                         UNIQUE KEY `userid_UNIQUE` (`userID`),
                         CONSTRAINT `fk_research_userid` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
                         `userID` int(11) NOT NULL,
                         `username` varchar(20) NOT NULL,
                         `password` varchar(60) NOT NULL,
                         `email` varchar(64) NOT NULL,
                         `onlinetime` varchar(10) NOT NULL,
                         `currentplanet` int(11) NOT NULL,
                         PRIMARY KEY (`userID`),
                         UNIQUE KEY `id_UNIQUE` (`userID`),
                         UNIQUE KEY `username_UNIQUE` (`username`),
                         UNIQUE KEY `email_UNIQUE` (`email`),
                         UNIQUE KEY `currentplanet_UNIQUE` (`currentplanet`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

DELIMITER $$
CREATE DEFINER=`ugamela`@`%` PROCEDURE `getFreePosition`(IN maxGalaxy int, IN maxSystem int, IN minPlanet int, IN maxPlanet int)
BEGIN
    DECLARE pos_galaxy INT;
    DECLARE pos_system INT;
    DECLARE pos_planet INT;

    DECLARE taken TINYINT(1) DEFAULT 1;

    WHILE taken > 0 DO
    SET pos_galaxy = ROUND(RAND()*(maxGalaxy-1)+1);
    SET pos_system = ROUND(RAND()*(maxSystem-1)+1);
    SET pos_planet = ROUND(RAND()*(maxPlanet-minPlanet)+minPlanet);

    SET taken = (SELECT 1 FROM ugamela.planets WHERE 'galaxy' = CONCAT('', pos_galaxy) AND 'system' = CONCAT('', pos_system) AND 'planet' = CONCAT('', pos_planet));

    -- if the userID was free
    IF(taken IS NULL) THEN
        SET taken = 0;
    END IF;

    END WHILE;

    SELECT pos_galaxy AS `posGalaxy`, pos_system AS `posSystem`, pos_planet AS `posPlanet`;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`ugamela`@`%` PROCEDURE `getNewPlanetId`()
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

DELIMITER $$
CREATE DEFINER=`ugamela`@`%` PROCEDURE `getNewUserId`()
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

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-15 19:20:29
