import React         from 'react';
import Prism         from '../components/Prism';
import { Container, RandomBgImage } from '../styled/OpenGraph';

const Snippet = () => (
  <Container>
    <RandomBgImage>
      <Prism />
    </RandomBgImage>
  </Container>
);

export default {
  Snippet
}