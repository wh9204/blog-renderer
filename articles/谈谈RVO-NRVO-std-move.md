
### RVO与NRVO
RVO全称是**Return Value Optimization**, 而NRVO全称是**Named Return Value Optimization**.  先来看看什么是RVO :

```c++
Object foo(){
    return Object();
}

int main() {
    auto temp = foo();
}
```

按照正常的C++逻辑, 执行这个程序将调用2次Object类的构造函数和析构函数, 但是仔细分析就会发现, 实际上第一次调用的构造函数完全是多余的, 改代码甚至可以直接从`auto temp = foo()`优化为`auto temp = Object()`, 实际上编译器也是这么做的, 这种优化, 就叫做RVO. 这是早期的RVO优化, 仅仅支持匿名变量, 随着编译器的发展, 就出现了NRVO :

```c++
Object foo(){
    Object local;
    return local;
}

int main() {
    auto temp = foo();
}

/*
    constructor
    deconstructor
*/
```

可以看到实际上NRVO就是RVO的变种而已. 在实际的内存模型中就是, 与其在被调函数(foo)调用栈中创建出对象然后再移动到主调函数调用栈(main), 不如直接就在主调函数调用栈中分配空间. 可以看到NRVO/RVO实实在在地省去了一次对象的创建. 

但是来看下面这种情况 :

```c++
Object foo(){
    Object local1, local2;
    int x = 3;
    if(x == 3){
        return local1;
    }
    else {
        return local2;
    }
}

int main() {
    auto temp = foo();
}

/*
    constructor
    constructor
    copy constructor
    deconstructor
    deconstructor
    deconstructor
*/
```

你可以在自己的Object对象的构造, 拷贝, 析构函数中打印字符, 会发现RVO失效了, 这又是为什么呢? 因为在包含了if/else的语句中, 判断难度加大, 编译器会放弃RVO/NRVO. 那么这时候怎么办呢? 这就需要std::move, 在这之前先了解一下11标准中的移动构造函数.

### 移动构造函数与std::move
1. 移动构造函数的用途在于, 以原对象转化为原型构建新对象的过程中, 若原对象将要失效, 那么我们可以把源对象内部的数据之间转移给新对象. 这样说可能不是很清晰, 举个简单的例子, 例如 : 我们有一个很长很长的字符串,  我们知道C++字符串实际上是对C字符串的封装, 其内部实际上保存了C字符串的指针, 指向的是实际保存的字符串的地址. 这里如果常规方案的话, 我们需要先重新分配一段空间, 然后把旧的字符串拷贝到新的空间中, 然后释放旧的字符串空间. 但是如果**原对象将要失效**(这里指出local variable作用域或者被delete掉)的话, 我们完全可以将原字符串内部的指正直接拷贝到新的字符串中, 然后将原字符串中的指针写为null, 这样的话, 就省去了重新分配内存和拷贝字符的时间, 这就是移动构造函数的用途. 
2. 上面这个例子加入了if/else导致RVO触发失败, 那么我们完全可以利用移动构造函数来减小开销(当然如果这个对象并不存在内部内存分配那就没有这个必要了). 那么要如何触发移动构造函数呢? 答案就是std::move...但是实际上只要你定义了移动构造函数, 上面的例子实际上是会直接调用移动构造函数的, 并不需要显式说明, 说归说, 但是我们还是应该理解std::move的工作原理... std::move实际上可以认为是一个类型转换, 它将传入的类型转化为一个右值引用, 关于这部分这个[帖子](https://www.ibm.com/developerworks/community/blogs/5894415f-be62-4bc0-81c5-3956e82276f3/entry/RVO_V_S_std_move?lang=en)讲的特别清楚.

### 矛盾
那么常规情况下该不该使用std::move显式地标记我们想要调用移动构造函数呢, 比如最开始那个RVO的例子, 写成这样怎么样? 

```c++
Object foo(){
    Object local;
    return std::move(local);
}

int main() {
    auto temp = foo();
}
```

你会发现, 这样做只会导致一个结果, 调用了移动构造函数而没有调用RVO, 很尴尬. 实际上RVO的另一个要求在于, 必须保持函数返回类型与return语句一致, 而这里我们使用了std::move之后return语句中的类型已经变成了右值引用, 而函数返回类型是Object, 问题就出在这里. 那么按照效率来讲, 移动构造函数实际只是构造函数内部的优化而RVO是直接优化掉了构造函数, 所以一般情况下显式地使用std::move也是错的. 那么到底应该怎么做, 其实我也不知道... 看情况吧, 一般还是别加, 具体可以看看这篇[帖子](https://www.zhihu.com/question/30978781).
