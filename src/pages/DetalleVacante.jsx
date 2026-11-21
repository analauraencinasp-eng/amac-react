import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import DatosVacante from '../components/DatosVacante'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const aLista = (texto) => texto.split('\n').filter(Boolean)

export default function DetalleVacante() {
  const { id } = useParams()
  const [vacante, setVacante] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const navigate = useNavigate()
  const { sesion, perfil } = useAuth()

  async function postularme() {
    if (!sesion) {
      navigate('/login')
      return
    }
    if (perfil?.rol !== 'candidato') {
      setMensaje('Necesitas una cuenta de candidato para postularte.')
      return
    }
    const { error } = await supabase
      .from('solicitudes')
      .insert({ vacante_id: vacante.id, candidato_id: sesion.user.id })

    if (error?.code === '23505') setMensaje('Ya te postulaste a esta vacante.') // unique
    else if (error) setMensaje('Tu registro aún no ha sido aprobado por AMAC. Por favor espera.')
    else setMensaje('¡Listo! Tu solicitud fue enviada.')
  }

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      const { data } = await supabase
        .from('vacantes')
        .select('*, empresa:perfiles(nombre)')
        .eq('id', id)
        .maybeSingle()
      setVacante(data)
      setCargando(false)
    }
    cargar()
  }, [id])

  if (cargando) return <p role="status">Cargando vacante…</p>

  if (!vacante) {
    return (
      <section className="tarjeta">
        <h1>Vacante no encontrada</h1>
        <p>Es posible que ya no esté disponible.</p>
        <Link className="btn btn-coral" to="/">Ver vacantes</Link>
      </section>
    )
  }

  return (
    <>
      <Link className="volver" to="/">← Volver a vacantes</Link>

      <div className="detalle-grid">
        <div>
          <section className="tarjeta detalle-principal">
            <div className="fila-entre">
              <span className="sobretitulo">VACANTE</span>
            </div>
            <h1>{vacante.titulo}</h1>
            <p className="muted">{vacante.empresa?.nombre}</p>
            <hr />
            <h2>Información del empleo</h2>
            <div className="detalle-lista">
              <DatosVacante vacante={vacante} />
              <div className="vacante-dato"><span>▤</span><span>{vacante.categoria}</span></div>
            </div>

            {/* Provisional: más adelante aquí va el insert en Supabase */}
            <button
            className="btn btn-coral btn-ancho" onClick={postularme}>
              Postularme
            </button>
            {mensaje && <p className="mensaje" role="status">{mensaje}</p>}

            {vacante.telefono_contacto && (
              <div className="telefono-empresa">
                <h3>Postulación por teléfono</h3>
                <p>
                  Esta empresa también recibe postulaciones por teléfono:{' '}
                  <strong>{vacante.telefono_contacto}</strong>
                </p>
                <a
                  className="btn btn-contorno"
                  href={`tel:${vacante.telefono_contacto.replace(/\D/g, '')}`}
                >
                  ☎ Llamar a la empresa
                </a>
              </div>
            )}
          </section>

          <section className="tarjeta seccion">
            <h2>Descripción del puesto</h2>
            <p>{vacante.descripcion}</p>
            <hr />
            <h2>Requisitos</h2>
            <ul>{aLista(vacante.requisitos).map((r, i) => <li key={i}>{r}</li>)}</ul>
            <hr />
            <h2>Prestaciones</h2>
            <ul>{aLista(vacante.prestaciones).map((p, i) => <li key={i}>{p}</li>)}</ul>
          </section>
        </div>

        <aside className="tarjeta tarjeta-azul">
          <h2>Sobre la empresa</h2>
          <h3>{vacante.empresa?.nombre}</h3>
          <p>Empresa comprometida con la inclusión laboral y el talento de las personas adultas mayores.</p>
          <h3>Proceso de selección</h3>
          <ol>
            <li>Enviar solicitud</li>
            <li>Revisión del perfil</li>
            <li>Entrevista</li>
            <li>Selección del candidato</li>
          </ol>
          <Link to="/" className="btn btn-contorno">Ver más vacantes</Link>
        </aside>
      </div>
    </>
  )
}