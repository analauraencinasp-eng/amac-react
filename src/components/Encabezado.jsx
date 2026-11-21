import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Encabezado() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { sesion, perfil } = useAuth()
  const navigate = useNavigate()
  const esEmpresa = perfil?.rol === 'empresa'

  async function cerrarSesion() {
    await supabase.auth.signOut()
    setMenuAbierto(false)
    navigate('/')
  }

  return (
    <header className="cabecera">
      <Link className="logo-header" to="/">
        <img src="/assets/logo-referencia.png" alt="AMAC" />
      </Link>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuAbierto}
        aria-controls="navegacion"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        ☰ <span className="sr-only">Menú</span>
      </button>

      <nav
        id="navegacion"
        className={`navegacion ${menuAbierto ? 'abierto' : ''}`}
        aria-label="Navegación principal"
      >
        {esEmpresa ? (
          <>
            <Link to="/empresa/vacantes">Mis vacantes</Link>
            <Link to="/empresa/solicitudes">Solicitudes</Link>
          </>
        ) : (
          <>
            <Link to="/">Vacantes</Link>
            <a href="/#conocenos">Conócenos</a>
            <a href="/#donativos">Donativos</a>
            <Link to="/mis-solicitudes">Mis solicitudes</Link>
          </>
        )}

        <button className="nav-help" type="button">☎ Ayuda</button>

        {sesion ? (
          <button className="btn btn-contorno btn-nav" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        ) : (
          <Link className="btn btn-coral btn-nav" to="/login">Iniciar sesión</Link>
        )}
      </nav>
    </header>
  )
}