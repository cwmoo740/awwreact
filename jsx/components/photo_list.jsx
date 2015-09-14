var React = require("react"),
    Fluxxor = require("fluxxor"),
    $ = require("jquery");

var Masonry = require("masonry-layout");
var ImagesLoaded = require("imagesloaded");
var InfiniteScroll = require("react-infinite-scroll")(React);
var Imgur = require("./imgur.jsx");

var PhotoList = React.createClass({
    mixins: [
        Fluxxor.FluxMixin(React),
        Fluxxor.StoreWatchMixin("SubRedditStore")
    ],
    getStateFromFlux: function () {
        var subreddit = location.hash.substring(1);
        var photos = this.getFlux().store("SubRedditStore").getPhotos(subreddit);
        if (photos === null) {
            this.getFlux().actions.ajax.getSubreddit(subreddit);
        }
        return {
            subreddit: subreddit,
            photos: photos,
            lastPosting: this.getFlux().store("SubRedditStore").getLastPosting(subreddit),
            imagesLoaded: this.getFlux().store("SubRedditStore").imagesLoaded()
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
        this.ableToLoad = true;
    },
    handleScroll: function () {
        if ($(window).scrollTop() + $(window).height() + 800
            > document.body.scrollHeight) {
            this.loadMore();
        }
    },
    componentDidUpdate: function () {
        if (this.state.photos !== null && this.state.photos.length > 0 && this.state.imagesLoaded === false) {
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
        if (this.state.imagesLoaded === true && this.ableToLoad === true) {
            this.getFlux().actions.ajax.loadMore(
                this.state.subreddit,
                this.state.lastPosting
            );
        }
        this.ableToLoad = false;
        setTimeout(function () {
            this.ableToLoad = true;
        }.bind(this), 500);
    },
    render: function () {
        if (this.state.photos === null) {
            return (
                <p> Loading... </p>
            );
        }
        if (this.state.photos.length === 0) {
            return (
                <p> No content found... </p>
            );
        }
        return (
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
        );
    }
});

module.exports = PhotoList;