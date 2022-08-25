import React from "react"

export const languages = {
  it: {
    size: "Dimensione",
    gloveType: "Tipo di guanto",
    pallet :"Pallet",
    packaging:"Imballaggio",
    ecolabel:"Etichetta ecologica",
    biodegradable:"Biodegradabile",
    sanitizer:"Sanificatore",
    haccp : "HACCP",
    detergentType:"Tipo di detergente",
    detergentUsage: "Uso del detergente",
    locale: "it",
    discoverMore: "Scopri di più",
    all: "Tutti",
    search: "Cerca",
    results: "risultati",
    noResults: "Nessun risultato",
    download: "Scarica",
    latestArticles: "Ultime news",
    followUs:"Seguici su",
    formInputTexts: {
      fullName: "Full name",
      company : "Company",
      address: "Street",
      city : "City",
      province : "Province",
      zipCode : "Zip Code",
      phone: "Phone",
      message: "Message"
    }
  },
}

export const i18nContext = React.createContext(languages.it)
