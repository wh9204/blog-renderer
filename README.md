# Stories

## gh-pages
This branch is for distributing only.

## Usage

1. When using it the first time, create a file named `config.js` under root directory. It should be the following format.

    ```js
    module.exports = {
      user: 'nzhl', // your github username
      repo: 'books', // the repository 
      client_id: '',
      client_secret: ''
    }
    ```

2. Use `node app.js` to compile it.

3. Update your changes to github.
    ```bash
    git add .
    git commit -m "update blog"
    git push
    ```

## Slow access
 Same blog also hosted on [Tencent Cloud](https://www.zhiminzhang.com) as well, which is much more accessible for China users.
