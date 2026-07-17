/* ==========================================================================
   encuentro de sabores  - lógica del sitio
   ========================================================================== */
(function () {

/* --------------------------------------------------------------------------
   1. datos de los platos
   cada plato plato se identifica a la ciudad a la que pertenece, para poder filtrarlos.
   -------------------------------------------------------------------------- */
const platos = [
    { nombre: "Ajiaco", ciudad: "platos-bogota", ingredientes: "Este delicioso plato tradicional bogotano lleva tres tipos de papa, tierno pollo desmechado, guascas frescas y un toque final de crema de leche.", img: "img/ajiaco.webp" },
    { nombre: "Changua", ciudad: "platos-bogota", ingredientes: "Un clásico reconfortante: deliciosa sopa de leche con huevo pochado, aromatizada con cilantro fresco y acompañada de trozos de calado crujiente.", img: "img/changua.webp" },
    { nombre: "Puchero Santafereño", ciudad: "platos-bogota", ingredientes: "Una fiesta de sabores que contiene diferentes tipos de carnes, vegetales frescos, mazorca dulce y plátano maduro en su punto.", img: "img/puchero_santafereno.webp" },
    { nombre: "Arepa de Huevo", ciudad: "platos-santa-marta", ingredientes: "Nuestra famosa arepa crocante de maíz amarillo, rellena con un huevo fresco frito a la perfección.", img: "img/arepahuevo.webp" },
    { nombre: "Arroz con Camarón", ciudad: "platos-santa-marta", ingredientes: "Arroz al estilo caribeño cargado de camarones jugosos, con el inconfundible sabor del coco.", img: "img/arrozcamaron.webp" },
    { nombre: "Cayeye", ciudad: "platos-santa-marta", ingredientes: "Puré artesanal de banano verde cocido, mezclado con mantequilla de la casa y coronado con queso costeño.", img: "img/cayeye.webp" }
];

/* --------------------------------------------------------------------------
   2. se filtra platos por ciudad
   pinta las tarjetas de la ciudad elegida y actualiza el mapa y el botón activo.
   -------------------------------------------------------------------------- */
function mostrarPlatos(idCiudad, botonPulsado) {
    const contenedor = document.getElementById('contenedor-platos-dinamicos');
    contenedor.innerHTML = '';

    const platosFiltrados = platos.filter(p => p.ciudad === idCiudad);

    platosFiltrados.forEach(plato => {
        const divCarta = document.createElement('div');
        divCarta.className = 'menu-favoritos__plato';
        const imgJpg = plato.img.replace('.webp', '.jpg');
        divCarta.innerHTML = `
            <picture>
                <source srcset="${plato.img}" type="image/webp">
                <img src="${imgJpg}" alt="${plato.nombre}" class="menu-favoritos__plato-imagen" loading="lazy">
            </picture>
            <h3>${plato.nombre}</h3>
            <p><small>${plato.ingredientes}</small></p>
        `;
        contenedor.appendChild(divCarta);
    });

    // se actualiza el mapa de la sección de contacto según la ciudad elegida
    const mapa = document.getElementById("mapa-ciudad");
    if (mapa) {
        mapa.src = (idCiudad === 'platos-bogota') ?
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254508.51641075677!2d-74.24789354060598!3d4.648283716616429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfd2da6cb29%3A0x239d635520a33914!2sBogot%C3%A1!5e0!3m2!1ses!2sco!4v1716300000000!5m2!1ses!2sco" :
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125433.91030095813!2d-74.25700720491959!3d11.196305608826647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef4f58c70f03107%3A0x8670597148566190!2sSanta%20Marta%2C%20Magdalena!5e0!3m2!1ses!2sco!4v1716300000000!5m2!1ses!2sco";
    }

    // se marca visualmente qué botón de ciudad está activo
    document.querySelectorAll('.selector-ciudad__boton').forEach(btn => btn.classList.remove('selector-ciudad__boton--activo'));
    if (botonPulsado) botonPulsado.classList.add('selector-ciudad__boton--activo');
}

/* --------------------------------------------------------------------------
   3. el carrusel del banner principal
   se cambia automáticamente de imagen cada 5 segundos y permite navegar
   manualmente con los indicadores (puntos).
   -------------------------------------------------------------------------- */
function iniciarCarrusel() {
    const slides = document.querySelectorAll('.banner-carrusel__slide');
    const indicadores = document.querySelectorAll('.banner-carrusel__indicador');
    if (slides.length === 0) return;

    let indiceActual = 0;
    let intervalo = null;

    function irASlide(indice) {
        slides[indiceActual].classList.remove('banner-carrusel__slide--activo');
        indicadores[indiceActual]?.classList.remove('banner-carrusel__indicador--activo');

        indiceActual = indice;

        slides[indiceActual].classList.add('banner-carrusel__slide--activo');
        indicadores[indiceActual]?.classList.add('banner-carrusel__indicador--activo');
    }

    function siguienteSlide() {
        const siguiente = (indiceActual + 1) % slides.length;
        irASlide(siguiente);
    }

    function iniciarAutoplay() {
        intervalo = setInterval(siguienteSlide, 5000);
    }

    function reiniciarAutoplay() {
        clearInterval(intervalo);
        iniciarAutoplay();
    }

    // permite saltar a una imagen concreta pulsando su indicador
    indicadores.forEach((punto, indice) => {
        punto.addEventListener('click', () => {
            irASlide(indice);
            reiniciarAutoplay();
        });
    });

    iniciarAutoplay();
}

/* --------------------------------------------------------------------------
   4. pop up del menú (se abre desde el header)
   -------------------------------------------------------------------------- */
function iniciarPopup(idBotonAbrir, idBotonCerrar, idModal) {
    const btnAbrir = document.getElementById(idBotonAbrir);
    const btnCerrar = document.getElementById(idBotonCerrar);
    const modal = document.getElementById(idModal);
    if (!btnAbrir || !modal) return;

    function abrirModalHandler() {
        modal.classList.add('modal--visible');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // evita el scroll de fondo mientras el popup está abierto
    }

    function cerrarModalHandler() {
        modal.classList.remove('modal--visible');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    btnAbrir.addEventListener('click', abrirModalHandler);
    btnCerrar.addEventListener('click', cerrarModalHandler);

    // se cierra el popup si se hace clic fuera de la caja
    modal.addEventListener('click', (evento) => {
        if (evento.target === modal) cerrarModalHandler();
    });

    // se cierra el popup con la tecla Escape
    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && modal.classList.contains('modal--visible')) cerrarModalHandler();
    });
}

