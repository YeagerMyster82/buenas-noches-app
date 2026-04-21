export const phaseLabels = {
  preparar_para_dormir: "Preparar para dormir",
  movimiento_descarga: "Descargar energía",
  activacion_ligera: "Activar suave",
  movimiento_corporal: "Llevar el cuerpo al centro",
  trabajo_pesado_movimiento: "Trabajo fuerte",
  propiocepcion: "Organizar el cuerpo",
  propiocepcion_profunda: "Presión profunda",
  propiocepcion_fuerte: "Presión fuerte",
  vestibular_lento: "Movimiento lento",
  ritmo: "Ritmo",
  conexion: "Conexión",
  contacto_ritmo: "Contacto + ritmo",
  bano_basico: "Baño y dientes",
  bano_regulacion: "Activar calma en el baño",
  vago: "Activar calma",
  vago_suave: "Calma suave",
  respiracion: "Respiración",
  transicion: "Transición a sueño",
  audio_historia_corta: "Audio / historia corta",
  limite_claro: "Límite claro",
  retirada_gradual: "Retirada gradual",
};

const phasePurpose = {
  preparar_para_dormir: "Primero preparamos el cuerpo y el ambiente para dormir.",
  movimiento_descarga: "Soltar activación y adrenalina antes de pedir calma.",
  activacion_ligera: "Despertar un poco el cuerpo para salir del bloqueo.",
  movimiento_corporal: "Sacar a la mente del centro y llevar el sistema al cuerpo.",
  trabajo_pesado_movimiento: "Dar trabajo fuerte y organizado antes de bajar.",
  propiocepcion: "Ordenar el cuerpo con presión e input organizado.",
  propiocepcion_profunda: "Dar contención profunda y segura cuando el sistema está sobrepasado.",
  propiocepcion_fuerte: "Ofrecer input fuerte para un cuerpo inquieto que sigue buscando.",
  vestibular_lento: "Marcar ritmo con movimiento lento y predecible.",
  ritmo: "Usar repetición para ayudar al cerebro a cambiar de velocidad.",
  conexion: "Llenar primero el vaso de seguridad y cercanía.",
  contacto_ritmo: "Combinar contacto y ritmo para co-regular.",
  bano_basico: "Cerrar lo práctico antes de activar la calma, para evitar salir de la cama después.",
  bano_regulacion:
    "Como ya están en el baño, aquí aprovechamos para sumar señales de calma mientras hacen cosas que igual tienen que hacer.",
  vago: "Activar una señal de calma más directa.",
  vago_suave: "Bajar con una señal suave y menos demandante.",
  respiracion: "Cerrar con una salida más organizada hacia el sueño.",
  transicion: "Hacer el puente final a dormir sin reactivar.",
  audio_historia_corta: "Ayudar a la mente a aterrizar sin abrir historias intensas.",
  limite_claro: "Cerrar la rutina sin seguir agregando pasos.",
  retirada_gradual: "Reducir tu presencia de forma lenta y predecible.",
};

const phaseDurations = {
  preparar_para_dormir: 8,
  movimiento_descarga: 5,
  activacion_ligera: 3,
  movimiento_corporal: 4,
  trabajo_pesado_movimiento: 5,
  propiocepcion: 4,
  propiocepcion_profunda: 4,
  propiocepcion_fuerte: 4,
  vestibular_lento: 4,
  ritmo: 3,
  conexion: 4,
  contacto_ritmo: 4,
  bano_basico: 4,
  bano_regulacion: 7,
  vago: 3,
  vago_suave: 3,
  respiracion: 3,
  transicion: 4,
  audio_historia_corta: 4,
  limite_claro: 2,
  retirada_gradual: 3,
};

