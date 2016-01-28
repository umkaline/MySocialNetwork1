define([
    'Backbone',
    'Underscore',
    'collections/user',
    'text!templates/friends.html',
], function (Backbone, _, UserCollection, friendsTemplate) {
    var View = Backbone.View.extend({
        el: "#content",
        template: _.template(friendsTemplate),

        events: {
            'click button.unFriendBtn': 'removeFriend'
        },

        removeFriend: function (e) {
            e.preventDefault();

            var self = this;
            var friendId = e.target.id;
            var origin = Backbone.history.location.origin;
            var url = origin + '/myApi/user/friend/' + friendId;

            $.ajax({
                type: "DELETE",
                url: url,
                data: {},
                success: success
            });

            function success(data, textStatus, jqXHR) {
                var $friendsCounter = $('#friendsCount');
                var friendsCount = $friendsCounter.html();

                $friendsCounter.html(--friendsCount);
                self.initialize();
            }
        },

        initialize: function (options) {
            var self = this;
            var friends = new UserCollection();
            this.collection = friends;

            friends.url = 'myApi/user/friends';

            friends.fetch({
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
            this.$el.html(this.template({friends: self.collection.toJSON()}));

            return this;
        }
    });

    return View;
});
