import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Instagram from './views/Instagram';
import Opengraph from './views/OpenGraph';

export default function Routes() {
  return (
    <Router>
      <Route path="/instagram"               exact render={() => <Instagram.post.Snippet />} />
      <Route path="/instagram/post/snippet"  exact render={() => <Instagram.post.Snippet />} />
      <Route path="/instagram/post/article"  exact render={() => <Instagram.post.Snippet />} />
      <Route path="/opengraph/snippet"       exact render={() => <Opengraph.Snippet      />} />
      <Route path="/opengraph/article"       exact render={() => <Instagram.post.Snippet />} />
    </Router>
  );
}