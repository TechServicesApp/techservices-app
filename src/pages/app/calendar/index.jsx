import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db, imgdb } from "@/firebaseconfig";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import {
  useGetCategoriesQuery,
  useGetCalendarEventsQuery,
  useCreateCalendarEventMutation,
  useEditCalendarEventMutation,
  useDeleteCalendarEventMutation,
} from "@/store/api/app/calendarSlice";
import EventModal from "./EventModal";

const CalendarPage = () => {
  const calendarComponentRef = useRef(null);
  const { data: getCategories } = useGetCategoriesQuery();
  const {
    data: getCalendarEvents,
    isLoading,
    isError,
    error,
  } = useGetCalendarEventsQuery();
  const [createCalendarEvent] = useCreateCalendarEventMutation();
  const [editCalendarEvent] = useEditCalendarEventMutation();
  const [deleteCalendarEvent] = useDeleteCalendarEventMutation();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [categories, setCategories] = useState([
    { label: 'Business', value: 'business', activeClass: 'ring-primary-500 bg-primary-500', className: ' group-hover:border-blue-500' },
    { label: 'Personnel', value: 'personal', activeClass: 'ring-success-500 bg-success-500', className: ' group-hover:border-green-500' },
    { label: 'Vacance', value: 'holiday', activeClass: 'ring-danger-500 bg-danger-500', className: ' group-hover:border-red-500' },
    { label: 'Famille', value: 'family', activeClass: 'ring-info-500 bg-info-500', className: ' group-hover:border-cyan-500' },
    { label: 'Reunion', value: 'meeting', activeClass: 'ring-warning-500 bg-warning-500', className: ' group-hover:border-yellow-500' },
    { label: 'Etc', value: 'etc', activeClass: 'ring-info-500 bg-info-500', className: ' group-hover:border-cyan-500' }]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [events] = useState([
    { title: "Nouvel evenement", id: "1", tag: "business" },
    { title: "Reunion", id: "2", tag: "meeting" },
    { title: "Vacance", id: "3", tag: "holiday" },
    { title: "Nouveau theme", id: "4", tag: "etc" },
  ]);



  useEffect(() => {
    const calendrier = async () => {

      const date = query(
        collection(db, "Calendrier"),
        where("id", "==", auth.currentUser.uid)
      );
      const Snapshot = await getDocs(date);
      const eventArray = Snapshot.docs.map((doc) => {
        const data = doc.data(); // Obtenir les données de chaque document

        // Vérifier si la date est un timestamp (en secondes) et convertir
        const date = new Date(data.start.seconds * 1000)
        date.setHours(date.getHours() );

        // Afficher la date ajustée en format ISO 8601  
        const startDateISO = date.toISOString();

        const date1 = new Date(data.end.seconds * 1000);
        date1.setHours(date1.getHours() );

        // Afficher la date ajustée en format ISO 8601
        const endDateISO = date1.toISOString();


        // Retourner un nouvel objet avec les dates au format ISO
        return {
          ...data,
          start: startDateISO,
          end: endDateISO,
        };
      });

      setCalendarEvents(eventArray)
    }


    calendrier()


    setSelectedCategories(categories?.map((c) => c.value));


  }, []);

  useEffect(() => {
    const draggableEl = document.getElementById("external-events");

    const initDraggable = () => {
      if (draggableEl) {
        new Draggable(draggableEl, {
          itemSelector: ".fc-event",
          eventData: function (eventEl) {
            let title = eventEl.getAttribute("title");
            let id = eventEl.getAttribute("data");

            let event = events.find((e) => e.id === id);
            let tag = event ? event.tag : "";
            return {
              title: title,

              id: id,
              extendedProps: {
                calendar: tag,
              },
            };
          },
        });
      }
    };

    if (!isLoading) {
      initDraggable();
    }

    return () => {
      draggableEl?.removeEventListener("mousedown", initDraggable);
    };
  }, [isLoading]);

  const [showModal, setShowModal] = useState(false);
  const handleDateClick = (arg) => {
    setEditEvent(null);
    setShowModal(true);
    setSelectedEvent(arg);
  };

  const handleClassName = (arg) => {
    if (arg.event.extendedProps.calendar === "holiday") {
      return "danger";
    } else if (arg.event.extendedProps.calendar === "business") {
      return "primary";
    } else if (arg.event.extendedProps.calendar === "personal") {
      return "success";
    } else if (arg.event.extendedProps.calendar === "family") {
      return "info";
    } else if (arg.event.extendedProps.calendar === "etc") {
      return "info";
    } else if (arg.event.extendedProps.calendar === "meeting") {
      return "warning";
    }
  };
  // event click
  const handleEventClick = (arg) => {
    setShowModal(true);
    setEditEvent(arg);
  };
  // handle close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditEvent(null);
    setSelectedEvent(null);
  };

  // add event
  const handleAddEvent = (newEvent) => {
    createCalendarEvent(newEvent);
  };

  // edit event
  const handleEditEvent = (updatedEvent) => {
    editCalendarEvent({
      id: editEvent.event.id,
      event: updatedEvent,
    });
  };

  const filteredEvents = calendarEvents?.filter((event) =>
    selectedCategories.includes(event.extendedProps.calendar)
  );


  return (
    <div className="dashcode-calender">
      <div className="grid grid-cols-12 gap-4">
        <Card className="lg:col-span-3 col-span-12">
          <Button
            icon="heroicons-outline:plus"
            text=" Ajouter evenement"
            className="btn-primary w-full block   "
            onClick={() => {
              setShowModal(!showModal);
            }}
          />



          <div className="block py-4 text-slate-800 dark:text-slate-400 font-semibold text-xs uppercase mt-4">
            FILTER
          </div>
          <ul className=" space-y-2 ">
            <li>
              <Checkbox
                label="Tout"
                activeClass="ring-primary-500 bg-primary-500"
                value={selectedCategories?.length === categories?.length}
                onChange={() => {
                  if (selectedCategories?.length === categories?.length) {
                    setSelectedCategories([]);
                  } else {
                    setSelectedCategories(categories.map((c) => c.value));
                  }
                }}
              />
            </li>
            {categories?.map((category) => (
              <li key={category.value}>
                <Checkbox
                  activeClass={category.activeClass}
                  label={category.label}
                  value={selectedCategories.includes(category.value)}
                  onChange={() => handleCategorySelection(category.value)}
                />
              </li>
            ))}
          </ul>
        </Card>
        <Card className="lg:col-span-9 col-span-12">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            ref={calendarComponentRef}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            events={filteredEvents}
            editable={false}
            rerenderDelay={10}
            eventDurationEditable={false}
            selectable={true}
            selectMirror={true}
            droppable={false}
            dayMaxEvents={2}
            weekends={true}
            eventClassNames={handleClassName}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            initialView="dayGridMonth"
          />
        </Card>
      </div>
      <EventModal
        showModal={showModal}
        onClose={handleCloseModal}
        categories={categories}
        onAdd={handleAddEvent}
        selectedEvent={selectedEvent}
        event={editEvent}
        onEdit={handleEditEvent}
        onDelete={deleteCalendarEvent}
      />
    </div>
  );
};

export default CalendarPage;
