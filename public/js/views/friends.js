define([
    'Backbone',
    'Underscore',
    'collections/user',
    'text!templates/friends.html',
], function (Backbone, _, UserCollection, friendsTemplate) {
    var View = Backbone.View.extend({
        el: "#content",
        template: _.template(friendsTemplate),

        initialize: function (options) {
            var self = this;
            var friends = new UserCollection();
            this.collection = friends;
            friends.fetch({
                success: function () {
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
