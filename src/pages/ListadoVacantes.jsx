import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import TarjetaVacante from '../components/TarjetaVacante'

export default function ListadoVacantes() {
  const [vacantes, setVacantes] = useState([])
  const [texto, setTexto] = useState('')
  const [categoria, setCategoria] = useState('')
  const [horario, setHorario] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      setError(false)

      let consulta = supabase
        .from('vacantes')
        .select('*, empresa:perfiles(nombre)')
        .eq('estado', 'activa')
        .order('creada_en', { ascending: false })

      const busqueda = texto.trim().replace(/[,()%]/g, '')
      if (busqueda) {
        consulta = consulta.or(`titulo.ilike.%${busqueda}%,ubicacion.ilike.%${busqueda}%`)
      }
      if (categoria) consulta = consulta.eq('categoria', categoria)
      if (horario) consulta = consulta.eq('horario', horario)

      const { data, error } = await consulta
      if (error) setError(true)
      else setVacantes(data)
      setCargando(false)
    }
    cargar()
  }, [texto, categoria, horario]) // se vuelve a consultar cuando cambian

  function limpiar() {
    setTexto('')
    setCategoria('')
    setHorario('')
  }

  return (
    <>
      <section className="hero">
        <h1>Encuentra tu próximo empleo</h1>
        <p>Descubre oportunidades laborales pensadas para ti.</p>
      </section>

      <section className="buscador tarjeta">
        <h2>¿Qué trabajo buscas?</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="campo">
            <label htmlFor="textoBuscar">Puesto o ubicación</label>
            <input
              id="textoBuscar"
              placeholder="Puesto o ubicación"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </div>

          <div className="fila">
            <div className="campo">
              <label htmlFor="categoria">Categoría</label>
              <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Todas</option>
                <option>Administración</option>
                <option>Ventas</option>
                <option>Atención al cliente</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="horario">Horario</label>
              <select id="horario" value={horario} onChange={(e) => setHorario(e.target.value)}>
                <option value="">Todos</option>
                <option>Tiempo completo</option>
                <option>Medio tiempo</option>
                <option>Matutino</option>
                <option>Vespertino</option>
                <option>Fines de semana</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-coral btn-ancho">⌕ Buscar vacantes</button>
          <button type="button" className="link-boton btn-ancho" onClick={limpiar}>
            Limpiar filtros
          </button>
        </form>
      </section>

      <section className="seccion">
        <div className="fila-entre">
          <h2>Vacantes disponibles</h2>
          {!cargando && !error && <span>{vacantes.length} resultados</span>}
        </div>

        {cargando && <p role="status">Cargando vacantes…</p>}
        {error && <p role="alert">No se pudieron cargar las vacantes. Intenta de nuevo.</p>}

        <div className="tarjetas-vacantes">
          {!cargando && !error && vacantes.length === 0 && (
            <div className="tarjeta">
              <h2>No hay vacantes para mostrar</h2>
              <p>Por el momento no encontramos vacantes con esos filtros.</p>
              <button className="btn btn-coral" onClick={limpiar}>Limpiar filtros</button>
            </div>
          )}
          {vacantes.map((v) => <TarjetaVacante key={v.id} vacante={v} />)}
        </div>
      </section>
    </>
  )
}