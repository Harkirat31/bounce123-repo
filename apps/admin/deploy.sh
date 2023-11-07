export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v21.1.0/bin

cd /home/ubuntu/bounce123
git pull origin main
yarn install
yarn build
pm2 stop react
pm2 start npm --name "react" -- run "start:react"