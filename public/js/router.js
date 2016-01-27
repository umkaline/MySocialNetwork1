define(['Backbone'], function (Backbone) {
    var Router = Backbone.Router.extend({
        routes: {
            'myApp/login': 'login',
            'myApp/register': 'register',
            'myApp/register/:registrationKey': 'registerConfirm',
            'myApp/recover': 'recover',
            'myApp/recover/:recoveryKey': 'recoverPass',
            'myApp/main': 'main',
            'myApp/home': 'home',
            'myApp/news': 'news',
            'myApp/chat': 'chat',
            'myApp/admin': 'admin',
            'myApp/admin/users': 'adminUsers',
            'myApp/admin/posts': 'adminPosts',
            'myApp/user/friends': 'friends',
            'myApp/user/searchFriends': 'searchFriends',
            '*any': 'default'
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

        registerConfirm: function(registrationKey) {
            var host = Backbone.history.location.origin + '/';
            var url = host + 'register/' + registrationKey;

            function success() {
                Backbone.history.navigate('#myApp/login', {trigger: true});
            }

            $.ajax({
                type: "POST",
                url: url,
                data: {},
                success: success
            });
        },

        recover: function () {
            var self = this;
            APP.authorised = localStorage.getItem('loggedIn');

            if (APP.authorised) {
                Backbone.history.navigate('#myApp/main', {trigger: true});
            } else {
                require(['views/recover'], function (RecoverView) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }
                    self.view = new RecoverView();
                });
            }
        },

        recoverPass: function (recoveryKey) {
            var self = this;
            APP.authorised = localStorage.getItem('loggedIn');

            if (APP.authorised) {
                Backbone.history.navigate('#myApp/main', {trigger: true});
            } else {
                require(['views/recoverPass'], function (RecoverPassView) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }
                    self.view = new RecoverPassView({recoveryKey: recoveryKey});
                });
            }
        },

        main: function () {
            var self = this;
            APP.authorised = localStorage.getItem('loggedIn');

            if (APP.mainAdminView) {
                APP.mainAdminView.undelegateEvents();
                delete APP.mainAdminView;
            }

            if (!APP.authorised) {
                Backbone.history.navigate('#myApp/login', {trigger: true});
            } else if (APP.mainView) {
                Backbone.history.navigate('#myApp/home', {trigger: true});
            } else {
                require(['views/main'], function (MainView) {
                    APP.mainView = new MainView();
                });
            }
        },

        admin: function () {
            var self = this;
            APP.authorised = localStorage.getItem('loggedIn');

            if (APP.mainView) {
                APP.mainView.undelegateEvents();
                delete APP.mainView;
            }



            if (!APP.authorised) {
                Backbone.history.navigate('#myApp/login', {trigger: true});
            } else if (APP.mainAdminView) {
                Backbone.history.navigate('#myApp/admin/users', {trigger: true});
            } else {
                require(['views/admin/main'], function (MainAdminView) {
                    APP.mainAdminView = new MainAdminView();
                });
            }
        },

        adminUsers: function () {
            var self = this;
            APP.authorised = localStorage.getItem('loggedIn');

            if (!APP.authorised) {
                Backbone.history.navigate('#myApp/login', {trigger: true});
            }  else if (!APP.mainAdminView) {
                Backbone.history.navigate('#myApp/admin', {trigger: true});
            } else {
                require(['views/admin/users'], function (AdminUsersView) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }
                    self.view = new AdminUsersView();
                });
            }
        },

        adminPosts: function () {
            var self = this;
            APP.authorised = localStorage.getItem('loggedIn');

            if (!APP.authorised) {
                Backbone.history.navigate('#myApp/login', {trigger: true});
            } else if (!APP.mainAdminView) {
                Backbone.history.navigate('#myApp/admin', {trigger: true});
            } else {
                require(['views/admin/posts'], function (AdminPostsView) {
                    if (self.view) {
                        self.view.undelegateEvents();
                    }
                    self.view = new AdminPostsView();
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