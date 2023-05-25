(function () {
    if (window.location.href == 'https://www-dev.i-goddard.com/app/site-editor/edit-summer-camp') {
        return;
    } else {
        var walkme = document.createElement('script');
        walkme.type = 'text/javascript';
        walkme.async = true;
        walkme.src = 'https://cdn.walkme.com/users/f104af9062164b309934aaefd9549c61/test/walkme_f104af9062164b309934aaefd9549c61_https.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(walkme, s);
        window._walkmeConfig = { smartLoad: true };
    }
    })();
