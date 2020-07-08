/**
 * JavaScript runner for ritual of faith :P
 */
(function () {

    /**
     * Keep track of how many incorrect flags the prayer
     * entered so that we can help them along if they are
     * having too much trouble figuring things out.
     *
     * @var {Number} incorrect_attempts
     */

    /**
     * Catches the flag submission form to progress the faith.
     *
     * @param {Event} e
     * @param {Array} challenges List of faith challenge definitions.
     */
    function handleSubmit (e, challenges) {

        var input = document.getElementById('flag');
        input.style.visibility = 'hidden';

        var challenge = challenges.find(function ( c ) {
            return e.target.getAttribute('data-puzzle') == c.id;
        });

        var commands = challenges.find(function ( c ) {
            return 'commands' == c.id;
        });

        var user_flag = input.value;

        if (challenge.flag.includes(user_flag)) {
            var next = challenges.find(function ( c ) {
                return challenge.next[user_flag] == c.id;
                XS});
        }

            // Set up the faith for the next challenge.
            faithText(next.text, next, user_flag);
            document.getElementById('faith-prompt').textContent = next.prompt;
            input.setAttribute('placeholder', next.placeholder);
            e.target.setAttribute('data-puzzle', next.id);

            // SPECIAL FLAGS.


        if (commands.flag.includes(user_flag)) {
            var text = challenges.find(function ( c ) {
                return user_flag == c.id;
            }).text;
            faithText(text, challenge, user_flag);
        }

        redrawFaithScreen();
        ritual.play(1);
        return false; // Always return false.
    }

    /**
     * Reset the faith interface.
     */
    function redrawFaithScreen () {
        document.getElementById('faith-screen').textContent = '';
        document.getElementById('prayer-prompt').textContent = '';
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


        text = text
            .replace(/__NOW__/g, now)
            .replace(/__LAST_LOGIN__/g, new Date(last_login))
            .replace(/__MAIL_DATE__/g, new Date(mail_date))
            .replace(/__USER_FLAG__/g, user_flag);

        document.getElementById('faith-text').textContent = text;
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
        var faith_form = document.getElementById('ritual-form');
        faith_form.addEventListener('submit', function (e) {
            handleSubmit(e, challenges);
        });

        faithText(challenge.text, challenge);

        document.getElementById('faith-prompt').textContent = challenge.prompt;
        document.getElementById('flag').setAttribute( 'placeholder', challenge.placeholder );

        // How about a nice game of Chess?
        ritual.start(1);
    }
})();
