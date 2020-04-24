To get this running:

Make sure you've:

* installed the infra stack
* installed each of the serverless, sam and (eventually) architect stacks

Then:

* Make a copy of `.env.local.sample` and save as `.env.local`
* Write down the outputs of infra in CloudFormation Stack outputs for the cognito pool id and client id, and what region you deploy it in
* Change the settings in .env.local to match those

Install your dependencies:

```text
npm install
```

Run it

```
npm start
```

Note: you may have to do a `npm rebuild node-sass` if you get that warning.

Technologies used:

* AWS Amplify React components
* React 16
* React Router
* Redux with Thunk middleware
* MUI CSS library
* `node-sass`

