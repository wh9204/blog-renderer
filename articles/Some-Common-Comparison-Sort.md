```c

typedef struct Singly_Node{
    struct Singly_Node *next;
    void *elem;
}Singly_Node;

typedef struct Singly_List{
    Singly_Node *head;
}Singly_List;

typedef struct Doubly_Node{
    struct Doubly_Node *next;
    struct Doubly_Node *prev;
    void *elem;
}Doubly_Node;

typedef struct Doubly_List{
    Doubly_Node *head;
}Doubly_List;


void bubble_sort(int *array, int len);
void bubble_sort_list(Singly_List *list);

void selection_sort(int *array, int len);
void selection_sort_list(Singly_List *list);

void insertion_sort(int *array, int len);
void insertion_sort_list(Doubly_List *list);

void merge_sort(int *array, int len);

void heap_sort(int *array, int len);

void quick_sort(int *array, int len);
```

```c
#include <stdio.h>
#include <stdlib.h>

#include "sorts.h"

static void swap(int *array, int i, int j){
    int temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

static void swap_node(Singly_Node *node1, Singly_Node *node2){
    void *temp = node1->elem;
    node1->elem = node2->elem;
    node2->elem = temp;
}


/*
 *  1. Stable sort
 *  2. May get a lot of comparisons and **swaps**.
 *  3. Can easily be used on a single linked list.
 *  4. Time Complexity : O(n^2)
 */
void bubble_sort(int *array, int len){
    for(int i = len-1; i > 0; --i){
        for(int j = 0; j < i; ++j){
            if(array[j] > array[j+1]){
                swap(array, j, j+1);
            }
        }
    }
}

void bubble_sort_list(Singly_List *list){
    Singly_Node *guard = NULL;
    while(list->head != guard){
        Singly_Node *cur = list->head;
        while(cur->next != guard){
            if(*(int *)(cur->elem) > *(int *)(cur->next->elem)){
                swap_node(cur, cur->next);
            }
            cur = cur->next;
        }
        guard = cur;
    }
}

/*
 *  1. Stable sort
 *  2. May get a lot of comparisons.
 *  3. Fewer swaps, at most (len - 1) times.
 *  4. Can easily be used on a singly linked list.
 */
void selection_sort(int *array, int len){
    for(int i = len-1; i > 0; --i){
        int greatest_index = 0;
        for(int j = 0; j <= i; ++j){
            if(array[j] > array[greatest_index]){
                greatest_index = j;
            }
        }
        if(i != greatest_index){
            swap(array, i, greatest_index);
        }
    }
}

void selection_sort_list(Singly_List *list){
    Singly_Node *guard = NULL;
    while(list->head != guard){
        Singly_Node *max = list->head;
        Singly_Node *cur = list->head;
        while(1){
            if(*(int *)(cur->elem) > *(int *)(max->elem)){
                max = cur;
            }
            if(cur->next == guard){
                guard = cur;
                if(guard != max){
                    swap_node(guard, max);
                }
                break;
            }
            cur = cur->next;
        }
    }
}

/*
 *  1. Stable sort
 *  2. Better for those input which is already sorted or almost sorted.
 *  3. Best case can have O(n) time complexity and with a O(n^2) as worst.
 *  4. Can easily be used on a **doubly linked** list. In fact can also
 *     be used in a **singly linked** one, but only from head to guard
 *     can be implemented in inner loop since can not find the previous node.
 */
void insertion_sort(int *array, int len){
    for(int i = 1; i < len; ++i){
        int temp = array[i];
        int j = i - 1;
        while (j != -1 && temp < array[j]) {
            array[j+1] = array[j];
            --j;
        }
        array[j+1] = temp;
    }
}

void insertion_sort_list(Doubly_List *list){
    Doubly_Node *guard = list->head;
    while(guard->next != NULL){
        Doubly_Node *to_insert = guard->next;
        if(*(int *)(to_insert->elem) >= *(int *)(guard->elem)){
            guard = guard->next;
            continue;
        }

        // delete this node first
        to_insert->prev->next = to_insert->next;

        // need consider the tail node
        if(to_insert->next){
            to_insert->next->prev = to_insert->prev;
        }


        // from head to guard
        Doubly_Node *cur = list->head;
        while(cur != guard->next && *(int *)(to_insert->elem) >= *(int *)(cur->elem)){
            cur = cur->next;
        }

        to_insert->next = cur;
        to_insert->prev = cur->prev;
        cur->prev = to_insert;
        if(cur->prev != NULL){
            cur->prev->next = to_insert;
        }
        // head
        else{
            list->head = to_insert;
        }
    guard = guard->next;
    }
}

static void do_merge_sort(int *array, int head, int guard){
    // no more than 1 elem
    if(guard - head <= 1){
        return;
    }

    //divide
    int mid = (head + guard) / 2;
    do_merge_sort(array, head, mid);
    do_merge_sort(array, mid, guard);

    //merge
    int temp[guard - head];
    int left_index = head;
    int right_index = mid;
    int temp_index = 0;

    while(left_index != mid && right_index != guard){
        if(array[left_index] <= array[right_index]){
            temp[temp_index++] = array[left_index++];
        }
        else{
            temp[temp_index++] = array[right_index++];
        }
    }

    while(left_index != mid){
        temp[temp_index++] = array[left_index++];
    }

    while(right_index != guard){
        temp[temp_index++] = array[right_index++];
    }

    // copy back
    int i = 0;
    while(i != temp_index){
        array[i + head] = temp[i];
        ++i;
    }
}

/*
 *  1. Stable sort
 *  2. Not like the those sorts above, it's not a in-place sort.
 *     It needs extra space while running, and the space complexity is O(n).
 *  3. No best case or worst case, always O(nlogn) as its time complexity,
 *     Since it needs extra allocating space, should not consider it if the
 *     input size is small. And in practice it is slower than the quick sort
 *     while the input scale is really big.
 *  4. Not so good with list, since in array we only need constant time to
 *     divide the array, but for list, we need O(n) time.
 */
void merge_sort(int *array, int len){
    do_merge_sort(array, 0, len);
}

static void down_heap(int *array, int cur, int guard){
    int max = cur;
    int left = cur << 1;
    int right = left + 1;
    if(left < guard && array[max] < array[left]){
        max = left;
    }
    if(right < guard && array[max] < array[right]){
        max = right;
    }
    if(max != cur){
        swap(array, max, cur);
        down_heap(array, max, guard);
    }
}

static void build_heap(int *array, int guard){
    int cur = (guard-1) / 2;
    while(cur){
        down_heap(array, cur--, guard);
    }
}

/*
 *  1. Not stable but in-place.
 *  2. The best, worst and average case both are O(nlogn).
 *  3. It tends to compare/swap two elements which are not that
 *     sequential, so may increase the page fault rate of the system.
 */
void heap_sort(int *array, int guard){
    // Array implementation heap, so array[0] is ignored.
    // So the actual array length is guard - 1.
    // First we need to build a max heap in [1, guard-1].
    // Not the same as priority queue, which builds a min heap.
    build_heap(array, guard);

    // `guard == 2` means only 1 element in the tree
    // Then need no to sort at all.
    while(guard > 2){
        swap(array, 1, --guard);
        down_heap(array, 1, guard);
    }
}

static int find_pivot_index(int head, int tail){
    return rand() % (tail - head + 1) + head;
}

static void do_quick_sort(int *array, int head, int tail){
    if(tail - head <= 0){
        return;
    }

    int pivot = array[find_pivot_index(head, tail)];
    int left = head;
    int right = tail;
    while(left != right){
        while(left != right && array[right] >= pivot) right--;
        while(left != right && array[left] < pivot) left++;
        if(left != right){
            swap(array, left, right);
        }
    }

    int mid;
    // now left == right, but not sure array[left]
    // should belongs to left part or right part.
    if(array[left] >= pivot){
        mid = left - 1;
    } else{
        mid = left;
    }
    do_quick_sort(array, head, mid);
    do_quick_sort(array, mid + 1, tail);
}

/*
 *  1. Not stable sort but in-place sort.
 *  2. Worst case would be each time pivot is the maximum or minimum, so
 *     we use O(n) to split a question with size n into two sub-question
 *     with size 1 and n-1, in this case we time complexity is O(n^2).
 *  3. Best case would be each time half the original array, then the time
 *     complexity would be O(nlogn). However, from practice, the average
 *     time complexity is also O(nlogn) and we can randomly choose pivot
 *     to make the worst case hardly occur.
 *  4. Usually quick than merge sort, that's why it's called quick sort.
 */
void quick_sort(int *array, int len){
    do_quick_sort(array, 0, len-1);
}

int main(int argc, char* argv[]){
    int x[] = {0, 8, 7, 10, 4, 5, 6, 9};
    heap_sort(x, 8);
    for(int i = 0; i < 8; ++i){
        printf("%d\n", x[i]);
    }
}
```
