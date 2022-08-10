"use strict";
let Tclient_id = "";
let LoginappAcess = "t6jkktho3qmuu2g2blzzljfgng03k3";
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
