export const phaseLabels = {
  movimiento_descarga: "Descargar energia",
  activacion_ligera: "Activar suave",
  movimiento_corporal: "Llevar el cuerpo al centro",
  trabajo_pesado_movimiento: "Trabajo fuerte",
  propiocepcion: "Organizar el cuerpo",
  propiocepcion_profunda: "Presion profunda",
  propiocepcion_fuerte: "Presion fuerte",
  vestibular_lento: "Movimiento lento",
  ritmo: "Ritmo",
  conexion: "Conexion",
  contacto_ritmo: "Contacto + ritmo",
  vago: "Activar calma",
  vago_suave: "Calma suave",
  respiracion: "Respiracion",
  transicion: "Transicion a sueno",
  audio_historia_corta: "Audio / historia corta",
  limite_claro: "Limite claro",
  retirada_gradual: "Retirada gradual",
};

const phasePurpose = {
  movimiento_descarga: "Soltar activacion y adrenalina antes de pedir calma.",
  activacion_ligera: "Despertar un poco el cuerpo para salir del bloqueo.",
  movimiento_corporal: "Sacar a la mente del centro y llevar el sistema al cuerpo.",
  trabajo_pesado_movimiento: "Dar trabajo fuerte y organizado antes de bajar.",
  propiocepcion: "Ordenar el cuerpo con presion e input organizado.",
  propiocepcion_profunda: "Dar contencion profunda y segura cuando el sistema esta sobrepasado.",
  propiocepcion_fuerte: "Ofrecer input fuerte para un cuerpo inquieto que sigue buscando.",
  vestibular_lento: "Marcar ritmo con movimiento lento y predecible.",
  ritmo: "Usar repeticion para ayudar al cerebro a cambiar de velocidad.",
  conexion: "Llenar primero el vaso de seguridad y cercania.",
  contacto_ritmo: "Combinar contacto y ritmo para co-regular.",
  vago: "Activar una senal de calma mas directa.",
  vago_suave: "Bajar con una senal suave y menos demandante.",
  respiracion: "Cerrar con una salida mas organizada hacia el sueno.",
  transicion: "Hacer el puente final a dormir sin reactivar.",
  audio_historia_corta: "Ayudar a la mente a aterrizar sin abrir historias intensas.",
  limite_claro: "Cerrar la rutina sin seguir agregando pasos.",
  retirada_gradual: "Reducir tu presencia de forma lenta y predecible.",
};

const phaseDurations = {
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
  vago: 3,
  vago_suave: 3,
  respiracion: 3,
  transicion: 4,
  audio_historia_corta: 4,
  limite_claro: 2,
  retirada_gradual: 3,
};

