import Noty from "noty";

import stylesheet from "../scss/style.scss";

(function() {
    // Generic helper functions
    // Get CSS property value of given element.
    // function cssValue(el, prop) {
    //     const styles = window.getComputedStyle(el),
    //           value  = styles.getPropertyValue(prop);
    //
    //     return value;
    // }

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
        isSet: process.env.NODE_ENV === "production" ? false : true,

        setIndicator: function() {
            const width = "0.125rem",
                  style = "solid",
                  color = "red";

            document.body.style.borderLeft = width + " " + style + " " + color;
            document.body.style.borderRight = document.body.style.borderLeft;
        }
    };

    //
    // <html> / <body> operations
    const html = document.querySelector("html");

    html.className = html.className.replace("no-js", "js");

    if (debugMode.isSet) {
        debugMode.setIndicator();
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
                      alertTimeoutDur = debugMode.isSet ? false : 4000;

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
                  problem      = wpcf7Form.querySelector("label[for='wpcf7-mc-answer']"),
                  stars        = wpcf7Form.querySelectorAll(".wpcf7-mc-field-star"),
                  hiddenFields = wpcf7Form.querySelectorAll(".wpcf7-mc-hf"),
                  digitFields  = wpcf7Form.querySelectorAll("input[name^='wpcf7-mc-d'], input[name='city']");

            stars.forEach(function(star) {
                star.style.cssText = "align-self: flex-start; margin-left: 0.333333rem;";
            });

            hiddenFields.forEach(function(field) {
                field.style.display = "none";
            });

            const digits = problem.textContent.match(/[0-9]+/g);

            digitFields.forEach(function(field, i) {
                const targetDigit = digits[i];

                // 3 seconds timeout because spambots fill in forms real fast and have probably already left the page by the time the value gets inserted in the DOM.
                setTimeout(function() {
                    if (!field.value) {
                        field.value = targetDigit;
                    }
                }, 3000);
            });
        },

        htmlCleaner: function(wpcf7El) {
            const wpcf7Form = wpcf7El.querySelector(".wpcf7-form"),
                  fields    = wpcf7Form.querySelectorAll(".field");

            fields.forEach(function(field) {
                const br = field.querySelector("br");

                if (br) {
                    br.parentNode.removeChild(br);
                }

                const controlWrap = field.querySelector(".wpcf7-form-control-wrap");

                if (controlWrap) {
                    const input = controlWrap.querySelector(".wpcf7-form-control");

                    controlWrap.parentNode.insertBefore(input, controlWrap);
                    controlWrap.parentNode.removeChild(controlWrap);

                    input.tagName === "TEXTAREA" ?
                        input.removeAttribute("cols") :
                        input.removeAttribute("size");
                }

                const ajaxLoader = field.querySelector(".ajax-loader");

                if (ajaxLoader) {
                    const spinner = document.createElement("span");

                    spinner.classList.add("spinner");

                    ajaxLoader.appendChild(spinner);
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
