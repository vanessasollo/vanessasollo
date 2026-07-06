// ==========================================
// VANESSA SOLLO — SCRIPT.JS
// ==========================================

const YT_ID = "w0lMLn69Ebg";

// Cria o iframe do YouTube (privacy-friendly: youtube-nocookie)
function buildYouTubeIframe(autoplay) {
    const params = new URLSearchParams({
        autoplay: autoplay ? "1" : "0",
        rel: "0",
        modestbranding: "1",
        playsinline: "1"
    });

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${YT_ID}?${params.toString()}`;
    iframe.title = "Vídeo de apresentação — Vanessa Sollo";
    iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    return iframe;
}

// -------------------------------
// AGENDA (carregada do JSON)
// -------------------------------

const agendaContainer = document.getElementById("agenda-container");

if (agendaContainer) {

    fetch("agenda.json")
        .then(response => response.json())
        .then(shows => {

            shows.forEach((show, index) => {

                const botaoIngresso = show.ingresso
                    ? `<a href="${show.ingresso}" target="_blank" rel="noopener noreferrer" class="btn-ingresso">Comprar ingresso</a>`
                    : "";

                const card = document.createElement("div");
                card.className = "card-show";
                card.style.animationDelay = `${index * 0.15}s`;

                card.innerHTML = `
                    <img src="assets/agenda/${show.banner}" alt="Show de Vanessa Sollo — ${show.local}" loading="lazy">
                    <div class="card-info">
                        <div class="card-data">${show.data}</div>
                        <div class="card-local">${show.local}</div>
                        <div class="card-cidade">${show.cidade}</div>
                        <div class="card-hora">
                            <i class="fa-regular fa-clock" aria-hidden="true"></i>
                            ${show.hora}
                        </div>
                        ${botaoIngresso}
                    </div>
                `;

                agendaContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar agenda:", error);
            agendaContainer.innerHTML =
                `<p class="agenda-erro">Não foi possível carregar a agenda no momento.</p>`;
        });
}

// ----------------------------------
// CARROSSEL DA AGENDA
// ----------------------------------

const btnNext = document.getElementById("next");
const btnPrev = document.getElementById("prev");

function scrollAgenda(amount) {
    if (agendaContainer) {
        agendaContainer.scrollBy({ left: amount, behavior: "smooth" });
    }
}

if (btnNext) btnNext.addEventListener("click", () => scrollAgenda(380));
if (btnPrev) btnPrev.addEventListener("click", () => scrollAgenda(-380));

// ----------------------------------
// VÍDEO — SEÇÃO INLINE (facade)
// ----------------------------------
// Carrega o iframe pesado do YouTube só ao clicar, mantendo a página leve.

const inlineFacade = document.querySelector("#video .video-facade");

if (inlineFacade) {
    inlineFacade.addEventListener("click", () => {
        const frame = inlineFacade.closest(".video-frame");
        if (frame) frame.replaceChildren(buildYouTubeIframe(true));
    });
}

// ----------------------------------
// VÍDEO — MODAL (botão do hero)
// ----------------------------------

const openVideoBtn = document.getElementById("abrirVideo");
const closeVideoBtn = document.getElementById("fecharVideo");
const modal = document.getElementById("videoModal");
const modalBody = document.getElementById("videoModalBody");

let lastFocusedEl = null;

function openModal() {
    if (!modal || !modalBody) return;
    lastFocusedEl = document.activeElement;
    modalBody.replaceChildren(buildYouTubeIframe(true));
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    if (closeVideoBtn) closeVideoBtn.focus();
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modalBody.replaceChildren(); // remove o iframe -> interrompe a reprodução
    document.body.style.overflow = "";
    if (lastFocusedEl) lastFocusedEl.focus();
}

if (openVideoBtn && modal && modalBody) {

    openVideoBtn.addEventListener("click", openModal);

    if (closeVideoBtn) closeVideoBtn.addEventListener("click", closeModal);

    // Fecha ao clicar fora do conteúdo
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Fecha com Esc e mantém o foco preso no botão de fechar
    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("open")) return;
        if (e.key === "Escape") {
            closeModal();
        } else if (e.key === "Tab" && closeVideoBtn) {
            e.preventDefault();
            closeVideoBtn.focus();
        }
    });
}

// ----------------------------------
// HEADER AO ROLAR
// ----------------------------------

const header = document.querySelector(".header");

if (header) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.style.background = "rgba(0,0,0,.85)";
            header.style.backdropFilter = "blur(12px)";
        } else {
            header.style.background =
                "linear-gradient(to bottom, rgba(0,0,0,.70), transparent)";
            header.style.backdropFilter = "none";
        }
    });
}
