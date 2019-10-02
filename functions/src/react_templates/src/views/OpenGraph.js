import qs             from 'qs';
import React          from 'react';
import Prism          from '../components/Prism';
import AuthorBox      from '../components/AuthorBox';
import * as OpenGraph from '../styled/OpenGraph';
import * as Typo      from '../styled/Typography';

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
    const urlParams = qs.parse(window.location.href.match(/\?.+/)[0].replace(/\?/, ''));

    const bgImage   = urlParams.bgImage;
    const title     = urlParams.title;
    const author    = urlParams.author;
    const role      = urlParams.role;
    const authorImg = urlParams.authorImg;

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