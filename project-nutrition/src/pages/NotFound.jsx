import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-container">
      {/* Imagem do Erro */}
      <img
        src="/img/404-error.png"
        alt="Página não encontrada"
        className="not-found-img"
      />

      {/* Textos */}
      <h1>Ops! Página não encontrada.</h1>
      <p>Parece que o que você procura não está em nosso site.</p>

      {/* Botão de Voltar */}
      <Link to="/" className="btn-voltar">
        Voltar para o Início
      </Link>
    </div>
  );
}

export default NotFound;
