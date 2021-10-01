import * as React from 'react';
import { Profile } from '../models';
import { RollerWorkerApi } from './App.hooks';
import ProfileItems from './ProfileItems';
import ProfileProbabilities from './ProfileProbabilities';
import ProfileRewards from './ProfileRewards';

interface ProfilePaneProps {
    profile: Profile;
    getRollWorker: () => RollerWorkerApi;
}

enum ProfilePaneMode {
    REWARD = 'Reward',
    ITEMS = 'Items',
    PROBABILITIES = 'Probabilities'
}

interface ProfilePaneState {
    mode: ProfilePaneMode;
}

class ProfilePane extends React.Component<ProfilePaneProps, ProfilePaneState> {
    constructor(props: ProfilePaneProps) {
        super(props);
        this.state = { mode: ProfilePaneMode.REWARD };
        this._handleModeButton = this._handleModeButton.bind(this);
    }

    _handleModeButton(newMode: ProfilePaneMode) {
        this.setState({ mode: newMode });
    }

    render() {
        const { name, description, items } = this.props.profile;
        return (
            <div className="container mx-auto p-4">
                <h1>{name}</h1>
                <h2>{description}</h2>
                <ProfileModeSwitcher
                    currentMode={this.state.mode}
                    setMode={this._handleModeButton}
                />
                {this.state.mode === ProfilePaneMode.REWARD ? (
                    <ProfileRewards />
                ) : undefined}
                {this.state.mode === ProfilePaneMode.PROBABILITIES ? (
                    <ProfileProbabilities
                        items={items}
                        getRollWorker={this.props.getRollWorker}
                    />
                ) : undefined}
                {this.state.mode === ProfilePaneMode.ITEMS ? (
                    <ProfileItems items={items} />
                ) : undefined}
            </div>
        );
    }
}

const ProfileModeSwitcher = ({
    currentMode,
    setMode
}: {
    currentMode: ProfilePaneMode;
    setMode: (newMode: ProfilePaneMode) => void;
}) => {
    const buttons = Object.entries(ProfilePaneMode).map(
        ([modeKey, modeValue]) => {
            const isDisabled = modeValue === currentMode;
            return (
                <button
                    className="border px-4"
                    disabled={isDisabled}
                    onClick={() => {
                        setMode(modeValue as ProfilePaneMode);
                    }}
                    key={modeKey}
                >
                    {modeKey}
                </button>
            );
        }
    );

    return <div className="inline-flex">{...buttons}</div>;
};

export default ProfilePane;
