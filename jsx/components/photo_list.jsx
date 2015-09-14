var React = require("react"),
    Fluxxor = require("fluxxor"),
    $ = require("jquery");

var Masonry = require("masonry-layout");
var ImagesLoaded = require("imagesloaded");
var Imgur = require("./imgur.jsx");

var PhotoList = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
        Fluxxor.StoreWatchMixin("SubRedditStore")
    ],
    getStateFromFlux: function () {
        var subreddit = location.hash.substring(1);
        var photos = this.getFlux().store("SubRedditStore").getPhotos(subreddit);
        var subredditLoaded = this.getFlux().store("SubRedditStore").isSubredditLoaded();
        if (photos === null && subredditLoaded) {
            this.getFlux().actions.ajax.getSubreddit(subreddit);
        }

        return {
            subreddit: subreddit,
            photos: photos,
            lastPosting: this.getFlux().store("SubRedditStore").getLastPosting(subreddit),
            imagesLoaded: this.getFlux().store("SubRedditStore").imagesLoaded(),
            subredditLoaded: subredditLoaded
        };
    },
    getInitialState: function () {
        return {
            minIndex: 0,
            spacerHeight: 0
        };
    },
    componentDidMount: function () {
        window.addEventListener('scroll', this.handleScroll);
    },
    handleScroll: function () {
        if ($(window).scrollTop() + $(window).height() + 800
            > document.body.scrollHeight) {
            this.loadMore();
        }
    },
    componentDidUpdate: function () {
        if (this.state.photos !== null && this.state.photos.length > 0 && this.state.imagesLoaded === false) {
            console.log("waiting on images to load");
            ImagesLoaded(document.querySelector(".photo-list"), function (instance) {
                console.log("calling masonry!");
                var masonry = new Masonry('.photo-list', {
                    itemSelector: '.imgur-tile',
                    columnWidth: document.querySelector('.imgur-tile'),
                    percentPosition: true
                });
                this.getFlux().actions.images.imagesLoaded();
            }.bind(this));
        }
    },
    loadMore: function () {
        if (this.state.imagesLoaded === true && this.state.subredditLoaded === true) {
            this.getFlux().actions.ajax.loadMore(
                this.state.subreddit,
                this.state.lastPosting
            );
        }
    },
    render: function () {
        if (this.state.photos === null) {
            return (
                <p className="loading-text"> Loading... </p>
            );
        }
        else if (this.state.photos.length === 0) {
            return (
                <p className="loading-text"> No content found... </p>
            );
        }
        return (
            <div className="photo-list-wrapper">
                <div className="photo-list" ref="photo_list">
                    <div className="spacer"
                         style={{height: this.state.spacerHeight}}>
                    </div>
                    {this.state.photos.map(function (photo, index) {
                        if (index >= this.state.minIndex) {
                            return (

                                <Imgur
                                    key={photo.id}
                                    id={photo.photo}
                                    title={photo.title}
                                    onClick
                                    />
                            );
                        }
                    }, this)}
                </div>
                {this.state.photos !== null && this.state.photos.length > 0 && this.state.imagesLoaded === false ?
                    <p className="loading-text">Loading more...</p> : null}
            </div>
        );
    }
});

module.exports = PhotoList;