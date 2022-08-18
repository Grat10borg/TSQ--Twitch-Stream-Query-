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

let Tclient_id = "tfh418mo6nmf2skaowwzubi8ca5z2t" as string; // Set in ValidateToken()
let AClient_id = "";
let LoginappAccess = "t6jkktho3qmuu2g2blzzljfgng03k3" as string; // !! Each App Acess Token lasts 60 Days before needing to be remade !!

if (validateToken() == 1) {
  console.log("Token Validated Sucessfully");
} else {
  console.log("Error Validating Token, Did you input the correct one?");
  console.log(
    "The Token could also have expired: https://dev.twitch.tv/docs/authentication/register-app#registering-your-app"
  );
}

// Event handlers

// https://dev.twitch.tv/docs/api/reference#get-videos // Offline streams + Highlights and more
// https://dev.twitch.tv/docs/api/reference#get-streams // Online streams sorted by most pobular
var QueryStreamerId = ""; // Holds broadcaster_id
var QueryVodURL = ""; // Holds Vod Id
var QueryTitle = "";
var QueryStream = ""; // Should hold data to get a link to the channel thats streaming
let TwitchForm = document.getElementById("TwitchForm") as HTMLInputElement;
TwitchForm.addEventListener("submit", async function (event: any) {
  event.preventDefault();

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
    Atag.setAttribute(
      "href",
      QueryVodURL
    );
    Atag.innerHTML = QueryTitle;
    Atag.setAttribute("target", "blank_");
    Atag.classList.add("m-2");
    StreamDataDone.classList.add("d-flex", "justify-content-center");
    StreamDataDone.append(Atag);
  } else {
  }
});

//#region Streamer Search drop down menu
// https://dev.twitch.tv/docs/api/reference#get-users // Gets User Id from Username
let StreamerName = document.getElementById("StreamerName") as HTMLInputElement; // <input>
let StreamResults = document.getElementById(
  "StreamResults"
) as HTMLInputElement; // <ul>
let SelectedStreamerSelect = document.getElementById("SelectedStreamerSelect") as HTMLElement;
var Streamers = Array(); // Streamers is the name in the URL aka the original unique name
var StreamerId = Array(); // Id of the Streamer
var isLive = false as boolean;
var QueryNameID = ""; // the end result
StreamerName.addEventListener("keyup", async function (event: any) {
  if (event.target.value.length > 3) {
    StreamResults.style.display = "block";
    // Search normally
    let resp = await HttpCaller(
      // Gets closest to written input like searching on twitch
      `https://api.twitch.tv/helix/search/channels?query=${event.target.value}`
    );
    console.log(resp);
    if (resp.length == 0) {
      // NOT tested, its kinda hard to make fake error here
      console.log("no results for query");
    } else {
      StreamerId = Array(); // Whats shown in the Channel
      Streamers = Array(); // Whats shown in the URL and what you search with
      isLive = false;
      // Response list found here: https://dev.twitch.tv/docs/api/reference#search-channels
      console.log(resp);
      for (let index = 0; index < resp["data"].length; index++) {
        Streamers.push(resp["data"][index]["broadcaster_login"]);
        StreamerId.push(resp["data"][index]["id"]);
        isLive = resp["data"][index]["is_live"];
      }

      StreamResults.innerHTML = ""; // clears previous
      console.log(Streamers);
      // Placing selectable dropdown menu on Website
      for (let index = 0; index < Streamers.length; index++) {
        StreamResults.innerHTML +=
          "<li class='pt-1 pb-1'>" + Streamers[index] + "</li>";
      }
    }
  }
});

