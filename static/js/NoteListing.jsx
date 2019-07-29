const React      = require('react');
const $          = require('./sefaria/sefariaJquery');
const Sefaria    = require('./sefaria/sefaria');
const TextRange  = require('./TextRange');
const { AddToSourceSheetWindow } = require('./AddToSourceSheet');
const { Note } = require('./Misc');
const PropTypes  = require('prop-types');
import Component      from 'react-class';

class NoteListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSheetModal: false
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.showSheetModal && this.state.showSheetModal) {
      this.positionSheetModal();
    }
  }
  showSheetModal() {
    this.setState({showSheetModal: true});
  }
  hideSheetModal() {
    this.setState({showSheetModal: false});
  }
  positionSheetModal() {
    $(".addToSourceSheetModal").position({my: "center center-40", at: "center center", of: window});
  }
  deleteNote() {
    if (!confirm(Sefaria._("Are you sure you want to delete this note?"))) { return; }
    const resolve = this.props.onDeleteNote || (()=>{});
    Sefaria.deleteNote(this.props.data._id).then(resolve);
  }
  render() {
    var data = this.props.data;
    var url  = "/" + Sefaria.normRef(data.ref) + "?with=Notes";

    return (<div className="noteListing">
              <div className="actionButtons">
                <img src="/static/img/sheet.svg" onClick={this.showSheetModal} />
                <img src="/static/img/circled-x.svg" onClick={this.deleteNote} />
              </div>
              <a href={url}>
                {this.props.showText ?
                  <TextRange sref={data.ref} /> :
                  <span className="textRange placeholder">
                    <span className="title">
                      {data.ref}
                    </span>
                  </span> }
              </a>
              <Note text={data.text} />
              {this.state.showSheetModal ?
                <div>
                  <AddToSourceSheetWindow
                    srefs={[data.ref]}
                    note={data.text}
                    close={this.hideSheetModal} />
                  <div className="mask" onClick={this.hideSheetModal}></div>
                </div>
                : null }

            </div>);
  }
}
NoteListing.propTypes = {
  data:         PropTypes.object.isRequired,
  showText:     PropTypes.bool,
  onDeleteNote: PropTypes.func,
};
NoteListing.defaultProps = {
  showText: true
};

module.exports = NoteListing;
