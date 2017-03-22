## Links
DEPLOYED FRONT END: https://gzmj-survey.github.io/client-survey/

FRONT END REPO: https://github.com/GZMJ-Survey/client-survey

HEROKU: https://murmuring-meadow-73234.herokuapp.com/

## Team Members

Maxime Dore
Gabrielle Williams
Zhu Chen
Jana Ryndin

## Tasks

Make an app that can be used to create custom surveys and collect the responses
on a dashboard for that particular survey. Use MongoDB and Express to build an API and create 2 related models. Include all crud functions in RESTful API for the survey model




## User Stories

####As a user I want to:
-   Create a survey
-   Add questions to my sureys
-   Anwer anyone's survey questions
-   Have a statistic about surveys



# About

Thank you for visiting our back end repository! This app was built as part of the course's team project.

Our team has seen a survey as a great tool to gather information about business ideas - how well could be taken before even starting the business planning. Our back end repository allows it's front end to have authorization, and to create, read, update, and delete users, surveys, questions, and answers.

The model we have agreed on was that the user creates many surveys, survey creates many questions. Questions will have only 2 bulean answers that can be easily tracked
for statistics.

We designed this app with a friendly user flow while not forgetting a clean responsive design and functionality without user errors. As a result, a user can comfortably sign up/sign in, create an own survey or fill a survey of others. Each survey can have an unlimited number of closed type questions therefore the answers are always yes/no. We decided to go this direction for better collecting of responses from users.

This survey team project back end allows it's front end to have
authorization, and to create, read, update, and delete users, surveys,
questions, and answers. The surveys are created using a nested schema, which has questions nested inside the survey schema and answers nested inside of the quesstion schema. Having schemas nested like this made the project difficult because information was being stored in an array, inside an array, inside an array etc.


The survey model is as follows,
```
const answerSchema = new mongoose.Schema({
  response: {
    type: Boolean,
    required: false,
  }
});

const questionSchema = new mongoose.Schema({
  problem: {
    type: String,
    required: false,
  },
  answers: [answerSchema]
});

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questions: [questionSchema]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options) {
      let userId = (options.user && options.user._id) || false;
      ret.editable = userId && userId.equals(doc._owner);
      return ret;
    },
  },
});
```

The Create, Read, and Destroy actions were easy to tackle but our team worked on the update survey action for hours. To add questions to a survey and to submit answers for the survey require the update action, so our team needed to spend a lot of time on viewing how information that was stored in arrays inside of arrays could be accessed and also updated. We had to log different parts of the array to find out where the information was being stored and what piece of the array we needed.


We started with an update function like this,
```
const update = (req, res, next) => {
  // console.log('UPDATE');
    // disallow owner reassignment.

  Survey.findById(req.params.id, function(err, survey) {
    // Handle any possible database errors
    // console.log(survey.questions.length);
    // console.log((survey.questions).push(req.body.survey.questions));
    if (err) {
      res.status(422).send(err);
    } else {
      // Update each attribute with any possible attribute that may have been submitted in the body of the request
      // If that attribute isn't in the request body, default back to whatever it was before.

      // make an if to see if ownership is needed. If so, only create question

      // console.log(survey.questions[0].answers[0]);
      // console.log("survey answer is ", survey.questions[0].answers[0]);
      // console.log("request answer is ", req.body.survey.questions[0].answers);


      // console.log(survey._owner == req.user.id);

      if (survey._owner == req.user.id) {
        survey.questions[survey.questions.length] = req.body.survey.questions;

      } else {

        for (let i = 0; i < survey.questions.length; i++) {
          let newAnswers = survey.questions[i].answers.length;
          survey.questions[i].answers[newAnswers] = survey.questions[i].answers[newAnswers] || req.body.survey.questions[i].answers;
        }

      }
    }

    // Save the updated document back to the database
    survey.save(function(err, survey) {
      if (err) {
        res.status(500).send(err);
      }
      res.send(survey);
    });

  });
};
```
but this was causing errors and crashing the server because there were undefined pieces of the array we were trying to pull information from.
In the end, our final update function was as follows,

```
const update = (req, res, next) => {
    // disallow owner reassignment.

  Survey.findById(req.params.id, function(err, survey) {
    // Handle any possible database errors
    if (err) {
      res.status(422).send(err);
    } else {

      // Update each attribute with any possible attribute that may have been submitted in the body of the request
      // If that attribute isn't in the request body, default back to whatever it was before.
      if (survey._owner == req.user.id) {

        survey.questions[survey.questions.length] = req.body.survey.questions;

      } else {

        if ('survey' in req.body) {
          if ('questions' in req.body.survey) {

            if (survey.questions.length===req.body.survey.questions.length) {

              let allDefined = 0;
              for (let k = 0; k < survey.questions.length; k++) {
                if (req.body.survey.questions[k].answers.response!==undefined){
                  allDefined++;
                }
              }

              if (allDefined === survey.questions.length){
                for (let i = 0; i < survey.questions.length; i++) {
                  let newAnswers = survey.questions[i].answers.length;
                  survey.questions[i].answers[newAnswers] = survey.questions[i].answers[newAnswers] || req.body.survey.questions[i].answers;
                }
              }
            }

          }
        }

      }
    }

    // Save the updated document back to the database
    survey.save(function(err, survey) {
      if (err) {
        res.status(500).send(err);
      }
      res.send(survey);
    });

  });
};
```
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
