USE [master]
GO
/****** Object:  Database [CLOTHES369]    Script Date: 12/10/2024 3:31:00 PM ******/
CREATE DATABASE [CLOTHES369]
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
/****** Object:  UserDefinedTableType [dbo].[variationOptionList]    Script Date: 12/10/2024 3:31:00 PM ******/
CREATE TYPE [dbo].[variationOptionList] AS TABLE(
	[variationID] [int] NULL,
	[value] [nvarchar](255) NULL
)
GO
/****** Object:  Table [dbo].[carts]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[carts](
	[cartID] [int] IDENTITY(1,1) NOT NULL,
	[userID] [int] NULL,
	[productItemID] [int] NULL,
	[quantity] [int] NOT NULL,
	[createdAt] [datetime] NOT NULL,
	[updatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[cartID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[categories]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[categories](
	[categoryID] [int] IDENTITY(1,1) NOT NULL,
	[parentCategoryID] [int] NULL,
	[name] [nvarchar](255) NOT NULL,
	[createdAt] [datetime] NOT NULL,
	[updatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[categoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[orderItem]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[orderItem](
	[orderID] [int] NULL,
	[productItemID] [int] NULL,
	[quantity] [int] NOT NULL,
	[price] [int] NOT NULL,
	[createdAt] [datetime] NOT NULL,
	[updatedAt] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[orders]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[orders](
	[orderID] [int] IDENTITY(1,1) NOT NULL,
	[userID] [int] NULL,
	[shippingID] [int] NULL,
	[paymentID] [int] NULL,
	[fullName] [nvarchar](255) NOT NULL,
	[phone] [varchar](255) NOT NULL,
	[address] [nvarchar](255) NOT NULL,
	[note] [text] NULL,
	[status] [nvarchar](255) NOT NULL,
	[createdAt] [datetime] NOT NULL,
	[updatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[orderID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[payments]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[payments](
	[paymentID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[price] [int] NOT NULL,
	[createdAt] [datetime] NOT NULL,
	[updatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[paymentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[productItem]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[productItem](
	[productItemID] [int] IDENTITY(1,1) NOT NULL,
	[productID] [int] NULL,
	[sku] [varchar](255) NULL,
	[quantity] [int] NOT NULL,
	[price] [int] NOT NULL,
	[image] [nvarchar](255) NULL,
	[createdAt] [datetime] NOT NULL,
	[updatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[productItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[products]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[products](
	[productID] [int] IDENTITY(1,1) NOT NULL,
	[categoryID] [int] NULL,
	[promotionID] [int] NULL,
	[name] [nvarchar](255) NOT NULL,
	[description] [text] NULL,
	[image] [nvarchar](255) NULL,
	[createdAt] [datetime] NOT NULL,
	[updatedAt] [datetime] NULL,
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
/****** Object:  Table [dbo].[promotions]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[promotions](
	[promotionID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NULL,
	[discount] [tinyint] NULL,
	[startDate] [date] NOT NULL,
	[endDate] [date] NULL,
	[createdAt] [datetime] NOT NULL,
	[updatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[promotionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[userID] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](255) NULL,
	[email] [varchar](255) NOT NULL,
	[password] [nvarchar](255) NOT NULL,
	[role] [varchar](255) NULL,
	[createdAt] [datetime] NOT NULL,
	[updatedAt] [datetime] NULL,
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
/****** Object:  Table [dbo].[variationOption]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[variationOption](
	[variationOptionID] [int] IDENTITY(1,1) NOT NULL,
	[productItemID] [int] NULL,
	[variationID] [int] NULL,
	[value] [nvarchar](255) NOT NULL,
	[createdAt] [datetime] NOT NULL,
	[updatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[variationOptionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[variations]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[variations](
	[variationID] [int] IDENTITY(1,1) NOT NULL,
	[nameAtribute] [nvarchar](255) NOT NULL,
	[type] [varchar](255) NULL,
	[createdAt] [datetime] NOT NULL,
	[updatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[variationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[nameAtribute] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[carts] ADD  DEFAULT ((1)) FOR [quantity]
GO
ALTER TABLE [dbo].[carts] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[categories] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[orderItem] ADD  DEFAULT ((0)) FOR [quantity]
GO
ALTER TABLE [dbo].[orderItem] ADD  DEFAULT ((0)) FOR [price]
GO
ALTER TABLE [dbo].[orderItem] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[orders] ADD  DEFAULT ('processing') FOR [status]
GO
ALTER TABLE [dbo].[orders] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[payments] ADD  DEFAULT ((0)) FOR [price]
GO
ALTER TABLE [dbo].[payments] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[productItem] ADD  DEFAULT ((0)) FOR [quantity]
GO
ALTER TABLE [dbo].[productItem] ADD  DEFAULT ((0)) FOR [price]
GO
ALTER TABLE [dbo].[productItem] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[products] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[promotions] ADD  DEFAULT ('normal') FOR [name]
GO
ALTER TABLE [dbo].[promotions] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT ('client') FOR [role]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[variationOption] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[variations] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[carts]  WITH CHECK ADD FOREIGN KEY([productItemID])
REFERENCES [dbo].[productItem] ([productItemID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[carts]  WITH CHECK ADD FOREIGN KEY([userID])
REFERENCES [dbo].[users] ([userID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[orderItem]  WITH CHECK ADD FOREIGN KEY([orderID])
REFERENCES [dbo].[orders] ([orderID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[orderItem]  WITH CHECK ADD FOREIGN KEY([productItemID])
REFERENCES [dbo].[productItem] ([productItemID])
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[orders]  WITH CHECK ADD FOREIGN KEY([userID])
REFERENCES [dbo].[users] ([userID])
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[productItem]  WITH CHECK ADD FOREIGN KEY([productID])
REFERENCES [dbo].[products] ([productID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[variationOption]  WITH CHECK ADD FOREIGN KEY([productItemID])
REFERENCES [dbo].[productItem] ([productItemID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[variationOption]  WITH CHECK ADD FOREIGN KEY([variationID])
REFERENCES [dbo].[variations] ([variationID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[carts]  WITH CHECK ADD CHECK  (([quantity]>=(1)))
GO
ALTER TABLE [dbo].[orderItem]  WITH CHECK ADD CHECK  (([price]>=(0)))
GO
ALTER TABLE [dbo].[orderItem]  WITH CHECK ADD CHECK  (([quantity]>=(0)))
GO
ALTER TABLE [dbo].[payments]  WITH CHECK ADD CHECK  (([price]>=(0)))
GO
ALTER TABLE [dbo].[productItem]  WITH CHECK ADD CHECK  (([price]>=(0)))
GO
ALTER TABLE [dbo].[productItem]  WITH CHECK ADD CHECK  (([quantity]>=(0)))
GO
ALTER TABLE [dbo].[promotions]  WITH CHECK ADD CHECK  (([discount]>=(0) AND [discount]<=(100)))
GO
/****** Object:  StoredProcedure [dbo].[createOrder]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[createOrder]
	@userID int, 
	@fullname nvarchar(255), 
	@address nvarchar(255),
	@phone varchar(255), 
	@note text=null, 
	@paymentID int=null
as
begin
	insert into orders(userID,fullName,address,phone,note) values(@userID,@fullname,@address,@phone,@note)
	insert into orderItem(productItemID,price,quantity)
	select c.productItemID,(pt.price * (100-isnull(pr.discount, 0)) / 100) as price, pt.quantity  from carts c
	inner join productItem pt on c.productItemID=pt.productItemID
	inner join products p on pt.productID=p.productID
	left join promotions pr on p.promotionID=pr.promotionID and pr.startDate <= GETDATE() AND GETDATE() <= pr.endDate
	where userID=@userID
	delete from carts where userID=@userID
end
GO
/****** Object:  StoredProcedure [dbo].[createUser]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[createUser] @username nvarchar(255), @email varchar(255), @password nvarchar(255), @role varchar(255)
as
begin
	INSERT INTO Users (username, email, password, role) 
	OUTPUT inserted.userID, inserted.role 
	VALUES (@username, @email, @password, @role)
end
GO
/****** Object:  StoredProcedure [dbo].[deleteCategory]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[deleteCategory]
	@categoryID int
as
begin
	delete from categories where categoryID=@categoryID
end
GO
/****** Object:  StoredProcedure [dbo].[deletePayment]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[deletePayment]
	@paymentID int
as
begin
	delete from payments where paymentID=@paymentID
end
GO
/****** Object:  StoredProcedure [dbo].[deleteProduct]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[deleteProduct] @productID int
as
begin
	delete from products where productID=@productID
end
GO
/****** Object:  StoredProcedure [dbo].[deleteProductItem]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[deleteProductItem] @productItemID int
as
begin
	delete from productItem where productItemID=@productItemID
end
GO
/****** Object:  StoredProcedure [dbo].[deletePromotion]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[deletePromotion] @promotionID int
as
begin
	IF EXISTS (SELECT 1 FROM Promotions WHERE promotionID = @promotionID)
		begin
			delete from promotions where promotionID=@promotionID
		end
		
end
GO
/****** Object:  StoredProcedure [dbo].[deleteUser]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[deleteUser] @userID int
as
begin
	delete from users where userID=@userID
end
GO
/****** Object:  StoredProcedure [dbo].[deleteVariation]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create PROCEDURE [dbo].[deleteVariation] @variationID int
AS
BEGIN
    delete from variations where variationID=@variationID
END
GO
/****** Object:  StoredProcedure [dbo].[getCartByUserID]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[getCartByUserID] @userID int
as
begin
	select c.cartID,c.userID, c.productItemID,c.quantity,pt.productID, pt.sku, pt.image, pt.price, p.name, isnull(pr.discount,0) as discount, pr.startDate,pr.endDate
	from carts c 
	inner join productItem pt on c.productItemID=pt.productItemID 
	inner join products p on pt.productID=p.productID
	left join promotions pr on p.promotionID=pr.promotionID
	where userID=@userID
end
GO
/****** Object:  StoredProcedure [dbo].[getCartsByOffsetBased]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
------------------------
-- carts
create procedure [dbo].[getCartsByOffsetBased] 
	@offset int=0,
	@limit int=10,
	@searchText nvarchar(255)=null,
	@sortBy varchar(255)='userID',
	@sortOrder varchar(255)='asc'
as
begin
	IF @sortBy NOT IN (
			'userID',
			'quantity',
			'price',
			'discount'
			)
		SET @sortBy = 'userID'

	IF @sortOrder NOT IN (
			'asc',
			'desc'
			)
			SET @sortOrder = 'asc'
	;WITH cartData as(			
		select c.cartID,c.userID, c.productItemID,c.quantity,pt.productID, pt.sku, pt.image, pt.price, p.name, isnull(pr.discount,0) as discount, pr.startDate,pr.endDate
		from carts c 
		inner join productItem pt on c.productItemID=pt.productItemID 
		inner join products p on pt.productID=p.productID
		left join promotions pr on p.promotionID=pr.promotionID
		where (@searchText is null or p.name LIKE '%' + @searchText + '%'))

	select * from cartData c order by 
		case when @sortBy='userID' and @sortOrder='asc' then userID end asc,
		case when @sortBy='quantity' and @sortOrder='asc' then quantity end asc,
		case when @sortBy='price' and @sortOrder='asc' then price end asc,
		case when @sortBy='discount' and @sortOrder='asc' then discount end asc,

		case when @sortBy='userID' and @sortOrder='desc' then userID end desc,
		case when @sortBy='quantity' and @sortOrder='desc' then quantity end desc,
		case when @sortBy='price' and @sortOrder='desc' then price end desc,
		case when @sortBy='discount' and @sortOrder='desc' then discount end desc
	OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
end
GO
/****** Object:  StoredProcedure [dbo].[getCategories]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
------------------------
-- categories
create procedure [dbo].[getCategories]
as
begin
	select categoryID,parentCategoryID,name from categories
end
GO
/****** Object:  StoredProcedure [dbo].[getOrdersByOffsetBased]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[getOrdersByOffsetBased]
	@offset int=0,
	@limit int=10,
	@searchText nvarchar(255)=null,
	@sortBy varchar(255)='userID',
	@sortOrder varchar(255)='asc',
	@filterStatus nvarchar(255)=null
as
begin
	if @sortBy not in ('userID', 'totalAmount','orderID', 'createdAt')
		set @sortBy='userID'
	if @sortOrder not in ('asc','desc')
		set @sortOrder='asc'
	;with orderData as(
		select o.userID,o.orderID, o.status,o.address,o.phone,o.note, i.totalAmount,o.createdAt from Orders o left join 
		(select orderID, sum(quantity * price) as totalAmount from OrderItem group by orderID) i on o.orderID=i.orderId
		where @filterStatus is null or o.status=@filterStatus
	)
	select * from orderData order by
		case when @sortBy='userID' and @sortOrder='asc' then userID end asc,
		case when @sortBy='orderID' and @sortOrder='asc' then orderID end asc,
		case when @sortBy='totalAmount' and @sortOrder='asc' then totalAmount end asc,
		case when @sortBy='createdAt' and @sortOrder='asc' then createdAt end asc,
		
		case when @sortBy='userID' and @sortOrder='desc' then userID end desc,
		case when @sortBy='orderID' and @sortOrder='desc' then orderID end desc,
		case when @sortBy='totalAmount' and @sortOrder='desc' then totalAmount end desc,
		case when @sortBy='createdAt' and @sortOrder='desc' then createdAt end desc
	OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
end
GO
/****** Object:  StoredProcedure [dbo].[getOrdersByUserID]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
------------------------
--orders
create procedure [dbo].[getOrdersByUserID] @userID int
as
begin
	select o.userID,o.orderID, o.status, i.totalAmount,o.fullName,o.address,o.phone,o.note,o.createdAt from Orders o left join 
	(select orderID, sum(quantity * price) as totalAmount from OrderItem group by orderID) i
	on o.orderID=i.orderId where userID=@userID
end
GO
/****** Object:  StoredProcedure [dbo].[getPayments]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
------------------------
-- payments (next version)
create procedure [dbo].[getPayments]
as
begin
	select paymentID,name,price from payments
end
GO
/****** Object:  StoredProcedure [dbo].[getProductByProductID]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[getProductByProductID] @productID int
as
begin
	SELECT p.productID,
		c.categoryID,
		pr.promotionID,
		p.name,
		p.description,
		p.image,
		p.createdAt,
		c.name AS categoryName,
		pr.name AS promotionName,
		pr.discount,
		pr.startDate,
		pr.endDate
	FROM products p
	LEFT JOIN categories c
		ON p.categoryID = c.categoryID
	LEFT JOIN promotions pr
		ON p.promotionID = pr.promotionID
	where p.productID=@productID
	
	select pt.productItemID,pt.sku,pt.quantity,pt.price,pt.image,pt.createdAt, vo.variationOptionID,v.variationID,v.nameAtribute, vo.value 
	from productItem pt
	left join variationOption vo
	on pt.productItemID=vo.productItemID
	inner join variations v
	on vo.variationID=v.variationID
	where pt.productID=@productID
end
GO
/****** Object:  StoredProcedure [dbo].[getProductExtraInfo]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[getProductExtraInfo]
as
begin
	select categoryID,name from categories
	select promotionID,name, discount, startDate, endDate from promotions
	select nameAtribute, variationID from variations
end
GO
/****** Object:  StoredProcedure [dbo].[getProductItemByProductItemID]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[getProductItemByProductItemID] @productItemID int
as
begin
	select productItemID,productID,sku,quantity,price,image from productItem where productItemID=@productItemID
end
GO
/****** Object:  StoredProcedure [dbo].[getProductsByOffsetBased]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
------------------------
-- products
create PROCEDURE [dbo].[getProductsByOffsetBased] @offset INT=0,
	@limit INT=12,
	@sortBy NVARCHAR(255) = 'productID',
	@sortOrder NVARCHAR(255) = 'asc',
	@searchText NVARCHAR(255) = NULL,
	@filterPromotion NVARCHAR(255) = NULL,
	@filterCategory NVARCHAR(255) = NULL
AS
BEGIN
	-- Validate sort parameters
	IF @sortBy NOT IN (
			'productID',
			'name',
			'discount',
			'createdAt'
			)
		SET @sortBy = 'productID'

	IF @sortOrder NOT IN (
			'asc',
			'desc'
			)
		SET @sortOrder = 'asc'
		;WITH productData AS (
				SELECT p.productID,
					p.name,
					p.description,
					p.image,
					p.createdAt,
					c.name AS categoryName,
					pr.name AS promotionName,
					pr.discount,
					pr.startDate,
					pr.endDate,
					t.totalQuantityInCart,
					t.totalQuantityInStock
				FROM products p
				LEFT JOIN categories c
					ON p.categoryID = c.categoryID
				LEFT JOIN promotions pr
					ON p.promotionID = pr.promotionID
				OUTER APPLY (
					SELECT 
						SUM(c.quantity) as totalQuantityInCart,						
						SUM(pt.quantity) as totalQuantityInStock
					FROM carts c 
					INNER JOIN productItem pt ON c.productItemID = pt.productItemID
					WHERE pt.productID = p.productID
					GROUP BY pt.productID

				) t
				WHERE (
						@searchText IS NULL
						OR p.name LIKE '%' + @searchText + '%'
						OR p.description LIKE '%' + @searchText + '%'
						)
					and (@filterCategory is null or p.categoryID=@filterCategory)
					and (@filterPromotion is null or p.promotionID=@filterPromotion)
				)
				
	SELECT *
	FROM productData
	ORDER BY 
		CASE WHEN @sortOrder = 'asc'
				AND @sortBy = 'productID' THEN productID END ASC,
		CASE WHEN @sortOrder = 'asc'
				AND @sortBy = 'name' THEN name END ASC,
		CASE WHEN @sortOrder = 'asc'
				AND @sortBy = 'discount' THEN discount END ASC,
		CASE WHEN @sortOrder = 'asc'
				AND @sortBy = 'createdAt' THEN cast(createdAt AS DATETIME) END ASC,

		CASE WHEN @sortOrder = 'desc'
				AND @sortBy = 'productID' THEN productID END DESC,
		CASE WHEN @sortOrder = 'desc'
				AND @sortBy = 'name' THEN name END DESC,
		CASE WHEN @sortOrder = 'desc'
				AND @sortBy = 'discount' THEN discount END DESC,
		CASE WHEN @sortOrder = 'desc'
				AND @sortBy = 'createdAt' THEN cast(createdAt AS DATETIME) END DESC 
	OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
END
GO
/****** Object:  StoredProcedure [dbo].[getPromotions]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
------------------------
-- promotions
create procedure [dbo].[getPromotions]
as
begin
	select promotionID,name, discount,startDate,endDate from Promotions
end
GO
/****** Object:  StoredProcedure [dbo].[getUserByEmail]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[getUserByEmail] @email nvarchar(255)
as
begin
	select userID, username, email, password, role from users where email=@email
end
GO
/****** Object:  StoredProcedure [dbo].[getUserByUserID]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[getUserByUserID] @userID int
as
begin
	select userID, username, email, password, role from users where userID=@userID
end
GO
/****** Object:  StoredProcedure [dbo].[getUsersByOffsetBased]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
------------------------
-- users
create PROCEDURE [dbo].[getUsersByOffsetBased]     
    @offset INT = 0,
    @limit INT = 10,
    @sortBy VARCHAR(255)='userID',
    @sortOrder VARCHAR(255)='asc',
    @searchText NVARCHAR(255) = NULL,
    @filterRole VARCHAR(255) = NULL
AS
BEGIN
    -- Validate sort parameters
    IF @sortBy NOT IN ('userID', 'username', 'email', 'createdAt')
        SET @sortBy = 'userID'
    
    IF @sortOrder NOT IN ('asc', 'desc')
        SET @sortOrder = 'asc'
    ;WITH UserData AS (
        SELECT 
            u.userID,
			u.username,
			u.email,
			u.role,
			u.createdAt,
            (SELECT COUNT(*) FROM carts c WHERE c.userID = u.userID) as numCartItems,
            (SELECT COUNT(*) FROM orders o WHERE o.userID = u.userID) as numOrders
        FROM users u
        WHERE (@searchText IS NULL OR u.username LIKE '%' + @searchText + '%' OR u.email LIKE '%' + @searchText + '%')
            AND u.role = isnull(@filterRole, role)
    )
    SELECT userID, username, email, role, createdAt, numCartItems, numOrders
	FROM UserData
	ORDER BY
		CASE WHEN @sortOrder='asc' and @sortBy='userID' THEN userID end asc,
		CASE WHEN @sortOrder='asc' and @sortBy='username' THEN username end asc,
		CASE WHEN @sortOrder='asc' and @sortBy='email' THEN username end asc,
		CASE WHEN @sortOrder='asc' and @sortBy='created' THEN cast(createdAt as datetime) end asc,

		CASE WHEN @sortOrder='desc' and @sortBy='userID' THEN userID end desc,
		CASE WHEN @sortOrder='desc' and @sortBy='username' THEN username end desc,
		CASE WHEN @sortOrder='desc' and @sortBy='email' THEN username end desc,
		CASE WHEN @sortOrder='desc' and @sortBy='created' THEN cast(createdAt as datetime) end desc
	OFFSET @offset ROWS
	FETCH NEXT @limit ROWS ONLY;
END
GO
/****** Object:  StoredProcedure [dbo].[getVariations]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
------------------------
-- variations
create procedure [dbo].[getVariations]
as
begin
	select variationID,nameAtribute from variations 
end
GO
/****** Object:  StoredProcedure [dbo].[getVariationsByNameAtribute]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[getVariationsByNameAtribute] @nameAtribute nvarchar(255)
as
begin
	select variationID, nameAtribute from variations where nameAtribute=@nameAtribute
end
GO
/****** Object:  StoredProcedure [dbo].[updateOrder]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[updateOrder]
@status nvarchar(255),
@orderID int
as
begin
	update orders set status=@status where orderID=@orderID
end
GO
/****** Object:  StoredProcedure [dbo].[updateUser]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[updateUser] @userID int, @username nvarchar(255)=null, @email varchar(255)=null, @password nvarchar(255)=null, @role varchar(255)=null
as
begin
	update users set 
	username=ISNULL(@username,username), 
	email=isnull(@email,email),
	password=ISNULL(@password,password),
	role=ISNULL(@role, role)
	where userID=@userID
end
GO
/****** Object:  StoredProcedure [dbo].[upsertCart]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[upsertCart] 
	@userID int, 
	@productItemID int,
	@quantity int
as
begin
	declare @totalProduct int
	declare @ownerProduct int
	if not exists (select productItemID from carts where userID=@userID and productItemID=@productItemID)
	begin
		-- insert new cart + update product
		select @totalProduct=quantity from  productItem where productItemID=@productItemID
			
		if @totalProduct - @quantity >= 0
			update productItem set quantity=@totalProduct - @quantity where productItemID=@productItemID
			insert into carts(userID, productItemID, quantity) values(@userID, @productItemID, @quantity)
	end
	else
	begin
		-- update cart + product
		select @totalProduct=quantity from  productItem where productItemID=@productItemID
		select @ownerProduct=quantity from carts where userID=@userID and productItemID=@productItemID
		if @totalProduct + @ownerProduct - @quantity >= 0
		begin
			update productItem set quantity=@totalProduct + @ownerProduct - @quantity where productItemID=@productItemID
			if @quantity=0
				-- delete cartitem
				delete from carts where userID=@userID and productItemID=@productItemID
			else
				update carts set quantity=@quantity where userID=@userID and productItemID=@productItemID
		end

		
	end
end
GO
/****** Object:  StoredProcedure [dbo].[upsertCategory]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[upsertCategory] 
	@categoryID int, 
	@parentCategoryID int,
    @name NVARCHAR(255)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM categories WHERE categoryID = @categoryID)
    BEGIN
        UPDATE categories
        SET 
            name = isnull(@name,name),
            parentCategoryID= ISNULL(@parentCategoryID, parentCategoryID)
        WHERE categoryID=@categoryID
    END
    ELSE
    BEGIN
        -- Insert new promotion
        INSERT INTO categories (
			parentCategoryID,
            name         
        )
        VALUES (
			@parentCategoryID,
            @name            
        )
    END
END
GO
/****** Object:  StoredProcedure [dbo].[upsertPayment]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[upsertPayment]
	@paymentID int=null,
	@name nvarchar(255)=null,
	@price int=null
as
begin
	if @paymentID is null
	begin
		insert into payments(name,price) values(@name,@price)
	end
	else
	begin
		update payments set name=isnull(@name,name),price=isnull(@price,price) where paymentID=@paymentID
	end
end
GO
/****** Object:  StoredProcedure [dbo].[upsertProduct]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[upsertProduct]
	@productID int=null,
	@promotionID INT=null,
    @categoryID INT=null,
    @name NVARCHAR(255)=null,
    @description TEXT=null,
    @image NVARCHAR(255)=null
as
begin
	if @productID is not null
	begin
	update products 
	set promotionID=@promotionID,
		categoryID=@categoryID,name=isnull(@name,name),
		description=ISNULL(@description,description),image=ISNULL(@image, image)
		where productID=@productID
	end
	else
	begin
	    INSERT INTO Products (
        name,
        description,
        image,
        promotionID,
        categoryID
    )
    VALUES (
        @name,
        @description,
        @image,
        @promotionID,
        @categoryID
    );
	end
end
GO
/****** Object:  StoredProcedure [dbo].[upsertProductItem]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[upsertProductItem]
    @productID int=null,
    @productItemID int=null,
    @sku VARCHAR(255)=null,
    @price INT=null,
    @quantity INT=null,
    @image NVARCHAR(255)=null,
    @variationOptionTable variationOptionList readonly
as
begin
    if @productItemID is not null
    begin
        -- update existing product item
        update productItem 
        set sku = @sku, 
            price = @price,
            quantity = @quantity,
            image = @image 
        where productItemID = @productItemID

        -- update variation options
        delete from variationOption where productItemID = @productItemID
        insert into variationOption(productItemID, variationID, value) 
        select @productItemID, vo.variationID, vo.value 
        from @variationOptionTable vo
    end
    else
    begin
        -- insert new product item
        declare @tempProductItemID int
        declare @tableItem table (id int)

        insert into productItem(productID, sku, quantity, price, image) 
        output inserted.productItemID into @tableItem
        values(@productID, @sku, @quantity, @price, @image)

        select @tempProductItemID = id from @tableItem

        -- insert variation options for new product item
        insert into variationOption(productItemID, variationID, value) 
        select @tempProductItemID, vo.variationID, vo.value 
        from @variationOptionTable vo
    end        
end
GO
/****** Object:  StoredProcedure [dbo].[upsertPromotion]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create PROCEDURE [dbo].[upsertPromotion]
    @promotionID INT,
    @name NVARCHAR(255),
    @discount TINYINT,
    @startDate DATETIME,
    @endDate DATETIME
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Promotions WHERE promotionID = @promotionID)
    BEGIN
        -- Update existing promotion
        UPDATE Promotions
        SET 
            name = isnull(@name,name),
            discount = isnull(@discount,discount),
            startDate = isnull(@startDate,startDate),
            endDate = isnull(@endDate,endDate),
            updatedAt = CURRENT_TIMESTAMP
        WHERE promotionID = @promotionID
    END
    ELSE
    BEGIN
        -- Insert new promotion
        INSERT INTO Promotions (
            name,
            discount,
            startDate,
            endDate
        )
        VALUES (
            @name,
            @discount,
            @startDate,
            @endDate
        )
    END
END
GO
/****** Object:  StoredProcedure [dbo].[upsertVariation]    Script Date: 12/10/2024 3:31:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create PROCEDURE [dbo].[upsertVariation]
    @variationID INT = NULL,
    @nameAtribute NVARCHAR(255) = NULL
AS
BEGIN
    IF @variationID IS NULL
    BEGIN
        -- New variation - INSERT
        INSERT INTO variations(nameAtribute) 
        VALUES(@nameAtribute)
    END
    ELSE
    BEGIN 
        -- Existing variation - UPDATE
        UPDATE variations 
        SET nameAtribute = isnull(@nameAtribute,nameAtribute)
        WHERE variationID = @variationID
    END
END
GO
USE [master]
GO
ALTER DATABASE [CLOTHES369] SET  READ_WRITE 
GO
