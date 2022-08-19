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
// you need to make a App Access key through the Twitch CLI
//part 1 : https://dev.twitch.tv/docs/cli#twitch-cli,
//part 2: https://dev.twitch.tv/docs/cli/configure-command,
//part 3: https://dev.twitch.tv/docs/cli/token-command
// App Access keys lets programs do things an anonomus user would be able to aka someone not logged in, so it can search streams and clips but cannot get you your Stream key or Personal Infomation.
//#endregion
//#region More links to api calls used in TSQ
// https://dev.twitch.tv/docs/api/reference#get-videos // Offline streams + Highlights and more
// https://dev.twitch.tv/docs/api/reference#get-streams // Online streams sorted by most pobular
// https://dev.twitch.tv/docs/api/reference#get-users // Gets User Id from Username
// Response list found here: https://dev.twitch.tv/docs/api/reference#search-channels
//#endregion

// Twitch Api Auth Vars
let AClient_id = ""; // this is Set in ValidateToken()
let AppAcessToken = "t6jkktho3qmuu2g2blzzljfgng03k3" as string; // !! Each App Acess Token lasts 60 Days before needing to be remade !!

//#region Token validation and error handling
// Validates token and makes an alert if its not.
if (validateToken() == 1) {
  console.log("Token Validated Sucessfully");
} else {
  console.log("Error Validating Token, Did you input the correct one?");
  console.log(
    "The Token could also have expired: https://dev.twitch.tv/docs/authentication/register-app#registering-your-app"
  );
}
//#endregion

//#region HTML elements Elements like <input> <ul> Note not all some are only needed in functions and is made on spot

// form
let TwitchForm = document.getElementById("TwitchForm") as HTMLInputElement;

// Input
let StreamerNameInput = document.getElementById(
  "StreamerName"
) as HTMLInputElement; // <input> this is the imput you'd write your Streamer Name in like: marinemammalrescue
let GameNameInput = document.getElementById(
  "GameNameInput"
) as HTMLInputElement; // <input> searches categories for what you write in the input after 3 charaters though

// Drop down Search <ul>'s
let GameSelect = document.getElementById("GameSelect") as HTMLElement; // <ul> this ul is the same as stream select but instead of searching for streamers it searches categories
let StreamSelect = document.getElementById("StreamSelect") as HTMLInputElement; // <ul> this ul is filled with li you click on to select a Stream

// Selected Drop Down Select <ul>'s
var SelectedCategoryStreamSelect = document.getElementById(
  "CategoryStreamSelect"
) as HTMLElement; // <ul> once you've selected a Category this is the ul thats filled with streams or VODs in that category
let SelectedStreamerSelect = document.getElementById(
  "SelectedStreamerSelect"
) as HTMLElement; // <ul> If you select Streamer first then this is the ul that will be used to select with

//#endregion

//#region Global Vars
let SVODTitles = Array();
let VideoURL = Array();

// vars for Streamer Searching input
let LoginNameStreamers = Array(); // loginName of the streamer found. loginName is the same name thats in the URL of the channel
let StreamerBroadcast_id = Array(); // broadcast_id of the streamer found. used to find exsactly the streamer you selected.
let isLive = false as boolean; // bool for if the channel you wrote is live or not, makes TSQ collect the live stream into the selection

let GameIds = Array(); // Contains id for games
let GameTitles = Array(); // Contains titles for games
let StreamTitles = Array(); // Contains the Titles of streams
let StreamVODIDs = Array(); // Contains the IDs of the streams

// TwitchForm, Submit eventhandler
// basic Stuff
let QueryURLs = Array(); // should hold url that can put into a link in when the form is submitted
let QueryStreamVodTitle = Array(); // should hold both stream vod titles should be added to along with QueryUrl

let QueryNameID = ""; // the end result
let QueryGame = "";
let QueryGameID = "";
let QueryStreamerId = ""; // Holds broadcaster_id
let QueryVodURL = ""; // Holds a Vod Id
let QueryVodTitle = ""; // Holds a Vod title
let QueryStream = ""; // Should hold data to get a link to the channel thats streaming

