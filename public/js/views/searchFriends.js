define([
    'Backbone',
    'Underscore',
    'collections/user',
    'text!templates/searchFriends.html',
], function (Backbone, _, UserCollection, searchFriendsTemplate) {
    var View = Backbone.View.extend({
        el: "#content",
        template: _.template(searchFriendsTemplate),

        events: {
            'click button.friendBtn': 'addFriend'
        },

        initialize: function (options) {
            var self = this;
            var friends = new UserCollection();
            this.collection = friends;
            friends.url = '/myApi/user/searchFriends';
            friends.fetch({
                success: function () {
                    self.render();
                },
                error: function (err, xhr) {
                    alert('Some error');
                }
            });
        },

        addFriend: function (e) {
            e.preventDefault();

            var self = this;
            var friendId = e.target.id;
            var origin = Backbone.history.location.origin;
            var url = origin + '/myApi/user/newFriend/' + friendId;

            $.ajax({
                type: "PUT",
                url: url,
                data: {},
                success: success
            });

            function success(data, textStatus, jqXHR) {
                self.initialize();
            }
        },

        render: function () {
            var self = this;
            this.$el.html(this.template({friends: self.collection.toJSON()}));

            return this;
        }
    });

    return View;
});
