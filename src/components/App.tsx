import * as React from 'react';
import { Profile } from '../models';
import { RollerWorkerApi } from './App.hooks';
import ProfilePane from './ProfilePane';

interface AppProps {
    profile: Profile;
}

class App extends React.Component<AppProps> {
    private _rollWorker: RollerWorkerApi;

    constructor(props: AppProps) {
        super(props);

        this._rollWorker = new RollerWorkerApi();
        this.getRollWorker = this.getRollWorker.bind(this);
    }

    componentWillUnmount() {
        this._rollWorker.cleanup();
    }

    getRollWorker() {
        return this._rollWorker;
    }

    render() {
        const { profile } = this.props;
        return (
            <>
                <ProfilePane
                    profile={profile}
                    getRollWorker={this.getRollWorker}
                />
            </>
        );
    }
}

export default App;
