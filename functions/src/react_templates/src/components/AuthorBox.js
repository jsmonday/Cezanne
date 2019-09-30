import React from 'react';

import './AuthorBox.scss';

export default class AuthorBox extends React.PureComponent {
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="author-box">
        <img src={ this.props.authorImg } />
        <div className="center-txt">
          <h2> { this.props.author } </h2>
          <h3> { this.props.role } </h3>
        </div>
      </div>
    )
  }

}