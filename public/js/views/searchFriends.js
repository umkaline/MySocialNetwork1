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
            var friends = self.collection;
            var newFriend = friends.get(e.target.id);
            var me = APP.me;
            var myFriends = me.get('friends') || [];

            myFriends.push({_id: newFriend.get('_id')});
            me.set('friends', myFriends);

            me.save(null, {});

            var myNewFriendFriends = newFriend.get('friends') || [];
            myNewFriendFriends.push({_id: me.get('_id')});
            newFriend.set('friends', myNewFriendFriends);

            newFriend.save(null, {
                success: function (response, xhr) {
                    self.collection.remove(newFriend);
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
