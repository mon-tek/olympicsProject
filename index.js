const http = require("http");
const fs = require("fs");
const url = require("url");

var teams = new Map();

const teamsListHTML = fs.readFileSync("./allTeamListing.html", "utf-8");
const playersListHTML = fs.readFileSync("./allPlayersListing.html", "utf-8");
const singlePlayerPageHTML = fs.readFileSync(
  "./singlePlayerPage.html",
  "utf-8"
);

const data = fs.readFileSync("./teams.txt", "utf-8", (err, data) => {
  if (err) throw error;
});
const allTeamData = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  var team = "";

  if (pathname == "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    for (var shot in allTeamData.shots) {
      teams.set(
        allTeamData.shots[shot]["idTeamName"],
        allTeamData.shots[shot]["team"]
      );
    }
    const outMap = Array.from(teams)
      .map((el) => homepageTeamLister(teamsListHTML, el))
      .join("");

    res.end(outMap);
  } else if (pathname == "/team") {
    var players = new Map();
    res.writeHead(200, { "Content-type": "text/html" });
    for (var shot in allTeamData.shots) {
      if (query.id == allTeamData.shots[shot]["idTeamName"]) {
        team = allTeamData.shots[shot]["team"];
        players.set(
          allTeamData.shots[shot]["idPlayerName"],
          allTeamData.shots[shot]["playerName"]
        );
      }
    }

    const outMap = Array.from(players)
      .map((el) => playerLister(playersListHTML, el, team))
      .join("");
    res.end(outMap);
  } else if (pathname == "/player") {
    const outputShotInfo = {};
    var innerShots = [];
    outputShotInfo.innerShots = innerShots;

    for (var shot in allTeamData.shots) {
      if (query.id == allTeamData.shots[shot]["idPlayerName"]) {
        outputShotInfo.innerShots.push(allTeamData.shots[shot]);
      }
    }
    finalShotObj = outputShotInfo;

    let outputHTML = singlePlayerPage(singlePlayerPageHTML, outputShotInfo);

    res.end(outputHTML);
  } else if (pathname == "/api") {
    const outputShotInfo = {};
    var innerShots = [];
    outputShotInfo.innerShots = innerShots;

    for (var shot in allTeamData.shots) {
      outputShotInfo.innerShots.push(allTeamData.shots[shot]);
    }
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify(outputShotInfo.innerShots));
  }
});

server.listen(9000, "127.0.0.1", () => {
  console.log("listening on port 9000");
});

const homepageTeamLister = (temp, team) => {
  let output = temp.replace(/{%ID%}/g, team[0]);
  output = output.replace(/{%TEAMNAME%}/g, team[1]);
  return output;
};

const playerLister = (temp, player, team) => {
  let output = temp.replace(/{%pID%}/g, player[0]);
  output = output.replace(/{%PLAYERNAME%}/g, player[1]);
  output = output.replace(/{%TEAM%}/g, team);
  return output;
};

const singlePlayerPage = (temp, player) => {
  for (var shot in player.innerShots) {
    var opponent;
    if (
      player.innerShots[shot]["awayTeam"] != player.innerShots[shot]["team"]
    ) {
      opponent = player.innerShots[shot]["awayTeam"];
    } else {
      opponent = player.innerShots[shot]["homeTeam"];
    }
  }
  var output = temp.replace(
    /{%PLAYERNAME%}/g,
    player.innerShots[0]["playerName"]
  );
  output = output.replace(/{%OPPONENT%}/g, opponent);
  return output;
};
