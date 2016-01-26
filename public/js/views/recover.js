define([
    'Backbone',
    'Underscore',
    'models/user',
    'text!templates/recover.html'
], function (Backbone, _, UserModel, recoverTemplate) {
    var View = Backbone.View.extend({
        el: "#content-holder",
        template: _.template(recoverTemplate),

        events: {
            'click #recoverBtn': 'recover'
        },

        initialize: function (options) {
            this.render();
        },

        recover: function (e) {
            e.preventDefault();

            var $required = this.$el.find('#email');
            var email = $required.val();

            if(!email) {
                return alert("Please enter email");
            }


            var data = {
                email: email
            };

            var user = new UserModel(data);
            user.urlRoot = '/recover';
            user.save(null, {
                success: function (response, xhr) {
                    if (response.attributes.fail) {
                        alert(response.attributes.fail);
                        console.log(response.attributes.fail);
                    } else {
                        Backbone.history.navigate('myApp/login', {trigger: true});
                    }
                },
                error: function (err, xhr) {
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
