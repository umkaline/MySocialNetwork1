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
                APP.io.emit('hello', APP.me.get('_id'));

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
            } else {
                require(['/socket.io/socket.io.js'], function (ios) {
                    APP.io = APP.io || ios();
                    APP.io.emit('hello', APP.me.get('_id'));

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
