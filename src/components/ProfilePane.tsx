import * as React from 'react';
import { Profile } from '../models';
import ProfileItems from './ProfileItems';
import ProfileProbabilities from './ProfileProbabilities';
import ProfileRewards from './ProfileReward';

interface ProfilePaneProps {
    profile: Profile;
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
            <>
                <header>
                    <h1>
                        {name}: {description}
                    </h1>
                </header>
                <main className="container mx-auto p-4">
                    <ProfileModeSwitcher
                        currentMode={this.state.mode}
                        setMode={this._handleModeButton}
                    />
                    {this.state.mode === ProfilePaneMode.REWARD ? (
                        <ProfileRewards
                            objectives={this.props.profile.objectives}
                            items={this.props.profile.items}
                            quantityGenerator={
                                this.props.profile.quantityGenerator
                            }
                        />
                    ) : undefined}
                    {this.state.mode === ProfilePaneMode.PROBABILITIES ? (
                        <ProfileProbabilities items={items} />
                    ) : undefined}
                    {this.state.mode === ProfilePaneMode.ITEMS ? (
                        <ProfileItems items={items} />
                    ) : undefined}
                </main>
            </>
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
                    className="border px-4 bg-green-400 hover:bg-green-500 active:bg-green-500"
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

    return <nav className="inline-flex">{...buttons}</nav>;
};

export default ProfilePane;
