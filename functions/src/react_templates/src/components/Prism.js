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

    const urlParams = qs.parse(window.location.href.match(/\?.+/)[0].replace(/\?/, ''));
    const code      = urlParams.code;
    const lang      = urlParams.lang;
    this.setState({
      code: atob(code),
      lang
    }, () => Prism.highlightAll())
  }

  render() {
    return (
      <pre className="line-numbers language-markup">
        <code className={`language-${this.state.lang}`}>
          { this.state.code }
        </code>
      </pre>
    )
  }

}