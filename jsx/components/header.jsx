var React = require("react");

var Header = React.createClass({
    render: function () {
        return (
            <div className="header">
                <div>Written by <br/><a href="https://cwmoo740.github.io">cwmoo740</a></div>

                <div>Powered by</div>
                <a href="http://imgur.com">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Imgur_logo.svg"/>
                </a>
            </div>
        );
    }
});

module.exports = Header;