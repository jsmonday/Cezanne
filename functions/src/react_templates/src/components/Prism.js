import React from 'react';
import Prism from 'prismjs';

import './Prism.scss';

const code = `const isNumber = (str) => /\d/g.test(str);

// Is equivalent to

function isNumber(str) {
  const re = new RegExp("\\d", "g");
  return re.test(str);
};
`;

export default class PrismCode extends React.PureComponent {

  componentDidMount() {
    Prism.highlightAll()
  }

  render() {
    return (
      <pre className="line-numbers">
        <code className="language-js">
          {code}
        </code>
      </pre>
    )
  }

}