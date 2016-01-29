define([
    'Backbone',
    'Underscore',
    'models/user',
    'views/menu',
    'views/home',
    'text!templates/main.html'
], function (Backbone, _, UserModel, MenuView, HomeView, mainTemplate) {
    var View = Backbone.View.extend({
        el: "#content-holder",
        template: _.template(mainTemplate),

        events: {
            'click #logoutBtn': 'logout',
            'click #searchFriendsBtn': 'searchFriends',
            'click #inviteBtn': 'inviteFriend'
        },

        initialize: function (options) {
            var next = APP.next;

            this.render();

            if (this.menuView) {
                this.menuView.undelegateEvents()
            }
            this.menuView = new MenuView();

            if (next) {
                if (this.homeView) {
                    this.homeView.undelegateEvents()
                }
                this.homeView = new HomeView();
            } else {
                delete APP.next;
                Backbone.history.navigate(next, {trigger: true});
            }

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
            Backbone.history.fragment = '';
            Backbone.history.navigate('myApp/user/searchFriends', {trigger: true});
        },

        inviteFriend: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $friendEmail = $('#friendEmail');
            var friendEmail = $friendEmail.val();

            var host = Backbone.history.location.origin + '/';
            var url = host + 'myApi/user/invite/' + friendEmail;

            function success() {
                alert('Invitation sent');
                $friendEmail.val('');
            }

            $.ajax({
                type: "GET",
                url: url,
                data: {},
                success: success
            });
        },

        render: function () {
            var self = this;
            this.$el.html(this.template());

            return this;
        }
    });

    return View;
});
