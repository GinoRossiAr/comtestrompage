/* En orden
@keso
@CHARLES LECLERC
@Moreno Martins
*/


var adminsAuth = [
	"TjC2O2ByJ9D0nbMW9ha8Een3IguFvjhnSK4bgvawok8",
	"RHl4qzpf7DWCTm8yinja0NPyYEzBCphhEMLPkaPVZE8",
	"FipHk7SzqE-JAzXabVD-Cjy22fGQPUC4rmI4PZa4wR8",
	"uWTZPBsVxGtIKAbzsGlI8dlwNJ4QgdiN2THIoJBHTvI",
	"AF08JBZL_rzv388R9y5vEomqMofDSKR4zlvBmXJWzHw",
	"w055pejEU7a7XFvzeqneJ38qj1bDVz6bVQrPKqyMa8I",
	"Ruj-q8CMsQYnmhX5XJ8eJMV0FID9y3d_8kCJQDW3pq4",
	"BqH6UWxotyv0xMGMH-3uSiubrqc1s6OenTasr4Lnigo",
	"8ZfOO7YQVNUROga993G_mN6V4QJEKE9yj6RURM6K2mM",
	"BsbZS1aOsd0JLVzb2AKq7TBS4TPtWYkbcoUIkGYABOU",
	"p6Wye2xKYH71B6vAleliJoADQMJSRrbyFqS-K92YIsQ"
]


var adminsNames = [
	"keso", // 1
	"CHARLES LECLERC", // 2
	"Moreno Martins", // 3
	"ʙᴏᴛᴛᴀ", // 4
	"Russia // Khan J", // 5-6
	"Soniko", // 7
	"manu", // 8
	"Kiltro", // 9
	"Uruwhy", // 10
	"Campi"
]



var multipleAdminAccounts = {};

// let bannedPlayers = [
// 	{name: 'PEPE', conn: '3138362E3132392E3232322E313036'},
// 	{name: 'Softendo', conn: '3138392E38342E3138312E3335'},
// 	{name: '.', conn: '3139302E3234352E3132312E313933'},
// 	{name: '     mkz!!', conn: '3139302E3131322E38352E313631'},
// 	{name: 'Softendo', conn: '3138392E38342E3137362E323038'},
// 	{name: 'COLAPINTO', conn: '3139302E3131322E39392E313632'},
// 	{name: '1', conn: '3138362E3133372E3138302E3533'}
// ];

let bannedPlayers = [];

(async () => {
    // Cargar baneos desde la BD 
    window.bannedPlayers = await window.loadBannedPlayers();

    console.log('Baneados cargados:', window.bannedPlayers);
})();

//#endregion

//Variables

var isRoomSet = false;

//#endregion

//Listas jugadores (Conn, ID, Drivers, MultipleAccountsAdmins, AdminsAuth, AdminsNames)
//#region

var playersID = {}
/*
playersID = { 
	player.id: player.conn,
	player.id_2: player.conn_2,
	...
}
*/
var playersConn = {}
var playersAuth = {}
/*
playersConn = {
	player.conn: { player.name: keso, player.id: Int, isInTheRoom: bool },
	player.conn_2: { player.name_2: TINI, player.id_2: Int, isInTheRoom: bool },
	...
}
*/
/*
playersAuth = {
	player.auth: { player.name: keso, player.id: Int, isInTheRoom: bool },
	player.auth2: { player.name_2: TINI, player.id_2: Int, isInTheRoom: bool },
	...
}
*/


var driversList = {}
/*
driversList = {
	racer1_ID: {
		currentLap: 0,
		lapChanged: false,
		lapTimes: [0,0,0],
		invalidQualyLap: false,
		xPos: undefined,
		yPos: undefined,
		xSpeed: undefined,
		ySpeed: undefined
	}
	...
}
*/


//#endregion

//Comandos
var commands = {
	admin: "!admin",
	help: "!help",
	mapInfo:"!fl",
	mapLoad: "!circuit",
	maps: "!maps",
	speed: "!speed"
};

//Console
//#region

var adminChanges = ["'s admin rights were taken away"," was given admin rights"];
var playerKicked = [" was kicked"," was banned"];
var speedEnableChanges = ["OFF","ON"];
var teams = ["spectators","red","blue"];


// conn de sery 3137392E32352E3231392E313333
/*
bannedPlayers = [
	{player1.name, player1.conn}
]
*/


//#endregion

//Inicia y configura sala
//#region 

let max = 20;
let trueism = false;
let roomName = "🏎️🏆🏁 FORMULA 1 Argentina 🇦🇷 - FNA 🏁🏆🏎️";

changeTrueism();
changeMax();
changeRoomName();

var room = HBInit({roomName:roomName,noPlayer:true,public:true,maxPlayers:max, token: "thr1.AAAAAGclRpmIH9ZzZzn8xQ.IR8fPNGN4pg", geo:{code:"AR", ﻿lat: ﻿-34.549230885794, lon: -58.558065103689}});

room.setScoreLimit(0);
room.setTimeLimit(0);
room.setTeamsLock(true);
room.setCustomStadium(Circuit1);

//#endregion

//Variables para carrera
//#region

var laps = 3;
var onRaceSession = false;
var showedRaceResults = false;
var raceResults = [];
let raceList = [];
let lappedsList = [];
/*
raceResults = [

	{name: racer1, timeRace: scoresTime},
	{name: racer2, timeRace: scoresTime},
	{name: racer2, timeRace: scoresTime, lapped: true | false}

];
*/

//#endregion

//Variables para clasificacion
//#region

var qualyList = [];
/*
qualyList = [
	{conn: string, name: racer1, timeQualy: lapTime},
	{conn: string2, name: racer2, timeQualy: lapTime},
]
*/
var timeQualy = DEFAULT_TIME_QUALY;
var onQualySession = false;
var showedQualyResults = false;
var millisecondsTimeout = 0;

//#endregion

//Variables para campeonato
//#region

var onOfficialChampionship = false;
var onChampionship = false;
var championshipStandings = [];
var scoringSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
/*
championshipStandings = [
	{name: racer1, points: number},
	{name: racer2, points: number}
];
*/

//#endregion

//Variables para Modo Publico
//#region

var publicMode = false;
var qualyIsSet = false;
var raceIsSet = false;

//#endregion

//Variables Predeterminadas
var DEFAULT_TIME_QUALY = 180;
var DEFAULT_LAPS = 3;
var muteAll = false;
var mensajesCarrera = false;
var mensajesCambioCircuito = false;
let stopCamera = false;

//Funciones

function ifInLapChangeZone(player){
	return _Circuit.MinX <= room.getPlayerDiscProperties(player.id).x && room.getPlayerDiscProperties(player.id).x <= _Circuit.MaxX && _Circuit.MinY <= room.getPlayerDiscProperties(player.id).y && room.getPlayerDiscProperties(player.id).y <= _Circuit.MaxY;
}

function isDrivingInCorrectDirection(player) {
    const playerDiscProps = room.getPlayerDiscProperties(player.id);
    if (_Circuit.StartDirection == "X") {
        return Math.sign(playerDiscProps.xspeed) == _Circuit.DriveDirection;
    } else if (_Circuit.StartDirection == "Y") {
        return Math.sign(playerDiscProps.yspeed) == _Circuit.DriveDirection;
    }
    return true;
}

function serializeSeconds(seconds){
	return seconds.toFixed(3);
}

function serializeTimeRace(timeSeconds){
	let minutes = Math.floor(timeSeconds / 60).toString().padStart(2,"0");
	let seconds = (timeSeconds % 60).toFixed(3).toString().padStart(6,"0");
	return minutes + ":" + seconds;
}

function getMillisecondsTimeout(){
	let milliseconds = millisecondsTimeout;
	millisecondsTimeout += 500;
	return milliseconds;
}

function qualyPosReset(player){
	room.setPlayerDiscProperties(player.id,{x: _Circuit.qualyPosReset[0], y: _Circuit.qualyPosReset[1], xspeed: 0, yspeed: 0});
}

function setGrid(){
	qualyList.filter(playerInQualy => playerInQualy.auth in playersAuth).forEach(playerInQualy => {
		if (playersAuth[playerInQualy.auth]) {
			let player = room.getPlayer(playersAuth[playerInQualy.auth].id);
			if (player) {
				if (!afkPlayers[player.id]) room.setPlayerTeam(player.id,_Circuit.Team);
			}
		}
	});
}


async function showChampionshipStandings(){
	let startTime, endTime;

	console.log("Sending championship standings header");
	startTime = Date.now();
	room.sendAnnouncement(`${"".padEnd(72, "-")}\nCampeonato - Posiciones:\nPos\t|\tCorredor\t|\tPuntos`, null, colors.championshipStandings, fonts.championshipStandings, sounds.notifyChampionshipStandings);
	await wait(500);
	endTime = Date.now();
	console.log(`Header sent, waited ${endTime - startTime}ms`);

	let pos = 0;
	championshipStandings.slice(0, 3).forEach(player => {
		console.log(`Sending result line for top 3 position ${pos + 1}`);
		startTime = Date.now();
		room.sendAnnouncement(`${++pos}\t|\t${player.name}\t|\t${player.points}`, null, colors.position[pos], fonts.championshipStandings, sounds.championshipStandings);
	});
	await wait(500);
	endTime = Date.now();
	console.log(`Result line for top 3 position ${pos} sent, took ${endTime - startTime}ms`);

	let stringPositions = "";
	championshipStandings.slice(3).forEach(player => {
		stringPositions += `${++pos > 4 ? "\n" : ""}${pos}\t|\t${player.name}\t|\t${player.points}`;
	});

	if (stringPositions !== "") {
		console.log("Sending remaining results");
		startTime = Date.now();
		room.sendAnnouncement(stringPositions, null, colors.playerInResults, fonts.playerInResults, sounds.playerInResults);
		endTime = Date.now();
		console.log(`Remaining results sent, took ${endTime - startTime}ms`);
	}

	console.log("Sending championship standings footer");
	startTime = Date.now();
	room.sendAnnouncement(`${"".padEnd(72, "-")}`, null, colors.championshipStandings, fonts.championshipStandings, sounds.championshipStandings);
	await wait(500);
	endTime = Date.now();
	console.log(`Footer sent, waited ${endTime - startTime}ms`);

	return Promise.resolve();
}

async function updateChampionshipStandings() {
	var pos = 0;
	raceResults.slice(0, 10).forEach(p => {
		var indexRace = championshipStandings.findIndex(player => player.name == p.name);
		if (indexRace != -1) {
			championshipStandings[indexRace].points += (scoringSystem[pos] + (p.name == _Circuit.BestTime[1] ? 1 : 0));
		} else {
			championshipStandings.push({ name: p.name, points: (scoringSystem[pos] + (p.name == _Circuit.BestTime[1] ? 1 : 0)) });
		}
		pos++;
	});
	championshipStandings.sort((player1, player2) => (player1.points < player2.points) ? 1 : ((player1.points > player2.points) ? -1 : 0));
	await showChampionshipStandings();
}

function followFirstPlayer() {
	let leader = getCurrentLeader();
	if (leader != undefined) {
		let leaderDiscProps = room.getPlayerDiscProperties(currentLeader.id);
		if (leaderDiscProps != null) {
			if (!leaderFinished) {
				room.setDiscProperties(0, { x: leaderDiscProps.x, y: leaderDiscProps.y, radius: 0 });
			} else {
				room.setDiscProperties(0, { x: 0, y: 0 });
				// El líder terminó la carrera satisfactoriamente
				stopCamera = true;
			}
		} else {
			// El líder ya no está en el juego, manejar esto adecuadamente
			room.setDiscProperties(0, { x: 0, y: 0 });
		}
	} else {
		room.setDiscProperties(0, { x: 0, y: 0 });
	}
}


/* function checkRaceList() {
    let drivers = getPlayersInTrack();
    let activeDriversMap = new Map();

    // Crear un mapa de jugadores activos
    for (let driver of drivers) {
        activeDriversMap.set(playersID[driver.id].auth, driver);
    }

    // Verificar si el líder ha terminado (para que no hayan cambios de raceList)
    if (!leaderFinished) {
        // Filtrar y actualizar la lista de carrera en su lugar
        for (let i = raceList.length - 1; i >= 0; i--) {
            let driverData = raceList[i];
            let driver = activeDriversMap.get(driverData.auth);
            if (driver == undefined) {
                raceList.splice(i, 1); // Eliminar jugador desconectado o AFK
            }
        }
    }
}*/


function raceSession(){
	checkPlayerLapsRace();
	// checkRaceList();
	
	if (!stopCamera) {
		followFirstPlayer();
	}
	
	if(room.getPlayerList().filter(p => room.getPlayerDiscProperties(p.id) != null).length == 0 && !showedRaceResults){
		showedRaceResults = true;
		room.stopGame();
	}
}


const f1ScoringSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]; // Puntos para las primeras 10 posiciones

