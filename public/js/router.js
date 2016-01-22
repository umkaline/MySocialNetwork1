define(['Backbone'], function (Backbone) {
    var Router = Backbone.Router.extend({
        routes: {
            'myApp/login'       : 'login',
            'myApp/:contentType': 'goTo',
            '*any'              : 'default'
        },

        initialize: function () {
            //events chanel
            this.chanel = _.extend({}, Backbone.Events);
            this.listenTo(this.chanel, 'customEvent', function () {
                console.log('---- customEvent fired ----');
            })
        },

        login: function () {
            var self = this;

            if (APP.authorised) {
                Backbone.history.navigate('myApp/users', {trigger: true});
            } else {
                require(['views/login'], function (LoginView) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }
                    self.view = new LoginView();
                });
            }
        },

        goTo: function (contentType) {
            var self = this;
            var viewUrl = 'views/' + contentType + '/' + contentType;
            var collectionUrl = 'collections/' + contentType;

            console.log(contentType);

            require([collectionUrl, viewUrl], function (Collection, View) {
                var startTime = new Date();
                var collection = new Collection();

                collection.on('reset', buildView, self);

                function buildView() {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }

                    self.view = new View({
                        chanel    : this.chanel,
                        collection: collection,
                        startTime : startTime
                    });
                    /* self.changeView(view);*/
                };
            });
        },

        default: function () {
            Backbone.history.navigate('#myApp/login', {trigger: true});
        }
    });

    return Router;
});