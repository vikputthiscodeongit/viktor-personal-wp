import stylesheet from "../scss/style.scss";


(function() {
    // Generic helper functions
    // Convert seconds to milliseconds - https://stackoverflow.com/a/30546115/6396604, with rounding & a more efficient RegEx.
    function convertToMs(s) {
        return Math.round(parseFloat(s) * (/[0-9]s$/.test(s) ? 1000 : 1));
    }

    // Check if motion is allowed
    let motionAllowed = function motionAllowed() {
        return window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    };

    // Check if viewport width is above the "md" breakpoint
    let aboveBpWidthMd = function aboveBpWidthMd() {
        const aboveBpWidthMd = window.matchMedia("(min-width: " + stylesheet.bpWidthMd + ")");

        return aboveBpWidthMd.matches;
    }


    // <html> / <body> operations
    const html = document.querySelector("html");

    html.classList.remove("no-js");
    html.classList.add("js");

    document.body.addEventListener("mousedown", function(e) {
        document.body.classList.add("using-mouse");
    });

    document.body.addEventListener("keydown", function(e) {
        document.body.classList.remove("using-mouse");
    });
}());