//#endregion

// Event handlers

// Searching inputs
//#region Streamer Search input StreamerNameInput keyup Event handler
StreamerNameInput.addEventListener("keyup", async function (event: any) {
  StreamerBroadcast_id = Array(); // Whats shown in the Channel
  LoginNameStreamers = Array(); // Whats shown in the URL and what you search with
  isLive = false;
  await SearchApi(
    event,
    StreamSelect,
    `https://api.twitch.tv/helix/search/channels?query=${event.target.value}`,
    "Error: failed gathering streamers",
    false
  );
});
//#endregion

//#region GameNameInput keyup event handler
// These event handlers (2) handle gathering data from the Twitch api and selecting the name they want
// Note: Make the drop down menu disapier when you press ENTER and the inputted name equals one of the game names
// Api Ref: https://dev.twitch.tv/docs/api/reference#get-games
// Api Ref: https://dev.twitch.tv/docs/api/reference#search-categories // this one is in Use
GameNameInput.addEventListener("keyup", async function (event: any) {
  await SearchApi(
    event,
    GameSelect,
    `https://api.twitch.tv/helix/search/categories?query=${event.target.value}`,
    "could not find category",
    true
  );
});
//#endregion

async function ClickApi(
  event: any,
  HTMLEventElement: HTMLElement,
  GetStreams: boolean
) {
  const setValue = event.target.innerText;
  QueryNameID = StreamerBroadcast_id[LoginNameStreamers.indexOf(event.target.innerText)]; // Sets QueryName to ID
  GameNameInput.setAttribute("disabled", "true");
  GameNameInput.setAttribute(
    "placeholder",
    "Select a VOD or STREAM you'd like to watch!"
  );
  // Stops the Catagory label from saying "blank's recently streamed categories" when searching under a category
  let Label = document.getElementById("GameLabel") as HTMLElement;
  Label.innerHTML = `${setValue}'s Recent Streams (Categories)`;

  // Gets recent VODS OR LIVE STREAMS from selected Streamer
  let resp;
  if (isLive == true) {
    resp = await HttpCaller(
      `https://api.twitch.tv/helix/streams?user_id=${QueryNameID}`
    );
    console.log(resp);
    QueryStreamVodTitle.push("[🔴 LIVE] " + resp["data"][0]["title"]);
    QueryURLs.push(resp["data"][0]["url"]);
  }
  resp = await HttpCaller(
    `https://api.twitch.tv/helix/videos?user_id=${QueryNameID}`
  );
  console.log(resp);
  if (resp.length == 0) {
    console.log("ERROR: user videos not found.");
  } else {
    // response holds: Id (of game), Box_art_url, Name
    for (let index = 0; index < resp["data"].length; index++) {
      QueryStreamVodTitle.push("[🔵 VOD] " + resp["data"][index]["title"]);
      QueryURLs.push(resp["data"][index]["url"]);
    }
    SelectedStreamerSelect.innerHTML = ""; // clears previous
    // Placing selectable dropdown menu on Website
    for (let index = 0; index < QueryStreamVodTitle.length; index++) {
      SelectedStreamerSelect.innerHTML +=
        "<li class='pt-1 pb-1'>" + QueryStreamVodTitle[index] + "</li>";
    }
  }
  StreamerNameInput.value = setValue;
  HTMLEventElement.innerHTML = "";
}

// When Clicked Drop down menu
//#region StreamSelect CLICK Event handler
StreamSelect.addEventListener("click", async function (event: any) {
  ClickApi(event,StreamSelect, false);
});
//#endregion

