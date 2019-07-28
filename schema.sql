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
                         `last_time_online` varchar(10) NOT NULL,
                         `current_planet` int(11) NOT NULL,
                         PRIMARY KEY (`userID`),
                         UNIQUE KEY `id_UNIQUE` (`userID`),
                         UNIQUE KEY `username_UNIQUE` (`username`),
                         UNIQUE KEY `email_UNIQUE` (`email`),
                         UNIQUE KEY `current_planet_UNIQUE` (`current_planet`)
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
                           `pos_galaxy` int(11) NOT NULL,
                           `pos_system` int(11) NOT NULL,
                           `pos_planet` int(11) NOT NULL,
                           `last_update` int(11) DEFAULT NULL,
                           `planet_type` int(1) NOT NULL,
                           `image` char(32) NOT NULL,
                           `diameter` int(11) NOT NULL,
                           `fields_current` int(3) NOT NULL DEFAULT 0,
                           `fields_max` int(3) NOT NULL,
                           `temp_min` int(3) NOT NULL,
                           `temp_max` int(3) NOT NULL,
                           `metal` double(16,6) NOT NULL DEFAULT 500.000000,
                           `crystal` double(16,6) NOT NULL DEFAULT 500.000000,
                           `deuterium` double(16,6) NOT NULL DEFAULT 0.000000,
                           `energy_used` int(11) NOT NULL DEFAULT 0,
                           `energy_max` int(11) NOT NULL DEFAULT 0,
                           `metal_mine_percent` int(3) NOT NULL DEFAULT 100,
                           `crystal_mine_percent` int(3) NOT NULL DEFAULT 100,
                           `deuterium_synthesizer_percent` int(3) NOT NULL DEFAULT 100,
                           `solar_plant_percent` int(3) NOT NULL DEFAULT 100,
                           `fusion_reactor_percent` int(3) NOT NULL DEFAULT 100,
                           `solar_satellite_percent` int(3) NOT NULL DEFAULT 100,
                           `b_building_id` int(3) DEFAULT NULL,
                           `b_building_endtime` int(10) DEFAULT NULL,
                           `b_building_demolition` bool default FALSE not null,
                           `b_tech_id` int(3) DEFAULT NULL,
                           `b_tech_endtime` int(10) DEFAULT NULL,
                           `b_hangar_queue` text default NULL,
                           `b_hangar_start_time` int(11) NOT NULL DEFAULT 0,
                           `b_hangar_plus` tinyint(1) NOT NULL DEFAULT 0,
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
                             `metal_mine` int(11) NOT NULL DEFAULT 0,
                             `crystal_mine` int(11) NOT NULL DEFAULT 0,
                             `deuterium_synthesizer` int(11) NOT NULL DEFAULT 0,
                             `solar_plant` int(11) NOT NULL DEFAULT 0,
                             `fusion_reactor` int(11) NOT NULL DEFAULT 0,
                             `robotic_factory` int(11) NOT NULL DEFAULT 0,
                             `nanite_factory` int(11) NOT NULL DEFAULT 0,
                             `shipyard` int(11) NOT NULL DEFAULT 0,
                             `metal_storage` int(11) NOT NULL DEFAULT 0,
                             `crystal_storage` int(11) NOT NULL DEFAULT 0,
                             `deuterium_storage` int(11) NOT NULL DEFAULT 0,
                             `research_lab` int(11) NOT NULL DEFAULT 0,
                             `terraformer` int(11) NOT NULL DEFAULT 0,
                             `alliance_depot` int(11) NOT NULL DEFAULT 0,
                             `missile_silo` int(11) NOT NULL DEFAULT 0,
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
                            `rocket_launcher` int(11) NOT NULL DEFAULT 0,
                            `light_laser` int(11) NOT NULL DEFAULT 0,
                            `heavy_laser` int(11) NOT NULL DEFAULT 0,
                            `ion_cannon` int(11) NOT NULL DEFAULT 0,
                            `gauss_cannon` int(11) NOT NULL DEFAULT 0,
                            `plasma_turret` int(11) NOT NULL DEFAULT 0,
                            `small_shield_dome` int(11) NOT NULL DEFAULT 0,
                            `large_shield_dome` int(11) NOT NULL DEFAULT 0,
                            `anti_ballistic_missile` int(11) NOT NULL DEFAULT 0,
                            `interplanetary_missile` int(11) NOT NULL DEFAULT 0,
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
                         `small_cargo_ship` int(11) NOT NULL DEFAULT 0,
                         `large_cargo_ship` int(11) NOT NULL DEFAULT 0,
                         `light_fighter` int(11) NOT NULL DEFAULT 0,
                         `heavy_fighter` int(11) NOT NULL DEFAULT 0,
                         `cruiser` int(11) NOT NULL DEFAULT 0,
                         `battleship` int(11) NOT NULL DEFAULT 0,
                         `colony_ship` int(11) NOT NULL DEFAULT 0,
                         `recycler` int(11) NOT NULL DEFAULT 0,
                         `espionage_probe` int(11) NOT NULL DEFAULT 0,
                         `bomber` int(11) NOT NULL DEFAULT 0,
                         `solar_satellite` int(11) NOT NULL DEFAULT 0,
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
                          `start_id` int(11) NOT NULL,
                          `start_type` tinyint(1) NOT NULL,
                          `start_time` int(11) NOT NULL,
                          `end_id` int(11) NOT NULL,
                          `end_type` tinyint(1) NOT NULL,
                          `end_time` int(11) NOT NULL,
                          `loaded_metal` int(11) NOT NULL DEFAULT 0,
                          `loaded_crystal` int(11) NOT NULL DEFAULT 0,
                          `loaded_deuterium` int(11) NOT NULL DEFAULT 0,
                          `returning` tinyint(1) NOT NULL DEFAULT 0,
                          `deleted` tinyint(1) NOT NULL DEFAULT 0,
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
                          `pos_galaxy` int(2) NOT NULL,
                          `pos_system` int(3) NOT NULL,
                          `pos_planet` int(2) NOT NULL,
                          `debris_metal` int(11) NOT NULL DEFAULT 0,
                          `debris_crystal` int(11) NOT NULL DEFAULT 0,
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
                         `old_rank` tinyint(4) NOT NULL DEFAULT 0,
                         `rank` tinyint(4) NOT NULL DEFAULT 0,
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
                         `espionage_tech` tinyint(2) NOT NULL DEFAULT 0,
                         `computer_tech` tinyint(2) NOT NULL DEFAULT 0,
                         `weapon_tech` tinyint(2) NOT NULL DEFAULT 0,
                         `armour_tech` tinyint(2) NOT NULL DEFAULT 0,
                         `shielding_tech` tinyint(2) NOT NULL DEFAULT 0,
                         `energy_tech` tinyint(2) NOT NULL DEFAULT 0,
                         `hyperspace_tech` tinyint(2) NOT NULL DEFAULT 0,
                         `combustion_drive_tech` tinyint(2) NOT NULL DEFAULT 0,
                         `impulse_drive_tech` tinyint(2) NOT NULL DEFAULT 0,
                         `hyperspace_drive_tech` tinyint(2) NOT NULL DEFAULT 0,
                         `laser_tech` tinyint(2) NOT NULL DEFAULT 0,
                         `ion_tech` tinyint(2) NOT NULL DEFAULT 0,
                         `plasma_tech` tinyint(2) NOT NULL DEFAULT 0,
                         `intergalactic_research_tech` tinyint(2) NOT NULL DEFAULT 0,
                         `graviton_tech` tinyint(2) NOT NULL DEFAULT 0,
                         UNIQUE KEY `userid_UNIQUE` (`userID`),
                         CONSTRAINT `fk_research_userid` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

-- -----------------------------------------------------
-- procedure getFreePosition
-- -----------------------------------------------------

DELIMITER $$
USE `ugamela`$$
CREATE DEFINER=`root`@`%` PROCEDURE `getFreePosition`(IN maxGalaxy int, IN maxSystem int, IN minPlanet int, IN maxPlanet int)
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

    SELECT pos_galaxy AS `pos_galaxy`, pos_system AS `pos_system`, pos_planet AS `pos_planet`;

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