const activityCatalog = {
  bath_or_shower: {
    id: "bath_or_shower",
    displayName: "Baño o ducha tibia",
    shortLabel: "Bajar el ritmo del día",
    instructions: "Dar un baño o ducha tibia, sin juego activo ni estimulación extra.",
  },
  put_on_pajamas: {
    id: "put_on_pajamas",
    displayName: "Ponerse pijama",
    shortLabel: "Señal clara de noche",
    instructions: "Ponerse la pijama con luz suave y ambiente calmado.",
  },
  dim_lights: {
    id: "dim_lights",
    displayName: "Bajar la luz",
    shortLabel: "Reducir estimulación",
    instructions: "Bajar la intensidad de la luz o cambiar a luz cálida.",
  },
  remove_screens: {
    id: "remove_screens",
    displayName: "Apagar pantallas",
    shortLabel: "Menos input visual",
    instructions: "Apagar pantallas y evitar estímulos visuales intensos.",
  },
  calm_voice_transition: {
    id: "calm_voice_transition",
    displayName: "Voz calmada",
    shortLabel: "Co-regulación suave",
    instructions: "Hablar bajito y evitar excitación verbal mientras empieza la rutina.",
  },
  use_bathroom: {
    id: "use_bathroom",
    displayName: "Ir al baño",
    shortLabel: "Evitar salidas después",
    instructions: "Ir al baño antes de pasar a la cama para evitar interrupciones después.",
  },
  brush_teeth: {
    id: "brush_teeth",
    displayName: "Cepillado de dientes",
    shortLabel: "Input oral con calma",
    instructions: "Cepillar los dientes con calma, sin juego ni apuro.",
  },
  animal_walks: {
    id: "animal_walks",
    displayName: "Caminatas de animales",
    shortLabel: "Movimiento fuerte y divertido",
    instructions: "Caminen como oso, rana o cangrejo por 30 a 60 segundos por ronda.",
  },
  wall_push_fast: {
    id: "wall_push_fast",
    displayName: "Empujar la pared",
    shortLabel: "Descarga con fuerza",
    instructions: "Empujen la pared con fuerza por 10 segundos, descansen y repitan.",
  },
  fast_crawling: {
    id: "fast_crawling",
    displayName: "Gateo rápido",
    shortLabel: "Descarga rápida en el piso",
    instructions: "Gatear rápido de un lado a otro del cuarto por 30 a 60 segundos.",
  },
  marching_strong: {
    id: "marching_strong",
    displayName: "Marcha fuerte",
    shortLabel: "Activación fuerte organizada",
    instructions: "Marchen levantando las rodillas con fuerza durante 30 a 60 segundos.",
  },
  wheelbarrow: {
    id: "wheelbarrow",
    displayName: "Carretilla",
    shortLabel: "Trabajo corporal fuerte",
    instructions: "Sostén sus piernas y dejen que avance con las manos por unos segundos.",
  },
  gateo_lento: {
    id: "gateo_lento",
    displayName: "Gateo lento",
    shortLabel: "Activación suave",
    instructions: "Gatear despacio y con control durante unos segundos.",
  },
  wall_push_soft: {
    id: "wall_push_soft",
    displayName: "Empujar la pared suave",
    shortLabel: "Presión suave",
    instructions: "Empujar la pared con fuerza moderada y respiracion tranquila.",
  },
  light_marching: {
    id: "light_marching",
    displayName: "Marcha ligera",
    shortLabel: "Despertar suave",
    instructions: "Marchar lento y ligero durante 20 a 30 segundos.",
  },
  gentle_stretching: {
    id: "gentle_stretching",
    displayName: "Estiramientos suaves",
    shortLabel: "Movimiento organizado",
    instructions: "Estiren brazos, espalda y piernas con movimientos lentos.",
  },
  slow_walking: {
    id: "slow_walking",
    displayName: "Caminar lento",
    shortLabel: "Caminar con calma",
    instructions: "Caminen despacio sintiendo cada paso.",
  },
  gateo: {
    id: "gateo",
    displayName: "Gateo",
    shortLabel: "Llevar la mente al cuerpo",
    instructions: "Gatear por el piso de forma lenta y organizada.",
  },
  cross_body_taps: {
    id: "cross_body_taps",
    displayName: "Toques cruzados",
    shortLabel: "Cruzar la línea media",
    instructions: "Tocar mano con rodilla contraria de forma lenta y organizada.",
  },
  gentle_yoga_flow: {
    id: "gentle_yoga_flow",
    displayName: "Flujo de yoga suave",
    shortLabel: "Mover y organizar",
    instructions: "Hagan una secuencia muy simple y lenta con respiracion suave.",
  },
  stretching_sequence: {
    id: "stretching_sequence",
    displayName: "Secuencia de estiramientos",
    shortLabel: "Bajar velocidad",
    instructions: "Estiren por turnos brazos, espalda y piernas sin apuro.",
  },
  slow_marching: {
    id: "slow_marching",
    displayName: "Marcha lenta",
    shortLabel: "Organizar el cuerpo",
    instructions: "Marchen lento y firme sintiendo cada paso.",
  },
  wall_pushups: {
    id: "wall_pushups",
    displayName: "Wall push-ups",
    shortLabel: "Presión activa",
    instructions: "Apoyen manos en la pared y hagan 10 repeticiones lentas.",
  },
  carry_objects: {
    id: "carry_objects",
    displayName: "Llevar objetos pesados",
    shortLabel: "Trabajo con carga",
    instructions: "Lleven libros, ropa o almohadas de un lado a otro de forma segura.",
  },
  push_chair: {
    id: "push_chair",
    displayName: "Empujar una silla",
    shortLabel: "Trabajo fuerte",
    instructions: "Empujen una silla segura y ligera con control.",
  },
  army_crawl: {
    id: "army_crawl",
    displayName: "Gateo militar",
    shortLabel: "Trabajo pesado en el piso",
    instructions: "Gatear pegado al piso por unos segundos.",
  },
  animal_walks_heavy: {
    id: "animal_walks_heavy",
    displayName: "Caminatas de animales",
    shortLabel: "Movimiento fuerte",
    instructions: "Caminen como animales lentos y pesados por 30 a 60 segundos.",
  },
  deep_pressure_squeeze: {
    id: "deep_pressure_squeeze",
    displayName: "Squeeze / presión profunda",
    shortLabel: "Presión profunda fácil y efectiva",
    instructions: "Aplicar presión firme y lenta en brazos, piernas u hombros de forma segura.",
  },
  joint_compressions: {
    id: "joint_compressions",
    displayName: "Compresiones articulares",
    shortLabel: "Compresiones organizadoras",
    instructions: "Hacer compresiones suaves y organizadas en hombros, codos, muñecas, caderas, rodillas y tobillos.",
  },
  bear_hug: {
    id: "bear_hug",
    displayName: "Abrazo de oso",
    shortLabel: "Contención con presión",
    instructions: "Dar un abrazo firme y sostenido durante varios segundos.",
  },
  hand_press: {
    id: "hand_press",
    displayName: "Presión de manos",
    shortLabel: "Presión simple y rápida",
    instructions: "Juntar palmas y empujar durante varios segundos.",
  },
  pancake: {
    id: "pancake",
    displayName: "Pancake",
    shortLabel: "Presión profunda sostenida",
    instructions: "Aplicar presión firme y sostenida con mucho cuidado y siempre observando comodidad.",
  },
  burrito: {
    id: "burrito",
    displayName: "Burrito",
    shortLabel: "Presión envolvente",
    instructions: "Envolver con sábana o manta de forma segura y firme, sin apretar demasiado.",
  },
  wall_sit: {
    id: "wall_sit",
    displayName: "Wall sit",
    shortLabel: "Fuerza quieta",
    instructions: "Sentarse en la pared por unos segundos y repetir si lo tolera bien.",
  },
  rocking: {
    id: "rocking",
    displayName: "Mecerse",
    shortLabel: "Movimiento lento y calmante",
    instructions: "Balancearse lenta y ritmicamente.",
  },
  slow_sway: {
    id: "slow_sway",
    displayName: "Balanceo lento",
    shortLabel: "Ritmo predecible",
    instructions: "Moverse de lado a lado muy suave y lento.",
  },
  quadruped_rocking: {
    id: "quadruped_rocking",
    displayName: "Balanceo en 4 apoyos",
    shortLabel: "Ritmo en el cuerpo",
    instructions: "En cuatro apoyos, balancearse lento hacia adelante y atras.",
  },
  cat_cow_slow: {
    id: "cat_cow_slow",
    displayName: "Gato-vaca lento",
    shortLabel: "Movimiento lento",
    instructions: "Mover la espalda lento entre gato y vaca sin prisa.",
  },
  taquito_roll: {
    id: "taquito_roll",
    displayName: "Rodar como taquito",
    shortLabel: "Rodar con calma",
    instructions: "Rodar lento en el piso y pausar entre cada vuelta.",
  },
  slow_clapping: {
    id: "slow_clapping",
    displayName: "Palmadas lentas",
    shortLabel: "Ritmo simple",
    instructions: "Hacer palmadas lentas y predecibles.",
  },
  repetitive_song: {
    id: "repetitive_song",
    displayName: "Cancion repetitiva",
    shortLabel: "Ritmo con voz",
    instructions: "Usar una cancion corta, lenta y repetitiva.",
  },
  humming_rhythm: {
    id: "humming_rhythm",
    displayName: "Tarareo con ritmo",
    shortLabel: "Ritmo + vibracion",
    instructions: "Tararear de forma repetitiva y lenta.",
  },
  steady_sway: {
    id: "steady_sway",
    displayName: "Balanceo continuo",
    shortLabel: "Ritmo corporal",
    instructions: "Balancearse con un ritmo constante y muy predecible.",
  },
  count_and_sway: {
    id: "count_and_sway",
    displayName: "Contar y mecerse",
    shortLabel: "Contar sin activar",
    instructions: "Contar con voz baja mientras se mecen lentamente.",
  },
  reading_together: {
    id: "reading_together",
    displayName: "Leer juntos",
    shortLabel: "Conexion tranquila",
    instructions: "Leer un cuento breve con voz lenta y muy calmada.",
  },
  long_hug: {
    id: "long_hug",
    displayName: "Abrazo largo",
    shortLabel: "Cercania segura",
    instructions: "Dar un abrazo sostenido y tranquilo.",
  },
  sing_together_soft: {
    id: "sing_together_soft",
    displayName: "Cantar juntos suave",
    shortLabel: "Conexion con voz",
    instructions: "Cantar una cancion lenta y familiar juntos.",
  },
  breathe_together: {
    id: "breathe_together",
    displayName: "Respirar juntos",
    shortLabel: "Co-regulación",
    instructions: "Respirar juntos sin exigir perfeccion, solo acompanando.",
  },
  bedtime_ritual_phrase: {
    id: "bedtime_ritual_phrase",
    displayName: "Frase de cierre",
    shortLabel: "Ritual simple",
    instructions: "Repetir cada noche una frase corta y segura.",
  },
  quiet_snuggle: {
    id: "quiet_snuggle",
    displayName: "Acurrucarse en calma",
    shortLabel: "Cercania sin activar",
    instructions: "Quedarse juntos en silencio o casi en silencio.",
  },
  lie_together_briefly: {
    id: "lie_together_briefly",
    displayName: "Acostarse juntos un momento",
    shortLabel: "Presencia breve",
    instructions: "Acostarse unos minutos y luego pasar a la retirada gradual.",
  },
  rocking_hug: {
    id: "rocking_hug",
    displayName: "Abrazo con balanceo",
    shortLabel: "Contacto + ritmo",
    instructions: "Abrazarlo mientras lo meces suavemente.",
  },
  humming_together: {
    id: "humming_together",
    displayName: "Tarareo juntos",
    shortLabel: "Voz + cercania",
    instructions: "Tararear juntos o tu sola mientras lo sostienes cerca.",
  },
  breathe_together_rhythm: {
    id: "breathe_together_rhythm",
    displayName: "Respirar juntos con ritmo",
    shortLabel: "Ritmo compartido",
    instructions: "Respirar juntos siguiendo un ritmo simple y lento.",
  },
  sway_with_contact: {
    id: "sway_with_contact",
    displayName: "Balanceo con contacto",
    shortLabel: "Contacto regulador",
    instructions: "Balancearse lento sin quitar el contacto.",
  },
  hold_and_sway: {
    id: "hold_and_sway",
    displayName: "Sostener y mecer",
    shortLabel: "Contencion ritmica",
    instructions: "Sostener con firmeza suave mientras se mecen.",
  },
  song_with_hug: {
    id: "song_with_hug",
    displayName: "Cancion con abrazo",
    shortLabel: "Voz calmante",
    instructions: "Cantar en voz baja mientras mantienes el abrazo.",
  },
  humming: {
    id: "humming",
    displayName: "Tarareo",
    shortLabel: "Vibracion calmante",
    instructions: "Tararear un sonido continuo por varios segundos.",
  },
  gargling: {
    id: "gargling",
    displayName: "Gargaras",
    shortLabel: "Activacion del vago",
    instructions: "Hacer gargaras breves con supervision si lo tolera bien.",
  },
  closed_mouth_humming: {
    id: "closed_mouth_humming",
    displayName: "Sonido mmm",
    shortLabel: "Vibracion suave",
    instructions: "Hacer sonido mmm con labios cerrados por varios segundos.",
  },
  eye_movement_vagal_sequence: {
    id: "eye_movement_vagal_sequence",
    displayName: "Movimientos oculares",
    shortLabel: "Secuencia ocular vagal",
    instructions:
      "Mantener cada dirección por 3 segundos: arriba, abajo, izquierda, derecha, diagonales, círculos a ambos lados y convergencia, sin mover la cabeza.",
  },
  blow_imaginary_candles: {
    id: "blow_imaginary_candles",
    displayName: "Soplar velitas imaginarias",
    shortLabel: "Exhalacion larga",
    instructions: "Soplar lento y largo como si apagara velitas.",
  },
  follow_toy_with_eyes: {
    id: "follow_toy_with_eyes",
    displayName: "Seguir un juguete con los ojos",
    shortLabel: "Seguimiento ocular",
    instructions: "Seguir un objeto lento con los ojos sin mover la cabeza.",
  },
  follow_target_with_eyes: {
    id: "follow_target_with_eyes",
    displayName: "Seguir un objeto con los ojos",
    shortLabel: "Seguimiento visual",
    instructions: "Seguir lentamente un dedo o juguete con los ojos sin mover la cabeza.",
  },
  long_exhale_sound: {
    id: "long_exhale_sound",
    displayName: "Exhalacion larga con sonido",
    shortLabel: "Salida larga",
    instructions: "Exhalar largo haciendo un sonido suave como sss o mmm.",
  },
  soft_singing: {
    id: "soft_singing",
    displayName: "Cantar suave",
    shortLabel: "Voz calmante",
    instructions: "Cantar una cancion lenta y suave con voz baja.",
  },
  bunny_breaths: {
    id: "bunny_breaths",
    displayName: "Respiracion de conejito",
    shortLabel: "Respiracion cortita + salida larga",
    instructions: "Hacer tres inhalaciones cortas por la nariz y una exhalacion larga.",
  },
  belly_breathing: {
    id: "belly_breathing",
    displayName: "Respiracion abdominal",
    shortLabel: "Respiracion de barriga",
    instructions: "Poner manos o un peluche en la barriga y notar cómo sube y baja.",
  },
  smell_flower_blow_candle: {
    id: "smell_flower_blow_candle",
    displayName: "Oler flor y soplar vela",
    shortLabel: "Respiracion guiada",
    instructions: "Inhalar suave y exhalar largo como si soplara una vela.",
  },
  exhale_longer_than_inhale: {
    id: "exhale_longer_than_inhale",
    displayName: "Exhalar más largo que inhalar",
    shortLabel: "Salida larga calmante",
    instructions: "Exhalar siempre un poco más largo que la inhalación.",
  },
  four_six_breathing: {
    id: "four_six_breathing",
    displayName: "Respiracion 4-6",
    shortLabel: "Ritmo respiratorio",
    instructions: "Inhalar 4, exhalar 6 si no le genera presión.",
  },
  guided_short_breathing: {
    id: "guided_short_breathing",
    displayName: "Respiracion guiada corta",
    shortLabel: "Respiracion simple",
    instructions: "Hacer pocas repeticiones de respiración guiada, sin insistir demasiado.",
  },
  hand_on_belly_breath: {
    id: "hand_on_belly_breath",
    displayName: "Mano en barriga",
    shortLabel: "Respirar con apoyo",
    instructions: "Poner una mano en la barriga para ayudar a sentir la respiracion.",
  },
  silent_slow_breathing: {
    id: "silent_slow_breathing",
    displayName: "Respiracion lenta en silencio",
    shortLabel: "Cerrar en calma",
    instructions: "Respirar lento y en silencio sin volverlo una tarea larga.",
  },
  short_story: {
    id: "short_story",
    displayName: "Historia corta",
    shortLabel: "Transicion suave",
    instructions: "Leer o contar algo breve, simple y sin emocion intensa.",
  },
  soft_music: {
    id: "soft_music",
    displayName: "Musica suave",
    shortLabel: "Acompanar el cierre",
    instructions: "Usar musica lenta y repetitiva, sin cambios bruscos.",
  },
  ritual_phrase: {
    id: "ritual_phrase",
    displayName: "Frase ritual",
    shortLabel: "Mensaje final",
    instructions: "Repetir una frase breve de cierre cada noche.",
  },
  lights_low_silence: {
    id: "lights_low_silence",
    displayName: "Luz baja y silencio",
    shortLabel: "Puente final",
    instructions: "Bajar luces, reducir voz y dejar que el cuarto haga parte del trabajo.",
  },
  short_audio: {
    id: "short_audio",
    displayName: "Audio corto",
    shortLabel: "Cierre suave",
    instructions: "Un audio breve, monotono y tranquilo.",
  },
  final_snuggle_then_bed: {
    id: "final_snuggle_then_bed",
    displayName: "Ultimo abrazo y cama",
    shortLabel: "Cierre con contencion",
    instructions: "Un ultimo abrazo breve y luego ir a la cama sin abrir una actividad nueva.",
  },
  final_breath: {
    id: "final_breath",
    displayName: "Respiracion final",
    shortLabel: "Ultimo puente",
    instructions: "Una o dos exhalaciones largas y luego dormir.",
  },
  repetitive_short_story: {
    id: "repetitive_short_story",
    displayName: "Historia repetitiva",
    shortLabel: "Bajar la mente",
    instructions: "Historia muy corta, sin acción ni conflicto.",
  },
  descriptive_story: {
    id: "descriptive_story",
    displayName: "Historia descriptiva",
    shortLabel: "Describir sin activar",
    instructions: "Describir un lugar calmado con voz suave y monotona.",
  },
  calm_audio: {
    id: "calm_audio",
    displayName: "Audio calmado",
    shortLabel: "Audio tranquilo",
    instructions: "Audio corto, lento y sin estimulos fuertes.",
  },
  simple_guided_imagery: {
    id: "simple_guided_imagery",
    displayName: "Visualizacion simple",
    shortLabel: "Imagen mental suave",
    instructions: "Guiarlo con una imagen muy simple y segura, sin detalle excesivo.",
  },
};

