export default async function (word) {
    const exs = await fetch(`https://dict.laban.vn/ajax/getsound?accent=us&word=${word}`);
    const data = await exs.json();
    return data.data;
}
