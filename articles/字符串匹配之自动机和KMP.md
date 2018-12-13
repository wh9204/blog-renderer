字符串匹配的算法有很多, 今天谈一谈课上学过的自动机和KMP. 下面围绕P = ababc和 T : abababc 来展开说明这两种算法 :

字符串最简单的匹配方式当然是BF, 步骤是 :
1. 当P[0]与T[0]对齐 : a == a => b == b => a == a => b == b => c != a 
2. 当P[0]与T[1]对齐 : a != b
3. 当P[0]与T[2]对齐 : a == a => b == b => a == a => b == b => c == c

然后思考一下如何将这个问题转化为自动机理论, 关键在于下面几点 :
1. 可能出现的字符, 也就是字符集, 这里处于简化目的就a到z.
2. 0号状态表示还未匹配任何一个字符, 接受状态是5号状态, 此时已经匹配了P中的所有字符(P的长度为5). 
3. 状态转移表 : 比如0号状态接收到一个`a`, 那么可以进入1号状态, 如果接收到`b-z`那么就停留在0号状态, 这具体的算法中可以使用二维数组进行表示.
4. 实际中的检查T的匹配情况只需要遍历T, 然后看是否能达到接受状态, 一旦到达接受状态说明匹配成功, 立即返回即可.

但是到目前为止实际上, 这还是BF, 这里我们可以看一下BF中当P[0]与T[0]对齐的时候, 前面abab都是匹配的, 就是因为之后一个是c一个是a, 所以就换一个重新匹配, 是不是有点儿不合理? 换为自动机理论的话, 此时处于状态4, 下一个位置失败, 我们到不了状态5, 直接回到状态0. 如何优化这个过程呢? 简单分析一下 :
1. 就是说现在是想要匹配ababc却遇到了ababa...我们考虑现在的情况是匹配了4位abab在尝试匹配第5位的时候失败了, 显然这时候匹配的位数会减少, 但不应该是直接减少到0.
2. 而是对于ababa, 我们需要用ababc的前缀取尽可能多地匹配ababa的后缀, 好处在于我们的状态机不需要回到状态0, 比如这里前缀和后缀都是abc, 所以对于行如ababa...的target字符串, 这时候虽然不匹配ababc, 但是仍然可以匹配abc(用ababa中的第二个aba去匹配).
3. 理想状态下, 如果ababc == ababc, 那么就是第5位匹配成功. 所以我们可以考虑从5开始, 然后4位... 直至匹配到0, 但是这里显然还能匹配三位, 那么我们只需要从第四位开始检查就行了, 也就是说我们保留了三位的已匹配状态.
4. 那么根据字符串P建立转换表的思路在于, 在某个状态, 遍历所有的字符集, 对于每个字符集都是用上面的思路进行考察, 尽可能的保留匹配状态, 然后填满二维数组即可.

