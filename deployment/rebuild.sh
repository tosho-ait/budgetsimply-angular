(rm -rf ./bills)
cp -avr ../bills ./bills
(docker ps -a | grep 'apache-bills' | awk '{print $1}' | xargs --no-run-if-empty docker rm -f)
(docker build -no-cache -t apache-bills .)
docker run --name apacheBills --restart='always' -d -p 80:80 apache-bills
