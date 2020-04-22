import React, { Component, useState, useEffect } from 'react';
import { API, Auth, getBearerToken } from '../auth';

export default class TasksContainer extends Component {
    state = {
        tasks: []
    };

    async componentDidMount() {
        try {
            const token = await getBearerToken();
            this.setState({ bearerToken: token });
        } catch (e) {
            this.setState({ bearerToken: null });
        }
    }

    render() {
        console.log('rendering!', this.state, this.props);
        const tasks = this.state.tasks || [];
        const taskTRs = tasks.map((t,idx) => (
            <tr key={t['taskId']['S']}>
                <td>{t['taskId']['S']}</td>
                <td>{t['description']['S']}</td>
                <td>{t['priority']['N']}</td>
                <td>{t['dueDate']['S']}</td>
                <td>{t['completed']['BOOL']}</td>
            </tr>
        ));

        // TODO - refactor into more 
        return (
            <>
                <div>
                    <h3>Load Tasks with</h3>
                    <button 
                        className="mui-btn mui-btn--primary"
                        onClick={() => { this.handleLoadTasks('taskManagerNodeServerless'); }}>
                        Serverless
                    </button>
                    <button 
                        className="mui-btn mui-btn--primary"
                        onClick={() => { this.handleLoadTasks('taskManagerNodeSam'); }}>
                        AWS SAM
                    </button>
                    <button 
                        className="mui-btn mui-btn--primary"
                        onClick={() => { this.handleLoadTasks('taskManagerArcitect'); }}>
                        Architect
                    </button> 
                </div>

                { tasks &&
                    <table className="mui-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Description</th>
                                <th>Priority</th>
                                <th>Due Date</th>
                                <th>Complete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taskTRs}
                        </tbody>
                    </table>
                }
            </>
        )
    }

    async handleLoadTasks(endpoint) {
        console.log('handling load tasks for ', endpoint);
        const response = await API.get(endpoint, '/tasks?taskOwner=' + encodeURIComponent('Ken Rimple'), {
            headers: { Authorization: this.state.bearerToken }
        });
        console.log('Tasks returned', response.tasks );
        this.setState({ tasks: response.tasks });
    }
}