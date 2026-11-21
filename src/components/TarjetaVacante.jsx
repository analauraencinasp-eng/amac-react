import { Link } from 'react-router-dom'
import DatosVacante from './DatosVacante'

export default function TarjetaVacante({ vacante }) {
  return (
    <article className="tarjeta vacante-card">
      <h3>{vacante.titulo}</h3>
      <p className="muted">Empresa: {vacante.empresa?.nombre}</p>
      <hr style={{ width: '100%', border: 0, borderTop: '1px solid var(--borde)' }} />
      <DatosVacante vacante={vacante} />
      <small>Publicado recientemente</small>
      <Link className="btn btn-azul" to={`/vacantes/${vacante.id}`}>Ver vacante</Link>
    </article>
  )
}