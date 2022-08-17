"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let Tclient_id = "tfh418mo6nmf2skaowwzubi8ca5z2t";
let AClient_id = "";
let LoginappAccess = "t6jkktho3qmuu2g2blzzljfgng03k3";
if (validateToken() == 1) {
    console.log("Token Validated Sucessfully");
}
else {
    console.log("Error Validating Token, Did you input the correct one?");
    console.log("The Token could also have expired: https://dev.twitch.tv/docs/authentication/register-app#registering-your-app");
}
let TwitchForm = document.getElementById("TwitchForm");
TwitchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (QueryNameID != "") {
    }
    else if (QueryGame != "") {
    }
    else {
        alert("Error No Category or Streamer Selected");
    }
    console.log(TwitchForm);
});
let StreamerName = document.getElementById("StreamerName");
let StreamResults = document.getElementById("StreamResults");
var Streamers = Array();
var StreamerId = Array();
var isLive = false;
var QueryNameID = "";
StreamerName.addEventListener("keyup", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        if (event.target.value.length > 3) {
            StreamResults.style.display = "block";
            let resp = yield HttpCaller(`https://api.twitch.tv/helix/search/channels?query=${event.target.value}`);
            console.log(resp);
            if (resp.length == 0) {
                console.log("no results for query");
            }
            else {
                StreamerId = Array();
                Streamers = Array();
                isLive = false;
                console.log(resp);
                for (let index = 0; index < resp["data"].length; index++) {
                    Streamers.push(resp["data"][index]["broadcaster_login"]);
                    StreamerId.push(resp["data"][index]["id"]);
                    isLive = resp["data"][index]["is_live"];
                }
                StreamResults.innerHTML = "";
                console.log(Streamers);
                for (let index = 0; index < Streamers.length; index++) {
                    StreamResults.innerHTML +=
                        "<li class='pt-1 pb-1'>" + Streamers[index] + "</li>";
                }
            }
        }
    });
});
StreamResults.addEventListener("click", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        const setValue = event.target.innerText;
        QueryNameID = StreamerId[Streamers.indexOf(event.target.innerText)];
        if (QueryGame == "") {
            autocompleteGame.setAttribute("disabled", "true");
            autocompleteGame.setAttribute("placeholder", "Select a VOD or STREAM you'd like to watch!");
            let Label = document.getElementById("GameLabel");
            Label.innerHTML = `${setValue}'s Recent Streams (Categories)`;
            let resp;
            let Games = Array();
            if (isLive == true) {
                resp = yield HttpCaller(`https://api.twitch.tv/helix/streams?user_id=${QueryNameID}`);
                Games.push("[🔴 LIVE] " + resp["data"][0]["title"]);
            }
            resp = yield HttpCaller(`https://api.twitch.tv/helix/videos?user_id=${QueryNameID}`);
            console.log(Games);
            if (resp.length == 0) {
                console.log("ERROR: user videos not found.");
            }
            else {
                for (let index = 0; index < resp["data"].length; index++) {
                    Games.push("[🔵 VOD] " + resp["data"][index]["title"]);
                }
                GameresultsHTML.innerHTML = "";
                for (let index = 0; index < Games.length; index++) {
                    GameresultsHTML.innerHTML +=
                        "<li class='pt-1 pb-1'>" + Games[index] + "</li>";
                }
            }
        }
        StreamerName.value = setValue;
        this.innerHTML = "";
    });
});
let autocompleteGame = document.getElementById("GameNameInput");
var GameresultsHTML = document.getElementById("GameResults");
var QueryGame = "";
var QueryGameID = "";
var GameNameIds = Array();
var GetGames = Array();
autocompleteGame.addEventListener("keyup", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        GameresultsHTML.style.display = "block";
        let resp;
        if (QueryNameID == "") {
            if (event.target.value.length > 3) {
                resp = yield HttpCaller(`https://api.twitch.tv/helix/search/categories?query=${event.target.value}`);
                if (resp.length == 0) {
                    GameresultsHTML.innerHTML +=
                        "<p class='pt-1 pb-1'>No Categories found...</p>";
                }
                else {
                    for (let index = 0; index < resp["data"].length; index++) {
                        GetGames.push(resp["data"][index]["name"]);
                        GameNameIds.push(resp["data"][index]["id"]);
                    }
                    GameresultsHTML.innerHTML = "";
                    for (let index = 0; index < GetGames.length; index++) {
                        GameresultsHTML.innerHTML +=
                            "<li class='pt-1 pb-1'>" + GetGames[index] + "</li>";
                    }
                }
            }
        }
    });
});
GameresultsHTML.addEventListener("click", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        const setValue = event.target.innerText;
        QueryGame = setValue;
        QueryGameID = GameNameIds[GetGames.indexOf(event.target.innerText)];
        if (QueryNameID == "") {
            let Label = document.getElementById("StreamerLabel");
            Label.innerHTML = `Searching For Streamers Playing: ${setValue}`;
            StreamerName.setAttribute("disabled", "true");
            StreamerName.setAttribute("placeholder", "Select a VOD or STREAM you'd like to watch!");
            var Games = Array();
            let resp = yield HttpCaller(`https://api.twitch.tv/helix/streams?game_id=${QueryGameID}`);
            console.log(resp);
            if (resp["data"].length >= 0) {
                StreamerName.setAttribute("placeholder", "Could not find stream");
            }
            for (let index = 0; index < resp["data"].length; index++) {
                Games.push("[🔴 Live] " + resp["data"][index]["title"]);
            }
            for (let index = 0; index < Games.length; index++) {
                let li = document.createElement("li");
                li.classList.add("pt-1", "pb-1");
                li.innerHTML = Games[index];
                StreamResults.append(li);
            }
        }
        autocompleteGame.value = setValue;
        this.innerHTML = "";
    });
});
function validateToken() {
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
function HttpCaller(HttpCall) {
    return __awaiter(this, void 0, void 0, function* () {
        const respon = yield fetch(`${HttpCall}`, {
            headers: {
                Authorization: "Bearer " + LoginappAccess,
                "Client-ID": AClient_id,
            },
        })
            .then((respon) => respon.json())
            .then((respon) => {
            return respon;
        })
            .catch((err) => {
            console.log(err);
            return err;
        });
        return respon;
    });
}
