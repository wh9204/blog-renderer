### Definition

#### To understand what is loop invariant, we must know where we are going to use it.
   - While you are trying to prove the correctness of an algorithm, one of the most commonly used method is assertion/proof based approaches.
   - So we construct a logical proof for any inputs and outputs (i.e build the assertion statements to describe what input and output should be).
   - Also, if we want to prove complete correctness of an algorithm, we must also prove the termination of it.

Here is an example of input/output assertions :

```
function sort(A)
    //TODO
end

For the above sort algorithm, the assertions can be :

input assertion / precondition : A is an array of n integers (n > 0).

output assertion / postcondition : /any i (1 <= i <= n -> /exist j (1 <= j <= n -> A0[i] == A[j]))    => no element removed
                               and /any i (1 <= i <= n -> /exist j (1 <= j <= n -> A[i] == A0[j]))    => no element added
                               and /any i (1 <= i <= n -> /not exist j(1 <= j < i -> A[i] < A[j]))    => sorted

```

#### From assertion to loop invariant

1. Following the idea above, we must prove every step of the algorithm to make sure after executing the algorithm, postcondition will hold.
2. But usually non-loop step is kind of obvious, people always focus on the loop assertion.
3. To put it simply, assertions about loop are called loop invariant.

### Process

Usually we only need to show three things about loop invariant :

1. **initialization** : the invariant is true prior to the first iteration of the loop.
    + for a `for loop`, it means the position exactly after the loop variable initialization and before the loop test.
    + for a `while loop`, it means the position before the loop test.
2. **maintenance** : it remains true before the next iteration.
    + for a `for loop`, it means the position exactly after the loop variable update and before the loop test.
    + for a `while loop`, it means the position exactly after current loop body and right before the next loop test.
3. **termination** : one more thing we need to make sure is the loop do terminate, otherwise we only proved the partial correctness.

### Some complete examples

//TODO
