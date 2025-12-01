import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="cabecalho">
      <div className="container-nav">
        <nav className="nav-menu">
          {/* Logo ou Título */}
          <div
            style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#4c546c" }}
          >
            Nutra-se
          </div>

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