const activityCatalog = {
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
    displayName: "Gateo rapido",
    shortLabel: "Descarga rapida en el piso",
    instructions: "Gatear rapido de un lado a otro del cuarto por 30 a 60 segundos.",
  },
  marching_strong: {
    id: "marching_strong",
    displayName: "Marcha fuerte",
    shortLabel: "Activacion fuerte organizada",
    instructions: "Marchen levantando las rodillas con fuerza durante 30 a 60 segundos.",
  },
  wheelbarrow: {
    id: "wheelbarrow",
    displayName: "Carretilla",
    shortLabel: "Trabajo corporal fuerte",
    instructions: "Sosten sus piernas y dejen que avance con las manos por unos segundos.",
  },
  gateo_lento: {
    id: "gateo_lento",
    displayName: "Gateo lento",
    shortLabel: "Activacion suave",
    instructions: "Gatear despacio y con control durante unos segundos.",
  },
  wall_push_soft: {
    id: "wall_push_soft",
    displayName: "Empujar la pared suave",
    shortLabel: "Presion suave",
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
    shortLabel: "Cruzar la linea media",
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
    shortLabel: "Presion activa",
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
    displayName: "Squeeze / presion profunda",
    shortLabel: "Presion profunda facil y efectiva",
    instructions: "Aplicar presion firme y lenta en brazos, piernas u hombros de forma segura.",
  },
  joint_compressions: {
    id: "joint_compressions",
    displayName: "Compresiones articulares",
    shortLabel: "Compresiones organizadoras",
    instructions: "Hacer compresiones suaves y organizadas en hombros, codos, munecas, caderas, rodillas y tobillos.",
  },
  bear_hug: {
    id: "bear_hug",
    displayName: "Abrazo de oso",
    shortLabel: "Contencion con presion",
    instructions: "Dar un abrazo firme y sostenido durante varios segundos.",
  },
  hand_press: {
    id: "hand_press",
    displayName: "Presion de manos",
    shortLabel: "Presion simple y rapida",
    instructions: "Juntar palmas y empujar durante varios segundos.",
  },
  pancake: {
    id: "pancake",
    displayName: "Pancake",
    shortLabel: "Presion profunda sostenida",
    instructions: "Aplicar presion firme y sostenida con mucho cuidado y siempre observando comodidad.",
  },
  burrito: {
    id: "burrito",
    displayName: "Burrito",
    shortLabel: "Presion envolvente",
    instructions: "Envolver con sabana o manta de forma segura y firme, sin apretar demasiado.",
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
    shortLabel: "Co-regulacion",
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
      "Mantener cada direccion por 3 segundos: arriba, abajo, izquierda, derecha, diagonales, circulos a ambos lados y convergencia, sin mover la cabeza.",
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
    instructions: "Poner manos o un peluche en la barriga y notar como sube y baja.",
  },
  smell_flower_blow_candle: {
    id: "smell_flower_blow_candle",
    displayName: "Oler flor y soplar vela",
    shortLabel: "Respiracion guiada",
    instructions: "Inhalar suave y exhalar largo como si soplara una vela.",
  },
  exhale_longer_than_inhale: {
    id: "exhale_longer_than_inhale",
    displayName: "Exhalar mas largo que inhalar",
    shortLabel: "Salida larga calmante",
    instructions: "Exhalar siempre un poco mas largo que la inhalacion.",
  },
  four_six_breathing: {
    id: "four_six_breathing",
    displayName: "Respiracion 4-6",
    shortLabel: "Ritmo respiratorio",
    instructions: "Inhalar 4, exhalar 6 si no le genera presion.",
  },
  guided_short_breathing: {
    id: "guided_short_breathing",
    displayName: "Respiracion guiada corta",
    shortLabel: "Respiracion simple",
    instructions: "Hacer pocas repeticiones de respiracion guiada, sin insistir demasiado.",
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
    instructions: "Historia muy corta, sin accion ni conflicto.",
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
  A: ["movimiento_descarga", "propiocepcion", "vestibular_lento", "vago", "respiracion", "transicion"],
  B: ["activacion_ligera", "propiocepcion", "ritmo", "vago", "respiracion", "transicion", "audio_historia_corta"],
  C: ["conexion", "propiocepcion", "ritmo", "vago", "respiracion", "limite_claro", "transicion"],
  D: ["propiocepcion_profunda", "contacto_ritmo", "vago_suave", "respiracion", "transicion"],
  E: ["trabajo_pesado_movimiento", "propiocepcion_fuerte", "vestibular_lento", "vago", "respiracion", "transicion"],
  F: ["conexion", "propiocepcion_profunda", "contacto_ritmo", "vago_suave", "respiracion", "retirada_gradual", "transicion"],
  G: ["movimiento_corporal", "propiocepcion", "ritmo", "vago", "respiracion", "audio_historia_corta", "transicion"],
  H: ["propiocepcion", "ritmo", "vago_suave", "respiracion", "transicion"],
};