var SVODTitles = Array();
var VideoURL = Array();
StreamResults.addEventListener("click", async function (event: any) {
  console.log("Clicked in Stream Results");
  const setValue = event.target.innerText;
  QueryNameID = StreamerId[Streamers.indexOf(event.target.innerText)]; // Sets QueryName to ID
  if (QueryGame == "") {
    autocompleteGame.setAttribute("disabled", "true");
    autocompleteGame.setAttribute(
      "placeholder",
      "Select a VOD or STREAM you'd like to watch!"
    );
    // Stops the Catagory label from saying "blank's recently streamed categories" when searching under a category
    let Label = document.getElementById("GameLabel") as HTMLElement;
    Label.innerHTML = `${setValue}'s Recent Streams (Categories)`;

    // Gets recent VODS OR LIVE STREAMS from selected Streamer
    let resp;
    // NOTE: place in function for use with the submit button
    if (isLive == true) {
      resp = await HttpCaller(
        `https://api.twitch.tv/helix/streams?user_id=${QueryNameID}`
      );
      SVODTitles.push("[🔴 LIVE] " + resp["data"][0]["title"]);
      // Live Videos dont have ids somehow make a link to the channel when theres a Live stream
    }
    resp = await HttpCaller(
      `https://api.twitch.tv/helix/videos?user_id=${QueryNameID}`
    );
    console.log(resp);
    if (resp.length == 0) {
      // NOT tested, its kinda hard to make fake error here
      console.log("ERROR: user videos not found.");
    } else {
      // response holds: Id (of game), Box_art_url, Name
      for (let index = 0; index < resp["data"].length; index++) {
        SVODTitles.push("[🔵 VOD] " + resp["data"][index]["title"]);
        VideoURL.push(resp["data"][index]["url"]);
      }
      SelectedStreamerSelect.innerHTML = ""; // clears previous
      // Placing selectable dropdown menu on Website
      for (let index = 0; index < SVODTitles.length; index++) {
        SelectedStreamerSelect.innerHTML +=
          "<li class='pt-1 pb-1'>" + SVODTitles[index] + "</li>";
      }
    }
  }
  StreamerName.value = setValue;
  this.innerHTML = "";
});
//#endregion

//#region Game Search drop down menu
// These event handlers (2) handle gathering data from the Twitch api and selecting the name they want
// Note: Make the drop down menu disapier when you press ENTER and the inputted name equals one of the game names
// Api Ref: https://dev.twitch.tv/docs/api/reference#get-games
// Api Ref: https://dev.twitch.tv/docs/api/reference#search-categories // this one is in Use
let autocompleteGame = document.getElementById(
  "GameNameInput"
) as HTMLInputElement; // <input>
var GameresultsHTML = document.getElementById("GameResults") as HTMLElement; // <ul>
var QueryGame = "";
var QueryGameID = "";
var GameNameIds = Array();
var GetGames = Array();
// Ran every key press
autocompleteGame.addEventListener("keyup", async function (event: any) {
  GameresultsHTML.style.display = "block";
  let resp;
  if (QueryNameID == "") {
    if (event.target.value.length > 3) {
      resp = await HttpCaller(
        // Gets closest to written input like searching on twitch
        `https://api.twitch.tv/helix/search/categories?query=${event.target.value}`
      ); // clears previous
      if (resp.length == 0) {
        // NOT tested, its kinda hard to make fake error here
        GameresultsHTML.innerHTML +=
          "<p class='pt-1 pb-1'>No Categories found...</p>";
      } else {
        // response holds: Id (of game), Box_art_url, Name
        for (let index = 0; index < resp["data"].length; index++) {
          GetGames.push(resp["data"][index]["name"]);
          GameNameIds.push(resp["data"][index]["id"]);
        }
        GameresultsHTML.innerHTML = "";
        // Placing selectable dropdown menu on Website
        for (let index = 0; index < GetGames.length; index++) {
          GameresultsHTML.innerHTML +=
            "<li class='pt-1 pb-1'>" + GetGames[index] + "</li>";
        }
      }
    }
  }
});

