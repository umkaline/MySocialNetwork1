define([
    'Backbone',
    'Underscore',
    'moment',
    'collections/user',
    'collections/chat',
    'models/chat',
    'text!templates/chat.html',
], function (Backbone, _, moment, UserCollection, ChatCollection, ChatModel, chatTemplate) {
    var View = Backbone.View.extend({
        el: "#content",
        template: _.template(chatTemplate),

        events: {
            'click #sendMsgBtn': 'sendMessage',
            'click a.chatWithBtn': 'switchChatTab',
            'keyup #message': 'keyUp'
        },

        keyUp: function(e) {
            if(event.keyCode == 13){
                $("#sendMsgBtn").click();
            }
        },

        switchChatTab: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var self = this;
            var tabNumber = e.target.id;
            var friends = self.collection;
            var prevFriend = friends.at(self.chatWith);
            var nextFriend = friends.at(tabNumber);

            self.chatWith = tabNumber;
            prevFriend.set('class', undefined);
            nextFriend.set('class', 'active');

            var chat = new ChatCollection();

            chat.url = chat.url + nextFriend.get('_id');
            chat.fetch({
                success: function (collection) {

                    APP.messagesUnreadFrom = APP.messagesUnreadFrom || [];
                    var id = APP.messagesUnreadFrom.indexOf(nextFriend.get('_id'));

                    if (id != -1) {
                        var $chatNotifyCount = $('#chatNotify');
                        var messCount = $chatNotifyCount.html();
                        $chatNotifyCount.html(--messCount);

                        APP.messagesUnreadFrom.splice(id, 1);
                    }


                    self.chat = collection.toJSON()[0].conversation;
                    self.render();
                },
                error: function (err, xhr) {
                    alert('Some error');
                }
            });
        },

        sendMessage: function (e) {
            e.preventDefault();

            var self = this;
            var chat = new ChatModel();
            var friend = self.collection.at(self.chatWith);
            var friendId = friend.get('_id');
            var myId = APP.me.get('_id');
            var $input = self.$el.find('#message');
            var message = $input.val();
            $input.val('');

            var participants = [myId, friendId];
            var conversation = {sender: {_id: myId}, text: message};
            var data = {
                participants: participants,
                conversation: conversation
            };

            self.model = self.model || new ChatModel();
            self.model.url = '/myApi/chat/' + friendId

            chat.save(data, {
                success: function (response, xhr) {
                    self.model.fetch({
                        success: function (conv) {
                            var coll = conv.attributes;
                            //coll = coll['0'];
                            self.chat = coll.conversation;
                            self.render();
                        },
                        error: function (err, xhr) {
                            alert('Some error');
                        }
                    });
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

            self.chatWith = 0;

            friends.url = 'myApi/user/friends';

            friends.fetch({
                success: function (collection) {
                    collection.at(self.chatWith).set('class', 'active');
                    var chat = new ChatCollection();

                    chat.url = chat.url + collection.at(self.chatWith).get('_id');
                    chat.fetch({
                        success: function (coll) {


                            APP.messagesUnreadFrom = APP.messagesUnreadFrom || [];
                            var id = APP.messagesUnreadFrom.indexOf(collection.at('0').get('_id'));

                            if (id != -1) {
                                var $chatNotifyCount = $('#chatNotify');
                                var messCount = $chatNotifyCount.html();
                                $chatNotifyCount.html(--messCount);

                                APP.messagesUnreadFrom.splice(id, 1);
                            }
                            self.chat = coll.toJSON()['0'].conversation;
                            self.render();
                        },
                        error: function (err, xhr) {
                            alert('Some error');
                        }
                    });
                },
                error: function (err, xhr) {
                    alert('Some error');
                }
            });

            if (APP.io) {
                APP.io.emit('hello', APP.me.get('_id'));

                var io = APP.io;

                io.on('message', function (message) {
                    var friendId = self.collection.at(self.chatWith).get('_id');
                    if (self.chat && Backbone.history.fragment == "myApp/chat" && message.sender._id === friendId) {
                        self.chat.push(message);
                        self.render();
                    }
                });
            } else {
                require(['/socket.io/socket.io.js'], function (ios) {
                    APP.io = APP.io || ios();
                    APP.io.emit('hello', APP.me.get('_id'));

                    var io = APP.io;

                    io.on('message', function (message) {
                        var friendId = self.collection.at(self.chatWith).get('_id');
                        if (self.chat && Backbone.history.fragment == "myApp/chat" && message.sender._id === friendId) {
                            self.chat.push(message);
                            self.render();
                        }
                    });
                });
            }
        },


        render: function () {
            var self = this;
            var chat = self.chat;
            var friends = self.collection;
            var friend = self.collection.at(self.chatWith);
            var friendId = friend.get('_id');
            var myId = APP.me.get('_id');
            friends = friends.toJSON();

            var data = {
                friends: friends,
                chat: chat,
                myId: myId,
                friendId: friendId,
                moment: moment
            };
            this.$el.html(this.template(data));


            APP.messagesUnreadFrom = APP.messagesUnreadFrom || [];
            var id = APP.messagesUnreadFrom.indexOf(friendId);

            if (id != -1) {
                var $chatNotifyCount = $('#chatNotify');
                var messCount = $chatNotifyCount.html();
                $chatNotifyCount.html(--messCount);

                APP.messagesUnreadFrom.splice(id, 1);
            }


            return this;
        }
    });

    return View;
});