const profileOrders = {
  A: ["preparar_para_dormir", "movimiento_descarga", "propiocepcion", "vestibular_lento", "bano_basico", "bano_regulacion", "respiracion", "transicion"],
  B: ["preparar_para_dormir", "activacion_ligera", "propiocepcion", "ritmo", "bano_basico", "bano_regulacion", "respiracion", "audio_historia_corta", "transicion"],
  C: ["preparar_para_dormir", "conexion", "propiocepcion", "ritmo", "bano_basico", "bano_regulacion", "respiracion", "limite_claro", "transicion"],
  D: ["preparar_para_dormir", "propiocepcion_profunda", "contacto_ritmo", "bano_basico", "bano_regulacion", "respiracion", "transicion"],
  E: ["preparar_para_dormir", "trabajo_pesado_movimiento", "propiocepcion_fuerte", "vestibular_lento", "bano_basico", "bano_regulacion", "respiracion", "transicion"],
  F: ["preparar_para_dormir", "conexion", "propiocepcion_profunda", "contacto_ritmo", "bano_basico", "bano_regulacion", "respiracion", "retirada_gradual", "transicion"],
  G: ["preparar_para_dormir", "movimiento_corporal", "propiocepcion", "ritmo", "bano_basico", "bano_regulacion", "respiracion", "audio_historia_corta", "transicion"],
  H: ["preparar_para_dormir", "propiocepcion", "ritmo", "bano_basico", "bano_regulacion", "respiracion", "transicion"],
};

