export default function handler(req, res) {
  res.status(200).json({
    title: "LA STATION AWARDS",
    subtitle: "Votes anonymes. Un seul passage. Pas de retour en arrière.",
    deadline: "2026-05-25T23:59:00+02:00",
    participants: [
      "Adam",
      "Rayan",
      "Nene",
      "Didi",
      "Serkan",
      "Momo",
      "Inès",
      "Yanis",
      "Sofia",
      "Amine"
    ],
    categories: [
      {
        id: "presence",
        title: "La meilleure présence",
        description: "Celui ou celle qui ramène une vraie énergie dès qu'il/elle est là."
      },
      {
        id: "charisme",
        title: "Le plus charismatique",
        description: "Pas forcément le plus bruyant. Celui/celle qui capte l’attention."
      },
      {
        id: "drole",
        title: "Le/la plus drôle",
        description: "La personne qui sort les meilleures phrases sans forcer."
      },
      {
        id: "mysterieux",
        title: "Le/la plus mystérieux(se)",
        description: "Toujours là, jamais vraiment cerné(e)."
      },
      {
        id: "retour",
        title: "Le retour le plus légendaire",
        description: "Disparaît, revient, et fait comme si de rien n'était."
      },
      {
        id: "vocal",
        title: "Le/la boss du vocal",
        description: "Quand il/elle arrive, le vocal change directement."
      },
      {
        id: "debats",
        title: "Celui/celle qui lance les débats",
        description: "Une phrase, et tout le serveur part en réunion de crise."
      },
      {
        id: "style",
        title: "Le meilleur style",
        description: "Photo, tenue, vibe, manière d’être : ça dégage quelque chose."
      }
    ]
  });
}
