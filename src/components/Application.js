import axios from "axios";
import Daylist from "./DayList";
import "components/Application.scss";
import React, { useState, useEffect } from "react";
import Appointment from "components/Appointment"
import { getAppointmentsForDay, getInterview, getInterviewsForDay} from "helpers/selectors";


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  
  useEffect(()=>{
    axios.get('http://localhost:8001/api/days')
      .then(response =>{
        console.log(response.data)
        Promise.all([
          Promise.resolve(axios.get("http://localhost:8001/api/days")),
          Promise.resolve(axios.get("http://localhost:8001/api/appointments")),
          Promise.resolve(axios.get("http://localhost:8001/api/interviewers")),
        ]).then(all => {

          setState(prev => ({ 
            ...prev,
            days: all[0].data, 
            appointments: all[1].data,
            interviewers: all[2].data}));
        });
      })
  }, [])

  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewsForDay(state, state.day);
  const schedule = appointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
      />
    );
  });

  const appointmentList = dailyAppointments.map((appointment) => {
    return (
      <Appointment key={appointment.id} id={appointment.id} time={appointment.time} interview={appointment.interview} />
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
