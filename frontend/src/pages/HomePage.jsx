import { useEffect, useState } from "react";
import "../assets/styles/home.css";

export default function Home() {
  return (
    <section className="home-page">
      <h1>¡Bienvenido a WallyStreet! 👋</h1>

      <p className="home-subtitle">
        Invertí de forma inteligente.
      </p>

      <p className="home-description">
        Consultá el mercado, administrá tu portfolio y seguí todas tus
        operaciones desde un mismo lugar.
      </p>
    </section>
  );
}