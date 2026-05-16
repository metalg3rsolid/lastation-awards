export default function handler(req, res) {
  res.status(200).json({
    title: "🏆 LA STATION AWARDS",
    subtitle: "Vote pour les membres dans plusieurs catégories : drôle, génant, bandeur, beau, pute, hypocrite… Les votes restent anonymes, les gagnants seront révélés à la fin.",
    deadline: "2026-05-20T23:59:00+02:00",
    participants: [
      "Adem",
      "Rayan",
      "Nene",
      "Didi",
      "Moussa",
      "Karim",
      "Waswi",
      "Soufiane",
      "Npbsom",
      "Flitch",
      "Hajar",
      "Terry",
      "Nami",
      "Assou",
      "Sabrina",
      "Helin",
      "Farah",
      "Shaïma",
      "Kytana"
      
    ],
    categories: [
      {
        id: "bandeur",
        title: "Le plus gros bandeur ou la plus grosse bandeuse",
        description: "Celui ou celle qui bande sur tout le monde, qui crois que Discord c'est pour hwi."
      },
      {
        id: "drole",
        title: "Le ou la plus drôle",
        description: "Celui ou celle qui est vraiment super drôle, super fun."
      },
      {
        id: "genant",
        title: "Le/la plus génant(e)",
        description: "La personne qui est juste trop chelou, grave bizarre, hyper génant"
      },
      {
        id: "beau",
        title: "Le/la plus beau/belle",
        description: "Celui ou celle qui est juste trop beau, super beau ou super belle, genre magnifique."
      },
      {
        id: "hypocrite",
        title: "Le plus ou la plus hypocrite ",
        description: "Gros ou grosse hypocrite qui parle derrière le dos des gens."
      },
      {
        id: "pute",
        title: "Le/la plus grosse pute du serveur",
        description: "Pas besoin d'expliquer."
      },
      {
        id: "moche",
        title: "Le/la plus moche du serveur",
        description: "Super moche, super horrible !"
      },
      {
        id: "inutile",
        title: "Le plus inutile",
        description: "Celui qui sert a rien dans le serveur on sait pas pourquoi elle/il est là"
      }
    ]
  });
}
