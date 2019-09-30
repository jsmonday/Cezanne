import React from 'react';
import Prism from 'prismjs';

import './Prism.scss';

export default class PrismCode extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      code: null,
      lang: null
    }
  }

  componentDidMount() {
    Prism.highlightAll()

    const urlParams = new URLSearchParams(window.location.search);
    const code     = urlParams.get('code');
    const language = urlParams.get('lang')

    this.setState({
      code: atob(code),
      language
    })
  }

  render() {
    return (
      <pre className="line-numbers">
        <code className={`language-${this.state.language}`}>
          { this.state.code }
        </code>
      </pre>
    )
  }

}