import React, { useState, useEffect } from "react";
import InputGroup from "@/components/ui/InputGroup";
import Button from "@/components/ui/Button";
import { auth, imgdb } from "@/firebaseconfig";
import { Afficherannonce } from "./fonctions/Fonctionsannonces";
import { Navigate, useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { ajoutSuppri } from "./fonctions/Fonctionslike";

const Annonce = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterType, setFilterType] = useState(null); // État pour le filtre
  const [filterType1, setFilterType1] = useState(null); // État pour le filtre
  const navigate = useNavigate();

 
  useEffect(() => {
    const add = async () => {
      const a = await Afficherannonce({ id: auth.currentUser.uid });
     
      setPosts(a);
     
      setFilteredPosts(a); // Initialement, on affiche tout
    };
    add();
  }, []);

  

  const handleFilter = (type, statut,posts) => {
    setFilterType(type);
    setFilterType1(statut);
   

    if (type !== null && statut === null) {
      const filtered = posts.filter((post) => post.typeAnnonce === type);
      setFilteredPosts(filtered);
    } else if (statut !== null && type === null) {
      const filtered = posts.filter((post) => post.statut === statut);
      setFilteredPosts(filtered);
    } else if (statut !== null && type !== null) {
      const filtered = posts.filter(
        (post) => post.typeAnnonce === type && post.statut === statut
      );
      setFilteredPosts(filtered);
    } else {
      // Si pas de filtre, on montre tous les posts
      setFilteredPosts(posts);
    }
  };

  return (
    <div className=" space-y-5 divide-y divide-slate-100 dark:divide-slate-700 -mx-6">
   
      <div  className="grid grid-cols-12 gap-6">
      <div
					className=" lg:col-span-3 col-span-12  w-100 m-5  text-[#067BBF] "
					style={{ marginBottom: 150 + "px" }}
				>
         

          <div className={`grid 
              grid-cols-1 gap-4   // 2 colonnes par défaut (pour téléphones/tablettes)
              lg:grid-cols-1 lg:gap-6  // 1 colonne sur les écrans larges
            
               lg:h-70 lg:fixed lg:w-[87%],
              bg-white px-3 pt-5 pb-40 lg:pb-[400px] rounded-md`}
						style={{
							position: "fixed", // Sticky pour téléphones et tablettes
							top: 100 + "px", // Assure le positionnement sticky en haut
bottom:0+'px',
							height: 200 + "px",
							zIndex: 3000,
						}}>

          <Button
              icon="heroicons-outline:search"
              className="btn-primary dark:bg-slate-600 text-[12px] "
              onClick={() => {
                navigate("/formulaireannonce");
              }}
            >
              {" "}
              Publier une annonce
            </Button>
            <div className={`grid 
              grid-cols-4 gap-2 
              lg:grid-cols-2 lg:gap-4 w-100`} >
            <Button
              className={` text-[12px] btn btn-sm ${
                filterType1 === 1 ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {handleFilter(filterType, 1,posts),
                setFilterType1(1)
              }}
            >
              En attente
            </Button>
            <Button
              className={`btn text-[12px] btn-sm ${
                filterType1 === 0 ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {handleFilter(filterType, 0,posts),
                setFilterType1(0)
              }}
            >
              Refusée
            </Button>
            <Button
              className={`btn text-[12px] btn-sm ${
                filterType1 === 2 ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {handleFilter(filterType, 2,posts),
                setFilterType1(2)
              }}
            >
              acceptée
            </Button>
            <Button
              className="btn text-[12px] btn-sm btn-outline-primary"
              onClick={() =>{ handleFilter(filterType, null,posts),
                setFilterType1(null)
              }}
            >
              Tout
            </Button>
            </div>
            <div className={`grid  grid-cols-4 gap-2 
              lg:grid-cols-2 lg:gap-4 w-100 `} >
            <Button
              className={`btn btn-sm text-[12px] ${
                filterType === "Formation" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {handleFilter("Formation", filterType1,posts),
                setFilterType("Formation")
              }}
            >
              Formation
            </Button>
            <Button
              className={`btn btn-sm text-[12px] ${
                filterType === "Conseil" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {handleFilter("Conseil", filterType1,posts),
                setFilterType("Conseil")
              }}
            >
              Conseil
            </Button>
            <Button
              className={`btn btn-sm text-[12px] ${
                filterType === "Recrutement" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() =>{ handleFilter("Recrutement", filterType1,posts),
                setFilterType('Recrutement')
              }}
            >
              Recrutement
            </Button>
            <Button
              className="btn btn-sm text-[12px] btn-outline-primary"
              onClick={() => {handleFilter(null, filterType1,posts),
                setFilterType(null)
              }} // Réinitialiser le filtre
            >
              Tout
            </Button>
            </div>
          </div>
          </div>
          <div className="lg:col-span-9 col-span-12  pt-4 px-6 flex actualites-section">
					<div className="pr-6">
						<div className="">
							<div className="flex flex-wrap -mx-2">
								{filteredPosts.map((item, i) => (
									<div
										key={i}
										className="w-full  " // Largeur 1/3 sur écrans larges
									>
										<Card
											key={i}
											bodyClass=" pl-7 pr-7 pt-3 pb-10 rounded-md"
											className="group "
											style={{ padding: "20px" }}
										>
											<div className="flex items-center pb-4 mt-3">
												<div className="ltr:mr-[10px] rtl:ml-[10px]">
													<div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
														<img
															src={
																item?.devisInfo?.logo ||
																item?.devisInfo?.picture
															}
															alt=""
															className="block w-full h-full object-cover rounded-full"
														/>
													</div>
												</div>
												<div className=" text-slate-600 dark:text-white text-sm font-normal items-center text-ellipsis whitespace-nowrap">
													<p className="text-ellipsis whitespace-nowrap w-[85px] block">
														{item?.devisInfo?.nom}
													</p>
													<p className="text-[11px]  text-slate-400 dark:text-slate-300 uppercase font-normal">
														{new Date(
															item.updated_at.seconds * 1000
														).toLocaleDateString()}
														,
														{item?.devisInfo?.localisation ||
															item?.devisInfo?.adresse}
													</p>
												</div>
											</div>
											<div className="p-4">
												<h6 className="text-slate-900 dark:text-slate-300 text-base font-medium mt-2 truncate">
													{item.titre}
												</h6>
												<p className="text-slate-700 dark:text-slate-500 text-[12px] font-normal mt-1.5 line-clamp-3">
													{item.description}
												</p>

												<div className="flex justify-between items-center pt-2"></div>
											</div>
											<div className="relative h-[400px] flex flex-col justify-center items-center mb-3 rounded-md">
												<div className="w-full h-full">
													{item.typeFichier === "image" ? (
														<img
															className="h-full w-full object-cover rounded-md"
															src={item.fichier}
															alt="media"
															style={{
																maxHeight: "400px", // Limite la hauteur maximale
																maxWidth: "100%", // Limite la largeur maximale
																objectFit: "cover", // Assure que l'image conserve son ratio
															}}
														/>
													) : (
														<video
															className="h-full w-full rounded-md"
															controls
															style={{
																maxHeight: "400px", // Limite la hauteur maximale pour les vidéos
																maxWidth: "100%", // Limite la largeur maximale
															}}
														>
															<source src={item.fichier} />
														</video>
													)}
												</div>
											</div>

											<div className="flex text-[11px] flex-col space-y-2 p-4 ">
												{/* Interaction Bar */}
												<div className="flex justify-end items-center border-t border-gray-300 pt-2">
													{/* Likes */}
													<div
														className="flex items-center space-x-1 cursor-pointer"
														onClick={async () => {

														
															
                                const post  = posts.map((p) => {
                                  if (p.id === item.id) {
                                    const newLikeState = p.like === 1 ? 0 : 1; // Inverser l'état du like
                                    return {
                                      ...p,
                                      like: newLikeState,
                                      likes: newLikeState === 1 ? p.likes + 1 : p.likes - 1,
                                    };
                                  }return p;
                                });
                                console.log(post)
																setPosts(post);
                                handleFilter(filterType,filterType1,post)
                                await ajoutSuppri({
                                  id: item.id,
                                });
                                
                                
															
														}}
													>
														<Icon
															icon={
																item.like > 0
																	? "flat-color-icons:like"
																	: "heroicons:heart"
															}
															width="20"
															height="20"
															className={`${
																item.like > 0
																	? "text-blue-500"
																	: "text-gray-400"
															} transition-transform transform hover:scale-125`}
														/>
														<span className="text-[11px] text-gray-600">
															{item.likes} Like(s)
														</span>
													</div>

													{/* Comments */}
													<div
														className="flex items-center ml-4 mr-4 space-x-1 cursor-pointer"
														onClick={() => navigate(`/voirplus/${item.id}`)}
													>
														<Icon
															icon="iconamoon:comment-thin"
															width="20"
															height="20"
															className="text-gray-400 hover:scale-125 transition-transform"
														/>
														<span className="text-[11px] text-gray-600">
															{item.commentaire}{" "}
															{item.commentaire > 1
																? "Commentaires"
																: "Commentaire"}
														</span>
													</div>

													{/* Voir Plus */}
													<button
														onClick={() => navigate(`/voirplus/${item.id}`)}
														className="bg-blue-500 text-white text-[11px] px-3 py-1 rounded-full shadow hover:bg-blue-600 transition duration-200"
													>
														Voir Plus
													</button>
												</div>
											</div>
										</Card>
										<br />
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="w-3/2 pl-1"></div>
				</div>
			</div>
		</div>
  );
};

export default Annonce;
