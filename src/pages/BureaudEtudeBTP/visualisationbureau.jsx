import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { collection,addDoc,updateDoc,getDoc, doc } from "firebase/firestore";
import Radio from "@/components/ui/Radio";
import { envoiportfolio } from "./fonctions/Fonctionbesoin";
import { db } from "@/firebaseconfig";
import { useNavigate, useParams } from "react-router-dom";
import { DateEvenement } from "@/pages/EntreprisBTP/fonctions/FonctionCalendrier";
import { infoclient } from "@/pages/dashboard/InfoClient";
import Modal from "@/components/ui/Modal";
import { verifyDate, allDate } from "@/pages/EntreprisBTP/fonctions/FonctionCalendrier";
import { auth } from "@/firebaseconfig";
import { useForm } from "react-hook-form";
import Card from "@/components/ui/Card";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


const  Visualisationbureau = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [nomTechni, setnomTechni] = useState("");
  const [emailTechni, setemailTechni] = useState("");
  const [telTechni, settelTechni] = useState("");
  const [adresseTechni, setadressetelTechni] = useState("");
  const [selectOption, setSelectOption] = useState(0);
  const [op, setOp] = useState([]);
  const [dateWarnings, setDateWarnings] = useState({}); // State to store date warnings
  const [verify, setVerify] = useState(true);
  const [checked, setChecked] = useState(false);
  const [datechoisi,setDatechoisi] = useState(null)
  const[dateend,setdateend]= useState(new Date())
 const [evenement,setEvenement] = useState([])
  const calendrier = collection(db, "Calendrier");
  const targetDate = new Date(2023, 10, 15); // Mois commence à 0 donc 10 = novembre


  const handleOption = (e) => {
    setSelectOption(e.target.value);
    const date = data?.rdv[e.target.value - 1]?.start.toDate()
    date.setHours(date.getHours() + 1);
    setdateend(date)
  };

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({});

  const fetchPost = async () => {
    try {
      const evenement = await DateEvenement({datejour:new Date(),id: auth.currentUser.uid})
     
      setEvenement(evenement)
      const date = await allDate({ id: auth.currentUser.uid });
      setOp(date);

      const doc2 = await getDoc(doc(db, "DemandeServicesBureau", id));

      if (doc2.exists) {
        const data = doc2.data();
        setSelectOption(data?.rdv[0]?.id);
        const date = data?.rdv[0]?.start.toDate()
        date.setHours(date.getHours() + 1);
        setdateend(date)

        if (data?.idsenderportfolio) {
          const idFound = data?.idsenderportfolio.find(
            (besoin) => besoin.id ===localStorage.getItem("quincailler")
          );

          // Si aucun id correspondant n'est trouvé, ajouter le devis au tableau filtré
          if (idFound) {
            setVerify(false);
            setDatechoisi( idFound.datechoisi);
          }
        }
        const info = await infoclient({
          nomcollection: data?.auteurCollection,
          idclient: data?.auteurId,
        });

        setData(data);
        setnomTechni(info?.nom);
        setemailTechni(info?.email);
        settelTechni(info?.telephone);
        setadressetelTechni(info?.adresse);
      }

      // Fetch date warnings
      const warnings = {};
      for (const option of date) {
        const isWarning = await verifyDate({
          dateverify: option.start,
          id: auth.currentUser.uid,
        });
        warnings[option.start.seconds] = isWarning > 0 ? "warning" : "no";
      }
      setDateWarnings(warnings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <>
      <div translate="no">
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-7 col-span-12">
          <Card title="Identite du demandeur">
          
            <ul className="list space-y-8">
          <li className="flex space-x-3 rtl:space-x-reverse">
          <div className="flex-1">
                  <span className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                  Nom ,prenom et/ou raison social :
                  </span>  &nbsp;&nbsp;

                  {nomTechni}
                </div>
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-1">
                  <span className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                  Adresse :
                  </span>&nbsp;&nbsp;

                  {adresseTechni}
                </div>
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-1">
                  <span className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                  Telephone :
                  </span>&nbsp; &nbsp;

                  {telTechni}
                </div>
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-1">
                  <span className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                 Email :
                  </span>&nbsp;&nbsp;

                  {emailTechni}
                </div>
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-1">
                  <span className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                  Qualite :
                  </span>&nbsp;&nbsp;

                  {data?.Qualite}
                </div>
                </li>
         
            </ul>
          </Card>
          <br />
        <div className="lg:col-span-7 col-span-12">
          <Card title="Le projet">
            <ul className="list space-y-8">
            <li className="flex space-x-3 rtl:space-x-reverse">
            <div className="flex-1">
                  <span className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                  Nature des travaux  :
                  </span>&nbsp;&nbsp;
                  {data?.NatureTravaux}
                 
                </div>
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-1">
                  <span className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                  Destination de l'ouvrage a construire :
                  </span>&nbsp;&nbsp;

                  {data?.destinationTravaux?.join(",")}
                </div>
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-1">
                  <span className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                  Details :
                  </span>&nbsp;&nbsp;

                  {data?.details}
                </div>
                </li>
             
             
       
            </ul>
          </Card>
          <br />
          <div>
             
                {verify && (
                  <Modal
                    title="choisr une date de RDV"
                    label="choisr une date de RDV"
                    labelClass="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-[#067BBF] dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
                    uncontrol
                  >
                    <div className="text-base text-slate-600 dark:text-slate-300">
                      <form
                        className="space-y-4"
                        onSubmit={handleSubmit(
                          async () =>{
                            const docref = await addDoc(calendrier, {

                              id: auth.currentUser.uid,
                              title:"Rdv",
                              description: "Entretien pour un nouveau besoin",
                              lieu: "Dans les locaux",
                              participant: nomTechni,
                              start: data?.rdv[selectOption-1].start,
                              end:  dateend,
                              allDay: false,
                              extendedProps: {
                                calendar: "business",
                              },
                            });
                      
                            await updateDoc(doc(
                              db,
                              "Calendrier",
                              docref.id
                            ), {
                              idcalendrier: docref.id
                            });
                            await envoiportfolio({
                              date: data?.rdv[selectOption-1].start,
                              idsender:localStorage.getItem("quincailler"),
                              id: id,
                            }).then(() => {
                              toast.success("Envoyé avec success"),
                                navigate("/devis_en_attente");
                            })
                          }
                        )}
                      >
                        {data?.rdv?.map((option) => (
                          <div key={option.start.seconds}>
                            <Radio
                              label={new Date(
                                option.start.seconds * 1000
                              ).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              name="option"
                              value={option.id}
                              checked={
                                parseInt(selectOption) === parseInt(option.id)
                              }
                              onChange={handleOption}
                            />
                            {dateWarnings[option.start.seconds] ===
                            "warning" ? (
                              <div style={{ color: "red" }}>
                                Vous avez deja un programme prevu pour cette
                                date
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        ))}
                        <div className="ltr:text-right rtl:text-left">
                          <button className="btn btn-dark text-center">
                            Envoyer votre profil
                          </button>
                        </div>
                      </form>
                    </div>
                  </Modal>
                )}
              </div>
        </div>
        </div>
        <div className="lg:col-span-5 col-span-12">
         {data?.Qualite==="mandataire" && 
        <Card title="Identite du Proprietaire">
          <ul className="list space-y-8">
          <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-1">
                  <span className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                  Nom :
                  </span>&nbsp;&nbsp;

                  {data?.nomProprietaire}
                </div>
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-1">
                  <span className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                  Prenom :
                  </span>&nbsp;&nbsp;

                  {data?.prenomProprietaire}
                </div>
                </li>
             
            </ul>
          </Card> }
          <br />
          {(data.PlanArchitectural || data.permisConstruire|| data.NoteCalcul|| data.imgRenov) &&(    <Card title="Files" >
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
          {data.imgRenov &&  <li  className="block py-[8px]">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <div className="flex-1 flex space-x-2 rtl:space-x-reverse">
                     
                      <div className="flex-1">
                        <span className="block text-slate-600 text-sm dark:text-slate-300">
                          Image de renovation   </span>
                      
                      </div>
                    </div>
                    
                     <a  className="text-xs text-slate-900 dark:text-white" href={data.imgRenov} target="_blank" rel="noopener noreferrer">Telecharger le fichier</a>
                   
                  </div>
                </li>}
                {data.permisConstruire &&  <li  className="block py-[8px]">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <div className="flex-1 flex space-x-2 rtl:space-x-reverse">
                     
                      <div className="flex-1">
                        <span className="block text-slate-600 text-sm dark:text-slate-300">
                        permis Construire   </span>
                      
                      </div>
                    </div>
                    
                     <a  className="text-xs text-slate-900 dark:text-white" href={data.permisConstruire} target="_blank" rel="noopener noreferrer">Telecharger le fichier</a>
                   
                  </div>
                </li>}
                {data.NoteCalcul &&  <li  className="block py-[8px]">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <div className="flex-1 flex space-x-2 rtl:space-x-reverse">
                     
                      <div className="flex-1">
                        <span className="block text-slate-600 text-sm dark:text-slate-300">
                        Note de Calcul   </span>
                      
                      </div>
                    </div>
                    
                     <a  className="text-xs text-slate-900 dark:text-white" href={data.NoteCalcul} target="_blank" rel="noopener noreferrer">Telecharger le fichier</a>
                   
                  </div>
                </li>}
                {data.PlanArchitectural &&  <li  className="block py-[8px]">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <div className="flex-1 flex space-x-2 rtl:space-x-reverse">
                     
                      <div className="flex-1">
                        <span className="block text-slate-600 text-sm dark:text-slate-300">
                        Plan Architectural  </span>
                      
                      </div>
                    </div>
                    
                     <a  className="text-xs text-slate-900 dark:text-white" href={data.PlanArchitectural} target="_blank" rel="noopener noreferrer">Telecharger le fichier</a>
                   
                  </div>
                </li>}
              
            </ul>
          </Card>)}
         {!verify &&   <Card title="Date du RDV choisie">
            <div className="mb-12">
              
              <Calendar value={datechoisi?.toDate()} />
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {evenement.map((item, i) => (
                <li key={i} className="block py-[10px]">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <div className="flex-1 flex space-x-2 rtl:space-x-reverse">
                    
                      <div className="flex-1">
                        <span className="block text-slate-600 text-sm dark:text-slate-300 mb-1 font-medium">
                          {item.title}
                        </span>
                        <span className="flex font-normal text-xs dark:text-slate-400 text-slate-500">
                        
                          {item.description}
                        </span>
                      </div>
                    </div>
                  
                  </div>
                </li>
              ))}
            </ul>
          </Card>}
          <br />
         
        </div>
        </div>
        <br />
       
      </div>
    </>
  );
};

export default Visualisationbureau;
