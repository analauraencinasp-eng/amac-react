import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const vacio = { nombre: '', giro: '', telefono: '', correo: '', contrasena: '', repite: '' }

export default function RegistroEmpresa() {
  const [datos, setDatos] = useState(vacio)
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [registrada, setRegistrada] = useState(false)

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  async function registrar(e) {
    e.preventDefault()
    if (datos.contrasena !== datos.repite) {
      setMensaje('Las contraseñas no coinciden.')
      return
    }
    setEnviando(true)
    setMensaje('')

    const { error } = await supabase.auth.signUp({
      email: datos.correo.trim(),
      password: datos.contrasena,
      options: {
        data: {
          rol: 'empresa',
          nombre: datos.nombre.trim(),
          giro: datos.giro,
          telefono: datos.telefono.trim(),
        },
      },
    })

    setEnviando(false)
    if (error) {
      setMensaje(
        error.code === 'user_already_exists'
          ? 'Ya hay una cuenta con este correo.'
          : 'No se pudo registrar la empresa. Intenta de nuevo.'
      )
      return
    }
    setRegistrada(true)
  }

  if (registrada) {
    return (
      <section className="tarjeta">
        <h1>¡Registro exitoso!</h1>
        <p>Tu empresa ya puede publicar vacantes.</p>
        <Link className="btn btn-coral" to="/empresa/vacantes">Ir a mis vacantes</Link>
      </section>
    )
  }

  return (
    <>
      <div className="encabezado-centrado">
        <h1>¡Conectemos talento con oportunidades!</h1>
        <p>Registra tu empresa para publicar vacantes y conocer nuevos candidatos.</p>
      </div>

      <form className="tarjeta formulario-largo" onSubmit={registrar}>
        <h2>Registro de empresa</h2>
        <p>Completa la información para crear la cuenta de tu empresa. Los campos con * son obligatorios.</p>

        <h3>Información de la empresa</h3>
        <div className="campos-grid">
          <div className="campo">
            <label htmlFor="nombreEmpresa">Nombre de la empresa *</label>
            <input id="nombreEmpresa" name="nombre" value={datos.nombre} onChange={cambiar} required />
          </div>
          <div className="campo">
            <label htmlFor="giro">Giro de la empresa *</label>
            <select id="giro" name="giro" value={datos.giro} onChange={cambiar} required>
              <option value="">Selecciona una opción</option>
              <option>Servicios</option>
              <option>Comercio</option>
              <option>Industria</option>
              <option>Otro</option>
            </select>
          </div>
          <div className="campo">
            <label htmlFor="telEmpresa">Teléfono de la empresa *</label>
            <input id="telEmpresa" name="telefono" type="tel"
              value={datos.telefono} onChange={cambiar} required />
          </div>
          <div className="campo">
            <label htmlFor="correoEmpresa">Correo electrónico *</label>
            <input id="correoEmpresa" name="correo" type="email"
              autoComplete="email"
              value={datos.correo} onChange={cambiar} required />
          </div>
        </div>

        <hr />
        <h3>Seguridad de la cuenta</h3>
        <div className="campos-grid">
          <div className="campo">
            <label htmlFor="passEmpresa">Contraseña *</label>
            <input id="passEmpresa" name="contrasena" type="password" minLength={6}
              value={datos.contrasena} onChange={cambiar} required />
          </div>
          <div className="campo">
            <label htmlFor="repiteEmpresa">Confirmar contraseña *</label>
            <input id="repiteEmpresa" name="repite" type="password" minLength={6}
              value={datos.repite} onChange={cambiar} required />
          </div>
        </div>

        <label className="check">
          <input type="checkbox" required /> Acepto términos y condiciones y política de privacidad.
        </label>

        <p className="mensaje" role="status">{mensaje}</p>
        <button className="btn btn-coral btn-ancho" disabled={enviando}>
          {enviando ? 'Registrando…' : 'Registrar empresa'}
        </button>
        <p className="texto-centro">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </form>
    </>
  )
}
