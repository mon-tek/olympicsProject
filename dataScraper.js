const fs = require("fs");
var csv = require("csvtojson");

var allData;
var shotData = {};

csv()
  .fromFile("./olympic_womens_dataset.csv")
  .then(function (jsonArrayObj) {
    allData = jsonArrayObj;
    var shots = [];
    shotData.shots = shots;

    for (var event of allData) {
      let noSpaceTeam = event["Team"].replaceAll(" ", "");
      let noBracketTeam = noSpaceTeam.replace(/[\.()]/g, "");

      let noSpacePlayer = event["Player"].replaceAll(" ", "");
      let noSymbolPlayer = noSpacePlayer.replace(/[\.()]/g, "");
      if (event["Event"] == "Goal" || event["Event"] == "Shot") {
        var shot = {
          playerName: event["Player"],
          team: event["Team"],
          homeTeam: event["Home Team"],
          awayTeam: event["Away Team"],
          homeSkatersAmt: event["Home Team Skaters"],
          awaySkatersAmt: event["Away Team Skaters"],
          period: event["Period"],
          homeTeamGoals: event["Home Team Goals"],
          awayTeamGoals: event["Away Team Goals"],
          event: event["Event"],
          xCoord: event["X Coordinate"],
          yCoord: event["Y Coordinate"],
          shotType: event["Detail 1"],
          shotDestination: event["Detail 2"],
          traffic: event["Detail 3"],
          oneTimer: event["Detail 4"],
          idTeamName: noBracketTeam,
          idPlayerName: noSymbolPlayer,
        };

        shotData.shots.push(shot);
      }
    }

    fs.writeFile("teams.txt", JSON.stringify(shotData), (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });
  });