const dropdownOptions = {
  A: {
    preparar_para_dormir: ["bath_or_shower", "put_on_pajamas", "dim_lights", "remove_screens", "calm_voice_transition"],
    movimiento_descarga: ["animal_walks", "wall_push_fast", "fast_crawling", "marching_strong", "wheelbarrow"],
    propiocepcion: ["deep_pressure_squeeze", "joint_compressions", "wall_pushups", "bear_hug", "hand_press"],
    vestibular_lento: ["rocking", "slow_sway", "quadruped_rocking", "cat_cow_slow", "taquito_roll"],
    bano_regulacion: ["gargling", "humming", "eye_movement_vagal_sequence", "closed_mouth_humming", "blow_imaginary_candles"],
    respiracion: ["bunny_breaths", "belly_breathing", "smell_flower_blow_candle", "exhale_longer_than_inhale", "four_six_breathing"],
    transicion: ["ritual_phrase", "lights_low_silence", "soft_music", "final_breath", "short_story"],
  },
  B: {
    preparar_para_dormir: ["bath_or_shower", "put_on_pajamas", "dim_lights", "remove_screens", "calm_voice_transition"],
    activacion_ligera: ["gateo_lento", "wall_push_soft", "light_marching", "gentle_stretching", "slow_walking"],
    propiocepcion: ["deep_pressure_squeeze", "joint_compressions", "hand_press", "wall_pushups", "bear_hug"],
    ritmo: ["rocking", "slow_clapping", "repetitive_song", "humming_rhythm", "steady_sway"],
    bano_regulacion: ["gargling", "humming", "eye_movement_vagal_sequence", "closed_mouth_humming", "blow_imaginary_candles"],
    respiracion: ["belly_breathing", "smell_flower_blow_candle", "bunny_breaths", "guided_short_breathing", "exhale_longer_than_inhale"],
    transicion: ["short_story", "soft_music", "ritual_phrase", "lights_low_silence", "short_audio"],
    audio_historia_corta: ["repetitive_short_story", "descriptive_story", "calm_audio", "soft_music", "simple_guided_imagery"],
  },
  C: {
    preparar_para_dormir: ["bath_or_shower", "put_on_pajamas", "dim_lights", "remove_screens", "calm_voice_transition"],
    conexion: ["reading_together", "long_hug", "sing_together_soft", "breathe_together", "bedtime_ritual_phrase"],
    propiocepcion: ["deep_pressure_squeeze", "joint_compressions", "bear_hug", "hand_press", "pancake"],
    ritmo: ["repetitive_song", "rocking", "humming_rhythm", "slow_clapping", "count_and_sway"],
    bano_regulacion: ["gargling", "humming", "eye_movement_vagal_sequence", "closed_mouth_humming", "blow_imaginary_candles"],
    respiracion: ["belly_breathing", "smell_flower_blow_candle", "bunny_breaths", "guided_short_breathing", "exhale_longer_than_inhale"],
    transicion: ["ritual_phrase", "lights_low_silence", "short_story", "soft_music", "final_breath"],
  },
  D: {
    preparar_para_dormir: ["bath_or_shower", "put_on_pajamas", "dim_lights", "calm_voice_transition", "remove_screens"],
    propiocepcion_profunda: ["deep_pressure_squeeze", "joint_compressions", "bear_hug", "pancake", "burrito"],
    contacto_ritmo: ["rocking_hug", "humming_together", "breathe_together_rhythm", "sway_with_contact", "hold_and_sway"],
    bano_regulacion: ["gargling", "humming", "eye_movement_vagal_sequence", "closed_mouth_humming", "blow_imaginary_candles"],
    respiracion: ["belly_breathing", "guided_short_breathing", "hand_on_belly_breath", "exhale_longer_than_inhale", "silent_slow_breathing"],
    transicion: ["lights_low_silence", "final_snuggle_then_bed", "short_story", "soft_music", "final_breath"],
  },
  E: {
    preparar_para_dormir: ["bath_or_shower", "put_on_pajamas", "dim_lights", "remove_screens", "calm_voice_transition"],
    trabajo_pesado_movimiento: ["wall_pushups", "carry_objects", "push_chair", "army_crawl", "animal_walks_heavy"],
    propiocepcion_fuerte: ["deep_pressure_squeeze", "joint_compressions", "wall_sit", "wall_pushups", "carry_objects"],
    vestibular_lento: ["rocking", "slow_sway", "quadruped_rocking", "cat_cow_slow", "taquito_roll"],
    bano_regulacion: ["gargling", "humming", "eye_movement_vagal_sequence", "closed_mouth_humming", "blow_imaginary_candles"],
    respiracion: ["bunny_breaths", "belly_breathing", "smell_flower_blow_candle", "exhale_longer_than_inhale", "four_six_breathing"],
    transicion: ["ritual_phrase", "lights_low_silence", "soft_music", "short_story", "final_breath"],
  },
  F: {
    preparar_para_dormir: ["bath_or_shower", "put_on_pajamas", "dim_lights", "calm_voice_transition", "remove_screens"],
    conexion: ["long_hug", "reading_together", "breathe_together", "quiet_snuggle", "lie_together_briefly"],
    propiocepcion_profunda: ["deep_pressure_squeeze", "joint_compressions", "bear_hug", "pancake", "burrito"],
    contacto_ritmo: ["rocking_hug", "humming_together", "sway_with_contact", "song_with_hug", "hold_and_sway"],
    bano_regulacion: ["gargling", "humming", "eye_movement_vagal_sequence", "closed_mouth_humming", "humming_together"],
    respiracion: ["belly_breathing", "breathe_together_rhythm", "hand_on_belly_breath", "exhale_longer_than_inhale", "guided_short_breathing"],
    transicion: ["ritual_phrase", "lights_low_silence", "short_story", "soft_music", "final_breath"],
  },
  G: {
    preparar_para_dormir: ["bath_or_shower", "put_on_pajamas", "dim_lights", "remove_screens", "calm_voice_transition"],
    movimiento_corporal: ["gateo", "cross_body_taps", "gentle_yoga_flow", "stretching_sequence", "slow_marching"],
    propiocepcion: ["deep_pressure_squeeze", "joint_compressions", "hand_press", "wall_pushups", "carry_objects"],
    ritmo: ["humming_rhythm", "rocking", "repetitive_song", "slow_clapping", "count_and_sway"],
    bano_regulacion: ["gargling", "humming", "eye_movement_vagal_sequence", "closed_mouth_humming", "blow_imaginary_candles"],
    respiracion: ["belly_breathing", "four_six_breathing", "exhale_longer_than_inhale", "guided_short_breathing", "smell_flower_blow_candle"],
    audio_historia_corta: ["repetitive_short_story", "descriptive_story", "calm_audio", "soft_music", "simple_guided_imagery"],
    transicion: ["ritual_phrase", "lights_low_silence", "soft_music", "short_story", "final_breath"],
  },
  H: {
    preparar_para_dormir: ["bath_or_shower", "put_on_pajamas", "dim_lights", "calm_voice_transition", "remove_screens"],
    propiocepcion: ["deep_pressure_squeeze", "joint_compressions", "bear_hug", "hand_press", "wall_pushups"],
    ritmo: ["rocking", "humming_rhythm", "repetitive_song", "steady_sway", "count_and_sway"],
    bano_regulacion: ["gargling", "humming", "eye_movement_vagal_sequence", "closed_mouth_humming", "blow_imaginary_candles"],
    respiracion: ["belly_breathing", "exhale_longer_than_inhale", "guided_short_breathing", "hand_on_belly_breath", "silent_slow_breathing"],
    transicion: ["ritual_phrase", "lights_low_silence", "soft_music", "short_story", "final_breath"],
  },
};

