import './App.css'
import Header from "./header.jsx";
import Gallery from './Ligthbox.jsx';
import SlideBar from './slidebar.jsx';
import SlideText from './SlideText.jsx';
import Flashs from './Flashs.jsx';

function App() {
  return (
    <>
    <div className="relative">
      <Header className="h-screen bg-#000000; text-white flex items-center " />
    <SlideBar/>
    <SlideText />

<section id="projet">
  <div className="project-box">
    <h1>Proposer un projet</h1>
  </div>
</section>
<h1>Flashs</h1>
    <section id ="flashs">
        <Flashs className={`grid gap-3 justify-center`}/>
    </section>
<h1>Galerie</h1>
    <section id ="galerie">
        <Gallery className={`grid gap-3 justify-center`}/>
    </section>

    </div>

    <section id ="informations"><h1>Informations</h1>
        <div/>
    </section>
    </>
  );
}

export default App;