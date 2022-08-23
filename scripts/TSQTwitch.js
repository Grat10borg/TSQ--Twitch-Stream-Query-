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
let GameSelectUL = document.getElementById("GameSelect");
let StreamSelectUL = document.getElementById("StreamSelect");
var SelectedCategoryStreamSelect = document.getElementById("CategoryStreamSelect");
let SelectedStreamerSelect = document.getElementById("SelectedStreamerSelect");
let LoginNameStreamers = Array();
let StreamerBroadcast_id = Array();
let isLive = false;
let Vid_Links = Array();
let Vid_Titles = Array();
let IframeIds = Array();
let VidLink = "";
let VidTitle = "";
let IframeId = "";
let GameIds = Array();
let GameTitles = Array();
let QueryURLs = Array();
let QueryStreamTitles = Array();
StreamerNameInput.addEventListener("keyup", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        StreamerBroadcast_id = Array();
        LoginNameStreamers = Array();
        isLive = false;
        yield SearchApi(event, StreamSelectUL, `https://api.twitch.tv/helix/search/channels?query=${event.target.value}`, "Error: failed gathering streamers", false);
    });
});
GameNameInput.addEventListener("keyup", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        yield SearchApi(event, GameSelectUL, `https://api.twitch.tv/helix/search/categories?query=${event.target.value}`, "could not find category", true);
    });
});
StreamSelectUL.addEventListener("click", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        let Label = document.getElementById("GameLabel");
        yield ClickApi(event, StreamSelectUL, GameNameInput, StreamerNameInput, Label, `${event.target.innerText}'s Recent Streams (Categories)`, true);
    });
});
GameSelectUL.addEventListener("click", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        let Label = document.getElementById("StreamerLabel");
        yield ClickApi(event, GameSelectUL, StreamerNameInput, GameNameInput, Label, `Searching For Streamers Playing: ${event.target.innerText}`, false);
    });
});
SelectedStreamerSelect.addEventListener("click", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        VidLink = Vid_Links[Vid_Titles.indexOf(event.target.innerText)];
        VidTitle = event.target.innerText;
        IframeId = IframeIds[Vid_Titles.indexOf(event.target.innerText)];
        GameNameInput.value = event.target.innerText;
        this.innerHTML = "";
    });
});
SelectedCategoryStreamSelect.addEventListener("click", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        VidTitle = event.target.innerText;
        VidLink = Vid_Links[Vid_Titles.indexOf(event.target.innerText)];
        IframeId = IframeIds[Vid_Titles.indexOf(event.target.innerText)];
        StreamerNameInput.value = event.target.innerText;
        this.innerHTML = "";
    });
});
TwitchForm.addEventListener("submit", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        if (VidLink != "") {
            let StreamDataDone = document.getElementById("StreamDataDone");
            let Atag = document.createElement("a");
            Atag.setAttribute("href", VidLink);
            Atag.innerHTML = VidTitle;
            Atag.setAttribute("target", "blank_");
            Atag.classList.add("m-2");
            StreamDataDone.classList.add("d-flex", "justify-content-center");
            StreamDataDone.append(Atag);
            IframeBuilder(IframeId);
        }
        else {
            alert("Did not find a link. try running the program again");
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
            if (resp.length == 0) {
                DropdownElement.innerHTML = ErrorMsg;
            }
            else {
                DropdownElement.innerHTML = "";
                if (GetGame == true) {
                    GameTitles = Array();
                    GameIds = Array();
                    for (let index = 0; index < resp["data"].length; index++) {
                        GameTitles.push(resp["data"][index]["name"]);
                        GameIds.push(resp["data"][index]["id"]);
                    }
                    GameSelectUL.innerHTML = "";
                    for (let index = 0; index < GameTitles.length; index++) {
                        GameSelectUL.innerHTML +=
                            "<li class='pt-1 pb-1'>" + GameTitles[index] + "</li>";
                    }
                }
                else {
                    LoginNameStreamers = Array();
                    StreamerBroadcast_id = Array();
                    for (let index = 0; index < resp["data"].length; index++) {
                        LoginNameStreamers.push(resp["data"][index]["broadcaster_login"]);
                        StreamerBroadcast_id.push(resp["data"][index]["id"]);
                        isLive = resp["data"][index]["is_live"];
                    }
                    DropdownElement.innerHTML = "";
                    for (let index = 0; index < LoginNameStreamers.length; index++) {
                        DropdownElement.innerHTML +=
                            "<li class='pt-1 pb-1'>" + LoginNameStreamers[index] + "</li>";
                    }
                }
            }
        }
    });
}
function ClickApi(event, HTMLULEventElement, HTMLInputElementDisable, HTMLInputElementSet, labelElement, labelMSG, GetStreams) {
    return __awaiter(this, void 0, void 0, function* () {
        HTMLInputElementDisable.setAttribute("disabled", "true");
        HTMLInputElementDisable.setAttribute("placeholder", "Select a VOD or STREAM you'd like to watch!");
        labelElement.innerHTML = `${labelMSG}`;
        let resp;
        if (GetStreams == true) {
            if (isLive == true) {
                resp = yield HttpCaller(`https://api.twitch.tv/helix/streams?user_id=${StreamerBroadcast_id[LoginNameStreamers.indexOf(event.target.innerText)]}`);
                Vid_Titles.push("[🔴 LIVE] " + resp["data"][0]["title"]);
                Vid_Links.push(`https://www.twitch.tv/${resp["data"][0]["user_login"]}`);
                IframeIds.push(resp["data"][0]["user_login"]);
            }
            resp = yield HttpCaller(`https://api.twitch.tv/helix/videos?user_id=${StreamerBroadcast_id[LoginNameStreamers.indexOf(event.target.innerText)]}`);
            console.log(`https://api.twitch.tv/helix/videos?user_id=${StreamerBroadcast_id[LoginNameStreamers.indexOf(event.target.innerText)]}`);
            if (resp.length == 0) {
                console.log("ERROR: user videos not found.");
            }
            else {
                for (let index = 0; index < resp["data"].length; index++) {
                    Vid_Titles.push("[🔵 VOD] " + resp["data"][index]["title"]);
                    Vid_Links.push(resp["data"][index]["url"]);
                    IframeIds.push(resp["data"][index]["id"]);
                }
                SelectedStreamerSelect.innerHTML = "";
                for (let index = 0; index < Vid_Titles.length; index++) {
                    SelectedStreamerSelect.innerHTML +=
                        "<li class='pt-1 pb-1'>" + Vid_Titles[index] + "</li>";
                }
            }
        }
        else {
            let resp = yield HttpCaller(`https://api.twitch.tv/helix/streams?game_id=${GameIds[GameTitles.indexOf(event.target.innerText)]}`);
            if (resp.length == 0) {
                StreamerNameInput.setAttribute("placeholder", "Could not find stream");
            }
            for (let index = 0; index < resp["data"].length; index++) {
                Vid_Titles.push("[🔴 Live] " + resp["data"][index]["title"]);
                Vid_Links.push(`https://www.twitch.tv/${resp["data"][index]["user_login"]}`);
                IframeIds.push(resp["data"][index]["user_login"]);
            }
            SelectedCategoryStreamSelect.innerHTML = "";
            for (let index = 0; index < Vid_Titles.length; index++) {
                let li = document.createElement("li");
                li.classList.add("pt-1", "pb-1");
                li.innerHTML = Vid_Titles[index];
                SelectedCategoryStreamSelect.append(li);
            }
        }
        HTMLInputElementSet.value = event.target.innerText;
        HTMLULEventElement.innerHTML = "";
    });
}
function IframeBuilder(IframeId) {
    let IframeDiv = document.getElementById("IframeScripts");
    let IframeScripts = document.createElement("script");
    let IframeType;
    IframeScripts.setAttribute("type", "text/javascript");
    if (IframeId.match(/.*[A-Za-z].*/i)) {
        IframeType = `channel: '${IframeId}',`;
    }
    else {
        IframeType = `video: '${IframeId}',`;
    }
    IframeScripts.innerHTML =
        "var options = {" +
            "height: 520," +
            "width: 1080," +
            `${IframeType}` +
            "allowfullscreen: true," +
            "layout: 'video'," +
            " muted: false" +
            "};" +
            "var player = new Twitch.Embed('twitch-stream', options);";
    IframeDiv.append(IframeScripts);
}
