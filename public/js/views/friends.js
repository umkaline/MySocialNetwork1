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
            var friends = self.collection;
            var removedFriend = friends.get(e.target.id);
            var me = APP.me;
            var myFriends = me.get('friends');
            var i = myFriends.indexOf(removedFriend);

            myFriends.splice(i, 1);
            me.set('friends', myFriends);

            me.save(null, {});

            var myRemovedFriendFriends = removedFriend.get('friends');
            i = myRemovedFriendFriends.indexOf(me);
            myRemovedFriendFriends.splice(i, 1);
            removedFriend.set('friends', myRemovedFriendFriends);

            removedFriend.save(null, {
                success: function (response, xhr) {
                    self.collection.remove(removedFriend);
                    self.render();
                },
                error: function (err, xhr) {
                    alert('Some error');
                }
            });
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
