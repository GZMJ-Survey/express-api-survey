#!/bin/bash

API="http://localhost:4741"
URL_PATH="/surveys"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "survey": {
      "title": "somsagnggrgre",
      "questions": [{
        "problem": "Is it sunny?",
        "answers": {
          "response": false
        }
      },
      {
        "problem": "Is it snowing?",
        "answers": {
          "response": false
        }
      }

      ]
    }
  }'

echo
