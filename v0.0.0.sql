USE [master]
GO
/****** Object:  Database [CLOTHES369]    Script Date: 12/3/2024 10:29:27 AM ******/
CREATE DATABASE [CLOTHES369]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'CLOTHES369', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\CLOTHES369.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'CLOTHES369_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\CLOTHES369_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [CLOTHES369] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [CLOTHES369].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [CLOTHES369] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [CLOTHES369] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [CLOTHES369] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [CLOTHES369] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [CLOTHES369] SET ARITHABORT OFF 
GO
ALTER DATABASE [CLOTHES369] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [CLOTHES369] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [CLOTHES369] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [CLOTHES369] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [CLOTHES369] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [CLOTHES369] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [CLOTHES369] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [CLOTHES369] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [CLOTHES369] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [CLOTHES369] SET  ENABLE_BROKER 
GO
ALTER DATABASE [CLOTHES369] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [CLOTHES369] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [CLOTHES369] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [CLOTHES369] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [CLOTHES369] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [CLOTHES369] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [CLOTHES369] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [CLOTHES369] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [CLOTHES369] SET  MULTI_USER 
GO
ALTER DATABASE [CLOTHES369] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [CLOTHES369] SET DB_CHAINING OFF 
GO
ALTER DATABASE [CLOTHES369] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [CLOTHES369] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [CLOTHES369] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [CLOTHES369] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [CLOTHES369] SET QUERY_STORE = ON
GO
ALTER DATABASE [CLOTHES369] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [CLOTHES369]
GO
/****** Object:  Table [dbo].[CartItem]    Script Date: 12/3/2024 10:29:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CartItem](
	[userID] [int] NULL,
	[productID] [int] NULL,
	[quantity] [int] NOT NULL,
	[createAt] [datetime] NOT NULL,
	[updateAt] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Collections]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Collections](
	[collectionID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[createAt] [datetime] NOT NULL,
	[updateAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[collectionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderItem]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderItem](
	[orderId] [int] NULL,
	[name] [nvarchar](255) NOT NULL,
	[description] [text] NULL,
	[color] [nvarchar](255) NOT NULL,
	[size] [varchar](255) NOT NULL,
	[linkImage] [varchar](255) NULL,
	[quantity] [smallint] NOT NULL,
	[price] [int] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[orderID] [int] IDENTITY(1,1) NOT NULL,
	[userID] [int] NULL,
	[status] [nvarchar](255) NOT NULL,
	[createAt] [datetime] NOT NULL,
	[updateAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[orderID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductCollection]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductCollection](
	[productID] [int] NULL,
	[collectionID] [int] NULL,
	[createAt] [datetime] NOT NULL,
	[updateAt] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductPromotion]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductPromotion](
	[productID] [int] NULL,
	[promotionID] [int] NULL,
	[createAt] [datetime] NOT NULL,
	[updateAt] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[productID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[description] [text] NULL,
	[price] [int] NULL,
	[quantity] [smallint] NULL,
	[color] [nvarchar](255) NOT NULL,
	[size] [varchar](255) NOT NULL,
	[linkImage] [nvarchar](255) NULL,
	[createAt] [datetime] NOT NULL,
	[updateAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[productID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Promotions]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Promotions](
	[promotionID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[reduce] [tinyint] NULL,
	[startTime] [datetime] NOT NULL,
	[endTime] [datetime] NOT NULL,
	[createAt] [datetime] NOT NULL,
	[updateAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[promotionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[userID] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](255) NULL,
	[email] [varchar](255) NOT NULL,
	[password] [nvarchar](255) NOT NULL,
	[role] [varchar](255) NULL,
	[createAt] [datetime] NOT NULL,
	[updateAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[userID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[CartItem] ADD  DEFAULT (getdate()) FOR [createAt]
GO
ALTER TABLE [dbo].[Collections] ADD  DEFAULT (getdate()) FOR [createAt]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT ('Process') FOR [status]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT (getdate()) FOR [createAt]
GO
ALTER TABLE [dbo].[ProductCollection] ADD  DEFAULT (getdate()) FOR [createAt]
GO
ALTER TABLE [dbo].[ProductPromotion] ADD  DEFAULT (getdate()) FOR [createAt]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT (getdate()) FOR [createAt]
GO
ALTER TABLE [dbo].[Promotions] ADD  DEFAULT (getdate()) FOR [createAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ('client') FOR [role]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [createAt]
GO
ALTER TABLE [dbo].[CartItem]  WITH CHECK ADD FOREIGN KEY([productID])
REFERENCES [dbo].[Products] ([productID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CartItem]  WITH CHECK ADD FOREIGN KEY([userID])
REFERENCES [dbo].[Users] ([userID])
GO
ALTER TABLE [dbo].[OrderItem]  WITH CHECK ADD FOREIGN KEY([orderId])
REFERENCES [dbo].[Orders] ([orderID])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([userID])
REFERENCES [dbo].[Users] ([userID])
GO
ALTER TABLE [dbo].[ProductCollection]  WITH CHECK ADD FOREIGN KEY([collectionID])
REFERENCES [dbo].[Collections] ([collectionID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ProductCollection]  WITH CHECK ADD FOREIGN KEY([productID])
REFERENCES [dbo].[Products] ([productID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ProductPromotion]  WITH CHECK ADD FOREIGN KEY([productID])
REFERENCES [dbo].[Products] ([productID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ProductPromotion]  WITH CHECK ADD FOREIGN KEY([promotionID])
REFERENCES [dbo].[Promotions] ([promotionID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[OrderItem]  WITH CHECK ADD CHECK  (([price]>=(0)))
GO
ALTER TABLE [dbo].[OrderItem]  WITH CHECK ADD CHECK  (([quantity]>=(1)))
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD CHECK  (([price]>=(0)))
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD CHECK  (([quantity]>=(0)))
GO
ALTER TABLE [dbo].[Promotions]  WITH CHECK ADD CHECK  (([reduce]>=(0) AND [reduce]<=(100)))
GO
/****** Object:  StoredProcedure [dbo].[createOrder]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[createOrder] @userID INT
AS
BEGIN
	DECLARE @tableOrder TABLE (id INT);
	DECLARE @orderID INT;
	-- insert orders
	INSERT INTO Orders (userID)
	OUTPUT inserted.orderID
	INTO @tableOrder
	VALUES (@userID)

	SELECT @orderID = id
	FROM @tableOrder
	-- insert orderitem
	INSERT INTO OrderItem (
		orderID
		,name
		,description
		,color
		,size
		,linkImage
		,quantity
		,price
		)
	SELECT orderID = @orderID
		,p.name
		,p.description
		,p.color
		,p.size
		,p.linkImage
		,c.quantity
		,p.price * (100-ISNULL(prom.totalReduce,0)) / 100 AS price
	FROM Products p
	INNER JOIN CartItem c ON p.productID = c.productID
	LEFT JOIN (
		SELECT sum(prom.reduce) AS totalReduce
			,pp.productID
		FROM ProductPromotion pp
		INNER JOIN Promotions prom ON pp.promotionID = prom.promotionID
		GROUP BY pp.productID
		) prom ON p.productID = prom.productID
	WHERE c.userID = @userID
	-- remove cartitem
	delete from CartItem where userID=@userID
END
GO
/****** Object:  StoredProcedure [dbo].[deleteCollection]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[deleteCollection] @collectionID INT
AS
BEGIN
	-- delete collection
	DELETE
	FROM Collections
	WHERE collectionID = @collectionID
END
GO
/****** Object:  StoredProcedure [dbo].[deleteProduct]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[deleteProduct] @productID INT
AS
BEGIN
	-- update collection: numProduct
	DELETE
	FROM Products
	WHERE productID = @productID
END
GO
/****** Object:  StoredProcedure [dbo].[deletePromotion]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[deletePromotion] @promotionID INT
AS
BEGIN
	-- promotion
	DELETE
	FROM Promotions
	WHERE promotionID = @promotionID
END
GO
/****** Object:  StoredProcedure [dbo].[getCartByUserID]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getCartByUserID] @userID INT
AS
BEGIN
	select c.quantity,p.productID ,p.name, p.description, p.price, p.color, p.size, p.linkImage from CartItem c 
	inner join Products p on c.productId=p.productID
	where userID=@userID
END
GO
/****** Object:  StoredProcedure [dbo].[getOrderItemByOrderID]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[getOrderItemByOrderID] @orderID int
as
begin
	select * from OrderItem where orderID=@orderID
end
GO
/****** Object:  StoredProcedure [dbo].[getOrdersByUserID]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[getOrdersByUserID] @userID int
as
begin
	select o.orderID, o.status,i.totalAmount,o.createAt from Orders o inner join 
	(select orderID, sum(quantity * price) as totalAmount from OrderItem group by orderID) i
	on o.orderID=i.orderId where userID=@userID
end
GO
/****** Object:  StoredProcedure [dbo].[updateCartItem]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[updateCartItem] @userID int, @productID int, @quantity int
as
	begin
	declare @totalProduct int
	declare @ownerProduct int
	if not exists (select productID from CartItem where userID=@userID and productID=@productID)
		begin
			-- insert new cartitem + update product
			select @totalProduct=quantity from  Products where productID=@productID
			
			if @totalProduct - @quantity >= 0
				update Products set quantity=@totalProduct - @quantity where productID=@productID
				insert into CartItem(userID, productID, quantity) values(@userID, @productID, @quantity)				
		end
	else
		begin
		-- update cartitem + product
		select @totalProduct=quantity from  Products where productID=@productID
		select @ownerProduct=quantity from CartItem where userID=@userID and productID=@productID
		if @totalProduct + @ownerProduct - @quantity >= 0
			update Products set quantity=@totalProduct + @ownerProduct - @quantity where productID=@productID
			if @quantity=0
				-- delete cartitem
				delete from CartItem where userID=@userID and productID=@productID
			else
				update CartItem set quantity=@quantity where userID=@userID and productID=@productID
		
		end
	end
GO
/****** Object:  StoredProcedure [dbo].[updateCollection]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

------------------
-- collections
CREATE PROCEDURE [dbo].[updateCollection] @collectionID INT,
	@name NVARCHAR(255),
	@productIDs VARCHAR(255)
AS
BEGIN
	-- delete productcollection
	DELETE
	FROM ProductCollection
	WHERE collectionID = @collectionID;

	-- insert product collection
	INSERT INTO ProductCollection (
		productID,
		collectionID
		)
	SELECT value,
		@collectionID
	FROM string_split(@productIDs, ',');

	-- update collections
	UPDATE Collections
	SET name = @name,
		updateAt = CURRENT_TIMESTAMP
	WHERE collectionID = @collectionID;
END
GO
/****** Object:  StoredProcedure [dbo].[updateProduct]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- products
CREATE PROCEDURE [dbo].[updateProduct] @productID INT,
	@name NVARCHAR(255),
	@description TEXT,
	@price INT,
	@quantity SMALLINT,
	@color NVARCHAR(255),
	@size VARCHAR(255),
	@linkImage NVARCHAR(255)
AS
BEGIN
	-- update product
	UPDATE Products
	SET name = @name,
		description = @description,
		price = @price,
		quantity = @quantity,
		color = @color,
		size = @size,
		linkImage = @linkImage,
		updateAt = CURRENT_TIMESTAMP
	WHERE productID = @productID
		-- update cartitem: price
		--DECLARE @sumReduce tinyint
		--select @sumReduce=sum(reduce) from Promotions where promotionID in (select promotionID from ProductPromotion where productID=@productID)
		--declare @newPrice int = FLOOR(@price * ((100 - @sumReduce) / 100))
		--update CartItem set price=@newPrice, quantity=@quantity where productID=@productID
END
GO
/****** Object:  StoredProcedure [dbo].[updatePromotion]    Script Date: 12/3/2024 10:29:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

------------------
-- promotions
CREATE PROCEDURE [dbo].[updatePromotion] 
	@promotionID INT,
	@name NVARCHAR(255),
	@reduce TINYINT,
	@startTime DATETIME,
	@endTime DATETIME,
	@productIDs VARCHAR(255)
AS
BEGIN
	DECLARE @listProducts TABLE (
		insertData INT,
		deleteData INT
		)

	INSERT INTO @listProducts (
		insertData,
		deleteData
		)
	SELECT prod.value AS insertData,
		prom.productID AS deleteData
	FROM string_split(@productIDs, ',') prod
	FULL OUTER JOIN (select productID from ProductPromotion where promotionID=@promotionID) prom
		ON prod.value = prom.productID where prod.value is null or prom.productID is null
	-- productpromotion
	INSERT INTO ProductPromotion (
		productID,
		promotionID
		)
	SELECT insertData,
		@promotionID
	FROM @listProducts
	WHERE insertData IS NOT NULL

	DELETE
	FROM ProductPromotion
	WHERE promotionID = @promotionID
		AND productID IN (
			SELECT deleteData
			FROM @listProducts
			WHERE deleteData IS NOT NULL
			)

	-- promotion
	UPDATE Promotions
	SET name = @name,
		reduce = @reduce,
		startTime = @startTime,
		endTime = @endTime,
		updateAt = CURRENT_TIMESTAMP
	WHERE promotionID = @promotionID
END
GO
USE [master]
GO
ALTER DATABASE [CLOTHES369] SET  READ_WRITE 
GO
