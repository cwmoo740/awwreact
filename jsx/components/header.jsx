var React = require("react");

var Header = React.createClass({
    render: function () {
        return (
            <div className="header">
                <p>Written by <a href="https://cwmoo740.github.io">cwmoo740</a></p>

                <p>Powered by</p>
                <a href="http://imgur.com">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Imgur_logo.svg"/>
                </a>
            </div>
        );
    }
});

module.exports = Header;