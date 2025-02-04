export const menuItems = [
  {
    
    title: "ARCHITECTURE",
  },

 

  {
    title: "Demande",
    isHide: true,
    icon: "et:layers",
    link: "architecture_devis",
  },
  
  {
    title: "Offre de service",
    icon: "material-symbols:new-label-sharp",
    link: "#",
    isHide: true,
    child: [
      {
        childtitle: "En evaluation",
        childlink: "devis_en_evaluation_archi",
      },
      {
        childtitle: "Acceptée",
        childlink: "devis_accepte_archi",
      },
    ],
  },

 
  {
    title: "Annonce",
    icon: "streamline:annoncement-megaphone",
    link: "#",
    isHide: true,
    child: [
      {
        childtitle: "Mes annonces",
        childlink: "annonce",
      },
      {
        childtitle: "Actualité",
        childlink: "actualite",
      },
    ],
  },

 
  {
    title: "Agenda",
    isHide: true,
    icon: "heroicons-outline:calendar",
    link: "calender",
  },
  

  {
    title: "Profil",
    isHide: true,
    icon: "heroicons:user",
    link: "profil",
  },
];
