import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import { WebhookClient, EmbedBuilder } from 'discord.js';
const webhookClient = new WebhookClient({ url: 'https://discord.com/api/webhooks/1301392600825204777/HuYbLqmgTEtb7YOu5xvnAZ1LV3PEav_ZU3O1FhtrqOH1kwbv_9Nl5o1kz576y5horaUN' });
const webhookClientCarreras = new WebhookClient({ url: 'https://discord.com/api/webhooks/1301391339304255550/ygeclckUC5f3ngPAd28xaR4PRKx3IkJQ0nIkoG-TIcY2NzyT7O7ZEQWMyfB5HqcEPaD_'});

async function sendRaceResultsEmbed(webhookClientCarreras, raceResults, _Circuit) {
   // Asegurarse de que raceResults es un array
    if (!Array.isArray(raceResults)) {
      raceResults = [raceResults]; // Convierte a un array si es un solo objeto
    }
  const f1ScoringSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]; // Puntos para las primeras 10 posiciones

  const standings = raceResults.map((player, index) => {
      const playerName = player.name;  // Nombre del jugador
      const playerTime = player.time; // Tiempo del jugador
      const pointsEarned = (index + 1 <= 10) ? `(+${f1ScoringSystem[index]} puntos)` : "Sin puntos";
      const fastestLapBonus = player.name === (_Circuit.BestTime ? _Circuit.BestTime[1] : null) ? " (+1 Vuelta rápida)" : "";

      return `${index + 1}. **${playerName}** | ${playerTime} | ${pointsEarned}${fastestLapBonus}`;
  }).join('\n');

  // Extraer los tres primeros para el podio
  const podium = raceResults.slice(0, 3).map((player, index) => {
      return `${index + 1}️⃣ **${player.name}**`; // Usar directamente el nombre del jugador
  });

  // Extraer la vuelta rápida
  const fastestLap = _Circuit.BestTime && _Circuit.BestTime.length > 1 ? {
      usuario: _Circuit.BestTime[1],
      tiempo: _Circuit.BestTime[0]
  } : null;

  // Crear el embed de resultados
  const embed = new EmbedBuilder()
      .setTitle('🏁 Resultados de la Carrera de Fórmula 1')
      .setDescription('¡Finalizó una nueva carrera de FNA Public Host! Ver los resultados:')
      .addFields(
          {
              name: 'Clasificación de la Carrera',
              value: standings || 'No hay resultados.',
              inline: false
          },
          {
              name: '🥇 Podio',
              value: podium.length > 0 ? podium.join('\n') : 'N/A',
              inline: false
          },
          {
              name: '⏱️ Vuelta Rápida',
              value: fastestLap ? `**${fastestLap.usuario}** - ${fastestLap.tiempo.toFixed(2)} segundos` : 'No disponible',
              inline: false
          }
      )
      .setColor('#FF0000')
      .setFooter({
          text: 'FNA - La comunidad #1 de Hax Racing',
          iconURL: 'https://media.discordapp.net/attachments/1298080114994839726/1300490477950468156/fna_new_png.png?ex=6723aaa3&is=67225923&hm=752c97ca84f08eb472dbc9516eeb1393fd9eaa0f4ede3289a68be2c0aeb291a3&=&format=webp&quality=lossless&width=100&height=100'
      })
      .setTimestamp();

  // Enviar el embed usando el webhook
  webhookClientCarreras.send({
      username: 'FNA - Formula Nacional Argentina',
      avatarURL: 'https://media.discordapp.net/attachments/1298080114994839726/1300490477950468156/fna_new_png.png?ex=6723aaa3&is=67225923&hm=752c97ca84f08eb472dbc9516eeb1393fd9eaa0f4ede3289a68be2c0aeb291a3&=&format=webp&quality=lossless&width=50&height=50',
      embeds: [embed],
  });
}

