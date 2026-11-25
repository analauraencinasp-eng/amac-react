import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const vacio = {
  nombre: '', paterno: '', materno: '', edad: '',
  correo: '', telefono: '', colonia: '',
  experiencia: '', habilidades: '',
  contrasena: '', repite: '',
}

export default function RegistroCandidato() {
  const [datos, setDatos] = useState(vacio)
  const [terminos, setTerminos] = useState(false)
  const [privacidad, setPrivacidad] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [registrado, setRegistrado] = useState(false)

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

    const nombreCompleto = `${datos.nombre} ${datos.paterno} ${datos.materno}`
      .replace(/\s+/g, ' ')
      .trim()
    const experiencia = [
      datos.experiencia.trim(),
      datos.habilidades.trim() && `Habilidades: ${datos.habilidades.trim()}`,
    ].filter(Boolean).join('\n')

    const { error } = await supabase.auth.signUp({
      email: datos.correo.trim(),
      password: datos.contrasena,
      options: {
        data: {
          rol: 'candidato',
          nombre: nombreCompleto,
          telefono: datos.telefono.trim(),
          edad: datos.edad,
          colonia: datos.colonia.trim(),
          experiencia,
        },
      },
    })

    setEnviando(false)
    if (error) {
      setMensaje(
        error.code === 'user_already_exists'
          ? 'Ya hay una cuenta con este correo.'
          : 'No se pudo crear la cuenta. Intenta de nuevo.'
      )
      return
    }
    setRegistrado(true)
  }

  if (registrado) {
    return (
      <section className="tarjeta">
        <h1>¡Registro enviado con éxito!</h1>
        <p>
          Tu cuenta está pendiente de verificación y aprobación por AMAC.
          Mientras tanto puedes explorar las vacantes.
        </p>
        <Link className="btn btn-coral" to="/">Ver vacantes</Link>
      </section>
    )
  }

  return (
    <>
      <div className="encabezado-centrado">
        <h1>¡Tu próxima oportunidad comienza aquí!</h1>
        <p>Regístrate para encontrar oportunidades laborales. Los campos con * son obligatorios.</p>
      </div>

      <form className="tarjeta formulario-largo" onSubmit={registrar}>
        <h2>Crear cuenta</h2>

        <h3>Datos personales</h3>
        <div className="campos-grid">
          <div className="campo">
            <label htmlFor="nombre">Nombre(s) *</label>
            <input id="nombre" name="nombre" value={datos.nombre} onChange={cambiar} required />
          </div>
          <div className="campo">
            <label htmlFor="paterno">Apellido paterno *</label>
            <input id="paterno" name="paterno" value={datos.paterno} onChange={cambiar} required />
          </div>
          <div className="campo">
            <label htmlFor="materno">Apellido materno</label>
            <input id="materno" name="materno" value={datos.materno} onChange={cambiar} />
          </div>
          <div className="campo">
            <label htmlFor="edad">Edad *</label>
            <input type="number" id="edad" name="edad" min="18" max="110"
              value={datos.edad} onChange={cambiar} required />
          </div>
        </div>

        <hr />
        <h3>Datos de contacto</h3>
        <div className="campos-grid">
          <div className="campo">
            <label htmlFor="correoCandidato">Correo electrónico *</label>
            <input type="email" id="correoCandidato" name="correo"
              value={datos.correo} onChange={cambiar} required />
          </div>
          <div className="campo">
            <label htmlFor="telCandidato">Teléfono celular</label>
            <input type="tel" id="telCandidato" name="telefono"
              value={datos.telefono} onChange={cambiar} />
          </div>
          <div className="campo">
            <label htmlFor="colonia">Colonia *</label>
            <input id="colonia" name="colonia" value={datos.colonia} onChange={cambiar} required />
          </div>
        </div>

        <hr />
        <h3>Experiencia y habilidades</h3>
        <div className="campo">
          <label htmlFor="experiencia">Experiencia laboral</label>
          <textarea id="experiencia" name="experiencia" rows="3"
            value={datos.experiencia} onChange={cambiar} />
        </div>
        <div className="campo">
          <label htmlFor="habilidades">Habilidades *</label>
          <textarea id="habilidades" name="habilidades" rows="3"
            value={datos.habilidades} onChange={cambiar} required />
        </div>

        <hr />
        <h3>Seguridad</h3>
        <div className="campos-grid">
          <div className="campo">
            <label htmlFor="passCandidato">Contraseña *</label>
            <input type="password" id="passCandidato" name="contrasena" minLength={6}
              value={datos.contrasena} onChange={cambiar} required />
          </div>
          <div className="campo">
            <label htmlFor="repiteCandidato">Confirmar contraseña *</label>
            <input type="password" id="repiteCandidato" name="repite" minLength={6}
              value={datos.repite} onChange={cambiar} required />
          </div>
        </div>

        <label className="check">
          <input type="checkbox" checked={terminos}
            onChange={(e) => setTerminos(e.target.checked)} required />{' '}
          He leído y acepto los términos y condiciones.
        </label>
        <label className="check">
          <input type="checkbox" checked={privacidad}
            onChange={(e) => setPrivacidad(e.target.checked)} required />{' '}
          He leído y acepto la política de privacidad.
        </label>

        <p className="mensaje" role="status">{mensaje}</p>
        <button className="btn btn-coral btn-ancho" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
        <p className="texto-centro">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </form>
    </>
  )
}
