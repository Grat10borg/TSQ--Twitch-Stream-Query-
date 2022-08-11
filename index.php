<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Heebo&family=Secular+One&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/bootstrap/css/bootstrap.css" type="text/css">
    <link rel="stylesheet" href="css/style.css" type="text/css">
    <title>TSQ Twitch Stream Querier</title>
</head>

<body>
    <header>
        <h2 class="p-4 d-flex justify-content-center">TSQ: Twitch Stream Querier</h2>
    </header>
    <main class="pb-4 pt-4">
        <form class="container col-rows-2 col-rows-1-sm col-6 " id="TwitchForm" method="POST">
            <!-- Make auto fill at some point : https://w3collective.com/autocomplete-search-javascript/ -->
            <div class="row mt-2">
                <label class="text-center col-2 mt-2" for="Game">Catagory:</label>
                <input class="col form-control my-2" id="GameNameInput" type="text" name="GameName">
            </div>
            <div class="row mt-2">
                <label class="text-center col-2 mt-2" for="TwitchHandle">Streamer:</label>
                <input class="col form-control my-2" id="StreamerName" type="text" name="TwitchHandle">
            </div>
            <input class="btn submit row mt-3" type="submit" value="submit">
        </form>
    </main>
    <footer class="footer mt-auto py-3 fixed-bottom justify-content-center d-flex">
        <p>⚓ Til søs og så tilbage igen. ⛵ ..glemte du noget? 🦀🐟</p>
    </footer>
    <script src="scripts/TSQTwitch.js"></script>
    <script src="css/bootstrap/js/bootstrap.js"></script>
</body>

</html>