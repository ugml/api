/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP SCHEMA IF EXISTS ugamela;

create schema ugamela collate latin1_swedish_ci;

USE ugamela;


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
                         `bTechID` int(3) DEFAULT 0,
                         `bTechEndTime` int(10) DEFAULT 0,
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
                          `inQueue` tinyint(1) NOT NULL DEFAULT 0,
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

INSERT INTO `users` VALUES(1,'admin','$2a$10$361VQc/9fVCzbQCxLNQbpOU9zn0Dp6iBq0uymfY1H5s3IuLUMPKJS','user_1501005189510@test.com','1556635321',167546850,0,0),(35,'LGY2Y37244','$2y$10$vuN6zY0x3.OyGo3OkjCXP.7j1zFMqvb54dQrGCO.Fk6rjmUZ7.iLq','L17@WEC.test','1521057486',93133,0,0),(41,'TO17AWPCL8','$2y$10$MJWeh1cgdlouSNsBCO4RUOmxndjCRk69kiVY/ctswbDncbKyfoVqC','BVK@F67.test','1521057319',50832,0,0),(48,'CGY6098AFK','$2y$10$fH8nF33GYS2VIE8sggjzO.iqzwGYGUousLPeG9xDa.zdM5OU5.9ay','HCM@5NF.test','1521057390',87851,0,0),(59,'WPV14MGVSJ','$2y$10$uBO3yb0a7.FgmRQffxzZF.ByC0OZtNMyUdTFqFraf3flvvBbONlDi','QXS@0VK.test','0',61614,0,0),(74,'YTNAP87LZ3','$2y$10$bm6QTXo3nRdVHTHJa.fOBuM26lk3sI94103MKkvh7tsplmIGK0OTy','10G@4RA.test','0',62338,0,0);
INSERT INTO `planets` VALUES(50832,41,'Heimatplanet',9,44,4,1521057319,1,'wuestenplanet01',10094,0,102,64,64,500.000000,500.000000,0.000000,0,0,100,100,100,100,100,100,NULL,NULL,false,NULL,0,0,0),(61614,59,'Heimatplanet',7,5,7,1521056909,1,'trockenplanet01',11957,0,143,115,115,500.000000,500.000000,0.000000,0,0,100,100,100,100,100,100,NULL,NULL,false,NULL,0,0,0),(62338,74,'Heimatplanet',6,46,7,1521056944,1,'wuestenplanet02',11823,0,140,123,123,500.000000,500.000000,0.000000,0,0,100,100,100,100,100,100,NULL,NULL,false,NULL,0,0,0),(87851,48,'Heimatplanet',7,5,5,1521057391,1,'trockenplanet01',10433,0,109,56,56,500.000000,500.000000,0.000000,0,0,100,100,100,100,100,100,NULL,NULL,false,NULL,0,0,0),(93133,35,'Heimatplanet',4,71,2,1521057486,1,'trockenplanet05',12894,0,166,42,42,500.000000,500.000000,0.000000,0,0,100,100,100,100,100,100,NULL,NULL,false,NULL,0,0,0),(167546850,1,'Homeplanet',9,54,1,1556635321,1,'dschjungelplanet02',14452,0,196,73,195,316000.000000,315555.000000,200000.000000,398,2211,100,100,100,100,100,100,0,0,false,NULL,0,0,0),(167546999,1,'SecondPlanet',9,54,2,1556635321,1,'dschjungelplanet02',14452,0,196,73,195,316000.000000,315555.000000,200000.000000,398,2211,100,100,100,100,100,100,0,0,false,NULL,0,0,0);
INSERT INTO `buildings` VALUES (50832,10,5,4,4,0,3,0,8,5,4,2,3,0,0,0),(61614,10,5,4,4,0,3,0,8,5,4,2,3,0,0,0),(62338,10,5,4,4,0,3,0,8,5,4,2,3,0,0,0),(87851,10,5,4,4,0,3,0,8,5,4,2,3,0,0,0),(93133,10,5,4,4,0,3,0,8,5,4,2,3,0,0,0),(167546850,10,5,4,4,0,3,0,8,5,4,2,3,0,0,0), (167546999,10,5,4,4,0,3,0,8,5,4,2,3,0,0,0);
INSERT INTO `defenses` VALUES (50832,0,0,0,0,0,0,0,0,0,0),(61614,0,0,0,0,0,0,0,0,0,0),(62338,0,0,0,0,0,0,0,0,0,0),(87851,0,0,0,0,0,0,0,0,0,0),(93133,0,0,0,0,0,0,0,0,0,0),(167546850,0,0,0,0,0,0,0,0,0,0),(167546999,0,0,0,0,0,0,0,0,0,0);
INSERT INTO `ships` VALUES (50832,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(61614,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(62338,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(87851,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(93133,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(167546850,5000,0,0,0,0,0,0,0,0,0,31,0,0,0),(167546999,5000,0,0,0,0,0,0,0,0,0,31,0,0,0);
INSERT INTO `galaxy` VALUES (50832,9,44,4,0,0),(61614,7,5,7,0,0),(62338,6,46,7,0,0),(87851,7,5,5,0,0),(93133,4,71,2,0,0),(167546850,9,54,1,0,0), (167546999,9,54,2,0,0);
INSERT INTO `messages` VALUES (1,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(2,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(3,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(4,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(5,1,1,'2019-07-15 14:46:13',1,'test','asdf',0),(6,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(7,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(8,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(9,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(10,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(11,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(12,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(13,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(14,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(15,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(16,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(17,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(18,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(19,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(20,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(21,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(22,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(23,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(24,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(25,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(26,1,1,'0000-00-00 00:00:00',1,'test','asdf',0),(27,1,1,'2019-07-08 16:23:23',1,'test','asdf',0),(35,1,48,'2019-07-08 19:27:21',1,'Test','Test',0),(36,1,48,'2019-07-08 19:28:16',1,'Test','Test',0),(37,1,48,'2019-07-08 19:28:28',1,'Test','Test',0),(38,1,48,'2019-07-12 10:53:17',1,'Test','Test',0),(39,1,48,'2019-07-12 10:54:44',1,'Test','Test',0),(40,1,48,'2019-07-12 10:55:57',1,'Test','Test',0),(41,1,48,'2019-07-12 10:56:48',1,'Test','Test',0),(42,1,48,'2019-07-12 10:58:14',1,'Test','Test',0),(43,1,48,'2019-07-12 11:08:39',1,'Test','Test',0),(44,1,48,'2019-07-14 15:20:08',1,'Test','Test',0),(45,1,48,'2019-07-14 15:21:46',1,'Test','Test',0),(46,1,48,'2019-07-14 15:22:33',1,'Test','Test',0),(47,1,48,'2019-07-14 15:23:36',1,'Test','Test',0),(48,1,48,'2019-07-14 15:27:50',1,'Test','Test',0),(49,1,48,'2019-07-14 15:30:02',1,'Test','Test',0),(50,1,48,'2019-07-14 16:06:17',1,'Test','Test',0),(51,1,48,'2019-07-14 16:12:22',1,'Test','Test',0),(52,1,48,'2019-07-14 16:29:43',1,'Test','Test',0),(53,1,48,'2019-07-14 16:30:14',1,'Test','Test',0),(54,1,48,'2019-07-14 16:30:40',1,'Test','Test',0),(55,1,48,'2019-07-14 17:58:55',1,'Test','Test',0),(56,1,48,'2019-07-14 18:04:55',1,'Test','Test',0),(57,1,48,'2019-07-14 18:20:00',1,'Test','Test',0),(58,1,48,'2019-07-14 18:21:26',1,'Test','Test',0),(59,1,48,'2019-07-14 18:22:11',1,'Test','Test',0),(60,1,48,'2019-07-14 18:24:26',1,'Test','Test',0),(61,1,48,'2019-07-15 04:26:21',1,'Test','Test',0),(62,1,48,'2019-07-15 04:29:06',1,'Test','Test',0),(63,1,48,'2019-07-15 04:32:30',1,'Test','Test',0),(64,1,48,'2019-07-15 04:38:53',1,'Test','Test',0),(65,1,48,'2019-07-15 04:53:32',1,'Test','Test',0),(66,1,48,'2019-07-15 05:01:35',1,'Test','Test',0),(67,1,48,'2019-07-15 05:08:03',1,'Test','Test',0),(68,1,48,'2019-07-15 13:55:41',1,'Test','Test',0),(69,1,48,'2019-07-15 14:17:12',1,'Test','Test',0),(70,1,48,'2019-07-15 14:21:55',1,'Test','Test',0),(71,1,48,'2019-07-15 14:43:56',1,'Test','Test',0),(72,1,48,'2019-07-15 14:45:58',1,'Test','Test',0);
INSERT INTO `stats` VALUES (1,2220584795,1,1);
INSERT INTO `techs` VALUES (1,1,23,23,23,23,23,23,23,23,23,23,23,23,21,1),(35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(41,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(48,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(59,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0),(74,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
INSERT INTO `events` VALUES (1, 1, 2, '{"201":612,"202":357,"203":617,"204":800,"205":709,"206":204,"207":703,"208":85,"209":631,"210":388,"211":0,"212":723,"213":557,"214":106}', 167546850, 1, 1563979907, 93133, 1, 1565146584, 443, 980, 220, 0, 0, 0);


/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;


DELIMITER //
CREATE PROCEDURE `getFreePosition`(IN maxGalaxy int, IN maxSystem int, IN minPlanet int, IN maxPlanet int)
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

END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE `getNewPlanetId`()
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

END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE `getNewUserId`()
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

END//
DELIMITER ;

CREATE USER IF NOT EXISTS 'dev' IDENTIFIED BY 'dev';
GRANT ALL ON *.* TO 'dev'@localhost IDENTIFIED BY 'dev';
FLUSH PRIVILEGES;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
