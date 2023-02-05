const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const db_path = path.join(__dirname, "cricketTeam.db");
let db = null;
module.exports = app;
const initalizeDbAndServer = async () => {
  try {
    db = await open({
      filename: db_path,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server is Running!`);
    });
  } catch (error) {
    console.log(`Database Error ${error.message}`);
  }
};
initalizeDbAndServer();

//Get All Players API

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT player_id AS playerId,player_name AS playerName,jersey_number AS jerseyNumber,role AS role
    FROM
   cricket_team;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//Add Player API

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `INSERT INTO cricket_team (player_name,jersey_number,role) 
  VALUES('${playerName}','${jerseyNumber}','${role}');`;
  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//Return a single player API

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT player_id AS playerId,player_name AS playerName,jersey_number AS jerseyNumber,role AS role
    FROM cricket_team
    WHERE
    player_id=${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//Update Player API

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updateQuery = `
    UPDATE cricket_team 
    SET player_name='${playerName}',jersey_number='${jerseyNumber}',role='${role}' 
    WHERE player_id=${playerId};`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});

//Delete player API

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `
    DELETE FROM cricket_team WHERE player_id=${playerId}`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});
