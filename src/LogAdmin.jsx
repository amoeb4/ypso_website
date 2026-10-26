import "./Logindex.css";
import md5 from "blueimp-md5";

export default function LogAdmin() {
  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const identifiant = form.identifiant.value.trim();
    const hashAttendu = "c83dba10acddc50706fe48b802d4d266";
    const hashSaisi = form.motDePasse.value;

    if (identifiant === "ypso" && hashSaisi === hashAttendu) {
      alert("Connexion réussie !");
    } else {
    console.log(md5(identifiant));
    console.log(hashAttendu);
    console.log(hashSaisi);
      alert("Identifiant ou mot de passe incorrect.");
    }
  };

  return (
    <main className="admin-page">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h1>La cabane d'Ypso</h1>

        <input
          type="text"
          name="identifiant"
          placeholder="Identifiant"
          autoComplete="username"
          required
        />

        <input
          type="password"
          name="motDePasse"
          placeholder="Mot de passe"
          autoComplete="current-password"
          required
        />

        <button type="submit">Confirmer</button>
      </form>
    </main>
  );
}
