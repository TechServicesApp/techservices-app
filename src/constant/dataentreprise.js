export const menuItems = [
  {
    isHeadr: true,
    title: "ENTREPRISE BTP",
  },

  {
    title: "Demande",
    isHide: true,
    icon: "et:layers",
    link: "devis_en_attente",
  },
  {
    title: "Offre de service",
    icon: "material-symbols:new-label-sharp",
    link: "#",
    isHide: true,
    child: [
      {
        childtitle: "En evaluation",
        childlink: "devis_en_evaluation",
      },
      {
        childtitle: "Acceptée",
        childlink: "devis_accepte",
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