//#region GameSelect click Event handler
// Drop down made following this: https://w3collective.com/autocomplete-search-javascript/
// selects the element you click on and makes the the input in the Games select
GameSelect.addEventListener("click", async function (event: any) {
  const setValue = event.target.innerText;
  QueryGame = setValue; // used to test if a Game has been selected to stop labels from changing
  QueryGameID = GameIds[GameTitles.indexOf(event.target.innerText)];
  if (QueryNameID == "") {
    // Setup changing label and Locking Streamer Search
    let Label = document.getElementById("StreamerLabel") as HTMLElement;
    Label.innerHTML = `Searching For Streamers Playing: ${setValue}`;
    StreamerNameInput.setAttribute("disabled", "true");
    StreamerNameInput.setAttribute(
      "placeholder",
      "Select a VOD or STREAM you'd like to watch!"
    );

    // Getting of Streams and if that fails Get VODS or Highlights

    let resp = await HttpCaller(
      `https://api.twitch.tv/helix/streams?game_id=${QueryGameID}`
    );
    console.log(resp);
    if (resp.length == 0) {
      StreamerNameInput.setAttribute("placeholder", "Could not find stream");
    }
    for (let index = 0; index < resp["data"].length; index++) {
      StreamTitles.push("[🔴 Live] " + resp["data"][index]["title"]);
      StreamVODIDs.push(resp["data"][index]["user_id"]);
    }
    for (let index = 0; index < StreamTitles.length; index++) {
      let li = document.createElement("li") as HTMLElement;
      li.classList.add("pt-1", "pb-1");
      li.innerHTML = StreamTitles[index];
      SelectedCategoryStreamSelect.append(li);
    }
    //#region This should be where we call another Function to Gather missing streams by trying to search for the game as VODS or Highlights

    //#endregion
  }
  GameNameInput.value = setValue;
  this.innerHTML = "";
});
//#endregion

// Selected Event handlers. Only used after picking either a Category or Streamer.
//#region SelectedStreamerSelect Event handler
SelectedStreamerSelect.addEventListener("click", async function (event: any) {
  const setValue = event.target.innerText;
  QueryVodURL = VideoURL[SVODTitles.indexOf(setValue)];
  QueryVodTitle = event.target.innerText;
  GameNameInput.value = setValue;
  this.innerHTML = "";
});
//#endregion

//#region SelectedCategoryStreamSelect Event handler
SelectedCategoryStreamSelect.addEventListener(
  "click",
  async function (event: any) {
    const setValue = event.target.innerText;
    console.log(StreamVODIDs[StreamTitles.indexOf(setValue)]);
    QueryStreamerId = StreamVODIDs[StreamTitles.indexOf(setValue)];

    StreamerNameInput.value = setValue;
    this.innerHTML = "";
  }
);
//#endregion

// Form
//#region Twitch form submit eventhandler
TwitchForm.addEventListener("submit", async function (event: any) {
  event.preventDefault(); // stops page form reloading
  if (QueryStreamerId != "") {
    // Gets a link to a channel use if the channel is LIVE
    let resp = await HttpCaller(
      // Gets closest to written input like searching on twitch
      `https://api.twitch.tv/helix/channels?broadcaster_id=${QueryStreamerId}`
    );
    console.log(resp);
    // do more with the data later unsure what
    let StreamDataDone = document.getElementById(
      "StreamDataDone"
    ) as HTMLElement;
    let Atag = document.createElement("a") as HTMLElement;
    Atag.setAttribute(
      "href",
      `https://www.twitch.tv/${resp["data"][0]["broadcaster_login"]}`
    );
    Atag.innerHTML = resp["data"][0]["title"];
    Atag.setAttribute("target", "blank_");
    Atag.classList.add("m-2");
    StreamDataDone.classList.add("d-flex", "justify-content-center");
    StreamDataDone.append(Atag);
  } else if (QueryStream != "") {
    // Get the channel Link as a Live Videoes does not have an ID
  } else if (QueryVodURL != "") {
    console.log(QueryVodURL);

    // do more with the data later unsure what
    let StreamDataDone = document.getElementById(
      "StreamDataDone"
    ) as HTMLElement;
    let Atag = document.createElement("a") as HTMLElement;
    Atag.setAttribute("href", QueryVodURL);
    Atag.innerHTML = QueryVodTitle;
    Atag.setAttribute("target", "blank_");
    Atag.classList.add("m-2");
    StreamDataDone.classList.add("d-flex", "justify-content-center");
    StreamDataDone.append(Atag);
  } else {
  }
});
//#endregion

// Functions