async function showRaceResults() {
    muteAll = true;
    let startTime, endTime;

    console.log("Sending race results header");
    startTime = Date.now();
    room.sendAnnouncement(`${"".padEnd(72, "-")}\nResultados de la carrera:\nPos\t|\tPiloto\t|\tTiempo\t|\tPuntos`, null, colors.raceResults, fonts.raceResults, sounds.notifyRaceResults);
    await wait(500);
    endTime = Date.now();
    console.log(`Header sent, waited ${endTime - startTime}ms`);

    let pos = 0;
    const raceData = []; // Para el embed de Discord

    for (const player of raceResults) {
        pos++; // Incrementamos aquí la posición antes de usarla
        const playerName = player.auth in playersAuth ? playersAuth[player.auth].name : player.name;
        const playerTime = serializeTimeRace(player.timeRace);
        
        // Asignar puntos basados en la posición
        const pointsEarned = (pos <= 10) ? `(+${f1ScoringSystem[pos - 1]} puntos)` : "Sin puntos";
        
        // Vuelta rápida bonificación
        const isFastestLap = player.name == _Circuit.BestTime[1];
        const fastestLapBonus = isFastestLap ? " (+1 Vuelta rápida)" : "";
	
		// Se le da el puntito extra
		if(isFastestLap && room.getPlayerList().length >= 12) {
			window.getUserStats(player.name)
			.then(stats => {
				window.updateStats(player.name, {
					puntos: stats.puntos + 1
				});
			room.sendAnnouncement("Sumaste +1 por la vuelta rápida.", player.id, 0x24DCF0, "bold", 2)
			})
			.catch(err => {
				console.error(`Error al obtener estadísticas de ${p.name}:`, err);
			});	
		}
        
        // Construir la línea de resultados
        const resultLine = `${pos}\t|\t${playerName}\t|\t${playerTime}\t|\t${pointsEarned} ${fastestLapBonus}`;

        // Usar colores diferentes para los tres primeros lugares
        let announcementColor;
        if (pos === 1) {
            announcementColor = colors.playerFirstPos;
        } else if (pos === 2) {
            announcementColor = colors.playerSecondPos;
        } else if (pos === 3) {
            announcementColor = colors.playerThirdPos;
        } else {
            announcementColor = colors.playerInResults;
        }

        console.log(`Sending result line for position ${pos}`);
        startTime = Date.now();
        room.sendAnnouncement(resultLine, null, announcementColor, fonts.playerInResults, sounds.playerInResults);
        await wait(500);
        endTime = Date.now();
        console.log(`Result line for position ${pos} sent, waited ${endTime - startTime}ms`);

        // Agregar datos para el embed de Discord
        raceData.push({ 
            name: playerName, 
            time: playerTime, 
            points: pointsEarned.trim(), 
            fastestLap: isFastestLap 
        });
    }

    console.log("Sending race results footer");
    startTime = Date.now();
    room.sendAnnouncement(`${"".padEnd(72, "-")}`, null, colors.raceResults, fonts.raceResults, sounds.raceResults);
    await wait(500);
    endTime = Date.now();
    console.log(`Footer sent, waited ${endTime - startTime}ms`);

	
    console.log("Sending fastest lap");
    startTime = Date.now();
    room.sendAnnouncement(`Vuelta rápida: ${serializeSeconds(_Circuit.BestTime[0])}s | ${_Circuit.BestTime[1]}`, null, colors.trackRecord, fonts.trackRecord, sounds.trackRecord);
    await wait(500);
    endTime = Date.now();
    console.log(`Fastest lap sent, waited ${endTime - startTime}ms`);

    if (room.getPlayerList().length >= 12) { 
        room.sendAnnouncement(`La carrera fue disputada y presenciada por los pilotos suficientes. ¡Suma a tus stats!`, null, colors.raceResults, fonts.raceResults, sounds.notifyRaceResults);
    } else {
        room.sendAnnouncement(`Como no hay gente suficiente, la carrera no contó para las stats.`, null, colors.lapChanged, fonts.raceResults, sounds.notifyRaceResults);
    }
	console.log("Datos de la carrera antes de enviar el embed:", raceData);
	window.sendRaceResultsEmbed(raceData, _Circuit); // Para el embed de Discord
    return Promise.resolve();
}


// Función para ajustar texto a la izquierda y rellenar con espacios a la derecha
function padText(text, width) {
    return text.padEnd(width, ' ');
}


// Declarar las variables globales para carrera
let ongoingLap = 0;
let currentLeader = undefined;
let leaderFinished = false;
let lapChangedByLeader = false;
let finalPosition = 1;
let currentPosition = 0;
let noPlayers = false;

// Función para obtener el jugador en la primera posición
function getCurrentLeader() {
	return currentLeader;
}

// Función para obtener la vuelta actual
function getCurrentLap() {
	return ongoingLap;
}

// Función para restablecer el estado de la carrera
function resetRaceStatus() {
	ongoingLap = 0;
	currentLeader = undefined;
	leaderFinished = false;
	finalPosition = 1;
	currentPosition = 0;
	stopCamera = false;
	for(let i = 0; i < room.getPlayerList().length; i++) {
		activeBeforeStart[room.getPlayerList()[i].id] = false;
		notAFKable[room.getPlayerList()[i].id] = false;
	}
}

function announceLeader(p) {
	let spectators = room.getPlayerList().filter(player => !driversList[player.id]);
	spectators.forEach(spectator => {
				room.sendAnnouncement(`📢 Vuelta ${ongoingLap}/${laps}. El líder actual es ${p.name} `, spectator.id, 0xA5FF78, "bold", 2);
	});
	console.log(`📢 Vuelta ${ongoingLap}/${laps}. El líder actual es ${p.name}`)
}

function setLeader(p) {
	currentLeader = p;
	ongoingLap = driversList[currentLeader.id].currentLap;
}

function setLapChange() {
	lapChangedByLeader = true;
	setTimeout(() => {
		lapChangedByLeader = false;
	}, 10000);
}

function announceWinner(p) {
	room.sendAnnouncement(`🏁 ${p.name} ha ganado la carrera!`, null, colors.playerInResults, fonts.playerInResults, sounds.playerInResults);
	console.log(`🏁 ${p.name} ha ganado la carrera!`);
}

function handleRace(player, playerData, exactLapTime, startTime) {
	// Actualizar raceList
	let indexRace = raceList.findIndex(r => r.auth === playersID[player.id].auth);
	if (indexRace !== -1) {
		// Actualizar el registro existente
		raceList[indexRace].timeRace = exactLapTime;
		raceList[indexRace].lapsCompleted = playerData.currentLap;
	} else {
		// Agregar un nuevo registro
		raceList.push({ auth: playersID[player.id].auth, timeRace: exactLapTime, lapsCompleted: playerData.currentLap, name: player.name });
	}

	// Ordenar la raceList
	raceList.sort((a, b) => {
		if (a.lapsCompleted === b.lapsCompleted) {
			return a.timeRace - b.timeRace;
		}
		return b.lapsCompleted - a.lapsCompleted;
	});

	// Obtener el índice actualizado del jugador en la lista de carreras
	indexRace = raceList.findIndex(r => r.auth === playersID[player.id].auth);

	if (playerData.currentLap > laps) {
		if (playerData.currentLap > ongoingLap && !leaderFinished) {
			leaderFinished = true;
			announceWinner(player);
	
			// Manejar jugadores rezagados
			let leaderLapsCompleted = raceList[0].lapsCompleted;
			console.log(`leaderLapsCompleted: ${leaderLapsCompleted}`);
			raceList.forEach(r => {
				if (leaderLapsCompleted - r.lapsCompleted > 1) {
					console.log(`r.lapsCompleted: ${r.lapsCompleted}`);
					let lapsLost = leaderLapsCompleted - r.lapsCompleted - 1;
					console.log(`lapsLost: ${lapsLost}`);
					lappedsList.push({ name: r.name, timeRace: lapsLost });
					console.log(`lapped: ${r.name}, vueltas: +${lapsLost}`);
					let lapped = room.getPlayerList().find(p => playersID[p.id].auth === r.auth);
					room.setPlayerTeam(lapped.id, 0);
				}
			});
		} else if (leaderFinished) {
			finalPosition += 1;
	
			// Enviar mensaje solo si el piloto no ha terminado previamente
			if (playerData.currentPosition !== finalPosition) {
				room.sendAnnouncement(`Terminaste en la posición ${finalPosition}`, player.id, colors.playerInResults, fonts.playerInResults, sounds.playerInResults);
				playerData.currentPosition = finalPosition; // Actualizar la posición
			}
		}
	
		scoresTime = (exactLapTime - startTime);
		raceResults.push({ name: player.name, timeRace: scoresTime });
		room.setPlayerTeam(player.id, 0);
	} else {
		// Determinar el líder
		let newLeaderAuth = raceList[0].auth;
		let newLeader = room.getPlayerList().find(p => playersID[p.id].auth === newLeaderAuth);
	
		// Anunciar el líder si ha cambiado, SOLO cuando el líder pasa por meta
		if (currentLeader == undefined || newLeader) {
			if (player.auth == newLeader.auth) {
				setLeader(newLeader);
				announceLeader(newLeader);
				currentPosition = indexRace + 1; // Debería ser 1 siempre
				playerData.currentPosition = currentPosition;
				console.log(`currentposition lid: ${currentPosition}`);
			} else if (player.auth != newLeader.auth) {
				currentPosition++;
				playerData.currentPosition = currentPosition;
				console.log(`currentposition: ${currentPosition}`);
			}
		}
	
		room.sendAnnouncement(`Vuelta actual: ${playerData.currentLap}/${laps} | Pos. ${playerData.currentPosition}`, player.id, colors.lapChanged, fonts.lapChanged, sounds.lapChanged);
	}
	

	// Verificar el estado de raceList después de cada actualización (se igualan todas las instancias si no se abre la lista)
    console.log("raceList:", raceList);
}

/// --- SISTEMA DE PUNTOS, SALA PÚBLICA


