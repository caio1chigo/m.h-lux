(function () {
  "use strict";
  const WHATSAPP = "5561986474665";
  const $ = (s, p = document) => p.querySelector(s);
  const wa = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

  const defaultMessage = "Olá! Vim pelo site da M.H Lux e gostaria de mais informações.";
  $("#whatsapp-float").href = wa(defaultMessage);
  $("#hero-whatsapp").href = wa(defaultMessage);
  $("#card-whatsapp").href = wa(defaultMessage);
  $("#footer-whatsapp").href = wa(defaultMessage);
  $("#year").textContent = new Date().getFullYear();

  $("#contact-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const name = $("#contact-name").value.trim();
    const phone = $("#contact-phone").value.trim() || "Não informado";
    const subject = $("#contact-subject").value;
    const message = $("#contact-message").value.trim();
    const text = `Olá! Vim pelo site da M.H Lux.\n\nNome: ${name}\nWhatsApp: ${phone}\nAssunto: ${subject}\nMensagem: ${message}`;
    window.open(wa(text), "_blank", "noopener");
  });

  const menu = $("#menu-toggle"), nav = $("#header-nav");
  menu.addEventListener("click", function () {
    const open = nav.classList.toggle("open");
    menu.classList.toggle("active", open);
    menu.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => { nav.classList.remove("open"); menu.classList.remove("active"); menu.setAttribute("aria-expanded", "false"); }));

  const top = $("#back-to-top");
  window.addEventListener("scroll", () => top.classList.toggle("visible", window.scrollY > 450), { passive: true });
  top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const reveal = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); } }), { threshold: 0.12 });
    reveal.forEach((el) => io.observe(el));
  } else reveal.forEach((el) => el.classList.add("visible"));

  const hideLoader = () => $("#page-loader").classList.add("hide");
  window.addEventListener("load", () => setTimeout(hideLoader, 400));
  setTimeout(hideLoader, 2200);
})();