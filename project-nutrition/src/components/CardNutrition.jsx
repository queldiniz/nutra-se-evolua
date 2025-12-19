import ImageSkeleton from "./ImageSkeleton";
// Aqui os dados são recebidos via props
function CardNutrition({ titulo, imagem, recomendacao, fontes, citacao }) {
  return (
    <div className="card">
      <ImageSkeleton
        src={imagem}
        alt={titulo}
        className="card-img-wrapper" // Classe para controlar o tamanho
      />
      <div className="card-content">
        <h2>{titulo}</h2>
        <article>
          <h3>Recomendações OMS</h3>
          <p>
            <strong>Recomendação:</strong> {recomendacao}
          </p>
          <p>
            <strong>Fontes:</strong> {fontes}
          </p>
          <blockquote>{citacao}</blockquote>
        </article>
      </div>
    </div>
  );
}

export default CardNutrition;
