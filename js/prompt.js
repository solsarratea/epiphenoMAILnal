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

    var transition = '\n\n -----------\n\s\s\s\s\s\s-------------------------\n\s\s\s\s-------------------->'

    var sample = '\n\n  Magical systems combine practical exercises for bringing about change with beliefs, attitudes, a conceptual model of the universe. '

    function handleSubmit (e, challenges) {
        e.preventDefault();

        var input = document.getElementById('flag');
        input.style.visibility = 'hidden';

        var challenge = challenges.find(function ( c ) {
            return e.target.getAttribute('data') == c.id;
        });

        var commands = challenges.find(function ( c ) {
            return 'commands' == c.id;
        });

        var user_input = input.value.split(' ');
        var user_flag = user_input[0];

        if (user_flag == 'caeser'){

            var text = challenges.find(function ( c ) {
                return user_flag == c.id;
            }).text;

            var amount = user_input[1];
            sample =  caesarShift(sample, amount);
            redrawFaithScreen();
            faithText(text + '\n\n With shift: '+ amount + sample + '\n\n', challenge, user_flag);


        }else if (commands.flag.includes(user_flag.split(' ')[0])) {
            challenge  = challenges.find(function ( c ) {
                return user_flag == c.id;
            });
            var text = challenge.text;
            redrawFaithScreen();
            faithText(text, challenge, user_flag);

        } else {
            redrawFaithScreen();
            faithText(challenge.retry_text, challenge, user_flag);
        }

        document.getElementById('flag').setAttribute( 'placeholder', challenge.placeholder );
        ritual.start(1);
        return false; // Always return false.
    }

    /**
     * Reset the faith interface.
     */
    function redrawFaithScreen () {
        document.getElementById('faith-screen').textContent = '';
        document.getElementById('prayer-prompt').textContent = '';
        document.getElementById('flag').value = '';
        document.getElementById('flag').placeholder = '';
    }

    /**
     * Prepare the faith text in the faith interface.
     *
     * @param {string} text
     * @param {Object} challenge
     * @param {string} user_flag
     */
    async function getText(path,onSuccess){
        fetch(path).then(function(response) {
            return response.text()
        })
        .then( (text) => onSuccess(text))
        .catch(function(error) {
            console.log("Failed!", error);
        })
    }


    function faithText (text, challenge, user_flag ) {
        let id = challenge.id,
            path = `public/episodes/${challenge.fileName}`;


        onSuccess = (text) => {
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


        };

        if (text == "") {
            getText(path, onSuccess);
        }else{
            onSuccess(text);
        }


    }

    fetch('public/story.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            init(json, 0);
        });

    /**
     * Initialize faithplay.
     ooddr*
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

            console.log(e);
            handleSubmit(e, challenges);
        });
        faith_form.setAttribute('data', challenge.id);

        faithText(challenge.text, challenge);

        document.getElementById('faith-prompt').textContent = challenge.prompt;
        document.getElementById('flag').setAttribute( 'placeholder', challenge.placeholder );

        ritual.start(1);
    }
})();
