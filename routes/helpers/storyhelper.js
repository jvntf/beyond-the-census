var tell = function (data, callback) {


  // lookup tables
  var placeBornLookup = [
    {
      "key": 1,
      "value": "Alabama"
    },
    {
      "key": 2,
      "value": "Alaska"
    },
    {
      "key": 4,
      "value": "Arizona"
    },
    {
      "key": 5,
      "value": "Arkansas"
    },
    {
      "key": 6,
      "value": "California"
    },
    {
      "key": 8,
      "value": "Colorado"
    },
    {
      "key": 9,
      "value": "Connecticut"
    },
    {
      "key": 10,
      "value": "Delaware"
    },
    {
      "key": 11,
      "value": "Washington D.C."
    },
    {
      "key": 12,
      "value": "Florida"
    },
    {
      "key": 13,
      "value": "Georgia"
    },
    {
      "key": 15,
      "value": "Hawaii"
    },
    {
      "key": 16,
      "value": "Idaho"
    },
    {
      "key": 17,
      "value": "Illinois"
    },
    {
      "key": 18,
      "value": "Indiana"
    },
    {
      "key": 19,
      "value": "Iowa"
    },
    {
      "key": 20,
      "value": "Kansas"
    },
    {
      "key": 21,
      "value": "Kentucky"
    },
    {
      "key": 22,
      "value": "Louisiana"
    },
    {
      "key": 23,
      "value": "Maine"
    },
    {
      "key": 24,
      "value": "Maryland"
    },
    {
      "key": 25,
      "value": "Massachusetts"
    },
    {
      "key": 26,
      "value": "Michigan"
    },
    {
      "key": 27,
      "value": "Minnesota"
    },
    {
      "key": 28,
      "value": "Mississippi"
    },
    {
      "key": 29,
      "value": "Missouri"
    },
    {
      "key": 30,
      "value": "Montana"
    },
    {
      "key": 31,
      "value": "Nebraska"
    },
    {
      "key": 32,
      "value": "Nevada"
    },
    {
      "key": 33,
      "value": "New Hampshire"
    },
    {
      "key": 34,
      "value": "New Jersey"
    },
    {
      "key": 35,
      "value": "New Mexico"
    },
    {
      "key": 36,
      "value": "New York"
    },
    {
      "key": 37,
      "value": "North Carolina"
    },
    {
      "key": 38,
      "value": "North Dakota"
    },
    {
      "key": 39,
      "value": "Ohio"
    },
    {
      "key": 40,
      "value": "Oklahoma"
    },
    {
      "key": 41,
      "value": "Oregon"
    },
    {
      "key": 42,
      "value": "Pennsylvania"
    },
    {
      "key": 44,
      "value": "Rhode Island"
    },
    {
      "key": 45,
      "value": "South Carolina"
    },
    {
      "key": 46,
      "value": "South Dakota"
    },
    {
      "key": 47,
      "value": "Tennessee"
    },
    {
      "key": 48,
      "value": "Texas"
    },
    {
      "key": 49,
      "value": "Utah"
    },
    {
      "key": 50,
      "value": "Vermont"
    },
    {
      "key": 51,
      "value": "Virginia"
    },
    {
      "key": 53,
      "value": "Washington"
    },
    {
      "key": 54,
      "value": "West Virginia"
    },
    {
      "key": 55,
      "value": "Wisconsin"
    },
    {
      "key": 56,
      "value": "Wyoming"
    },
    {
      "key": 60,
      "value": "American Samoa"
    },
    {
      "key": 66,
      "value": "Guam"
    },
    {
      "key": 69,
      "value": "the Northern Mariana Islands"
    },
    {
      "key": 72,
      "value": "Puerto Rico"
    },
    {
      "key": 78,
      "value": "the US Virgin Islands"
    },
    {
      "key": 100,
      "value": "Albania"
    },
    {
      "key": 102,
      "value": "Austria"
    },
    {
      "key": 103,
      "value": "Belgium"
    },
    {
      "key": 104,
      "value": "Bulgaria"
    },
    {
      "key": 105,
      "value": "Czechoslovakia"
    },
    {
      "key": 106,
      "value": "Denmark"
    },
    {
      "key": 108,
      "value": "Finland"
    },
    {
      "key": 109,
      "value": "France"
    },
    {
      "key": 110,
      "value": "Germany"
    },
    {
      "key": 116,
      "value": "Greece"
    },
    {
      "key": 117,
      "value": "Hungary"
    },
    {
      "key": 118,
      "value": "Iceland"
    },
    {
      "key": 119,
      "value": "Ireland"
    },
    {
      "key": 120,
      "value": "Italy"
    },
    {
      "key": 126,
      "value": "the Netherlands"
    },
    {
      "key": 127,
      "value": "Norway"
    },
    {
      "key": 128,
      "value": "Poland"
    },
    {
      "key": 129,
      "value": "Portugal"
    },
    {
      "key": 130,
      "value": "the Azores Islands"
    },
    {
      "key": 132,
      "value": "Romania"
    },
    {
      "key": 134,
      "value": "Spain"
    },
    {
      "key": 136,
      "value": "Sweden"
    },
    {
      "key": 137,
      "value": "Switzerland"
    },
    {
      "key": 138,
      "value": "the United Kingdom"
    },
    {
      "key": 139,
      "value": "England"
    },
    {
      "key": 140,
      "value": "Scotland"
    },
    {
      "key": 147,
      "value": "Yugoslavia"
    },
    {
      "key": 148,
      "value": "the Czech Republic"
    },
    {
      "key": 149,
      "value": "Slovakia"
    },
    {
      "key": 150,
      "value": "Bosnia/Herzegovina"
    },
    {
      "key": 151,
      "value": "Croatia"
    },
    {
      "key": 152,
      "value": "Macedonia"
    },
    {
      "key": 154,
      "value": "Serbia"
    },
    {
      "key": 156,
      "value": "Latvia"
    },
    {
      "key": 157,
      "value": "Lithuania"
    },
    {
      "key": 158,
      "value": "Armenia"
    },
    {
      "key": 159,
      "value": "Azerbaijan"
    },
    {
      "key": 160,
      "value": "Belarus"
    },
    {
      "key": 161,
      "value": "Georgia"
    },
    {
      "key": 162,
      "value": "Moldova"
    },
    {
      "key": 163,
      "value": "Russia"
    },
    {
      "key": 164,
      "value": "Ukraine"
    },
    {
      "key": 165,
      "value": "the USSR"
    },
    {
      "key": 168,
      "value": "Montenegro"
    },
    {
      "key": 169,
      "value": "Europe"
    },
    {
      "key": 200,
      "value": "Afghanistan"
    },
    {
      "key": 202,
      "value": "Bangladesh"
    },
    {
      "key": 203,
      "value": "Bhutan"
    },
    {
      "key": 205,
      "value": "Myanmar"
    },
    {
      "key": 206,
      "value": "Cambodia"
    },
    {
      "key": 207,
      "value": "China"
    },
    {
      "key": 208,
      "value": "Cyprus"
    },
    {
      "key": 209,
      "value": "Hong Kong"
    },
    {
      "key": 210,
      "value": "India"
    },
    {
      "key": 211,
      "value": "Indonesia"
    },
    {
      "key": 212,
      "value": "Iran"
    },
    {
      "key": 213,
      "value": "Iraq"
    },
    {
      "key": 214,
      "value": "Israel"
    },
    {
      "key": 215,
      "value": "Japan"
    },
    {
      "key": 216,
      "value": "Jordan"
    },
    {
      "key": 217,
      "value": "Korea"
    },
    {
      "key": 218,
      "value": "Kazakhstan"
    },
    {
      "key": 222,
      "value": "Kuwait"
    },
    {
      "key": 223,
      "value": "Laos"
    },
    {
      "key": 224,
      "value": "Lebanon"
    },
    {
      "key": 226,
      "value": "Malaysia"
    },
    {
      "key": 229,
      "value": "Nepal"
    },
    {
      "key": 231,
      "value": "Pakistan"
    },
    {
      "key": 233,
      "value": "the Philippines"
    },
    {
      "key": 235,
      "value": "Saudi Arabia"
    },
    {
      "key": 236,
      "value": "Singapore"
    },
    {
      "key": 238,
      "value": "Sri Lanka"
    },
    {
      "key": 239,
      "value": "Syria"
    },
    {
      "key": 240,
      "value": "Taiwan"
    },
    {
      "key": 242,
      "value": "Thailand"
    },
    {
      "key": 243,
      "value": "Turkey"
    },
    {
      "key": 245,
      "value": "the United Arab Emirates"
    },
    {
      "key": 246,
      "value": "Uzbekistan"
    },
    {
      "key": 247,
      "value": "Vietnam"
    },
    {
      "key": 248,
      "value": "Yemen"
    },
    {
      "key": 249,
      "value": "Asia"
    },
    {
      "key": 253,
      "value": "South Asia"
    },
    {
      "key": 254,
      "value": "Asia"
    },
    {
      "key": 300,
      "value": "Bermuda"
    },
    {
      "key": 301,
      "value": "Canada"
    },
    {
      "key": 303,
      "value": "Mexico"
    },
    {
      "key": 310,
      "value": "Belize"
    },
    {
      "key": 311,
      "value": "Costa Rica"
    },
    {
      "key": 312,
      "value": "El Salvador"
    },
    {
      "key": 313,
      "value": "Guatemala"
    },
    {
      "key": 314,
      "value": "Honduras"
    },
    {
      "key": 315,
      "value": "Nicaragua"
    },
    {
      "key": 316,
      "value": "Panama"
    },
    {
      "key": 321,
      "value": "Antigua & Barbuda"
    },
    {
      "key": 323,
      "value": "the Bahamas"
    },
    {
      "key": 324,
      "value": "Barbados"
    },
    {
      "key": 327,
      "value": "Cuba"
    },
    {
      "key": 328,
      "value": "Dominica"
    },
    {
      "key": 329,
      "value": "the Dominican Republic"
    },
    {
      "key": 330,
      "value": "Grenada"
    },
    {
      "key": 332,
      "value": "Haiti"
    },
    {
      "key": 333,
      "value": "Jamaica"
    },
    {
      "key": 339,
      "value": "St. Lucia"
    },
    {
      "key": 340,
      "value": "St. Vincent & the Grenadines"
    },
    {
      "key": 341,
      "value": "Trinidad & Tobago"
    },
    {
      "key": 343,
      "value": "the West Indies"
    },
    {
      "key": 344,
      "value": "the Caribbean"
    },
    {
      "key": 360,
      "value": "Argentina"
    },
    {
      "key": 361,
      "value": "Bolivia"
    },
    {
      "key": 362,
      "value": "Brazil"
    },
    {
      "key": 363,
      "value": "Chile"
    },
    {
      "key": 364,
      "value": "Colombia"
    },
    {
      "key": 365,
      "value": "Ecuador"
    },
    {
      "key": 368,
      "value": "Guyana"
    },
    {
      "key": 369,
      "value": "Paraguay"
    },
    {
      "key": 370,
      "value": "Peru"
    },
    {
      "key": 372,
      "value": "Uruguay"
    },
    {
      "key": 373,
      "value": "Venezuela"
    },
    {
      "key": 374,
      "value": "South America"
    },
    {
      "key": 399,
      "value": "the Americas"
    },
    {
      "key": 400,
      "value": "Algeria"
    },
    {
      "key": 407,
      "value": "Cameroon"
    },
    {
      "key": 408,
      "value": "Cabo Verde"
    },
    {
      "key": 412,
      "value": "Congo"
    },
    {
      "key": 414,
      "value": "Egypt"
    },
    {
      "key": 416,
      "value": "Ethiopia"
    },
    {
      "key": 417,
      "value": "Eritrea"
    },
    {
      "key": 420,
      "value": "the Gambia"
    },
    {
      "key": 421,
      "value": "Ghana"
    },
    {
      "key": 423,
      "value": "Guinea"
    },
    {
      "key": 427,
      "value": "Kenya"
    },
    {
      "key": 429,
      "value": "Liberia"
    },
    {
      "key": 430,
      "value": "Libya"
    },
    {
      "key": 436,
      "value": "Morocco"
    },
    {
      "key": 440,
      "value": "Nigeria"
    },
    {
      "key": 444,
      "value": "Senegal"
    },
    {
      "key": 447,
      "value": "Sierra Leone"
    },
    {
      "key": 448,
      "value": "Somalia"
    },
    {
      "key": 449,
      "value": "South Africa"
    },
    {
      "key": 451,
      "value": "Sudan"
    },
    {
      "key": 453,
      "value": "Tanzania"
    },
    {
      "key": 454,
      "value": "Togo"
    },
    {
      "key": 457,
      "value": "Uganda"
    },
    {
      "key": 459,
      "value": "the Democratic Republic of Congo"
    },
    {
      "key": 460,
      "value": "Zambia"
    },
    {
      "key": 461,
      "value": "Zimbabwe"
    },
    {
      "key": 462,
      "value": "Africa"
    },
    {
      "key": 463,
      "value": "East Africa"
    },
    {
      "key": 464,
      "value": "North Africa"
    },
    {
      "key": 467,
      "value": "West Africa"
    },
    {
      "key": 468,
      "value": "Africa"
    },
    {
      "key": 501,
      "value": "Australia"
    },
    {
      "key": 508,
      "value": "Fiji"
    },
    {
      "key": 511,
      "value": "the Marshall Islands"
    },
    {
      "key": 512,
      "value": "Micronesia"
    },
    {
      "key": 515,
      "value": "New Zealand"
    },
    {
      "key": 523,
      "value": "Tonga"
    },
    {
      "key": 527,
      "value": "Samoa"
    },
    {
      "key": 554,
      "value": "the ocean"
    },
    {
      "key": -9,
      "value": ""
    }
  ]
  var englishAbilityLookup = [
    {
      "key": 1,
      "value": "speak English very well"
    },
    {
      "key": 2,
      "value": "speak English well"
    },
    {
      "key": 3,
      "value": "do not speak English that well"
    },
    {
      "key": 4,
      "value": "can't speak any English"
    }
  ]
  var ancestryLookup = [
    {
      "key": 1,
      "value": "Alsatian"
    },
    {
      "key": 3,
      "value": "Austrian"
    },
    {
      "key": 5,
      "value": "Basque"
    },
    {
      "key": 8,
      "value": "Belgian"
    },
    {
      "key": 9,
      "value": "Flemish"
    },
    {
      "key": 11,
      "value": "British"
    },
    {
      "key": 12,
      "value": "British Isles"
    },
    {
      "key": 20,
      "value": "Danish"
    },
    {
      "key": 21,
      "value": "Dutch"
    },
    {
      "key": 22,
      "value": "English"
    },
    {
      "key": 24,
      "value": "Finnish"
    },
    {
      "key": 26,
      "value": "French"
    },
    {
      "key": 32,
      "value": "German"
    },
    {
      "key": 40,
      "value": "Prussian"
    },
    {
      "key": 46,
      "value": "Greek"
    },
    {
      "key": 49,
      "value": "Icelander"
    },
    {
      "key": 50,
      "value": "Irish"
    },
    {
      "key": 51,
      "value": "Italian"
    },
    {
      "key": 68,
      "value": "Sicilian"
    },
    {
      "key": 77,
      "value": "Luxemburger"
    },
    {
      "key": 78,
      "value": "Maltese"
    },
    {
      "key": 82,
      "value": "Norwegian"
    },
    {
      "key": 84,
      "value": "Portuguese"
    },
    {
      "key": 87,
      "value": "Scotch Irish"
    },
    {
      "key": 88,
      "value": "Scottish"
    },
    {
      "key": 89,
      "value": "Swedish"
    },
    {
      "key": 91,
      "value": "Swiss"
    },
    {
      "key": 94,
      "value": "Irish Scotch"
    },
    {
      "key": 97,
      "value": "Welsh"
    },
    {
      "key": 98,
      "value": "Scandinavian"
    },
    {
      "key": 99,
      "value": "Celtic"
    },
    {
      "key": 100,
      "value": "Albanian"
    },
    {
      "key": 102,
      "value": "Belorussian"
    },
    {
      "key": 103,
      "value": "Bulgarian"
    },
    {
      "key": 109,
      "value": "Croatian"
    },
    {
      "key": 111,
      "value": "Czech"
    },
    {
      "key": 112,
      "value": "Bohemian"
    },
    {
      "key": 114,
      "value": "Czechoslovakian"
    },
    {
      "key": 115,
      "value": "Estonian"
    },
    {
      "key": 122,
      "value": "German Russian"
    },
    {
      "key": 124,
      "value": "Rom"
    },
    {
      "key": 125,
      "value": "Hungarian"
    },
    {
      "key": 128,
      "value": "Latvian"
    },
    {
      "key": 129,
      "value": "Lithuanian"
    },
    {
      "key": 130,
      "value": "Macedonian"
    },
    {
      "key": 131,
      "value": "Montenegrin"
    },
    {
      "key": 142,
      "value": "Polish"
    },
    {
      "key": 144,
      "value": "Romanian"
    },
    {
      "key": 146,
      "value": "Moldavian"
    },
    {
      "key": 148,
      "value": "Russian"
    },
    {
      "key": 152,
      "value": "Serbian"
    },
    {
      "key": 153,
      "value": "Slovak"
    },
    {
      "key": 154,
      "value": "Slovene"
    },
    {
      "key": 168,
      "value": "Turkestani"
    },
    {
      "key": 169,
      "value": "Uzbeg"
    },
    {
      "key": 170,
      "value": "Georgia CIS"
    },
    {
      "key": 171,
      "value": "Ukrainian"
    },
    {
      "key": 176,
      "value": "Yugoslavian"
    },
    {
      "key": 177,
      "value": "Bosnian and Herzegovinian"
    },
    {
      "key": 178,
      "value": "Slavic"
    },
    {
      "key": 179,
      "value": "Slavonian"
    },
    {
      "key": 181,
      "value": "Central European"
    },
    {
      "key": 183,
      "value": "Northern European"
    },
    {
      "key": 185,
      "value": "Southern European"
    },
    {
      "key": 187,
      "value": "Western European"
    },
    {
      "key": 190,
      "value": "Eastern European"
    },
    {
      "key": 194,
      "value": "Germanic"
    },
    {
      "key": 195,
      "value": "European"
    },
    {
      "key": 200,
      "value": "Spaniard"
    },
    {
      "key": 210,
      "value": "Mexican"
    },
    {
      "key": 211,
      "value": "Mexican American"
    },
    {
      "key": 212,
      "value": "Mexicano"
    },
    {
      "key": 213,
      "value": "Chicano"
    },
    {
      "key": 215,
      "value": "Mexican American Indian"
    },
    {
      "key": 218,
      "value": "Mexican State"
    },
    {
      "key": 219,
      "value": "Mexican Indian"
    },
    {
      "key": 221,
      "value": "Costa Rican"
    },
    {
      "key": 222,
      "value": "Guatemalan"
    },
    {
      "key": 223,
      "value": "Honduran"
    },
    {
      "key": 224,
      "value": "Nicaraguan"
    },
    {
      "key": 225,
      "value": "Panamanian"
    },
    {
      "key": 226,
      "value": "Salvadoran"
    },
    {
      "key": 227,
      "value": "Central American"
    },
    {
      "key": 231,
      "value": "Argentinean"
    },
    {
      "key": 232,
      "value": "Bolivian"
    },
    {
      "key": 233,
      "value": "Chilean"
    },
    {
      "key": 234,
      "value": "Colombian"
    },
    {
      "key": 235,
      "value": "Ecuadorian"
    },
    {
      "key": 236,
      "value": "Paraguayan"
    },
    {
      "key": 237,
      "value": "Peruvian"
    },
    {
      "key": 238,
      "value": "Uruguayan"
    },
    {
      "key": 239,
      "value": "Venezuelan"
    },
    {
      "key": 249,
      "value": "South American"
    },
    {
      "key": 250,
      "value": "Latin American"
    },
    {
      "key": 251,
      "value": "Latin"
    },
    {
      "key": 252,
      "value": "Latino"
    },
    {
      "key": 261,
      "value": "Puerto Rican"
    },
    {
      "key": 271,
      "value": "Cuban"
    },
    {
      "key": 275,
      "value": "Dominican"
    },
    {
      "key": 290,
      "value": "Hispanic"
    },
    {
      "key": 291,
      "value": "Spanish"
    },
    {
      "key": 295,
      "value": "Spanish American"
    },
    {
      "key": 300,
      "value": "Bahamian"
    },
    {
      "key": 301,
      "value": "Barbadian"
    },
    {
      "key": 302,
      "value": "Belizean"
    },
    {
      "key": 308,
      "value": "Jamaican"
    },
    {
      "key": 310,
      "value": "Dutch West Indian"
    },
    {
      "key": 314,
      "value": "Trinidadian Tobagonian"
    },
    {
      "key": 322,
      "value": "British West Indian"
    },
    {
      "key": 325,
      "value": "Antigua and Barbuda"
    },
    {
      "key": 329,
      "value": "Grenadian"
    },
    {
      "key": 330,
      "value": "Vincent-Grenadine Islander"
    },
    {
      "key": 331,
      "value": "St Lucia Islander"
    },
    {
      "key": 335,
      "value": "West Indian"
    },
    {
      "key": 336,
      "value": "Haitian"
    },
    {
      "key": 359,
      "value": "Other West Indian"
    },
    {
      "key": 360,
      "value": "Brazilian"
    },
    {
      "key": 370,
      "value": "Guyanese"
    },
    {
      "key": 400,
      "value": "Algerian"
    },
    {
      "key": 402,
      "value": "Egyptian"
    },
    {
      "key": 406,
      "value": "Moroccan"
    },
    {
      "key": 411,
      "value": "North African"
    },
    {
      "key": 416,
      "value": "Iranian"
    },
    {
      "key": 417,
      "value": "Iraqi"
    },
    {
      "key": 419,
      "value": "Israeli"
    },
    {
      "key": 421,
      "value": "Jordanian"
    },
    {
      "key": 425,
      "value": "Lebanese"
    },
    {
      "key": 427,
      "value": "Saudi Arabian"
    },
    {
      "key": 429,
      "value": "Syrian"
    },
    {
      "key": 431,
      "value": "Armenian"
    },
    {
      "key": 434,
      "value": "Turkish"
    },
    {
      "key": 435,
      "value": "Yemeni"
    },
    {
      "key": 442,
      "value": "Kurdish"
    },
    {
      "key": 465,
      "value": "Palestinian"
    },
    {
      "key": 483,
      "value": "Assyrian"
    },
    {
      "key": 484,
      "value": "Chaldean"
    },
    {
      "key": 490,
      "value": "Mideast"
    },
    {
      "key": 495,
      "value": "Arab"
    },
    {
      "key": 496,
      "value": "Arabic"
    },
    {
      "key": 499,
      "value": "Other Arab"
    },
    {
      "key": 508,
      "value": "Cameroonian"
    },
    {
      "key": 510,
      "value": "Cape Verdean"
    },
    {
      "key": 515,
      "value": "Congolese"
    },
    {
      "key": 522,
      "value": "Ethiopian"
    },
    {
      "key": 523,
      "value": "Eritrean"
    },
    {
      "key": 529,
      "value": "Ghanaian"
    },
    {
      "key": 534,
      "value": "Kenyan"
    },
    {
      "key": 541,
      "value": "Liberian"
    },
    {
      "key": 553,
      "value": "Nigerian"
    },
    {
      "key": 564,
      "value": "Senegalese"
    },
    {
      "key": 566,
      "value": "Sierra Leonean"
    },
    {
      "key": 568,
      "value": "Somali"
    },
    {
      "key": 570,
      "value": "South African"
    },
    {
      "key": 576,
      "value": "Sudanese"
    },
    {
      "key": 587,
      "value": "Other Subsaharan African"
    },
    {
      "key": 588,
      "value": "Ugandan"
    },
    {
      "key": 598,
      "value": "Western African"
    },
    {
      "key": 599,
      "value": "African"
    },
    {
      "key": 600,
      "value": "Afghan"
    },
    {
      "key": 603,
      "value": "Bangladeshi"
    },
    {
      "key": 607,
      "value": "Bhutanese"
    },
    {
      "key": 609,
      "value": "Nepali"
    },
    {
      "key": 615,
      "value": "Asian Indian"
    },
    {
      "key": 618,
      "value": "Bengali"
    },
    {
      "key": 620,
      "value": "East Indian"
    },
    {
      "key": 650,
      "value": "Punjabi"
    },
    {
      "key": 680,
      "value": "Pakistani"
    },
    {
      "key": 690,
      "value": "Sri Lankan"
    },
    {
      "key": 700,
      "value": "Burmese"
    },
    {
      "key": 703,
      "value": "Cambodian"
    },
    {
      "key": 706,
      "value": "Chinese"
    },
    {
      "key": 707,
      "value": "Cantonese"
    },
    {
      "key": 712,
      "value": "Mongolian"
    },
    {
      "key": 714,
      "value": "Tibetan"
    },
    {
      "key": 720,
      "value": "Filipino"
    },
    {
      "key": 730,
      "value": "Indonesian"
    },
    {
      "key": 740,
      "value": "Japanese"
    },
    {
      "key": 748,
      "value": "Okinawan"
    },
    {
      "key": 750,
      "value": "Korean"
    },
    {
      "key": 765,
      "value": "Laotian"
    },
    {
      "key": 768,
      "value": "Hmong"
    },
    {
      "key": 770,
      "value": "Malaysian"
    },
    {
      "key": 776,
      "value": "Thai"
    },
    {
      "key": 782,
      "value": "Taiwanese"
    },
    {
      "key": 785,
      "value": "Vietnamese"
    },
    {
      "key": 793,
      "value": "Eurasian"
    },
    {
      "key": 795,
      "value": "Asian"
    },
    {
      "key": 799,
      "value": "Other Asian"
    },
    {
      "key": 800,
      "value": "Australian"
    },
    {
      "key": 803,
      "value": "New Zealander"
    },
    {
      "key": 808,
      "value": "Polynesian"
    },
    {
      "key": 811,
      "value": "Hawaiian"
    },
    {
      "key": 814,
      "value": "Samoan"
    },
    {
      "key": 815,
      "value": "Tongan"
    },
    {
      "key": 820,
      "value": "Micronesian"
    },
    {
      "key": 821,
      "value": "Guamanian"
    },
    {
      "key": 822,
      "value": "Chamorro"
    },
    {
      "key": 825,
      "value": "Marshallese"
    },
    {
      "key": 841,
      "value": "Fijian"
    },
    {
      "key": 850,
      "value": "Pacific Islander"
    },
    {
      "key": 899,
      "value": "Other Pacific"
    },
    {
      "key": 900,
      "value": "Afro American"
    },
    {
      "key": 901,
      "value": "Afro"
    },
    {
      "key": 902,
      "value": "African American"
    },
    {
      "key": 903,
      "value": "Black"
    },
    {
      "key": 904,
      "value": "Negro"
    },
    {
      "key": 907,
      "value": "Creole"
    },
    {
      "key": 913,
      "value": "Central American Indian"
    },
    {
      "key": 914,
      "value": "South American Indian"
    },
    {
      "key": 917,
      "value": "Native American"
    },
    {
      "key": 918,
      "value": "Indian"
    },
    {
      "key": 919,
      "value": "Cherokee"
    },
    {
      "key": 920,
      "value": "American Indian"
    },
    {
      "key": 921,
      "value": "Aleut"
    },
    {
      "key": 922,
      "value": "Eskimo"
    },
    {
      "key": 924,
      "value": "White"
    },
    {
      "key": 925,
      "value": "Anglo"
    },
    {
      "key": 927,
      "value": "Appalachian"
    },
    {
      "key": 929,
      "value": "Pennsylvania German"
    },
    {
      "key": 931,
      "value": "Canadian"
    },
    {
      "key": 935,
      "value": "French Canadian"
    },
    {
      "key": 937,
      "value": "Cajun"
    },
    {
      "key": 939,
      "value": "American"
    },
    {
      "key": 940,
      "value": "United States"
    },
    {
      "key": 983,
      "value": "Texas"
    },
    {
      "key": 994,
      "value": "North American"
    },
    {
      "key": 995,
      "value": "Mixture"
    },
    {
      "key": 996,
      "value": "Uncodable entries"
    },
    {
      "key": 997,
      "value": "Other groups"
    },
    {
      "key": 998,
      "value": "Other responses"
    },
    {
      "key": 999,
      "value": "Not reported"
    },
    {
      "key": -9,
      "value": ""
    }
  ]
  var langSpokenHomeLookup = [
    {
      "key": 601,
      "value": "Jamaican Creole"
    },
    {
      "key": 602,
      "value": "Krio"
    },
    {
      "key": 607,
      "value": "German"
    },
    {
      "key": 608,
      "value": "Pennsylvania Dutch"
    },
    {
      "key": 609,
      "value": "Yiddish"
    },
    {
      "key": 610,
      "value": "Dutch"
    },
    {
      "key": 611,
      "value": "Afrikaans"
    },
    {
      "key": 614,
      "value": "Swedish"
    },
    {
      "key": 615,
      "value": "Danish"
    },
    {
      "key": 616,
      "value": "Norwegian"
    },
    {
      "key": 619,
      "value": "Italian"
    },
    {
      "key": 620,
      "value": "French"
    },
    {
      "key": 622,
      "value": "Patois"
    },
    {
      "key": 623,
      "value": "French Creole"
    },
    {
      "key": 624,
      "value": "Cajun"
    },
    {
      "key": 625,
      "value": "Spanish"
    },
    {
      "key": 629,
      "value": "Portuguese"
    },
    {
      "key": 631,
      "value": "Romanian"
    },
    {
      "key": 635,
      "value": "Irish Gaelic"
    },
    {
      "key": 637,
      "value": "Greek"
    },
    {
      "key": 638,
      "value": "Albanian"
    },
    {
      "key": 639,
      "value": "Russian"
    },
    {
      "key": 641,
      "value": "Ukrainian"
    },
    {
      "key": 642,
      "value": "Czech"
    },
    {
      "key": 645,
      "value": "Polish"
    },
    {
      "key": 646,
      "value": "Slovak"
    },
    {
      "key": 647,
      "value": "Bulgarian"
    },
    {
      "key": 648,
      "value": "Macedonian"
    },
    {
      "key": 649,
      "value": "Serbo-Croatian"
    },
    {
      "key": 650,
      "value": "Croatian"
    },
    {
      "key": 651,
      "value": "Serbian"
    },
    {
      "key": 653,
      "value": "Lithuanian"
    },
    {
      "key": 654,
      "value": "Latvian"
    },
    {
      "key": 655,
      "value": "Armenian"
    },
    {
      "key": 656,
      "value": "Persian"
    },
    {
      "key": 657,
      "value": "Pashto"
    },
    {
      "key": 658,
      "value": "Kurdish"
    },
    {
      "key": 662,
      "value": "a language from India"
    },
    {
      "key": 663,
      "value": "Hindi"
    },
    {
      "key": 664,
      "value": "Bengali"
    },
    {
      "key": 665,
      "value": "Panjabi"
    },
    {
      "key": 666,
      "value": "Marathi"
    },
    {
      "key": 667,
      "value": "Gujarati"
    },
    {
      "key": 671,
      "value": "Urdu"
    },
    {
      "key": 674,
      "value": "Nepali"
    },
    {
      "key": 675,
      "value": "Sindhi"
    },
    {
      "key": 676,
      "value": "a language from Pakistan"
    },
    {
      "key": 677,
      "value": "Sinhalese"
    },
    {
      "key": 679,
      "value": "Finnish"
    },
    {
      "key": 682,
      "value": "Hungarian"
    },
    {
      "key": 689,
      "value": "Uighur"
    },
    {
      "key": 691,
      "value": "Turkish"
    },
    {
      "key": 694,
      "value": "Mongolian"
    },
    {
      "key": 701,
      "value": "Telugu"
    },
    {
      "key": 702,
      "value": "Kannada"
    },
    {
      "key": 703,
      "value": "Malayalam"
    },
    {
      "key": 704,
      "value": "Tamil"
    },
    {
      "key": 708,
      "value": "Chinese"
    },
    {
      "key": 711,
      "value": "Cantonese"
    },
    {
      "key": 712,
      "value": "Mandarin"
    },
    {
      "key": 714,
      "value": "Formosan"
    },
    {
      "key": 717,
      "value": "Burmese"
    },
    {
      "key": 720,
      "value": "Thai"
    },
    {
      "key": 721,
      "value": "Mien"
    },
    {
      "key": 722,
      "value": "Hmong"
    },
    {
      "key": 723,
      "value": "Japanese"
    },
    {
      "key": 724,
      "value": "Korean"
    },
    {
      "key": 725,
      "value": "Laotian"
    },
    {
      "key": 726,
      "value": "Mon-Khmer or Cambodian"
    },
    {
      "key": 728,
      "value": "Vietnamese"
    },
    {
      "key": 732,
      "value": "Indonesian"
    },
    {
      "key": 739,
      "value": "Malay"
    },
    {
      "key": 742,
      "value": "Tagalog"
    },
    {
      "key": 743,
      "value": "Bisayan"
    },
    {
      "key": 744,
      "value": "Sebuano"
    },
    {
      "key": 746,
      "value": "Ilocano"
    },
    {
      "key": 750,
      "value": "Micronesian"
    },
    {
      "key": 752,
      "value": "Chamorro"
    },
    {
      "key": 761,
      "value": "Trukese"
    },
    {
      "key": 767,
      "value": "Samoan"
    },
    {
      "key": 768,
      "value": "Tongan"
    },
    {
      "key": 776,
      "value": "Hawaiian"
    },
    {
      "key": 777,
      "value": "Arabic"
    },
    {
      "key": 778,
      "value": "Hebrew"
    },
    {
      "key": 779,
      "value": "Syriac"
    },
    {
      "key": 780,
      "value": "Amharic"
    },
    {
      "key": 783,
      "value": "Cushite"
    },
    {
      "key": 791,
      "value": "Swahili"
    },
    {
      "key": 792,
      "value": "Bantu"
    },
    {
      "key": 793,
      "value": "Mande"
    },
    {
      "key": 794,
      "value": "Fulani"
    },
    {
      "key": 796,
      "value": "Kru, Ibo, or Yoruba"
    },
    {
      "key": 799,
      "value": "an African language"
    },
    {
      "key": 806,
      "value": "an Algonquian language"
    },
    {
      "key": 819,
      "value": "Ojibwa"
    },
    {
      "key": 862,
      "value": "Apache"
    },
    {
      "key": 864,
      "value": "Navajo"
    },
    {
      "key": 907,
      "value": "Dakota"
    },
    {
      "key": 924,
      "value": "Keres"
    },
    {
      "key": 933,
      "value": "Cherokee"
    },
    {
      "key": 964,
      "value": "Zuni"
    },
    {
      "key": 985,
      "value": "an Indo-European language"
    },
    {
      "key": 986,
      "value": "an Asian language"
    },
    {
      "key": 988,
      "value": "a language from the Pacific Islands"
    },
    {
      "key": 989,
      "value": "an African language"
    },
    {
      "key": 990,
      "value": "an Aleut-Eskimo language"
    },
    {
      "key": 992,
      "value": "a native language from South or Central America"
    },
    {
      "key": 993,
      "value": "a native language from North America"
    },
    {
      "key": 994,
      "value": ""
    },
    {
      "key": 996,
      "value": ""
    },
    {
      "key": -9,
      "value": ""
    }
  ]
  var movedFromLookup = [
    {
      "key": 1,
      "value": "Alabama"
    },
    {
      "key": 2,
      "value": "Alaska"
    },
    {
      "key": 4,
      "value": "Arizona"
    },
    {
      "key": 5,
      "value": "Arkansas"
    },
    {
      "key": 6,
      "value": "California"
    },
    {
      "key": 8,
      "value": "Colorado"
    },
    {
      "key": 9,
      "value": "Connecticut"
    },
    {
      "key": 10,
      "value": "Delaware"
    },
    {
      "key": 11,
      "value": "Washington D.C."
    },
    {
      "key": 12,
      "value": "Florida"
    },
    {
      "key": 13,
      "value": "Georgia"
    },
    {
      "key": 15,
      "value": "Hawaii"
    },
    {
      "key": 16,
      "value": "Idaho"
    },
    {
      "key": 17,
      "value": "Illinois"
    },
    {
      "key": 18,
      "value": "Indiana"
    },
    {
      "key": 19,
      "value": "Iowa"
    },
    {
      "key": 20,
      "value": "Kansas"
    },
    {
      "key": 21,
      "value": "Kentucky"
    },
    {
      "key": 22,
      "value": "Louisiana"
    },
    {
      "key": 23,
      "value": "Maine"
    },
    {
      "key": 24,
      "value": "Maryland"
    },
    {
      "key": 25,
      "value": "Massachusetts"
    },
    {
      "key": 26,
      "value": "Michigan"
    },
    {
      "key": 27,
      "value": "Minnesota"
    },
    {
      "key": 28,
      "value": "Mississippi"
    },
    {
      "key": 29,
      "value": "Missouri"
    },
    {
      "key": 30,
      "value": "Montana"
    },
    {
      "key": 31,
      "value": "Nebraska"
    },
    {
      "key": 32,
      "value": "Nevada"
    },
    {
      "key": 33,
      "value": "New Hampshire"
    },
    {
      "key": 34,
      "value": "New Jersey"
    },
    {
      "key": 35,
      "value": "New Mexico"
    },
    {
      "key": 36,
      "value": "somewhere else in New York State"
    },
    {
      "key": 37,
      "value": "North Carolina"
    },
    {
      "key": 38,
      "value": "North Dakota"
    },
    {
      "key": 39,
      "value": "Ohio"
    },
    {
      "key": 40,
      "value": "Oklahoma"
    },
    {
      "key": 41,
      "value": "Oregon"
    },
    {
      "key": 42,
      "value": "Pennsylvania"
    },
    {
      "key": 44,
      "value": "Rhode Island"
    },
    {
      "key": 45,
      "value": "South Carolina"
    },
    {
      "key": 46,
      "value": "South Dakota"
    },
    {
      "key": 47,
      "value": "Tennessee"
    },
    {
      "key": 48,
      "value": "Texas"
    },
    {
      "key": 49,
      "value": "Utah"
    },
    {
      "key": 50,
      "value": "Vermont"
    },
    {
      "key": 51,
      "value": "Virginia"
    },
    {
      "key": 53,
      "value": "Washington"
    },
    {
      "key": 54,
      "value": "West Virginia"
    },
    {
      "key": 55,
      "value": "Wisconsin"
    },
    {
      "key": 56,
      "value": "Wyoming"
    },
    {
      "key": 72,
      "value": "Puerto Rico"
    },
    {
      "key": 109,
      "value": "France"
    },
    {
      "key": 110,
      "value": "Germany"
    },
    {
      "key": 111,
      "value": "Northern Europe"
    },
    {
      "key": 113,
      "value": "Eastern Europe"
    },
    {
      "key": 114,
      "value": "Europe"
    },
    {
      "key": 120,
      "value": "Italy"
    },
    {
      "key": 134,
      "value": "Spain"
    },
    {
      "key": 138,
      "value": "United Kingdom"
    },
    {
      "key": 139,
      "value": "England"
    },
    {
      "key": 163,
      "value": "Russia"
    },
    {
      "key": 200,
      "value": "Afghanistan"
    },
    {
      "key": 207,
      "value": "China"
    },
    {
      "key": 210,
      "value": "India"
    },
    {
      "key": 213,
      "value": "Iraq"
    },
    {
      "key": 215,
      "value": "Japan"
    },
    {
      "key": 217,
      "value": "Korea"
    },
    {
      "key": 229,
      "value": "Nepal"
    },
    {
      "key": 231,
      "value": "Pakistan"
    },
    {
      "key": 233,
      "value": "Philippines"
    },
    {
      "key": 235,
      "value": "Saudi Arabia"
    },
    {
      "key": 240,
      "value": "Taiwan"
    },
    {
      "key": 242,
      "value": "Thailand"
    },
    {
      "key": 243,
      "value": "Turkey"
    },
    {
      "key": 247,
      "value": "Vietnam"
    },
    {
      "key": 251,
      "value": "East Asia"
    },
    {
      "key": 252,
      "value": "West Asia"
    },
    {
      "key": 253,
      "value": "Asia"
    },
    {
      "key": 301,
      "value": "Canada"
    },
    {
      "key": 303,
      "value": "Mexico"
    },
    {
      "key": 312,
      "value": "El Salvador"
    },
    {
      "key": 313,
      "value": "Guatemala"
    },
    {
      "key": 314,
      "value": "Honduras"
    },
    {
      "key": 317,
      "value": "Central America"
    },
    {
      "key": 327,
      "value": "Cuba"
    },
    {
      "key": 329,
      "value": "Dominican Republic"
    },
    {
      "key": 332,
      "value": "Haiti"
    },
    {
      "key": 333,
      "value": "Jamaica"
    },
    {
      "key": 344,
      "value": "the Caribbean"
    },
    {
      "key": 362,
      "value": "Brazil"
    },
    {
      "key": 364,
      "value": "Colombia"
    },
    {
      "key": 374,
      "value": "South America"
    },
    {
      "key": 414,
      "value": "Egypt"
    },
    {
      "key": 440,
      "value": "Nigeria"
    },
    {
      "key": 463,
      "value": "East Africa"
    },
    {
      "key": 467,
      "value": "West Africa"
    },
    {
      "key": 468,
      "value": "Africa"
    },
    {
      "key": 501,
      "value": "Australia"
    },
    {
      "key": 555,
      "value": "somewhere in the ocean"
    },
    {
      "key": -9,
      "value": ""
    }
  ]

  // data container
  var output = data;
  var index = 0;
  output.story = [];

  //
  if (data.age) {
    //var age = data.age;
    switch(true) {
      case (data.age == 1):
        output.story.push(`I am ${data.age} year old. `);
        break;
      case (data.age > 1):
        output.story.push(`I am ${data.age} years old. `);
        break;
    }


    //var excludeAncestry = ["Not reported", "Other responses", "Other groups", "Uncodable entries", "Mixture"];
    //if ( data.ancestry_1 && excludeAncestry.indexOf(decodeKey( ancestryLookup, data.ancestry_1 )) < 0 ) {
    //  output.story[index] += ` and I am ${decodeKey( ancestryLookup, data.ancestry_1 )}.`;
    //}
    // index += 1;
  }

  if (data.nativity) {
    if (!output.story[index]) {
      output.story[index] = '';
    }
    switch(data.nativity) {
      case 1:
        output.story[index] += `I was born in the United States. `;
        break;
      case 2:
        if (data.place_born) {
          output.story[index] += `I was born in ${decodeKey( placeBornLookup, data.place_born )}`;
          if (data.year_entry) {
            output.story[index] += `, and came to the United States in ${data.year_entry}. `
          } else {
            output.story[index] += '. ';
          }
        } else {
          output.story[index] += `I was born outside the United States. `;
        }
        if(data.moved_from) {
          output.story[index] += `I just moved to Queens from ${decodeKey( movedFromLookup, data.moved_from )}. `
        }
        if (data.citizenship) {
          switch(data.citizenship) {
            case 4:
              if (data.naturalized) {
                output.story.push(`I became a U.S. citizen in ${data.naturalized}. `);
                index += 1;
              } else {
                output.story.push(`I am a naturalized U.S. citizen. `);
                index += 1;
              }
              break;
            case 5:
              output.story.push( `I am not a U.S. citizen. `);
              index += 1;
              break;
          }
        }
        break;
    }
  }

  //output.story += ''
  if (data.lang_home_nonenglish) {
    switch(data.lang_home_nonenglish) {
      case 2:
        output.story.push(`At home we only speak English. `);
        index += 1;
        break;
      case 1:
        if (data.lang_spoken_home) {
          output.story.push(`At home we speak ${decodeKey( langSpokenHomeLookup, data.lang_spoken_home )}`)
          index += 1;
        } else {
          output.story.push(`At home we speak something other than English`);
          index += 1;
        }
        break;
    }
  }
  if (data.english_ability) {
    output.story[index] += ` — I ${decodeKey( englishAbilityLookup, data.english_ability )}.`
    index += 1;
  }

  callback(null, output)

  function decodeKey( table, value ) { // takes lookup table and input value, returns
    return table.find( (item) => {
      return item.key == value;
    }).value
  }

  function removeLeadingSpaces( array ) {

  }

};

module.exports.tell = tell;
