import { useState, useEffect } from "react";

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Função que monitora a rolagem da página
  useEffect(() => {
    const toggleVisibility = () => {
      // Se desceu mais de 300px, mostra o botão
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Limpeza do evento quando o componente sai da tela (boa prática)
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Função para subir suavemente
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Se não for visível, não renderiza nada
  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      style={styles.botao}
      title="Voltar ao topo"
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5"></path>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    </button>
  );
}

const styles = {
  botao: {
    position: "fixed",
    bottom: "90px", // Fica um pouco acima do rodapé
    right: "30px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    zIndex: 1000,
    transition: "transform 0.3s ease",
  },
};

export default BackToTop;