function checkPlayerLapsRace() {
    var players = getPlayersInTrack();

    players.forEach(p => {
        const playerDiscProps = room.getPlayerDiscProperties(p.id);
        const playerData = driversList[p.id];

        // Actualizar la posición anterior del jugador en cada gameTick
        let currentTime = room.getScores().time;
        let currentPerfTime = performance.now();
        let currentPos = { x: playerDiscProps.x, y: playerDiscProps.y, time: currentTime, perfTime: currentPerfTime };
        let previousPos = playerData.previousPos || currentPos;
        playerData.previousPos = currentPos;

        if (!ifInLapChangeZone(p) && playerData.lapChanged) {
            playerData.lapChanged = false;
        }

        if (!ifInLapChangeZone(p) && sessionStarted && !playerData.startedRace) {
            playerData.startedRace = true;
            playerData.startTime = currentTime; // Guardar el tiempo de inicio
        }

        if (ifInLapChangeZone(p)) {
            if (_Circuit.StartDirection == "X" && Math.sign(playerDiscProps.xspeed) == -1 * _Circuit.DriveDirection) {
                room.kickPlayer(p.id, "Trolling detected!", false);
            } else if (_Circuit.StartDirection == "Y" && Math.sign(playerDiscProps.yspeed) == -1 * _Circuit.DriveDirection) {
                room.kickPlayer(p.id, "Trolling detected!", false);
            } else if (!playerData.lapChanged) {
                playerData.lapChanged = true;
                playerData.currentLap++;

                // Calcular el tiempo exacto de cruce de la línea de meta
                let exactLapTime = currentTime;
                let ratio = 0;

                if (_Circuit.StartDirection == "X" && previousPos.x !== currentPos.x) {
                    let finishLineX = _Circuit.DriveDirection === 1 ? _Circuit.MaxX : _Circuit.MinX;
                    let deltaX = previousPos.x - currentPos.x;
                    if (deltaX !== 0) {
                        ratio = (previousPos.x - finishLineX) / deltaX;
                        if (!isNaN(ratio) && isFinite(ratio)) {
                            exactLapTime = previousPos.time + ratio * (currentPos.time - previousPos.time);
                        }
                    }
                } else if (_Circuit.StartDirection == "Y" && previousPos.y !== currentPos.y) {
                    let finishLineY = _Circuit.DriveDirection === 1 ? _Circuit.MaxY : _Circuit.MinY;
                    let deltaY = previousPos.y - currentPos.y;
                    if (deltaY !== 0) {
                        ratio = (previousPos.y - finishLineY) / deltaY;
                        if (!isNaN(ratio) && isFinite(ratio)) {
                            exactLapTime = previousPos.time + ratio * (currentPos.time - previousPos.time);
                        }
                    }
                }

                // Calcular el tiempo de vuelta
                let lapTime = exactLapTime - (playerData.lastExactLapTime || exactLapTime);
                playerData.lastExactLapTime = exactLapTime;

                if (playerData.currentLap > 1) {
                    room.sendAnnouncement(`⏱ Vuelta ${playerData.currentLap - 1}: ${lapTime.toFixed(3)}s`, p.id, colors.lapTime, fonts.lapTime, sounds.lapTime);
                    if (lapTime < _Circuit.BestTime[0] || _Circuit.BestTime[0] == 0) {
                        _Circuit.BestTime[0] = lapTime;
                        _Circuit.BestTime[1] = p.name;
                        room.sendAnnouncement(`Vuelta rápida: ${lapTime.toFixed(3)}s | ${p.name}`, null, colors.trackRecord, fonts.trackRecord, sounds.trackRecord);
                    }
                }
				
                if (playerData.currentLap > laps) {
                    // finalPosition += 1;
                    // room.sendAnnouncement(`Terminaste en la posición ${finalPosition-1}`, p.id, colors.playerInResults, fonts.playerInResults, sounds.playerInResults); posible bug
                    let scoresTime = exactLapTime - playerData.startTime;
                    raceResults.push({ name: p.name, timeRace: scoresTime });
                    room.setPlayerTeam(p.id, 0);

                    if (playerData.currentLap > ongoingLap && !leaderFinished) {
                        leaderFinished = true;
                        announceWinner(p);
                        console.log(`winnerif: ${p.name}`);
                    } else if (leaderFinished) {
                        finalPosition += 1;
                        console.log(`p${finalPosition}: ${p.name}`);
                        room.sendAnnouncement(`Terminaste en la posición ${finalPosition}`, p.id, colors.playerInResults, fonts.playerInResults, sounds.playerInResults);
                    }

                    // Solo actualizar estadísticas si hay 12 pilotos o más 
                    if (room.getPlayerList().length >= 12) { 
                        playerData.statsUpdated = true; 

						window.getUserStats(p.name)
						.then(stats => {
							console.log(`Estadísticas actuales de ${p.name}:`, stats);
							
							const puntosPorPosicion = {
								1: 25,
								2: 18,
								3: 15,
								4: 12,
								5: 10,
								6: 8,
								7: 6,
								8: 4,
								9: 2,
								10: 1
							};					
							let puntosGanados = puntosPorPosicion[finalPosition] || 0;

							let valor = (5 * ((finalPosition === 1) ? stats.carrerasGanadas + 1 : stats.carrerasGanadas)) +
							(4 * ((finalPosition <= 3) ? stats.carrerasPodio + 1 : stats.carrerasPodio)) +
							(1 * ((finalPosition <= 10) ? stats.carrerasTop10 + 1 : stats.carrerasTop10)) +
							(0.1 * (stats.puntos + puntosGanados)) -
							(0.07 * (stats.carrerasCompletadas + 1 - ((finalPosition === 1) ? stats.carrerasGanadas + 1 : stats.carrerasGanadas)))
					
							// Actualización de estadísticas básicas
							window.updateStats(p.name, {
								carrerasCompletadas: stats.carrerasCompletadas + 1,
								carrerasGanadas: (finalPosition === 1) ? stats.carrerasGanadas + 1 : stats.carrerasGanadas,
								carrerasPodio: (finalPosition <= 3) ? stats.carrerasPodio + 1 : stats.carrerasPodio,
								carrerasTop10: (finalPosition <= 10) ? stats.carrerasTop10 + 1 : stats.carrerasTop10,
								puntos: stats.puntos + puntosGanados,
								// Cálculo del valor del jugador según la fórmula
								valorFinal: valor.toFixed(2)
							});
							console.log("Puntos ganados: ", puntosGanados)
							console.log(finalPosition)
						})
						.catch(err => {
							console.error(`Error al obtener estadísticas de ${p.name}:`, err);
						});					
					
                    } else {
                        console.log('No se actualizaron estadísticas porque no hubo más de 12 pilotos en la carrera.');
                    }
                } else {
                    if (currentLeader == undefined || afkPlayers[currentLeader.id]) {
                        setLeader(p);
                        currentPosition = 0;
                        if (playerData.currentLap <= laps) {
                            announceLeader(p);
                        } else {
                            leaderFinished = true;
                            announceWinner(p);
                        }
                    } else if (playerData.currentLap > ongoingLap) {
                        setLeader(p);
                        announceLeader(p);
                        currentPosition = 0;
                    }
					if (playerData.currentLap == 1) {
						startTime = currentTime;
					}
                    currentPosition += 1;
                    room.sendAnnouncement(`Vuelta actual: ${playerData.currentLap}/${laps} | Pos. ${currentPosition}`, p.id, colors.lapChanged, fonts.lapChanged, sounds.lapChanged);
                    console.log(`pos: ${currentPosition} waso: ${p.name}`);
                }

				// Guardar la vuelta en la base de datos

				if (playerData.currentLap > 1) {
					window.saveLap(p.name, _Circuit.Name, lapTime)
						.then((result) => {
							// Variable para el mensaje sobre récord personal
							let personalRecordMessage = '';
				
							// Mensaje si se establece un nuevo récord global
							if (result.newRecord && result.globalRecord) {
								const previousHolder = result.previousGlobalHolder || "Nadie"; // Manejo de caso donde no hay poseedor anterior
								window.enviarVueltaRapidaDiscord(p.name, _Circuit.Name, lapTime.toFixed(3));
								room.getPlayerList().forEach(_player => {
									room.sendAnnouncement(
										`🚨 ATENCIÓN! ${p.name} acaba de marcar un nuevo récord global del circuito, con su tiempo de ${lapTime.toFixed(3)}. 🎖️`,
										_player.id,
										0xA5FF78,
										fonts.newBestLapTimePlayer,
										sounds.newBestLapTimePlayer
									);
								});
							}
				
							// Mensaje si se mejora el récord personal
							if (result.newRecord) {
								personalRecordMessage = `🎉 ¡Felicidades! Has establecido un nuevo récord personal en este circuito con un tiempo de ${lapTime.toFixed(3)} segundos.`;
							} else {
								personalRecordMessage = `Gap con récord personal: +${result.difference.toFixed(3)}s.`;
							}
							// Enviar el mensaje de récord personal
							room.sendAnnouncement(personalRecordMessage, p.id, colors.lapChanged, fonts.lapChanged, sounds.lapChanged);
						})
						.catch(err => {
							room.sendAnnouncement("🚫 Error al guardar la vuelta. Posiblemente no estés registrado.", p.id, colors.error, fonts.error, sounds.error); // Se le imprime al jugador para que nos pueda avisar.
							console.error("Error al guardar la vuelta:", err);
						});
				}
									
							  
            }
        }
    });
}



function qualySession(){
	checkPlayerLapsQualy();
	var timerQualy = room.getScores().time;
	if(timerQualy > timeQualy && !showedQualyResults){
		showedQualyResults = true;
		room.stopGame();
	}
}


async function wait(ms) {
    const start = performance.now();
    return new Promise(resolve => {
        function check() {
            if (performance.now() - start >= ms) {
                resolve();
            } else {
                setTimeout(check, 1); // Check again after 1ms
            }
        }
        setTimeout(check, 1); // Initial check after 1ms
    });
}

async function showQualyResults() {
	muteAll = true;
	let startTime, endTime;

	//console.log("Sending qualifying results header");
	startTime = Date.now();
	room.sendAnnouncement(`${"".padEnd(72, "-")}\nPosiciones de la clasificación\nPos\t| Piloto: Tiempo`, null, colors.qualyResults, fonts.qualyResults, sounds.notifyQualyPos);
	await wait(500);
	endTime = Date.now();
	//console.log(`Header sent, waited ${endTime - startTime}ms`);

	let pos = 0;

	for (const player of qualyList) {
		const playerName = player.auth in playersAuth ? playersAuth[player.auth].name : player.name;
		const playerTime = serializeSeconds(player.timeQualy);
		const resultLine = `${++pos}\t| ${playerName}: ${playerTime}`;
	
		// Usar un color diferente para el primer lugar
		const announcementColor = pos === 1 ? colors.playerInPole : colors.playerInResults;
	
		//console.log(`Sending result line for position ${pos}`);
		startTime = Date.now();
		room.sendAnnouncement(resultLine, null, announcementColor, fonts.playerInResults, sounds.playerInResults);
		await wait(500);
		endTime = Date.now();
		//console.log(`Result line for position ${pos} sent, waited ${endTime - startTime}ms`);
		if (pos === 1 && room.getPlayerList().length >= 12) {
			// Actualizar la cantidad de PolePositions usando Puppeteer
			window.updatePolePositions(playerName)
				.then(() => {
					console.log(`PolePositions de ${playerName} actualizada correctamente.`);
				})
				.catch(err => {
					console.error(`Error al actualizar PolePositions de ${playerName}:`, err);
				});
		}
	}		

	//console.log("Sending qualifying results footer");
	startTime = Date.now();
	room.sendAnnouncement(`${"".padEnd(72, "-")}`, null, colors.qualyResults, fonts.qualyResults, sounds.qualyResults);
	await wait(500);
	endTime = Date.now();
	//console.log(`Footer sent, waited ${endTime - startTime}ms`);

	return Promise.resolve();
}



function checkPlayerLapsQualy() {
    var players = getPlayersInTrack();

    players.forEach(p => {
        const playerDiscProps = room.getPlayerDiscProperties(p.id);
        const playerData = driversList[p.id];

        // Actualizar la posición anterior del jugador en cada gameTick
        let currentTime = room.getScores().time;
        let currentPerfTime = performance.now();
        let currentPos = { x: playerDiscProps.x, y: playerDiscProps.y, time: currentTime, perfTime: currentPerfTime };
        let previousPos = playerData.previousPos || currentPos;
        playerData.previousPos = currentPos;

        if (!ifInLapChangeZone(p) && playerData.lapChanged) {
            if (_Circuit.StartDirection == "X" && Math.sign(playerDiscProps.xspeed) == -1 * _Circuit.DriveDirection) {
                playerData.currentLap--;
                playerData.invalidQualyLap = true;
                room.sendAnnouncement(`Vuelta inválida, estás yendo al revés. Volvé al inicio con !rr`, p.id);
            } else if (_Circuit.StartDirection == "Y" && Math.sign(playerDiscProps.yspeed) == -1 * _Circuit.DriveDirection) {
                playerData.currentLap--;
                playerData.invalidQualyLap = true;
                room.sendAnnouncement(`Vuelta inválida, estás yendo al revés. Volvé al inicio con !rr`, p.id);
            }
            playerData.lapChanged = false;
        }

        if (ifInLapChangeZone(p)) {
            if (_Circuit.StartDirection == "X" && Math.sign(playerDiscProps.xspeed) == -1 * _Circuit.DriveDirection && !playerData.lapChanged) {
                playerData.lapChanged = true;
            } else if (_Circuit.StartDirection == "Y" && Math.sign(playerDiscProps.yspeed) == -1 * _Circuit.DriveDirection && !playerData.lapChanged) {
                playerData.lapChanged = true;
            } else if (!playerData.lapChanged) {
                playerData.lapChanged = true;
                playerData.lapTimes[0] = currentTime;
                playerData.currentLap++;

                // Calcular el tiempo exacto de cruce de la línea de meta
                let exactLapTime = currentTime;
                let ratio = 0; // Inicializar ratio
                if (_Circuit.StartDirection == "X" && previousPos.x !== currentPos.x) {
                    let finishLineX = _Circuit.DriveDirection === 1 ? _Circuit.MaxX : _Circuit.MinX;
                    let deltaX = previousPos.x - currentPos.x;
                    if (deltaX !== 0) {
                        ratio = (previousPos.x - finishLineX) / deltaX;
                        if (!isNaN(ratio) && isFinite(ratio)) {
                            exactLapTime = previousPos.time + ratio * (currentPos.time - previousPos.time);
                        }
                    }
                } else if (_Circuit.StartDirection == "Y" && previousPos.y !== currentPos.y) {
                    let finishLineY = _Circuit.DriveDirection === 1 ? _Circuit.MaxY : _Circuit.MinY;
                    let deltaY = previousPos.y - currentPos.y;
                    if (deltaY !== 0) {
                        ratio = (previousPos.y - finishLineY) / deltaY;
                        if (!isNaN(ratio) && isFinite(ratio)) {
                            exactLapTime = previousPos.time + ratio * (currentPos.time - previousPos.time);
                        }
                    }
                }

                // Calcular el tiempo de vuelta
                let lapTime = exactLapTime - (playerData.lastExactLapTime || exactLapTime);
                playerData.lastExactLapTime = exactLapTime; // Actualizar el tiempo exacto de la última vuelta

                if (playerData.currentLap > 1 && !playerData.invalidQualyLap) {
                    let indexQualy = qualyList.findIndex(player => player.auth === playersID[p.id].auth);
                    if (indexQualy !== -1) {
                        if (lapTime < qualyList[indexQualy].timeQualy) {
                            qualyList[indexQualy].timeQualy = lapTime;
                            qualyList.sort((player1, player2) => player1.timeQualy - player2.timeQualy);
                            indexQualy = qualyList.findIndex(player => player.auth === playersID[p.id].auth);

                            // Verificar si es el tiempo más rápido de la sesión
                            if (indexQualy === 0) {
                                room.getPlayerList().forEach(_player => room.sendAnnouncement(`Pos. ${indexQualy + 1} | ${p.name} | ${serializeSeconds(lapTime)}`, _player.id, colors.fastestLapTimeSession, fonts.newBestLapTimePlayer, sounds.newBestLapTimePlayer));
                            } else {
                                room.getPlayerList().filter(player => player.name != p.name).forEach(_player => room.sendAnnouncement(`Pos. ${indexQualy + 1} | ${p.name} | ${serializeSeconds(lapTime)}`, _player.id));
                                room.sendAnnouncement(`Pos. ${indexQualy + 1} | ${p.name} | ${serializeSeconds(lapTime)}`, p.id, colors.newBestLapTimePlayer, fonts.newBestLapTimePlayer, sounds.newBestLapTimePlayer);
                            }
                        } else {
                            room.sendAnnouncement(`Tiempo: ${serializeSeconds(lapTime)} | Mejor tiempo: ${serializeSeconds(qualyList[indexQualy].timeQualy)} | Pos. actual: ${indexQualy + 1}`, p.id, colors.slowerLapTimePlayer, fonts.slowerLapTimePlayer, sounds.slowerLapTimePlayer);
                        }
                    } else {
                        qualyList.push({ auth: playersID[p.id].auth, timeQualy: lapTime, name: p.name });
                        qualyList.sort((player1, player2) => player1.timeQualy - player2.timeQualy);
                        indexQualy = qualyList.findIndex(player => player.auth === playersID[p.id].auth);

                        // Verificar si es el tiempo más rápido de la sesión
                        if (indexQualy === 0) {
                            room.getPlayerList().forEach(_player => room.sendAnnouncement(`Pos. ${indexQualy + 1} | ${p.name} | ${serializeSeconds(lapTime)}`, _player.id, colors.fastestLapTimeSession, fonts.newBestLapTimePlayer, sounds.newBestLapTimePlayer));
                        } else {
                            room.getPlayerList().filter(player => player.name != p.name).forEach(_player => room.sendAnnouncement(`Pos. ${indexQualy + 1} | ${p.name} | ${serializeSeconds(lapTime)}`, _player.id));
                            room.sendAnnouncement(`Pos. ${indexQualy + 1} | ${p.name} | ${serializeSeconds(lapTime)}`, p.id, colors.newBestLapTimePlayer, fonts.newBestLapTimePlayer, sounds.newBestLapTimePlayer);
                        }
                    }

						window.saveLap(p.name, _Circuit.Name, lapTime)
							.then((result) => {
								// Variable para el mensaje sobre récord personal
								let personalRecordMessage = '';
					
								// Mensaje si se establece un nuevo récord global
								if (result.newRecord && result.globalRecord) {
									const previousHolder = result.previousGlobalHolder || "Nadie"; // Manejo de caso donde no hay poseedor anterior
									window.enviarVueltaRapidaDiscord(p.name, _Circuit.Name, lapTime.toFixed(3));
									room.getPlayerList().forEach(_player => {
										room.sendAnnouncement(
											`🚨 ATENCIÓN! Nuevo récord global de ${p.name}: ${lapTime.toFixed(3)}. 🎖️`,
											_player.id,
											0xA5FF78,
											fonts.newBestLapTimePlayer,
											sounds.newBestLapTimePlayer
										);
									});
								}
					
								// Mensaje si se mejora el récord personal
								if (result.newRecord) {
									personalRecordMessage = `🎉 Nuevo récord personal en este circuito: ${lapTime.toFixed(3)} segundos.`;
								} else {
									personalRecordMessage = `Gap con record personal: +${result.difference.toFixed(3)}s.`;
								}
					
								// Enviar el mensaje de récord personal
								room.sendAnnouncement(personalRecordMessage, p.id, colors.lapChanged, fonts.lapChanged, sounds.lapChanged);
							})
							.catch(err => {
								room.sendAnnouncement("🚫 Error al guardar la vuelta.", p.id, colors.error, fonts.error, sounds.error); // Se le imprime al jugador para que nos pueda avisar.
								console.error("Error al guardar la vuelta:", err);
							});
                } else {
                    playerData.invalidQualyLap = false;
                }
                room.sendAnnouncement(`🏎️ Comenzando vuelta lanzada`, p.id, 0x2FDE52);

                // Almacenar el récord personal y global
            }
        }
    });
}


