var React = require("react");

var InfiniteScroll = React.createClass({
    getDefaultProps: function () {
        return {
            pageStart: 0,
            hasMore: false,
            loadMore: function () {},
            threshold: 250
        };
    },
    componentDidMount: function () {
        this.pageLoaded = this.props.pageStart;
        this.attachScrollListener();
    },
    componentDidUpdate: function () {
        this.attachScrollListener();
    },
    render: function () {
        var props = this.props;
        return React.DOM.div(null, props.children, props.hasMore && (props.loader || InfiniteScroll._defaultLoader));
    },
    scrollListener: function () {
        console.log(this.props.listHeight);
        if (this.props.listHeight - this.props.scrollPosition < Number(this.props.threshold)) {
            this.detachScrollListener();
            // call loadMore after detachScrollListener to allow
            // for non-async loadMore functions
            this.props.loadMore(this.pageLoaded += 1);
        }
    },
    attachScrollListener: function () {
        if (!this.props.hasMore) {
            return;
        }
        window.addEventListener('scroll', this.scrollListener);
        window.addEventListener('resize', this.scrollListener);
        this.scrollListener();
    },
    detachScrollListener: function () {
        window.removeEventListener('scroll', this.scrollListener);
        window.removeEventListener('resize', this.scrollListener);
    },
    componentWillUnmount: function () {
        this.detachScrollListener();
    }
});
InfiniteScroll.setDefaultLoader = function (loader) {
    InfiniteScroll._defaultLoader = loader;
};

module.exports = InfiniteScroll;