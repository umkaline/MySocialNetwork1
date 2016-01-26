define(['Backbone'], function (Backbone) {
    var Router = Backbone.Router.extend({
        routes: {
            'myApp/login': 'login',
            'myApp/register': 'register',
            'myApp/main': 'main',
            'myApp/home': 'home',
            'myApp/news': 'news',
            'myApp/chat': 'chat',
            'myApp/user/friends': 'friends',
            'myApp/user/searchFriends': 'searchFriends',
            '*any': 'default'
        },

        initialize: function () {
            //events chanel
            /*this.chanel = _.extend({}, Backbone.Events);
            this.listenTo(this.chanel, 'customEvent', function () {
                console.log('---- customEvent fired ----');
            })*/
        },

        login: function () {
            var self = this;
            APP.authorised = localStorage.getItem('loggedIn');

            if (APP.authorised) {
                Backbone.history.navigate('#myApp/main', {trigger: true});
            } else {
                require(['views/login'], function (LoginView) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }
                    self.view = new LoginView();
                });
            }
        },

        register: function () {
            var self = this;
            APP.authorised = localStorage.getItem('loggedIn');

            if (APP.authorised) {
                Backbone.history.navigate('#myApp/main', {trigger: true});
            } else {
                require(['views/register'], function (RegisterView) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }
                    self.view = new RegisterView();
                });
            }
        },

        main: function () {
            var self = this;
            APP.authorised = localStorage.getItem('loggedIn');

            if (!APP.authorised) {
                Backbone.history.navigate('#myApp/login', {trigger: true});
            } else if (APP.mainView) {
                Backbone.history.navigate('#myApp/home', {trigger: true});
            }
            else {
                require(['views/main'], function (MainView) {
                    APP.mainView = new MainView();
                });
            }
        },

        friends: function () {
            var self = this;
            APP.authorised = localStorage.getItem('loggedIn');

            if (!APP.authorised) {
                Backbone.history.navigate('#myApp/login', {trigger: true});
            } else if (!APP.mainView) {
                APP.next = Backbone.history.fragment;
                Backbone.history.navigate('#myApp/main', {trigger: true});
            } else {
                require(['views/friends'], function (FriendsView) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }
                    self.view = new FriendsView();
                });
            }
        },

        news: function () {
            var self = this;
            APP.authorised = localStorage.getItem('loggedIn');

            if (!APP.authorised) {
                Backbone.history.navigate('#myApp/login', {trigger: true});
            } else if (!APP.mainView) {
                APP.next = Backbone.history.fragment;
                Backbone.history.navigate('#myApp/main', {trigger: true});
            } else {
                require(['views/news'], function (NewsView) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }
                    self.view = new NewsView();
                });
            }
        },

        home: function () {
            var self = this;
            APP.authorised = localStorage.getItem('loggedIn');

            if (!APP.authorised) {
                Backbone.history.navigate('#myApp/login', {trigger: true});
            } else if (!APP.mainView) {
                APP.next = Backbone.history.fragment;
                Backbone.history.navigate('#myApp/main', {trigger: true});
            } else {
                require(['views/home'], function (SearchFriendsView) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }
                    self.view = new SearchFriendsView();
                });
            }
        },

        searchFriends: function () {
            var self = this;
            APP.authorised = localStorage.getItem('loggedIn');

            if (!APP.authorised) {
                Backbone.history.navigate('#myApp/login', {trigger: true});
            } else if (!APP.mainView) {
                APP.next = Backbone.history.fragment;
                Backbone.history.navigate('#myApp/main', {trigger: true});
            } else {
                require(['views/searchFriends'], function (SearchFriendsView) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }
                    self.view = new SearchFriendsView();
                });
            }
        },

        chat: function () {
            var self = this;
            APP.authorised = localStorage.getItem('loggedIn');

            if (!APP.authorised) {
                Backbone.history.navigate('#myApp/login', {trigger: true});
            } else if (!APP.mainView) {
                APP.next = Backbone.history.fragment;
                Backbone.history.navigate('#myApp/main', {trigger: true});
            } else {
                require(['views/chat'], function (SearchFriendsView) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }
                    self.view = new SearchFriendsView();
                });
            }
        },

        default: function () {
            APP.authorised = localStorage.getItem('loggedIn');
            Backbone.history.navigate('#myApp/main', {trigger: true});
        }
    });

    return Router;
});