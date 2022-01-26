import React from 'react';
import 'components/Appointment/styles.scss'
import Header from "./Header"
import Empty from "./Empty";
import Show from './Show';
import useVisualMode from "hooks/useVisualMode";
import Form from './Form';
import Status from "components/Appointment/Status";
import Confirm from 'components/Appointment/Confirm';
// import { TRUE } from 'node-sass';
import Error from 'components/Appointment/Empty'

export default function Appointment(props) {
  console.log("index test", props.student)
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE =  "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(student, interviewer) {
    const interview = {
      student: student,
      interviewer
    };
    
    transition(SAVING);
    props.bookInterview(props.id, interview).then(() => 
      transition(SHOW))
      .catch((error) => transition(ERROR_SAVE, true))
  }

  const cancel = () => {
    transition(CONFIRM);
  }

  function confirmDelete() {
    transition(DELETING);
    props.cancelInterview(props.id)
      .then(() => 
        transition(EMPTY))
        .catch((error) => transition(ERROR_DELETE, true))
  }

  return (
  <article className="appointment">
    <Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={cancel}
        onEdit={() => transition(EDIT)}
      />
    )}
    {mode === CREATE && <Form interviewers = {props.interviewers} onCancel={() => back(EMPTY)} onSave={save} />}
    {mode === SAVING && <Status message = "Saving" />}
    {mode === DELETING && <Status message = "Deleting" />}
    {mode === CONFIRM && <Confirm message = "Are you sure you want to delete this appointment?" onConfirm = {confirmDelete} onCancel = {() => transition(SHOW)} />}
    {mode === EDIT && <Form student={props.interview.student} interviewer={props.interview.interviewer.id} interviewers={props.interviewers} onSave={save} onCancel = {() => transition(SHOW)} />}
    {mode === ERROR_DELETE && <Error message = "stupid error" onClose={() => back()} ></Error>}
    {mode === ERROR_SAVE && <Error message = "stupid error" onClose={() => back()} ></Error>}



  </article>
  );
}