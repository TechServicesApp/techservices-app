import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import { useForm, Controller } from "react-hook-form";
import Select from "@/components/ui/Select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Textarea from "@/components/ui/Textarea";
import {
  collection,
  deleteDoc,
  updateDoc,
  doc,
  addDoc
} from "firebase/firestore";
import { auth, db, imgdb } from "@/firebaseconfig";
import Flatpickr from "react-flatpickr";
import FormGroup from "@/components/ui/FormGroup";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const EventModal = ({
  showModal,
  onClose,
  categories,
  selectedEvent,
  event,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [id, setid] = useState("")
  const calendrier = collection(db, "Calendrier");
  const FormValidationSchema = yup
    .object({
      title: yup.string().required("Titre obligatoire"),
      participant: yup.string().required("Participant obligatoire"),
      destination: yup.string().required("Destination obligatoire"),
      description: yup.string().required("Description obligatoire"),


      cata: yup
        .string()
        .when("title", {
          is: (title) => title.length > 0,
          then: yup.string().required("Categorie obligatoire"),

          otherwise: yup.string().notRequired(),
        })
        .required("Categorie obligatoire"),
    })
    .required();

  useEffect(() => {

    if (selectedEvent) {
      setStartDate(selectedEvent.date);
      setEndDate(selectedEvent.date);
    }
    if (event) {
      setStartDate(event.event.start);
      setEndDate(event.event.end);
      console.log(event.event)
      setid(event.event.extendedProps.idcalendrier)
    }
    reset(event);
  }, [selectedEvent, event]);

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const onSubmit = async (data) => {
    if (event) {
     
      await updateDoc(doc(
        db,
        "Calendrier",
        id
      ), {
        title: data.title,
        description: data.description,
        lieu: data.destination,
        participant: data.participant,
        start: startDate,
        end: endDate,
        allDay: false,
        extendedProps: {
          calendar: data.cata,
        }
      })
      toast.success("Modifié avec success");

    } else {

      const docref = await addDoc(calendrier, {

        id: auth.currentUser.uid,
        title: data.title,
        description: data.description,
        lieu: data.destination,
        participant: data.participant,
        start: startDate,
        end: endDate,
        allDay: false,
        extendedProps: {
          calendar: data.cata,
        },
      });

      await updateDoc(doc(
        db,
        "Calendrier",
        docref.id
      ), {
        idcalendrier: docref.id
      });

      toast.success("Ajouté avec success");
    }

    onClose();
    reset();
  };

  const handleDelete = (id) => {
    onClose();
    Swal.fire({
      title: "Es-tu sur?",
      text: "Tu ne seras plus capable de revenir en arriere!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Oui",
    }).then(async (result) => {
      if (result.isConfirmed) {

        await deleteDoc(doc(
          db,
          "Calendrier",
          id
        ));
        Swal.fire("L'evenement a ete supprime");
      }
    });
  };
  return (
    <div>
      <Modal
        title={event ? "Modifier l'evenement" : "Ajouter l'evenement"}
        activeModal={showModal}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <Textinput
            name="title"
            label="Nom de l'evenement"
            type="text"
            placeholder="Entrer le nom"
            register={register}
            error={errors.title}
            defaultValue={event ? event.event.title : ""}
          />

          <Textinput
            name="destination"
            label="Lieu"
            type="text"
            placeholder="Entrer le lieu"
            register={register}
            error={errors.destination}
            defaultValue={event ? event.event.extendedProps.lieu : ""}
          />



          <Textarea
            name="participant"
            label="Participants"
            type="text"
            placeholder="nom1, nom2, nom3, ..."
            register={register}
            error={errors.participant}
            defaultValue={event ? event.event.extendedProps.participant : ""}
          />

          <Textarea
            name="description"
            label="Description"
            type="text"
            placeholder="Entrer la description"
            register={register}
            error={errors.description}
            defaultValue={event ? event.event.extendedProps.description : ""}
          />
          <FormGroup
            label="Date de debut"
            id="default-picker"
            error={errors.startDate}
          >
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <Flatpickr
                  className="form-control py-2"
                  id="date-time-picker"
                  placeholder="yyyy, dd M"
                  data-enable-time
                  value={startDate}
                  onChange={(date) => setStartDate(date[0])}

                />
              )}
            />
          </FormGroup>
          <FormGroup
            label="Date de fin"
            id="default-picker2"
            error={errors.endDate}
          >
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <Flatpickr
                  className="form-control py-2"
                  id="date-time-picker"
                  placeholder="yyyy, dd M"
                  data-enable-time
                  value={endDate}
                  onChange={(date) => { setEndDate(date[0]) }}

                />
              )}
            />
          </FormGroup>
          <Select
            label="Type d'evenement"
            defaultValue="Bureau"
            options={categories}
            register={register}
            error={errors.cata}
            name="cata"
          />
          <div className="ltr:text-right rtl:text-left  space-x-3">
            {event && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(id)}
              >
                Supprimer
              </button>
            )}
            <button className="btn btn-dark  text-center">
              {event ? "Modifier" : "Ajouter"} Evenement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EventModal;
