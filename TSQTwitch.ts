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

// > Twitch Api Auth Vars
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
let GameSelectUL = document.getElementById("GameSelect") as HTMLElement; // <ul> this ul is the same as stream select but instead of searching for streamers it searches categories
let StreamSelectUL = document.getElementById(
  "StreamSelect"
) as HTMLInputElement; // <ul> this ul is filled with li you click on to select a Stream

// Selected Drop Down Select <ul>'s
var SelectedCategoryStreamSelect = document.getElementById(
  "CategoryStreamSelect"
) as HTMLElement; // <ul> once you've selected a Category this is the ul thats filled with streams or VODs in that category
let SelectedStreamerSelect = document.getElementById(
  "SelectedStreamerSelect"
) as HTMLElement; // <ul> If you select Streamer first then this is the ul that will be used to select with

//#endregion

//#region Global Vars

// vars for Streamer Searching input
let LoginNameStreamers = Array(); // loginName of the streamer found. loginName is the same name thats in the URL of the channel
let StreamerBroadcast_id = Array(); // broadcast_id of the streamer found. used to find exsactly the streamer you selected.
let isLive = false as boolean; // bool for if the channel you wrote is live or not, makes TSQ collect the live stream into the selection

// Used when searching with a category
let GameIds = Array(); // Contains id for games
let GameTitles = Array(); // Contains titles for games

// Link and Title Holders
let Vid_Links = Array();
let Vid_Titles = Array();
let VidLink = ""; // Holds a Vod Id
let VidTitle = ""; // Holds a Vod title

let QueryURLs = Array(); // should hold url that can put into a link in when the form is submitted
let QueryStreamTitles = Array(); // should hold both stream vod titles should be added to along with QueryUrl

//#endregion

// > Event handlers

// Searching inputs
//#region Streamer Search input StreamerNameInput keyup Event handler
StreamerNameInput.addEventListener("keyup", async function (event: any) {
  StreamerBroadcast_id = Array(); // Whats shown in the Channel
  LoginNameStreamers = Array(); // Whats shown in the URL and what you search with
  isLive = false;
  await SearchApi(
    event,
    StreamSelectUL,
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
    GameSelectUL,
    `https://api.twitch.tv/helix/search/categories?query=${event.target.value}`,
    "could not find category",
    true
  );
});
//#endregion

// Select Drop Downs
//#region StreamSelect CLICK Event handler
StreamSelectUL.addEventListener("click", async function (event: any) {
  let Label = document.getElementById("GameLabel") as HTMLElement;
  await ClickApi(
    event, // Event / what they clicked on
    StreamSelectUL, // Affected Drop down
    GameNameInput, // Disable
    StreamerNameInput, // Set
    Label, // Label element
    `${event.target.innerText}'s Recent Streams (Categories)`, // Label msg
    true // Getting streams
  );
});
//#endregion

//#region GameSelect click Event handler
// Drop down made following this: https://w3collective.com/autocomplete-search-javascript/
// selects the element you click on and makes the the input in the Games select
GameSelectUL.addEventListener("click", async function (event: any) {
  let Label = document.getElementById("StreamerLabel") as HTMLElement;
  await ClickApi(
    event,
    GameSelectUL,
    StreamerNameInput,
    GameNameInput,
    Label,
    `Searching For Streamers Playing: ${event.target.innerText}`,
    false
  );
});
//#endregion

// Selected Event handlers. Only used after picking either a Category or Streamer.
//#region SelectedStreamerSelect Event handler
SelectedStreamerSelect.addEventListener("click", async function (event: any) {
  VidLink = Vid_Links[Vid_Titles.indexOf(event.target.innerText)];
  VidTitle = event.target.innerText; // text from Input
  GameNameInput.value = event.target.innerText;
  this.innerHTML = "";
});
//#endregion

//#region SelectedCategoryStreamSelect Event handler
SelectedCategoryStreamSelect.addEventListener(
  "click",
  async function (event: any) {
    VidTitle = event.target.innerText;
    VidLink = Vid_Links[Vid_Titles.indexOf(event.target.innerText)];
    StreamerNameInput.value = event.target.innerText;
    this.innerHTML = "";
  }
);
//#endregion

// Form
//#region Twitch form basiclly prints the stream you selected
TwitchForm.addEventListener("submit", async function (event: any) {
  event.preventDefault(); // stops page form reloading
  if (VidLink != "") {
    console.log(VidLink);

    // do more with the data later unsure what
    let StreamDataDone = document.getElementById(
      "StreamDataDone"
    ) as HTMLElement;
    let Atag = document.createElement("a") as HTMLElement;
    Atag.setAttribute("href", VidLink);
    Atag.innerHTML = VidTitle;
    Atag.setAttribute("target", "blank_");
    Atag.classList.add("m-2");
    StreamDataDone.classList.add("d-flex", "justify-content-center");
    StreamDataDone.append(Atag);
    
    let Iframe = document.getElementById("TwitchIFrame") as HTMLElement;
    Iframe.setAttribute("src",`https://player.twitch.tv/?channel=marinemammalrescue&parent=https://osca1877.aspitcloud.dk/`);
    Iframe.hidden=false;
  }
  else {
    // Sometimes the API makes a mistake? atleast thats what they say here
    // "there may be duplicate or missing streams, as viewers join and leave streams."
    // https://dev.twitch.tv/docs/api/reference#get-streams
    alert("Did not find a link. try running the program again")
  }
});
//#endregion

// > Functions

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

