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
}
let TwitchForm = document.getElementById("TwitchForm");
TwitchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (QueryName != "") {
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
var QueryName = "";
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
                console.log(resp);
                for (let index = 0; index < resp["data"].length; index++) {
                    Streamers.push(resp["data"][index]["broadcaster_login"]);
                    StreamerId.push(resp["data"][index]["id"]);
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
    const setValue = event.target.innerText;
    QueryName = StreamerId[Streamers.indexOf(event.target.innerText)];
    if (QueryGame == "") {
        let Label = document.getElementById("GameLabel");
        Label.innerHTML = `${setValue}'s Recently Streamed Categories`;
    }
    StreamerName.value = setValue;
    this.innerHTML = "";
});
let autocompleteGame = document.getElementById("GameNameInput");
var GameresultsHTML = document.getElementById("GameResults");
var QueryGame = "";
autocompleteGame.addEventListener("keyup", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        if (event.target.value.length > 3) {
            GameresultsHTML.style.display = "block";
            let resp;
            let Games = Array();
            if (QueryName != "") {
                resp = yield HttpCaller(`https://api.twitch.tv/helix/videos?user_id=${QueryName}&sort=time`);
                console.log(`https://api.twitch.tv/helix/videos?user_id=${QueryName}&sort=time`);
                console.log(resp);
                if (resp.length == 0) {
                    console.log("ERROR: user videos not found.");
                }
                else {
                    for (let index = 0; index < resp["data"].length; index++) {
                        Games.push(resp["data"][index]["title"]);
                    }
                }
            }
            else {
                resp = yield HttpCaller(`https://api.twitch.tv/helix/search/categories?query=${event.target.value}`);
                if (resp.length == 0) {
                    console.log("ERROR: No Caregories found");
                }
                else {
                    for (let index = 0; index < resp["data"].length; index++) {
                        Games.push(resp["data"][index]["name"]);
                    }
                }
                console.log(resp);
                GameresultsHTML.innerHTML = "";
                console.log(Games);
                for (let index = 0; index < Games.length; index++) {
                    GameresultsHTML.innerHTML +=
                        "<li class='pt-1 pb-1'>" + Games[index] + "</li>";
                }
            }
        }
    });
});
GameresultsHTML.addEventListener("click", function (event) {
    const setValue = event.target.innerText;
    QueryGame = setValue;
    if (QueryName == "") {
        let Label = document.getElementById("StreamerLabel");
        Label.innerHTML = `Streamers Playing: ${setValue}`;
    }
    autocompleteGame.value = setValue;
    this.innerHTML = "";
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
