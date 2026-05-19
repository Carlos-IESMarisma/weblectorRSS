function cargarFeed() {
  const url = document.getElementById("customUrl").value.trim();
  if (!url) { alert("Introduce una URL de feed RSS."); return; }

  const proxy = "https://corsproxy.io/?" + encodeURIComponent(url);

  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {

    if (this.status !== 200) {
      console.error("Error al cargar el feed");
      return;
    }

    const parser = new DOMParser();
    const xml = parser.parseFromString(this.responseText, "text/xml");

    const canal = xml.querySelector("channel");

    if (!canal) {
      console.error("XML inválido o bloqueado");
      console.log(this.responseText); // 🔥 esto te ayuda a ver qué llega
      return;
    }

    const items = xml.querySelectorAll("item");
    let html = "";

    items.forEach(item => {
      const iTitle = item.querySelector("title")?.textContent || "";
      const iLink  = item.querySelector("link")?.textContent  || "#";
      const iDesc  = item.querySelector("description")?.textContent || "";
      const iDate  = item.querySelector("pubDate")?.textContent || "";

      html += `<div class="item">
        <h3><a href="${iLink}" target="_blank">${iTitle}</a></h3>
        <div class="meta">📅 ${iDate}</div>
        <div class="desc">${limpiarHTML(iDesc)}</div>
      </div>`;
    });

    document.getElementById("feed-container").innerHTML = html;
  };

  xhttp.onerror = function() {
    console.error("Error de red");
  };

  xhttp.open("GET", proxy);
  xhttp.send();
}
