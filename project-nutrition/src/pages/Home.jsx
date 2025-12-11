import ImageSkeleton from "../components/ImageSkeleton";

function Home() {
  return (
    <section className="hero-slider">
      <div className="slider-wrapper">
        <div className="slide">
          <div className="slide-content">
            <div className="slide-text">
              <h1>
                Seja sua <br /> Melhor versão
              </h1>
              <h2>Comece</h2>
              <h3>
                <i>Cuidar do corpo é também cuidar da mente</i>
              </h3>
            </div>
            <div className="slide-image">
              <ImageSkeleton
                src="/img/vista-superior-de-uma-variedade-de-vegetais-em-um-saco-de-papel.jpg"
                alt="Vegetais saudáveis"
                className="img-home-custom"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
