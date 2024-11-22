function parseHøringsfristToDate(data) {
  // Mapping Norwegian month names to English
  const monthMap = {
    januar: "January",
    februar: "February",
    mars: "March",
    april: "April",
    mai: "May",
    juni: "June",
    juli: "July",
    august: "August",
    september: "September",
    oktober: "October",
    november: "November",
    desember: "December",
  };

  // Preprocess the høringsfrist string
  let høringsfrist = data.høringsfrist;
  for (const [noMonth, enMonth] of Object.entries(monthMap)) {
    if (høringsfrist.includes(noMonth)) {
      høringsfrist = høringsfrist.replace(noMonth, enMonth);
      break; // Replace only the first matching month
    }
  }

  // Attempt to parse the date
  const parsedDate = new Date(høringsfrist);
  if (!isNaN(parsedDate)) {
    data.høringsfrist = parsedDate.toISOString(); // Convert to ISO 8601 format
  } else {
    console.warn(`Invalid date format in høringsfrist: ${data.høringsfrist}`);
    data.høringsfrist = null; // Set to null if parsing fails
  }
}

// Example usage
const jsonData = {
  county: "innlandet",
  hoeringTitle: "Bevaring av verdifull natur – Oppstart av verneprosesser",
  hoeringUrl:
    "https://www.statsforvalteren.no/nb/innlandet/horinger/2024/12/bevaring-av-verdifull-natur--oppstart-av-verneprosesser/",
  pdfUrl:
    "https://www.statsforvalteren.no/siteassets/fm-innlandet/06-miljo-og-klima/vern/oppstartvarsler/bevaring-av-verdifull-natur-gran-kommune/oppstartsmelding_jarenvatnet_skirstadtjernglorudtjern.pdf",
  pageTitle: "Høringer | Statsforvalteren i Innlandet",
  pageHeader: "Høringer",
  summary:
    "Statsforvalteren har sendt ut oppstartsmeldinger av verneprosesser for to områder i Gran kommune.",
  createdDate: "2024-10-24T07:59:59.000Z",
  høringsfrist: "1. desember 2024 23:59",
  pdfData: {
    m2m3: [],
    mudring: [],
    molo: [],
    sjøarbeid: [],
    utdyping: [],
    tildekking: [],
    utfylling: [],
    dykking: [],
    undervannsprenging: [],
    wordsFound: {
      "m³": {
        found: false,
        count: 0,
      },
      "m²": {
        found: false,
        count: 0,
      },
      mudring: {
        found: false,
        count: 0,
      },
      molo: {
        found: false,
        count: 0,
      },
      sjøarbeid: {
        found: false,
        count: 0,
      },
      utdyping: {
        found: false,
        count: 0,
      },
      tildekking: {
        found: false,
        count: 0,
      },
      utfylling: {
        found: false,
        count: 0,
      },
      dykking: {
        found: false,
        count: 0,
      },
      undervannsprenging: {
        found: false,
        count: 0,
      },
    },
  },
};

parseHøringsfristToDate(jsonData);

console.log(jsonData);
