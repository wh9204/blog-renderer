Python is an easy and elegant language, but this is not always the case. (At least for me 3>).
This article will hit one of the dark corner -- import. **The detail below is my personal understanding, if I got anything wrong,
please do not hesitate to post me an issue.**

### Starter

The article will be examples based to make sure it's human readable.

Current directory Structure :

```bash
python:
    nzhl :
        - m1.py
        - m2.py
```

Source file m1.py :

```python
import sys
print(sys.path)

import m2
m2.say()

```
Source file m2.py :

```python
def say():
    if __package__ == "":
        print("__package__ is empty")
    else:
        print(__package__)
    print(__name__)
```

Try to run m1.py use command `python m1.py` inside nzhl will output:

```bash
['path_to_your_current_dir/python/nzhl/', ...]
__package__ is empty
m2
```

This is a very easy example, but are you sure about how it works ?

+ when you try to import a module, the python interpreter will actually try to search from two source :
    + the paths list which is pointed by environment variable `PYTHONPATH`, can use `sys.path` to get it in your code.
    + standard library, usually accompanied with python interpreter.

So what happened when you import `m2` here ? The answer is, when you try to run a python script, the interpreter will set the script itself as a top-level module,
and add it's current directory into `PYTHONPATH` temporarily.

+ here means once the script gets end, the current directory will be deleted from the path immediately.
+ both `python m1.py` or `python nzhl/m1` will set the current directory as `nzhl`.

The above example does not involve package, but our following discussion will all be based on package. So just do a minor change to the directory structure :

```bash
python:
    - m.py
    nzhl :
        - __init__.py
        - m1.py
        - m2.py
```

New file m.py:

```python
import nzhl.m1
```

Now if you try to run script m.py at python directory :

```bash
['path_to_your_current_dir/python/', ...]
Traceback
...
ModuleNotFoundError: No module named 'm2'
```

So why we can't find module m2 ? If you understand what I said above, I think you will know answer. If you are confused, focus you eyes on the first line of
the output, you will find the `nzhl` directory is no longer in side the `PYTHONPATH`. That's why we can't find the m2 module. Now we meet the problem, how can
we import a module from another which are in the same package ?

### Relative Import

In the old python 2 age, the `relative import` is the default import style.

+ `.` to denote the current directory.
+ `..` to denote the parent directory.
+ `...` to denote the grandpa directory.
+ It's just like Unix file path, but make sure here directory should all be package.

So let's change m1.py:

```python
import sys
print(sys.path)

from . import m2
m2.say()
```

Run `python m.py` at python again now you will see :

```bash
['path_to_your_current_dir/python/', ...]
nzhl
nzhl.m2
```

This above method is called explicit relative import, **it can be used in python 3.**
In fact there is also a name for `import name` used in a package directory, it's called implicit relative import.
But it tends to make people confused. For example :

```bash
nzhl:
    __init__.py
    m1.py
    copy.py
```

#### Implicit Import

If you write `import copy`, it's not clear whether it refers to a top-level module or to another module inside the package.
ie. `import copy` can easily shadow the standard library `copy` before you know it. Luckily, this bug prone concept has been
deprecated in python 3. And in python 3 you can only use this way to import package which is inside the path -- `PYTHONPATH`
(include script running directory like the first example).

#### Analysis 

1. If you try to run `python m1.py`, you will find you get error again. This is a defect of relative import,
you can no longer directly run the script inside, they can only be imported.

2. When you are maintaining a really complex package, which means you got packages inside packages, using relative
import maybe a good idea because in this way you won't going to hard-code your package name into your code,
so it would be easy if you want to rename you package.

### Absolute Import

**The default import method for python 3.**

So let's change m1.py:

```python
import sys
print(sys.path)

from nzhl import m2
m2.say()
```

Try to run m.py again now you will see :

```bash
['path_to_your_current_dir/python/', ...]
nzhl
nzhl.m2
```

#### Analysis 

1. Since absolute import make it how clear that which package is actually imported, so it's recommended when
your package size is relatively small.

2. But if you try to run m1.py directly, you will still get error.
The reason for the error is obvious, as we mentioned before, if you run a script in side
a package, it will be regarded as a top module rather than a module inside the package. So
in fact the directory nzhl has been added into the sys.path, this makes the package nzhl
invisible. **So you can not run the script directly in neither way.**