function getPlayersInTrack(){
	return room.getPlayerList().filter(p => (driversList[p.id] !== undefined && room.getPlayerDiscProperties(p.id) !== null));
}

//Funciones para configurar variables de cada jugador en la lista playerList y configurar la sesion a jugar
//#region



function setPlayerConfig(player) {
    driversList[player.id] = {
        currentLap: 0,
        lapChanged: false,
        lapTimes: [0, 0, 0],
        invalidQualyLap: false,
        xPos: undefined,
        yPos: undefined,
        xSpeed: undefined,
        ySpeed: undefined,
        startedRace: false,
        previousPos: { x: 0, y: 0, time: 0, perfTime: 0 }, // Inicializar previousPos con atributos
        lastExactLapTime: 0, // Añadir lastExactLapTime para almacenar el tiempo exacto de la última vuelta
		currentPosition: 0,
    };
}
//#endregion

//Funciones para Public Mode
//#region

async function endSession() {
	if (onQualySession) {
		onQualySession = false;
		let form = new FormData();

		let circuitoNombre = _Circuit.Name; 
		
		// Crear la variable fecha en formato dd-mm-yyyy
		let fecha = new Date();
		let dia = String(fecha.getDate()).padStart(2, '0'); // Obtener el día
		let mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Obtener el mes (0-11 así que sumamos 1)
		let anio = fecha.getFullYear(); // Obtener el año
		fecha = `${dia}-${mes}-${anio}`; // Formatear la fecha
		
		// Crear el nombre del archivo
		let nombreArchivo = `Qualy - ${circuitoNombre} - ${fecha}.hbr2`;
		
		form.append(null, new File([room.stopRecording()], nombreArchivo, { type: "text/plain" }));
		
		let xhr = new XMLHttpRequest();
		xhr.open("POST", "https://discord.com/api/webhooks/1302004204688248884/jdScN1IuUO4nyWWVk-KPOg_APRzAQShhgEhsJZeNgsSo-5-hNgF3sOXd1q5zMfsZ0QRy");
		xhr.send(form);
		showedQualyResults = false;

		if (qualyList.length != 0) {
			await showQualyResults();
		}
		room.sendAnnouncement(`>>> Fin de Sesión de Clasificación <<<`, null, colors.sessionEnd, fonts.sessionEnd, sounds.sessionEnd);
		muteAll = false;
	} else if (onRaceSession) {
		onRaceSession = false;
		showedRaceResults = false;
		let form = new FormData();
		let circuitoNombre = _Circuit.Name; 
		
		// Crear la variable fecha en formato dd-mm-yyyy
		let fecha = new Date();
		let dia = String(fecha.getDate()).padStart(2, '0'); // Obtener el día
		let mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Obtener el mes (0-11 así que sumamos 1)
		let anio = fecha.getFullYear(); // Obtener el año
		fecha = `${dia}-${mes}-${anio}`; // Formatear la fecha
		
		// Crear el nombre del archivo
		let nombreArchivo = `Carrera - ${circuitoNombre} - ${fecha}.hbr2`;
		
		form.append(null, new File([room.stopRecording()], nombreArchivo, { type: "text/plain" }));
		
		let xhr = new XMLHttpRequest();
		xhr.open("POST", "https://discord.com/api/webhooks/1302004204688248884/jdScN1IuUO4nyWWVk-KPOg_APRzAQShhgEhsJZeNgsSo-5-hNgF3sOXd1q5zMfsZ0QRy");
		xhr.send(form);
		if (raceResults.length != 0) {
			await showRaceResults();
		}
		else {
			noPlayers = true;
		}

		if(onChampionship) {
			await updateChampionshipStandings();
		}
		room.sendAnnouncement(`>>> Fin de Sesión de Carrera <<<`, null, colors.sessionEnd, fonts.sessionEnd, sounds.sessionEnd);
		muteAll = false;

		// Llamar a resetRaceStatus cuando la sesión de carrera termine
		resetRaceStatus();
	}
}

function hasActivePlayers() {
	const players = room.getPlayerList();
	const activePlayers = players.filter(player => !afkPlayers[player.id]);
	return activePlayers.length > 0;
}


function circuitChange(timeout) {
	setTimeout(() => {
		if (timeout != 0) {
			room.sendAnnouncement(`Cambio de mapa en 10 segundos...`, null, colors.mapLoad, fonts.mapLoad, sounds.mapLoad);
		}
		setTimeout(() => {
			let indexCircuit = _Circuits.findIndex(circuit => _Circuit.Name == circuit.Name);
			if(indexCircuit == _Circuits.length - 1) {
				room.setCustomStadium(Circuits[0]);
			} else {
				room.setCustomStadium(Circuits[indexCircuit + 1]);
			}
			qualyIsSet = false;
			raceIsSet = false;
			setTimeout(() => configPublicMode(), 1000);
		}, timeout);
	}, 1000); // Espera de 1 segundo antes de anunciar el cambio de mapa
}


// implementar la función shuffleCircuits para cambiar el orden de los mapas, este shuffe debe darse una vez que circuitChange termine de recorrer el arreglo


function shuffleCircuits(circuits) {
	for (let i = circuits.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[circuits[i], circuits[j]] = [circuits[j], circuits[i]];
	}
	return circuits;
}


async function configPublicMode(){
	if(!qualyIsSet){
		qualyIsSet = true;
		setQualySession();
	} else if(!raceIsSet){
		raceIsSet = true;
		if (hasActivePlayers()) {
			room.sendAnnouncement(`La carrera está por comenzar...`);
			setTimeout(() => {
				setRaceSession();
			}, 1000); // Espera de 1 segundo antes de ejecutar setRaceSession()
		}
		else {
			room.sendAnnouncement(`No hay jugadores activos para iniciar la carrera`);
			circuitChange(0);
		}
	
	} 
	else if (noPlayers){
		room.sendAnnouncement(`No hay jugadores activos para terminar la carrera`);
		circuitChange(0);
	}
	else {
		circuitChange(9000);
	}
}

function checkPlayerAdmin(player){
	let isMultipleAdminAccount = player.conn in playersConn && room.getPlayer(playersConn[player.conn].id)?.admin === true;
	let isNameAdmin = adminsNames.includes(player.name);
	let isAuthAdmin = adminsAuth.includes(player.auth); // Verificar si player.auth está en adminsAuth


	if(((isAuthAdmin && isNameAdmin) || isMultipleAdminAccount) && publicMode){
		//console.log("entra")
		room.setPlayerAdmin(player.id,true);
		
		for (let playerID in multipleAdminAccounts){
			if(multipleAdminAccounts[playerID].conn === player.conn)  multipleAdminAccounts[playerID].originalAccountName = player.name;
		}
		if(isMultipleAdminAccount){
			multipleAdminAccounts[player.id] = {conn: player.conn, originalAccountName: playersConn[player.conn].name}

			let admins = room.getPlayerList().filter( player => player.admin === true);
			admins.forEach( admin => {
				room.sendAnnouncement(`${playersConn[player.conn].name} ingreso una cuenta secundaria: ${player.name}`,admin.id);
			});

			return false;
		}
	}
	if ((player.name == "CHARLES LECLERC" && isAuthAdmin) || isMultipleAdminAccount) {
		room.setPlayerAdmin(player.id,true);
	}
	
	if(isNameAdmin && !isAuthAdmin){
		//console.log("no entra")
		room.kickPlayer(player.id, "No puedes usar el nick de un admin", false);
		return false;
	}
	return true;
}

function addNewPlayer(player){
	playersID[player.id] = {auth: player.auth, conn: player.conn};
	playersConn[player.conn] = {name: player.name, id: player.id, isInTheRoom: true};
	playersAuth[player.auth] = {name: player.name, id: player.id, isInTheRoom: true};
}

//#endregion

function setRaceSession(lapsRace = DEFAULT_LAPS){
	stopCamera = false;
	laps = lapsRace;
	raceResults = [];
	raceList = [];
	lappedsList = [];
	_Circuit.BestTime = [0,undefined];
	noPlayers = false;

	room.sendAnnouncement(`>>> Inicio de Sesión de Carrera <<<`,null,colors.sessionStart,fonts.sessionStart,sounds.sessionStart);
	room.sendAnnouncement(`Vueltas: ${laps}`,null,colors.laps,fonts.laps,sounds.laps);

	setGrid();

	room.getPlayerList().filter(player => !(player.id in multipleAdminAccounts) && !(afkPlayers[player.id])).forEach(player => {
		setPlayerConfig(player);
		room.setPlayerTeam(player.id,_Circuit.Team);
	});
	
	onRaceSession = true;
	room.startGame();
	room.startRecording();
}


function setQualySession(seconds = DEFAULT_TIME_QUALY){
	timeQualy = seconds;
	showedQualyResults = false;
	qualyList = [];

	if (onChampionship) {
		room.getPlayerList()
			.filter(player => !(player.id in multipleAdminAccounts))
			.forEach(player => setPlayerConfig(player));
	} else {
		room.getPlayerList()
			.filter(player => !(player.id in multipleAdminAccounts))
			.forEach(player => setPlayerConfig(player));
	}

	onQualySession = true;
	room.startGame();
	room.startRecording();
	
	
	if (onChampionship) {
		room.getPlayerList().filter(player => !(player.id in multipleAdminAccounts) && !afkPlayers[player.id]).forEach(player => {
			room.setPlayerTeam(player.id,_Circuit.Team);
			room.setPlayerDiscProperties(player.id, {cGroup: room.CollisionFlags.c0});
			qualyPosReset(player);
		});
	} else {
		room.getPlayerList().filter(player => !(player.id in multipleAdminAccounts) && !afkPlayers[player.id]).forEach(player => {
			room.setPlayerTeam(player.id,_Circuit.Team);
			room.setPlayerDiscProperties(player.id, {cGroup: room.CollisionFlags.c0});
			qualyPosReset(player);
		});
	}

	room.sendAnnouncement(`>>> Inicio de Sesión de Clasificación <<<`,null,colors.sessionStart,fonts.sessionStart,sounds.sessionStart);
	if (timeQualy != Infinity) {
		room.sendAnnouncement(`Tiempo de clasificación: ${timeQualy/60} minutos`,null,colors.timeQualy,fonts.timeQualy,sounds.timeQualy);
	}
	else {
		room.sendAnnouncement(`El tiempo de clasificación es infinito`,null,colors.timeQualy,fonts.timeQualy,sounds.timeQualy);
	}
}





