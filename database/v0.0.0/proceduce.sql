------------------------
-- users
create PROCEDURE getUsersByOffsetBased     
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
go	
create procedure getUserByEmail @email nvarchar(255)
as
begin
	select userID, username, email, password, role from users where email=@email
end
go
create procedure getUserByUserID @userID int
as
begin
	select userID, username, email, password, role from users where userID=@userID
end
go
create procedure createUser @username nvarchar(255), @email varchar(255), @password nvarchar(255), @role varchar(255)
as
begin
	INSERT INTO Users (username, email, password, role) 
	OUTPUT inserted.userID, inserted.role 
	VALUES (@username, @email, @password, @role)
end
go
create procedure updateUser @userID int, @username nvarchar(255)=null, @email varchar(255)=null, @password nvarchar(255)=null, @role varchar(255)=null
as
begin
	update users set 
	username=ISNULL(@username,username), 
	email=isnull(@email,email),
	password=ISNULL(@password,password),
	role=ISNULL(@role, role)
	where userID=@userID
end
go
create procedure deleteUser @userID int
as
begin
	delete from users where userID=@userID
end
go
------------------------
-- products
create PROCEDURE getProductsByOffsetBased @offset INT=0,
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
create procedure getProductExtraInfo
as
begin
	select categoryID,name from categories
	select promotionID,name, discount, startDate, endDate from promotions
	select nameAtribute, variationID from variations
end
go
create procedure getProductByProductID @productID int
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
go
create procedure getProductItemByProductItemID @productItemID int
as
begin
	select productItemID,productID,sku,quantity,price,image from productItem where productItemID=@productItemID
end
go
create procedure upsertProduct
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
go
create type variationOptionList as table
(
	variationID int,
	value nvarchar(255)
)
go
create procedure upsertProductItem
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
go
create procedure deleteProduct @productID int
as
begin
	delete from products where productID=@productID
end
go
create procedure deleteProductItem @productItemID int
as
begin
	delete from productItem where productItemID=@productItemID
end
go
------------------------
-- variations
create procedure getVariations
as
begin
	select variationID,nameAtribute from variations 
end
go
create procedure getVariationsByNameAtribute @nameAtribute nvarchar(255)
as
begin
	select variationID, nameAtribute from variations where nameAtribute=@nameAtribute
end
go
create PROCEDURE upsertVariation
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
create PROCEDURE deleteVariation @variationID int
AS
BEGIN
    delete from variations where variationID=@variationID
END
go
------------------------
-- promotions
create procedure getPromotions
as
begin
	select promotionID,name, discount,startDate,endDate from Promotions
end
go
create PROCEDURE upsertPromotion
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
go
create procedure deletePromotion @promotionID int
as
begin
	IF EXISTS (SELECT 1 FROM Promotions WHERE promotionID = @promotionID)
		begin
			delete from promotions where promotionID=@promotionID
		end
		
end
go
------------------------
-- categories
create procedure getCategories
as
begin
	select categoryID,parentCategoryID,name from categories
end
go
create procedure upsertCategory 
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
go
create procedure deleteCategory
	@categoryID int
as
begin
	delete from categories where categoryID=@categoryID
end
go
------------------------
-- carts
create procedure getCartsByOffsetBased 
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
go
create procedure getCartByUserID @userID int
as
begin
	select c.cartID,c.userID, c.productItemID,c.quantity,pt.productID, pt.sku, pt.image, pt.price, p.name, isnull(pr.discount,0) as discount, pr.startDate,pr.endDate
	from carts c 
	inner join productItem pt on c.productItemID=pt.productItemID 
	inner join products p on pt.productID=p.productID
	left join promotions pr on p.promotionID=pr.promotionID
	where userID=@userID
end
go
create procedure upsertCart 
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
go
------------------------
-- payments (next version)
create procedure getPayments
as
begin
	select paymentID,name,price from payments
end
go
create procedure upsertPayment
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
go
create procedure deletePayment
	@paymentID int
as
begin
	delete from payments where paymentID=@paymentID
end
go
------------------------
--orders
create procedure getOrdersByUserID @userID int
as
begin
	select o.userID,o.orderID, o.status, i.totalAmount,o.fullName,o.address,o.phone,o.note,o.createdAt from Orders o left join 
	(select orderID, sum(quantity * price) as totalAmount from OrderItem group by orderID) i
	on o.orderID=i.orderId where userID=@userID
end
GO
create procedure getOrdersByOffsetBased
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
go
create procedure createOrder
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
go
create procedure updateOrder
@status nvarchar(255),
@orderID int
as
begin
	update orders set status=@status where orderID=@orderID
end
go