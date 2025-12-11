import React, { useState } from "react";

function ImageSkeleton({ src, alt, className }) {
  const [carregou, setCarregou] = useState(false);

  return (
    // O wrapper herda a classe (tamanho)
    <div
      className={`image-wrapper ${className || ""}`}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* o Skeleton (aparece só enquanto não carregou) */}
      {!carregou && (
        <div
          className="skeleton"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        ></div>
      )}

      {/*A Imagem Real */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setCarregou(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: carregou ? 1 : 0, // Transição de invisível para visível
          transition: "opacity 0.5s ease-in-out", // Efeito suave
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}

export default ImageSkeleton;
