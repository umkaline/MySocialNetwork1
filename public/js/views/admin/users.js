define([
    'Backbone',
    'Underscore',
    'collections/user',
    'text!templates/admin/users.html',
], function (Backbone, _, UserCollection, usersTemplate) {
    var View = Backbone.View.extend({
        el: "#content",
        template: _.template(usersTemplate),

        events: {
            'click button.removeBtn': 'remove'
        },

        remove: function (e) {
            e.preventDefault();

            var id = e.target.id;
            var self = this;
            var user = self.collection.get(id);

            user.urlRoot = 'myApi/admin/users';

            user.destroy({
                success: function (response, xhr) {
                    self.render();
                },
                error: function (err, xhr) {
                    alert('Some error');
                }
            });
        },

        initialize: function (options) {
            var self = this;
            var users = new UserCollection();
            this.collection = users;

            users.url = 'myApi/admin/users';

            users.fetch({
                success: function (model) {
                    self.render();
                },
                error: function (err, xhr) {
                    alert('Some error');
                }
            });
        },


        render: function () {
            var self = this;
            var users = self.collection.toJSON();
            data = {
                users: users
            };
            this.$el.html(this.template(data));

            return this;
        }
    });

    return View;
});
