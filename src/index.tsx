import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import './styles.css';

import defaultConfig from './profiles/default.toml';
import { isProfile } from './models';

if (isProfile(defaultConfig)) {
    ReactDOM.render(
        <React.StrictMode>
            <App profile={defaultConfig} />
        </React.StrictMode>,
        document.getElementById('root')
    );
} else {
    console.error(
        'Default profile did not conform to `Profile` model!',
        defaultConfig
    );
}
