var React = require("react");

var Imgur = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        title: React.PropTypes.string
    },
    render: function () {
        return (
            <div className="imgur-tile">
                <a href={'//i.imgur.com/' + this.props.id + '.jpg'}
                   target="_blank" style={{targetNew: 'tab'}}>
                    <img src={'//i.imgur.com/' + this.props.id + '.jpg'}/>
                    {this.props.title ? <p>{this.props.title}</p> : null}
                </a>
            </div>
        );
    }
});

module.exports = Imgur;
