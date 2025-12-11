import React from "react";

function SkeletonCard() {
  return (
    <div className="card-skeleton">
      <div className="skeleton skeleton-img"></div>

      <div className="skeleton-content">
        <div className="skeleton skeleton-title"></div>

        <div className="skeleton skeleton-line" style={{ width: "50%" }}></div>
        <div className="skeleton skeleton-line"></div>
        <div className="skeleton skeleton-line"></div>
        <div className="skeleton skeleton-line"></div>
        <div className="skeleton skeleton-line" style={{ width: "80%" }}></div>

        <div className="skeleton skeleton-block-end"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