// Needs HttpCaller by proxy ValidateToken to be ran first
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
        GameTitles=Array();
        GameIds=Array();
        for (let index = 0; index < resp["data"].length; index++) {
          GameTitles.push(resp["data"][index]["name"]);
          GameIds.push(resp["data"][index]["id"]);
        }
        GameSelectUL.innerHTML="";
        for (let index = 0; index < GameTitles.length; index++) {
          GameSelectUL.innerHTML +=
            "<li class='pt-1 pb-1'>" + GameTitles[index] + "</li>";
        }
      }
      // if we're not getting game info instead gets streamer info
      else {
        LoginNameStreamers=Array();
        StreamerBroadcast_id=Array();
        for (let index = 0; index < resp["data"].length; index++) {
          LoginNameStreamers.push(resp["data"][index]["broadcaster_login"]);
          StreamerBroadcast_id.push(resp["data"][index]["id"]);
          isLive = resp["data"][index]["is_live"];
        }
        // Placing selectable dropdown menu on Website
        DropdownElement.innerHTML="";
        for (let index = 0; index < LoginNameStreamers.length; index++) {
          DropdownElement.innerHTML +=
            "<li class='pt-1 pb-1'>" + LoginNameStreamers[index] + "</li>";
        }
      }
    }
  }
}
//#endregion

// Needs SearchApi To be Ran first
//#region ClickApi(event, UlDropdown HTMLInputDisable, HTMLInputSet, LabelElement, LabelMsg, GetStreams:Bool)
// Ran every time First time you click on something on the Dropdowns
async function ClickApi(
  event: any,
  HTMLULEventElement: HTMLElement,
  HTMLInputElementDisable: HTMLInputElement,
  HTMLInputElementSet: HTMLInputElement,
  labelElement: HTMLElement,
  labelMSG: string,
  GetStreams: boolean
) {
  // SET UP
  // disabling and handling of Other Input field
  HTMLInputElementDisable.setAttribute("disabled", "true");
  HTMLInputElementDisable.setAttribute(
    "placeholder",
    "Select a VOD or STREAM you'd like to watch!"
  );
  labelElement.innerHTML = `${labelMSG}`; // set label with text
  let resp;

  // FUNCTIONS
  if (GetStreams == true) {
    // IF we want to get out streams
    // Gets recent VODS OR LIVE STREAMS from selected Streamer
    if (isLive == true) { // if we've detected that the channel is live
      resp = await HttpCaller(
        `https://api.twitch.tv/helix/streams?user_id=${
          StreamerBroadcast_id[
            LoginNameStreamers.indexOf(event.target.innerText)
          ]
        }`
      );
      // holds all the titles for the Videos (Streams, Vods, Highlights...)
      Vid_Titles.push("[🔴 LIVE] " + resp["data"][0]["title"]);
      // Makes a link to the channel, live streams does not have unique links
      Vid_Links.push(`https://www.twitch.tv/${resp["data"][0]["user_login"]}`);
    }
    resp = await HttpCaller(
      `https://api.twitch.tv/helix/videos?user_id=${
        StreamerBroadcast_id[LoginNameStreamers.indexOf(event.target.innerText)]
      }`
    );
    console.log(`https://api.twitch.tv/helix/videos?user_id=${
      StreamerBroadcast_id[LoginNameStreamers.indexOf(event.target.innerText)]
    }`);
    console.log(resp);
    if (resp.length == 0) {
      console.log("ERROR: user videos not found.");
    } 
    // Getting Vods of the channel
    else {
      for (let index = 0; index < resp["data"].length; index++) {
        Vid_Titles.push("[🔵 VOD] " + resp["data"][index]["title"]); // Title of VOD
        Vid_Links.push(resp["data"][index]["url"]); // Link to VOD
      }
      SelectedStreamerSelect.innerHTML = ""; // clears previous
      // Placing selectable dropdown menu on Website
      for (let index = 0; index < Vid_Titles.length; index++) {
        SelectedStreamerSelect.innerHTML +=
          "<li class='pt-1 pb-1'>" + Vid_Titles[index] + "</li>";
      }
    }
  }
  // IF we want to get Streamers from This category
  else {
    let resp = await HttpCaller(
      `https://api.twitch.tv/helix/streams?game_id=${
        GameIds[GameTitles.indexOf(event.target.innerText)]
      }`
    );
    console.log("Game search");
    console.log(resp);
    if (resp.length == 0) {
      StreamerNameInput.setAttribute("placeholder", "Could not find stream");
    }
    for (let index = 0; index < resp["data"].length; index++) {
      Vid_Titles.push("[🔴 Live] " + resp["data"][index]["title"]);
      // Streams does not have Id'ed Links, so this will just link to the channel
      Vid_Links.push(
        `https://www.twitch.tv/${resp["data"][index]["user_login"]}`
      );
    }
    //#region Maybe later VOD / Video Get. has a weird glitch and doesnt return anything.
    // here you would get the VODS from the categories but for some reason they return just fine no error but theres no data?
    // Odd.
    // console.log(`https://api.twitch.tv/helix/videos?game_id=${
    //   GameIds[GameTitles.indexOf(event.target.innerText)]
    // }`);
    // let resp2 = await HttpCaller(
    //   `https://api.twitch.tv/helix/videos?game_id=${
    //     GameIds[GameTitles.indexOf(event.target.innerText)]
    //   }`
    // );
    // console.log(resp2);
    //#endregion
    SelectedCategoryStreamSelect.innerHTML=""; // clear previous
    for (let index = 0; index < Vid_Titles.length; index++) {
      let li = document.createElement("li") as HTMLElement;
      li.classList.add("pt-1", "pb-1");
      li.innerHTML = Vid_Titles[index];
      SelectedCategoryStreamSelect.append(li);
    }
  }

  HTMLInputElementSet.value = event.target.innerText;; // sets the input with the selected value
  HTMLULEventElement.innerHTML = ""; // clears drop down menu. removing it
}
//#endregion