async function sendAdminRequestToDiscord(webhookClient, username, razon) {
  const embed = new EmbedBuilder()
      .setTitle("Solicitud de Admin")
      .setDescription(`Usuario: ${username}\nRazón: ${razon}`)
      .setColor(0xff0000) // Color rojo para la solicitud
      .setTimestamp();

  webhookClient.send({ embeds: [embed] })
      .then(() => console.log("Solicitud de admin enviada a Discord"))
      .catch(err => console.error("Error al enviar solicitud de admin a Discord:", err));
}


// Conectar a MongoDB Atlas usando Mongoose
const uri = "mongodb+srv://charlesf1:Xh1nEKFyUFLk5pwl@cluster0.1inlc.mongodb.net/";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch(err => console.error("Error conectando a MongoDB Atlas:", err));

// Definir el esquema de vueltas
const lapSchema = new mongoose.Schema({
  usuario: String,
  circuito: String,
  tiempo: Number,  // Tiempo de vuelta en segundos o milisegundos
  fecha: { type: Date, default: Date.now }  // Fecha en que se almacenó la vuelta
});


// Definir el esquema de usuarios con las estadísticas adicionales
const userSchema = new mongoose.Schema({
    usuario: { type: String, required: true, unique: true },  // Nombre de usuario (único)
    password: { type: String, required: true },  // Contraseña para login
    loggedIn: { type: Boolean, default: false },  // Estado de login - ya no sirve más. próxima versión lo saco
    lastLogin: { type: Date },  // Último login
    pais: { type: String },  // País del jugador

    // Estadísticas del jugador
    stats: {
        carrerasCompletadas: { type: Number, default: 0 },  // Cantidad de carreras completadas
        polepositions: { type: Number, default: 0 },  // Cantidad de clasificaciones realizadas
        carrerasGanadas: { type: Number, default: 0 },  // Carreras ganadas
        carrerasPodio: { type: Number, default: 0 },  // Carreras en el podio (1º, 2º, 3º lugar)
        carrerasTop10: { type: Number, default: 0 },  // Carreras en el top 10
        puntos: { type: Number, default: 0 },
        valor: { type: Number },
        valorFinal: { type: Number }
    },

    // Ranking de vueltas rápidas por circuito
    rankingVueltaRapida: [{
        circuito: String,  // Nombre del circuito
        tiempo: Number     // Tiempo de vuelta rápida del jugador en ese circuito
    }]
});

const bannedUserSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Nombre del usuario baneado
  conn: { type: String, required: true, unique: true },  // Identificador único de conexión
  banDate: { type: Date, default: Date.now },  // Fecha del baneo
});

// Esquema para los récords globales de vuelta rápida
const globalRecordSchema = new mongoose.Schema({
    circuito: { type: String, required: true, unique: true }, // Le puse unique para evitar duplicaciones
    usuario: { type: String, required: true },  // Usuario que tiene el récord
    tiempo: { type: Number, required: true },   // Tiempo de vuelta en segundos o milisegundos
    fecha: { type: Date, default: Date.now }    // Fecha en que se estableció el récord
  });

  
const User = mongoose.model('User', userSchema);
const GlobalRecord = mongoose.model('GlobalRecord', globalRecordSchema);
const BannedUser = mongoose.model('BannedUser', bannedUserSchema);
const Lap = mongoose.model('Lap', lapSchema);

