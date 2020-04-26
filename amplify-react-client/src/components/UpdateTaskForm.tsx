import React, {useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { updateSingleTask } from '../tasks-api';
import * as Yup from 'yup';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import {Task} from "../models/task";
import {useDispatch} from "react-redux";
import {fetchSingleTaskActionCreator} from "../store/reducers/tasks-reducer";

const UpdateTaskForm = (props: any) => {
    const task = props.task;
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await dispatch(fetchSingleTaskActionCreator(props.match.params.id));
        })();
    }, [dispatch, props.match.params.id]);

    const hashHistory = props.history;
    return (
      <>
        { !task && <p>loading task...</p> }
          {task &&
            <>
            <h2>Update task { task.description }...</h2>
            <Formik
              initialValues={{
                description: task.description || '',
                priority: task.priority || 1,
                dueDate: task.dueDate,
                completed: task.completed || false,
                completedDate: task.completedDate || ''
              }}
              validationSchema={Yup.object({
                description: Yup.string().min(1).max(255).required(),
                priority: Yup.number().min(1).max(5).required(),
                dueDate: Yup.date().required(),
                completed: Yup.bool().required(),
                completedDate: Yup.date()
              })}
              onSubmit={(values) => {
                (async () => {
                    try {
                        // note: we have to synthesize a task by fetching the ID as well
                        // this is messy; in Redux we piece it together with the user's
                        // username, plus the taskId here (which is not part of the form)
                        // but part of the route. For now, leaving this as a 'make better'
                        await updateSingleTask('serverless',
                          { ...values, taskId: props.match.params.id } as Task);
                        hashHistory.push('/tasks');
                    } catch (e) {
                        alert(`Update Task failed...`);
                        console.error(e);
                    }
                })();
              }}
            >
              <Form className="mui-form">
                  <div className="mui-textfield mui-textfield--float-label">
                      <Field name="description" type="text"/>
                      <label htmlFor="description">Description</label>
                      <ErrorMessage name="description"/>
                  </div>

                  <div className="mui-textfield mui-textfield--float-label">
                      <Field name="priority" type="text"/>
                      <label htmlFor="priority">Priority (1-5)</label>
                      <ErrorMessage name="priority"/>
                  </div>

                  {/* todo - date picker */}
                  <div className="mui-textfield mui-textfield--float-label">
                      <Field name="dueDate" type="text"/>
                      <label htmlFor="dueDate">Due Date</label>
                      <ErrorMessage name="dueDate"/>
                  </div>

                  <div className="mui-textfield mui-textfield--float-label">
                      <Field name="completed" type="checkbox"/>
                      <label htmlFor="dueDate">Completed?</label>
                      <ErrorMessage name="completed"/>
                  </div>

                  <div className="mui-textfield mui-textfield--float-label">
                      <Field name="completedDate" type="text"/>
                      <label htmlFor="completedDate">Completed Date</label>
                      <ErrorMessage name="completedDate"/>
                  </div>

                  <button type="submit">Submit</button>
              </Form>
            </Formik>
            </>
          }
      </>
    );
}

function mapStateToProps(reduxState: any) {
    return {
        task: reduxState.tasksApi.editedTask || undefined
    };
}

export default connect(mapStateToProps)(withRouter((UpdateTaskForm)));