const dropdownOptions = {
  A: {
    movimiento_descarga: ["animal_walks", "wall_push_fast", "fast_crawling", "marching_strong", "wheelbarrow"],
    propiocepcion: ["deep_pressure_squeeze", "joint_compressions", "wall_pushups", "bear_hug", "hand_press"],
    vestibular_lento: ["rocking", "slow_sway", "quadruped_rocking", "cat_cow_slow", "taquito_roll"],
    vago: ["humming", "gargling", "closed_mouth_humming", "eye_movement_vagal_sequence", "blow_imaginary_candles"],
    respiracion: ["bunny_breaths", "belly_breathing", "smell_flower_blow_candle", "exhale_longer_than_inhale", "four_six_breathing"],
    transicion: ["ritual_phrase", "lights_low_silence", "soft_music", "final_breath", "short_story"],
  },
  B: {
    activacion_ligera: ["gateo_lento", "wall_push_soft", "light_marching", "gentle_stretching", "slow_walking"],
    propiocepcion: ["deep_pressure_squeeze", "joint_compressions", "hand_press", "wall_pushups", "bear_hug"],
    ritmo: ["rocking", "slow_clapping", "repetitive_song", "humming_rhythm", "steady_sway"],
    vago: ["humming", "closed_mouth_humming", "eye_movement_vagal_sequence", "follow_toy_with_eyes", "blow_imaginary_candles"],
    respiracion: ["belly_breathing", "smell_flower_blow_candle", "bunny_breaths", "guided_short_breathing", "exhale_longer_than_inhale"],
    transicion: ["short_story", "soft_music", "ritual_phrase", "lights_low_silence", "short_audio"],
    audio_historia_corta: ["repetitive_short_story", "descriptive_story", "calm_audio", "soft_music", "simple_guided_imagery"],
  },
  C: {
    conexion: ["reading_together", "long_hug", "sing_together_soft", "breathe_together", "bedtime_ritual_phrase"],
    propiocepcion: ["deep_pressure_squeeze", "joint_compressions", "bear_hug", "hand_press", "pancake"],
    ritmo: ["repetitive_song", "rocking", "humming_rhythm", "slow_clapping", "count_and_sway"],
    vago: ["humming", "closed_mouth_humming", "eye_movement_vagal_sequence", "gargling", "blow_imaginary_candles"],
    respiracion: ["belly_breathing", "smell_flower_blow_candle", "bunny_breaths", "guided_short_breathing", "exhale_longer_than_inhale"],
    transicion: ["ritual_phrase", "lights_low_silence", "short_story", "soft_music", "final_breath"],
  },
  D: {
    propiocepcion_profunda: ["deep_pressure_squeeze", "joint_compressions", "bear_hug", "pancake", "burrito"],
    contacto_ritmo: ["rocking_hug", "humming_together", "breathe_together_rhythm", "sway_with_contact", "hold_and_sway"],
    vago_suave: ["closed_mouth_humming", "humming", "long_exhale_sound", "soft_singing", "eye_movement_vagal_sequence"],
    respiracion: ["belly_breathing", "guided_short_breathing", "hand_on_belly_breath", "exhale_longer_than_inhale", "silent_slow_breathing"],
    transicion: ["lights_low_silence", "final_snuggle_then_bed", "short_story", "soft_music", "final_breath"],
  },
  E: {
    trabajo_pesado_movimiento: ["wall_pushups", "carry_objects", "push_chair", "army_crawl", "animal_walks_heavy"],
    propiocepcion_fuerte: ["deep_pressure_squeeze", "joint_compressions", "wall_sit", "wall_pushups", "carry_objects"],
    vestibular_lento: ["rocking", "slow_sway", "quadruped_rocking", "cat_cow_slow", "taquito_roll"],
    vago: ["humming", "gargling", "eye_movement_vagal_sequence", "closed_mouth_humming", "blow_imaginary_candles"],
    respiracion: ["bunny_breaths", "belly_breathing", "smell_flower_blow_candle", "exhale_longer_than_inhale", "four_six_breathing"],
    transicion: ["ritual_phrase", "lights_low_silence", "soft_music", "short_story", "final_breath"],
  },
  F: {
    conexion: ["long_hug", "reading_together", "breathe_together", "quiet_snuggle", "lie_together_briefly"],
    propiocepcion_profunda: ["deep_pressure_squeeze", "joint_compressions", "bear_hug", "pancake", "burrito"],
    contacto_ritmo: ["rocking_hug", "humming_together", "sway_with_contact", "song_with_hug", "hold_and_sway"],
    vago_suave: ["closed_mouth_humming", "humming", "soft_singing", "long_exhale_sound", "eye_movement_vagal_sequence"],
    respiracion: ["belly_breathing", "breathe_together_rhythm", "hand_on_belly_breath", "exhale_longer_than_inhale", "guided_short_breathing"],
    transicion: ["ritual_phrase", "lights_low_silence", "short_story", "soft_music", "final_breath"],
  },
  G: {
    movimiento_corporal: ["gateo", "cross_body_taps", "gentle_yoga_flow", "stretching_sequence", "slow_marching"],
    propiocepcion: ["deep_pressure_squeeze", "joint_compressions", "hand_press", "wall_pushups", "carry_objects"],
    ritmo: ["humming_rhythm", "rocking", "repetitive_song", "slow_clapping", "count_and_sway"],
    vago: ["closed_mouth_humming", "humming", "eye_movement_vagal_sequence", "blow_imaginary_candles", "gargling"],
    respiracion: ["belly_breathing", "four_six_breathing", "exhale_longer_than_inhale", "guided_short_breathing", "smell_flower_blow_candle"],
    audio_historia_corta: ["repetitive_short_story", "descriptive_story", "calm_audio", "soft_music", "simple_guided_imagery"],
    transicion: ["ritual_phrase", "lights_low_silence", "soft_music", "short_story", "final_breath"],
  },
  H: {
    propiocepcion: ["deep_pressure_squeeze", "joint_compressions", "bear_hug", "hand_press", "wall_pushups"],
    ritmo: ["rocking", "humming_rhythm", "repetitive_song", "steady_sway", "count_and_sway"],
    vago_suave: ["closed_mouth_humming", "humming", "long_exhale_sound", "eye_movement_vagal_sequence", "soft_singing"],
    respiracion: ["belly_breathing", "exhale_longer_than_inhale", "guided_short_breathing", "hand_on_belly_breath", "silent_slow_breathing"],
    transicion: ["ritual_phrase", "lights_low_silence", "soft_music", "short_story", "final_breath"],
  },
};