async function bot() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://www.haxball.com/headless', { waitUntil: 'networkidle2' });

  // Exponer la función sendRaceResultsEmbed para ser llamada desde el script en el navegador
  await page.exposeFunction('sendRaceResultsEmbed', async (raceResults, _Circuit) => {
    // Llama a la función sendRaceResultsEmbed y pasa los parámetros necesarios
    await sendRaceResultsEmbed(webhookClientCarreras, raceResults, _Circuit);
  });

  await page.exposeFunction('sendAdminRequestToDiscord', async (username, razon) => {
    // Llama a la función sendRaceResultsEmbed y pasa los parámetros necesarios
    await sendAdminRequestToDiscord(webhookClient, username, razon);
  });
  // Exponer la función saveLap para ser llamada desde el script en el navegador
  await page.exposeFunction('saveLap', async (usuario, circuito, tiempo) => {
    try {
        if (tiempo <= 1) {
            return { newRecord: false, difference: null };
        }

        // Busca la vuelta rápida existente en la colección global y en el perfil del usuario
        const [user, globalRecord] = await Promise.all([
            User.findOne({ usuario: usuario }),
            GlobalRecord.findOne({ circuito: circuito })
        ]);

        // Actualizar récord global
        let newGlobalRecord = false;
        let globalDifference = 0;

        if (!globalRecord || tiempo < globalRecord.tiempo) {
            newGlobalRecord = true;
            globalDifference = globalRecord ? globalRecord.tiempo - tiempo : 0;

            if (globalRecord) {
                globalRecord.tiempo = tiempo;
                globalRecord.usuario = usuario;
                await globalRecord.save();
            } else {
                await new GlobalRecord({ circuito, tiempo, usuario }).save();
            }
        }

        // Actualizar récord del usuario
        const userRecord = user.rankingVueltaRapida.find(record => record.circuito === circuito);
        let userDifference = 0;
        let newUserRecord = false;

        if (!userRecord) {
            user.rankingVueltaRapida.push({ circuito, tiempo });
            newUserRecord = true; // Establecer nuevo récord personal
        } else if (tiempo < userRecord.tiempo) {
            userDifference = userRecord.tiempo - tiempo;
            userRecord.tiempo = tiempo;
            newUserRecord = true; // Establecer nuevo récord personal
        } else {
            userDifference = tiempo - userRecord.tiempo; // No se mejora el récord
        }

        await user.save();

        return {
            newRecord: newUserRecord,
            difference: newUserRecord ? userDifference : userDifference,
            globalRecord: newGlobalRecord, // Para indicar si es un nuevo récord global
            previousGlobalHolder: globalRecord ? globalRecord.usuario : null // Obtener el poseedor anterior del récord global
        };
    } catch (err) {
        console.error("Error al guardar la vuelta en MongoDB:", err);
        return { error: true, message: "Error al guardar la vuelta." };
    }
});

await page.exposeFunction('loadBannedPlayers', async () => {
  try {
      const bannedUsers = await BannedUser.find(); // Obtener baneos de la base de datos
      console.log("Lista de baneados cargada: ", bannedUsers);
      return bannedUsers.map(user => ({
          name: user.name,
          conn: user.conn
      }));
  } catch (err) {
      console.error('Error al cargar los baneos desde la base de datos:', err.message);
      return [];
  }
});


await page.exposeFunction('addBannedUser', async (name, conn) => {
  try {
      // Verifica si ya existe un usuario baneado con la misma conexión
      const existingUser = await BannedUser.findOne({ conn });
      if (existingUser) {
          throw new Error('El usuario ya está baneado');
      }

      // Crea un nuevo usuario baneado
      const newBannedUser = new BannedUser({
          name: name,
          conn: conn
      });

      // Guarda el nuevo usuario baneado en la base de datos
      await newBannedUser.save();
      console.log("Se baneó al usuario: ", name);
      return 'Usuario baneado.';
  } catch (err) {
      throw new Error('Error al agregar el usuario baneado: ' + err.message);
  }
});  
    
