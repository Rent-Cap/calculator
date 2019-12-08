import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import initStore from './src/initStore';
import i18n from './src/i18n';

const store = initStore();

// eslint-disable-next-line
export const wrapRootElement = ({ element }) => (
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      {element}
    </I18nextProvider>
  </Provider>
);
