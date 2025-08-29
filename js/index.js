function showBublaSkins() {
  document.querySelector(".main-container").classList.remove("visible");
  document.querySelector(".bubla-skins-container").classList.add("visible");
}

if (window.location.hash === "#bubla_skin_collection") {
  showBublaSkins();
}

document.querySelectorAll(".thumbnail-overlay").forEach(function(element) {
    element.addEventListener("click", function(event) {
        if (element.parentElement.attributes.project.value !== "bubla_skin_collection") return window.open(element.parentElement.attributes.project.value);
        showBublaSkins();
      });
});

document.querySelectorAll(".back-button").forEach(function(element) {
    element.addEventListener("click", function(event) {
            document.querySelectorAll(".container").forEach(function (element) {
                element.classList.remove("visible");
            });
            document.querySelector(".main-container").classList.add("visible");
    })
});

document.querySelector(".github-tab").addEventListener("click", function(event) {
  window.open("https://github.com/FlushDesert22/Bubla-Skin-Archive");
});

function formatItem(item, name) {
  return `<div class="item" ${!item.isMissing || item.hasReference || item.isRecreation ? `url="${item.url}"` : ""}>
          ${
            item.isMissing
              ? `<p class="overlay">This item is missing.${
                  item.isRecreation ? " This is a recreation of it and can be used as a reference." : item.hasReference ? " This is a reference to it." : "There is no reference to it."
                }</p>`
              : ""
          }
          ${!item.isMissing || item.hasReference || item.isRecreation ? `<img src="${item.url}">` : ""}
          <p class="item-name">${name}</p>
        </div>`;
}

function formatDataForDOM(data) {
  window.dataHtml = {
    Skins: {
      "Pre-Bubla.io": "",
      "Bubla.io": "",
      "Xgar.io": "",
      "Fanix.io": "",
      "Pre-Bublex.io": "",
      "Bublex.io": "",
      "Sphera_Connect.io": "",
      Staff: "",
      YouTubers: "",
    },
    Hats: {
      "Pre-Bubla.io": "",
      "Xgar.io": "",
      "Pre-Bublex.io": "",
      Staff: "",
      YouTubers: "",
    },
    Extras: "",
  };
  Object.keys(data.Skins).forEach(key => {
    const skin = data.Skins[key];
    if (skin.isItem) return (dataHtml.Skins[skin.group] += formatItem(skin, key));

    let html = `<div class="bundle"><h2 class="bundle-name">${key}</h2><div class="bundle-items">`,
      group = null;
    Object.keys(skin).forEach(key2 => {
      html += formatItem(skin[key2], key2);
      group = skin[key2].group;
    });
    if (group === null) return;
    html += "</div></div>";
    dataHtml.Skins[group] += html;
  });
  Object.keys(data.Hats).forEach(key => {
    const hat = data.Hats[key];
    return (dataHtml.Hats[hat.group] += formatItem(hat, key));
  });
  Object.keys(data.Extras).forEach(key => {
    const extra = data.Extras[key];
    return (dataHtml.Extras += formatItem(extra, key));
  });
  Object.keys(dataHtml).forEach(key => {
    if (typeof dataHtml[key] === "string") return (document.querySelector(`.data-type[type="${key}"]`).innerHTML = dataHtml[key]);
    Object.keys(dataHtml[key]).forEach(key2 => {
      document.querySelector(`.data-type[type="${key}"] .data-group[group="${key2}"]`).innerHTML = dataHtml[key][key2];
    });
  });
  document.querySelectorAll(".item").forEach(function (element) {
    element.addEventListener("click", function() {
      if (element.hasAttribute("url")) window.open(element.attributes.url.value);
    });
  });
  document.querySelectorAll(".data-type-tab").forEach(function (element) {
    element.addEventListener("click", function () {
      document.querySelectorAll(".data-type-tab").forEach(function (element) {
        element.classList.remove("active");
      });
      document.querySelectorAll(".data-type").forEach(function (element) {
        element.classList.remove("visible");
      });
      document.querySelectorAll(".data-group-tabs").forEach(function (element) {
        element.classList.remove("visible");
      });
      this.classList.add("active");
      document.querySelector(`.data-type[type="${this.attributes.type.value}"]`).classList.add("visible");
      document.querySelector(`.data-group-tabs[type=${this.attributes.type.value}]`).classList.add("visible");
    });
  });
  document.querySelectorAll(".data-group-tab").forEach(function (element) {
    element.addEventListener("click", function () {
      document.querySelectorAll(`.data-group-tab[type="${this.attributes.type.value}"]`).forEach(function (element) {
        element.classList.remove("active");
      });
      document.querySelectorAll(`.data-type[type="${this.attributes.type.value}"] .data-group`).forEach(function (element) {
        element.classList.remove("visible");
      });
      document.querySelector(`.data-type[type="${this.attributes.type.value}"] .data-group[group="${this.attributes.group.value}"]`).classList.add("visible");
      this.classList.add("active");
    });
  });
}

window.data = {};
let request = new XMLHttpRequest();
request.addEventListener("load", () => {
  data = request.response;
  formatDataForDOM(data);
});
request.open("GET", "./js/skins.json");
request.responseType = "json";
request.send();
