define([
    'Backbone',
    'Underscore',
    '../models/user',
    'text!templates/menu.html'
], function (Backbone, _, UserModel, menuTemplate) {
    var View = Backbone.View.extend({
        el      : "#menu",
        template: _.template(menuTemplate),

        initialize: function (options) {

            this.render();

            if (APP.io) {

                var io = APP.io;

                io.on('message', function (message) {

                    APP.messagesUnreadFrom = APP.messagesUnreadFrom || [];
                    if (APP.messagesUnreadFrom.indexOf(message.sender._id) == -1) {
                        var $chatNotifyCount = $('#chatNotify');
                        var messCount = $chatNotifyCount.html();
                        $chatNotifyCount.html(++messCount);
                        APP.messagesUnreadFrom.push(message.sender._id);
                    }
                });

                APP.io.emit('hello', APP.myId);

            } else {
                require(['/socket.io/socket.io.js'], function (ios) {
                    APP.io = APP.io || ios();

                    var io = APP.io;

                    io.on('message', function (message) {

                        APP.messagesUnreadFrom = APP.messagesUnreadFrom || [];
                        if (APP.messagesUnreadFrom.indexOf(message.sender._id) == -1) {
                            var $chatNotifyCount = $('#chatNotify');
                            var messCount = $chatNotifyCount.html();
                            $chatNotifyCount.html(++messCount);
                            APP.messagesUnreadFrom.push(message.sender._id);
                        }

                    });

                    APP.io.emit('hello', APP.myId);
                });
            }
        },

        render: function () {
            var self = this;
            this.$el.html(this.template());

            return this;
        }
    });

    return View;
});