var Streams = Array(); // Contains the Titles of streams
var StreamerIds = Array(); // Contains the IDs of the streams
var categoryUl = document.getElementById("CategoryStreamSelect") as HTMLElement;
// Drop down made following this: https://w3collective.com/autocomplete-search-javascript/
// selects the element you click on and makes the the input in the Games select
GameresultsHTML.addEventListener("click", async function (event: any) {
  const setValue = event.target.innerText;
  QueryGame = setValue; // used to test if a Game has been selected to stop labels from changing
  QueryGameID = GameNameIds[GetGames.indexOf(event.target.innerText)];
  if (QueryNameID == "") {
    // Setup changing label and Locking Streamer Search
    let Label = document.getElementById("StreamerLabel") as HTMLElement;
    Label.innerHTML = `Searching For Streamers Playing: ${setValue}`;
    StreamerName.setAttribute("disabled", "true");
    StreamerName.setAttribute(
      "placeholder",
      "Select a VOD or STREAM you'd like to watch!"
    );

    // Getting of Streams and if that fails Get VODS or Highlights

    let resp = await HttpCaller(
      `https://api.twitch.tv/helix/streams?game_id=${QueryGameID}`
    );
    console.log(resp);
    if (resp.length == 0) {
      StreamerName.setAttribute("placeholder", "Could not find stream");
    }
    for (let index = 0; index < resp["data"].length; index++) {
      Streams.push("[🔴 Live] " + resp["data"][index]["title"]);
      StreamerIds.push(resp["data"][index]["user_id"]);
    }
    for (let index = 0; index < Streams.length; index++) {
      let li = document.createElement("li") as HTMLElement;
      li.classList.add("pt-1", "pb-1");
      li.innerHTML = Streams[index];
      categoryUl.append(li);
    }
    //#region This should be where we call another Function to Gather missing streams by trying to search for the game as VODS or Highlights
    // if (resp["data"].length < 20) {
    //   let MissingVid = Math.abs(resp["data"].length - 20);
    //   let resp2 = await HttpCaller(
    //     `https://api.twitch.tv/helix/videos?game_id=${QueryGameID}`
    //   );
    //   console.log(`https://api.twitch.tv/helix/videos?game_id=${QueryGameID}`);
    //   console.log(resp2);
    //   for (let index = 0; index < resp2["data"].length; index++) {
    //     // Tests type of Video
    //     if (resp2["data"][index]["type"] == "highlight") {
    //       Games.push("[🟨 Highlight] " + resp2["data"][index]["title"]);
    //     } else {
    //       Games.push("[🔵 VOD] " + resp2["data"][index]["title"]);
    //     }
    //   }
    //   for (let index = 0; index < Games.length; index++) {
    //     let li = document.createElement("li") as HTMLElement;
    //     li.classList.add("pt-1", "pb-1");
    //     li.innerHTML=Games[index];
    //     StreamResults.append(li);
    //   }
    // }
    //#endregion
  }

  // When you click
  autocompleteGame.value = setValue;
  this.innerHTML = "";
});

SelectedStreamerSelect.addEventListener("click", async function (event: any) {
  const setValue = event.target.innerText;
  QueryVodURL = VideoURL[SVODTitles.indexOf(setValue)];
  QueryTitle = event.target.innerText;
  autocompleteGame.value = setValue;
  this.innerHTML = "";
});

categoryUl.addEventListener("click", async function (event: any) {
  const setValue = event.target.innerText;
  console.log(StreamerIds[Streams.indexOf(setValue)]);
  QueryStreamerId = StreamerIds[Streams.indexOf(setValue)];

  StreamerName.value = setValue;
  this.innerHTML = "";
});
//#endregion

// Functions

//#region validateToken() Validates Token if sucessful returns 1 if not 0
// Calls the Twitch api with Out App Acess Token and returns a ClientId and tells us if the App Acess Token is Valid or Not
function validateToken(): number {
  fetch("https://id.twitch.tv/oauth2/validate", {
    headers: {
      Authorization: "Bearer " + LoginappAccess,
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
      Authorization: "Bearer " + LoginappAccess,
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
