import { useState, useEffect } from "react";
import ImageSkeleton from "../components/ImageSkeleton";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // dados dos slides
  const slides = [
    {
      id: 1,
      title: (
        <>
          Seja sua <br /> Melhor versão
        </>
      ),
      subtitle: "Comece",
      text: "Cuidar do corpo é também cuidar da mente",
      img: "/img/vista-superior-de-uma-variedade-de-vegetais-em-um-saco-de-papel.jpg",
      alt: "Vegetais saudáveis",
    },
    {
      id: 2,
      title: (
        <>
          Invista em <br /> você
        </>
      ),
      subtitle: "Nutra-se",
      text: "E Evolua",
      img: "img/almoco-saudavel-para-ir-embalado-na-lancheira.jpg",
      alt: "Lancheira com almoço saudável",
    },
  ];

  // Função para passar o slide (usada pelo timer automático)
  const proximoSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // --- ROTAÇÃO AUTOMÁTICA ---
  useEffect(() => {
    const interval = setInterval(proximoSlide, 5000); // Muda a cada 5 segundos
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div>
      {/* --- HERO SLIDER --- */}
      <section className="hero-slider" style={sliderStyles.section}>
        <div className="slider-wrapper" style={sliderStyles.wrapper}>
          <div
            className="slide fade-in"
            key={slides[currentSlide].id}
            style={sliderStyles.slide}
          >
            <div
              className="slide-content slider-content"
              style={sliderStyles.content}
            >
              {/* Texto */}
              <div className="slide-text" style={sliderStyles.textContent}>
                <h1 style={sliderStyles.h1}>{slides[currentSlide].title}</h1>
                <h2 style={sliderStyles.h2}>{slides[currentSlide].subtitle}</h2>
                <h3 style={sliderStyles.h3}>
                  <i>{slides[currentSlide].text}</i>
                </h3>
              </div>

              <div className="slide-image" style={sliderStyles.imageContent}>
                <ImageSkeleton
                  src={slides[currentSlide].img}
                  alt={slides[currentSlide].alt}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "550px",
                    objectFit: "cover",
                    borderRadius: "50px", // Arredondado conforme pedido
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                  className="img-home-custom"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Indicadores (Bolinhas) */}
        <div style={sliderStyles.dotsContainer}>
          {slides.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                ...sliderStyles.dot,
                backgroundColor: currentSlide === index ? "#717171" : "#bbb",
              }}
            ></span>
          ))}
        </div>
      </section>

      {/* --- SAÚDE MENTAL --- */}
      <section style={styles.mentalHealthSection}>
        <div style={styles.container}>
          <div
            style={{ width: "100%", marginBottom: "40px", textAlign: "left" }}
          >
            <div
              style={{
                width: "50px",
                height: "4px",
                backgroundColor: "#4c546c",
                marginBottom: "10px",
              }}
            ></div>
            <h2 style={styles.mainTitle} className="mobile-title">
              Como a Atividade Física impacta a Saúde Mental
            </h2>
          </div>

          <div style={styles.contentWrapper} className="mental-health-content">
            <div style={styles.leftColumn}>
              <p style={styles.paragraph} className="paragraph">
                A relação entre a atividade física e a saúde mental é um tópico
                fundamental nos dias de hoje. À medida que os transtornos
                mentais se tornam uma preocupação global, descobertas
                científicas destacam o papel do exercício no combate a essas
                condições.
              </p>
              <p style={styles.paragraph} className="paragraph">
                A prática regular libera <strong>endorfinas</strong>, que
                reduzem o estresse e melhoram a qualidade do sono e a
                autoestima.
              </p>
              <div style={styles.statsBox} className="statsBox">
                <h4 style={{ color: "#4c546c", margin: "0 0 10px 0" }}>
                  ⚠️ Dados da OMS
                </h4>
                <p style={{ fontSize: "0.9rem", color: "#555" }}>
                  Quase <strong>1 bilhão de pessoas</strong> vivem com
                  transtorno mental. No Brasil, cerca de 19 milhões sofrem com
                  ansiedade e depressão.
                </p>
              </div>
            </div>

            <div style={styles.rightColumn}>
              <div style={styles.cardContainer} className="cardContainer">
                <div style={styles.floatingIcon} className="floatingIcon">
                  🧠
                </div>
                <h3 style={styles.cardTitle} className="cardTitle">
                  Neurotransmissores e Prevenção
                </h3>
                <p style={styles.cardText} className="cardText">
                  Os exercícios regulares ajudam a controlar os níveis de{" "}
                  <strong>serotonina e noradrenalina</strong>,
                  neurotransmissores cruciais para o controle do humor e da
                  ansiedade.
                </p>
                <p style={styles.cardText} className="cardText">
                  Além disso, "mexer o corpo" diminui o risco de doenças
                  degenerativas como <strong>Alzheimer e Parkinson</strong>,
                  promovendo a resiliência emocional através de práticas como
                  Yoga e Meditação.
                </p>
                <p
                  style={{
                    ...styles.cardText,
                    fontStyle: "italic",
                    marginTop: "20px",
                    fontWeight: "bold",
                  }}
                  className="cardText"
                >
                  "Não se trata apenas de manter o corpo em forma, mas também de
                  cuidar da mente."
                </p>
              </div>
            </div>
          </div>
          <p style={styles.source}>Fonte: CREF 11 MS / Metrópoles</p>
        </div>
      </section>
    </div>
  );
}

