#! /bin/bash

for i in {1..28}
do
  echo "making request $i"
  curl --request POST \
  --url http://localhost:5000/jsmonday-cms/us-central1/createImage \
  --header 'content-type: application/json' \
  --data "{ \"id\": $i }" 
done