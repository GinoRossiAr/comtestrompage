const puppeteer = require('puppeteer');
const mongoose = require('mongoose');

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
        valor: { type: Number }
    },

    // Ranking de vueltas rápidas por circuito
    rankingVueltaRapida: [{
        circuito: String,  // Nombre del circuito
        tiempo: Number     // Tiempo de vuelta rápida del jugador en ese circuito
    }]
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
const Lap = mongoose.model('Lap', lapSchema);

async function bot() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://www.haxball.com/headless', { waitUntil: 'networkidle2' });

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
            valor: 'stats.valor',
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
            valor: player.stats.valor
        }));
    } catch (err) {
        console.error("Error al obtener el ranking:", err);
        return null;
    }
});


  
  // Cargar el archivo bot_funcionalAuth.js en la página

  await page.exposeFunction('sendRoomLink', (url) => {
    console.log(`Link de la sala: ${url}`);
  });

  await page.addScriptTag({ path: './bot_funcionalAuth.js' });

  console.log('Bot loaded');
}

bot();
