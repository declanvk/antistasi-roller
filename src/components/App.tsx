import * as React from 'react';
import { Profile } from '../models';
import { RollerWorkerApi } from './App.hooks';
import ProfilePane from './ProfilePane';

interface AppProps {
    profile: Profile;
}

class App extends React.Component<AppProps> {
    private _rollWorker: RollerWorkerApi;
    private _sessionLog: [Date, string][];

    constructor(props: AppProps) {
        super(props);

        this._rollWorker = new RollerWorkerApi();
        this.getRollWorker = this.getRollWorker.bind(this);
        this.addSessionLogLine = this.addSessionLogLine.bind(this);
        this._sessionLog = [];
    }

    componentWillUnmount() {
        this._rollWorker.cleanup();
    }

    getRollWorker() {
        return this._rollWorker;
    }

    addSessionLogLine(text: string) {
        this._sessionLog.push([new Date(), text]);
    }

    render() {
        const { profile } = this.props;
        return (
            <>
                <ProfilePane
                    profile={profile}
                    getRollWorker={this.getRollWorker}
                    addSessionLogLine={this.addSessionLogLine}
                />
            </>
        );
    }
}

const SessionLog: React.FC<{ sessionLog: [Date, string][] }> = ({ sessionLog }) => {
    return (<div>

    </div>);
};

export default App;
