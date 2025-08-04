import { io } from "socket.io-client";
import React from 'react';
import { connect } from "react-redux";
import { getUnreadThread } from "../../actions/socket/getUnreadThread";
import { getThreads } from "../../actions/socket/getThreads";
import { setUserLogout } from '../../actions/logout';
import { getUnreadCount } from "../../actions/socket/getUnreadCount";
import { getAllThread } from "../../actions/socket/getAllThread";
import { socketUrl } from '../../config';

const secure = socketUrl && socketUrl.indexOf('https://') >= 0 ? true : false;

export const socket = io.connect(socketUrl,
    {
        secure,
        upgrade: true,
        transports: ['websocket'],
        reconnection: true,
        forceNew: true,
        rejectUnauthorized: false
    }
);

class SocketProvider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: null
        };
    }

    componentDidMount = () => {
        const { userId, getUnreadThread, getThreads, getUnreadCount, getAllThread } = this.props;

        socket.on(`messageThread-${userId}`, () => {
            getUnreadThread();
            getUnreadCount();
        });

        socket.on(`viewMessageThread-${userId}`, (data) => {
            getThreads({ threadType: data?.threadType, threadId: data?.threadId });
            getAllThread({ threadType: data?.threadType, threadId: data?.threadId });
        })
    }

    componentDidUpdate = () => {
        const { userId, getUnreadThread, getThreads, getUnreadCount, getAllThread } = this.props;

        socket.on(`messageThread-${userId}`, () => {
            getUnreadThread();
            getUnreadCount();
        });

        socket.on(`viewMessageThread-${userId}`, (data) => {
            getThreads({ threadType: data?.threadType, threadId: data?.threadId });
            getAllThread({ threadType: data?.threadType, threadId: data?.threadId });
        })
    }


    componentWillUnmount() {
        const { id } = this.state;
        if (id) {
            socket.off(`userlogout-${id}`);
            socket.off(`adminUserLogout-${id}`);
            socket.off(`messageThread-${id}`);
            socket.off(`viewMessageThread-${id}`);
        }
    }

    render() {
        const { userId, adminId, setUserLogout } = this.props;

        socket.on(`userlogout-${userId}`, () => {
            setUserLogout({ isAdmin: false });
            this.setState({ id: userId });
        });

        socket.on(`adminUserLogout-${adminId}`, (socket) => {
            setUserLogout({ isAdmin: true })
            this.setState({ id: adminId });
        });

        return (
            <>
            </>)
    }
}

const mapState = (state) => ({
    userId: state?.account?.data?.userId,
    adminId: state?.account?.privileges?.id
});

const mapDispatch = {
    getUnreadThread,
    setUserLogout,
    getThreads,
    getUnreadCount,
    getAllThread
};

export default connect(mapState, mapDispatch)(SocketProvider);