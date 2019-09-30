import React from 'react';
import { createBrowserHistory } from 'history';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import Instagram from './views/Instagram';
import Opengraph from './views/OpenGraph';
import internalLinks from './misc/internalLinks'

const history = createBrowserHistory();

const HomeLinks = () => (
  <div>
    { internalLinks.map(link => <div key={link.txt}><Link to={link.url}> { link.txt } </Link></div>) }
  </div>
);

export default function Routes() {
  return (
    <Router history={history}>
      <Route path="/instagram/post/snippet"  exact render={() => <Instagram.post.Snippet />} />
      <Route path="/instagram/post/article"  exact render={() => <Instagram.post.Article />} />
      <Route path="/opengraph/snippet"       exact render={() => <Opengraph.Snippet      />} />
      <Route path="/opengraph/article"       exact render={() => <Opengraph.Article      />} />
      <Route                                       render={() => <HomeLinks              />} />
    </Router>
  );
}