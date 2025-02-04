import { useState } from "react";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Envoyerreponse } from "@/pages/dashboard/fonctions/fonctionsrequetes";
import { toast } from "react-toastify";
import { sendNotificationToSomeone } from "@/sendNotificationToSomeone";

const Accordion = ({ items, className = "space-y-5" }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const [open, setOpen] = useState(false);
 
  const toggleAccrodian = (index) => {
    setActiveIndex(index);
    setOpen(!open);
  };

  const schema = yup
    .object({
      message: yup.string().required("veuillez remplir"),
     
    })
    .required();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });

  return (
    <div className={className}>
      
      {items.map((item, index) => (
        <div
          className="accordion shadow-base dark:shadow-none rounded-md"
          key={index}
        >
          <div
            className={`flex justify-between cursor-pointer transition duration-150 font-medium w-full text-start text-base text-slate-600 dark:text-slate-300 px-8 py-4 ${
              activeIndex === index
                ? "bg-slate-50 dark:bg-slate-700 dark:bg-opacity-60 rounded-t-md "
                : "bg-white dark:bg-slate-700  rounded-md"
            }`}
            onClick={() => toggleAccrodian(index)}
          >
            <span>{item.title} </span>
            <span
              className={`text-slate-900 dark:text-white text-[22px] transition-all duration-300 h-5 ${
                activeIndex === index ? "rotate-180 transform" : ""
              }`}
            >
              <Icon icon="heroicons-outline:chevron-down" />
            </span>
          </div>

          {activeIndex === index && (
            <div
              className={`${
                index === activeIndex
                  ? "dark:border dark:border-slate-700 dark:border-t-0"
                  : "l"
              } text-sm text-slate-600 font-normal bg-white dark:bg-slate-900 dark:text-slate-300 rounded-b-md`}
            >
              <div
                className="px-8 py-4"
                dangerouslySetInnerHTML={{ __html: item.content }}
              ></div>
            
            {item.idrequete &&   <Modal
                  title="Envoyer reponse"
                  label="Envoyer reponse"
                  labelClass="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-green-200 dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
                  uncontrol
                >
                  <div className="text-base text-slate-600 dark:text-slate-300">
                    <form
                      onSubmit={handleSubmit(async (data) =>
                      await   Envoyerreponse({
                         id:item.idrequete,
                         message:data.message
                        }
                        ).then(async () => {
                          toast.success("Envoyé avec success")
                          await sendNotificationToSomeone({
          receiveID: idtechni,
          userType: collection,
          message: `Une reponse à été envoyé par le quincailler`,
          title: "Plainte",
        })
                        })
                      )
                      }
                      className="space-y-4 "
                    >
                      <Textinput
                        name="message"
                        label="Reponse"
                        type="text"
                        placeholder="Reponse de la requete"
                        error={errors.message}
                        className="h-[48px]"
                        register={register}
                      />
                     
                      <div className="ltr:text-right rtl:text-left">
                        <button className="btn btn-dark  text-center">
                          Envoyer
                        </button>
                      </div>
                    </form>
                  </div>
                </Modal>
        }
        </div>
          )}

      
        </div>

        
      ))}
    </div>
  );
};
export default Accordion;
