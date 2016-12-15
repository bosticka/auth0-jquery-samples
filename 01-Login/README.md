# Login

This is a small app that demonstrates how easy it is to login users by using `Lock Widget`.

You can read a quickstart guide for this sample [here](https://auth0.com/docs/quickstart/spa/jquery/01-login).

## Before running the example

Rename `auth0-variables.js.example` to `auth0-variables.js` and make sure that you have both the `Client ID` and `Client Secret`in it. You can find that information in the settings section of your Auth0 Client. Also, make sure to add the callback URL (`http://localhost:3000/` if you are testing locally) in the **Allowed Callback URLs** section, as explained [here](https://auth0.com/docs/quickstart/spa/jquery/01-login#before-starting)

## Running the example

In order to run the example you need to just start a server. What we suggest is doing the following:

1. Install node
2. run `npm install -g serve`
3. run `serve` in the directory of the project.

Go to `http://localhost:3000` and you'll see the app running