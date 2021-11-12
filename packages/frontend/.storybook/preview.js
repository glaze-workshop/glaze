export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: 'fullscreen',
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  }
}


// .storybook/preview.js

import React from "react";

import { Center, ChakraProvider } from '@chakra-ui/react';
import '../src/index.css'

export const decorators = [
  (Story) => (
    <ChakraProvider>
      <Center w="100vw" h="100vh" p="1em">
        <Story />
      </Center>
    </ChakraProvider>
  ),
];
