import React, {useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage  } from 'formik';
import * as Yup from 'yup';
import { withRouter } from 'react-router';
import {Task} from "../models/task";
import {connect, useDispatch} from "react-redux";
import {useHistory} from 'react-router-dom';
import {fetchSingleTaskActionCreator, updateSingleTaskActionCreator} from "../store/reducers/tasks-reducer";

const UpdateTaskForm = (props: any) => {
    const task = props.task;
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
          await dispatch(fetchSingleTaskActionCreator(props.match.params.id));
        })();
    }, [dispatch, props.match.params.id]);

    const history = useHistory();
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
                completedDate: Yup.date().nullable(true)
              })}
              onSubmit={(values) => {
                (async () => {
                    try {
                        // note: we have to synthesize a task by fetching the ID as well
                        // this is messy; in Redux we piece it together with the user's
                        // username, plus the taskId here (which is not part of the form)
                        // but part of the route. For now, leaving this as a 'make better'

                        // TODO date picker or validation fix
                        // also, stupidity with the date logic. I need to implement a date picker.
                        // until I do, I have to pull out the completedDate if it isn't set, as it
                        // is an empty field. Fix that or fix Formik passing that through and making
                        // it valid.
                      const payload = { ...values, taskId: props.match.params.id };
                      if (values.completedDate === '') {
                        console.log('REMOVING COMPLETED DATE')
                        delete payload['completedDate'];
                        console.dir(payload);
                      }
                      await dispatch(updateSingleTaskActionCreator(payload as Task));
                      history.push('/tasks');
                    } catch (e) {
                        alert(`Update Task failed...`);
                        console.error(e);
                    }
                })();
              }}
            >
              <Form>
                  <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <Field name="description" className="form-control" type="text"/>
                      <ErrorMessage name="description"/>
                  </div>

                  <div className="form-group">
                      <label htmlFor="priority">Priority (1-5)</label>
                      <Field name="priority" className="form-control" type="text"/>
                      <ErrorMessage name="priority"/>
                  </div>

                  {/* todo - date picker */}
                  <div className="form-group">
                      <label htmlFor="dueDate">Due Date</label>
                      <Field name="dueDate" className="form-control" type="text"/>
                      <ErrorMessage name="dueDate"/>
                  </div>

                  <div className="form-group">
                      <label htmlFor="dueDate">Completed?</label>
                      <Field name="completed" className="form-control" type="checkbox"/>
                      <ErrorMessage name="completed"/>
                  </div>

                  <div className="form-group">
                      <label htmlFor="completedDate">Completed Date</label>
                      <Field name="completedDate" className="form-control" type="text"/>
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

export default connect(mapStateToProps)(withRouter(UpdateTaskForm));