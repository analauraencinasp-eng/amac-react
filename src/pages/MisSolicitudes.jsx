import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import EtiquetaEstatus from '../components/EtiquetaEstatus'

export default function MisSolicitudes() {
  const { sesion } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [filtro, setFiltro] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    const { data, error } = await supabase
      .from('solicitudes')
      .select('id, estatus, creada_en, vacante:vacantes(titulo, empresa:perfiles(nombre))')
      .eq('candidato_id', sesion.user.id)
      .order('creada_en', { ascending: false })

    if (error) setError('No se pudieron cargar tus solicitudes.')
    else setSolicitudes(data)
    setCargando(false)
  }, [sesion.user.id])

  useEffect(() => {
    cargar()
  }, [cargar])

  async function cancelar(solicitud) {
    if (!window.confirm('¿Seguro que quieres cancelar esta solicitud?')) return

    const { data, error } = await supabase
      .from('solicitudes')
      .update({ estatus: 'Cancelada' })
      .eq('id', solicitud.id)
      .select()

    if (error || data.length === 0) {
      setError('No se pudo cancelar la solicitud.')
      return
    }
    setError('')
    cargar()
  }

  const lista = solicitudes.filter((s) => !filtro || s.estatus === filtro)

  return (
    <>
      <Link className="volver" to="/">← Inicio</Link>

      <section className="hero">
        <h1>¡Sigue de cerca tus oportunidades!</h1>
        <p>Consulta el estado de los empleos a los que te postulaste.</p>
      </section>

      <section className="seccion">
        <div className="fila-entre">
          <h2>Mis solicitudes <span>({lista.length})</span></h2>
          <div className="campo pequeno">
            <label htmlFor="estadoSolicitud">Mostrar</label>
            <select
              id="estadoSolicitud"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="">Todas las solicitudes</option>
              <option>Enviada</option>
              <option>En revisión</option>
              <option>Aceptada</option>
              <option>Rechazada</option>
              <option>Cancelada</option>
            </select>
          </div>
        </div>

        {cargando && <p role="status">Cargando solicitudes…</p>}
        {error && <p className="mensaje" role="alert">{error}</p>}

        <div className="lista-aplicaciones">
          {!cargando && lista.length === 0 && (
            <div className="tarjeta">
              <h2>Todavía no tienes solicitudes</h2>
              <p>Explora las vacantes disponibles y encuentra tu próximo empleo.</p>
              <Link className="btn btn-coral" to="/">Ver vacantes</Link>
            </div>
          )}

          {lista.map((s) => (
            <article key={s.id} className="tarjeta aplicacion">
              <div>
                <h3>{s.vacante?.titulo}</h3>
                <p>Empresa: {s.vacante?.empresa?.nombre}</p>
                <p>▦ Postulado el {new Date(s.creada_en).toLocaleDateString('es-MX')}</p>
              </div>
              <div className="aplicacion-acciones">
                <EtiquetaEstatus estatus={s.estatus} />
                {(s.estatus === 'Enviada' || s.estatus === 'En revisión') && (
                  <button className="btn btn-contorno" onClick={() => cancelar(s)}>
                    Cancelar solicitud
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}