import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [menuAtivo, setMenuAtivo] = useState(false);

  const toggleMenu = () => {
    setMenuAtivo(!menuAtivo);
  };

  const fecharMenu = () => {
    setMenuAtivo(false);
  };

  return (
    <header className="cabecalho">
      <div className="container-nav">
        <Link to="/" className="logo-link" onClick={fecharMenu}>
          <img
            src="/img/nutrition-icon.jpg"
            style={{ height: "45px", width: "auto", display: "block" }}
          />
        </Link>

        {/* Botão Hambúrguer */}
        <div
          className={`hamburger ${menuAtivo ? "ativo" : ""}`}
          onClick={toggleMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Menu de Navegação */}
        <nav className={`nav-menu ${menuAtivo ? "ativo" : ""}`}>
          <ul>
            <li>
              <Link to="/" onClick={fecharMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/alimentos" onClick={fecharMenu}>
                Alimentos
              </Link>
            </li>
            <li>
              <Link to="/gestao" onClick={fecharMenu}>
                Pacientes
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
