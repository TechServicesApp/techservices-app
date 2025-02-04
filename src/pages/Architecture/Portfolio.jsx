import React, { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import { useForm } from "react-hook-form";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { countEvent } from "@/pages/EntreprisBTP/fonctions/FonctionCalendrier";
import { v4 } from "uuid";
import {
  collection,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { auth, db, imgdb } from "@/firebaseconfig";

const profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [Email, setEmail] = useState("");
  const [Nom, setNom] = useState("");
  const [Telephone, setTelephone] = useState("");
  const [Adresse, setAdresse] = useState("");
  const [Bio, setBio] = useState("");
  const [Logo, setLogo] = useState("");
  const [Specialite, setspecialite] = useState("");
  const [nombre, setnombre] = useState(0);
  const [Catalogue, setcatalogue] = useState(null);
  const inputRef = useRef(null);
  const logoRef = useRef(null);
  const entreprisebtp = doc(
    db,
    "Architecture",
    localStorage.getItem("quincailler")
  );
  const [agrement, setagrement] = useState("");
  const [annee, setannee] = useState(0);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleButtonClick = () => {
    // Déclenche le clic sur l'input
    inputRef.current.click();
  };

  const handlelogoClick = () => {
    // Déclenche le clic sur l'input
    logoRef.current.click();
  };

  const handleUpload2 = (e) => {
    var file = e.target.files[0];

    if (file.type !== "application/pdf") {
      toast.error("Veuillez sélectionner un fichier PDF.");
      e.target.value = ""; // Réinitialiser le champ
      setcatalogue(null);
    } else {
      const refdoc2 = ref(imgdb, `portfolio/${new Date().getTime() + v4()}`);
      uploadBytes(refdoc2, e.target.files[0]).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setcatalogue(url);
        });
      });
    }
  };

  const handleUploadlogo = (e) => {
    var file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image.");
      e.target.value = ""; // Réinitialiser le champ
    } else {
      const refdoc2 = ref(imgdb, `portfolio/${new Date().getTime() + v4()}`);
      uploadBytes(refdoc2, e.target.files[0]).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setLogo(url);
        });
      });
    }
  };
  const handleSaveClick = async () => {
   
    await updateDoc(entreprisebtp, {
      //ajouter les informations de entreprise dans firebase

      logo: Logo,
      localisation: Adresse,
      nom: Nom,
      telephone: Telephone,
      bio: Bio,
      catalogue: Catalogue,
      agrement: agrement,
      annee: parseInt(annee),
    }).then(() => {
      setIsEditing(false);
      fetchpost();
    });
  };

  const fetchpost = async () => {
    try {
      const nbre = await countEvent({ id: auth.currentUser.uid });
      setnombre(nbre);
    
    

     
        const q1 = query(
          collection(db, "Architecture"),
          where("uid", "==", auth.currentUser.uid)
        );

        const querySnapshot1 = await getDocs(q1);

        querySnapshot1.forEach((doc) => {
          if (doc.exists) {
            setNom(doc.data()?.nom);
            setEmail(doc.data()?.email);
            setTelephone(doc.data()?.telephone);
            setAdresse(doc.data()?.localisation);
            setLogo(doc.data()?.logo);
            setcatalogue(doc.data()?.catalogue);
            setLogo(doc.data()?.logo);
            setBio(doc.data()?.bio);
            setagrement(doc.data()?.agrement);
            setannee(parseInt(doc.data()?.annee));
           
          }
        });
    
    } catch (error) {
      console.log(error);
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({});
  useEffect(() => {
    fetchpost();
  }, []);
  return (
    <div>
      {!isEditing ? (
        <div className="space-y-5 profile-page">
          <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
            <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
            <div className="profile-box flex-none md:text-start text-center">
              <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
                <div className="flex-none">
                  <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                    <img
                      src={Logo}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                    {Nom}
                  </div>
                  <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                    {Specialite}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
              <div className="flex-1">
                <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                  {nombre}
                </div>
                <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                  Evenements du calendrier
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-4 col-span-12">
              <Card title="Info">
                <ul className="list space-y-8">
                  <li className="flex space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                      <Icon icon="heroicons:envelope" />
                    </div>
                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                        EMAIL
                      </div>
                      <a
                        href="mailto:someone@example.com"
                        className="text-base text-slate-600 dark:text-slate-50"
                      >
                        {Email}
                      </a>
                    </div>
                  </li>

                  <li className="flex space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                      <Icon icon="heroicons:phone-arrow-up-right" />
                    </div>
                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                        TELEPHONE
                      </div>

                      {Telephone}
                    </div>
                  </li>

                  <li className="flex space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                      <Icon icon="heroicons:map" />
                    </div>
                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                        ADRESSE
                      </div>
                      <div className="text-base text-slate-600 dark:text-slate-50">
                        {Adresse}
                      </div>
                    </div>
                  </li>

                 
                </ul>
              </Card>
            </div>
            <div className="lg:col-span-8 col-span-12">
              <Card title="Informations supplementaire">
                <div className="flex-1">
                  <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                    Bio
                  </div>

                  {Bio}
                </div>
              <br />
                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                        NUMERO AGREMENT
                      </div>
                     
                        {agrement}
                     
                    </div>
                    <br />
                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                        ANNEES D'EXPERIENCE
                      </div>
                     
                        {annee}
                     
                      </div>
                   
              </Card>
            </div>
            <div className="flex-1">
              <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                Catalogue
              </div>
              {Catalogue && (  <div style={{ width: 70 + "vw", height: 90 + "vh" }}>
                
                  <iframe src={Catalogue} width="100%" height="100%" />
              
              </div>  )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleEditClick}
            className="ml-2 p-1 bg-gray-500 text-white"
          >
            Editer
          </button>
        </div>
      ) : (
        <div className="space-y-5 profile-page">
          <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
            <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
            <div className="profile-box flex-none md:text-start text-center">
              <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
                <div className="flex-none">
                  <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                    <img
                      src={Logo}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                    <button
                      className=" invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-green-200 dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
                      type="button"
                      onClick={handlelogoClick}
                    >
                      <Icon icon="heroicons:pencil-square" />
                    </button>

                    {/* Input caché */}
                    <input
                      type="file"
                      ref={logoRef}
                      accept="image/*"
                      style={{ display: "none" }} // Cache l'input
                      onChange={(e) => {
                        handleUploadlogo(e);
                      }}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                    <Textinput
                      label="Nom"
                      type="text"
                      placeholder="Entrer le nom"
                      name="Nom"
                      defaultValue={Nom}
                      onChange={(e) => {
                        if (e.target.value === "") {
                          setNom(Nom);
                        } else {
                          setNom(e.target.value);
                        }
                      }}
                      register={register}
                    />
                  </div>
                  <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                    {Specialite}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
              <div className="flex-1">
                <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                {nombre}
                </div>
                <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                  Calender Events
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-4 col-span-12">
              <Card title="Info">
                <ul className="list space-y-8">
                  <li className="flex space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                      <Icon icon="heroicons:envelope" />
                    </div>
                    <div className="flex-1">
                      <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                        EMAIL
                      </div>

                      {Email}
                    </div>
                  </li>

                  <li className="flex space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                      <Icon icon="heroicons:phone-arrow-up-right" />
                    </div>
                    <div className="flex-1">
                      <Textinput
                        label="Telephone"
                        type="text"
                        defaultValue={Telephone}
                        placeholder="Telephone"
                        onChange={(e) => {
                          if (e.target.value === "") {
                            setTelephone(Telephone);
                          } else {
                            setTelephone(e.target.value);
                          }
                        }}
                        name="Telephone"
                        register={register}
                      />
                    </div>
                  </li>

                  <li className="flex space-x-3 rtl:space-x-reverse">
                    <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                      <Icon icon="heroicons:map" />
                    </div>
                    <div className="flex-1">
                      <Textinput
                        label="Adresse"
                        type="text"
                        placeholder="Adresse"
                        name="Adresse"
                        defaultValue={Adresse}
                        onChange={(e) => {
                          if (e.target.value === "") {
                            setAdresse(Adresse);
                          } else {
                            setAdresse(e.target.value);
                          }
                        }}
                        register={register}
                      />
                    </div>
                  </li>
                </ul>
              </Card>
            </div>
            <div className="lg:col-span-8 col-span-12">
              <Card title="Informations supplementaire">
                <Textarea
                  label="bio"
                  type="text"
                  defaultValue={Bio}
                  name="Bio"
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setBio(Bio);
                    } else {
                      setBio(e.target.value);
                    }
                  }}
                  register={register}
                />
                <br />
                <Textinput
      label="Numéro d'agrément"
      type="text"
      defaultValue={agrement}
      name="Agrement"
      placeholder="agrement"
      onChange={(e) => {
        if (e.target.value === "") {
          setagrement(agrement)
        } else {
          setagrement(e.target.value)
        }
      }}
    
      register={register}
      />
                <br />
                <Textinput
                  label="Nombre d'années d'expérience"
                  type="number"
                  min="0"
                  defaultValue={annee}
                  name="Annees"
                  placeholder="annee"
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setannee(annee)
                    } else {
                      setannee(e.target.value)
                    }
                  }}
                 
                  register={register}
                />
              </Card>
            </div>
            <div style={{}}>
              <div>
                <button
                  className=" invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-green-200 dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
                  type="button"
                  onClick={handleButtonClick}
                >
                  Changer le catalogue
                </button>

                {/* Input caché */}
                <input
                  type="file"
                  ref={inputRef}
                  accept=".pdf"
                  style={{ display: "none" }} // Cache l'input
                  onChange={(e) => {
                    handleUpload2(e);
                  }}
                />
              </div>

              {Catalogue && ( <div style={{ width: 70 + "vw", height: 90 + "vh" }}>
               
                  <iframe src={Catalogue} width="100%" height="100%" />
              
              </div>  )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSaveClick}
            className="ml-2 p-1 bg-gray-500 text-white"
          >
            Enregister
          </button>
        </div>
      )}
    </div>
  );
};

export default profile;
