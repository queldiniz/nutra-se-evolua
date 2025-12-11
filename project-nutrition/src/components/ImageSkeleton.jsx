import React, { useState } from "react";

function ImageSkeleton({ src, alt, className }) {
  const [carregou, setCarregou] = useState(false);

  return (
    // O wrapper herda a classe (tamanho) que você passar onde for usar
    <div
      className={`image-wrapper ${className || ""}`}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* 1. O Skeleton (aparece só enquanto não carregou) */}
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

      {/* 2. A Imagem Real */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setCarregou(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // Garante que a imagem não estique
          opacity: carregou ? 1 : 0, // Transição de invisível para visível
          transition: "opacity 0.5s ease-in-out", // Efeito suave
          position: "absolute", // Garante que fique em cima do skeleton
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}

export default ImageSkeleton;
