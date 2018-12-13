### The concept
There are a lot of ways to implement map/dictionary(set of key-value pairs). The simple but inefficient way is array based, But the most frequently used way is **hash table**.

+ The basic idea is to convert every key into a index of a fixed interval. [0, container_size)
+ The process of converting is called hash, usually it just needs O(1).
+ If two different keys are converted into the same value/index, this is collision.

So the following content will focus on hash function and collision solving.

## Several common hash functions

+ In fact the type of key can be anything (string, object...), usually we will convert it into a integer value first.
+ But in this article we will ignore the above process and only focus on how to convert a large integer into a index that fit the container.
+ **The key criteria of a hash function is to what extent it can avoid the collision.**

### Division

1. Imagine key == k, and the container size is m.
2. Then the hash function is `h(k) = k mod m`.
3. The choosing of m is really important. According to the theory from the book, m should be a prime number that is **away from the power of 2** (eg. 701).

### Multiplication

1. Imagine key == k, and the container size is m.
2. Then the hash function is `h(k) = floor(m(kA mod 1))`, here A is a decimal in (0, 1).
3. And the choosing of A's value should according to the input value, but usually when A is close to `(sqrt(5) - 1) / 2`(roughly **0.6180339887...**), it works better.
4. The advantage of multiplication comparing to division is we can randomly choosing m since it's no longer that important.
5. Usually m should be the power of 2, so we can use shift operation to make it more efficient.

### More

There are a lot of efficient hash function suitable for different situation, here I only mentioned two simple ones.

## Collision Handing

### Separate Chaining

+ In this method, let every entry in hash table be a list rather the element we want to store.
+ If collision occur, we just insert the new element into the list.
+ Of course we may use other more efficient data structure rather list.

### Open Address

In this method every entry should store the element, once collision occur, just traversal the container to find the next free position **in some rule**.
If the container is full, then insert failed. But what should those rules be ? Here are three common rules :

1. liner probing :
    + Imagine the hash value calculated is k, and the container size is m. Then we choose a constant c (maybe 1, 2, 3...)
    + The order to be checked is {k, k + c, k + 2c,...} mod m.
    + This is simple, but it will cause the collision element lump together.
2. square probing :
    + Imagine the hash value calculated is k, and the container size is m. Then we choose a constant c1, c2.
    + The order to be checked is {k, k + c1 + c2, k + c1 * 2 + c2 * 2^2, k + c1 * 3 + c2 * 3^4} mod m.
    + Better than liner probing in practice, but need to choose a suitable c1 and c2 to make full use of the map.
3. double hash :
    + It uses a secondary hash table to handle the collision.
    + Imagine the two hash value calculated from the two hash function is k1 and k2, and the container size is m.
    + The order to be checked is {k1, k1 + k2, k1 + 2 * k2, k1 + 3 * k2, ...} mod m.
    + Must make sure k2 can not be 0, and the container size m must be a prime to make sure all position can be probed.

#### Remove element for open address

You can not directly set the value at the specific position into NULL, because there may be some elements with the same hash value stored behind because of the collision.
Otherwise that element won't be find after this delete operation (once the find function function NULL, it will return directly). The best way should be use a deleted flag,
and in the find function, if flag is found just ignore it and continue find.

### The performance of hashing

+ Usually it's O(1) for both insert, remove and find, but in the worst case it is O(n).
+ The worst case occur when all the elements are inserted into collision.
+ Except choose a better hash function and collision handing strategy, rehash the container regularly is also important.
    + We use load factor ( number of elements stored / container size ) to present how full the map is.
    + In Java, once load factor matches 75%, rehash will happen.
+ Rehash usually means create a bigger container and move all the element into it. Usually it's not done in one go but a few at a time.

### An simple implementation

```c++
#ifndef CPP_HASHMAP_H
#define CPP_HASHMAP_H

#include <array>
#include <string>
#include <vector>
#include <iostream>
#include <cmath>

enum WAY_TO_CONVERT{
    DIVISION,
        ADDITION

};

/*
 * 1. the key must be string
 * 2. use chain to solve collision
 */
template <typename VALUE, WAY_TO_CONVERT CONVERT>
class HashMap {
    struct Element{
        std::string key;
        VALUE value;

    };

    const static int ASCII_SIZE = 128;
    const static int SIZE = 701;
    constexpr const static double A = 0.6180339887;
    std::array<std::vector<Element>, SIZE> map;

    size_t keyToIndex(std::string key){
        /**
         * 1. string -> digit
         * 2. digit  -> index
         */
        size_t sum = 0;
        for(auto each : key){
            sum += each * ASCII_SIZE;

        }
        if(CONVERT == DIVISION){
            return sum % SIZE;

        } else{
            return std::floor((sum * A - std::floor(sum * A)) * SIZE);

        }

    }
    public:
    HashMap(){  }
    HashMap(const HashMap&) = delete;
    HashMap operator=(const HashMap&) = delete;


    VALUE search(const std::string key){
        size_t index = keyToIndex(key);
        if(map[index].size() != 0){
            if(map[index].size() == 1){
                return map[index][0].value;

            } else{
                for(auto const& element: map[index]){
                    if(element.key == key){
                        return element.value;

                    }

                }

            }

        }
        return 0;

    }


    void insert(const std::string key, const VALUE value){
        if(search(key) == 0) {
            size_t index = keyToIndex(key);
            Element element;
            element.key = key;
            element.value = value;

            map[index].push_back(element);

        }

    }

    void deleteElement(VALUE value){
        //TODO

    }

};

#endif //CPP_HASHMAP_H
```
