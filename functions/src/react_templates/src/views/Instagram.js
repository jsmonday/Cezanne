import React      from 'react';
import Instagram  from '../styled/Instagram';
import Browser    from '../styled/Browser';
import Prism      from '../components/Prism';

const Post = () => (
  <Instagram.Post>
    <Instagram.InnerPost>
      <Browser.Window>
        <Prism />
      </Browser.Window>
    </Instagram.InnerPost>
  </Instagram.Post>
);

export default {
  Post
}