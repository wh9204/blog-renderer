import axios, { AxiosRequestConfig } from "axios";
import fs from "fs";

const config = {
  repo: 'blog-articles',
  owner: 'nzhl',
  token: ''
}

const gqlGet = (query: string) => {
  const axiosRequestConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `bearer ${config.token}`
    }
  }
  return axios.post('https://api.github.com/graphql', { query }, axiosRequestConfig);
}

const throwOnError = (res: any) => {
  if (res.data.errors) {
    throw new Error(res.data.errors[0].message);
  }
}


const init = async () => {
  let res = await gqlGet(`{
    repository(name: "${config.repo}", owner: "${config.owner}") {
      issues {
        totalCount
      }
    }
  }`)
  throwOnError(res);
  const totalCount: number = res.data.data.repository.issues.totalCount;

  res = await gqlGet(`{
    repository(name: "${config.repo}", owner: "${config.owner}") {
      issues(first: ${totalCount}) {
        nodes {
          number
          title
          createdAt,
          bodyHTML
        }
      }
    }
  }`)
  throwOnError(res);
  const issues: {
    number: number;
    title: string;
    createdAt: string;
    bodyHTML: string;
  }[] = res.data.data.repository.issues.nodes;

  for (let { number, bodyHTML } of issues) {
    fs.writeFile(`./articles/${number}.html`, bodyHTML, () => console.log(number))
  }
  fs.writeFile('./articles/list.json', JSON.stringify(issues.map(({ bodyHTML, ...others }) => others)), () => console.log('list.json'))
}



try {
  init()
} catch (e) {
  console.error(e.message);
}