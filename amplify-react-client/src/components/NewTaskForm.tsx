import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { addTask } from '../tasks-api';
import * as Yup from 'yup';
import { withRouter } from 'react-router';
import {Task} from "../models/task";

// TODO - add SAM support
const NewTaskForm = (props: any) => {
    const hashHistory = props.history;
    return (
      <>
        <h2>Add a task...</h2>
        <Formik
            initialValues = {{
                description: '',
                priority: 1,
                dueDate: new Date().toISOString(),
                completed: false
            }}
            validationSchema = { Yup.object({
                description: Yup.string().min(1).max(255).required(),
                priority: Yup.number().min(1).max(5).required(),
                dueDate: Yup.date().required()
            })}
            onSubmit={(values) => {
                (async () => {
                    try {
                        await addTask('serverless', values as Task);
                        hashHistory.push('/tasks');
                    } catch (e) {
                        alert(`Create Task failed...`);
                        console.error(e);
                    }
                })();
            }}
        >
            <Form className="mui-form">
                <div className="mui-textfield mui-textfield--float-label">
                    <Field name="description" type="text"/>
                    <label htmlFor="description">Description</label>
                    <ErrorMessage name="description" />
                </div>

                <div className="mui-textfield mui-textfield--float-label">
                    <Field name="priority" type="text"/>
                    <label htmlFor="priority">Priority (1-5)</label>
                    <ErrorMessage name="priority" />
                </div>

                {/* todo - date picker */}
                <div className="mui-textfield mui-textfield--float-label">
                    <Field name="dueDate" type="text" />
                    <label htmlFor="dueDate">Due Date</label>
                    <ErrorMessage name="dueDate" />
                </div>

                <button type="submit">Submit</button>
            </Form>
        </Formik>
      </>
    );
}

export default withRouter(NewTaskForm);