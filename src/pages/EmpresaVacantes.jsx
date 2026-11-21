import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import EtiquetaEstatus from '../components/EtiquetaEstatus'

const nombreEstado = { activa: 'Activa', pausada: 'Pausada', cerrada: 'Cerrada' }

export default function EmpresaVacantes() {
  const { sesion } = useAuth()
  const [vacantes, setVacantes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    const { data, error } = await supabase
      .from('vacantes')
      .select('*, solicitudes(count)') // número de solicitudes por vacante
      .eq('empresa_id', sesion.user.id)
      .order('creada_en', { ascending: false })

    if (error) setError('No se pudieron cargar tus vacantes.')
    else setVacantes(data)
    setCargando(false)
  }, [sesion.user.id])

  useEffect(() => {
    cargar()
  }, [cargar])

  async function cambiarEstado(vacante, nuevoEstado) {
    const { data, error } = await supabase
      .from('vacantes')
      .update({ estado: nuevoEstado })
      .eq('id', vacante.id)
      .select()

    if (error || data.length === 0) {
      setError('No se pudo actualizar la vacante.')
      return
    }
    setError('')
    cargar()
  }

  function cerrar(vacante) {
    if (window.confirm(`¿Cerrar la vacante "${vacante.titulo}"? Ya no se podrá reactivar.`)) {
      cambiarEstado(vacante, 'cerrada')
    }
  }

  const cuenta = (v) => v.solicitudes?.[0]?.count ?? 0
  const totalActivas = vacantes.filter((v) => v.estado === 'activa').length
  const totalCerradas = vacantes.filter((v) => v.estado === 'cerrada').length
  const totalRecibidas = vacantes.reduce((suma, v) => suma + cuenta(v), 0)

  return (
    <>
      <section className="hero">
        <div className="fila-entre alinear-inicio">
          <div>
            <h1>¡Crea oportunidades que transforman vidas!</h1>
            <p>Administra tus ofertas de empleo y revisa a los candidatos.</p>
          </div>
          <Link className="btn btn-coral" to="/empresa/publicar">＋ Publicar vacante</Link>
        </div>
      </section>

      <div className="estadisticas">
        <div className="tarjeta"><small>Vacantes activas</small><strong>{totalActivas}</strong></div>
        <div className="tarjeta"><small>Solicitudes recibidas</small><strong>{totalRecibidas}</strong></div>
        <div className="tarjeta"><small>Vacantes cerradas</small><strong>{totalCerradas}</strong></div>
      </div>

      <section className="seccion">
        <h2>Mis vacantes publicadas</h2>

        {cargando && <p role="status">Cargando vacantes…</p>}
        {error && <p className="mensaje" role="alert">{error}</p>}

        <div className="lista-aplicaciones">
          {!cargando && vacantes.length === 0 && (
            <div className="tarjeta">
              <h2>Todavía no has publicado vacantes</h2>
              <p>Publica tu primera vacante para recibir solicitudes.</p>
              <Link className="btn btn-coral" to="/empresa/publicar">Publicar vacante</Link>
            </div>
          )}

          {vacantes.map((v) => (
            <article key={v.id} className="tarjeta aplicacion">
              <div>
                <h3>{v.titulo} <EtiquetaEstatus estatus={nombreEstado[v.estado]} /></h3>
                <p>▦ Publicada el {new Date(v.creada_en).toLocaleDateString('es-MX')}</p>
                <p>{cuenta(v)} solicitudes recibidas</p>
              </div>
              <div className="aplicacion-acciones">
                <Link className="btn btn-azul" to={`/empresa/solicitudes?id=${v.id}`}>
                  Ver solicitudes
                </Link>
                {v.estado === 'activa' && (
                  <button className="btn btn-contorno" onClick={() => cambiarEstado(v, 'pausada')}>
                    Pausar
                  </button>
                )}
                {v.estado === 'pausada' && (
                  <button className="btn btn-contorno" onClick={() => cambiarEstado(v, 'activa')}>
                    Reactivar
                  </button>
                )}
                {v.estado !== 'cerrada' && (
                  <button className="btn btn-contorno" onClick={() => cerrar(v)}>Cerrar</button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}