# Stories
欢迎Star, 欢迎RP.

## gh-pages
This branch is for distributing only.

## 用法

### 依赖
确保你的电脑安装了`Node.js`

### 第一次使用
1. 左上角 Fork 这个仓库, 然后在你自己的仓库列表中找到这个仓库并 `git Clone` 到你的电脑上.
2. 进入项目目录, 默认是`master`分支, 直接`git checkout gh-pages`切换到`gh-pages`分支.
3. 除非你知道你在干什么, 否则删除CNAME.
4. 创建一个文件`config.js`, 具体格式如下:
    ```js
    module.exports = {
      user: 'nzhl', // 你的github名
      repo: 'books', // 你写Issue博客所用的仓库名
      // 如果你需要频繁变更你的博客
      // 那么你需要创建一个GitHub App才能得到id和key
      // 创建过程很简单, 详见
      // https://developer.github.com/apps/building-github-apps/creating-a-github-app/
      // 否则的话下面两栏可以不填
      client_id: '', 
      client_secret: ''
    }
    ```
5. 运行以下指令
    ```bash
    npm i
    node app.js
    ```
6. 最后`git push`到GitHub, 访问https://nzhl.github.io/stories/即可看到你的博客. (注意把`nzhl`改成你自己的GitHub用户名)

### 更新
如果你的Issues有更新, 只需要:
1. 打开项目目录, 切换到`gh-pages`分支.
2. `node app.js`
3. `git push`到GitHub
