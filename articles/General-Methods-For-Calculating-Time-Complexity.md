### Suitable Situation
The following two methods are usually used to have a roughly estimate about a recurrence relation question.

> A recurrence relation is a sort of recursively defined function.
> Suppose that the runtime of a program is T(n), then a recurrence relation will express T(n) in terms of its values at other (smaller) values of n.
> Example : T(n) = 2T(n/2) + 3

### Master Theorem

It covers many useful cases of recurrence relation of this form

> For constant a >= 1, b > 1, T(n) = a T ( n / b  ) + f(n), which means we can spend f(n) time to convert a T(n) problem into seven T(n / b) problems:

1. if f(n) = O(n ^ c), and c < log b (a), then T(n) should be θ(n ^ (log b (a))).
    + for example T(n) = 3T(n / 2) + n => θ(n ^ (log 2 (3))).
2. if f(n) = θ(n ^ c * log n ^ k) and k >= 0, c == log b (a), then T(n) should be θ(n^c * log n ^ (k+1)).
    + for example merge sort, T(n) = 2T(n / 2) + n => θ(n * log n).
3. if f(n) = Ω(n ^ c), and c > log b (a), a * f(n / b) <= k * f(n) for some k < 1, then T(n) should be θ(f(n)).
    + for example T(n) = 2T(n / 2) + n^2 => θ(n^2).

### Recurrence Tree

This way is much more intuitive, but need a better understanding of the algorithm.

Those some are example cases:

#### The most representative example should be merge sort, T(n) = 2 T(n / 2) + n
**Tried to draw the tree first:**

```
n
n/2 n/2
n/4 n/4 n/4 n/4 
...
n leaves with value 1
```

1. Now you can consider the problem's time complexity is the time spend to make `n leaves`back into `1 n`(i.e. the merge time) and the time to solve those leaves.
2. It's obviously the size of the algorithm half once go down a level, so it's easy to find out that the tree's height should be log (n).
3. And for each level, we merge all leaves need time complexity O(n), and time to solve those leaves is just O(n), which can be ignored directly.
4. So it's not hard to get T(n) = θ(n * log2 (n)).

#### Here is a example which can not use master theorem , T(n) = 2 T (n - 1) + n

```
n
n-1 n-1
n-2 n-2 n-2 n-2
...
2^n leaves with value 1
```

+ Obviously the tree's height should be n, so there are 2^n leaves in the bottom of the tree, which means we just need 2^n to solve those base case.
+ But for every level, from the expression we know we need O(n) extra time (maybe used to split or merge), so in total it is O(n + n - 1 + n - 2 + ... + 1), which can be ignore directly.
+ So it's not hard to get T(n) = θ(2 ^ n).

## Prove
After we have a estimate, we need to prove it. Usually we will use substitution method, which means we suppose our estimate is correct, then try to prove it.
At most situations the mathematical induction should help.
