import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Instagram from './views/Instagram';
import Opengraph from './views/OpenGraph';
import internalLinks from './misc/internalLinks'

const HomeLinks = () => (
  <div>
    { internalLinks.map(link => <div><Link to={link.url}> { link.txt } </Link></div>) }
  </div>
);

export default function Routes() {
  return (
    <Router>
      <Route path="/"                        exact render={() => <HomeLinks              />} />
      <Route path="/instagram/post/snippet"  exact render={() => <Instagram.post.Snippet />} />
      <Route path="/instagram/post/article"  exact render={() => <Instagram.post.Article />} />
      <Route path="/opengraph/snippet"       exact render={() => <Opengraph.Snippet      />} />
      <Route path="/opengraph/article"       exact render={() => <Opengraph.Article      />} />
    </Router>
  );
}