const specialGuidance = {
  preparar_para_dormir: {
    title: "Preparar para dormir",
    guidance: "Esta fase prepara el cuerpo y el ambiente para que la rutina funcione mejor.",
    examples: ["Baño o ducha tibia", "Ponerse pijama", "Bajar la luz", "Apagar pantallas", "Voz calmada"],
  },
  bano_basico: {
    title: "Baño y dientes",
    guidance: "Antes de activar la calma, hagan lo práctico: cepillado de dientes e ir al baño por última vez.",
    examples: ["Cepillado de dientes", "Ir al baño por última vez"],
  },
  limite_claro: {
    title: "Limite claro",
    guidance:
      "Después de esta rutina ya no seguimos agregando más pasos. Habla poco, con voz calmada, y transmite seguridad.",
    examples: ["Ya es hora de dormir. Te quiero mucho.", "Tu cuerpo ya puede descansar.", "Ya terminamos por hoy."],
  },
  retirada_gradual: {
    title: "Retirada gradual",
    guidance: "Empieza con mucha cercania y reducela poco a poco, sin desaparecer de golpe.",
    examples: ["Al lado de la cama", "Un poco más lejos", "Cerca de la puerta", "Desde la puerta", "Fuera del cuarto"],
  },
};

Object.assign(phaseLabels, {
  mover: "Mover",
  banarse_y_pijamas: "Bañarse y pijamas",
  conectar: "Conectar",
  cepillarse_los_dientes: "Cepillarse los dientes",
  a_la_cama: "A la cama",
  calmar_el_cuerpo: "Calmar el cuerpo",
  extra_calma: "Extra calma",
  dormir: "Dormir",
});

Object.assign(phasePurpose, {
  mover: "Ayuda a tu hijo a mover el sistema nervioso hacia el estado que necesita.",
  banarse_y_pijamas: "Es momento de bajar el ritmo del día.",
  conectar: "Dale unos minutos donde sienta que tiene toda tu atención.",
  cepillarse_los_dientes: "Mientras tu hijo se cepilla, empezamos a calmar el sistema nervioso.",
  a_la_cama: "Desde aquí no regresamos al baño.",
  calmar_el_cuerpo: "Aquí es donde tu hijo se duerme. Empieza con una opción y observa.",
  extra_calma: "Si todavía no está listo, puedes probar una opción suave adicional.",
  limite_claro: "Después de esta rutina ya no seguimos agregando más pasos.",
  dormir: "Frase corta, silencio, luz baja y no nuevas actividades.",
});

Object.assign(phaseDurations, {
  mover: 4,
  banarse_y_pijamas: 20,
  conectar: 8,
  cepillarse_los_dientes: 4,
  a_la_cama: 1,
  calmar_el_cuerpo: 5,
  extra_calma: 5,
  dormir: 1,
});

Object.assign(specialGuidance, {
  a_la_cama: {
    title: "A la cama",
    guidance: "Desde aquí no regresamos al baño.",
    examples: ["Luz baja", "Sin nuevas actividades", "Cuerpo en la cama"],
  },
  dormir: {
    title: "Dormir",
    guidance: "Frase corta, silencio, luz baja y no nuevas actividades.",
    examples: ["Ya es momento de dormir.", "Tu cuerpo ya puede descansar.", "Estoy cerca."],
  },
});