// Exponiendo la función para actualizar bannedPlayers
await page.exposeFunction('updateBannedPlayers', async () => {
  const bannedData = await BannedUser.find(); // Obtener jugadores baneados de la base de datos
  return bannedPlayers = bannedData.map(banned => ({
      name: banned.name,
      conn: banned.conn 
  }));
});


  // Exponer la función para registrar un nuevo usuario
  await page.exposeFunction('registerUser', async (usuario, password) => {
    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ usuario: usuario });
        if (existingUser) {
            return { success: false, message: "El usuario ya existe. Por favor, elige otro nombre." };
        }

        const nuevoUsuario = new User({
            usuario: usuario,
            password: password,
            stats: {
                carrerasCompletadas: 0,
                polepositions: 0,
                carrerasGanadas: 0,
                carrerasPodio: 0,
                carrerasTop10: 0,
                vueltasRapidas: 0,
                valor: 0,
                valorFinal: 0,
                puntos: 0,
                recordsVuelta: []
            }
        });

         await nuevoUsuario.save();
        console.log(`Usuario ${usuario} registrado exitosamente.`);
        return { success: true };
    } catch (err) {
        console.error(`Error al registrar el usuario ${usuario}:`, err);
        return { success: false, message: "Error al registrar el usuario. Inténtalo nuevamente." };
    }
});

  
  // Exponer la función para iniciar sesión
  await page.exposeFunction('loginUser', async (usuario, password) => {
    try {
        const user = await User.findOne({ usuario: usuario, password: password });
        if (user) {
            user.loggedIn = true;
            await user.save();
            console.log(`${usuario} ha iniciado sesión.`);
            return { success: true };  // Retornamos un objeto en vez de solo true
        } else {
            console.log(`Usuario o contraseña incorrectos para ${usuario}.`);
            return { success: false, message: 'Usuario o contraseña incorrectos.' };  // Retornamos un objeto con más información
        }
    } catch (err) {
        console.error(`Error al iniciar sesión para ${usuario}:`, err);
        return { success: false, message: 'Error al iniciar sesión.' };  // Retornamos también el mensaje de error
    }
});

  // Exponer la función para obtener estadísticas de un usuario
  await page.exposeFunction('getUserStats', async (usuario) => {
    try {
      const user = await User.findOne({ usuario: usuario });
      if (user) {
        return user.stats;
      } else {
        console.log(`Usuario ${usuario} no encontrado.`);
        return null;
      }
    } catch (err) {
      console.error(`Error al obtener las estadísticas de ${usuario}:`, err);
      return null;
    }
  });

  await page.exposeFunction('checkUserRegistered', async (usuario) => {
    try {
        const user = await User.findOne({ usuario: usuario });
        if (user) {
            return { registered: true, loggedIn: user.loggedIn };
        } else {
            return { registered: false };
        }
    } catch (err) {
        console.error("Error al verificar si el usuario está registrado:", err);
        throw err;
    }
});

// Función para obtener los récords de circuitos desde la base de datos
await page.exposeFunction('getCircuitRecords', async (playerName) => {
  try {
      // Obtener los récords globales
      const globalRecords = await GlobalRecord.find({}).lean();

      // Obtener los récords personales del usuario
      const user = await User.findOne({ usuario: playerName }).lean();
      const userRecords = user ? user.rankingVueltaRapida : [];

      return { globalRecords, userRecords };
  } catch (err) {
      console.error("Error al obtener los récords de circuitos:", err);
      return { error: "Error al obtener los récords de circuitos." };
  }
});



await page.exposeFunction('updateStats', async (usuario, stats) => {
    try {
      // Busca al usuario por nombre
      const user = await User.findOne({ usuario });

      if (user) {
        // Verificar si las estadísticas proporcionadas son valores absolutos
        // y asignar directamente los nuevos valores si existen
        if (stats.carrerasCompletadas !== undefined) {
          user.stats.carrerasCompletadas = stats.carrerasCompletadas;
        }
        if (stats.polepositions !== undefined) {
          user.stats.polepositions = stats.polepositions;
        }
        if (stats.carrerasGanadas !== undefined) {
          user.stats.carrerasGanadas = stats.carrerasGanadas;
        }
        if (stats.carrerasPodio !== undefined) {
          user.stats.carrerasPodio = stats.carrerasPodio;
        }
        if (stats.carrerasTop10 !== undefined) {
          user.stats.carrerasTop10 = stats.carrerasTop10;
        }
        if (stats.puntos !== undefined) {
          user.stats.puntos = stats.puntos;
        }
        if (stats.valor !== undefined) {
          user.stats.valor = stats.valor;
        }
        if (stats.valorFinal !== undefined) {
          user.stats.valorFinal = stats.valorFinal;
        }


        // Guarda los cambios en la base de datos
        await user.save();
        console.log(`Estadísticas de ${usuario} actualizadas correctamente.`);
      } else {
        console.error(`Usuario ${usuario} no encontrado.`);
      }
    } catch (err) {
      console.error(`Error al actualizar las estadísticas de ${usuario}:`, err);
    }
  });

