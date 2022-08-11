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
});
let StreamerName = document.getElementById("StreamerName");
StreamerName.addEventListener("change", function (event) { });
let GameName = document.getElementById("GameNameInput");
GameName.addEventListener("keyup", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        if (event.target.value.length > 3) {
            let resp = yield HttpCaller("https://api.twitch.tv/helix/search/categories?" + "query=" + event.target.value);
            if (resp != 0) {
                console.log(resp);
            }
            else {
            }
            console.log("https://api.twitch.tv/helix/search/categories?" + "query=" + event.target.value);
            console.log(event.target.value);
        }
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
        fetch(`${HttpCall}`, {
            headers: {
                Authorization: "Bearer " + LoginappAccess,
                "Client-ID": AClient_id,
            },
        })
            .then((response) => response.json())
            .then((response) => {
            console.log(response);
            return response;
        })
            .catch((err) => {
            console.log(err);
            return 0;
        });
        return 0;
    });
}
