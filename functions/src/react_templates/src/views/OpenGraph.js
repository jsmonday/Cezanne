import React          from 'react';
import Prism          from '../components/Prism';
import AuthorBox      from '../components/AuthorBox';
import * as OpenGraph from '../styled/OpenGraph';
import * as Typo      from '../styled/Typography';
import * as Unicorn   from '../components/UnicornLogo';

import './OpenGraph.scss';

const Snippet = () => (
  <OpenGraph.Container>
    <OpenGraph.RandomBgImage randomBg={true} >
      <Prism />
    </OpenGraph.RandomBgImage>
  </OpenGraph.Container>
);

class Article extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      bgImage:   null,
      title:     null,
      author:    null,
      authorImg: null
    };
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const bgImage   = urlParams.get('bgImage');
    const title     = urlParams.get('title');
    const author    = urlParams.get('author');
    const role      = urlParams.get('role');
    const authorImg = urlParams.get('authorImg');

    this.setState({
      bgImage:   atob(bgImage),
      title:     atob(title),
      author:    atob(author),
      role:      atob(role),
      authorImg: atob(authorImg)
    });
  }

  render() {
    return (
      <OpenGraph.Container bgImage={this.state.bgImage}>
        <OpenGraph.Overlay className="flex-bottom">
          <div style={{zIndex: 1}}>
            <AuthorBox authorImg={this.state.authorImg} author={this.state.author} role={this.state.role} />
            <Typo.Title width="100%" fontSize="big">
              { this.state.title }
            </Typo.Title>
          </div>
        </OpenGraph.Overlay>
      </OpenGraph.Container>
    )
  }

}


export default {
  Snippet,
  Article
}