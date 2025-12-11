import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="cabecalho">
      <div className="container-nav">
        <nav className="nav-menu">
          <Link to="/" className="logo-link">
            <img
              src="/img/nutrition-icon.jpg"
              alt="Logo Nutra-se"
              className="logo-header"
            />
          </Link>

          <ul className="lista-nao-ordenada">
            <li className="item-lista-cabecalho">
              <Link to="/">Home</Link>
            </li>
            <li className="item-lista-cabecalho">
              <Link to="/alimentos">Alimentos</Link>
            </li>
            <li className="item-lista-cabecalho">
              <Link to="/gestao">Pacientes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
