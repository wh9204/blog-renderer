## What is Docker ?

There are a lot of explanations for Docker over the Internet. But in my own point of view, Docker is a **super lightweight** but powerful virtual machine technique with
a handy usage. You can also regard it as a Parallels Desktop without GUI interface. Before we continue just come to [official website](https://www.docker.com) to install it.

## My Idea

### Mindset

At most situation, people use it to pack a running environment so that they can deploy it in another computer quickly and easily. For example,
imaging you have a web server for your website, but the machine you develop it differs to the machine you are going to deploy it. So you need to
install all the dependence and set the running environment for both two computers. This is usually not a entertaining work, this is where Docker comes.
It seems it's suitable for those big company, and people hardly realize it will also be a powerful tool for personal user (at least for me 3>). 


### My Usage and Its Advantages

+ Get almost any usual system running environment  (like Ubuntu, Debian) in several lines of codes.
You no longer need to download the system image, then painfully install it using several minites and
face the risk that finnally you got a seems unsolvable problem.

+ Keep you computer's running environment clean, which means you won't get conflict to install a tool which need a library A
which is somehow conflicted with library B downloaded by another software three days ago. If you have a crazy obsession for a really clean command line running environment just like me, trust me, just install it.

+ Fast than virtual machine but need less computer resources. To explain this idea, you need to have a knowledge about the inner structure difference between docker and traditional virtual machine. Traditional virutalization is by running a target system based on simulated hardware, so every instruction is in fact not execute by our physical machine directly. But what Docker is going to do is that it does not simulating hardware or system, it just provides the necessary libray/dependence which software needed for running, which means the process is in fact directly running on the physical machine. Because of this difference,Docker usually boot quicker and has a higher running effeciency (in fact lower down the hardware requirement for your computer).


## Some Important Concepts and Usages

### Concepts

First let's we discuss three important concept :

1. Image : It provides those necessary software, libraries and configuration for the system and keep it as small and tidy as possible. So you will find all the
images are small. For example, the ubuntu:16.04 image is only 117MB. It's just a minimum file system. One important feature needed to know is that the image is
based on layer, which means image is a stack of layers. One a layer is created, it would no longer changed, so that all the change will not on the current layer
but one more layer on the top with the changed logged.
2. Container : Although we could say the container and image is just like instance and class, but in fact container is a running process, but it's special, so it
got its own file system, network and process space just like an operating system based on the image. When the container is running, the content inside is based on
the image, but in fact it will made a new layer on the top of it and logged any change on the new layer. Once the container die (not stop), this temporary layer will
just disappear. So all the information saved inside will just go away as well.
3. Repository : You can regard repository as a git hub for images, we can download those common images from [Docker Hub](https://hub.docker.com) which is the official
public repository.

### Usage

In the following content I will show you how I fetch a ubuntu:16 and configure it as my daily used develop environment.

1. `docker pull ubuntu:16.04`
    + fetch an image from Docker Hub since no repository address is specified.
2. `docker images`
    + You will see all the **top layer images**, so what is top layer images ? As I said above, image is just stack of layer, and another important feature is, Docker
    uses Union FS, which means if two images based on the same image, then the based image will on have one copy in your system. 
    + To see all the images include those intermediate one, use `docker images -a`
    + use `docker rmi id` to delete an image, the only thing you need to know is, if some top image is based on the intermediate image, you won't be allowed to delete
    the intermediate one if you do not delete the top one first.
3. `docker run --name base -ti -p 127.0.0.1:22:22 (ID of Ubuntu:16) bash`
    + use `--name base` to specify the name of container as `base`.
    + use `-ti` to specify we need a pseudo-TTY and want to interact with it.
    + use `-p ip:port:port` to bind the `ip:port` in your physical machine with the rear port number in the virtual machine.
    + once you type this command, you will enter Ubuntu directly.
4. Install necessary tool and do some system configurations.
    + `passwd` : change password for your system, will be used as login password for ssh.
    + `dpkg-reconfigure locales` : set the locales
    + `apt update`
    + `apt install vim -y`
    + `apt install tmux -y`
    + `apt install openssh-server -y` : install ssh server to allow you do ssh remote login.
        1. `vim /etc/ssh/sshd_config` change the setting column `PermitRootLogin no` into `PermitRootLogin yes` : allow you to login in as root.
        2. `/etc/init.d/ssh start` : start ssh server.
        3. In your physical terminal use `ssh root@127.0.0.1 -p22` to login in to your virtual machine.
    + `apt install git -y`
    + `apt install zsh -y` : use zsh to substitute bash.
        1. `chsh -s /bin/zsh` : set zsh as default one.
        2. `sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"` : install zsh plugin.
        3. `apt install autojump` then go to `.zshrc` enable it.
    + Install conda, check my article [Using Conda To Manage Running Environment In Python](https://github.com/nzhl/blog/blob/master/category/python/Using%20Conda%20TO%20Manage%20Running%20Environment%20In%20Python/README.md), may need to `apt install bzip2` first (dependence).
    + `apt install locales -y` then `dpkg-reconfigure locales` to set the font.
    + You may want install your own, just install and delete all the necessary file and clear apt cache `rm -rf /var/lib/apt/lists/*`.
    + Once everything is done, just exit.
5. `docker commit container-ID customized:16.04` : this makes your container with your software installed pack into a new image with a repository
name "customized" and the tag "16.04".
    + You can use `docker ps` to check current running container and add flag `-a` to check all the container.
    + `docker rm base` : remove the container we just created.
    + `docker rmi ID` :  remove a image with the specified ID.
6. `docker run --name Cool -d -p 127.0.0.1:1314:22 -p 127.0.0.1:80:5000 -v ~/docker:/root/docker 12b5bd10f244 /usr/sbin/sshd -D`
    + `-d` is used to make the container running as a daemon.
    + `-v machine/directory:container/direcory` can mount the specific directory on your machine into the system. Here in fact involves a concept
    named Volume, but for the **only learn what need to learn** rule, I decided to ignore it. Just think the file is shared by your
    physical and virtual system.
    + Now you can use `ssh root@localhost -p1314` to login to your virtual machine.
7. Maybe next time you just mess everything up in this environment, you can use docker run to quickly initialize a new one. Cool !

### Postscript Note

This article only mentioned those most frequently used features by me, in fact a more convenience way to make a container is writing docker file.
And what you see in my article about Docker is just the tip of the iceberg, to know more powerful usage, I recommend you to read the official document.
