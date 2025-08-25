document.addEventListener("DOMContentLoaded", () => {
    console.log("Desktop environment initializing...");

    // Clock
    function startClock() {
        const clock = document.getElementById("clock");
        if (!clock) return;
        function update() {
            const now = new Date();
            clock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }
        update();
        setInterval(update, 1000);
    }

    // Window controls
    function openWindow(id) {
        const win = document.getElementById(id);
        if (!win) return;
        win.classList.add("window--open");
        win.style.display = "flex";
        bringToFront(win);
    }

    function closeWindow(win) {
        if (!win) return;
        win.classList.remove("window--open");
        win.style.display = "none";
    }

    function minimizeWindow(win) {
        if (!win) return;
        win.classList.remove("window--open");
        win.style.display = "none";
    }

    function bringToFront(win) {
        document.querySelectorAll(".window").forEach(w => w.style.zIndex = "50");
        win.style.zIndex = "100";
    }

    // Desktop icon clicks
    document.getElementById("desktop").addEventListener("click", e => {
        const icon = e.target.closest(".icon");
        if (icon && icon.dataset.window) {
            openWindow(icon.dataset.window);
        }
    });

    // Menubar links
    document.querySelectorAll(".menubar__link[data-window]").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const target = link.dataset.window;
            if (target) openWindow(target);
        });
    });

    // Titlebar buttons
    document.addEventListener("click", e => {
        if (e.target.matches(".titlebar__button.close")) {
            closeWindow(e.target.closest(".window"));
        }
        if (e.target.matches(".titlebar__button.min")) {
            minimizeWindow(e.target.closest(".window"));
        }
    });

    // Escape closes windows
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            document.querySelectorAll(".window--open").forEach(closeWindow);
        }
    });

    // Folder switching (Work Explorer)
    document.querySelectorAll(".work__sidebar li[data-folder]").forEach(item => {
        item.addEventListener("click", () => {
            const folder = item.dataset.folder;
            document.querySelectorAll(".gallery-set").forEach(g => g.hidden = true);
            const activeGallery = document.getElementById("gallery-" + folder);
            if (activeGallery) activeGallery.hidden = false;
            document.querySelectorAll(".work__sidebar li").forEach(li => li.classList.remove("selected"));
            item.classList.add("selected");
        });
    });

    // Show retro popups on load and auto-close after 5s
    ["popup-love", "popup-swag", "popup-hire", "popup-compromised"].forEach(id => {
        const win = document.getElementById(id);
        if (win) {
            win.classList.add("window--open");
            win.style.display = "flex";

            // Auto-close after 5 seconds
            setTimeout(() => {
                win.classList.remove("window--open");
                win.style.display = "none";
            }, 5000);
        }
    });

    // Start Menu toggle
    const startButton = document.querySelector(".taskbar__start");
    const startMenu = document.getElementById("start-menu");
    if (startButton && startMenu) {
        startButton.addEventListener("click", () => {
            const isOpen = startMenu.classList.contains("start-menu--open");
            if (isOpen) {
                startMenu.classList.remove("start-menu--open");
                startMenu.setAttribute("aria-hidden", "true");
            } else {
                startMenu.classList.add("start-menu--open");
                startMenu.setAttribute("aria-hidden", "false");
            }
        });

        // Close start menu if click outside
        document.addEventListener("click", (e) => {
            if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
                startMenu.classList.remove("start-menu--open");
                startMenu.setAttribute("aria-hidden", "true");
            }
        });
    }

    // Handle Start Menu item clicks
    document.querySelectorAll("#start-menu .start-menu__item[data-window]").forEach(item => {
        item.addEventListener("click", () => {
            const target = item.dataset.window;
            if (target) openWindow(target);
            // Close start menu after opening window
            startMenu.classList.remove("start-menu--open");
            startMenu.setAttribute("aria-hidden", "true");
        });
    });

    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const windowId = icon.dataset.window;
            const appWindow = document.getElementById(windowId);
            if (appWindow) {
                appWindow.classList.add('window--open');
            }
        });
    });

    // Close buttons
    document.querySelectorAll('.window .close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const win = e.target.closest('.window');
            win.classList.remove('window--open');
        });
    });

    // Optional: minimize buttons
    document.querySelectorAll('.window .min').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const win = e.target.closest('.window');
            win.classList.toggle('window--minimized');
        });
    });

    startClock();
});

