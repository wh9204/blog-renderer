```Haskell
-------------- Some Userful GHCi Instructions  ------------------------

:t/type expression
	 => find the type of the expression.
:i/info expression
	 => Usually more powerful than the previous one,
	    can even check the priority or associativity of operator,

:module +/- module_name
	=> import/remove specific module

:l/load file

:r/load file

:q/quit 

--------------- Some Commonly Used Type ------------------------------

Type Starts with Capital.

> -- data Bool = True | False

> -- type String = [Char]

> str_syntax1 = "abcd" == ['a', 'b', 'c', 'd']
> str_syntax2 = "abcd" == 'a':'b':'c':'d':""


Char : Unicode include 'a', 'b'...

Int : fixed-precision integer

Integer : arbitrary-precision integer

Float/Double : better to use Double for effeciency consideration



List and tuple :

1. List is fact a collection of **same type **, and the size is unlimited.
2. The type of list only depend on what it stores.
3. All the lists are in fact constcuted by the operator `:`,
   `[1,2,3]` are just syntax sugar of `'1':'2':'3':[]`.

Here are some more syntax :

> list_syntax1 = [1,2,3] 
> list_syntax2 = [1..5] -- 1,2,3,4,5
> list_syntax3 = [1, 3..7] -- 1, 3, 5, 7
> list_syntax4 = [1..] -- 1, 2, 3...
> list_syntax5 = [10, 7..1] -- [10, 7, 4, 1]

1. Tuple can store different types.
2. But its type depends on both the number,
    position and type of the elements it stores.

> tuple_example1 = (3, "hello")  
> tuple_example2 = ([1,2,3], 2, 'a')

List comprehension

The basic syntax :
	[the way it should generates | generator (generator/filter)*]

1. generator generator element one by one.
2. each element pass filter from left to right if exists.
3. once any element failed, then just stop and try next.
4. Only element which go to the end can be generated.

> -- [(1,2), (1,3), (2,2), (2,3), (3,2), (3,3)] no filter
> list_comprehension1 = [(x, y) | x <- [1..3], y <- [2..3]] 
> -- [(2,2), (2,3)] the function `even` is the filter
> list_comprehension2 = [(x, y) | x <- [1..3], even x, y <- [2..3]] 


-------------------- Function ---------------------------------


1. Function is absolutely the first-class citizen in haskell world.
2. The priority of functions is highter than all the operators.
3. A completely definition should be `type declaration + function definition`.
4. In mostly case we can ignore the former since the compiler can do type inference.
5. But you'd better give the complete definition because of the readability.


> function_syntax1 :: Int -> Int -> Int  
> function_syntax1 x y = x + y  

> --function_syntax2 :: Int -> Int -> Int  
> function_syntax2 x y = x + y  

Haskell has several ways to implement condition choice :

> -- Basically every `if condition then ... else ...`, can not omitted else.
> condition_syntax1 :: Int -> Int
> condition_syntax1 n = if n >= 0 then 1 else -1

> -- nested if 
> condition_syntax2 :: Int -> Int
> condition_syntax2 n = if n >= 0 
>			then if n > 0 
>			     then 1
>                            else 0
>                       else -1

> -- guard 
> condition_syntax3 :: Int -> Int
> condition_syntax3 n | n < 0     = -1
>                     | n == 0    = 0
>		      | otherwise = 1 
>                    -- otherwise == True

> -- case of
> condition_syntax4 :: Int -> Int
> condition_syntax4 n = case n >= 0 of
>			True	-> case n > 0 of
>				True	-> 1
>				False   -> 0
>                       False	-> -1

pattern matching :
	1. The compiler try to match each pattern in sequence. 
	2. If success then just use this pattern, otherwise continue match.
	3. If every input can be matched, then this is the complete function.
           Otherwise we get a partial funtion.
	   
> -- This is the complete function, `_` can match anything.
> pattern_match_syntax1 :: Bool -> Bool -> Bool
> pattern_match_syntax1 True True = True 
> pattern_match_syntax1 _ _ = False

`let expression` and `where clause`:
	1. They are all used to define local variable/function which can
	   only be used inside the function.
        2. If the variables you defined in let and where has conclict with
           the upper range variables, then it just cover on. 
	3. In fact is's not that concise to use variable here since all of
	   those in haskell are immutable.
	4. There are more informations about let and where in be mentioned later.

> let_syntax1 :: [a] -> a
> let_syntax1 list = let getHead (x:xs) = x
> 	             in getHead list


> where_synatx1 :: [a] -> a
> where_synatx1 list = getHead list
>	where getHead (x:xs) = x

Infix style: functions with two parameters can be written in an infixed style.

eg:

> infix_syntax1 = mod 4 2 == 4 `mod` 2

An oprator with two parameters is infix style already, so need parentheses to
make it used in a function sytle. 

> infix_syntax2 = 4 + 2 == (+) 4 2


Curried function:
	You will find every function in haskell are declared in the following way:

		functionName :: paramTypeName -> paramTypeName -> paramTypeName

	Every function in haskell can be regarded as having only one parameter.

		(+) :: Num a => a -> a -> a

	In fact are the same as :

		(+) :: Num a => a -> (a -> a)

	Which means (+) is in fact a function accept an instance of Num class and return another function which also aceept an instance of Num class and return an instance of Num class.

	And the first wring style is a kind of simplification. Then we regard every function in haskell as a `accept one parameter then return` function, which is also called curried function.

Lambda expression:

> lambda_syntax1 = (\n -> n + 3)
> lambda_syntax2 n = n + 3

> lambda_syntax3 = (\m n -> m - n) 
> lambda_syntax4 m n = m - n


Polymorphic
(Ref :http://stackoverflow.com/questions/12430660/creating-polymorphic-functions-in-haskell)

There are two flavors of polymorphism in Haskell:

	1. The first is the most general -- a function is **parametrically polymorphic** if it behaves uniformly for all types, in at least one of its type parameters.
	2. This kind of polymorphism is indicated by a lower case type variable.
eg:
	length :: [a] -> Int

	1. Now, if you have custom behavior that you want to have for a certain set of types, then you have **bounded polymorphism** (also known as "ad hoc").
	2. In Haskell we use type classes for this.

eg:
	(+) :: Num a => a -> (a -> a)

The following are some in-build class types:

	Eq : need to implement (==) (/=)

	Ord : need to implement (>=) (<=) (>) (<)
				(min :: a -> a -> a) (max :: a -> a -> a)
				And must be instance of Eq class

	Num : need to implement (+) (-) (*) (negate) (abs) (signum)

	Integral : need to implement (div) (mod) 
			   	     And must be instance of Num class

	Fractional : need to implement (/) (recip/倒数)

	Show : need to implement `show :: a -> String`

	Read : need to implement `read :: String -> a`

--------------  Class and Type  ------------------------

Define your own class:

> class MyShow a where
>	myShow :: a -> String

> instance MyShow Int where
>	myShow i = show i

Type and data:

`type` is used for rename, it do not define any actual new type. Just like typedef in C. eg:

> type Coordinate = (Int, Int)
> type_syntax :: Coordinate -> Int -- type_syntax :: (Int, Int) -> Int
> type_syntax (x, y) = x + y


`data` is used for define an new type:

> data Direction = East | South | West | North
> data MyMaybe a = MyNothing | MyJust a deriving Show
> --data Tree a = Leaf a | Node (Tree a) a (Tree a)  deriving Show


`newtype` : 
	1. If the type only have single constructor with single argument, then we could use newtype instead of data.
	2. Much efficient than data.

> newtype Position = Point (Int, Int)


Define your own class:
	class Eq a where 
		(==), (/=) :: a -> a -> Bool

	-- let your data type be the instance of a class
	instance Eq yourTypeConstructorName where
		the implementation of the requirement

> class MyEq a where
> 	eq, neq :: a -> a -> Bool
> 	neq x y = not $ eq x y

> -- you could make you data type into instances of more than one class
> data MyBool = MyTrue | MyFalse deriving (Show, Eq, Ord) 
> instance MyEq MyBool where
>       -- Type declaration is illegal here, can not uncomment the following line !
>	-- eq :: MyEq -> MyEq -> Bool 
>	eq MyTrue MyTrue = True
>	eq MyFalse MyFalse = True
>       eq _ _ = False

We can also define a class based on a exist class:

> class MyEq a => NewClass a where
>	nothing :: a -> a
>	nothing a = a  -- you can define the default behavir


--------------  Monad  ------------------------

Functor :

> class Zunctor z where
>	zmap :: (a -> b) -> z a -> z b

> instance Zunctor MyMaybe where
>	-- zmap :: (a -> b) -> MyMaybe a -> MyMaybe b
>	zmap f MyNothing = MyNothing
>	zmap f (MyJust x) = MyJust (f x)

> instance Zunctor [] where 
>	-- zmap :: (a -> b) -> [a] -> [b]
>	zmap = map

> -- Using Zunctor we can define more general purpose function
> inc :: Zunctor z => z Int -> z Int
> inc z = zmap (+1) z


Applicative :

> -- Since Applicative should also be the instance of Functor 
> class Zunctor z => Zpplicative z where
> 	zure :: a -> z a
>	(<#>)  :: z (a -> b) -> z a -> z b


> instance Zpplicative MyMaybe where 
>	zure a = MyJust a

>	MyNothing <#> _ = MyNothing
>	(MyJust f) <#> zx = zmap f zx

The above definition is based on Zpplicative is also instance of Zunctor,
The definition below based on nothing. But both works.
	_ <#> MyNothing = MyNothing
	MyNothing <#> _ = MyNothing
	(MyJust f) <#> (MyJust a) = MyJust (f a)


> instance Zpplicative [] where
>	zure a = [a]

	
TODO: Seems can not use fmap to give definition ? Not sure.

>	--(<#>)  :: z (a -> b) -> z a -> z b
>	fs <#> xs = [ f x| f <- fs, x <- xs]


-- debug use
 addThree a b c = a + b + c

-- some example 

> data Expr = Val Int | Div Expr Expr

> safediv :: Int -> Int -> MyMaybe Int
> safediv _ 0 = MyNothing
> safediv a b = MyJust $ a `div` b


> eval :: Expr -> MyMaybe Int
> eval (Val i) = MyJust i
> eval (Div e1 e2) = case eval e1 of
>	MyNothing -> MyNothing
>	MyJust i1 -> case eval e2 of 
>		MyNothing -> MyNothing
>		MyJust i2 -> safediv i1 i2

> expr1 = Div (Val 3) (Val 0)
> expr2 = Val 3
> expr3 = Div (Val 18) (Val 2)




Safediv is not pure, so need an alternation.
The following code could not compile.

> --eval1 :: Expr -> MyMaybe Int
> --eval1 (Val i) = MyJust i
> --eval1 (Div e1 e2) = zure safediv <#> eval1 e1 <#> eval1 e2


Let's have a simple analyzation :
	1. what we want is using a function which is get a pure input 
           then have an unpure output (with state).
	2. But zure (pure) can only used to convert a pure function (from
  	   pure to pure)
	3. So we need a way to manage the case from pure to unpure.
	4. This is where monad comes...

> class Zpplicative z => Zonad z where
> 	zeturn :: a -> z a
> 	(>>#) :: z a -> (a -> z b) -> z b


> instance Zonad MyMaybe where
>	zeturn a = MyJust a
>	
>	MyNothing >># _ = MyNothing
>	MyJust a >># f = case f a of
>		MyNothing -> MyNothing
>		zx -> zx


> -- 
> eval1 (Val i ) = MyJust i
>-- eval1 (Div e1 e2) = eval1 e1 >># (\i -> eval1 e2 >># (\j -> safediv i j))
> eval1 (Div e1 e2) = eval1 e1 >># \i ->
>		      eval1 e2 >># \j ->
>		      safediv i j


> instance Functor MyMaybe where
>	fmap _ MyNothing = MyNothing
>	fmap f (MyJust a) = MyJust $ f a

> instance Applicative MyMaybe where
>	pure a = MyJust a
>	MyNothing <*> _ = MyNothing
>	MyJust f <*> m = fmap f m
>	-- the below is the definition from scratch 
>	--MyJust f <*> MyNothing = MyNothing
>	--MyJust f <*> MyJust a = MyJust $ f a

> instance Monad MyMaybe where
>	return = pure
>	--return a = MyJust a
>	-- usually we call `>>=` bind
>	MyNothing >>= _ = MyNothing
>	MyJust a >>= f = f a

>
> eval2 (Val i) = MyJust i
> eval2 (Div e1 e2) = do i <- eval2 e1
>			 j <- eval2 e2
>			 safediv i j

State Monad

> type State = Int
> newtype ST a = S( State -> (a, State)) 
> app :: ST a -> State -> (a, State)
> app (S st) s = st s

> instance Functor ST where
>	--fmap f (S st) = S(\s -> let (a, s') = st s in (f a, s'))
>	fmap f sta = S(\s -> let (a, s') = app sta s in (f a, s'))

> instance Applicative ST where
>	-- pure :: a -> ST a
>	pure a = S (\s -> (a, s))
>	-- (<*>) :: ST (a->b) -> ST a -> ST b
>	--stf <*> sta = S (\s -> let (f, s') = app stf s
>				   --(a, s'') = app sta s' in (f a, s''))
>	stf <*> sta = S (\s -> let (f, s') = app stf s in app (fmap f sta) s')

> instance Monad ST where
>	-- return :: a -> ST a
>	--return a = S (\s -> (a, s))
>	return = pure
>	-- (>>=) :: sta -> (a -> stb) -> stb
>	sta >>= f = S(\s -> let (a, s') = app sta s in app (f a) s')
>	

State Monad Application

> data Tree a = Leaf a | Node (Tree a) (Tree a) deriving Show

Try to define a function that label each leaf in the tree.

> rlabel :: Tree a -> Int -> (Tree Int, Int)
> rlabel (Leaf _) i = (Leaf i, i + 1)
> rlabel (Node t1 t2) i = (Node t1' t2', i'')
>	where (t1', i') = rlabel t1 i 
>	      (t2', i'') = rlabel t2 i'

> -- debug 
> tree1 = Leaf 'a'
> tree2 = Node (Node (Leaf 'a') (Leaf 'b')) (Leaf 'c')

> rlabel1 :: Tree a -> ST (Tree Int)
> rlabel1 (Leaf _) = S(\s -> (Leaf s, s+1))
> rlabel1 (Node t1 t2) = S(\s -> let (t1', s') = app (rlabel1 t1) s
>				     (t2', s'') = app (rlabel1 t2) s' in
>				 (Node t1' t2', s''))

> fresh :: ST Int
> fresh = S(\s -> (s, s+1))

> rlabel2 :: Tree a -> ST (Tree Int)
> --rlabel2 (Leaf _) = fresh >>= (\s -> return (Leaf s))
> rlabel2 (Leaf _) = fresh >>= return . Leaf
> --rlabel2 (Node t1 t2) = rlabel2 t1 >>= (\t1' -> rlabel2 t2 >>= (\t2' -> return (Node t1' t2')))
> rlabel2 (Node t1 t2) = rlabel2 t1 >>= \t1' ->
>                        rlabel2 t2 >>= \t2' -> 
>	 	 	 return (Node t1' t2')

> rlabel3 :: Tree a -> ST (Tree Int)
> rlabel3 (Leaf _) = do n <- fresh
>		     	return (Leaf n)	
> rlabel3 (Node t1 t2) = do t1' <- rlabel3 t1
>			    t2' <- rlabel3 t2
>			    return (Node t1' t2')


Some commonly used operators and functions.

	+ - * (Num a)
	4 / 2 = 2.0 (Fractional a)
	4 `div` 2 = 0 (Integral a)
	4 `mod` 2 = 0 (Integral a)
	2 ^ 3 = 8

	not True = False

	True && True = True
	True || False = True

	3 == 4 = False
	3 /= 4 = True

	1 : [1,2,3] = [1,1,2,3]
	2 `elem` [1,2,3] = True
	4 `elem` [1,2,3] = False
	[1,2,3] ++ [4,5] = [1,2,3,4,5]
	[1,2,3] !! 0 = 1
	head [1,2,3] = 1
	tail [1,2,3] = [2,3]
	init [1,2,3] = [1,2]
	last [1,2,3] = 3
	take 3 [1,2,3,4] = [1,2,3]
	drop 3 [1,2,3,4] = [4]
	length [1,2,3] = 3
	null [] = True
	and [True, True, True] = True
	or [True, True, False] = Trule
	map (+1) [1,2,3,4] = [2,3,4,5]
	filter even [1,2,3,4] = [2,4]
	takeWhile odd [1,2,3,4,5] = [1]
	dropWhile odd [1,3,5,4,7] = [4,7]
	any even [1,2,3,4] = True
	all even [1,2,3,4] = True
	repeat 1 = [1,1,1,1...]
	reverse [1,2,3] = [3,2,1]
	zip [1,2,3] "abcde" = [(1,'a'), (2, 'b'), (3, 'c')]
	zip [1,2,3] "" = []
	fst (1,2) = 1
	snd (1,2) = 2
	splitAt 2 [1,2,3,4] = ([1,2], [3,4])
	id [1,2,3] = [1,2,3]
	sum [1,2,3] = 6
	product [5,5,5] = 125

	-- high order function
	foldr :: (a -> b -> b) -> b -> [a] -> b
	foldr f v [] = v
	foldr f v (x:xs) = f x (foldr f v xs)

	foldl :: (a -> b -> a) -> a -> [b] -> a
	foldl f v [] = v
	foldl f v (x:xs) = foldr f (f v x) xs

	(.) :: (b -> c) -> (a -> b) -> (a -> c)
	f . g = \x -> f (g x)

```
