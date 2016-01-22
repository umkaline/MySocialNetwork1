define(['Backbone'], function(Backbone){
    var View = Backbone.View.extend({
        tagName: 'ul',
        initialize: function(options){
            //this.render();
            console.log('Initialize method');
        },

        render: function(){
            console.log('Render method');
            this.$el.html('<a href="https://google.com">Click Me</a>');

            return this;
        }
    });

    return View;
});
