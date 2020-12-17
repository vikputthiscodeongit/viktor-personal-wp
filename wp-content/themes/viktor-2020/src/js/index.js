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

            wpcf7.formTransformer(wpcf7El);

            wpcf7El.addEventListener("wpcf7invalid", function(e) {
                wpcf7.invalidInputScroller(e);
            });

            const wpcf7Form        = wpcf7El.querySelector(".wpcf7-form"),
                  submitButton     = wpcf7Form.querySelector("[type='submit']"),
                  submitButtonText = submitButton.querySelector(".btn__text");

            wpcf7El.addEventListener("wpcf7beforesubmit", function(e) {
                if (!submitButton.hasAttribute("data-string-send")) {
                    submitButton.setAttribute(
                        "data-string-send",
                        submitButtonText.textContent
                    );
                }
                submitButton.setAttribute("disabled", true);
                submitButton.classList.add("is-submitting");

                submitButtonText.textContent =
                    submitButton.getAttribute("data-string-sending");
            });

            wpcf7El.addEventListener("wpcf7submit", function(e) {
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
                submitButton.classList.remove("is-submitting");

                submitButtonText.textContent =
                    submitButton.getAttribute("data-string-send");
            });

            // Its <input>s
            const inputs = wpcf7Form.querySelectorAll(".form__input");

            inputs.forEach(function(input) {
                if (
                    input.classList.contains("wpcf7-validates-as-required") &&
                    // input.value isn't necessarily always empty on form initialization, Firefox for example retains <input> values when a page is refreshed.
                    input.value === ""
                ) {
                    wpcf7.setInvalidState(input);
                }

                input.addEventListener("input", function() {
                    Noty.closeAll();

                    wpcf7.inputValidator(input);
                });
            });
        },

        captcha: function(wpcf7El) {
            const wpcf7Form    = wpcf7El.querySelector(".wpcf7-form"),
                  problem      = wpcf7Form.querySelector("label[for='wpcf7-mc-answer']"),
                  hiddenFields = wpcf7Form.querySelectorAll(".wpcf7-mc-hf"),
                  digitInputs  = wpcf7Form.querySelectorAll(
                      "input[name^='wpcf7-mc-d'], input[name='city']"
                  );

            hiddenFields.forEach(function(field) {
                field.style.display = "none";
            });

            const digits = problem.textContent.match(/[0-9]+/g);

            digitInputs.forEach(function(input, i) {
                const targetDigit = digits[i];

                // 3 seconds timeout because spambots fill in forms real fast and have probably already left the page by the time the value gets inserted in the DOM.
                setTimeout(function() {
                    if (!input.value) {
                        input.value = targetDigit;
                    }
                }, 3000);
            });
        },

        formTransformer: function(wpcf7El) {
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
                    ajaxLoader.parentNode.removeChild(ajaxLoader);

                    const spinner = document.createElement("span");
                    spinner.className += ("btn__spinner spinner spinner--light");

                    const submitButton = wpcf7Form.querySelector("[type='submit']");

                    submitButton.appendChild(spinner);
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

        inputValidator: function(input) {
            const type = input.getAttribute("type");

            if (
                (type === "email" && isValidEmail(input.value)) ||
                (type !== "email" && input.value !== "")
            ) {
                wpcf7.unsetInvalidState(input);
            } else {
                wpcf7.setInvalidState(input);
            }
        },

        invalidInputScroller: function(e) {
            const invalidInputs     = e.detail.apiResponse.invalid_fields,
                  firstInvalidInput = document.getElementById(invalidInputs[0].idref);

            if (firstInvalidInput) {
                firstInvalidInput.scrollIntoView({
                    behavior: motionAllowed() ? "smooth" : "auto",
                    block: "start",
                    inline: "start"
                });
            }
        },

        setInvalidState: function(input) {
            input.parentElement.classList.remove("is-valid");

            input.setAttribute("aria-invalid", true);
            input.parentElement.classList.add("is-invalid");
        },

        unsetInvalidState: function(input) {
            input.setAttribute("aria-invalid", false);
            input.parentElement.classList.remove("is-invalid");

            input.parentElement.classList.add("is-valid");
        }
    };
}());
