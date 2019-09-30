import React        from 'react';
import Instagram    from '../styled/Instagram';
import Browser      from '../styled/Browser';
import * as Typo    from '../styled/Typography';
import Prism        from '../components/Prism';
import * as Unicorn from '../components/UnicornLogo'

import './Instagram.scss'

const Snippet = () => (
  <Instagram.Post>
    <Instagram.InnerPost randomBg={true}>
      <Browser.Window>
        <Prism />
      </Browser.Window>
    </Instagram.InnerPost>
  </Instagram.Post>
);

class Article extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      bgImage:  null,
      title:    null
    };
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const bgImage   = urlParams.get('bgImage');
    const title     = urlParams.get('title')

    this.setState({
      bgImage: atob(bgImage),
      title:   atob(title)
    });
  }

  render() {
    return (
      <Instagram.Post>
        <Instagram.InnerPost bgImage={this.state.bgImage} className="flex-bottom">
          <div style={{zIndex: 1}}>
            <Unicorn.White />
            <Typo.Title>
              { this.state.title }
            </Typo.Title>
          </div>
        </Instagram.InnerPost>
      </Instagram.Post>
    )
  }

}

export default {
  post: {
    Snippet,
    Article
  }
}