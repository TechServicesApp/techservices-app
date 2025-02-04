import React, { Fragment, useState, useEffect } from "react";
import Accordion from "@/components/ui/Accordion";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { Tab } from "@headlessui/react";
import { Afficherplaintes,Envoyerreponse } from "./fonctions/fonctionsrequetes";
import { auth } from "@/firebaseconfig";

const faqmenus = [
  {
    title: "Requêtes ",
  },
  {
    title: "Requêtes resolues",
  },
  {
    title: "Requêtes non resolues ",
  },
];


const FaqPage = () => {
  // Variables d'état pour stocker les requêtes
  const [requetes, setrequetes] = useState([]);

  // Utilisation de useEffect pour déclencher la récupération des données lors du montage du composant
  useEffect(() => {
    const affecter = async () => {
      const a = await Afficherplaintes({
        recepteurCollection: "Quincaillerie",
        recepteurId: auth.currentUser.uid,
      });
      setrequetes(a);
      
    };

   affecter()
    const fetchDataInterval = setInterval( affecter, 50000); // recharge le tableau tous les 5 minutes
    
   
    return () => clearInterval(fetchDataInterval);
  }, []);

  return (
    <div translate="no">
      <Tab.Group>
        <div className="grid gap-5 grid-cols-12">
          <div className="xl:col-span-3 lg:col-span-4 col-span-12 card-auto-height">
            <Card>
              <Tab.List className="flex flex-col space-y-1 text-start items-start">
                {faqmenus.map((item, i) => (
                  <Tab key={i} as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={`focus:ring-0 focus:outline-none space-x-2 text-sm flex items-center w-full transition duration-150 px-3 py-4 rounded-[6px] rtl:space-x-reverse
                            ${
                              selected
                                ? "bg-slate-100 dark:bg-slate-900 dark:text-white"
                                : "bg-white dark:bg-slate-800 dark:text-slate-300"
                            }
                         `}
                        type="button"
                      >
                        <span
                          className={`
                              "text-lg",
                              ${
                                selected
                                  ? " opacity-100"
                                  : "opacity-50 dark:opacity-100"
                              }
                        `}
                        ></span>
                        <Icon icon="heroicons:chevron-double-right-solid" />
                        <span> {item.title}</span>
                      </button>
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </Card>
          </div>
          <div className="xl:col-span-9 lg:col-span-8 col-span-12">
            <Tab.Panels>
              <Tab.Panel>
                <Accordion items={requetes} />
              </Tab.Panel>
            </Tab.Panels>
          </div>
        </div>
      </Tab.Group>
    </div>
  );
};

export default FaqPage;
