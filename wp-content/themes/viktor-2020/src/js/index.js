import Noty from "noty";

import stylesheet from "../scss/style.scss";

(function() {
    // Generic helper functions
    //
    function cssSecondDurationToMs(time) {
        if (!/^((0\.){1}|([1-9]+\.*))+([0-9])*s$/.test(time)) {
            console.error("Given time '" + time + "' is in an invalid format.");

            return false;
        }

        // < 1
        if (/^(0\.){1}([0-9])*s$/.test(time)) {
            time = time.replace(/^(0\.){1}/, ""); // Remove everything before the dot
            time = time.replace(/s{1}$/, "");	  // Remove the 's'

            // Add zeroes
            if (time.length < 3) {
                do {
                    time = time + "0";
                } while (time.length < 3);
            }

            // Remove zeroes
            if (time.length > 3) {
                const reduceBy = time.length - (time.length - 3);

                time = time.substring(0, reduceBy);
            }
        }

    	// >= 1
        if (/^([1-9]+\.*)+([0-9])*s$/.test(time)) {
            const currentDotPos = time.search(/\.{1}/),
                  newDotPos		= currentDotPos + 4;

                time = time.replace(/s{1}$/, ""); 								// Remove the 's'
                time = time + "000"; 											// Add zeroes
                time = time.slice(0, newDotPos) + "." + time.slice(newDotPos);  // Move the dot 3 places to the right
                time = time.replace(".", ""); 									// Remove the original dot
                time = time.replace(/(\.[0-9]+)$/, ""); 						// Remove the new dot and all numbers that follow
        }

    	return parseInt(time);
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
    // Contact Form 7
    let wpcf7 = {
        init: function(wpcf7El) {
            // The form itself
            wpcf7.captcha(wpcf7El);

            wpcf7.htmlCleaner(wpcf7El);

            wpcf7El.addEventListener("wpcf7invalid", function(e) {
                wpcf7.invalidFieldScroller(e);
            });

            const wpcf7Form    = wpcf7El.querySelector(".wpcf7-form"),
                  submitButton = wpcf7Form.querySelector('[type="submit"]');

            wpcf7El.addEventListener("wpcf7submit", function(e) {
                // console.log(e);

                const formStatus = e.detail.status;

                const alertType       = formStatus !== "mail_sent" ?
                                            "warning" : "success",
                      alertText       = e.detail.apiResponse.message,
                      alertTimeoutDur = !debugMode.set ? 4000 : false;

                new Noty({
                    type:    alertType,
                    layout:  "topCenter",
                    theme:   "bootstrap-v4",
                    text:    alertText,
                    timeout: alertTimeoutDur,
                    killer:  true
                }).show();

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
                    Noty.closeAll();

                    wpcf7.fieldValidator(field);
                });
            });
        },

        captcha: function(wpcf7El) {
            const wpcf7Form    = wpcf7El.querySelector(".wpcf7-form"),
                  hiddenFields = wpcf7Form.querySelectorAll(".wpcf7-mc-h"),
                  digitFields  = wpcf7Form.querySelectorAll("input[name^='wpcf7-mc-d'"),
                  answer       = wpcf7Form.querySelector("label[for='wpcf7-mc-answer']"),
                  star         = document.getElementById("wpcf7-mc-answer-star");

            hiddenFields.forEach(function(field) {
                field.style.display = "none";
            });

            digitFields.forEach(function(field, i) {
                let digits = answer.textContent.match(/[0-9]/g);
                const targetDigit = digits[i];

                // 3 seconds timeout because spambots fill in forms real fast and have probably already left the page by the time the value gets inserted in the DOM.
                setTimeout(function() {
                    if (!field.value) {
                        field.value = targetDigit;
                    }
                }, 3000);
            });

            star.style.cssText = "display: inline-block; vertical-align: top; margin-left: 0.25rem; line-height: 1;";
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

                const ajaxLoader = group.querySelector(".ajax-loader");

                if (ajaxLoader) {
                    let loader = document.createElement("span");
                    loader.classList.add("loader");

                    ajaxLoader.appendChild(loader)

                    ajaxLoader.classList.remove("ajax-loader");
                    ajaxLoader.classList.add("form__ajax-loader");
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

            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({
                    behavior: motionAllowed() ? "smooth" : "auto",
                    block: "start",
                    inline: "start"
                });
            }
        }
    };
}());
