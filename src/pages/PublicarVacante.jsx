import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const vacio = {
  titulo: '', categoria: '', sueldo: '', ubicacion: '', horario: '',
  telefono: '', descripcion: '', requisitos: '', prestaciones: '',
}

export default function PublicarVacante() {
  const { sesion } = useAuth()
  const navigate = useNavigate()
  const [datos, setDatos] = useState(vacio)
  const [porTelefono, setPorTelefono] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }


async function guardar(e) {
  e.preventDefault()

  const campos = [
    datos.titulo,
    datos.ubicacion,
    datos.descripcion,
    datos.requisitos,
    datos.prestaciones,
  ]

  if (campos.some(campo => !campo.trim()) ||
      (porTelefono && !datos.telefono.trim())) {
    setMensaje('Completa los campos obligatorios con información válida.')
    return
  }

  const sueldo = Number(datos.sueldo)

    if (!(sueldo > 0)) {
      setMensaje('El sueldo debe ser mayor a cero.')
      return
    }
    setEnviando(true)
    setMensaje('')

    const { error } = await supabase.from('vacantes').insert({
      empresa_id: sesion.user.id,
      titulo: datos.titulo.trim(),
      categoria: datos.categoria,
      sueldo,
      ubicacion: datos.ubicacion.trim(),
      horario: datos.horario,
      descripcion: datos.descripcion.trim(),
      requisitos: datos.requisitos.trim(),
      prestaciones: datos.prestaciones.trim(),
      telefono_contacto: porTelefono ? datos.telefono.trim() : null,
    })

    setEnviando(false)
    if (error) {
      setMensaje('No se pudo guardar la vacante. Revisa los datos e intenta de nuevo.')
      return
    }
    navigate('/empresa/vacantes')
  }

  return (
    <>
      <Link className="volver" to="/empresa/vacantes">← Mis vacantes</Link>

      <div className="encabezado-centrado">
        <h1>Publicar nueva vacante</h1>
        <p>Completa los campos marcados con *. El teléfono solo es obligatorio si eliges recibir postulaciones por teléfono.</p>
      </div>

      <form className="tarjeta formulario-largo" onSubmit={guardar}>
        <div className="campos-grid">
          <div className="campo">
            <label htmlFor="vacPuesto">Nombre del puesto *</label>
            <input id="vacPuesto" name="titulo" value={datos.titulo} onChange={cambiar} required />
          </div>
          <div className="campo">
            <label htmlFor="vacCategoria">Categoría *</label>
            <select id="vacCategoria" name="categoria" value={datos.categoria} onChange={cambiar} required>
              <option value="">Selecciona una opción</option>
              <option>Administración</option>
              <option>Ventas</option>
              <option>Atención al cliente</option>
            </select>
          </div>
          <div className="campo">
            <label htmlFor="vacSueldo">Sueldo mensual (MXN) *</label>
            <input id="vacSueldo" name="sueldo" type="number" min="1" step="any"
              placeholder="10000" value={datos.sueldo} onChange={cambiar} required />
          </div>
          <div className="campo">
            <label htmlFor="vacUbicacion">Ubicación *</label>
            <input id="vacUbicacion" name="ubicacion" placeholder="Monterrey, Nuevo León"
              value={datos.ubicacion} onChange={cambiar} required />
          </div>
          <div className="campo">
            <label htmlFor="vacHorario">Horario *</label>
            <select id="vacHorario" name="horario" value={datos.horario} onChange={cambiar} required>
              <option value="">Selecciona una opción</option>
              <option>Tiempo completo</option>
              <option>Medio tiempo</option>
              <option>Matutino</option>
              <option>Vespertino</option>
              <option>Fines de semana</option>
            </select>
          </div>
        </div>

        <label className="check">
          <input type="checkbox" checked={porTelefono}
            onChange={(e) => setPorTelefono(e.target.checked)} />{' '}
          Recibir también postulaciones por teléfono
        </label>
        {porTelefono && (
          <div className="campo">
            <label htmlFor="vacTelefono">Teléfono de contacto *</label>
            <input id="vacTelefono" name="telefono" type="tel"
              value={datos.telefono} onChange={cambiar} required />
          </div>
        )}

        <div className="campo">
          <label htmlFor="vacDescripcion">Descripción del puesto *</label>
          <textarea id="vacDescripcion" name="descripcion" rows="4"
            value={datos.descripcion} onChange={cambiar} required />
        </div>
        <div className="campo">
          <label htmlFor="vacRequisitos">Requisitos (uno por línea) *</label>
          <textarea id="vacRequisitos" name="requisitos" rows="4"
            value={datos.requisitos} onChange={cambiar} required />
        </div>
        <div className="campo">
          <label htmlFor="vacPrestaciones">Prestaciones (una por línea) *</label>
          <textarea id="vacPrestaciones" name="prestaciones" rows="4"
            value={datos.prestaciones} onChange={cambiar} required />
        </div>

        <p className="mensaje" role="status">{mensaje}</p>
        <button className="btn btn-coral btn-ancho" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Guardar vacante'}
        </button>
      </form>
    </>
  )
}