//Funciones de sala

room.onGameStart = function(byPlayer){
	byPlayer == null ? console.log(`Game started`) : console.log(`Game started by ${byPlayer.name}`);

	if(!onQualySession && !onRaceSession){
		let playersAdmins = room.getPlayerList().filter(player => player.admin == true);
		playersAdmins.forEach(player =>{
			room.sendAnnouncement(`No se ha configurado ninguna sesión`,player.id);
		});
		room.stopGame();
	}
	
	// Para que sessionStarted no sea siempre true y así poder volver a revisar en onGameTick
	if(!onQualySession) {
		sessionStarted = false;
	};
};

room.onGameStop = async function(byPlayer){
	byPlayer == null ? console.log(`Game stopped`) : console.log(`Game stopped by ${byPlayer.name}`);

	let players = room.getPlayerList();
	players.forEach(player => {
		room.setPlayerTeam(player.id,0);
		delete driversList[player.id];
	});

	await endSession();

	if(publicMode) configPublicMode();
}




// Añade un nuevo objeto para almacenar los jugadores AFK, una variable para controlar el inicio de la carrera, un nuevo objeto para almacenar la última actividad de cada jugador, un objeto para controlar si un jugador se movió antes del inicio de la sesión y un objeto para controlar si un jugador no puede ser marcado como AFK.

let afkPlayers = {};
let sessionStarted = false;
let lastActive = {};
let activeBeforeStart = {};
let notAFKable = {};
let velocities = [];


function checkAFK(){
	let now = Date.now();
	let players = room.getPlayerList();

	players.forEach(player => {
		if(player.team == _Circuit.Team) {
			/*
			velocity = getVelocity(player.id);
			*/

			if (room.getScores().time < 10 && activeBeforeStart[player.id] === true) {
				notAFKable[player.id] = true;
			}
			else {
				notAFKable[player.id] = false;
			}
			// Si el jugador no ha tenido actividad en los últimos 15 segundos, lo marca como AFK SOLO una vez largada la carrera +3 segundos
			// Falta chequear para echar al jugador si se movió antes de la largada pero estuvo quieto en el momento de la largada, speed tiene q ser 0
			if (((now - lastActive[player.id] > 5000 && velocities[player.id] == 0) || (lastActive[player.id] === undefined)) && !notAFKable[player.id]) {
				// Esta condición es para que no te spamee el mensaje de afk
				if (!afkPlayers[player.id]) {
					afkPlayers[player.id] = true;
					if(room.getPlayerList == max && !player.admin && !onChampionship) {
						room.kickPlayer(player.id, "AFK en sala llena", false);
					}
					room.setPlayerTeam(player.id, 0);
					room.sendAnnouncement("Ahora estás AFK, para volver usá el comando !back", player.id, 0x24DCF0, "bold", 2)
					

					if (room.getPlayerList().length >= 12 && onRaceSession) { 
						window.getUserStats(player.name)
						.then(stats => {
							window.updateStats(player.name, {
								carrerasCompletadas: stats.carrerasCompletadas + 1
							});
						room.sendAnnouncement("Tu carrera se dio como finalizada - DNF.", player.id, 0x24DCF0, "bold", 2)
						})
						.catch(err => {
							console.error(`Error al obtener estadísticas de ${p.name}:`, err);
						});	
					}
				}
			}
		}
	});
};

const MIN_VELOCITY_THRESHOLD = 0.2; // Umbral mínimo para considerar la velocidad como 0

function getVelocity(id){
	// Obtiene las propiedades del disco del jugador
	let discProperties = room.getPlayerDiscProperties(id);

	if (discProperties != undefined) {
		// Calcula la velocidad del jugador
		velocity = Math.hypot(discProperties.xspeed, discProperties.yspeed) * 10;
		// Si la velocidad es menor que el umbral, se considera como 0
		if (velocity < MIN_VELOCITY_THRESHOLD) {
			velocity = 0;
		}
	}

	return velocity;
};


function manageSpeed() {
	let players = getPlayersInTrack();

	players.forEach(player => {
		if (player.team == _Circuit.Team) {
			let velocity = getVelocity(player.id);
			velocities[player.id] = velocity;
		}
	});
};


function showPlayersSpeed() {
	let players = getPlayersInTrack();
	players.forEach(player => {
		if (playersWithSpeedEnabled[player.id]) {
			let speed = Math.round(velocities[player.id]);
			room.setPlayerAvatar(player.id, speed.toString());
			// console.log(velocities[player.id])
		}
	});
}

let gears = {};

function manageGears() {
    let players = getPlayersInTrack();

    players.forEach(player => {
        if (player.team == _Circuit.Team) {
            let velocity = getVelocity(player.id);
            let gear = getGearFromVelocity(velocity);
            gears[player.id] = gear;
        }
    });
};

function showPlayersGear() {
    let players = getPlayersInTrack();
    players.forEach(player => {
        if (playersWithGearsEnabled[player.id]) {
            let gear = gears[player.id];
			//console.log(gear)
            room.setPlayerAvatar(player.id, gear.toString());
            // console.log(gears[player.id]);
        }
    });
}

function getGearFromVelocity(velocity) {
    if (velocity < 9) return 1;   // 1 - 8
    if (velocity < 16) return 2;  // 9 - 15
    if (velocity < 24) return 3;  // 16 - 23
    if (velocity < 32) return 4;  // 24 - 31
    if (velocity < 40) return 5;  // 32 - 39
    if (velocity < 48) return 6;  // 40 - 47
    if (velocity <= 58) return 7; // 48 - 58
    return 8;                     // > 58
}


room.onGameTick = function(){
	if(onQualySession) qualySession();
		else if(onRaceSession) raceSession();

	// Para detectar si el tiempo empezó a correr y así el checkAFK() no te saca antes de la largada
	if (room.getScores() && room.getScores().time > 0) {
		sessionStarted = true;
	};
	// Si la carrera ha comenzado y pasaron más de 3 segundos comprueba si algún jugador está AFK
	if (sessionStarted && onRaceSession && room.getScores().time > 2) {
		checkAFK();
	};

	if(onQualySession || onRaceSession) {
		manageSpeed();
		showPlayersSpeed();
		manageGears();
		showPlayersGear();
	}
};


room.onPlayerActivity = function(player) {
	if (!sessionStarted && onRaceSession) {
		activeBeforeStart[player.id] = true
	}
	// Actualiza el tiempo de la última actividad del jugador, es undefined si no se mueve nunca
	lastActive[player.id] = Date.now();
};

room.onPlayerTeamChange = function(changedPlayer,byPlayer){
	byPlayer == null ? console.log(`${changedPlayer.name} was moved to ${teams[changedPlayer.team]}`) : console.log(`${changedPlayer.name} was moved to ${teams[changedPlayer.team]} by ${byPlayer.name}`);
	//if(AFK.includes(changedPlayer.id)) room.setPlayerTeam(changedPlayer,0);
	if(changedPlayer.team !== 0){
		if(changedPlayer.id in multipleAdminAccounts) {
			room.setPlayerTeam(changedPlayer.id, 0);
			if(byPlayer !== null){
				let admins = room.getPlayerList().filter( player => player.admin === true);
				admins.forEach( player => {
					room.sendAnnouncement(`${byPlayer.name}: No puede ingresar una cuenta secundaria a la pista (${changedPlayer.name}). Cuenta original: ${multipleAdminAccounts[changedPlayer.id].originalAccountName}`,player.id);
				});
			}
		}
		else if(!(changedPlayer.id in driversList)) setPlayerConfig(changedPlayer);
	}
	else if(changedPlayer.id in driversList) delete driversList[changedPlayer.id];

	if (changedPlayer.team !== 0 && afkPlayers[changedPlayer.id]) {
			room.setPlayerTeam(changedPlayer.id, 0);
		if (byPlayer !== null) {
		room.sendAnnouncement("No se puede meter a un jugador AFK!", byPlayer.id)}
		};

};


let playersWithSpeedEnabled = {};
let playersWithGearsEnabled = {};