Object.assign(activityCatalog, {
  bano_tibio: {
    id: "bano_tibio",
    displayName: "Baño o ducha tibia",
    shortLabel: "Bajar el ritmo del día",
    instructions: "Baño o ducha tibia, sin juego activo ni estimulación extra.",
  },
  ponerse_pijama: {
    id: "ponerse_pijama",
    displayName: "Ponerse pijama",
    shortLabel: "Señal clara de noche",
    instructions: "Ponerse la pijama con luz suave y ambiente calmado.",
  },
  luz_baja: {
    id: "luz_baja",
    displayName: "Luz baja",
    shortLabel: "Reducir estimulación",
    instructions: "Bajar la luz o cambiar a luz cálida.",
  },
  ir_al_bano: {
    id: "ir_al_bano",
    displayName: "Ir al baño",
    shortLabel: "Última vez",
    instructions: "Ir al baño una última vez antes de pasar a la cama.",
  },
  cepillado_de_dientes: {
    id: "cepillado_de_dientes",
    displayName: "Cepillado de dientes",
    shortLabel: "Input oral con calma",
    instructions: "Cepillar los dientes con calma, sin juego ni apuro.",
  },
  hablar_del_dia: {
    id: "hablar_del_dia",
    displayName: "Hablar del día",
    shortLabel: "Conexión tranquila",
    instructions: "Unos minutos de conversación tranquila, sin abrir temas intensos.",
  },
  actividad_tranquila_preferida: {
    id: "actividad_tranquila_preferida",
    displayName: "Actividad tranquila preferida",
    shortLabel: "Atención completa",
    instructions: "Una actividad corta y tranquila donde sienta que tiene tu atención.",
  },
  rompecabezas: {
    id: "rompecabezas",
    displayName: "Rompecabezas",
    shortLabel: "Juego tranquilo",
    instructions: "Rompecabezas simple, sin reto difícil ni competencia.",
  },
  plastilina: {
    id: "plastilina",
    displayName: "Plastilina",
    shortLabel: "Manos tranquilas",
    instructions: "Juego breve con plastilina, manteniendo voz y luz bajas.",
  },
  staring_contest: {
    id: "staring_contest",
    displayName: "Juego de miradas",
    shortLabel: "Conexión simple",
    instructions: "Juego breve y suave, sin convertirlo en risa intensa.",
  },
  juego_de_manos: {
    id: "juego_de_manos",
    displayName: "Juego de manos",
    shortLabel: "Ritmo tranquilo",
    instructions: "Juego simple de manos con ritmo lento.",
  },
  juego_de_cartas_simple: {
    id: "juego_de_cartas_simple",
    displayName: "Juego de cartas simple",
    shortLabel: "Conexión corta",
    instructions: "Juego simple, corto y sin competencia intensa.",
  },
  inventar_historia_juntos: {
    id: "inventar_historia_juntos",
    displayName: "Inventar historia juntos",
    shortLabel: "Cierre emocional",
    instructions: "Historia corta, tranquila y sin aventura intensa.",
  },
  cantar_juntos_suave: {
    id: "cantar_juntos_suave",
    displayName: "Cantar juntos suave",
    shortLabel: "Voz calmante",
    instructions: "Cantar algo lento y repetitivo.",
  },
  presion_cuento: {
    id: "presion_cuento",
    displayName: "Presión profunda + cuento",
    shortLabel: "Presión + voz",
    instructions: "Aplica presión profunda lenta mientras lees un cuento corto. Compresiones articulares son opcionales.",
    comboGroup: "presion_voz",
  },
  presion_cancion: {
    id: "presion_cancion",
    displayName: "Presión profunda + canción",
    shortLabel: "Presión + canción",
    instructions: "Presión profunda lenta con canción repetitiva o tarareo.",
    comboGroup: "presion_voz",
  },
  acurrucarse_respirar: {
    id: "acurrucarse_respirar",
    displayName: "Acurrucarse + respiración",
    shortLabel: "Contacto + respiración",
    instructions: "Abrazo o acurrucarse, respirando juntos con exhalación larga.",
    comboGroup: "contacto_respiracion",
  },
  ojos_soplar_respirar: {
    id: "ojos_soplar_respirar",
    displayName: "Ojos + soplar + respiración",
    shortLabel: "Foco + calma",
    instructions: "Movimientos oculares lentos, soplar velitas y respiración tranquila.",
    comboGroup: "foco_calma",
  },
  presion_susurro: {
    id: "presion_susurro",
    displayName: "Presión profunda + susurro",
    shortLabel: "Presión + voz bajita",
    instructions: "Presión profunda con frases calmadas y voz bajita.",
    comboGroup: "presion_voz",
  },
  presion_contar: {
    id: "presion_contar",
    displayName: "Presión profunda + contar lento",
    shortLabel: "Presión + conteo",
    instructions: "Presión profunda mientras cuentas lento con voz baja.",
    comboGroup: "presion_voz",
  },
  sandwich_almohadas: {
    id: "sandwich_almohadas",
    displayName: "Sandwich de almohadas",
    shortLabel: "Presión + contención",
    instructions: "Presión suave con almohadas y, si ayuda, cuento o canción tranquila.",
    comboGroup: "presion_contencion",
  },
  rodillo_almohada: {
    id: "rodillo_almohada",
    displayName: "Rodillo con almohada",
    shortLabel: "Presión lenta",
    instructions: "Presión lenta con almohada, acompañada de respiración o voz suave.",
    comboGroup: "presion_contencion",
  },
  peluche_pesado: {
    id: "peluche_pesado",
    displayName: "Peluche + presión",
    shortLabel: "Presión familiar",
    instructions: "Peluche con presión suave y cuento o canción tranquila.",
    comboGroup: "presion_contencion",
  },
  mecer_tararear: {
    id: "mecer_tararear",
    displayName: "Mecerse + tararear",
    shortLabel: "Contacto + ritmo",
    instructions: "Mecerse suave mientras tarareas de forma repetitiva.",
    comboGroup: "contacto_respiracion",
  },
  audio_calmado: {
    id: "audio_calmado",
    displayName: "Audio calmado",
    shortLabel: "Salida cognitiva",
    instructions: "Audio corto, lento y sin estímulos fuertes.",
  },
  historia_corta_repetitiva: {
    id: "historia_corta_repetitiva",
    displayName: "Historia corta repetitiva",
    shortLabel: "Historia sin activar",
    instructions: "Historia breve, repetitiva y sin acción.",
  },
  respiracion_abdominal: {
    id: "respiracion_abdominal",
    displayName: "Respiración abdominal",
    shortLabel: "Respirar lento",
    instructions: "Manos o peluche en la barriga, observando cómo sube y baja.",
  },
  exhalacion_larga: {
    id: "exhalacion_larga",
    displayName: "Exhalación larga",
    shortLabel: "Salida larga",
    instructions: "Exhalar más largo que inhalar, sin forzar.",
  },
  musica_suave: {
    id: "musica_suave",
    displayName: "Música suave",
    shortLabel: "Audio tranquilo",
    instructions: "Música lenta, repetitiva y sin cambios bruscos.",
  },
  contacto_y_ritmo: {
    id: "contacto_y_ritmo",
    displayName: "Contacto + ritmo",
    shortLabel: "Co-regulación",
    instructions: "Contacto físico seguro con ritmo lento y repetitivo.",
  },
  mecerse_abrazados: {
    id: "mecerse_abrazados",
    displayName: "Mecerse abrazados",
    shortLabel: "Contención + ritmo",
    instructions: "Mecerse muy lento con abrazo o cercanía.",
  },
  tarareo_suave: {
    id: "tarareo_suave",
    displayName: "Tarareo suave",
    shortLabel: "Voz calmante",
    instructions: "Tarareo bajo, repetitivo y sin melodía estimulante.",
  },
  respirar_juntos: {
    id: "respirar_juntos",
    displayName: "Respirar juntos",
    shortLabel: "Regular juntos",
    instructions: "Respirar juntos, dando más énfasis a la exhalación.",
  },
  voz_suave: {
    id: "voz_suave",
    displayName: "Voz suave",
    shortLabel: "Seguridad",
    instructions: "Voz baja con frases cortas y repetitivas.",
  },
  frase_ritual: {
    id: "frase_ritual",
    displayName: "Frase ritual",
    shortLabel: "Cierre predecible",
    instructions: "Una frase corta que se repite igual cada noche.",
  },
  mecerse_suave: {
    id: "mecerse_suave",
    displayName: "Mecerse suave",
    shortLabel: "Ritmo suave",
    instructions: "Movimiento pequeño, lento y predecible.",
  },
  historia_corta_opcional: {
    id: "historia_corta_opcional",
    displayName: "Historia corta opcional",
    shortLabel: "Cierre suave",
    instructions: "Historia muy breve si no activa más conversación.",
  },
});

