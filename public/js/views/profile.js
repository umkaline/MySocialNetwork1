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
            'click #saveBtn': 'save'
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
            var location = this.$el.find('#location').val();
            var dateOfBirth = this.$el.find('#dateOfBirth').val();
            var data = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                address: address,
                dateOfBirth: dateOfBirth,
                location: location
            };

            user.set('isNew', false);

            user.save(data, {
                success: function (response, xhr) {
                    alert(response.attributes.fail);
                    console.log(response.attributes.fail);
                    self.template = _.template(profileTemplate);
                    self.render();
                },
                error: function (err, xhr) {
                    alert('Some error');
                }
            });
        },

        initialize: function (options) {
            var self = this;
            var user = new UserModel();
            this.model = user;
            user.fetch({
                success: function () {
                    self.render();
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
