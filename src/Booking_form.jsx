export function Form() {
  function updateBackgroundColor(color) {
    document.body.style.backgroundColor = color;
  }

  function displayFormContents(someForm) {
    let out = '';

    for (let i = 0, el; (el = someForm.elements[i]); i++) {
      if (el.name) {
        out += el.name + ' = ' + el.value + '\n';
      }
    }

    alert(out);
  }

  return (
    <form>
      <select
        name="gender"
        onChange={(e) => updateBackgroundColor(e.target.value)}
      >
        <option value="">Select gender</option>
        <option value="pink">Female</option>
        <option value="lightblue">Male</option>
      </select>

      <button
        type="button"
        onClick={(e) => displayFormContents(e.currentTarget.form)}
      >
        Display form contents
      </button>
    </form>
  );
}