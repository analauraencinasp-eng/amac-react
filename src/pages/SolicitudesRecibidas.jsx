import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import EtiquetaEstatus from '../components/EtiquetaEstatus'

export default function SolicitudesRecibidas() {
  const { sesion } = useAuth()
  const [params, setParams] = useSearchParams()
  const [vacantes, setVacantes] = useState([])
  const [solicitudes, setSolicitudes] = useState([])
  const [estatus, setEstatus] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const vacanteId = params.get('id') || ''

  const cargar = useCallback(async () => {
    const [resVacantes, resSolicitudes] = await Promise.all([
      supabase.from('vacantes').select('id, titulo').eq('empresa_id', sesion.user.id),
      supabase
        .from('solicitudes')
        .select('id, estatus, creada_en, vacante_id, vacante:vacantes(titulo), candidato:perfiles(nombre, edad, colonia, experiencia)')
        .neq('estatus', 'Cancelada')
        .order('creada_en', { ascending: false }),
    ])

    if (resVacantes.error || resSolicitudes.error) {
      setError('No se pudieron cargar las solicitudes.')
    } else {
      setVacantes(resVacantes.data)
      setSolicitudes(resSolicitudes.data)
    }
    setCargando(false)
  }, [sesion.user.id])

  useEffect(() => {
    cargar()
  }, [cargar])

  async function cambiarEstatus(solicitud, nuevo) {
    const { data, error } = await supabase
      .from('solicitudes')
      .update({ estatus: nuevo })
      .eq('id', solicitud.id)
      .select()

    if (error || data.length === 0) {
      setError('No se pudo cambiar el estatus.')
      return
    }
    setError('')
    setSolicitudes((previas) =>
      previas.map((s) => (s.id === solicitud.id ? { ...s, estatus: nuevo } : s))
    )
  }

  function elegirVacante(valor) {
    setParams(valor ? { id: valor } : {})
  }

  const lista = solicitudes.filter(
    (s) =>
      (!vacanteId || String(s.vacante_id) === vacanteId) &&
      (!estatus || s.estatus === estatus)
  )

  return (
    <>
      <Link className="volver" to="/empresa/vacantes">← Mis vacantes</Link>

      <section className="hero">
        <h1>Solicitudes recibidas</h1>
        <p>Conoce a las personas interesadas en tus vacantes.</p>
      </section>

      <div className="tarjeta filtros-empresa">
        <div className="campo">
          <label htmlFor="filtrarVacante">Vacante</label>
          <select id="filtrarVacante" value={vacanteId} onChange={(e) => elegirVacante(e.target.value)}>
            <option value="">Todas las vacantes</option>
            {vacantes.map((v) => (
              <option key={v.id} value={v.id}>{v.titulo}</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="filtrarEstado">Filtrar por estado</label>
          <select id="filtrarEstado" value={estatus} onChange={(e) => setEstatus(e.target.value)}>
            <option value="">Todos los estados</option>
            <option>Enviada</option>
            <option>En revisión</option>
            <option>Aceptada</option>
            <option>Rechazada</option>
          </select>
        </div>
      </div>

      <section className="seccion">
        <h2>Candidatos <span>({lista.length})</span></h2>

        {cargando && <p role="status">Cargando solicitudes…</p>}
        {error && <p className="mensaje" role="alert">{error}</p>}

        <div className="lista-aplicaciones">
          {!cargando && lista.length === 0 && (
            <div className="tarjeta">
              <h2>Sin solicitudes recibidas</h2>
              <p>Las postulaciones aparecerán aquí cuando los candidatos se registren en las vacantes.</p>
            </div>
          )}

          {lista.map((s) => (
            <article key={s.id} className="tarjeta aplicacion">
              <div>
                <h3>◉ {s.candidato?.nombre} <EtiquetaEstatus estatus={s.estatus} /></h3>
                <p>Vacante: {s.vacante?.titulo}</p>
                <p>Edad: {s.candidato?.edad} años · Colonia: {s.candidato?.colonia}</p>
                <p>Experiencia: {s.candidato?.experiencia || 'No indicada'}</p>
                <p>Postulado el {new Date(s.creada_en).toLocaleDateString('es-MX')}</p>
              </div>
              <div className="aplicacion-acciones">
                <label htmlFor={`estatus-${s.id}`}>Cambiar estatus</label>
                <select
                  id={`estatus-${s.id}`}
                  value={s.estatus}
                  onChange={(e) => cambiarEstatus(s, e.target.value)}
                >
                  {s.estatus === 'Enviada' && <option value="Enviada" disabled>Enviada</option>}
                  <option>En revisión</option>
                  <option>Aceptada</option>
                  <option>Rechazada</option>
                </select>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}