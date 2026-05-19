function cargarFeed() {
  const url = document.getElementById("customUrl").value.trim();
  if (!url) { alert("Introduce o selecciona una URL de feed RSS."); return; }

  // Proxy CORS para saltarse las restricciones del navegador
  const proxy = "https://api.allorigins.win/get?url=" + encodeURIComponent(url);

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    if (this.status !== 200) { mostrarError("Error al cargar el feed."); return; }

    const data   = JSON.parse(this.responseText); // allorigins devuelve JSON
    const parser = new DOMParser();
    const xml    = parser.parseFromString(data.contents, "text/xml");

    // Extraer información del canal
    const canal  = xml.querySelector("channel");
    const titulo = canal.querySelector("title")?.textContent || "";
    const desc   = canal.querySelector("description")?.textContent || "";
    const link   = canal.querySelector("link")?.textContent || "";

    // Extraer items
    const items  = xml.querySelectorAll("item");
    let   html   = "";
    items.forEach(item => {
      const iTitle = item.querySelector("title")?.textContent || "";
      const iLink  = item.querySelector("link")?.textContent  || "#";
      const iDesc  = item.querySelector("description")?.textContent || "";
      const iDate  = item.querySelector("pubDate")?.textContent || "";
      html += `<div class="item">
        <h3><a href="${iLink}" target="_blank">${iTitle}</a></h3>
        <div class="meta"><span>📅 ${iDate}</span></div>
        <div class="desc">${limpiarHTML(iDesc)}</div>
      </div>`;
    });
    document.getElementById("feed-container").innerHTML = html;
  };
  xhttp.open("GET", proxy);
  xhttp.send();
}