// Exponer la función para actualizar Pole Positions
await page.exposeFunction('updatePolePositions', async (usuario) => {
    try {
        const user = await User.findOne({ usuario });

        if (user) {
            // Incrementar el contador de polepositions del usuario
            user.stats.polepositions += 1;
            user.stats.puntos += 1;

            // Guardar los cambios en la base de datos
            await user.save();
            console.log(`PolePositions de ${usuario} actualizadas correctamente.`);
        } else {
            console.error(`Usuario ${usuario} no encontrado.`);
        }
    } catch (err) {
        console.error(`Error al actualizar las PolePositions de ${usuario}:`, err);
    }
});

// Exponer la función para obtener los rankings
await page.exposeFunction('getTopPlayers', async (stat) => {
    try {
        const validStats = ['victorias', 'poles', 'carreras', 'podios', 'top10', 'promedio', 'valor', 'puntos'];

        if (!validStats.includes(stat)) {
            throw new Error(`Estadística inválida: ${stat}`);
        }

        // Definir los campos de ordenamiento según la estadística solicitada
        const sortField = {
            victorias: 'stats.carrerasGanadas',
            poles: 'stats.polepositions',
            carreras: 'stats.carrerasCompletadas',
            podios: 'stats.carrerasPodio',
            top10: 'stats.carrerasTop10',
            promedio: 'avgPoints',
            valor: 'stats.valorFinal',
            puntos: 'stats.puntos'
        }[stat];

        // Consultar la base de datos para obtener los jugadores ordenados
        const players = await User.aggregate([
            // Calcular el promedio de puntos por carrera si se solicita "promedio"
            {
                $addFields: {
                    avgPoints: {
                        $cond: {
                            if: { $eq: ['$stats.carrerasCompletadas', 0] },
                            then: 0,
                            else: { $divide: ['$stats.puntos', '$stats.carrerasCompletadas'] }
                        }
                    }
                }
            },
            { $sort: { [sortField]: -1 } },
            { $limit: 20 }
        ]);

        // Devolver la lista de jugadores con las estadísticas solicitadas
        return players.map((player, index) => ({
            rank: index + 1,
            nombre: player.usuario,
            statValue: player.stats[sortField.split('.')[1]],
            stats: player.stats,
            promedio: player.avgPoints.toFixed(2), // Asegurarse de que el promedio se formatee como decimal
            valor: player.stats.valorFinal
        }));
    } catch (err) {
        console.error("Error al obtener el ranking:", err);
        return null;
    }
});

await page.exposeFunction('sendRoomLink', (url) => {
  console.log(`Link de la sala: ${url}`);
});

  // Circuitos
  await page.addScriptTag({ path: './circuitos/circuitos.js' });

  // Agregados
  await page.addScriptTag({ path: './agregados/colores.js'});
  await page.addScriptTag({ path: './agregados/fuentes.js'});
  await page.addScriptTag({ path: './agregados/sonidos.js'});
  await page.addScriptTag({ path: './agregados/nombres.js'}); // Nombres FIA, Sponsor, F1, F2

  // Script principal
  await page.addScriptTag({ path: './bot_funcionalAuth.js' });


  // Discord 
  //await page.addScriptTag({ path: './discord/funciones.js'});


  console.log('Bot loaded');
}

bot();
  