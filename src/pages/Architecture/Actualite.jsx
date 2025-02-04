import React, { useState, useEffect } from "react";
import InputGroup from "@/components/ui/InputGroup";
import Button from "@/components/ui/Button";
import { auth } from "@/firebaseconfig";

import { Afficheractualite } from "@/pages/EntreprisBTP/fonctions/Fonctionsannonces";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";

const Annonce = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterType, setFilterType] = useState(null); // État pour le filtre
  const navigate = useNavigate();

  useEffect(() => {
    const add = async () => {
      const a = await Afficheractualite({ id: auth.currentUser.uid });
      setPosts(a);
      setFilteredPosts(a); // Initialement, on affiche tout
      console.log(a);
    };
    add();
  }, []);

  // Fonction pour gérer le filtrage des posts
  const handleFilter = (type) => {
    setFilterType(type);
    if (type !== null) {
      const filtered = posts.filter((post) => post.typeAnnonce === type);
      setFilteredPosts(filtered);
    } else {
      // Si pas de filtre, on montre tous les posts
      setFilteredPosts(posts);
    }
  };

  return (
    <div className="space-y-5 divide-y divide-slate-100 dark:divide-slate-700 -mx-6">
      <div className="px-6">
        <InputGroup
          type="text"
          placeholder="Recherche...."
          append={
            <Button
              icon="heroicons-outline:search"
              className="btn-dark dark:bg-slate-600"
            />
          }
        />
      </div>

      {/* Boutons de filtre */}
      <div className="px-6 pt-4 flex space-x-2">
        <Button
          className={`btn ${
            filterType === "Formation" ? "btn-primary" : "btn-light"
          }`}
          onClick={() => handleFilter("Formation")}
        >
          Formation
        </Button>
        <Button
          className={`btn ${
            filterType === "Conseil" ? "btn-primary" : "btn-light"
          }`}
          onClick={() => handleFilter("Conseil")}
        >
          Conseil
        </Button>
        <Button
          className={`btn ${
            filterType === "Recrutement" ? "btn-primary" : "btn-light"
          }`}
          onClick={() => handleFilter("Recrutement")}
        >
          Recrutement
        </Button>
        <Button
          className="btn btn-light"
          onClick={() => handleFilter(null)} // Réinitialiser le filtre
        >
          Tout
        </Button>
      </div>

      <div className="pt-4 px-6 flex">
        <div className="pr-6">
          <div className="pt-4">
            <h4 className="text-slate-600 dark:text-slate-300 text-xl font-medium mb-4">
              Actualités
            </h4>
            <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 h-max">
              {filteredPosts.map((item, i) => (
                <Card key={i} bodyClass="p-4 rounded-md" className="group ">
                  <div className="flex items-center pb-4">
                    <div className="ltr:mr-[10px] rtl:ml-[10px]">
                      <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
                        <img
                          src={
                            item?.devisInfo?.logo || item?.devisInfo?.picture
                          }
                          alt=""
                          className="block w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex text-ellipsis whitespace-nowrap">
                      <span className="text-ellipsis whitespace-nowrap w-[85px] block">
                        {item?.devisInfo?.nom}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-[191px] flex flex-col justify-center items-center mb-3 rounded-md">
                    <div className="h-[191px]">
                      {item.typeFichier === "image" ? (
                        <img
                          className="h-full w-full"
                          src={item.fichier}
                          alt="media"
                        />
                      ) : (
                        <video className="h-full w-full" controls>
                          <source src={item.fichier} />
                        </video>
                      )}
                    </div>
                  </div>

                  <div>
                    <h6 className="text-slate-900 dark:text-slate-300 text-base font-medium mt-2 truncate">
                      {item.titre}
                    </h6>
                    <p className="text-slate-700 dark:text-slate-500 text-[11px] font-normal mt-1.5 line-clamp-3">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center pt-2">
                      <p className="text-xs text-slate-900 dark:text-slate-300 uppercase font-normal">
                        {new Date(
                          item.updated_at.seconds * 1000
                        ).toLocaleDateString()}
                      </p>

                      <span className="flex items-center text-slate-900 dark:text-slate-300 font-normal text-xs space-x-1 rtl:space-x-reverse">
                        <span>
                          {item?.devisInfo?.localisation ||
                            item?.devisInfo?.adresse}
                        </span>
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/voirplus/${item.id}`)}
                      className="btn-link"
                      style={{}}
                    >
                      voir plus
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="w-3/2 pl-1"></div>
      </div>
    </div>
  );
};

export default Annonce;
