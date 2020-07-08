/**
 * Main JavaScript file.
 */
var hex90 = (function () {
    /**
     * Simplistic typing effect.
     *
     * @param {Number} i Beginning index of the element's text to type.
     * @param {Number} t Approximate typing speed (in milliseconds). Exact speed will be slightly randomized.
     * @param {string} ie The HTML ID attribute value for the element containing the text to type.
     * @param {string} oe The HTML ID attribute value of the output element.
     * @param {callable} cb Callback function to invoke when finished typing.
     * @param {Number} s Delay in milliseconds before next character will be typed. Used for recursive calls.
     *
     * @see https://stackoverflow.com/a/19913112
     */
    function type (i, t, ie, oe, cb, s) {
        var input = document.getElementById(ie).textContent;
        document.getElementById(oe).textContent += input.charAt(i);
        setTimeout(function () {
            var max = parseInt(t * 25);
            var min = parseInt(t * 0.1);
            var s   = parseInt(Math.random() * (max - min) + min);
            ( (i < input.length - 1) ? type(i+1, t, ie, oe, cb, s) : cb() );
        }, s);
    }

    /**
     * Shows the player response when the `type()` function is complete.
     */
    function showPlayerText (speed) {
        document.getElementById('player-text').style.display = 'flex';
        document.getElementById('flag').style.visibility = 'visible';
        type(0, speed, 'faith-prompt', 'player-prompt', function () {
            return document.getElementById('flag').focus();
        });
    }

    /**
     * Start the interaction.
     *
     * @param {Number} speed Faith typing speed in milliseconds. Lower is faster.
     */
    function play (speed) {
        type(0, speed, 'faith-text', 'faith-screen', function () {
            showPlayerText(speed);
        });
    }

    return {
        'play': function (speed) {
            play(speed);
        }
    }
})();