Object.assign(profileOrders, {
  EL_INAGOTABLE: ["mover", "banarse_y_pijamas", "cepillarse_los_dientes", "a_la_cama", "calmar_el_cuerpo", "extra_calma", "dormir"],
  EL_DESVELADO: ["mover", "banarse_y_pijamas", "cepillarse_los_dientes", "a_la_cama", "calmar_el_cuerpo", "extra_calma", "dormir"],
  EL_NEGOCIADOR: ["conectar", "banarse_y_pijamas", "cepillarse_los_dientes", "a_la_cama", "calmar_el_cuerpo", "extra_calma", "limite_claro", "dormir"],
  EL_BERRINCHE: ["banarse_y_pijamas", "cepillarse_los_dientes", "a_la_cama", "calmar_el_cuerpo", "extra_calma", "dormir"],
  EL_SONAMBULO: ["banarse_y_pijamas", "cepillarse_los_dientes", "a_la_cama", "calmar_el_cuerpo", "extra_calma", "dormir"],
});

Object.assign(dropdownOptions, {
  EL_INAGOTABLE: {
    mover: ["animal_walks", "fast_crawling", "wall_push_fast", "marching_strong"],
    calmar_el_cuerpo: ["presion_cuento", "presion_cancion", "mecer_tararear", "ojos_soplar_respirar"],
    extra_calma: ["mecer_tararear", "acurrucarse_respirar", "presion_susurro", "presion_contar"],
  },
  EL_DESVELADO: {
    mover: ["gateo_lento", "light_marching", "gentle_stretching", "slow_walking", "cross_body_taps"],
    calmar_el_cuerpo: ["presion_cuento", "ojos_soplar_respirar", "acurrucarse_respirar", "presion_contar"],
    extra_calma: ["audio_calmado", "historia_corta_repetitiva", "respiracion_abdominal", "exhalacion_larga", "musica_suave"],
  },
  EL_NEGOCIADOR: {
    conectar: ["hablar_del_dia", "actividad_tranquila_preferida", "rompecabezas", "plastilina", "staring_contest", "juego_de_manos", "juego_de_cartas_simple", "inventar_historia_juntos", "cantar_juntos_suave"],
    calmar_el_cuerpo: ["presion_cuento", "presion_cancion", "acurrucarse_respirar", "presion_susurro"],
    extra_calma: ["acurrucarse_respirar", "mecer_tararear", "presion_susurro", "presion_contar"],
  },
  EL_BERRINCHE: {
    calmar_el_cuerpo: ["sandwich_almohadas", "presion_susurro", "mecer_tararear", "acurrucarse_respirar"],
    extra_calma: ["contacto_y_ritmo", "mecerse_abrazados", "tarareo_suave", "respirar_juntos", "voz_suave"],
  },
  EL_SONAMBULO: {
    calmar_el_cuerpo: ["presion_cuento", "acurrucarse_respirar", "presion_contar", "mecer_tararear"],
    extra_calma: ["respiracion_abdominal", "exhalacion_larga", "frase_ritual", "mecerse_suave", "historia_corta_opcional"],
  },
});

const routineProfileMap = {
  A: "EL_INAGOTABLE",
  E: "EL_INAGOTABLE",
  B: "EL_DESVELADO",
  G: "EL_DESVELADO",
  C: "EL_NEGOCIADOR",
  D: "EL_BERRINCHE",
  F: "EL_BERRINCHE",
  H: "EL_SONAMBULO",
};

export function buildPlan({
  profile,
  birthday,
  wakeTime,
  targetBedtime,
  dinnerTime,
  prepareDuration,
  napTaken,
  napWakeTime,
  priorLogs = [],
  selectedActivities = {},
  dislikedCounts = {},
}) {
  const ageYears = calculateAgeFromBirthday(birthday);
  const resolvedProfile = routineProfileMap[profile] || profile;
  const order = profileOrders[resolvedProfile] || profileOrders[profile] || [];
  const customPhaseDurations = {
    ...phaseDurations,
    preparar_para_dormir: Math.max(5, Math.min(90, Number(prepareDuration) || phaseDurations.preparar_para_dormir)),
  };
  const totalDuration = order.reduce((sum, phaseKey) => sum + (customPhaseDurations[phaseKey] || 3), 0);
  const sleepGoal = targetBedtime || calculateBedtime({ ageYears, wakeTime, napTaken, napWakeTime });
  const expectedLatency = getExpectedSleepLatency(priorLogs);
  const bedtime = addMinutes(sleepGoal, -expectedLatency);
  const routineStart = addMinutes(bedtime, -totalDuration);
  const resolvedDinnerTime = dinnerTime || addMinutes(routineStart, -35);
  let cursor = toMinutes(routineStart);
  const bedtimeMinutes = toMinutes(bedtime);

  const steps = order.map((phaseKey, index) => {
    const stepId = `${phaseKey}-${index + 1}`;
    const duration = customPhaseDurations[phaseKey] || 3;
    const start = cursor;
    const end = Math.min(start + duration, bedtimeMinutes);
    cursor = end;

    if (specialGuidance[phaseKey]) {
      return {
        id: stepId,
        phaseKey,
        label: phaseLabels[phaseKey],
        start: fromMinutes(start),
        end: fromMinutes(end),
        purpose: phasePurpose[phaseKey],
        guidance: specialGuidance[phaseKey],
        alternatives: [],
        selectedActivityId: null,
        selectedActivity: null,
      };
    }

    if (phaseKey === "preparar_para_dormir" || phaseKey === "banarse_y_pijamas" || phaseKey === "cepillarse_los_dientes") {
      const preparationIds =
        phaseKey === "cepillarse_los_dientes"
          ? ["ir_al_bano", "cepillado_de_dientes", "gargling", "humming", "closed_mouth_humming"]
          : phaseKey === "banarse_y_pijamas"
            ? ["bano_tibio", "ponerse_pijama", "luz_baja"]
            : ["bath_or_shower", "put_on_pajamas", "dim_lights"];
      const preparationItems = preparationIds.map((id) => activityCatalog[id]).filter(Boolean);
      return {
        id: stepId,
        phaseKey,
        label: phaseLabels[phaseKey],
        start: fromMinutes(start),
        end: fromMinutes(end),
        purpose: phasePurpose[phaseKey],
        preparationItems,
        alternatives: [],
        selectedActivityId: null,
        selectedActivity: null,
      };
    }

    const validOptions = getValidOptions(resolvedProfile, phaseKey, dislikedCounts);
    const manuallySelected = selectedActivities[stepId];
    const selectedActivityId = validOptions.includes(manuallySelected) ? manuallySelected : validOptions[0] || null;

    return {
      id: stepId,
      phaseKey,
      label: phaseLabels[phaseKey],
      start: fromMinutes(start),
      end: fromMinutes(end),
      purpose: phasePurpose[phaseKey],
      alternatives: validOptions.map((id) => activityCatalog[id]).filter(Boolean),
      selectedActivityId,
      selectedActivity: selectedActivityId ? activityCatalog[selectedActivityId] : null,
    };
  });

  return {
    profile: resolvedProfile,
    originalProfile: profile,
    ageYears,
    wakeTime,
    targetBedtime: sleepGoal,
    expectedLatency,
    bedtime,
    dinnerTime: resolvedDinnerTime,
    routineStart,
    steps,
  };
}

