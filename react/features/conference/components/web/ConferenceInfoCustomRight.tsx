/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { IReduxState, IStore } from '../../../app/types';
import { JitsiRecordingConstants } from '../../../base/lib-jitsi-meet';
import E2EELabel from '../../../e2ee/components/E2EELabel';
import HighlightButton from '../../../recording/components/Recording/web/HighlightButton';
import RecordingLabelCustom from '../../../recording/components/web/RecordingLabelCustom';
import { showToolbox } from '../../../toolbox/actions.web';
import { isToolboxVisible } from '../../../toolbox/functions.web';
import VideoQualityLabel from '../../../video-quality/components/VideoQualityLabel.web';
import VisitorsCountLabel from '../../../visitors/components/web/VisitorsCountLabel';
import ConferenceTimer from '../ConferenceTimer';
import { getConferenceInfo } from '../functions.web';

import ConferenceInfoContainer from './ConferenceInfoContainer';
import InsecureRoomNameLabel from './InsecureRoomNameLabel';
import RaisedHandsCountLabel from './RaisedHandsCountLabel';
import SpeakerStatsLabel from './SpeakerStatsLabel';
import SubjectText from './SubjectText';
import ToggleTopPanelLabel from './ToggleTopPanelLabel';
import ConferenceTimerCustom from '../ConferenceTimerCustom';
import ParticipantsCounter from '../../../participants-pane/components/web/ParticipantsCounter';
import SpeakerStatsLabelCustom from './SpeakerStatsLabelCustom';

/**
 * The type of the React {@code Component} props of {@link Subject}.
 */
interface IProps {

    /**
     * The conference info labels to be shown in the conference header.
     */
    _conferenceInfo: {
        alwaysVisible?: string[];
        autoHide?: string[];
    };

    /**
     * Indicates whether the component should be visible or not.
     */
    _visible: boolean;

    /**
     * Invoked to active other features of the app.
     */
    dispatch: IStore['dispatch'];
}

const COMPONENTS: Array<{
    Component: React.ComponentType<any>;
    id: string;
}> = [

    // {
    //     Component: VisitorsCountLabel,
    //     id: 'invite-people'
    // },
    {
        Component: SpeakerStatsLabelCustom,
        id: 'participants-count'
    },

    // {
    //     Component: ScreenShare,
    //     id: 'screen-share'
    // },
    // {
    //     Component: ToggleTopPanelLabel,
    //     id: 'toogle-tile-view'
    // }
];
/**
 * The upper band of the meeing containing the conference name, timer and labels.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$None}
 */
class ConferenceInfoCustomRight extends Component<IProps> {
    /**
     * Initializes a new {@code ConferenceInfo} instance.
     *
     * @param {IProps} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: IProps) {
        super(props);

        this._renderAutoHide = this._renderAutoHide.bind(this);
        this._renderAlwaysVisible = this._renderAlwaysVisible.bind(this);
        this._onTabIn = this._onTabIn.bind(this);
    }

    /**
     * Callback invoked when the component is focused to show the conference
     * info if necessary.
     *
     * @returns {void}
     */
    _onTabIn() {
        if (this.props._conferenceInfo.autoHide?.length && !this.props._visible) {
            this.props.dispatch(showToolbox());
        }
    }

    /**
     * Renders auto-hidden info header labels.
     *
     * @returns {void}
     */
    _renderAutoHide() {
        const { autoHide } = this.props._conferenceInfo;

        if (!autoHide?.length) {
            return null;
        }

        return (
            <>
                {
                    COMPONENTS
                        .filter(comp => autoHide.includes(comp.id))
                        .map(c =>
                            <c.Component key={c.id} />
                        )
                }
            </>
        );
    }

    /**
     * Renders the always visible info header labels.
     *
     * @returns {void}
     */
    _renderAlwaysVisible() {
        const { alwaysVisible } = this.props._conferenceInfo;

        if (!alwaysVisible?.length) {
            return null;
        }

        return (
            <>
                {
                    COMPONENTS
                        .filter(comp => alwaysVisible.includes(comp.id))
                        .map(c =>
                            <c.Component key={c.id} />
                        )
                }
            </>
        );
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
           <>
            { this._renderAlwaysVisible() }
            { this._renderAutoHide() }
           </>
        );
    }
}

/**
 * Maps (parts of) the Redux state to the associated
 * {@code Subject}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _visible: boolean,
 *     _conferenceInfo: Object
 * }}
 */
function _mapStateToProps(state: IReduxState) {
    return {
        _visible: isToolboxVisible(state),
        _conferenceInfo: getConferenceInfo(state)
    };
}

export default connect(_mapStateToProps)(ConferenceInfoCustomRight);
