define([
    'Backbone',
    'router'
], function (Backbone, Router) {
    function init() {
        var router = new Router();

        APP.router = router || {};
        Backbone.history.start();
    }

    return {
        init: init
    }
});
