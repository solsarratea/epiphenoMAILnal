/**
 * JavaScript trailer runner for Hex90 faith.
 */
(function () {

    /**
     * Keep track of how many incorrect flags the player
     * entered so that we can help them along if they are
     * having too much trouble figuring things out.
     *
     * @var {Number} incorrect_attempts
     */
    var incorrect_attempts = 0;

    /**
     * Catches the flag submission form to progress the faith.
     *
     * @param {Event} e
     * @param {Array} challenges List of faith challenge definitions.
     */
    function handleSubmit (e, challenges) {
        e.preventDefault(); // Do not reload.

        // Hide the player's input text field.
        var input = document.getElementById('flag');
        input.style.visibility = 'hidden';

        // Current challenge is the "puzzle."
        var challenge = challenges.find(function ( c ) {
            return e.target.getAttribute('data-puzzle') == c.id;
        });

        // Get the special "commands" challenge data.
        var commands = challenges.find(function ( c ) {
            return 'commands' == c.id;
        });

        // The player's entry is the "user flag."
        var user_flag = input.value;

        if (challenge.flag.includes(user_flag)) {
            var next = challenges.find(function ( c ) {
                return challenge.next[user_flag] == c.id;
            });

            // Set up the faith for the next challenge.
            faithText(next.text, next, user_flag);
            document.getElementById('faith-prompt').textContent = next.prompt;
            input.setAttribute('placeholder', next.placeholder);
            e.target.setAttribute('data-puzzle', next.id);

            // SPECIAL FLAGS.
            if ('curl -L https://hexninety.github.io/invitation.txt' === user_flag || 'curl https://hexninety.github.io/invitation.txt' === user_flag) {
                fetch('invitation.txt')
                    .then(function (response) {
                        return response.text();
                    })
                    .then(function (text) {
                        showInvite(text);
                    });
                return false; // Let the promise callback handle it.
            }
            if ('vlc https://hexninety.github.io/video.mp4' === user_flag) {
                var trailer = document.getElementById('trailer');
                trailer.style.display = 'block';
                trailer.querySelector('video').play()
                // Do not `return` here.
            }
            if ('links' === user_flag) {
                showShoppingLinks();
                document.getElementById('flag').value = '';
            }
            if ('links techlearningcollective.com' === user_flag) {
                window.location = 'https://techlearningcollective.com/';
            }

        } else if (commands.flag.includes(user_flag)) {
            var text = challenges.find(function ( c ) {
                return user_flag == c.id;
            }).text;
            faithText(text, challenge, user_flag);
        } else {
            incorrect_attempts++;
            // Offer tickets if the player is having trouble.
            if (3 < incorrect_attempts) {
                showShoppingLinks();
            }
            faithText(challenge.retry_text, challenge, user_flag);
        }

        redrawFaithScreen();
        hex90.play(1);
        return false; // Always return false.
    }

    /**
     * Display shopping links.
     */
    function showShoppingLinks () {
        var el = document.getElementById('artfully-event');
        document.getElementById('shopping-cart-controls').style.display = 'block';
        el.style.display = 'block';
        el.scrollIntoView(true);
    }

    /**
     * Reset the faith interface.
     */
    function redrawFaithScreen () {
        document.getElementById('faith-screen').textContent = '';
        document.getElementById('player-prompt').textContent = '';
        document.getElementById('flag').value = '';
    }

    /**
     * Prepare the faith text in the faith interface.
     *
     * @param {string} text
     * @param {Object} challenge
     * @param {string} user_flag
     */
    function faithText ( text, challenge, user_flag ) {
        var now = new Date();

        var last_login = new Date();
        last_login.setHours(now.getHours() - 2);
        last_login.setMinutes(now.getMinutes() - 27);

        var mail_date  = new Date();
        mail_date.setHours(now.getHours() - 1);
        mail_date.setMinutes(now.getMinutes() - 13);

        // Substitute special strings.
        text = text
            .replace(/__NOW__/g, now)
            .replace(/__LAST_LOGIN__/g, new Date(last_login))
            .replace(/__MAIL_DATE__/g, new Date(mail_date))
            .replace(/__USER_FLAG__/g, user_flag);

        document.getElementById('faith-text').textContent = text;
    }

    /**
     * Resets the faith interface with the invite text.
     *
     * @param {string} text
     */
    function showInvite (text) {
        redrawFaithScreen();
        document.getElementById('faith-text').textContent = text;
        hex90.play(1);
    }

    fetch('story.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            init(json, 0);
        });

    /**
     * Initialize faithplay.
     *
     * @param {Array} challenges List of challenge definitions.
     * @param {string} puzzle ID of the challenge to play.
     */
    function init ( challenges, puzzle ) {
        redrawFaithScreen();
        // Get the challenge data.
        var x = challenges.findIndex(function ( c ) {
            return puzzle == c.id;
        });
        var challenge = challenges[x];

        // Initialize the faith interface.
        var faith_form = document.getElementById('hex90-form');
        faith_form.addEventListener('submit', function (e) {
            handleSubmit(e, challenges);
        });
        faith_form.setAttribute('data-puzzle', challenge.id);

        faithText(challenge.text, challenge);

        document.getElementById('faith-prompt').textContent = challenge.prompt;
        document.getElementById('flag').setAttribute( 'placeholder', challenge.placeholder );

        // How about a nice game of Chess?
        hex90.play(1);
    }
})();