// --- ESTILOS CSS INLINE ---
const sliderStyles = {
  section: {
    position: "relative",
    width: "100%",
    minHeight: "85vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  wrapper: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 30px",
  },
  slide: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    gap: "100px",
    flexWrap: "wrap-reverse",
  },
  textContent: {
    flex: "1",
    minWidth: "300px",
    padding: "20px",
    textAlign: "left",
  },
  imageContent: {
    flex: "1.2",
    minWidth: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  h1: {
    fontSize: "3rem",
    color: "#d4cd96",
    lineHeight: "1.1",
    marginBottom: "15px",
    fontWeight: "800",
  },
  h2: {
    fontSize: "2rem",
    color: "#7cc4d6",
    marginBottom: "15px",
    fontWeight: "700",
  },
  h3: {
    fontSize: "1.2rem",
    color: "#999",
    fontWeight: "400",
  },
  dotsContainer: {
    position: "absolute",
    bottom: "30px",
    width: "100%",
    textAlign: "center",
    zIndex: 10,
  },
  dot: {
    cursor: "pointer",
    height: "12px",
    width: "12px",
    margin: "0 6px",
    borderRadius: "50%",
    display: "inline-block",
    transition: "background-color 0.6s ease",
  },
};

const styles = {
  mentalHealthSection: {
    backgroundColor: "#FFF8E7",
    padding: "80px 20px",
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
  },
  mainTitle: {
    color: "#4c546c",
    fontSize: "2.5rem",
    fontWeight: "800",
    margin: 0,
  },
  contentWrapper: {
    display: "flex",
    gap: "60px",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  leftColumn: {
    flex: 1,
    minWidth: "300px",
  },
  paragraph: {
    color: "#333",
    lineHeight: "1.8",
    marginBottom: "25px",
    fontSize: "1.05rem",
  },
  statsBox: {
    borderLeft: "5px solid #4c546c",
    paddingLeft: "20px",
    marginTop: "35px",
    backgroundColor: "rgba(76, 84, 108, 0.05)",
    padding: "20px",
    borderRadius: "0 12px 12px 0",
  },
  rightColumn: {
    flex: 1,
    minWidth: "300px",
    marginTop: "20px",
  },
  cardContainer: {
    position: "relative",
    border: "3px solid #FFC107",
    borderRadius: "25px",
    padding: "45px 35px 35px 35px",
    backgroundColor: "transparent",
  },
  floatingIcon: {
    position: "absolute",
    top: "-35px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#FFC107",
    width: "70px",
    height: "70px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    color: "white",
  },
  cardTitle: {
    textAlign: "center",
    color: "#4c546c",
    marginBottom: "25px",
    marginTop: "15px",
    fontSize: "1.5rem",
  },
  cardText: {
    color: "#444",
    lineHeight: "1.6",
    fontSize: "1rem",
    marginBottom: "15px",
    textAlign: "justify",
  },
  source: {
    marginTop: "50px",
    fontSize: "0.85rem",
    color: "#888",
    textAlign: "center",
  },
};

export default Home;
