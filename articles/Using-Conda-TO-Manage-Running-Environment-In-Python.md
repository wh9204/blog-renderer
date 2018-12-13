### What is Conda ?

> Package, dependency and environment management for any language: Python, R, Ruby, Lua, Scala, Java, Javascript, C/ C++, FORTRAN

Briefly specking, it's a combination of dependency/package management (pip) and environment management (virtualenv).
In my own point, it's simple but powerful just like python.


### What is Anaconda ?

Anaconda is a tool set which contains :

1. A version of python (2.x / 3.x)
2. Conda
3. Some commonly used package for python in data science field.
4. Maybe there is also something else I am not sure.

**So I think everyone starts to taste python should [taste it](https://www.continuum.io) first.**


### Install and Usage

I suppose you use **Ubuntu**, it's also ok if you use other Linux publications.

#### Install 

After you install it, you got nothing special except an directory named anaconda3 in your home directory. I am not sure whether
it has already set the path for you, this command may help if it has not (change `.zshrc` into `.bashrc` if you use bash rather zsh):

```bash
echo 'export PATH="/you-home-directory-path/anaconda3/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Then you can type `echo $PATH`, you should get something like the following :

"/you-home-directory-path/anaconda3/bin:/usr/local/sbin:/usr/local/bin:..."

After that, you can use `conda -V` to check you conda version and also verify you really have conda installed.

**Since the order the path is printed is also the order the system search the command**, so if you type `python` then it will use the python in the anaconda3 rather than
the python you have previous installed. So do not need to worry if you already have python installed in your system.

#### Usage

If you have ever used any package manager like apt-get in Ubuntu, homebrew in Mac, you will feel at home while using conda.

+ `conda create --name/-n  environment-name [dependency list]` : create a new develop environment.
    + once you created an environment, the data about it will stay in the ~/anaconda3/envs
    + eg : conda create -n py3.5 requests  python=3.5
+ `conda create --name/-n environment-name --clone source-environment-name` : make a copy of the source environment
+ `source activate environment-name` : change to specific environment
    + eg : source activate py3.5 
+ `source deactivate` : exit from that specific environment.
+ `conda search package-name` : search if specific package is available for conda to install.
+ `conda install/remove [--name/-n] package-name` : install/uninstall specific package in specific environment, or current environment if environment is not specific.
    + Environment's packages is isolated with each other.
+ `conda remove --name/-n environment-name -all` : delete everything for a specific environment
    + since everything has been deleted, it just means deleted that specific environment.
+ `conda list` : list all the packages you have installed
+ `conda info -e` : check all the environment you have.
    + root is the default environment which can never be deactivate, the data science package is along with it, other newly created environment 
    will get nothing such packages if you do not specify it explicitly.
+ `conda update package-name` : update specific package
    + since conda regard everything as package, so you can in fact update conda itself using conda.
    + eg : conda update conda 
    + eg : conda update python
    + eg : conda updae

And you can also use pip in install packages when sometimes conda install could not manage it. The package is also isolated only inside current environment.

### Uninstall

Since anaconda is nothing except the directory named anaconda3 and a line of code in the `.zshrc`. Just remove those then it's uninstalled.
