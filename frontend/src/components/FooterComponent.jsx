import '../assets/styles/footer.css';

function FooterComponent() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="mb-0">
        Laura Cuenca |
        Ludmila Bélen Ramirez |
        Emily Magali Scotto
      </p>

      <p className="mb-0">
        © {year}
      </p>
    </footer>
  );
}

export default FooterComponent;