room.onPlayerChat = function(player, message) {
    //console.log(`${player.name}: ${message}`);
    if (message[0] == "!") {
        messageNormalized = message.toLowerCase().split(" ")[0];
        const argument = message.split(' ')[1];  // El argumento para !register, !login, !stats, u otros comandos

        // Manejo de comandos ya existentes
        if (messageNormalized == commands.admin && message.toLowerCase().split(" ")[1] == "c1q") {
            room.setPlayerAdmin(player.id, !player.admin);
            return false;
        } 
        else if (messageNormalized == commands.help) {
            room.sendAnnouncement("Comandos disponibles: !help, !formato, !discord, !afk, !back, !rr (solo en clasificación), !sesion, !maps, !speed (en sesión activa), !fl (solo en carrera), !times (solo en clasificación), !bb, !nv", player.id, colors.commands, fonts.commands, sounds.commands);
			
            room.sendAnnouncement("Con !stats podes ver tus estadísticas, y con !top (estadistica) los ranking. Por ejemplo, !top victorias", player.id, colors.commands, fonts.commands, sounds.commands);
			
			if (!loggedInPlayers[player.name]) {
				room.sendAnnouncement("Registrate con !register (tu contraseña).   ejemplo: !register soycolapinto", player.id, colors.commands, fonts.commands, sounds.commands);
				room.sendAnnouncement("y posteriormente ingresá con !login (tu contraseña).   ejemplo: !login soycolapinto", player.id, colors.commands, fonts.commands, sounds.commands);
			}
            return false;
        } 
        else if (messageNormalized == commands.mapInfo) {
            if (_Circuit.BestTime[0] == 0) {
                room.sendAnnouncement(`No hay mejor vuelta todavía`, player.id, colors.mapInfo, fonts.mapInfo, sounds.mapInfo);
            } else {
                room.sendAnnouncement(`Vuelta rápida en ${_Circuit.Name}: ${serializeSeconds(_Circuit.BestTime[0])} | Piloto: ${_Circuit.BestTime[1]}`, player.id, colors.mapInfo, fonts.mapInfo, sounds.mapInfo);
            }
            return false;
        }
        else if (messageNormalized == "!rr") {
            if (onQualySession) {
                if (room.getScores() != null && room.getPlayerDiscProperties(player.id) != null) {
                    qualyPosReset(player);
                    if (driversList[player.id].currentLap > 0) driversList[player.id].currentLap--;
                    driversList[player.id].invalidQualyLap = true;
                } else {
                    room.sendAnnouncement(`Solo se puede utilizar este comando dentro de la pista.`, player.id);
                    return false;
                }
            } else room.sendAnnouncement(`Solo se puede utilizar este comando cuando hay una sesión de clasficación activa.`, player.id);
            return false;
        }
        else if (messageNormalized == "!discord") {
            room.sendAnnouncement("Discord del host: https://discord.gg/j5EnBaYJjw", player.id, 0x2FDE52, "italic", 2)
            return false;
        }
        else if (messageNormalized == "!afk") {
            if (afkPlayers[player.id]) {
                room.sendAnnouncement("Ya estabas AFK, para volver usa el comando !back", player.id, 0xFF4A4A, "bold", 2)
                return false;
            }
            afkPlayers[player.id] = true;
            if (onQualySession || onRaceSession) {
                room.setPlayerTeam(player.id, 0);
            }
            room.sendAnnouncement("Estás AFK, para volver usa el comando !back", player.id, 0x24DCF0, "bold", 2)
			if (room.getPlayerList().length >= 12 && onRaceSession) { 
				window.getUserStats(player.name)
				.then(stats => {
					window.updateStats(player.name, {
						carrerasCompletadas: stats.carrerasCompletadas + 1
					});
				room.sendAnnouncement("Tu carrera se dio como finalizada - DNF.", player.id, 0x24DCF0, "bold", 2)
				})
				.catch(err => {
					console.error(`Error al obtener estadísticas de ${p.name}:`, err);
				});	
			}
            if (room.getPlayerList().length == max && !player.admin && !onChampionship) {
                room.kickPlayer(player.id, `AFK en sala llena!`, false)
            }
            return false;
        }
        else if (messageNormalized == "!back") {
            if (!afkPlayers[player.id]) {
                room.sendAnnouncement("No estabas AFK!", player.id, 0xFF4A4A, "bold", 2)
                return false;
            } else {
                afkPlayers[player.id] = false;
            }
            if (onQualySession) {
                if (!onChampionship) {
                    room.setPlayerTeam(player.id, _Circuit.Team);
                    room.setPlayerDiscProperties(player.id, { cGroup: room.CollisionFlags.c0 });
                    qualyPosReset(player);
                    room.sendAnnouncement("Ya no estás AFK!", player.id, 0x24DCF0, "bold", 2)
                } else {
                    room.setPlayerTeam(player.id, _Circuit.Team);
                    room.setPlayerDiscProperties(player.id, { cGroup: room.CollisionFlags.c0 });
                    qualyPosReset(player);
                    room.sendAnnouncement("Ya no estás AFK!", player.id, 0x24DCF0, "bold", 2)
                }
            } else {
                room.sendAnnouncement("Ya no estás AFK!", player.id, 0x24DCF0, "bold", 2)
                room.sendAnnouncement(`Volverás a la pista en la siguiente sesión`, player.id, 0x2FDE52, "italic", 2);
            }
            return false;
        }
        else if (messageNormalized == "!formato") {
            room.sendAnnouncement(`El host público se divide en 2 partes:\nCLASIFICACIÓN: Da tu mejor vuelta en menos de 2 minutos para determinar tu posición inicial para la carrera.\nCARRERA: Competí contra los demás para quedar lo más arriba posible en una carrera de 3 vueltas.`, player.id, 0xFFF940, "italic", 2);
            return false;
        }
        else if (messageNormalized == "!sesion") {
            if (onQualySession) {
                room.sendAnnouncement(`🏎️ Sesión actual: CLASIFICACIÓN a ${timeQualy / 60} minuto/s en curso.`, player.id, 0xA5FF78, "bold", 2);
            } else if (onRaceSession) {
                room.sendAnnouncement(`🏁 Sesión actual: CARRERA a ${laps} vueltas en curso. Se paciente y esperá tu turno!`, player.id, 0xA5FF78, "bold", 2);
            } else room.sendAnnouncement(`📢 NO HAY SESIÓN CONFIGURADA.`, player.id, 0xA5FF78, "bold", 2);
            return false;
        }
        else if (messageNormalized == "!bb" || messageNormalized == "!nv") {
            room.kickPlayer(player.id, "Adéu!")
        }
        else if (messageNormalized == "!times") {
            if (onQualySession) {
                if (qualyList.length != 0) {
                    let header = `${"".padEnd(72, "-")}\nPosiciones de clasificación:\n`;
                    let footer = `${"".padEnd(72, "-")}`;
                    let qualyResults = "";

                    qualyList.forEach((player, index) => {
                        qualyResults += `Pos. ${index + 1} | ${player.name}: ${serializeSeconds(qualyList[index].timeQualy)}\n`;
                    });

                    room.sendAnnouncement(header, player.id, colors.qualyResults, fonts.qualyResults, sounds.notifyQualyPos);
                    room.sendAnnouncement(qualyResults, player.id, colors.playerInResults, fonts.playerInResults, sounds.playerInResults);
                    room.sendAnnouncement(footer, player.id, colors.qualyResults, fonts.qualyResults, sounds.notifyQualyPos);

                    return false;
                } else {
                    room.sendAnnouncement(`Aún no hay tiempos de clasificación.`, player.id);
                    return false;
                }
            } else {
                room.sendAnnouncement(`Solo se puede utilizar este comando cuando hay una sesión de clasificación activa.`, player.id);
                return false;
            }
        }
        else if (message.toLowerCase().split(" ")[0] == commands.speed) {
            if (driversList[player.id] !== undefined) {
                if (!playersWithSpeedEnabled[player.id] && !playersWithGearsEnabled[player.id]) {
                    playersWithSpeedEnabled[player.id] = true;
                    room.sendAnnouncement(`Speed is turned ON`, player.id, colors.speed, fonts.speed, sounds.speed);
                } else {
                    delete playersWithSpeedEnabled[player.id]
                    room.setPlayerAvatar(player.id, null)
                    room.sendAnnouncement(`Speed is turned OFF`, player.id, colors.speed, fonts.speed, sounds.speed);
                }
            } else {
				room.sendAnnouncement("No estás en una sesión.", player.id, colors.speed, fonts.speed, sounds.speed);
            }
            return false;
        }
		
        else if (message.toLowerCase().split(" ")[0] == "!marchas") {
            if (driversList[player.id] !== undefined) {
                if (!playersWithGearsEnabled[player.id] && !playersWithSpeedEnabled[player.id]) {
                    playersWithGearsEnabled[player.id] = true;
                    room.sendAnnouncement(`Habilitaste la visualización de marchas!`, player.id, colors.speed, fonts.speed, sounds.speed);
                } else {
                    delete playersWithGearsEnabled[player.id]
                    room.setPlayerAvatar(player.id, null)
                    room.sendAnnouncement(`Deshabilitaste la visualización de marchas!`, player.id, colors.speed, fonts.speed, sounds.speed);
                }
            } else {
				room.sendAnnouncement("No estás en una sesión.", player.id, colors.speed, fonts.speed, sounds.speed);
            }
            return false;
        }

        // Nuevos comandos añadidos: Top, Registro, Login y Stats

		else if (messageNormalized === '!top') {
			const stat = argument || 'puntos';
		
			// Informar siempre las opciones disponibles al jugador
			room.sendAnnouncement("🌟 Opciones de estadísticas disponibles: 'puntos', 'victorias', 'poles', 'carreras', 'podios', 'top10', 'valor'. Usa '!top <opción>' para ver el ranking correspondiente.", player.id, 0xffffff, "normal", 1);
		
			window.getTopPlayers(stat)
			.then(players => {
				if (!players) {
					room.sendAnnouncement("🚨 Error al obtener el ranking. Inténtalo nuevamente más tarde.", player.id, 0xff0000, "normal", 1);
					return;
				}
		
				const topPlayers = players.slice(0, 10); // Top 10
				let playerStatValue = '';
				let playerPosition = '';
		
				// Mostrar el Top 10
				topPlayers.forEach((topPlayer, index) => {
					let medal = (index === 0) ? '🥇' : (index === 1) ? '🥈' : (index === 2) ? '🥉' : '➖';
					let color = (index === 0) ? 0xffd700 : (index === 1) ? 0xc0c0c0 : (index === 2) ? 0xcd7f32 : 0xffffff;
		
					let playerStatMessage = '';
					if (stat === 'puntos') {
						playerStatMessage = `${topPlayer.statValue} puntos (${topPlayer.stats.carrerasGanadas} victorias en ${topPlayer.stats.carrerasCompletadas} carreras)`;
					} else if (stat === 'victorias') {
						playerStatMessage = `${topPlayer.stats.carrerasGanadas} victorias`;
					} else if (stat === 'poles') {
						playerStatMessage = `${topPlayer.stats.polepositions} poles en ${topPlayer.stats.carrerasCompletadas} carreras`;
					} else if (stat === 'carreras') {
						playerStatMessage = `${topPlayer.stats.carrerasCompletadas} carreras`;
					} else if (stat === 'podios') {
						playerStatMessage = `${topPlayer.stats.carrerasPodio} podios en ${topPlayer.stats.carrerasCompletadas} carreras`;
					} else if (stat === 'top10') {
						playerStatMessage = `${topPlayer.stats.carrerasTop10} veces en el top 10, en un total de ${topPlayer.stats.carrerasCompletadas} carreras`;
					} else if (stat === 'valor') {
						playerStatMessage = `$${topPlayer.stats.valorFinal.toFixed(2)}`;
					} else if (stat === 'promedio') {
						playerStatMessage = `Promedio: ${(topPlayer.statValue).toFixed(2)}`;
					} else {
						playerStatMessage = `${topPlayer.statValue} ${stat}`;
					}
		
					room.sendAnnouncement(`${medal} ${topPlayer.rank}. ${topPlayer.nombre} | ${playerStatMessage}`, player.id, color, 1);
		
					// Verifica si el jugador actual está en el Top 10
					if (topPlayer.nombre === player.name) {
						playerStatValue = topPlayer.statValue;
						playerPosition = topPlayer.rank;
					}
				});
		
				// Si el jugador no estaba en el Top 10, buscar su posición completa en la lista
				if (!playerPosition && !playerStatValue) {
					const playerIndex = players.findIndex(p => p.nombre === player.name);
					if (playerIndex !== -1) {
						const playerInfo = players[playerIndex];
						playerStatValue = playerInfo.statValue;
						playerPosition = playerInfo.rank;
					}
				}
		
				// Enviar mensaje de ranking personal
				if (playerPosition && playerStatValue) {
					let rankingMessage = '';
					if(stat == "valor") { stat == "valorFinal"; }
					switch (stat) {
						case 'puntos':
							rankingMessage = `Estás en la posición ${playerPosition} con ${playerStatValue} puntos.`;
							break;
						case 'victorias':
							rankingMessage = `Estás en la posición ${playerPosition} con ${playerStatValue} victorias.`;
							break;
						case 'poles':
							rankingMessage = `Te encuentras en la posición ${playerPosition} con ${playerStatValue} poles.`;
							break;
						case 'carreras':
							rankingMessage = `Estás en la posición ${playerPosition} con ${playerStatValue} carreras completadas.`;
							break;
						case 'podios':
							rankingMessage = `Estás en la posición ${playerPosition} con ${playerStatValue} podios.`;
							break;
						case 'top10':
							rankingMessage = `Estás en la posición ${playerPosition} con ${playerStatValue} veces en el top 10.`;
							break;
						case 'valor':
							rankingMessage = `Estás en la posición ${playerPosition} con un valor de $${playerStatValue}.`;
							break;
						default:
							rankingMessage = `Estás en la posición ${playerPosition} con ${playerStatValue} ${stat}.`;
							break;
					}
					room.sendAnnouncement(rankingMessage, player.id, colors.lapChanged, fonts.lapChanged, 1);
				} else {
					room.sendAnnouncement(`No te encuentras en el ranking de ${stat} o tienes 0.`, player.id, colors.lapChanged, fonts.lapChanged, sounds.lapChanged);
				}
			})
			.catch(err => {
				console.error("Error al obtener el ranking:", err);
			});
		
			return false;
		}
		else if (messageNormalized === '!hastalav1sta') {
			const arg = message.split(' '); 
			if (arg.length <= 1) {
				room.sendAnnouncement("❌ Te faltó especificar nombre o el usuario no está en la sala", player.id, 0xff0000, "normal", 1);
				return false; 
			} else {
				const args = arg.slice(1).join(' ').trim(); 
				const jugador = room.getPlayerList().find(jugador => jugador.name === args);
		
				if (jugador) {
					bannedPlayers.push({ name: args, conn: jugador.conn }); // Asumiendo que 'conn' está disponible aquí
					
					room.kickPlayer(jugador.id, "Te fuiste baneado por nuestro admin oculto.", true);
					// Se agrega el ban a la bd para asegurar persistencia
					window.addBannedUser(jugador.name, jugador.conn)
					.then(response => {
						console.log(response); 
					})
					.catch(err => {
						console.error('Error al guardar el ban en la base de datos:', err.message);
					});
				} else {
					room.sendAnnouncement("Te faltó especificar nombre o el usuario no está en la sala. No etiquetes, escribí el nombre a mano o copialo y pegalo.", player.id, colors.speed, fonts.speed, sounds.speed);
					return false;
				}
			}
		}
						
		else if (messageNormalized === '!pediradmin' || messageNormalized === '!pedirAdmin') {
			const args = message.split(' '); // Divide el mensaje completo en partes
		
			// Verificar si hay más de una parte y unir el resto en la razón
			if (args.length <= 1) {
				room.sendAnnouncement("❌ Por favor, proporciona una razón después de '!pediradmin'.", player.id, 0xff0000, "normal", 1);
				return; 
			}
		
			// Toma todo lo que sigue al comando y únelos
			const razon = args.slice(1).join(' ').trim(); // Asegúrate de que no haya espacios al inicio o al final
		
			// Verificar si se proporcionó una razón (debería ser redundante, pero es bueno tenerla)
			if (!razon) {
				room.sendAnnouncement("❌ Por favor, proporciona una razón después de '!pediradmin'.", player.id, 0xff0000, "normal", 1);
				return; 
			} else {
				room.sendAnnouncement("Se solicitó un admin. Agradecemos la grabación de evidencia y la paciencia, por favor.", player.id, 0xff0000, "normal", 1);
				
				// Aquí llamas a la función que envía el mensaje a Discord
				window.sendAdminRequestToDiscord(player.name, razon);
			}
		
			return false;
		}
				
        // Comando para registrar un usuario
		else if (messageNormalized === '!register') {
			const password = argument;
			if (!password) {
				room.sendAnnouncement("Debes proporcionar una contraseña para registrarte. Ejemplo: !register <password>", player.id);
				return false;
			}
		
			// Llamada a la función expuesta de Puppeteer para registrar el usuario
			window.registerUser(player.name, password)
				.then(response => {
					if (response.success) {
						room.sendAnnouncement("Registro exitoso. Usa !login <password> para iniciar sesión.", player.id);
					} else {
						room.sendAnnouncement(response.message, player.id);
					}
				})
				.catch(err => {
					room.sendAnnouncement("Error al registrar el usuario. Inténtalo nuevamente.", player.id);
					console.error("Error al registrar el usuario:", err);
				});
			return false;
		}
		

        // Comando para iniciar sesión
		else if (messageNormalized === '!login') {
			const password = argument;
			if (!password) {
				room.sendAnnouncement("Debes proporcionar una contraseña para iniciar sesión. Ejemplo: !login <password>", player.id);
				return false;
			}
		
			// Llamada a la función expuesta de Puppeteer para iniciar sesión
			window.loginUser(player.name, password)
				.then(result => {
					if (result.success) {
						room.sendAnnouncement("Inicio de sesión exitoso.", player.id);
						loggedInPlayers[player.name] = true;  // Añadir el jugador a loggedInPlayers
					} else {
						room.sendAnnouncement(result.message, player.id);  // Mostramos el mensaje adecuado en caso de error
					}
				})
				.catch(err => {
					room.sendAnnouncement("Error al iniciar sesión. Inténtalo nuevamente.", player.id);
					console.error("Error al iniciar sesión:", err);
				});
			return false;
		}
		
		// Lógica de los comandos en el navegador

        // Comando para mostrar estadísticas del jugador
		else if (messageNormalized.startsWith('!stats')) {
			const argumento = message.split(' ').slice(1).join(' ');  // Captura todo lo que sigue a !stats, para nombres con mas de 1 espacio
			const targetUser = argumento || player.name;

			// Llamada a la función expuesta de Puppeteer para obtener estadísticas del jugador
			window.getUserStats(targetUser)
				.then(stats => {
					if (stats) {
						// Calcular el promedio de puntos por carrera
						let promedio = stats.puntos / stats.carrerasCompletadas;
		
						// Calcular la reputación en función del valor
						let valor = stats.valorFinal;
						let reputacion = '';
		
						if (valor >= 75000) reputacion = "Leyenda III";
						else if (valor >= 60000) reputacion = "Leyenda II";
						else if (valor >= 50000) reputacion = "Leyenda I";
						else if (valor >= 40000) reputacion = "Campeón III";
						else if (valor >= 35000) reputacion = "Campeón II";
						else if (valor >= 30000) reputacion = "Campeón I";
						else if (valor >= 25000) reputacion = "Estrella III";
						else if (valor >= 20000) reputacion = "Estrella II";
						else if (valor >= 15000) reputacion = "Estrella I";
						else if (valor >= 10000) reputacion = "Competitivo III";
						else if (valor >= 7500) reputacion = "Competitivo II";
						else if (valor >= 5000) reputacion = "Competitivo I";
						else if (valor >= 3500) reputacion = "Promesa III";
						else if (valor >= 2500) reputacion = "Promesa II";
						else if (valor >= 1500) reputacion = "Promesa I";
						else if (valor >= 1100) reputacion = "Aficionado III";
						else if (valor >= 800) reputacion = "Aficionado II";
						else if (valor >= 500) reputacion = "Aficionado I";
						else if (valor >= 300) reputacion = "Principiante III";
						else if (valor >= 150) reputacion = "Principiante II";
						else reputacion = "Principiante I";
						
		
						// Formatear y enviar el mensaje de estadísticas en una sola línea
						room.sendAnnouncement(`📊 Estadísticas de ${targetUser}:\n 🏁 Carreras completadas: ${stats.carrerasCompletadas} | 🥇 Pole positions: ${stats.polepositions} | 🏆 Carreras ganadas: ${stats.carrerasGanadas} | 🥈 Podios: ${stats.carrerasPodio} | 🥉 Carreras en top 10: ${stats.carrerasTop10} | 💰 Puntos: ${stats.puntos} | 📈 Promedio: ${promedio.toFixed(2)} | 💎 Valor: $${valor.toFixed(2)} | 🌟 Reputación: ${reputacion}`, player.id);
					} else {
						// Mensaje si no se encuentra el usuario
						room.sendAnnouncement(`🚨 El usuario ${targetUser} no existe.`, player.id, 0xff0000);
					}
				})
				.catch(err => {
					room.sendAnnouncement("Error al obtener las estadísticas. Asegúrate de haber iniciado sesión.", player.id);
					console.error("Error al obtener estadísticas:", err);
				});
			return false;
		}
		

		else if (messageNormalized === '!record') {
			// Nombre del circuito actual
			const circuitoActual = _Circuit.Name;
		
			// Llamada a la función expuesta de Puppeteer para obtener los récords del circuito actual
			window.getCircuitRecords(player.name)
				.then(({ globalRecords, userRecords }) => {
					// Buscar el récord global del circuito actual
					const recordGlobal = globalRecords.find(record => record.circuito === circuitoActual);
		
					// Buscar el récord personal del jugador en el circuito actual
					const recordPersonal = userRecords.find(record => record.circuito === circuitoActual);
		
					// Preparar el mensaje con emojis y colores
					let recordMessage = `📍 Récord del Circuito: ${circuitoActual} 📍\n\n`;
		
					if (recordGlobal) {
						recordMessage += `🏆 Record Global: ${recordGlobal.tiempo.toFixed(3)}s por ${recordGlobal.usuario}\n`;
					} else {
						recordMessage += `🏆 Record Global: N/A\n`;
					}
		
					if (recordPersonal) {
						recordMessage += `👤 Record Personal: ${recordPersonal.tiempo.toFixed(3)}s\n`;
					} else {
						recordMessage += `👤 Record Personal: N/A\n`;
					}
		
					// Enviar el mensaje al jugador que invocó el comando
					room.sendAnnouncement(recordMessage, player.id, 0xffd700, fonts.timeQualy, sounds.timeQualy);
				})
				.catch(err => {
					console.error("Error al obtener el récord del circuito actual:", err);
					room.sendAnnouncement("Error al obtener el récord del circuito actual. Inténtalo nuevamente.", player.id);
				});
		
			return false;
		}
		
		else if (messageNormalized === '!records') {
			getCircuitRecords(player.name).then(({ globalRecords, userRecords }) => {
				if (!globalRecords || globalRecords.length === 0) {
					room.sendAnnouncement("No se encontraron récords de circuitos.", player.id, 0xff0000, "normal", 1);
					return;
				}
		
				// Título con color dorado
				room.sendAnnouncement("🏆 *Records de Circuitos* 🏆\n", player.id, 0xffd700, "normal", 1);
		
				let lineCount = 0; // Contador para alternar colores
		
				globalRecords.forEach((record) => {
					// Buscar el récord personal correspondiente para el circuito
					const personalRecord = userRecords.find(r => r.circuito === record.circuito);
		
					// Elegir el color alterno
					const lineColor = lineCount % 2 === 0 ? 0x87ceeb : 0xffa500; // Color1 (azul claro) y Color2 (naranja)
		
					// Generar el mensaje del circuito
					const circuitoMessage = `🏎️ ${record.circuito}: 🌍 Global (${record.tiempo.toFixed(3)} por ${record.usuario}) | 👤 Personal (${personalRecord ? personalRecord.tiempo.toFixed(3) : 'N/A'})`;
		
					// Enviar el mensaje para cada línea con su color correspondiente
					room.sendAnnouncement(circuitoMessage, player.id, lineColor, "normal", 1);
		
					// Incrementar el contador de líneas para alternar colores
					lineCount++;
				});
			}).catch(err => {
				console.error("Error al obtener los récords:", err);
				room.sendAnnouncement("Error al obtener los récords de circuitos.", player.id, 0xff0000, "normal", 1);
			});
		
			return false;
		}
		
			
		else if(messageNormalized == commands.maps){
			room.sendAnnouncement(`Map list below:\n${_Circuits.map(c => c.Name + " [" + c.ID + "]").join('\n')}`,player.id,colors.info,fonts.info,sounds.info);
			return false;
		}
		else if (messageNormalized == '!f1') {
			driversNames = f1Names;
			return false;
		}
		else if (messageNormalized == '!f2') {
			driversNames = f2Names;
			return false;
		}

		else if(player.admin == true){
			if(messageNormalized == "!setlaps" && message.toLowerCase().split(" ")[1]>=1){
				laps = parseInt(message.toLowerCase().split(" ")[1],10);
				room.sendAnnouncement(`Vueltas: ${laps}`,null,colors.setLaps,fonts.laps,sounds.setLaps);
				return false;
			}
			else if(messageNormalized == commands.mapLoad){
				var id = message.toLowerCase().split(" ")[1];
	
				if(id < 1 || id > _Circuits.length || id == undefined || isNaN(id)){
				room.sendAnnouncement(`Invalid ID`,player.id,colors.mapLoadDeny,fonts.mapLoadDeny,sounds.mapLoadDeny);
				}
				else{
					//console.log(`cambiando mapa`);
					room.setCustomStadium(Circuits[id-1]);
					//console.log(`mapa cambiado`);
					room.sendAnnouncement(`${_Circuits[id-1].Name} was loaded by ${player.name}`,null,colors.mapLoad,fonts.mapLoad,sounds.mapLoad);
				}
				
				return false;
			}
			if (messageNormalized == "!race" && parseInt(message.toLowerCase().split(" ")[1], 10) >= 1) {
				if (onQualySession) {
					room.sendAnnouncement(`Ya hay una sesión en curso, debe parar el juego antes de dar inicio otra`, player.id);
				} else {
					let laps = parseInt(message.toLowerCase().split(" ")[1], 10);
					setRaceSession(laps);
				}
				return false;
			}
			else if (messageNormalized == "!qualy") {
				if (onRaceSession) {
					room.sendAnnouncement(`Ya hay una sesión en curso, debe parar el juego antes de dar inicio otra`, player.id);
				} else {
					if (parseInt(message.toLowerCase().split(" ")[1], 10) >= 1) {
						timeQualy = parseInt(message.toLowerCase().split(" ")[1], 10) * 60;
					} else if (parseInt(message.toLowerCase().split(" ")[1], 10) == 0) {
						timeQualy = Infinity;
					} else {
						timeQualy = 180; // Tiempo predeterminado
					}
					setQualySession(timeQualy);
				}
				return false;
			}
			if(message.toLowerCase().split(" ")[0] == "!pmode"){
				publicMode = !publicMode;
				if(publicMode){
					qualyIsSet = false;
					raceIsSet = false;
				}
				if(room.getScores() != null){
					room.stopGame();
				}
				else if(publicMode){
					qualyIsSet = true;
					timeQualy = 120;
					showedQualyResults = false;
					qualyList = [];
					onQualySession = true;
					// esta es la razón por la que el 1er mapa tiene colisiones, le falta setear las PlayerDiscProperties
					room.startGame();
					room.getPlayerList().filter(player => !(player.id in multipleAdminAccounts) && !afkPlayers[player.id]).forEach(player => {
					room.setPlayerTeam(player.id,_Circuit.Team);
					room.setPlayerDiscProperties(player.id, {cGroup: room.CollisionFlags.c0});
					qualyPosReset(player);
				});
				room.sendAnnouncement(`>>> Inicio de Sesión de Clasificación <<<`, null, colors.sessionStart, fonts.sessionStart, sounds.sessionStart);
				room.sendAnnouncement(`Tiempo de clasificación: ${timeQualy / 60} minutos`, null, colors.timeQualy, fonts.timeQualy, sounds.timeQualy);
				}
				return false;
			}
			if(messageNormalized == "!ch"){
				onChampionship = true;
				championshipStandings = [];
				room.sendAnnouncement(`>>> Campeonato iniciado <<<`,null,colors.championshipStart,fonts.championshipStart,sounds.championshipStart);
				return false;
			}
			else if(messageNormalized == "!endch"){
				onChampionship = false;
				room.sendAnnouncement(`>>> Campeonato finalizado <<<`,null,colors.championshipEnd,fonts.championshipEnd,sounds.championshipEnd);
				return false;
			}

			// Nuevo comando para limpiar baneados
			else if(messageNormalized == "!clearbans") {
				room.clearBans();
				room.sendAnnouncement(`La lista de baneados ha sido limpiada por ${player.name}.`, null, colors.clearBans, fonts.clearBans, sounds.clearBans);
				return false;
			}
		} else { 
			room.sendAnnouncement("Comando inexistente.", player.id, colors.info, fonts.info, sounds.info);
			return false;
		}
    }
	else if (muteAll) {
		room.sendAnnouncement("No podés escribir ahora!", player.id, 0xFF4A4A, "bold", 2);
		return false;
	}

	if (fiaNames.includes(player.name)) {
		room.sendAnnouncement(`[🛡️ ADMIN 🛡️] ${player.name}: ${message}`, null, 0xFFD700, "normal", 1);
		return false;
	}
	else if (sponsorsNames.includes(player.name)) {
		room.sendAnnouncement(`[🔰 SPONSOR 🔰] ${player.name}: ${message}`, null, 0x00E300, "normal", 1);
		return false;
	}
	else if (adminsNames.includes(player.name) && player.admin) {
		room.sendAnnouncement(`[👮 MOD 👮] ${player.name}: ${message}`, null, 0xFF9EEF, "normal", 1);
		return false;
	}
	else if (f1Names.includes(player.name)) {
		room.sendAnnouncement(`[🔴 PILOTO F1 🏎️] ${player.name}: ${message}`, null, 0xFF7E75, "normal", 1);
		return false;
	}
	else if (f2Names.includes(player.name)) {
		room.sendAnnouncement(`[🔵 PILOTO F2 🏎️] ${player.name}: ${message}`, null, 0x0AADFF, "normal", 1);
		return false;
	}
};
        
