--DROP DATABASE CLOTHES369;
--CREATE DATABASE CLOTHES369;

CREATE TABLE users (
	userID INT IDENTITY(1, 1) PRIMARY KEY,
	username NVARCHAR(255),
	email VARCHAR(255) UNIQUE NOT NULL,
	password NVARCHAR(255) NOT NULL,
	role VARCHAR(255) DEFAULT 'client',
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt DATETIME,
	)
create table categories(
	categoryID int identity(1,1) primary key,
	parentCategoryID int, -- null, 1
	name nvarchar(255) not null unique,	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt DATETIME,
)
CREATE TABLE promotions(
	promotionID INT identity(1, 1) PRIMARY KEY,
	name NVARCHAR(255) default 'normal',
	discount TINYINT CHECK (
		discount >= 0
		AND discount <= 100
		),
	startDate date NOT NULL,
	endDate date,
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt DATETIME,
)
create table variations(
	variationID int identity(1,1) primary key,
	nameAtribute nvarchar(255) not null unique, -- color, size
	type varchar(255),
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt DATETIME,
)
CREATE TABLE products (
	productID INT identity(1, 1) PRIMARY KEY,
	categoryID int,
	promotionID int,
	name NVARCHAR(255) NOT NULL UNIQUE,
	description TEXT,
	image NVARCHAR(255),
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt DATETIME,
	)
create table productItem(
	productItemID INT identity(1, 1) PRIMARY KEY,
	productID int foreign key references products(productID) on delete CASCADE,
	sku varchar(255),
	quantity int not null default 0 check (quantity >= 0),
	price int not null default 0 check (price >= 0),
	image nvarchar(255),
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt DATETIME,
)
create table variationOption(
	variationOptionID int identity(1,1) primary key,
	productItemID int foreign key references productItem(productItemID) on delete cascade,
	variationID int foreign key references variations(variationID) on delete cascade,
	value nvarchar(255) not null, -- x,l,xl,xxl, white
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt DATETIME,
)
create table carts(
	cartID int identity(1,1) primary key,
	userID int foreign key references users(userID) on delete cascade,
	productItemID int foreign key references productItem(productItemID) on delete cascade,
	quantity int not null default 1 check (quantity >= 1),
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt DATETIME,
)
--create table shippings(
--	shippingID int identity(1,1) primary key,
--	userID INT FOREIGN KEY REFERENCES Users(userID) ON DELETE CASCADE,
--	fullName nvarchar(255) not null, 
--	phone varchar(255) not null,
--	address nvarchar(255) not null,
--	note text,
--	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
--	updatedAt DATETIME,
--)
create table payments(
	paymentID int identity(1,1) primary key,
	name nvarchar(255) not null unique,
	price int not null default 0 check(price >= 0),	
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt DATETIME,
)
CREATE TABLE orders (
	orderID INT identity(1, 1) PRIMARY KEY,
	userID INT FOREIGN KEY REFERENCES Users(userID) ON DELETE set null,
	shippingID INT,
	paymentID int,
	fullName nvarchar(255) not null,
	phone varchar(255) not null,
	address nvarchar(255) not null,
	note text,
	status NVARCHAR(255) NOT NULL DEFAULT('processing'), --"processing", "completed", "cancelled",

	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt DATETIME,
	)
CREATE TABLE orderItem (
	orderID INT FOREIGN KEY REFERENCES Orders(orderID) ON DELETE CASCADE,
	productItemID int foreign key references productItem(productItemID) on delete set null,
	quantity int not null default 0 check(quantity >= 0),
	price int not null default 0 check(price>=0),

	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt DATETIME,
	)