说实话这个地方我水平有限确实感觉很难讲清楚, 这是我的代码实现, 我已经尽可能地让代码简洁清晰明了吧, 不熟悉C++的话可以参考[C版本的实现](https://github.com/nzhl/blog/blob/master/category/algorithm/String%20Matching%20:%20Automata%20and%20KMP/main.c):

```c++
#ifndef MYCPPTOUR_STRINGMATCHINGAUTOMATON_H
#define MYCPPTOUR_STRINGMATCHINGAUTOMATON_H


#include <string>
#include <vector>
#include <map>

class StringMatchingAutomaton {
    private:
        std::vector<std::map<char, int>> transitionTable;
    public:
        StringMatchingAutomaton(std::string pattern):transitionTable{pattern.size()}{
            for(auto q = 0; q < transitionTable.size(); ++q){
                for(char ch = 'a'; ch <= 'z'; ++ch){
                    int k = q + 1;
                    auto string_at_q = std::string(pattern.cbegin(), pattern.cbegin() + q);
                    auto string_at_q_plus_ch = string_at_q + ch;
                    auto string_at_k = std::string(pattern.cbegin(), pattern.cbegin() + k);
                    while (k > 0){
                        if(string_at_q_plus_ch.substr(string_at_q_plus_ch.size()-string_at_k.size(), string_at_k.size()) == string_at_k){
                            break;

                        }
                        string_at_k = std::string(pattern.cbegin(), pattern.cbegin() + --k);

                    }
                    transitionTable[q][ch] = k;
                }
            }
        }

        bool isMatch(std::string target){
            auto currentState = 0;
            for(const auto each : target){
                currentState = transitionTable[currentState][each];
                if(currentState == transitionTable.size()){
                    return true;
                }
            }
            return false;
        }
};

#endif //MYCPPTOUR_STRINGMATCHINGAUTOMATON_H
```

然后是KMP, 实际上说KMP虽然和自动机的优化思路有类似, 但是也不是完全一样. 自动机的思路在于在匹配了n个字符串的情况下看到下一个字符串, 然后尽可能多地保留字符串的匹配数目. (如果下一个字符串匹配成功, 匹配数目加一, 否则就看前后缀最长的相同长度). 而KMP在于, 匹配了n个字符串, 下一个字符串不匹配, 完全通过这n个已经匹配的字符串的信息来优化. 例如上例中已经匹配到了ababc和ababa..., 这个时候, 既然这里已经出现匹配失败, 此时ababc向右移动是必不可少的, BF是移动1位, 考虑abab中, 前缀和后缀相同长度最多是2, 也就是ab, 那么我们这里计算是就当前已匹配的字符串而言的, 可以认为是考虑ababx与ababy进行匹配(x != y), 由于不知道x和y的值, 那么接下来有可能匹配的只能是aba 和 aby... 具体差不多就是这样, 下面是代码实现 :

```c++
bool kmp(std::string pattern, std::string target){
    int table_of_preserved_matching_number_if_fails[pattern.size()];
    table_of_preserved_matching_number_if_fails[0] = 0;

    int already_matching_number = 0;
    for(auto i = 1; i < pattern.size(); ++i){
        while (already_matching_number > 0 && pattern[already_matching_number] != pattern[i]){
            already_matching_number = table_of_preserved_matching_number_if_fails[already_matching_number-1];
        }
        if(pattern[i] == pattern[already_matching_number])   ++already_matching_number;
        table_of_preserved_matching_number_if_fails[i] = already_matching_number;
    }

    already_matching_number = 0;
    for(auto i = 0; i < target.size(); ++i){
        while (already_matching_number > 0 && pattern[already_matching_number] != target[i]){
            already_matching_number = table_of_preserved_matching_number_if_fails[already_matching_number-1];
        }

        if(pattern[already_matching_number] == target[i])   ++already_matching_number;
        if(already_matching_number == pattern.size())   return true;
    }

    return false;
}

```

代码的话稍微解释下, 前面的for循环求得是已经匹配了(i+1)个字符下一个字符匹配失败的情况下回复匹配的字符数量. 例如还是ababc :
1. 第一轮循环i = 1所以我们考虑首先匹配了2个字符, 也就是aba 和 abx的情况, 此时由于ab的前缀是a, 后缀b != a, 所以前缀和后缀的匹配仍然为0.
2. 第二轮是abab和abax, 此时已经匹配了aba, 但是又上一次循环可知b不可能是后缀的开始位置, 所以这里直接从b之后的字符, 也就是当前的i位置开始比较即可, 所以此时前缀和后缀的匹配是1.
3. 第三轮同理, 此时前缀和后缀匹配为2, 也就是abab中的前ab和后ab匹配.
4. 最后一轮c出现, 由于这里的c不匹配前ab之后的a, 就是说本来准备让aba匹配abc,但是不匹配, 这时候while就排上用场了, 这里实际上是在计算匹配的过程中也利用了这个kmp的思想, 也就是说, 既然现在已经匹配了ab, 那么我们完全可以通过刚才这个表查询已经匹配了2个字符, 如果失败的话, 回复的匹配数量, 当然由于这里是ab, 所以直接失败就直接变成0了. 有兴趣的话可以尝试着pattern是ababaababab的情况.

反正这个算法就是那种说不清的感觉, 就是只有你自己知道, 但是说不清, 我写完之后看了一下别人的博客, 感觉这篇算是最清晰的, 我个人觉得他讲的基本上就是我想要表达但是表达不清楚的 : [从头到尾彻底理解KMP](http://blog.csdn.net/v_july_v/article/details/7041827)
