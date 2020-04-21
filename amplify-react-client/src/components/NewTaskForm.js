import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { addTask } from '../tasks-api';
import * as Yup from 'yup';

// TODO - add SAM support
const NewTaskForm = ({onCreateComplete}) => {
    return (
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
            onSubmit={(values, { submitting}) => {
                (async () => {
                    try {
                        await addTask('taskManagerNodeServerless', values);
                        onCreateComplete();
                    } catch (e) {
                        alert(`Create Task failed...`);
                        console.error(e);
                    }
                })();
            }}
        >
            <Form>
                <label htmlFor="description">Description</label>
                <Field name="description" type="text" />
                <ErrorMessage name="description" />

                <label htmlFor="priority">Priority</label>
                <Field name="priority" type="text" />
                <ErrorMessage name="priority" />

                <label htmlFor="dueDate">Due Date</label>
                <Field name="dueDate" type="text" />
                <ErrorMessage name="dueDate" />

                <button type="submit">Submit</button>
            </Form>

        </Formik>
    );
}

export default NewTaskForm;