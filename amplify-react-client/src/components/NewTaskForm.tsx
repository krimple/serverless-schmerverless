import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { addTask } from '../tasks-api';
import * as Yup from 'yup';
import { withRouter } from 'react-router';
import {Task} from "../models/task";

const NewTaskForm = (props: any) => {
    const hashHistory = props.history;
    return (
      <>
        <h3>Add a task...</h3>
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
            <Form>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <Field name="description" className="form-control" type="text"/>
                    <ErrorMessage name="description" />
                </div>

                <div className="form-group">
                    <label htmlFor="priority">Priority (1-5)</label>
                    <Field name="priority" className="form-control" type="text"/>
                    <ErrorMessage name="priority" />
                </div>

                {/* todo - date picker */}
                <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <Field name="dueDate" className="form-control" type="date" />
                    <ErrorMessage name="dueDate" />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </Form>
        </Formik>
      </>
    );
}

export default withRouter(NewTaskForm);