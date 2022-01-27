import axios from "axios";
import Daylist from "./DayList";
import "components/Application.scss";
import React, { useState, useEffect } from "react";
import Appointment from "components/Appointment"
import { getAppointmentsForDay, getInterview, getInterviewersForDay} from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";



export default function Application(props) {
  const {state, setDay, bookInterview, cancelInterview} = useApplicationData()
  

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
  console.log("interviewers", interviewers);
  
  const appointmentList = dailyAppointments.map((appointment) => {
    return (
      <Appointment key={appointment.id} id={appointment.id} time={appointment.time} interview={getInterview(state, appointment.interview)} interviewers={interviewers} bookInterview={bookInterview} cancelInterview={cancelInterview}/>
    );
  })
  
  return (
    <main className="layout">
      <section className="sidebar">
      <img
  className="sidebar--centered"
  src="images/logo.png"
  alt="Interview Scheduler"
/>
<hr className="sidebar__separator sidebar--centered" />
<nav className="sidebar__menu"> <Daylist
  days={state.days}
  value={state.day}
  onChange={setDay}
/> </nav>
<img
  className="sidebar__lhl sidebar--centered"
  src="images/lhl.png"
  alt="Lighthouse Labs"
/>
      </section>
      <section className="schedule">
      {appointmentList}
      <Appointment id="last" time="5pm" />
      </section>

    </main>
  );
}
