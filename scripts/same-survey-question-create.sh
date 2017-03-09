#!/bin/bash

API="http://localhost:4741"
URL_PATH="/surveys"

curl "${API}${URL_PATH}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "survey": {
      "title": "Anything",
      "questions": [{
        "problem": "Is it sunny?",
        "answers": [{
          "response": false
        }]
      }]
    }
  }'

echo
