#!/bin/bash
URL="http://$1/message"
msgs=("Donec nec justo eget felis facilisis fermentum." "Aliquam porttitor mauris sit amet orci." "Aenean dignissim pellentesque felis." "Morbi in sem quis dui placerat ornare." "Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam." "Sed arcu. Cras consequat." "Praesent dapibus, neque id cursus faucibus." "Tortor neque egestas augue, eu vulputate magna eros eu erat." "Aliquam erat volutpat. " "Nam dui mi, tincidunt quis, accumsan porttitor." "Dacilisis luctus, metus.")

if [ $# -eq 0 ]
  then
      echo "Plz supply a target in 'hostname:port' format"
  else
    for i in "${msgs[@]}"; do
        data={'"text"':'"'${i}'"'}
        curl --request POST --url $URL --header 'content-type: application/json' --data "$data"
        sleep 0.01
    done
fi
