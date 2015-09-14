var React = require('react'),
    Fluxxor = require("fluxxor");

var actions = require("./actions.jsx"),
    SubRedditStore = require("./stores/subreddit_store.jsx");

var PhotoList = require("./components/photo_list.jsx");
var Header = require("./components/header.jsx");

var stores = {
    SubRedditStore: new SubRedditStore()
};

var flux = new Fluxxor.Flux(stores, actions.actions);
flux.on("dispatch", function (type, payload) {
    console.log("Dispatch:", type, payload);
});

if (location.hash === '') {
    location.hash = 'aww';
}

React.render((
    <div className="page-wrapper">
        <Header />
        <PhotoList flux={flux} />
    </div>
), document.body);