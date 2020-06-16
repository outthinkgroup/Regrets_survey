function snakeCase(string) {
  if (typeof string !== "string") return;
  return (
    string.match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    ) &&
    string
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .map((x) => x.toLowerCase())
      .map((x) => {
        const firstLetter = x[0].toUpperCase();
        const letterArray = x.split("");
        letterArray.splice(0, 1, firstLetter);
        const word = letterArray.join("");

        return word;
      })
      .join("_")
  );
}

function unSnakeCase(string) {
  return string.split("_").join(" ");
}

module.exports = { unSnakeCase, snakeCase };
