-- ========================================
-- DATABASE: IkoMbokaDB
-- AUTHOR: DEV.ANS
-- PURPOSE: Lean hackathon-ready schema
-- ========================================

CREATE DATABASE IkoMbokaDB;
GO

USE IkoMbokaDB;
GO

-- ==========================
-- 1. Services Table
-- ==========================
CREATE TABLE Services (
    ServiceId INT IDENTITY(1,1) PRIMARY KEY,
    ServiceName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL
);
GO

-- ==========================
-- 2. ServiceProviders Table
-- ==========================
CREATE TABLE ServiceProviders (
    ProviderId INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(150) NOT NULL,
    Phone NVARCHAR(20) NOT NULL,
    Email NVARCHAR(100) NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    ServiceId INT NOT NULL,
    RatingAverage DECIMAL(3,2) DEFAULT 0,
    Latitude DECIMAL(9,6) NOT NULL,
    Longitude DECIMAL(9,6) NOT NULL,
    Address NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_ServiceProviders_Services FOREIGN KEY (ServiceId)
        REFERENCES Services(ServiceId)
);
GO

-- ==========================
-- 3. UsersTemp Table
-- ==========================
CREATE TABLE UsersTemp (
    UserTempId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    DeviceIdentifier NVARCHAR(255) NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- ==========================
-- 4. Reviews Table
-- ==========================
CREATE TABLE Reviews (
    ReviewId INT IDENTITY(1,1) PRIMARY KEY,
    ProviderId INT NOT NULL,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    ReviewText NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Reviews_ServiceProviders FOREIGN KEY (ProviderId)
        REFERENCES ServiceProviders(ProviderId)
);
GO

-- ==========================
-- 5. Agreements Table
-- ==========================
CREATE TABLE Agreements (
    AgreementId INT IDENTITY(1,1) PRIMARY KEY,
    ProviderId INT NOT NULL,
    UserTempId UNIQUEIDENTIFIER NOT NULL,
    AgreedPrice DECIMAL(10,2) NOT NULL,
    Status NVARCHAR(20) DEFAULT 'Pending', -- Pending / Confirmed
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Agreements_Providers FOREIGN KEY (ProviderId)
        REFERENCES ServiceProviders(ProviderId),
    CONSTRAINT FK_Agreements_UsersTemp FOREIGN KEY (UserTempId)
        REFERENCES UsersTemp(UserTempId)
);
GO

-- ==========================
-- SAMPLE SEED DATA (optional)
-- ==========================
INSERT INTO Services (ServiceName, Description)
VALUES ('Plumber', 'Plumbing and pipe works'),
       ('Electrician', 'Electrical installations'),
       ('Carpenter', 'Woodwork and repairs');
GO
