USE IkoMbokaDB;
GO

/* ============================
   CRUD: SERVICES
   ============================ */
CREATE OR ALTER PROCEDURE sp_AddService
    @ServiceName NVARCHAR(100),
    @Description NVARCHAR(255)
AS
BEGIN
    INSERT INTO Services (ServiceName, Description)
    VALUES (@ServiceName, @Description);
END;
GO
USE IkoMbokaDB;
GO
CREATE OR ALTER PROCEDURE sp_GetServices
AS
BEGIN
    SELECT * FROM Services ORDER BY ServiceName;
END;
GO

CREATE OR ALTER PROCEDURE sp_UpdateService
    @ServiceId INT,
    @ServiceName NVARCHAR(100),
    @Description NVARCHAR(255)
AS
BEGIN
    UPDATE Services
    SET ServiceName = @ServiceName,
        Description = @Description
    WHERE ServiceId = @ServiceId;
END;
GO

CREATE OR ALTER PROCEDURE sp_DeleteService
    @ServiceId INT
AS
BEGIN
    DELETE FROM Services WHERE ServiceId = @ServiceId;
END;
GO
/* ============================================
   3. Get Service Summary
   ============================================ */
CREATE OR ALTER PROCEDURE sp_GetServiceSummary
AS
BEGIN
    SELECT 
        s.ServiceId,
        s.ServiceName,
        COUNT(sp.ProviderId) AS ProviderCount,
        CAST(AVG(sp.RatingAverage) AS DECIMAL(3,2)) AS AvgServiceRating
    FROM Services s
    LEFT JOIN ServiceProviders sp ON s.ServiceId = sp.ServiceId
    GROUP BY s.ServiceId, s.ServiceName
    ORDER BY s.ServiceName;
END;
GO


/* ============================
   CRUD: SERVICE PROVIDERS
   ============================ */
CREATE OR ALTER PROCEDURE sp_AddServiceProvider
    @FullName NVARCHAR(150),
    @Phone NVARCHAR(20),
    @Email NVARCHAR(100),
    @PasswordHash NVARCHAR(255),
    @ServiceId INT,
    @Latitude DECIMAL(9,6),
    @Longitude DECIMAL(9,6),
    @Address NVARCHAR(255)
AS
BEGIN
    INSERT INTO ServiceProviders
        (FullName, Phone, Email, PasswordHash, ServiceId, Latitude, Longitude, Address)
    VALUES
        (@FullName, @Phone, @Email, @PasswordHash, @ServiceId, @Latitude, @Longitude, @Address);
END;
GO

CREATE OR ALTER PROCEDURE sp_GetServiceProviders
AS
BEGIN
    SELECT sp.*, s.ServiceName
    FROM ServiceProviders sp
    INNER JOIN Services s ON sp.ServiceId = s.ServiceId
    ORDER BY sp.RatingAverage DESC, sp.FullName;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetProvidersByService
    @ServiceId INT
AS
BEGIN
    SELECT sp.*, s.ServiceName
    FROM ServiceProviders sp
    INNER JOIN Services s ON sp.ServiceId = s.ServiceId
    WHERE sp.ServiceId = @ServiceId
    ORDER BY sp.RatingAverage DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_UpdateServiceProvider
    @ProviderId INT,
    @FullName NVARCHAR(150),
    @Phone NVARCHAR(20),
    @Email NVARCHAR(100),
    @ServiceId INT,
    @Latitude DECIMAL(9,6),
    @Longitude DECIMAL(9,6),
    @Address NVARCHAR(255)
AS
BEGIN
    UPDATE ServiceProviders
    SET FullName = @FullName,
        Phone = @Phone,
        Email = @Email,
        ServiceId = @ServiceId,
        Latitude = @Latitude,
        Longitude = @Longitude,
        Address = @Address
    WHERE ProviderId = @ProviderId;
END;
GO

CREATE OR ALTER PROCEDURE sp_DeleteServiceProvider
    @ProviderId INT
AS
BEGIN
    DELETE FROM ServiceProviders WHERE ProviderId = @ProviderId;
END;
GO
/* ============================================
   1. Get Providers Near Location (Haversine)
   ============================================ */
CREATE OR ALTER PROCEDURE sp_GetProvidersNearLocation
    @Latitude DECIMAL(9,6),
    @Longitude DECIMAL(9,6),
    @RadiusKm FLOAT
