//!! App tokens can expire !!
//#region Twitch App Secret Explanation
// Follow these steps to make an APP id if missing or broken https://dev.twitch.tv/docs/authentication/register-app#registering-your-app
// Warnings from Twitch
// IMPORTENT Treat client secrets as you would your password. you must keep it confidential and neer expose it to users, even in an obscured form.
// WARNING do not share client IDs among applications; each application must have its own client ID. sharing client IDs among applications may result in the suspension of your application's acces to the twitch API
// we dont need a secret here, but its worth an explanation as its needed in the Twitch Cli
//let TwitchAppSecret = "";
//#endregion
//#region Twitch Client Id Explanation
// Client Id made the same place the App secret is
// Client Ids are Keys are needed to send along to the twitch api on some Api calls. it can also be made through the Twitch Dev Console.
// https://dev.twitch.tv/docs/authentication/register-app#registering-your-app
// You can also get your Client Id through a Api call shown in: validateToken(){}
// That will return a working Client Id
//#endregion
//#region App Access Token Explanation 
// App Acess you need to log in to make 
// you need to make a Loginappacess key through the Twitch CLI 
//part 1 : https://dev.twitch.tv/docs/cli#twitch-cli, 
//part 2: https://dev.twitch.tv/docs/cli/configure-command, 
//part 3: https://dev.twitch.tv/docs/cli/token-command
// App Acess keys lets programs do things an anonomus user would be able to aka someone not logged in, so it can search streams and clips but cannot get you your Stream key or Personal Infomation.
//#endregion
let Tclient_id = "" as string; // Set in ValidateToken()
let LoginappAcess = "t6jkktho3qmuu2g2blzzljfgng03k3" as string; // !! Each App Acess Token lasts 60 Days before needing to be remade !!

validateToken();





function validateToken() {
  fetch("https://id.twitch.tv/oauth2/validate", {
    headers: {
      Authorization: "Bearer " + LoginappAcess,
    },
  })
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp);
      if (resp.status) {
        if (resp.status == 401) {
          console.log("This token is invalid ... " + resp.message);
          return;
        }
        console.log(resp);
        console.log("Unexpected output with a status");
        return;
      }
      if (resp.client_id) {
        Tclient_id = resp.client_id;
        console.log("Token is valid");
        return;
      }
      console.log("unexpected Output");
    })
    .catch((err) => {
      console.log(err);
      console.log("An Error Occured loading token data");
    });
}

//#endregion