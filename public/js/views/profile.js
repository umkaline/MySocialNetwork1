define([
    'Backbone',
    'Underscore',
    '../models/user',
    'text!templates/profile.html',
    'text!templates/profileEdit.html'
], function (Backbone, _, UserModel, profileTemplate, profileEditTemplate) {
    var View = Backbone.View.extend({
        el: "#profile",
        template: _.template(profileTemplate),

        events: {
            'click #editBtn': 'edit',
            'click #cancelBtn': 'cancel',
            'click #saveBtn': 'save',
            'click #locateBtn': 'locate'
        },

        edit: function (e) {
            var self = this;
            e.preventDefault();
            self.template = _.template(profileEditTemplate);
            self.render();
        },

        cancel: function (e) {
            var self = this;
            e.preventDefault();
            self.template = _.template(profileTemplate);
            self.render();
        },

        save: function (e) {
            var self = this;
            e.preventDefault();

            var user = self.model;

            var email = this.$el.find('#email').val();
            var firstName = this.$el.find('#firstName').val();
            var lastName = this.$el.find('#lastName').val();
            var address = this.$el.find('#address').val();
            var loc = this.$el.find('#location').val();

            var location = loc.split(',');
            var dateOfBirth = this.$el.find('#dateOfBirth').val();
            var photo = this.$el.find('#photoURL').val();
            var password = this.$el.find('#password').val();

            var data = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                address: address,
                dateOfBirth: dateOfBirth,
                location: location,
                photo: photo,
                password: password
            };

            user.validate = function(attrs, options) {
                if (!(attrs.firstName && attrs.lastName && attrs.email && attrs.location && attrs.dateOfBirth)) {
                    alert("Required fields can't be empty")
                    return "Required fields can't be empty";
                }
            };

            user.save(data, {
                success: function (response, xhr) {
                    self.template = _.template(profileTemplate);
                    self.render();
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

        initialize: function (options) {
            var self = this;
            var user = new UserModel();
            this.model = user;
            user.fetch({
                success: function () {
                    var $friendsCounter = $('#friendsCount');
                    var $userNameLogo = $("#userName");
                    var friendsCount = user.get('friends').length;

                    APP.me = APP.me || user;
                    $friendsCounter.html(friendsCount);
                    $userNameLogo.html(user.get('firstName'));
                    self.render();
                },
                error: function (err, xhr) {
                    alert('Some error');
                }
            });
        },


        render: function () {
            var self = this;
            this.$el.html(this.template({user: self.model.attributes}));

            return this;
        }
    });

    return View;
});
