document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");

    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            menu.classList.toggle("nav__menu--open");
            toggle.classList.toggle("nav__toggle--open");
        });

        document.addEventListener("click", function (e) {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove("nav__menu--open");
                toggle.classList.remove("nav__toggle--open");
            }
        });
    }
});