AS
BEGIN
    -- Haversine formula to calculate distance between two coordinates in KM
    SELECT 
        sp.ProviderId,
        sp.FullName,
        sp.Phone,
        sp.Email,
        sp.RatingAverage,
        sp.Latitude,
        sp.Longitude,
        s.ServiceName,
        sp.Address,
        (
            6371 * ACOS(
                COS(RADIANS(@Latitude)) * COS(RADIANS(sp.Latitude)) *
                COS(RADIANS(sp.Longitude) - RADIANS(@Longitude)) +
                SIN(RADIANS(@Latitude)) * SIN(RADIANS(sp.Latitude))
            )
        ) AS DistanceKm
    FROM ServiceProviders sp
    INNER JOIN Services s ON sp.ServiceId = s.ServiceId
    WHERE (
        6371 * ACOS(
            COS(RADIANS(@Latitude)) * COS(RADIANS(sp.Latitude)) *
            COS(RADIANS(sp.Longitude) - RADIANS(@Longitude)) +
            SIN(RADIANS(@Latitude)) * SIN(RADIANS(sp.Latitude))
        )
    ) <= @RadiusKm
    ORDER BY DistanceKm, sp.RatingAverage DESC;
END;
GO
USE IkoMbokaDB;
GO
CREATE OR ALTER PROCEDURE sp_GetProvidersNearLocationByService
    @Latitude DECIMAL(9,6),
    @Longitude DECIMAL(9,6),
    @RadiusKm FLOAT,
    @ServiceId INT
AS
BEGIN
    -- Haversine formula to calculate distance between two coordinates in KM
    SELECT 
        sp.ProviderId,
        sp.FullName,
        sp.Phone,
        sp.Email,
        sp.RatingAverage,
        sp.Latitude,
        sp.Longitude,
        s.ServiceName,
        sp.Address,
        (
            6371 * ACOS(
                COS(RADIANS(@Latitude)) * COS(RADIANS(sp.Latitude)) *
                COS(RADIANS(sp.Longitude) - RADIANS(@Longitude)) +
                SIN(RADIANS(@Latitude)) * SIN(RADIANS(sp.Latitude))
            )
        ) AS DistanceKm
    FROM ServiceProviders sp
    INNER JOIN Services s ON sp.ServiceId = s.ServiceId
    WHERE (
        6371 * ACOS(
            COS(RADIANS(@Latitude)) * COS(RADIANS(sp.Latitude)) *
            COS(RADIANS(sp.Longitude) - RADIANS(@Longitude)) +
            SIN(RADIANS(@Latitude)) * SIN(RADIANS(sp.Latitude))
        )
    ) <= @RadiusKm
    AND sp.ServiceId = @ServiceId
    ORDER BY DistanceKm, sp.RatingAverage DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetProviderDetails
    @ProviderId INT
AS
BEGIN
    SELECT 
        sp.ProviderId,
        sp.FullName,
        sp.Phone,
        sp.Email,
        sp.RatingAverage,
        sp.Latitude,
        sp.Longitude,
        s.ServiceName,
        sp.Address
    FROM ServiceProviders sp
    INNER JOIN Services s ON sp.ServiceId = s.ServiceId
    WHERE sp.ProviderId = @ProviderId;
END;
GO

/* ============================================
   2. Get Top Rated Providers
   ============================================ */
CREATE OR ALTER PROCEDURE sp_GetTopRatedProviders
    @TopN INT = 5
AS
BEGIN
    SELECT TOP (@TopN)
        sp.ProviderId,
        sp.FullName,
        s.ServiceName,
        sp.RatingAverage,
        sp.Phone,
        sp.Email,
        sp.Address
    FROM ServiceProviders sp
    INNER JOIN Services s ON sp.ServiceId = s.ServiceId
    ORDER BY sp.RatingAverage DESC, sp.FullName ASC;
END;
GO


/* ============================
   CRUD: REVIEWS
   ============================ */
CREATE OR ALTER PROCEDURE sp_AddReview
    @ProviderId INT,
    @Rating INT,
    @ReviewText NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO Reviews (ProviderId, Rating, ReviewText)
    VALUES (@ProviderId, @Rating, @ReviewText);

    -- Update provider’s average rating
    UPDATE ServiceProviders
    SET RatingAverage = (
        SELECT CAST(AVG(Rating * 1.0) AS DECIMAL(3,2))
        FROM Reviews WHERE ProviderId = @ProviderId
    )
    WHERE ProviderId = @ProviderId;
