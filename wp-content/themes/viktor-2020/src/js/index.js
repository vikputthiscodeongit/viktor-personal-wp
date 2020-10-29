import stylesheet from "../scss/style.scss";

(function() {

    };


    // Check if prefers-reduced-motion is set.
    function motionAllowed() {
        return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }


    // <html> / <body> operations
    const html = document.querySelector("html");

    html.className = html.className.replace("no-js", "js");

    //
    // Event handlers
    document.addEventListener("mousedown", function(e) {
        document.body.classList.add("using-mouse");
    });

    document.addEventListener("keydown", function(e) {
        document.body.classList.remove("using-mouse");
    });

    //
    // Alert
    let alert = {
        el: document.querySelector(".alert"),

        hide: function() {
            this.el.classList.remove("is-visible");

            setTimeout(function() {
                alert.el.className = alert.el.className.replace(/(\s(alert--){1}\w*)/g, "");
                alert.el.removeAttribute("role");

                alert.el.firstElementChild.textContent = "";
            }, 167); // Get timeout from CSS.
        },

        show: function(type, data) {
            let cssModifiers,
                text;

            switch (type) {
                case "form":
                    cssModifiers = "alert--" + type + " " + "alert--" + data.detail.status;

                    if (typeof data !== "undefined") {
                        text = data.detail.apiResponse.message;
                    } else {
                        text = "No data was passed to this alert, so here's some dummy text for you.";
                    }

                    break;
                default:
                    cssModifiers = "alert--default";
                    text = data;
            }

            this.el.firstElementChild.textContent = text;

            this.el.setAttribute("role", "alert");
            this.el.className += " " + cssModifiers + " " + "is-visible";
        }
    };
}());
