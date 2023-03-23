export default async function (word) {
    const exs = await fetch(`http://localhost:3000/${word}`);
    const data = await exs.json();
    return data;
}
