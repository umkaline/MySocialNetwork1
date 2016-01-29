define([
    'Backbone',
    'Underscore',
    'models/user',
    'text!templates/login.html'
], function (Backbone, _, UserModel, loginTemplate) {
    var View = Backbone.View.extend({
        el      : "#content-holder",
        template: _.template(loginTemplate),

        events: {
            'click #loginBtn': 'login'
        },

        initialize: function (options) {
            this.render();
        },

        login: function (e) {
            e.preventDefault();
            var email = this.$el.find('#email').val();
            var password = this.$el.find('#password').val();
            var data = {
                email   : email,
                password: password
            };

            var user = new UserModel(data);
            user.urlRoot = '/login';
            user.save(null, {
                success: function (response, xhr) {

                    if (response.attributes.fail) {
                        alert(response.attributes.fail);
                        console.log(response.attributes.fail);
                    } else {
                        APP.authorised = true;
                        localStorage.setItem('loggedIn', 'true');

                        APP.myId = response.id;
                        localStorage.setItem('myId', APP.myId);

                        APP.me = response;

                        Backbone.history.navigate('myApp/main', {trigger: true});
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
