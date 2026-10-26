import "./App.css";
import Header from "./header.jsx";
import Gallery from "./Ligthbox.jsx";
import SlideBar from "./slidebar.jsx";
import SlideText from "./SlideText.jsx";
import Flashs from "./Flashs.jsx";
import ScrollMeDown from "./ScrollMeDown.jsx";

function App() {
  return (
    <>
      <div className="relative h-screen overflow-hidden">
      <ScrollMeDown />
        <Header /> 
      </div>
      <SlideBar />
      <SlideText />

      <section id="projet">
        <div className="project-box">
          <h1 onClick={() => window.location.href="/booking.html"}>Proposer un projet</h1>
        </div>
      </section>

      <h1>Flashs</h1>
      <section id="flashs">
        <Flashs className="grid gap-3 justify-center" />
      </section>

      <h1>Galerie</h1>
      <section id="galerie">
        <Gallery className="grid gap-3 justify-center" />
      </section>

      <h1>Avis clients, covers, cica</h1>
      <section id="covers">
        <Gallery className="grid gap-3 justify-center" />
      </section>

      <section id="rdv">
        <h1>Déroulement d'un rendez-vous, soins, cadre etc.</h1>
      </section>
      
      <section id="informations">
        <h1>à propos de moi</h1>
      </section>
    </>
  );
}

export default App;