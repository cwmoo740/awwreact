var React = require("react");

var Imgur = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.string
    },
    render: function () {
        var format = '';
        if (window.screen.width < 500)
        {
            format = 'm';
        }
        else if (window.screen.width < 1000)
        {
            format = 'l';
        }
        return (
            <div className="imgur-tile">
                <a href={'//i.imgur.com/' + this.props.id + '.jpg'}
                   target="_blank" style={{targetNew: 'tab'}}>
                    <img src={'//i.imgur.com/' + this.props.id + format + '.jpg'}/>
                    {this.props.title ? <p>{this.props.title}</p> : null}
                </a>
            </div>
        );
    }
});

module.exports = Imgur;
