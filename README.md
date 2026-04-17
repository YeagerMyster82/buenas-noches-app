# Buenas Noches Webapp

Base de producción para la app Buenas Noches usando `Next.js + Supabase + Vercel`.

## Qué ya está listo

- Experiencia principal en español, usando `tú`
- Quiz de 10 preguntas con scoring interno
- Lógica de perfiles primario/secundario
- Rutina adaptiva basada en edad, despertar y siesta
- Regla central: conservar la función regulatoria al reemplazar actividades
- Registro nocturno con:
  - hora en cama
  - hora en que se durmió
  - tiempo para dormir
  - calificación por actividad
  - notas
- Esqueleto del webhook para Captivation Hub
- Esquema SQL base para Supabase

## Carpetas clave

- [app](/Users/jolineyeager/Documents/Codex/2026-04-16-what-is-codex-good-for/webapp/app)
- [components](/Users/jolineyeager/Documents/Codex/2026-04-16-what-is-codex-good-for/webapp/components)
- [lib](/Users/jolineyeager/Documents/Codex/2026-04-16-what-is-codex-good-for/webapp/lib)
- [supabase/schema.sql](/Users/jolineyeager/Documents/Codex/2026-04-16-what-is-codex-good-for/webapp/supabase/schema.sql)

## Lo siguiente que toca

1. Instalar dependencias y levantar el proyecto localmente.
2. Crear el proyecto en Supabase y correr `schema.sql`.
3. Añadir las variables de entorno en `.env.local` y luego en Vercel.
4. Configurar el webhook de Captivation Hub para apuntar a `/api/captivationhub`.
5. Reemplazar el desbloqueo local por verificación real de compra y auth.

## Variables de entorno

Empieza copiando `.env.example` a `.env.local`.
