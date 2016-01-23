define([
    'Backbone',
    'Underscore',
    '../models/user',
    'views/menu',
    'views/home',
    'text!templates/main.html'
], function (Backbone, _, UserModel, MenuView, HomeView, mainTemplate) {
    var View = Backbone.View.extend({
        el      : "#content-holder",
        template: _.template(mainTemplate),

        events: {
            'click #logoutBtn': 'logout'
        },

        initialize: function (options) {
            this.render();
            if (this.menuView) {
                this.menuView.undelegateEvents()
            }
            this.menuView = new MenuView();

            if (this.homeView) {
                this.homeView.undelegateEvents()
            }
            this.homeView = new HomeView();
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
                        APP.mainView.undelegateEvents();
                        delete APP.mainView;
                        localStorage.clear();
                        Backbone.history.navigate('myApp/login', {trigger: true});
                    }
                },
                error  : function (err, xhr) {
                    alert('Some error');
                }
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
