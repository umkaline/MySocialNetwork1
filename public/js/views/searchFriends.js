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
            var url = '/myApi/user/searchFriends/';

            url = url + options.radius;
            self.radius = options;
            self.collection = friends;

            friends.url = url;
            friends.fetch({
                success: function (collection) {
                    self.render();
                },
                error: function (err, xhr) {
                    self.render();
                    //alert('Some error');
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
                var $friendsCounter = $('#friendsCount');
                var friendsCount = $friendsCounter.html();

                $friendsCounter.html(++friendsCount);
                self.initialize(self.radius);
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
