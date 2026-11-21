export default function EtiquetaEstatus({ estatus }) {
  return <span className={`badge ${estatus}`}>{estatus}</span>
}