/* --------------------------------------------------------------------------
   5. navegación movil (menú hamburguesa)
   -------------------------------------------------------------------------- */
function iniciarNavMovil() {
    const btnHamburguesa = document.getElementById('btn-hamburguesa');
    const nav = document.getElementById('header-nav');
    if (!btnHamburguesa || !nav) return;

    btnHamburguesa.addEventListener('click', () => {
        const estaAbierto = nav.classList.toggle('header__nav--abierto');
        btnHamburguesa.classList.toggle('header__hamburguesa--activo', estaAbierto);
        btnHamburguesa.setAttribute('aria-expanded', estaAbierto);
    });

    // se cierra el menú móvil al pulsar cualquier enlace de navegación
    nav.querySelectorAll('a').forEach(enlace => {
        enlace.addEventListener('click', () => {
            nav.classList.remove('header__nav--abierto');
            btnHamburguesa.classList.remove('header__hamburguesa--activo');
            btnHamburguesa.setAttribute('aria-expanded', 'false');
        });
    });
}

/* --------------------------------------------------------------------------
   6. el formulario de contacto
   -------------------------------------------------------------------------- */
function iniciarFormularioContacto() {
    const formulario = document.getElementById('form-contacto');
    if (!formulario) return;

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        this.style.display = 'none';
        document.getElementById('mensaje-confirmacion').style.display = 'block';
    });
}

/* --------------------------------------------------------------------------
   7. el formulario de reservas
   el input de tipo "date" ya ofrece un calendario nativo del navegador,
   aquí sólo validamos que la fecha elegida no sea anterior a hoy.
   -------------------------------------------------------------------------- */
function iniciarFormularioReservas() {
    const formulario = document.getElementById('form-reservas');
    const inputFecha = document.getElementById('reserva-fecha');
    if (!formulario) return;

    // evita seleccionar fechas pasadas en el calendario
    if (inputFecha) {
        const hoy = new Date().toISOString().split('T')[0];
        inputFecha.min = hoy;
    }

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        alert('¡Muchas gracias! Tu reserva ha quedado confirmada correctamente.');
        formulario.reset();
    });
}

/* --------------------------------------------------------------------------
   8. selector de ciudad (botones)
   se enlazan los botones por data-ciudad en vez de usar onclick inline en el html.
   -------------------------------------------------------------------------- */
function iniciarSelectorCiudad() {
    document.querySelectorAll('.selector-ciudad__boton').forEach(boton => {
        boton.addEventListener('click', () => mostrarPlatos(boton.dataset.ciudad, boton));
    });
}

/* --------------------------------------------------------------------------
   9. inicialización general al cargar el dom
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    mostrarPlatos('platos-bogota', document.querySelector('.selector-ciudad__boton')); // Carga inicial de platos
    iniciarSelectorCiudad();
    iniciarCarrusel();
    iniciarPopup('btn-menu', 'btn-cerrar-menu', 'modal-menu');
    iniciarNavMovil();
    iniciarFormularioContacto();
    iniciarFormularioReservas();
});

})();
