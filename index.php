<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Heebo&family=Secular+One&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/bootstrap/css/bootstrap.min.css" type="text/css">
    <link rel="stylesheet" href="css/style.css" type="text/css">
    <link rel="icon" type="image/x-icon" href="minecraftCornflowerIcon.png">
    <title>TSQ Twitch Stream Querier</title>
</head>

<body>
    <header>
        <h2 class="p-4 d-flex justify-content-center">TSQ: Twitch Stream Querier</h2>
    </header>
    <main class="pb-4 pt-4">
        <a href='https://id.twitch.tv/oauth2/authorize?client_id=<Your ClientID>&redirect_uri=http://localhost/Twitch-Stream-Query/&response_type=token+id_token&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls+openid'>Connect with Twitch and use a UserAcess Token Instead?</a>
        <!-- IF YOU SEE BLOCKED BY CLIENT IN THE CONSOLE ITS LIKELY YOUR AD BLOCKER -->
        <div class="d-flex justify-content-center m-5 mb-5">
            <div id="twitch-stream"></div>
            <?php
            if (file_exists("yourApiKey.txt")) {
                $apikey = file("yourApiKey.txt");
                if (isset($apikey[0])) {
                    echo "<p hidden id='apikey'>{$apikey[0]}</p>";
                }
                else {
                    echo "<h4>Did not find an Apikey! please put an api key in yourApiKey.txt</h4>";
                }
            } else {
                echo "<h4>Did you delete yourApiKey.txt by mistake? or is it missing?</h4>";
            }
            ?>
        </div>
        <form class="container col-rows-2 col-rows-1-sm col-6 " id="TwitchForm" method="POST">
            <div class="row mt-2">
                <label id="GameLabel" class="text-center col mt-2" for="Game">Category:</label>
                <div>
                    <input class="col form-control my-2" placeholder="Minecraft..." id="GameNameInput" type="text" name="GameName">
                    <ul class="ms-2 me-2" id="GameSelect"></ul>
                </div>
                <ul id="SelectedStreamerSelect"></ul>
            </div>
            <div class="row mt-2">
                <label id="StreamerLabel" class="text-center col mt-2" for="TwitchHandle">Streamer:</label>
                <div>
                    <input class="col form-control my-2" placeholder="marinemammalrescue..." id="StreamerName" type="text" name="TwitchHandle">
                    <ul id="StreamSelect"></ul>
                </div>
                <ul id="CategoryStreamSelect"></ul>
            </div>
            <input class="btn submit row mt-3" type="submit" value="submit">
        </form>
        <div id="StreamDataDone"></div>
    </main>
    <footer class="footer mt-auto py-3 fixed-bottom justify-content-center d-flex">
        <p>⚓ Til søs og så tilbage igen. ⛵ ..glemte du noget? 🦀🐟</p>
    </footer>
    <script src="https://embed.twitch.tv/embed/v1.js"></script>
    <script type="text/javascript" src="scripts/TSQTwitch.js"></script>
    <script type="text/javascript" src="css/bootstrap/js/bootstrap.min.js"></script>
</body>

</html>