function getValidOptions(profile, phaseKey, dislikedCounts) {
  const options = dropdownOptions[profile]?.[phaseKey] || [];
  const counts = dislikedCounts[phaseKey] || {};

  return [...options].sort((left, right) => {
    const leftCount = counts[left] || 0;
    const rightCount = counts[right] || 0;
    if (leftCount !== rightCount) return leftCount - rightCount;
    return options.indexOf(left) - options.indexOf(right);
  });
}

function calculateBedtime({ ageYears, wakeTime, napTaken, napWakeTime }) {
  let bedtimeMinutes;

  if (ageYears >= 2 && ageYears <= 5 && napTaken && napWakeTime) {
    bedtimeMinutes = toMinutes(napWakeTime) + 390;
  } else if (ageYears >= 3 && !napTaken) {
    bedtimeMinutes = toMinutes(wakeTime) + 750;
  } else if (napTaken && napWakeTime) {
    bedtimeMinutes = toMinutes(napWakeTime) + 390;
  } else {
    bedtimeMinutes = toMinutes(wakeTime) + 735;
  }

  bedtimeMinutes = Math.max(toMinutes("18:30"), Math.min(toMinutes("21:00"), bedtimeMinutes));
  return fromMinutes(bedtimeMinutes);
}

function getExpectedSleepLatency(logs) {
  const recentLatencies = [...(logs || [])]
    .filter((entry) => Number.isFinite(Number(entry.latency)))
    .sort((left, right) => (left.date < right.date ? 1 : -1))
    .slice(0, 3)
    .map((entry) => Number(entry.latency));

  if (recentLatencies.length < 3) return 30;
  return Math.max(5, Math.round(recentLatencies.reduce((sum, latency) => sum + latency, 0) / recentLatencies.length));
}

export function calculateAgeFromBirthday(birthday) {
  if (!birthday) return 0;
  const today = new Date();
  const birthDate = new Date(`${birthday}T00:00:00`);
  let years = today.getFullYear() - birthDate.getFullYear();
  const monthDelta = today.getMonth() - birthDate.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
    years -= 1;
  }
  return Math.max(0, years);
}

export function formatAgeLabel(birthday, language = "es") {
  const years = calculateAgeFromBirthday(birthday);
  if (language === "en") {
    return years === 1 ? "1 year" : `${years} years`;
  }
  return years === 1 ? "1 año" : `${years} años`;
}

export function getActivityById(activityId) {
  return activityCatalog[activityId] || null;
}

export function calculateLatency(bedTime, sleepTime) {
  let difference = toMinutes(sleepTime) - toMinutes(bedTime);
  if (difference < 0) difference += 24 * 60;
  return difference;
}

export function buildChartPoints(logs) {
  const entries = [...logs].reverse();
  if (!entries.length) {
    return {
      points: "40,170 160,150 280,160 400,135 520,145 660,125",
      circles: [
        { x: 40, y: 170 },
        { x: 160, y: 150 },
        { x: 280, y: 160 },
        { x: 400, y: 135 },
        { x: 520, y: 145 },
        { x: 660, y: 125 },
      ],
      labels: [
        { x: 40, text: "N1" },
        { x: 160, text: "N2" },
        { x: 280, text: "N3" },
        { x: 400, text: "N4" },
        { x: 520, text: "N5" },
        { x: 660, text: "N6" },
      ],
      wakingBars: [
        { x: 28, y: 190, width: 24, height: 10 },
        { x: 148, y: 176, width: 24, height: 24 },
        { x: 268, y: 188, width: 24, height: 12 },
        { x: 388, y: 164, width: 24, height: 36 },
        { x: 508, y: 178, width: 24, height: 22 },
        { x: 648, y: 170, width: 24, height: 30 },
      ],
      empty: true,
    };
  }
  const maxLatency = Math.max(...entries.map((entry) => entry.latency || 0), 15);
  const maxNightWakings = Math.max(...entries.map((entry) => normalizeNightWakings(entry.nightWakings)), 1);
  const inner = 540;

  const latencyPoints = entries.map((entry, index) => {
    const x = 40 + (index * inner) / Math.max(entries.length - 1, 1);
    const y = 190 - ((entry.latency || 0) / maxLatency) * 150;
    return { x, y };
  });

  const wakingBars = entries.map((entry, index) => {
    const x = 28 + (index * inner) / Math.max(entries.length - 1, 1);
    const value = normalizeNightWakings(entry.nightWakings);
    const height = value === 0 ? 4 : (value / maxNightWakings) * 52;
    return {
      x,
      y: 200 - height,
      width: 24,
      height,
      value,
    };
  });

  return {
    points: latencyPoints.map((point) => `${point.x},${point.y}`).join(" "),
    circles: latencyPoints,
    wakingBars,
    labels: entries.map((entry, index) => ({
      text: entry.date?.slice(5) || "",
      x: 40 + (index * inner) / Math.max(entries.length - 1, 1),
    })),
  };
}

export function normalizeNightWakings(value) {
  if (value === "pending") return 0;
  if (value === "3+") return 3;
  return Number(value || 0);
}

export function buildProgressSummary(logs) {
  if (!logs.length) {
    return {
      averageLatency: 0,
      averageNightWakings: 0,
      bedtimeConsistency: 0,
    };
  }

  const averageLatency = Math.round(logs.reduce((sum, log) => sum + (log.latency || 0), 0) / logs.length);
  const averageNightWakings =
    Math.round((logs.reduce((sum, log) => sum + normalizeNightWakings(log.nightWakings), 0) / logs.length) * 10) / 10;

  const bedtimes = logs.map((log) => toMinutes(log.bedTime));
  const averageBedtime = bedtimes.reduce((sum, value) => sum + value, 0) / bedtimes.length;
  const variance =
    bedtimes.reduce((sum, value) => sum + Math.abs(value - averageBedtime), 0) / Math.max(bedtimes.length, 1);
  const bedtimeConsistency = Math.max(0, Math.round(100 - variance));

  return {
    averageLatency,
    averageNightWakings,
    bedtimeConsistency,
  };
}

export function getSleepAreaResult(checkedCount) {
  if (checkedCount >= 5) {
    return {
      tone: "good",
      label: "Tu ambiente está ayudando al sueño",
    };
  }

  if (checkedCount >= 3) {
    return {
      tone: "ok",
      label: "Estás cerca. Pequeños ajustes pueden mejorar mucho",
    };
  }

  return {
    tone: "alert",
    label: "El ambiente podría estar dificultando el sueño",
  };
}

export function getChildSlots(premiumAccess) {
  return {
    included: 3,
    extraChildren: 0,
    total: 3,
  };
}

function toMinutes(time) {
  const [hour, minute] = String(time || "00:00").split(":").map(Number);
  return hour * 60 + minute;
}

function fromMinutes(total) {
  const normalized = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const hour = String(Math.floor(normalized / 60)).padStart(2, "0");
  const minute = String(normalized % 60).padStart(2, "0");
  return `${hour}:${minute}`;
}

function addMinutes(time, minutes) {
  return fromMinutes(toMinutes(time) + minutes);
}
