import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Instagram from './views/Instagram';

export default function Routes() {
  return (
    <Router>
      <Route path="/instagram"               exact render={() => <Instagram.Post />} />
      <Route path="/instagram/post/snippet"  exact render={() => <Instagram.Post />} />
      <Route path="/instagram/post/article"  exact render={() => <Instagram.Post />} />
      <Route path="/opengraph/snippet"       exact render={() => <Instagram.Post />} />
      <Route path="/opengraph/article"       exact render={() => <Instagram.Post />} />
    </Router>
  );
}