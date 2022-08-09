// Follow these steps to make an APP id if missing or broken https://dev.twitch.tv/docs/authentication/register-app#registering-your-app
// Warnings from Twitch
// IMPORTENT Treat client secrets as you would your password. you must keep it confidential and neer expose it to users, even in an obscured form.
// WARNING do not share client IDs among applications; each application must have its own client ID. sharing client IDs among applications may result in the suspension of your application's acces to the twitch API
let TwitchAppSecret = "";

// ! ! ! Make TSQ make its own app acess token and such later on ! ! !

// Client Id made the same place the App secret is
let Tclient_id = "tfh418mo6nmf2skaowwzubi8ca5z2t";
// App Acess you need to log in to make 
let LoginappAcess = "zp5o7iwyia1r0mnhbdr6lhmqbg2dox";
validateToken();
//#region ValidateToken, Validates the TappAcess Token and then calls fetchUser()




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
          // document.getElementById('output').textContent = 'This token is invalid: ' + resp.message;
          return;
        }
        //console.log(resp);
        console.log("Unexpected output with a status");
        //document.getElementById('output').textContent = 'Unexpected output with a status?';
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