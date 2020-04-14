import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const NewTaskForm = () => {
    return (
        <Formik
            initialValues = {{
                description: '',
                priority: 1,
                dueDate: new Date().toISOString(),
                completed: false,
                taskOwner: 'Ken Rimple'
            }}
            validationSchema = { Yup.object({
                description: Yup.string().min(1).max(255).required(),
                taskOwner: Yup.string().min(1).max(80).required(),
                priority: Yup.number().min(1).max(5).required(),
                dueDate: Yup.date().required()
            })}
            onSubmit={(values, { submitting}) => {
                // do something!
            }}
        >
            <Form>
                <label htmlFor="description">Description</label>
                <Field name="description" type="text" />
                <ErrorMessage name="description" />

                <label htmlFor="taskOwner">Owner</label>
                <Field name="taskOwner" type="text" />
                <ErrorMessage name="taskOwner" />

                <label htmlFor="priority">Priority</label>
                <Field name="priority" type="text" />
                <ErrorMessage name="priority" />

                <label htmlFor="dueDate">Due Date</label>
                <Field name="dueDate" type="text" />
                <ErrorMessage name="dueDate" />
            </Form>
        </Formik>
    );
}

export default NewTaskForm;