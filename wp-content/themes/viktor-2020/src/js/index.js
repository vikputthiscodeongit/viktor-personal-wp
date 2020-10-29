import stylesheet from "../scss/style.scss";

(function() {
    //
    // For debugging purposes.
    let debugMode = {
        set: process.env.NODE_ENV === "production" ? false : true,

        createEl: function() {
            const debugElWrapper = document.createElement("div");
            debugElWrapper.classList.add("container");

            const debugEl = document.createElement("div");
            debugEl.classList.add("debug-el");

            const debugElInner = document.createElement("p");
            debugElInner.textContent = "! Debugging mode is enabled !";

            debugElWrapper.appendChild(debugEl);
            debugEl.appendChild(debugElInner);

            const main = document.querySelector("main");
            main.insertBefore(debugElWrapper, main.firstElementChild);
        }
    };

    //
    // Generic helper functions
    // setTimeout, but better.
    let timeoutHandles = [];

    function setTimeoutWithId(id, fun, time) {
        if (id in timeoutHandles) {
            clearTimeout(timeoutHandles[id]);
        }

        timeoutHandles[id] = setTimeout(fun, time);
    }

    // Check if viewport is wider than given breakpoint.
    // function aboveBreakpoint(breakpoint) {
    //     const bp = breakpoint + "Breakpoint";
    //
    //     return window.matchMedia("(min-width: " + stylesheet[bp] + ")").matches;
    // }

    // Check if prefers-reduced-motion is set.
    function motionAllowed() {
        return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    // Valide an email address against the RFC 5322 specification. See also https://stackoverflow.com/a/201378/6396604 & https://emailregex.com/.
    function isValidEmail(address) {
        const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

        return regEx.test(address);
    }

    //
    // <html> / <body> operations
    const html = document.querySelector("html");

    html.className = html.className.replace("no-js", "js");

    if (debugMode.set) {
        debugMode.createEl();
    }

    //
    // Event handlers
    document.addEventListener("mousedown", function(e) {
        document.body.classList.add("using-mouse");
    });

    document.addEventListener("keydown", function(e) {
        document.body.classList.remove("using-mouse");
    });

    document.addEventListener("DOMContentLoaded", function() {
        const wpcf7Els = document.querySelectorAll(".wpcf7");

        if (wpcf7Els.length > 0) {
            wpcf7Els.forEach(function(wpcf7El) {
                wpcf7.init(wpcf7El);
            });
        }
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

    //
    // Contact Form 7
    let wpcf7 = {
        init: function(wpcf7El) {
            // The form itself
            wpcf7.htmlCleaner(wpcf7El);

            wpcf7El.addEventListener("wpcf7invalid", function(e) {
                wpcf7.invalidFieldScroller(e);
            });

            const wpcf7Form    = wpcf7El.querySelector(".wpcf7-form"),
                  submitButton = wpcf7Form.querySelector('[type="submit"]');

            wpcf7El.addEventListener("wpcf7submit", function(e) {
                // console.log(e);

                alert.show("form", e);

                let timeout = !debugMode.set ? 4000 : 600000;

                setTimeoutWithId("alert--form", function() {
                    alert.hide();
                }, timeout);

                submitButton.removeAttribute("disabled");
            });

            wpcf7Form.addEventListener("submit", function(e) {
                submitButton.setAttribute("disabled", true);
            });

            // Its fields
            const fields = wpcf7Form.querySelectorAll(".form__input");

            fields.forEach(function(field) {
                if (
                    field.classList.contains("wpcf7-validates-as-required") &&
                    // field.value isn't necessarily always empty on form initialization, Firefox for example retains <input> values when a page is refreshed.
                    field.value === ""
                ) {
                    wpcf7.invalidState.set(field);
                }

                field.addEventListener("input", function() {
                    if (!wpcf7Form.classList.contains("init")) {
                        alert.hide();
                    }

                    wpcf7.fieldValidator(field);
                });
            });
        },

        htmlCleaner: function(wpcf7El) {
            const wpcf7Form = wpcf7El.querySelector(".wpcf7-form"),
                  groups    = wpcf7Form.querySelectorAll(".form__group");

            groups.forEach(function(group) {
                const br = group.querySelector("br");

                if (br) {
                    group.removeChild(br);
                }

                const controlWrap = group.querySelector(".wpcf7-form-control-wrap");

                if (controlWrap) {
                    const field = controlWrap.querySelector(".wpcf7-form-control");

                    group.insertBefore(field, controlWrap);
                    group.removeChild(controlWrap);

                    !field.classList.contains("form__field--textarea") ?
                        field.removeAttribute("size") :
                        field.removeAttribute("cols");
                }
            });

            const responses = [
                wpcf7El.querySelector(".screen-reader-response"),
                wpcf7Form.querySelector(".wpcf7-response-output")
            ];

            responses.forEach(function(response) {
                response.parentElement.removeChild(response);
            });
        },

        fieldValidator: function(field) {
            const type = field.getAttribute("type");

            if (
                (type === "email" && isValidEmail(field.value)) ||
                (type !== "email" && field.value !== "")
            ) {
                wpcf7.invalidState.unset(field);
            } else {
                wpcf7.invalidState.set(field);
            }
        },

        invalidState: {
            set: function(field) {
                field.parentElement.classList.remove("is-valid");

                field.setAttribute("aria-invalid", true);
                field.parentElement.classList.add("is-invalid");
            },

            unset: function(field) {
                field.setAttribute("aria-invalid", false);
                field.parentElement.classList.remove("is-invalid");

                field.parentElement.classList.add("is-valid");
            }
        },

        invalidFieldScroller: function(e) {
            const invalidFields     = e.detail.apiResponse.invalid_fields,
                  firstInvalidField = document.getElementById(invalidFields[0].idref);

            firstInvalidField.scrollIntoView({
                behavior: motionAllowed() ? "smooth" : "auto",
                block: "start",
                inline: "start"
            });
        }
    };
}());
