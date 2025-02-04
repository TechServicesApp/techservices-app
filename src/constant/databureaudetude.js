
export const menuItems = [
    {
      isHeadr: true,
      title: "Bureau d'Etude BTP",
    },

    
  
  {
    title: "Demande de devis",
     isHide: true,
       icon: "et:layers",
       link: "demandedevis",
    },
   

      {
        title: "Offre de service",
        icon: "material-symbols:new-label-sharp",
        link: "#",
        isHide: true,
        child: [
          {
            childtitle: "En evaluation",
            childlink: "portfolio_en_evaluation",
          },
          {
            childtitle: "Acceptée",
            childlink: "offre_services",
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
  
 
  