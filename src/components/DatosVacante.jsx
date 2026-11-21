export default function DatosVacante({ vacante }) {
  return (
    <>
      <div className="vacante-dato"><span>⌖</span><span>{vacante.ubicacion}</span></div>
      <div className="vacante-dato"><span>▣</span><span>${Number(vacante.sueldo).toLocaleString('es-MX')} mensuales</span></div>
      <div className="vacante-dato"><span>◷</span><span>{vacante.horario}</span></div>
    </>
  )
}