const specialGuidance = {
  limite_claro: {
    title: "Limite claro",
    guidance:
      "Despues de esta rutina ya no seguimos agregando mas pasos. Habla poco, con voz calmada, y transmite seguridad.",
    examples: ["Ya es hora de dormir. Te quiero mucho.", "Tu cuerpo ya puede descansar.", "Ya terminamos por hoy."],
  },
  retirada_gradual: {
    title: "Retirada gradual",
    guidance: "Empieza con mucha cercania y reducela poco a poco, sin desaparecer de golpe.",
    examples: ["Al lado de la cama", "Un poco mas lejos", "Cerca de la puerta", "Desde la puerta", "Fuera del cuarto"],
  },
};

export function buildPlan({ profile, birthday, wakeTime, napTaken, napWakeTime, selectedActivities = {}, dislikedCounts = {} }) {
  const ageYears = calculateAgeFromBirthday(birthday);
  const bedtime = calculateBedtime({ ageYears, wakeTime, napTaken, napWakeTime });
  const routineStart = addMinutes(bedtime, -25);
  const dinnerTime = addMinutes(bedtime, -110);
  const order = profileOrders[profile] || [];
  let cursor = toMinutes(routineStart);
  const bedtimeMinutes = toMinutes(bedtime);

  const steps = order.map((phaseKey, index) => {
    const stepId = `${phaseKey}-${index + 1}`;
    const duration = phaseDurations[phaseKey] || 3;
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

    const validOptions = getValidOptions(profile, phaseKey, dislikedCounts);
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
    profile,
    ageYears,
    wakeTime,
    bedtime,
    dinnerTime,
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
  return years === 1 ? "1 ano" : `${years} anos`;
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
      label: "Tu ambiente esta ayudando al sueno",
    };
  }

  if (checkedCount >= 3) {
    return {
      tone: "ok",
      label: "Estas cerca. Pequenos ajustes pueden mejorar mucho",
    };
  }

  return {
    tone: "alert",
    label: "El ambiente podria estar dificultando el sueno",
  };
}

export function getChildSlots(premiumAccess) {
  const purchases = premiumAccess?.purchases || [];
  const extraChildren = purchases.filter((purchase) =>
    String(purchase.product_id || "").toLowerCase().includes("nino adicional buenas noches")
  ).length;

  return {
    included: 1,
    extraChildren,
    total: 1 + extraChildren,
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
