import React from 'react';
import Prism from 'prismjs';
import qs    from 'qs';

import '../misc/prism.css';
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

    const urlParams = qs.parse(window.location.href.match(/\?.+/)[0].replace(/\?/, ''));
    const code      = urlParams.code;
    const lang      = urlParams.lang.toLowerCase();

    this.setState({
      code: atob(code),
      lang
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