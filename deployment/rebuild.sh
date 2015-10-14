(rm -rf ./webapp)
cp -r ../webapp ./webapp
(docker ps -a | grep 'apache-bills' | awk '{print $1}' | xargs --no-run-if-empty docker rm -f)
(docker build -t apache-bills .)
docker run --name apacheBills --restart='always' -d -p 90:80 apache-bills
