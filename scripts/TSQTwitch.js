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
let AClient_id = "";
let AppAcessToken = "t6jkktho3qmuu2g2blzzljfgng03k3";
if (validateToken() == 1) {
    console.log("Token Validated Sucessfully");
}
else {
    console.log("Error Validating Token, Did you input the correct one?");
    console.log("The Token could also have expired: https://dev.twitch.tv/docs/authentication/register-app#registering-your-app");
}
let TwitchForm = document.getElementById("TwitchForm");
let StreamerNameInput = document.getElementById("StreamerName");
let GameNameInput = document.getElementById("GameNameInput");
let GameSelect = document.getElementById("GameSelect");
let StreamSelect = document.getElementById("StreamSelect");
var SelectedCategoryStreamSelect = document.getElementById("CategoryStreamSelect");
let SelectedStreamerSelect = document.getElementById("SelectedStreamerSelect");
let SVODTitles = Array();
let VideoURL = Array();
let LoginNameStreamers = Array();
let StreamerBroadcast_id = Array();
let isLive = false;
let GameIds = Array();
let GameTitles = Array();
let StreamTitles = Array();
let StreamVODIDs = Array();
let QueryURLs = Array();
let QueryStreamVodTitle = Array();
let QueryNameID = "";
let QueryGame = "";
let QueryGameID = "";
let QueryStreamerId = "";
let QueryVodURL = "";
let QueryVodTitle = "";
let QueryStream = "";
StreamerNameInput.addEventListener("keyup", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        StreamerBroadcast_id = Array();
        LoginNameStreamers = Array();
        isLive = false;
        yield SearchApi(event, StreamSelect, `https://api.twitch.tv/helix/search/channels?query=${event.target.value}`, "Error: failed gathering streamers", false);
    });
});
GameNameInput.addEventListener("keyup", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        yield SearchApi(event, GameSelect, `https://api.twitch.tv/helix/search/categories?query=${event.target.value}`, "could not find category", true);
    });
});
function ClickApi(event, HTMLEventElement, GetStreams) {
    return __awaiter(this, void 0, void 0, function* () {
        const setValue = event.target.innerText;
        QueryNameID = StreamerBroadcast_id[LoginNameStreamers.indexOf(event.target.innerText)];
        GameNameInput.setAttribute("disabled", "true");
        GameNameInput.setAttribute("placeholder", "Select a VOD or STREAM you'd like to watch!");
        let Label = document.getElementById("GameLabel");
        Label.innerHTML = `${setValue}'s Recent Streams (Categories)`;
        let resp;
        if (isLive == true) {
            resp = yield HttpCaller(`https://api.twitch.tv/helix/streams?user_id=${QueryNameID}`);
            console.log(resp);
            QueryStreamVodTitle.push("[🔴 LIVE] " + resp["data"][0]["title"]);
            QueryURLs.push(resp["data"][0]["url"]);
        }
        resp = yield HttpCaller(`https://api.twitch.tv/helix/videos?user_id=${QueryNameID}`);
        console.log(resp);
        if (resp.length == 0) {
            console.log("ERROR: user videos not found.");
        }
        else {
            for (let index = 0; index < resp["data"].length; index++) {
                QueryStreamVodTitle.push("[🔵 VOD] " + resp["data"][index]["title"]);
                QueryURLs.push(resp["data"][index]["url"]);
            }
            SelectedStreamerSelect.innerHTML = "";
            for (let index = 0; index < QueryStreamVodTitle.length; index++) {
                SelectedStreamerSelect.innerHTML +=
                    "<li class='pt-1 pb-1'>" + QueryStreamVodTitle[index] + "</li>";
            }
        }
        StreamerNameInput.value = setValue;
        HTMLEventElement.innerHTML = "";
    });
}
StreamSelect.addEventListener("click", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        ClickApi(event, StreamSelect, false);
    });
});
GameSelect.addEventListener("click", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        const setValue = event.target.innerText;
        QueryGame = setValue;
        QueryGameID = GameIds[GameTitles.indexOf(event.target.innerText)];
        if (QueryNameID == "") {
            let Label = document.getElementById("StreamerLabel");
            Label.innerHTML = `Searching For Streamers Playing: ${setValue}`;
            StreamerNameInput.setAttribute("disabled", "true");
            StreamerNameInput.setAttribute("placeholder", "Select a VOD or STREAM you'd like to watch!");
            let resp = yield HttpCaller(`https://api.twitch.tv/helix/streams?game_id=${QueryGameID}`);
            console.log(resp);
            if (resp.length == 0) {
                StreamerNameInput.setAttribute("placeholder", "Could not find stream");
            }
            for (let index = 0; index < resp["data"].length; index++) {
                StreamTitles.push("[🔴 Live] " + resp["data"][index]["title"]);
                StreamVODIDs.push(resp["data"][index]["user_id"]);
            }
            for (let index = 0; index < StreamTitles.length; index++) {
                let li = document.createElement("li");
                li.classList.add("pt-1", "pb-1");
                li.innerHTML = StreamTitles[index];
                SelectedCategoryStreamSelect.append(li);
            }
        }
        GameNameInput.value = setValue;
        this.innerHTML = "";
    });
});
SelectedStreamerSelect.addEventListener("click", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        const setValue = event.target.innerText;
        QueryVodURL = VideoURL[SVODTitles.indexOf(setValue)];
        QueryVodTitle = event.target.innerText;
        GameNameInput.value = setValue;
        this.innerHTML = "";
    });
});
SelectedCategoryStreamSelect.addEventListener("click", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        const setValue = event.target.innerText;
        console.log(StreamVODIDs[StreamTitles.indexOf(setValue)]);
        QueryStreamerId = StreamVODIDs[StreamTitles.indexOf(setValue)];
        StreamerNameInput.value = setValue;
        this.innerHTML = "";
    });
});
TwitchForm.addEventListener("submit", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        if (QueryStreamerId != "") {
            let resp = yield HttpCaller(`https://api.twitch.tv/helix/channels?broadcaster_id=${QueryStreamerId}`);
            console.log(resp);
            let StreamDataDone = document.getElementById("StreamDataDone");
            let Atag = document.createElement("a");
            Atag.setAttribute("href", `https://www.twitch.tv/${resp["data"][0]["broadcaster_login"]}`);
            Atag.innerHTML = resp["data"][0]["title"];
            Atag.setAttribute("target", "blank_");
            Atag.classList.add("m-2");
            StreamDataDone.classList.add("d-flex", "justify-content-center");
            StreamDataDone.append(Atag);
        }
        else if (QueryStream != "") {
        }
        else if (QueryVodURL != "") {
            console.log(QueryVodURL);
            let StreamDataDone = document.getElementById("StreamDataDone");
            let Atag = document.createElement("a");
            Atag.setAttribute("href", QueryVodURL);
            Atag.innerHTML = QueryVodTitle;
            Atag.setAttribute("target", "blank_");
            Atag.classList.add("m-2");
            StreamDataDone.classList.add("d-flex", "justify-content-center");
            StreamDataDone.append(Atag);
        }
        else {
        }
    });
});
function validateToken() {
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
                Authorization: "Bearer " + AppAcessToken,
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
function SearchApi(event, DropdownElement, Httpcall, ErrorMsg, GetGame) {
    return __awaiter(this, void 0, void 0, function* () {
        if (event.target.value.length > 3) {
            DropdownElement.style.display = "block";
            let resp = yield HttpCaller(Httpcall);
            console.log(resp);
            if (resp.length == 0) {
                DropdownElement.innerHTML = ErrorMsg;
            }
            else {
                DropdownElement.innerHTML = "";
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
                else {
                    for (let index = 0; index < resp["data"].length; index++) {
                        LoginNameStreamers.push(resp["data"][index]["broadcaster_login"]);
                        StreamerBroadcast_id.push(resp["data"][index]["id"]);
                        isLive = resp["data"][index]["is_live"];
                    }
                    for (let index = 0; index < LoginNameStreamers.length; index++) {
                        DropdownElement.innerHTML +=
                            "<li class='pt-1 pb-1'>" + LoginNameStreamers[index] + "</li>";
                    }
                }
            }
        }
    });
}
