# Bot de Haxball para carreras
Implementaciones propias a partir del script de Keso, que es un fork del proyecto de thenorthstar: https://github.com/thenorthstar/HaxBall-Simple-F1-Racing-Bot

## Bots
Este repositorio cuenta con 4 bots, siendo 1 el utilizado para los campeonatos y los otros 3 utilizados como [backups](https://github.com/velazquez91196/bot_carreras/tree/main/backups).

El bot actualmente utilizado para las salas públicas es [este](https://github.com/velazquez91196/bot_carreras/blob/main/backups/bot_funcionalAuth.js), y el bot utilizado para campeonatos es [este](https://github.com/velazquez91196/bot_carreras/blob/main/bot_fnaCamara.js). Ambos bots funcionan de manera distinta en el manejo de las carreras y el de campeonato posee funcionalidades extra.

Debido al proceso inicial para inicializar una sala de Haxball configurada con script, existe un archivo independiente por cada bot, similares a un `bundle`. Se espera modularizar el proyecto a partir de el uso de nuevas formas de inicializar una sala de manera remota.

## Funcionalidades
[Documentación de Haxball Headless](https://github.com/haxball/haxball-issues/wiki/Headless-Host)

A continuación, se presentan algunas de las funcionalidades propias de esta implementación, repartidas principalmente entre el bot de salas públicas y el bot de campeonato:
- Modo clasificación: Modo de juego que permite a los jugadores dar vueltas a un circuito en un tiempo definido o infinito, sin contacto entre jugadores.
- Modo público: Configuración que permite a la sala conmutar automáticamente entre el modo clasificación (2 minutos) y el modo carrera (3 vueltas), a través del comando designado.
- Manejo de AFKs: Sistema que detecta a los jugadores que se queden detenidos en pista en una sesión de carrera. También se incorporan comandos para irse AFK y volver de manera voluntaria.
- Manejo de cámara de espectadores: Permite a un admin manipular la "cámara" para los jugadores que no se encuentran en pista, si este manejo no es administrado se sigue por defecto al jugador en primera posición (tanto en clasificación como en carrera).
- Mayor precisión de la toma de tiempos por vuelta.