//#region validateToken() Validates Token if sucessful returns 1 if not 0
// Calls the Twitch api with Out App Acess Token and returns a ClientId and tells us if the App Acess Token is Valid or Not
function validateToken(): number {
  fetch("https://id.twitch.tv/oauth2/validate", {
    headers: {
      Authorization: "Bearer " + AppAcessToken,
    },
  })
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status) {
        if (resp.status == 401) {
          console.log("This token is invalid ... " + resp.message);
          return 0;
        }
        console.log("Unexpected output with a status");
        return 0;
      }
      if (resp.client_id) {
        AClient_id = resp.client_id;
        //console.log(Tclient_id);
        return 1;
      }
      console.log("unexpected Output");
      return 0;
    })
    .catch((err) => {
      console.log(err);
      return 0;
    });
  return 1;
}
//#endregion

// needs ValidateToken() to be ran first
//#region [async] HttpCaller(HttpCall) multipurpose HttpCaller calls the Httpcall returns The Response if Success if not: 0
// This makes most calls, intead of a lot of differnt functions this does them instead.
// TO find out what is called look where its called as the HTTPCALL would need to be sent over.
async function HttpCaller(HttpCall: string) {
  const respon = await fetch(`${HttpCall}`, {
    headers: {
      Authorization: "Bearer " + AppAcessToken,
      "Client-ID": AClient_id, // can also use Tclient_id. !! comment out Tclient if not being used !!
    },
  })
    .then((respon) => respon.json())
    .then((respon) => {
      // Return Response on Success
      return respon;
    })
    .catch((err) => {
      // Print Error if any. And return 0
      console.log(err);
      return err;
    });
  return respon;
}
//#endregion

//#region SearchApi(event, UlDropdown, HTTPCALL, ErrorMsg, Getgame:Bool)
// This is called every keyup in the Category or Streamer input.
// calls apropriate httpcalls on what you type
async function SearchApi(
  event: any,
  DropdownElement: HTMLElement, // <ul>
  Httpcall: string,
  ErrorMsg: string,
  GetGame: boolean // false does not get game info.
) {
  // run only if over 3 characters
  if (event.target.value.length > 3) {
    DropdownElement.style.display = "block";
    let resp = await HttpCaller(Httpcall);
    console.log(resp);
    // If httpcall returns No data
    if (resp.length == 0) {
      DropdownElement.innerHTML = ErrorMsg;
    }
    // if http call Does return data
    else {
      DropdownElement.innerHTML = ""; // clears previous
      // if we're getting game info
      if (GetGame == true) {
        for (let index = 0; index < resp["data"].length; index++) {
          GameTitles.push(resp["data"][index]["name"]);
          GameIds.push(resp["data"][index]["id"]);
        }
        for (let index = 0; index < GameTitles.length; index++) {
          GameSelect.innerHTML +=
            "<li class='pt-1 pb-1'>" + GameTitles[index] + "</li>";
        }
      }
      // if we're not getting game info instead gets streamer info
      else {
        for (let index = 0; index < resp["data"].length; index++) {
          LoginNameStreamers.push(resp["data"][index]["broadcaster_login"]);
          StreamerBroadcast_id.push(resp["data"][index]["id"]);
          isLive = resp["data"][index]["is_live"];
        }
        // Placing selectable dropdown menu on Website
        for (let index = 0; index < LoginNameStreamers.length; index++) {
          DropdownElement.innerHTML +=
            "<li class='pt-1 pb-1'>" + LoginNameStreamers[index] + "</li>";
        }
      }
    }
  }
}
//#endregion

//#region GetResults: NOT IN USE, later this will sort games by how close it is and how pubular it is
// Sorts to closest result from Twitch results but Twitch does it "Good enough" already. doesnt make sense to use this yet.
//let results = getResults(event.target.value, Games);
// function getResults(input: string, Games: Array<string>) {
//   const results = [];
//   for (let i = 0; i < Games.length; i++) {
//     if (input === Games[i].slice(0, input.length)) {
//       results.push(Games[i]);
//     }
//   }
//   return results;
// }
//#endregion
