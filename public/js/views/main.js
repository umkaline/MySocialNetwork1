define([
    'Backbone',
    'Underscore',
    '../models/user',
    'views/menu',
    'views/home',
    'text!templates/main.html'
], function (Backbone, _, UserModel, MenuView, HomeView, mainTemplate) {
    var View = Backbone.View.extend({
        el: "#content-holder",
        template: _.template(mainTemplate),

        events: {
            'click #logoutBtn': 'logout',
            'click #searchFriendsBtn': 'searchFriends'
        },

        initialize: function (options) {
            this.render();

            if (!APP.next) {
                if (this.menuView) {
                    this.menuView.undelegateEvents()
                }
                this.menuView = new MenuView();

                if (this.homeView) {
                    this.homeView.undelegateEvents()
                }
                this.homeView = new HomeView();
            }

            setTimeout(function () {
                if (APP.io) {
                    APP.io.emit('hello', APP.me.get('_id'));

                    var io = APP.io;

                    io.on('message', function (message) {

                        APP.messagesUnreadFrom = APP.messagesUnreadFrom || [];
                        if (APP.messagesUnreadFrom.indexOf(message.sender._id) == -1) {
                            var $chatNotifyCount = $('#chatNotify');
                            var messCount = $chatNotifyCount.html();
                            $chatNotifyCount.html(++messCount);
                            APP.messagesUnreadFrom.push(message.sender._id);
                        }
                    });
                } else {
                    require(['/socket.io/socket.io.js'], function (ios) {
                        APP.io = APP.io || ios();
                        APP.io.emit('hello', APP.me.get('_id'));

                        var io = APP.io;

                        io.on('message', function (message) {

                            APP.messagesUnreadFrom = APP.messagesUnreadFrom || [];
                            if (APP.messagesUnreadFrom.indexOf(message.sender._id) == -1) {
                                var $chatNotifyCount = $('#chatNotify');
                                var messCount = $chatNotifyCount.html();
                                $chatNotifyCount.html(++messCount);
                                APP.messagesUnreadFrom.push(message.sender._id);
                            }

                        });
                    });
                }
            }, 2000);

        },

        logout: function (e) {
            e.preventDefault();

            var user = new UserModel();
            user.urlRoot = '/logout';
            user.save(null, {
                success: function (response, xhr) {
                    if (response.attributes.fail) {
                        alert(response.attributes.fail);
                        console.log(response.attributes.fail);
                    } else {
                        APP.authorised = false;
                        if (APP.mainView) {
                            APP.mainView.undelegateEvents();
                            delete APP.mainView;
                        }
                        if (APP.io) {
                            APP.io.disconnect();
                            delete APP.io;
                        }

                        delete APP.me;
                        localStorage.clear();
                        Backbone.history.navigate('myApp/login', {trigger: true});
                    }
                },
                error: function (err, xhr) {
                    alert('Some error');
                }
            });
        },

        searchFriends: function (e) {
            e.preventDefault();

            if (this.homeView) {
                this.homeView.undelegateEvents()
            }
            Backbone.history.navigate('myApp/user/searchFriends', {trigger: true});
        },

        render: function () {
            var self = this;
            this.$el.html(this.template());

            if (APP.next) {
                var next = APP.next;
                delete APP.next;
                Backbone.history.navigate(next, {trigger: true});
            }

            return this;
        }
    });

    return View;
});