END;
GO
USE IkoMbokaDB;
GO

CREATE OR ALTER PROCEDURE sp_GetReviewsForProvider
    @ProviderId INT
AS
BEGIN
    SELECT * FROM Reviews
    WHERE ProviderId = @ProviderId
    ORDER BY CreatedAt DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_UpdateReview
    @ReviewId INT,
    @Rating INT,
    @ReviewText NVARCHAR(MAX)
AS
BEGIN
    DECLARE @ProviderId INT;
    SELECT @ProviderId = ProviderId FROM Reviews WHERE ReviewId = @ReviewId;

    UPDATE Reviews
    SET Rating = @Rating, ReviewText = @ReviewText
    WHERE ReviewId = @ReviewId;

    -- Recalculate average rating
    UPDATE ServiceProviders
    SET RatingAverage = (
        SELECT CAST(AVG(Rating * 1.0) AS DECIMAL(3,2))
        FROM Reviews WHERE ProviderId = @ProviderId
    )
    WHERE ProviderId = @ProviderId;
END;
GO

CREATE OR ALTER PROCEDURE sp_DeleteReview
    @ReviewId INT
AS
BEGIN
    DECLARE @ProviderId INT;
    SELECT @ProviderId = ProviderId FROM Reviews WHERE ReviewId = @ReviewId;

    DELETE FROM Reviews WHERE ReviewId = @ReviewId;

    -- Recalculate average rating
    UPDATE ServiceProviders
    SET RatingAverage = (
        SELECT CAST(AVG(Rating * 1.0) AS DECIMAL(3,2))
        FROM Reviews WHERE ProviderId = @ProviderId
    )
    WHERE ProviderId = @ProviderId;
END;
GO


/* ============================
   CRUD: AGREEMENTS
   ============================ */
CREATE OR ALTER PROCEDURE sp_AddAgreement
    @ProviderId INT,
    @UserTempId UNIQUEIDENTIFIER,
    @AgreedPrice DECIMAL(10,2)
AS
BEGIN
    INSERT INTO Agreements (ProviderId, UserTempId, AgreedPrice)
    VALUES (@ProviderId, @UserTempId, @AgreedPrice);
END;
GO

CREATE OR ALTER PROCEDURE sp_GetAgreements
AS
BEGIN
    SELECT a.*, sp.FullName, s.ServiceName
    FROM Agreements a
    INNER JOIN ServiceProviders sp ON a.ProviderId = sp.ProviderId
    INNER JOIN Services s ON sp.ServiceId = s.ServiceId
    ORDER BY a.CreatedAt DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_UpdateAgreementStatus
    @AgreementId INT,
    @Status NVARCHAR(20)
AS
BEGIN
    UPDATE Agreements
    SET Status = @Status
    WHERE AgreementId = @AgreementId;
END;
GO

CREATE OR ALTER PROCEDURE sp_DeleteAgreement
    @AgreementId INT
AS
BEGIN
    DELETE FROM Agreements WHERE AgreementId = @AgreementId;
END;
GO

/* ============================================
   4. Get Agreements by Provider
   ============================================ */
CREATE OR ALTER PROCEDURE sp_GetAgreementsByProvider
    @ProviderId INT
AS
BEGIN
    SELECT 
        a.AgreementId,
        a.AgreedPrice,
        a.Status,
        a.CreatedAt,
        ut.UserTempId,
        ut.DeviceIdentifier
    FROM Agreements a
    INNER JOIN UsersTemp ut ON a.UserTempId = ut.UserTempId
    WHERE a.ProviderId = @ProviderId
    ORDER BY a.CreatedAt DESC;
END;
GO


/* ============================================
    Get Agreements by Temporary User
   ============================================ */
CREATE OR ALTER PROCEDURE sp_GetAgreementsByUserTemp
    @UserTempId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT 
        a.AgreementId,
        a.AgreedPrice,
        a.Status,
        a.CreatedAt,
        sp.FullName AS ProviderName,
        s.ServiceName
    FROM Agreements a
    INNER JOIN ServiceProviders sp ON a.ProviderId = sp.ProviderId
    INNER JOIN Services s ON sp.ServiceId = s.ServiceId
    WHERE a.UserTempId = @UserTempId
    ORDER BY a.CreatedAt DESC;
END;
GO