var APP = APP || {};

require.config({
    paths: {
        jQuery     : './libs/jquery/dist/jquery',
        Underscore : './libs/underscore/underscore',
        Bootstrap : './libs/bootstrap/dist/js/bootstrap.min',
        Backbone   : './libs/backbone/backbone',
        text       : './libs/text/text',
        models     : './models',
        collections: './collections',
        views      : './views',
        templates  : '../templates',
        moment     : './libs/moment/moment'
    },
    shim : {
        Underscore: {
            exports: '_'
        },
        'Bootstrap': ['jQuery'],
        'Backbone': ['Underscore', 'jQuery'],
        'app'     : ['Backbone', 'Bootstrap']
    }
});

require(['app'], function (app) {
    app.init();
});