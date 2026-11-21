import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function iniciarSesion(e) {
    e.preventDefault()
    if (!correo.trim() || !contrasena.trim()) {
      setMensaje('Llena todos los campos vacíos')
      return
    }
    setEnviando(true)
    setMensaje('')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo.trim(),
      password: contrasena,
    })
    if (error) {
      setEnviando(false)
      setMensaje('Correo o contraseña incorrectos.') // no decir cuál falló
      return
    }
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', data.user.id)
      .single()
    setEnviando(false)
    navigate(perfil?.rol === 'empresa' ? '/empresa/vacantes' : '/')
  }

  return (
    <>
      <header className="login-movil">
        <Link to="/"><img src="/assets/logo-referencia.png" alt="AMAC" /></Link>
        <Link to="/" aria-label="Volver a vacantes">☰</Link>
      </header>

      <main className="login-pagina">
        <aside className="login-marca">
          <Link to="/"><img className="logo-login" src="/assets/logo-referencia.png" alt="AMAC" /></Link>
          <h1>Envejecer es <span>vivir.</span></h1>
          <p>Trabajamos para impulsar un cambio cultural y promover el buen envejecimiento.</p>
          <div className="valor"><img src="/assets/corazon.png" alt="" />Vejez saludable</div>
          <div className="valor"><img src="/assets/caminar.png" alt="" />Vejez activa</div>
          <div className="valor"><img src="/assets/grupo.png" alt="" />Empoderamiento</div>
          <div className="rayita"></div>
          <p className="marca-frase">Acompañamos nuevas etapas de vida.</p>
        </aside>

        <section className="login-derecha">
          <div className="login-centro">
            <h2>Inicio de sesión</h2>
            <p>Entra a tu cuenta para postularte a vacantes.</p>

            <form className="tarjeta form-login" onSubmit={iniciarSesion} noValidate>
              <div className="campo">
                <label htmlFor="loginCorreo">Correo electrónico</label>
                <input
                  id="loginCorreo"
                  type="email"
                  placeholder="Escribe tu correo"
                  autoComplete="username"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className="campo">
                <label htmlFor="loginPass">Contraseña</label>
                <input
                  id="loginPass"
                  type="password"
                  placeholder="Escribe tu contraseña"
                  autoComplete="current-password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
              </div>
              <button className="btn btn-coral btn-ancho" disabled={enviando}>
                {enviando ? 'Entrando…' : 'Iniciar sesión'}
              </button>
              {mensaje && <p className="mensaje" role="alert">{mensaje}</p>}
            </form>

            <hr />
            <h3>¿No tienes cuenta?</h3>
            <div className="redes">
              <Link className="btn btn-contorno" to="/registro">Soy candidato</Link>
              <Link className="btn btn-contorno" to="/registro-empresa">Soy empresa</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}