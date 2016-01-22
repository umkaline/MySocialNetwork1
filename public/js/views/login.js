define([
    'Backbone',
    'Underscore',
    'jQuery',
    '../models/user',
    'text!templates/user/login.html'
], function (Backbone, _, $, UserModel, loginTemplate) {
    var View = Backbone.View.extend({
        el      : '#content-holder',
        template: _.template(loginTemplate),

        events: {
            'click #loginBtn': 'login'
        },

        initialize: function (options) {
            this.render();
        },

        login: function (e) {
            e.preventDefault();
            var login = this.$el.find('#login').val();
            var password = this.$el.find('#password').val();
            var data = {
                login   : login,
                password: password
            };

            var user = new UserModel(data);
            user.urlRoot = '/login';
            user.save(null, {
                success: function (response, xhr) {
                    APP.authorised = true;
                    Backbone.history.navigate('myApp/user', {trigger: true});
                },
                error  : function (err, xhr) {
                    alert('Some error');
                }
            });
        },

        render: function () {
            var self = this;
            console.log(this.template());

            this.$el.html(this.template());

            this.$el.append('test');

            return this;
        }
    });

    return View;
});
