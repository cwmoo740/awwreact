var reddit = require('./reddit.jsx');

var actions = {
    images: {
        imagesLoaded: function () {
            this.dispatch(constants.SUBREDDIT.IMAGES_LOADED);
        }
    },
    ajax: {
        getSubreddit: function (subreddit) {
            this.dispatch(constants.SUBREDDIT.LOAD);
            reddit.hot(subreddit).limit(25).fetch(function (result) {
                    this.dispatch(constants.SUBREDDIT.LOAD_SUCCESS,
                        {data: result.data, subreddit: subreddit}
                    );
                }.bind(this),
                function (error) {
                    this.dispatch(constants.SUBREDDIT.LOAD_FAIL);
                    console.log(error);
                }.bind(this));
        },
        loadMore: function (subreddit, after) {
            this.dispatch(constants.SUBREDDIT.LOAD_MORE);
            reddit.hot(subreddit).limit(10).after(after).fetch(function (result) {
                    this.dispatch(constants.SUBREDDIT.LOAD_MORE_SUCCESS,
                        {data: result.data, subreddit: subreddit}
                    );
                }.bind(this),
                function (error) {
                    console.log(error);
                }.bind(this));
        }
    }
};

var constants = {
    SUBREDDIT: {
        LOAD: "SUBREDDIT:LOAD",
        LOAD_SUCCESS: "SUBREDDIT:LOAD_SUCCESS",
        LOAD_FAIL: "SUBREDDIT:LOAD_FAIL",
        LOAD_MORE: "SUBREDDIT:LOAD_MORE",
        LOAD_MORE_SUCCESS: "SUBREDDIT:LOAD_MORE_SUCCESS",
        IMAGES_LOADED: "SUBREDDIT:IMAGES_LOADED"
    }
};

module.exports = {
    actions: actions,
    constants: constants
};