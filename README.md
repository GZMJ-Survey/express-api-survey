## Survey Tool
DEPLOYED FRONT END: https://gzmj-survey.github.io/client-survey/

FRONT END REPO: https://github.com/GZMJ-Survey/client-survey

HEROKU: https://murmuring-meadow-73234.herokuapp.com/

## Team Members
Maxime Dore
Gabrielle Williams
Zhu Chen
Jana Ryndin

## Tasks

Make an app that can be used to create custom surveys and collect the responses on a dashboard for that particular survey.

# About
Thank you for visiting our back end repository! This app was built as part of the course's team project.

Our team has seen a survey as a great tool to gather information about business ideas - how well could be taken before even starting the business planning. Our back end repository allows it's front end to have authorization, and to create, read, update, and delete users, surveys, questions, and answers.

The model we have agreed on was that the user creates many surveys, survey creates many questions. Questions will have only 2 bulean answers that can be easily tracked
for statistics.

We designed this app with a friendly user flow while not forgetting a clean responsive design and functionality without user errors. As a result, a user can comfortably sign up/sign in, create an own survey or fill a survey of others. Each survey can have an unlimited number of closed type questions therefore the answers are always yes/no. We decided to go this direction for better collecting of responses from users.

## User Stories

####As a user I want to:
-   Create a survey
-   Add questions to my sureys
-   Anwer anyone's survey questions
-   Have a statistic about surveys

### API Structure
The MongoDB database has two tables: users and surveys.  The users table covers authentication and provides user ID for ownership of individual users' surveys.  The surveys table takes a name, address, type, and notes fields.  All newly created surveys have an "achieved" field that defaults to "false", but can be updated to "true" when the restaurant is visited.

### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/:id` | `users#changepw`  |
| DELETE | `/sign-out/:id`        | `users#signout`   |


### POST / sign-up

```sh
API="http://localhost:4741"
URL_PATH="/sign-up"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "'"${EMAIL}"'",
      "password": "'"${PASSWORD}"'",
      "password_confirmation": "'"${PASSWORD}"'"
    }
  }'
```

response

```markdown
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "user": {
    "id": 58c9b10638cd05fc5caa07ba,
    "email": "maxime@dore.com"
  }
}
```


### POST / sign-in

```sh
API="http://localhost:4741"
URL_PATH="/sign-in"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "email": "'"${EMAIL}"'",
      "password": "'"${PASSWORD}"'"
    }
  }'
```

```sh
EMAIL='maxime@dore.com' PASSWORD='max' sh scripts/sign-in.sh
```

response

```markdown
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "user": {
    "id": 58c9b10638cd05fc5caa07ba,
    "email": "maxime@dore.com"
    "token": "YrNiW55CmLrhXR75TVeYMwOKBFOhqQ1e6FfmUCdgJWg=--wKFI9JQP1nfLCW7+4VluW1NUq45mK5slQtnSRf5IqXA="
  }
}
```


### DELETE / sign-out

```sh
API="http://localhost:4741"
URL_PATH="/sign-out"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=$TOKEN"
```

```sh
ID=58c9b10638cd05fc5caa07ba TOKEN='YrNiW55CmLrhXR75TVeYMwOKBFOhqQ1e6FfmUCdgJWg=--wKFI9JQP1nfLCW7+4VluW1NUq45mK5slQtnSRf5IqXA=' sh scripts/sign-out.sh
```

response

```markdown
HTTP/1.1 204 No Content
```


### PATCH / change password

```sh
API="http://localhost:4741"
URL_PATH="/change-password"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Authorization: Token token=${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "passwords": {
      "old": "'"${OLDPW}"'",
      "new": "'"${NEWPW}"'"
    }
  }'
```

```sh
ID=58c9b10638cd05fc5caa07ba OLDPW='max' NEWPW='m' TOKEN='YrNiW55CmLrhXR75TVeYMwOKBFOhqQ1e6FfmUCdgJWg=--wKFI9JQP1nfLCW7+4VluW1NUq45mK5slQtnSRf5IqXA=' sh scripts/change-password.sh
```

response

```markdown
HTTP/1.1 204 No Content
```



### Surveys

 Verb  |  URI Pattern   | Controller#Action
:----: | :------------: | :---------------:
 POST  |   `/surveys`   |  `survey#create`
 GET   |   `/surveys`   |  `surveys#index`
 GET   | `/surveys/:id` |  `surveys#show`
PATCH  | `/surveys/:id` | `surveys#update`
DELETE | `/surveys/:id` | `surveys#destroy`


### POST / survey create

```sh
API="http://localhost:4741"
URL_PATH="/surveys"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "survey":{
      "title": "ananan",
      "questions": [{
        "problem": "sasjns"
      }, {
        "problem": "hello"
      }]
    }
  }'
```

