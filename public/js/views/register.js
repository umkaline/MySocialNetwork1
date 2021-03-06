define([
    'Backbone',
    'Underscore',
    'models/user',
    'text!templates/register.html'
], function (Backbone, _, UserModel, registerTemplate) {
    var View = Backbone.View.extend({
        el: "#content-holder",
        template: _.template(registerTemplate),

        events: {
            'click #registerBtn': 'register',
            'click #locateBtn': 'locate'
        },

        initialize: function (friends) {
            this.friends = friends;
            this.render();
        },

        register: function (e) {
            e.preventDefault();

            var $required = this.$el.find('input[required="required"]').toArray();
            var empties = $required.some(function(el) {
                return el.value === '';
            });

            if(empties) {
                return alert("Please fill all required fields");
            }

            var email = this.$el.find('#email').val();
            var password = this.$el.find('#password').val();
            var firstName = this.$el.find('#firstName').val();
            var lastName = this.$el.find('#lastName').val();
            var address = this.$el.find('#address').val();
            var location = this.$el.find('#location').val().split(',');
            var dateOfBirth = this.$el.find('#dateOfBirth').val();
            var friends = this.friends;
            var data = {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                address: address,
                dateOfBirth: dateOfBirth,
                location: location,
                friends: friends
            };

            var user = new UserModel(data);
            user.urlRoot = '/register';
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

        locate: function (e) {
            e.preventDefault();

            $location = this.$el.find('#location');

            $.getJSON("http://ipinfo.io", function(ipinfo){
                $location.val(ipinfo.loc);
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
