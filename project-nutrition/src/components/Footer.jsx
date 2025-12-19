function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <img
          src="/img/nutrition-footer.jpg"
          alt="Logo Nutra-se"
          style={styles.logo}
        />

        <p style={styles.text}>
          © 2025 Nutra-se e evolua. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#2c3e50", // Fundo escuro
    color: "#ecf0f1", // Texto claro
    padding: "30px 0",
    marginTop: "auto", // Garante que fique no final da página
    textAlign: "center",
    borderTop: "4px solid #4ca1af", // Detalhe verde no topo do rodapé (opcional)
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    height: "60px", // Altura aumentada conforme seu print
    width: "60px", // Largura igual à altura para ficar redondo
    objectFit: "cover", // Garante que a imagem não distorça
    borderRadius: "50%",
    marginBottom: "5px",
    padding: "2px",
  },
  text: {
    fontSize: "0.9rem",
    opacity: 0.8,
    fontFamily: "Poppins, sans-serif",
    margin: 0,
  },
};

export default Footer;
