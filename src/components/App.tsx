import * as React from 'react';
import { Profile } from '../models';
import { RollerWorkerApi } from './App.hooks';
import ProfilePane from './ProfilePane';

interface AppProps {
    profile: Profile;
}

export const RollerWorkerContext = React.createContext(new RollerWorkerApi());

class App extends React.Component<AppProps> {
    render() {
        const { profile } = this.props;
        return (
            <>
                <ProfilePane profile={profile} />
            </>
        );
    }
}

export default App;
