// Actualiza todos los documentos en la colección
const result = db.users.updateMany(
    {},
    {
      $set: {
        "stats.carrerasCompletadas": 0,
        "stats.polepositions": 0,
        "stats.carrerasGanadas": 0,
        "stats.carrerasPodio": 0,
        "stats.carrerasTop10": 0,
        "stats.puntos": 0
        // 'valor' y 'rankingVueltaRapida' se mantienen sin cambios
      }
    }
  );
  
  // Muestra el resultado de la operación
  result
  