function showBanneds() {
	console.log(`bannedPlayers = ${JSON.stringify(bannedPlayers, null, 2)}`);
}

room.onPlayerKicked = function(kickedPlayer, reason, ban, byPlayer) {
    // Verificar si playersID[kickedPlayer.id] está definido
    if (playersID[kickedPlayer.id]) {
        let isAlreadyBanned = bannedPlayers.some(banned => banned.conn === playersID[kickedPlayer.id].conn);

        if (ban && !isAlreadyBanned) {
			// Se agrega el "ban local"
            bannedPlayers.push({ name: kickedPlayer.name, conn: playersID[kickedPlayer.id].conn });

			// Se agrega el ban a la bd para que aseguremos la persistencia cuando abramos de nuevo el host
			window.addBannedUser(kickedPlayer.name, playersID[kickedPlayer.id].conn)
            .then(response => {
                console.log(response); 
            })
            .catch(err => {
                console.error('Error al guardar el ban en la base de datos:', err.message);
            });
        }
    } else {
        console.log(`Error: playersID[${kickedPlayer.id}] no está definido.`);
    }
}

/// SISTEMA DE LOGIN Y REGISTRO
let loggedInPlayers = {};

room.onPlayerJoin = function(player) {
    console.log(`${player.name} has joined`);
	window.enviarIPaDiscord(player.name, player.conn);
    let idJoined = player.id;
    room.sendAnnouncement("Bienvenido a la Fórmula Nacional Argentina, unite a nuestro DISCORD: https://discord.gg/j5EnBaYJjw para ser parte de la comunidad!", idJoined, 0xF0E916, "bold", 2);
    room.sendAnnouncement("ESTE HOST ESTÁ ABIERTO 24/7 GRACIAS A CAMPI", idJoined, 0xF0E916, "bold", 2);

    let isNewPlayer = checkPlayerAdmin(player);
    if (!isNewPlayer) return false;

    if (!(player.auth in playersAuth)) {
        window.updateBannedPlayers().then((updatedBannedPlayers) => {
            // Actualiza la variable con los resultados
            if (Array.isArray(updatedBannedPlayers)) {
                bannedPlayers = updatedBannedPlayers; // Actualiza la variable

                // Verifica si el jugador está baneado
                if (bannedPlayers.some(banned => banned.conn === player.conn)) {
                    room.kickPlayer(player.id, "Permaban. Apelaciones en https://discord.gg/j5EnBaYJjw", true);
                }
            } else {
                console.error("La lista de baneados no es un arreglo.");
            }
        }).catch(err => {
            console.error("Error al actualizar la lista de baneados:", err);
        });

        addNewPlayer(player);
        room.sendAnnouncement(`📢 Para entender cómo jugar usá !formato, todos los comandos con !help`, idJoined, 0x2FDE52, "italic", 2);

        if (onQualySession) {
            setPlayerConfig(player);
            if (!onChampionship) {
                room.setPlayerTeam(player.id, _Circuit.Team);
                room.setPlayerDiscProperties(player.id, { cGroup: room.CollisionFlags.c0 });
                qualyPosReset(player);
                if (timeQualy == Infinity) {
                    room.sendAnnouncement(`📢 PRÁCTICAS sin tiempo definido en curso`, idJoined, 0xA5FF78, "bold", 2);
                } else {
                    room.sendAnnouncement(`📢 CLASIFICACIÓN a ${timeQualy / 60} minuto/s en curso`, idJoined, 0xA5FF78, "bold", 2);
                }
            } else {
                room.setPlayerTeam(player.id, _Circuit.Team);
                room.setPlayerDiscProperties(player.id, { cGroup: room.CollisionFlags.c0 });
                qualyPosReset(player);
                if (timeQualy == Infinity) {
                    room.sendAnnouncement(`📢 PRÁCTICAS sin tiempo definido en curso`, idJoined, 0xA5FF78, "bold", 2);
                } else {
                    room.sendAnnouncement(`📢 CLASIFICACIÓN a ${timeQualy / 60} minuto/s en curso`, idJoined, 0xA5FF78, "bold", 2);
                }
            }
        }
        if (onRaceSession) {
            let leader = getCurrentLeader();
            let lap = getCurrentLap();
            if (leader !== undefined) {
                room.sendAnnouncement(`📢 CARRERA en vuelta ${lap}/${laps}. El líder actual es ${leader.name}. Sé paciente y espera tu turno! `, idJoined, 0xA5FF78, "bold", 2);
            } else {
                room.sendAnnouncement(`📢 CARRERA en vuelta ${lap}/${laps}. Sé paciente y espera tu turno!`, idJoined, 0xA5FF78, "bold", 2);
            }
        }
        if (publicMode && !onRaceSession && !onQualySession) {
            room.sendAnnouncement(`📢 La próxima sesión está por comenzar`, idJoined, 0xA5FF78, "bold", 2);
        }

        if (room.getPlayerList().length == max) {
            let players = room.getPlayerList();
            players.forEach(player => {
                if (afkPlayers[player.id] && !player.admin && !onChampionship) {
                    room.kickPlayer(player.id, `AFK en sala llena!`, false);
                }
            });
        }

        // Nuevo sistema: Ofrecer registro si no está registrado

        // Llamar a Puppeteer para manejar el registro y login del jugador
        window.checkUserRegistered(player.name)
            .then(result => {
                //console.log(`Resultado de checkUserRegistered para ${player.name}:`, result);  // Agregar un log para ver qué está devolviendo

                if (result.registered) {
					const startTime = Date.now(); // inicializamos el temporizador
					if (!loggedInPlayers[player.name]) {
						room.sendAnnouncement(`📢 Estás registrado. Usa !login <password> dentro de los próximos 2 minutos para loguearte.`, player.id, 0x2FDE52, "italic", 2);
					
						// Inicia un timeout de 2 minutos para kickear al jugador
						const kickTimeout = setTimeout(() => {
							if (!loggedInPlayers[player.name]) {
								room.kickPlayer(player.id, "No logueado en el tiempo requerido. Usa !login para loguearte antes de entrar.");
							}
						}, 2 * 60 * 1000); // 2 minutos en milisegundos
					
						// Inicia un intervalo de 30 segundos para enviar recordatorios
						const reminderInterval = setInterval(() => {
							if (!loggedInPlayers[player.name]) {
								const remainingTime = Math.max(0, (2 * 60 * 1000) - (Date.now() - startTime)); // Calcular tiempo restante
								const remainingSeconds = Math.ceil(remainingTime / 1000);
								room.sendAnnouncement(`⏳ Recordatorio: Usa !login (contraseña) para loguearte. Te quedan ${remainingSeconds} segundos.`, player.id, 0xFFCC00, "italic", 2);
							} else {
								// Si el jugador se loguea, limpia el intervalo y el timeout
								clearInterval(reminderInterval);
								clearTimeout(kickTimeout);
							}
						}, 30 * 1000); // 30 segundos en milisegundos
					} else {
						console.log(`${player.name} ya está logueado.`);
					}
                } else {
                    room.sendAnnouncement(`📢 No estás registrado. Usa !register <password> para registrarte.`, player.id, 0x2FDE52, "italic", 2);
					room.sendAnnouncement("ES MUY importante que te registres!", player.id, 0x2FDE52, "italic", 2)
					room.sendAnnouncement("Registrate con !register (tu contraseña)", player.id, 0x2FDE52, "italic", 2)
					room.sendAnnouncement("y posteriormente ingresá con !login (tu contraseña)", player.id, 0x2FDE52, "italic", 2)
                }
            })
            .catch(err => {
                console.error(`Error al verificar el registro del usuario: ${err}`);
            });
	
	

    } else if (onOfficialChampionship && playersConn[player.conn].isInTheRoom === false) {
        playersConn[player.conn].isInTheRoom === true;

        if (onQualySession) {
            setPlayerConfig(player);
            room.setPlayerTeam(player.id, _Circuit.Team);
            room.setPlayerDiscProperties(player.id, { cGroup: room.CollisionFlags.c0 });
            qualyPosReset(player);
        }
    } else {
        console.log(`"${playersAuth[player.auth].name}" intentó ingresar una segunda cuenta con el nombre "${player.name}"`);
        room.kickPlayer(player.id, "No se permite más de una cuenta por jugador", false);
    }
};



