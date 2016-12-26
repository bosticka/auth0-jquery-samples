# Calling an API

This sample demonstrates how to call a protected API endpoint from a jQuery application using Auth0.

## Running the App

Rename `auth0-variables.js.example` to `auth0-variables.js` and populate it with the Auth0 **client ID**, **domain**, and **callback URL**  for your application. You can find that information in the settings area for your application in the [Auth0 dashboard](https://manage.auth0.com). Make sure to add the callback URL (`http://localhost:3000/` if you are testing locally) in the **Allowed Callback URLs** section, as explained [here](https://auth0.com/docs/quickstart/spa/jquery/01-login#before-starting).

The sample provides a small Node.js serve which requires your Auth0 domain and the identifier for your API. To find the identifier for your API, first ensure that you have created on, and retrieve it from the [APIs section](https://manage.auth0.com/#/apis) of your Auth0 dashboard.

Rename the `.env.example` file to `.env` and provide your the domain for your application and the identifier for your API.

```bash
npm install -g serve
cd path/to/project
bower install
npm install
node server.js
serve
```

The app will be served at `http://localhost:3000`.