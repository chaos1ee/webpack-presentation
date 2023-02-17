#/bin/bash
curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

pnpm install && pnpm build

if [ $? != 0 ];then
  exit 1
fi