async function checkIfBanned() {
	await wait(100);
	return Promise.resolve();
}

room.onPlayerLeave = async function(player){
	console.log(`${player.name} has left`);

    if (loggedInPlayers[player.name]) {
        // Eliminar el estado de sesión del jugador logueado
        delete loggedInPlayers[player.name];
        console.log(`${player.name} ha cerrado sesión correctamente.`);
    } else {
        console.log(`${player.name} no estaba logueado al salir.`);
    }
	await checkIfBanned();
	
	delete driversList[player.id];
	if (player.id in playersID) {
		// Verificar que playersID[player.id].auth existe
		if ('auth' in playersID[player.id]) {
			// Verificar que playersID[player.id].auth es una clave válida en playersAuth
			if (playersID[player.id].auth in playersAuth) {
				// Eliminar la clave de playersAuth
				delete playersAuth[playersID[player.id].auth];
				//console.log(`Clave ${playersID[player.id].auth} eliminada de playersAuth.`);
			} else {
				//console.error(`Clave ${playersID[player.id].auth} no encontrada en playersAuth.`);
			}
		} else {
			console.error(`'auth' no encontrado en playersID[player.id].`);
		}
	}
	else if(player.id in multipleAdminAccounts) delete multipleAdminAccounts[player.id];
	delete playersID[player.id]

	let players = room.getPlayerList();
	if(room.getScores() != null && players.length == 0 && onRaceSession){
		room.stopGame();
	}
	delete afkPlayers[player.id];
	delete activeBeforeStart[player.id];
	delete notAFKable[player.id];
	delete velocities[player.id];
	delete playersWithSpeedEnabled[player.id];
	delete playersWithGearsEnabled[player.id];
	delete lastActive[player.id];

	// Debería borrar todas las referencias al jugador en los objetos de gestión de AFKs para no tener tanta info al pedo en memoria
	return Promise.resolve();
}



room.onRoomLink = function(url) {
  if (isRoomSet == false) {
    console.log(`Room set with url: ${url}`);
    isRoomSet = true;

    // Llamar a la función expuesta desde el navegador
    if (window.sendRoomLink) {
      window.sendRoomLink(url);
    }
  }
};

room.onStadiumChange = function(newStadiumName,byPlayer){
	byPlayer == null ? console.log(`${newStadiumName} was loaded`) : console.log(`${newStadiumName} was loaded by ${byPlayer.name}`);

	let c = _Circuits.find(x => x.Name == newStadiumName);
	let admins = room.getPlayerList().filter(p => p.admin == true);

	if(byPlayer == null){
		if(c != undefined){
			_Circuit = {
				MinX: c.MinX,
				MaxX: c.MaxX,
				MinY: c.MinY,
				MaxY: c.MaxY,
				DriveDirection: c.DriveDirection,
				StartDirection: c.StartDirection,
				Name: c.Name,
				BestTime: [c.BestTime[0],c.BestTime[1]],
				MainColor: c.MainColor,
				AvatarColor: c.AvatarColor,
				Angle: c.Angle,
				Team: c.Team,
				ID: c.ID,
				qualyPosReset: c.qualyPosReset
			};
			room.setTeamColors(c.Team,c.Angle,c.AvatarColor,c.MainColor);
		}
		else{
			admins.length > 0 ? admins.forEach(p => room.sendAnnouncement(`Something went wrong with map ${newStadiumName}. Please try again!`,p.id,colors.mapChangeWrongName,fonts.mapChangeWrongName,sounds.mapChangeWrongName)) : room.sendAnnouncement(`Something went wrong with map ${newStadiumName}. Please call an admin to try again!`,null,colors.mapChangeWrongName,fonts.mapChangeWrongName,sounds.mapChangeWrongName);
		}
	}
	else{
		room.sendAnnouncement("No se permiten cargar mapas externos",byPlayer.id,colors.mapChangeDeny,fonts.mapChangeDeny,sounds.mapChangeDeny);
		room.setCustomStadium(Circuits[0]);
	}
}

// Anuncios, faltan meter más msj

let intervalId;

function startAnnouncement() {
	const interval = 2 * 60 * 1000; // 2 minutos en milisegundos

	// Si ya hay un intervalo en ejecución, lo cancelamos
	if (intervalId) {
		clearInterval(intervalId);
	}

	// Configuramos el intervalo para los anuncios
	intervalId = setInterval(() => {
	// Verificamos si muteAll es true antes de enviar los anuncios
		if (!muteAll) {
			// Mensaje a enviar siempre
			room.sendAnnouncement(`📢 Unite a la liga: https://discord.gg/j5EnBaYJjw`, null, 0x00E3FF, "bold", 2);

			// Generamos un número aleatorio entre 0 y 1
			let randomIndex = Math.floor(Math.random() * 2);

			// Seleccionamos un mensaje basado en el número aleatorio
			switch (randomIndex) {
				case 0:
					room.sendAnnouncement(`Para ser marcado como afk usá !afk, para volver usá !back`, null, 0xFFF940, "italic", 2);
					break;
				case 1:
					room.sendAnnouncement(`Para ver todos los comandos disponibles usá !help`, null, 0xFFF940, "italic", 2);
					break;
			}
		}
		// Si muteAll es true, no hacemos nada (no enviamos mensajes)
	}, interval);
}

if (publicMode) startAnnouncement();

function changeTrueism() {
    trueism = true;
}

function changeMax() {
	max = 20;
}

function changeRoomName() {
	roomName = "🏎️🏆🏁 FORMULA 1 Argentina 🇦🇷 - FNA 🏁🏆🏎️";
}