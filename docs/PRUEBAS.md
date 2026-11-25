
# Pruebas funcionales - AMAC

## Objetivo

Comprobar que los flujos principales de la plataforma
AMAC funcionan correctamente con Supabase y Vercel.

## Casos de prueba

| Prueba | Resultado |
|---|---|
| Buscar vacantes por título | Aprobada |
| Filtrar vacantes por horario | Aprobada |
| Bloquear candidato no aprobado | Aprobada |
| Permitir postulación de candidato aprobado | Aprobada |
| Evitar postulaciones duplicadas | Aprobada |
| Publicar una vacante como empresa | Aprobada |
| Rechazar campos con solo espacios | Aprobada |
| Cambiar el estado de una solicitud | Aprobada |
| Pausar una vacante | Aprobada |
| Redirigir a login al abrir una ruta protegida | Aprobada |

- Todas mostradas en el video

## Cuentas de prueba

- Regina: candidata aprobada.
- Mario: candidato no aprobado.
- Empresas: cuentas de demostración registradas en el README.

## Evidencias

- Diagrama: docs/schema-visualizer.png
- Lighthouse: docs/lighthouse-react.png
- Aplicación: https://amac-react-one.vercel.app/