```sh
TOKEN='YrNiW55CmLrhXR75TVeYMwOKBFOhqQ1e6FfmUCdgJWg=--wKFI9JQP1nfLCW7+4VluW1NUq45mK5slQtnSRf5IqXA=' TITLE='max survey' sh scripts/survey-create.sh
```

response

```markdown
HTTP/1.1 201 Created
```

```{
  "survey": {
    "title":"ananan",
    "questions":
    [{
      "problem":"sasjns",
      {
      "problem":"hello",
      }]
    }
  }
}
```


### GET / survey index

```sh
API="http://localhost:4741"
URL_PATH="/surveys"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Token token=${TOKEN}"
```

```sh
TOKEN='YrNiW55CmLrhXR75TVeYMwOKBFOhqQ1e6FfmUCdgJWg=--wKFI9JQP1nfLCW7+4VluW1NUq45mK5slQtnSRf5IqXA=' sh scripts/survey-index.sh
```

response

```markdown
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "surveys":[{
    "_id":"58c5a28ad4e8c23488fc1004",
    "title":"mnnjn",
    "_owner":"58c0413d824f6b688cd5824c",
    "questions":[{
      "problem":"sddsf",
      "_id":"58c608781c317b122abb0533",
      "answers":[{
        "response":true,
        "_id":"58c6095f1c317b122abb053c"
        },
        {
        "response":true,
        "_id":"58c609621c317b122abb053d"
        }
        }],
      },
      {
      "problem":"sddsf",
      "_id":"58c618e150dbea2177f44468",
      "answers":[]
      }]
      ]
}
```

### GET / survey show

```sh
API="http://localhost:4741"
URL_PATH="/surveys"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request GET \
  --header "Authorization: Token token=${TOKEN}" \
```

```sh
ID=58c5a28ad4e8c23488fc1004 TOKEN='YrNiW55CmLrhXR75TVeYMwOKBFOhqQ1e6FfmUCdgJWg=--wKFI9JQP1nfLCW7+4VluW1NUq45mK5slQtnSRf5IqXA=' sh scripts/survey-show.sh
```

response

```markdown
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "surveys":[{
    "_id":"58c5a28ad4e8c23488fc1004",
    "title":"mnnjn",
    "_owner":"58c0413d824f6b688cd5824c",
    "questions":[{
      "problem":"sddsf",
      "_id":"58c608781c317b122abb0533",
      "answers":[{
        "response":true,
        "_id":"58c6095f1c317b122abb053c"
      },
      {
        "response":true,
        "_id":"58c609621c317b122abb053d"
      }
    }],
  },
  {
    "problem":"sddsf",
    "_id":"58c618e150dbea2177f44468",
    "answers":[]
  }]
  ]
}
```

### PATCH / survey update

```sh
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
```

```sh
ID=58c5a28ad4e8c23488fc1004 TOKEN='YrNiW55CmLrhXR75TVeYMwOKBFOhqQ1e6FfmUCdgJWg=--wKFI9JQP1nfLCW7+4VluW1NUq45mK5slQtnSRf5IqXA=' sh scripts/survey-update.sh
```

response

```markdown
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "surveys":[{
    "_id":"58c5a28ad4e8c23488fc1004",
    "title":"somsagnggrgre",
    "_owner":"58c0413d824f6b688cd5824c",
    "questions": [{
      "problem":"Is it sunny?",
      "_id":"58c608781c317b122abb0533",
      "answers": [{
        "response":false
      },
      {
        "response":true
      }
      }],
    },
    {
      "problem":"Is it snowing?",
      "_id":"58c618e150dbea2177f44468",
      "answers": {
        "response": false
      }
    }]
  ]
}
```

#### PATCH / same survey, question create

```sh
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
```

```sh
ID=58c60cad1c317b122abb0544 TOKEN="YrNiW55CmLrhXR75TVeYMwOKBFOhqQ1e6FfmUCdgJWg=--wKFI9JQP1nfLCW7+4VluW1NUq45mK5slQtnSRf5IqXA=" sh scripts/survey-update.sh
```
response
```markdown
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "survey": {
    "title": "Anything",
    "questions": [{
      "problem": "Is it sunny?",
      "answers": [{
        "response": false
      }]
    }]
  }
  }
}
```

#### DELETE / survey destroy

```sh
API="http://localhost:4741"
URL_PATH="/surveys"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Token token=${TOKEN}"
```

```sh
ID=58cab2120ccb66307a4757d8 TOKEN='YrNiW55CmLrhXR75TVeYMwOKBFOhqQ1e6FfmUCdgJWg=--wKFI9JQP1nfLCW7+4VluW1NUq45mK5slQtnSRf5IqXA=' sh scripts/survey-destroy.sh
```

response

```markdown
HTTP/1.1 204 No Content
```


## Routes

 GET - Index, Show
 POST - Create
 PATCH - update
 DELETE - Destroy

 Users are only: ['index', 'show']
 Surveys are only: ['index', 'create', 'show', 'update', 'destroy']
