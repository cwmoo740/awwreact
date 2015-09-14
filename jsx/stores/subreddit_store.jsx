var Fluxxor = require("fluxxor");
var actions = require("../actions.jsx");

var re = new RegExp(".com(?:/)([0-9A-Za-z]+)/?$");

var SubRedditStore = Fluxxor.createStore({
    initialize: function () {
        this.photos = {};
        this.image_keys = {};
        this.loaded = false;
        this.lastPosting = {};

        window.addEventListener('hashchange', function () {
            this.emit("change");
        }.bind(this));

        this.bindActions(
            actions.constants.SUBREDDIT.LOAD_SUCCESS, this.loadSubreddit,
            actions.constants.SUBREDDIT.LOAD_MORE_SUCCESS, this.loadMore,
            actions.constants.SUBREDDIT.IMAGES_LOADED, this.imagesDoneLoading
        );
    },
    loadSubreddit: function (payload) {
        var key = payload.subreddit;
        this.photos[key] = [];
        if (!payload.data) {
            this.loaded = true;
            this.emit("change");
            return;
        }
        payload.data.children.forEach(function (post) {
            if (post.data.domain === 'imgur.com') {
                var match = post.data.url.match(re);
                if (match !== null &&
                    !this.image_keys.hasOwnProperty(post.data.name) ) {
                    this.photos[key].push({
                            photo: match[1],
                            title: post.data.title,
                            id: post.data.name
                        });
                    this.image_keys[post.data.name] = true;
                }
            }
        }, this);
        this.lastPosting[key] = payload.data.children[payload.data.children.length-1].data.name;
        this.loaded = false;
        this.emit("change");
    },
    loadMore: function(payload) {
        var key = payload.subreddit;
        if (!payload.data) {
            this.loaded = true;
            this.emit("change");
            return;
        }
        payload.data.children.forEach(function (post) {
            if (post.data.domain === 'imgur.com') {
                var match = post.data.url.match(re);
                if (match !== null &&
                    !this.image_keys.hasOwnProperty(post.data.name)) {
                    this.photos[key].push({
                            photo: match[1],
                            title: post.data.title,
                            id: post.data.name
                        });
                    this.image_keys[post.data.name] = true;
                }
            }
        }, this);
        this.lastPosting[key] = payload.data.children[payload.data.children.length-1].data.name;
        this.loaded = false;
        this.emit("change");
    },
    getPhotos: function (subreddit) {
        if (this.photos.hasOwnProperty(subreddit)){
            return this.photos[subreddit];
        }
        else {
            return null;
        }
    },
    imagesDoneLoading: function () {
        this.loaded = true;
        this.emit("change");
    },
    imagesLoaded: function () {
        return this.loaded;
    },
    getLastPosting: function(subreddit) {
        return this.lastPosting[subreddit];
    }
});

module.exports = SubRedditStore;