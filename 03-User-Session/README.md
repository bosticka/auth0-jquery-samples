# User Session Handling

This sample demonstrates how to add user session management to a jQuery application with Auth0.

## Running the App

Rename `auth0-variables.js.example` to `auth0-variables.js` and populate it with the Auth0 **client ID**, **domain**, and **callback URL**  for your application. You can find that information in the settings area for your application in the [Auth0 dashboard](https://manage.auth0.com). Make sure to add the callback URL (`http://localhost:3000/` if you are testing locally) in the **Allowed Callback URLs** section, as explained [here](https://auth0.com/docs/quickstart/spa/jquery/01-login#before-starting).

```bash
npm install -g serve
cd path/to/project
bower install
serve
```

The app will be served at `http://localhost:3000`.