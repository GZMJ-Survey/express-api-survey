# About

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


## Routes

 GET - Index, Show
 POST - Create
 PATCH - update
 DELETE - Destroy

 Users are only: ['index', 'show']
 Surveys are only: ['index', 'create', 'show', 'update', 'destroy']

 ## Links

 Front-end repo: https://github.com/GZMJ-Survey/client-survey
 Website: https://gzmj-survey.github.io/client-survey/
