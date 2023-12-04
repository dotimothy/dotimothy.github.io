let typeToWord = {
  "MEM": "Memorial",
  "NB": "National Battlefield",
  "NBP": "National Battlefield Park",
  "NB Site": "National Battle Field Site",
  "NHS": "National Historic Site",
  "NHP": "National Historic Park",
  "NHP & ECO PRES": "National Historic Park & Ecological Preserve",
  "NHT": "National Historic Trail",
  "NL": "National Lakeshore",
  "NM": "National Monument",
  "NMEM": "National Memorial",
  "NMP": "National Memorial Park",
  "NM&PRE": "National Monument & Preserve",
  "NP": "National Park",
  "NP&PRES": "National Park & Preserve",
  "NPRES": "National Preserve",
  "NRA": "National Recreational Area",
  "NR": "National River",
  "NR&RA": "National River & Recreation Area",
  "NRR": "National Recreational River",
  "NS": "National Seashore",
  "NSR": "National Scenic Riverway",
  "NST": "National Scenic Trail",
  "OTHER" : "",
  "PARK": "Park",
  "PRES": "Preserve",
  "PW": "Parkway",
  "S&RR": "Scenic & Recreational River",
  "W&SR": "Wild & Scenic River"
}

let gameData = [
  {
    "Name": "ABRAHAM LINCOLN BIRTHPLACE",
    "Type": "NHP",
    "Park Code": "ABLI"
  },
  {
    "Name": "ACADIA",
    "Type": "NP",
    "Park Code": "ACAD"
  },
  {
    "Name": "ADAMS",
    "Type": "NHP",
    "Park Code": "ADAM"
  },
  {
    "Name": "AFRICAN BURIAL GROUND",
    "Type": "NM",
    "Park Code": "AFBG"
  },
  {
    "Name": "AGATE FOSSIL BEDS",
    "Type": "NM",
    "Park Code": "AGFO"
  },
  {
    "Name": "ALIBATES FLINT QUARRIES NATIONAL MONUMENT",
    "Type": "NM",
    "Park Code": "ALFL"
  },
  {
    "Name": "ALLEGHENY PORTAGE RAILROAD",
    "Type": "NHS",
    "Park Code": "ALPO"
  },
  {
    "Name": "AMISTAD",
    "Type": "NRA",
    "Park Code": "AMIS"
  },
  {
    "Name": "ANDERSONVILLE",
    "Type": "NHS",
    "Park Code": "ANDE"
  },
  {
    "Name": "ANDREW JOHNSON",
    "Type": "NHS",
    "Park Code": "ANJO"
  },
  {
    "Name": "ANIAKCHAK",
    "Type": "NM",
    "Park Code": "ANIA"
  },
  {
    "Name": "ANTIETAM",
    "Type": "NB",
    "Park Code": "ANTI"
  },
  {
    "Name": "APOSTLE ISLANDS",
    "Type": "NL",
    "Park Code": "APIS"
  },
  {
    "Name": "APPALACHIAN",
    "Type": "NST",
    "Park Code": "APPA"
  },
  {
    "Name": "APPOMATTOX COURT HOUSE",
    "Type": "NHP",
    "Park Code": "APCO"
  },
  {
    "Name": "ARCHES",
    "Type": "NP",
    "Park Code": "ARCH"
  },
  {
    "Name": "ARKANSAS POST",
    "Type": "NMEM",
    "Park Code": "ARPO"
  },
  {
    "Name": "ARLINGTON HOUSE - ROBERT E. LEE MEMORIAL",
    "Type": "NMEM",
    "Park Code": "ARHO"
  },
  {
    "Name": "ASSATEAGUE ISLAND NS",
    "Type": "NS",
    "Park Code": "ASIS"
  },
  {
    "Name": "AZTEC RUINS",
    "Type": "NM",
    "Park Code": "AZRU"
  },
  {
    "Name": "BADLANDS",
    "Type": "NP",
    "Park Code": "BADL"
  },
  {
    "Name": "BANDELIER",
    "Type": "NM",
    "Park Code": "BAND"
  },
  {
    "Name": "BELMONT-PAUL WOMEN'S EQUALITY",
    "Type": "NM",
    "Park Code": "BEPA"
  },
  {
    "Name": "BENTS OLD FORT",
    "Type": "NHS",
    "Park Code": "BEOL"
  },
  {
    "Name": "BERING LAND BRIDGE",
    "Type": "NPRES",
    "Park Code": "BELA"
  },
  {
    "Name": "BIG BEND",
    "Type": "NP",
    "Park Code": "BIBE"
  },
  {
    "Name": "BIG CYPRESS",
    "Type": "NPRES",
    "Park Code": "BICY"
  },
  {
    "Name": "BIG HOLE",
    "Type": "NB",
    "Park Code": "BIHO"
  },
  {
    "Name": "BIG SOUTH FORK",
    "Type": "NR&RA",
    "Park Code": "BISO"
  },
  {
    "Name": "BIG THICKET",
    "Type": "NPRES",
    "Park Code": "BITH"
  },
  {
    "Name": "BIGHORN CANYON",
    "Type": "NRA",
    "Park Code": "BICA"
  },
  {
    "Name": "BIRMINGHAM CIVIL RIGHTS",
    "Type": "NM",
    "Park Code": "BICR"
  },
  {
    "Name": "BISCAYNE",
    "Type": "NP",
    "Park Code": "BISC"
  },
  {
    "Name": "BLACK CANYON OF THE GUNNISON",
    "Type": "NP",
    "Park Code": "BLCA"
  },
  {
    "Name": "BLACKSTONE RIVER VALLEY",
    "Type": "NHP",
    "Park Code": "BLRV"
  },
  {
    "Name": "BLUE RIDGE",
    "Type": "PW",
    "Park Code": "BLRI"
  },
  {
    "Name": "BLUESTONE",
    "Type": "NSR",
    "Park Code": "BLUE"
  },
  {
    "Name": "BOOKER T. WASHINGTON",
    "Type": "NM",
    "Park Code": "BOWA"
  },
  {
    "Name": "BOSTON",
    "Type": "NHP",
    "Park Code": "BOST"
  },
  {
    "Name": "BOSTON AFRICAN AMERICAN",
    "Type": "NHS",
    "Park Code": "BOAF"
  },
  {
    "Name": "BOSTON HARBOR ISLANDS",
    "Type": "NRA",
    "Park Code": "BOHA"
  },
  {
    "Name": "BRICES CROSS ROADS",
    "Type": "NB Site",
    "Park Code": "BRCR"
  },
  {
    "Name": "BROWN V. BOARD OF EDUCATION",
    "Type": "NHS",
    "Park Code": "BRVB"
  },
  {
    "Name": "BRYCE CANYON",
    "Type": "NP",
    "Park Code": "BRCA"
  },
  {
    "Name": "BUCK ISLAND REEF",
    "Type": "NM",
    "Park Code": "BUIS"
  },
  {
    "Name": "BUFFALO",
    "Type": "NR",
    "Park Code": "BUFF"
  },
  {
    "Name": "CABRILLO",
    "Type": "NM",
    "Park Code": "CABR"
  },
  {
    "Name": "CANAVERAL",
    "Type": "NS",
    "Park Code": "CANA"
  },
  {
    "Name": "CANE RIVER CREOLE",
    "Type": "NHP",
    "Park Code": "CARI"
  },
  {
    "Name": "CANYON DE CHELLY",
    "Type": "NM",
    "Park Code": "CACH"
  },
  {
    "Name": "CANYONLANDS",
    "Type": "NP",
    "Park Code": "CANY"
  },
  {
    "Name": "CAPE COD",
    "Type": "NS",
    "Park Code": "CACO"
  },
  {
    "Name": "CAPE HATTERAS",
    "Type": "NS",
    "Park Code": "CAHA"
  },
  {
    "Name": "CAPE KRUSENSTERN",
    "Type": "NM",
    "Park Code": "CAKR"
  },
  {
    "Name": "CAPE LOOKOUT",
    "Type": "NS",
    "Park Code": "CALO"
  },
  {
    "Name": "CAPITOL REEF",
    "Type": "NP",
    "Park Code": "CARE"
  },
  {
    "Name": "CAPULIN VOLCANO",
    "Type": "NM",
    "Park Code": "CAVO"
  },
  {
    "Name": "CARL SANDBURG HOME",
    "Type": "NHS",
    "Park Code": "CARL"
  },
  {
    "Name": "CARLSBAD CAVERNS",
    "Type": "NP",
    "Park Code": "CAVE"
  },
  {
    "Name": "CARTER G. WOODSON HOME",
    "Type": "NHS",
    "Park Code": "CAWO"
  },
  {
    "Name": "CASA GRANDE RUINS",
    "Type": "NM",
    "Park Code": "CAGR"
  },
  {
    "Name": "CASTILLO de SAN MARCOS",
    "Type": "NM",
    "Park Code": "CASA"
  },
  {
    "Name": "CASTLE CLINTON",
    "Type": "NM",
    "Park Code": "CACL"
  },
  {
    "Name": "CASTLE MOUNTAIN",
    "Type": "NM",
    "Park Code": "CAMO"
  },
  {
    "Name": "CATOCTIN MOUNTAIN",
    "Type": "PARK",
    "Park Code": "CATO"
  },
  {
    "Name": "CEDAR BREAKS",
    "Type": "NM",
    "Park Code": "CEBR"
  },
  {
    "Name": "CEDAR CREEK & BELLE GROVE",
    "Type": "NHP",
    "Park Code": "CEBE"
  },
  {
    "Name": "CESAR E. CHAVEZ",
    "Type": "NM",
    "Park Code": "CECH"
  },
  {
    "Name": "CHANNEL ISLANDS",
    "Type": "NP",
    "Park Code": "CHIS"
  },
  {
    "Name": "CHACO CULTURE",
    "Type": "NHP",
    "Park Code": "CHCU"
  },
  {
    "Name": "CHAMIZAL",
    "Type": "NMEM",
    "Park Code": "CHAM"
  },
  {
    "Name": "CHARLES PINCKNEY",
    "Type": "NHS",
    "Park Code": "CHPI"
  },
  {
    "Name": "CHARLES YOUNG BUFFALO SOLDIERS",
    "Type": "NM",
    "Park Code": "CHYO"
  },
  {
    "Name": "CHATTAHOOCHEE RIVER",
    "Type": "NRA",
    "Park Code": "CHAT"
  },
  {
    "Name": "CHESAPEAKE AND OHIO CANAL",
    "Type": "NHP",
    "Park Code": "CHOH"
  },
  {
    "Name": "CHICKAMAUGA AND CHATTANOOGA",
    "Type": "NMP",
    "Park Code": "CHCH"
  },
  {
    "Name": "CHICKASAW",
    "Type": "NRA",
    "Park Code": "CHIC"
  },
  {
    "Name": "CHIRICAHUA",
    "Type": "NM",
    "Park Code": "CHIR"
  },
  {
    "Name": "CHRISTIANSTED",
    "Type": "NHS",
    "Park Code": "CHRI"
  },
  {
    "Name": "CITY OF ROCKS NATIONAL RESERVE",
    "Type": "OTHER",
    "Park Code": "CIRO"
  },
  {
    "Name": "CLARA BARTON",
    "Type": "NHS",
    "Park Code": "CLBA"
  },
  {
    "Name": "COLONIAL",
    "Type": "NHP",
    "Park Code": "COLO"
  },
  {
    "Name": "COLORADO",
    "Type": "NM",
    "Park Code": "COLM"
  },
  {
    "Name": "COLTSVILLE**",
    "Type": "NHP",
    "Park Code": "COLT"
  },
  {
    "Name": "CONGAREE",
    "Type": "NP",
    "Park Code": "CONG"
  },
  {
    "Name": "CONSTITUTION GARDENS",
    "Type": "OTHER",
    "Park Code": "COGA"
  },
  {
    "Name": "CORONADO",
    "Type": "NMEM",
    "Park Code": "CORO"
  },
  {
    "Name": "COWPENS",
    "Type": "NB",
    "Park Code": "COWP"
  },
  {
    "Name": "CRATER LAKE",
    "Type": "NP",
    "Park Code": "CRLA"
  },
  {
    "Name": "CRATERS OF THE MOON",
    "Type": "NPRES",
    "Park Code": "CRMO"
  },
  {
    "Name": "CRATERS OF THE MOON",
    "Type": "NM",
    "Park Code": "CRMO"
  },
  {
    "Name": "CUMBERLAND GAP",
    "Type": "NHP",
    "Park Code": "CUGA"
  },
  {
    "Name": "CUMBERLAND ISLAND",
    "Type": "NS",
    "Park Code": "CUIS"
  },
  {
    "Name": "CURECANTI",
    "Type": "NRA",
    "Park Code": "CURE"
  },
  {
    "Name": "CUYAHOGA VALLEY",
    "Type": "NP",
    "Park Code": "CUVA"
  },
  {
    "Name": "DAYTON AVIATION HERITAGE",
    "Type": "NHP",
    "Park Code": "DAAV"
  },
  {
    "Name": "DEATH VALLEY",
    "Type": "NP",
    "Park Code": "DEVA"
  },
  {
    "Name": "DE SOTO",
    "Type": "NMEM",
    "Park Code": "DESO"
  },
  {
    "Name": "DELAWARE WATER GAP",
    "Type": "NRA",
    "Park Code": "DEWA"
  },
  {
    "Name": "DENALI",
    "Type": "NP",
    "Park Code": "DENA"
  },
  {
    "Name": "DENALI",
    "Type": "NPRES",
    "Park Code": "DENA"
  },
  {
    "Name": "DEVILS TOWER",
    "Type": "NM",
    "Park Code": "DETO"
  },
  {
    "Name": "DINOSAUR",
    "Type": "NM",
    "Park Code": "DINO"
  },
  {
    "Name": "DEVILS POSTPILE",
    "Type": "NM",
    "Park Code": "DEPO"
  },
  {
    "Name": "DRY TORTUGAS",
    "Type": "NP",
    "Park Code": "DRTO"
  },
  {
    "Name": "EBEY'S LANDING NATIONAL HISTORICAL RESERVE",
    "Type": "OTHER",
    "Park Code": "EBLA"
  },
  {
    "Name": "EDGAR ALLAN POE",
    "Type": "NHS",
    "Park Code": "EDAL"
  },
  {
    "Name": "EFFIGY MOUNDS",
    "Type": "NM",
    "Park Code": "EFMO"
  },
  {
    "Name": "EISENHOWER",
    "Type": "NHS",
    "Park Code": "EISE"
  },
  {
    "Name": "EL MALPAIS",
    "Type": "NM",
    "Park Code": "ELMA"
  },
  {
    "Name": "EL MORRO",
    "Type": "NM",
    "Park Code": "ELMO"
  },
  {
    "Name": "ELEANOR ROOSEVELT",
    "Type": "NHS",
    "Park Code": "ELRO"
  },
  {
    "Name": "EUGENE O'NEILL",
    "Type": "NHS",
    "Park Code": "EUON"
  },
  {
    "Name": "EVERGLADES",
    "Type": "NP",
    "Park Code": "EVER"
  },
  {
    "Name": "FEDERAL HALL",
    "Type": "NMEM",
    "Park Code": "FEHA"
  },
  {
    "Name": "FIRE ISLAND",
    "Type": "NS",
    "Park Code": "FIIS"
  },
  {
    "Name": "FIRST LADIES'",
    "Type": "NHS",
    "Park Code": "FILA"
  },
  {
    "Name": "FIRST STATE",
    "Type": "NHP",
    "Park Code": "FRST"
  },
  {
    "Name": "FLIGHT 93",
    "Type": "NMEM",
    "Park Code": "FLNI"
  },
  {
    "Name": "FLORISSANT FOSSIL BEDS",
    "Type": "NM",
    "Park Code": "FLFO"
  },
  {
    "Name": "FORD'S THEATRE",
    "Type": "NHS",
    "Park Code": "FOTH"
  },
  {
    "Name": "FORT BOWIE",
    "Type": "NHS",
    "Park Code": "FOBO"
  },
  {
    "Name": "FORT CAROLINE",
    "Type": "NMEM",
    "Park Code": "FOCA"
  },
  {
    "Name": "FORT DAVIS",
    "Type": "NHS",
    "Park Code": "FODA"
  },
  {
    "Name": "FORT DONELSON",
    "Type": "NB",
    "Park Code": "FODO"
  },
  {
    "Name": "FORT FREDERICA",
    "Type": "NM",
    "Park Code": "FOFR"
  },
  {
    "Name": "FORT LARAMIE",
    "Type": "NHS",
    "Park Code": "FOLA"
  },
  {
    "Name": "FORT LARNED",
    "Type": "NHS",
    "Park Code": "FOLS"
  },
  {
    "Name": "FORT MATANZAS",
    "Type": "NM",
    "Park Code": "FOMA"
  },
  {
    "Name": "FORT MCHENRY NATIONAL MONUMENT AND HISTORIC SHRINE",
    "Type": "OTHER",
    "Park Code": "FOMC"
  },
  {
    "Name": "FORT MONROE",
    "Type": "NM",
    "Park Code": "FOMR"
  },
  {
    "Name": "FORT NECESSITY",
    "Type": "NB",
    "Park Code": "FONE"
  },
  {
    "Name": "FORT POINT",
    "Type": "NHS",
    "Park Code": "FOPO"
  },
  {
    "Name": "FORT PULASKI",
    "Type": "NM",
    "Park Code": "FOPU"
  },
  {
    "Name": "FORT RALEIGH",
    "Type": "NHS",
    "Park Code": "FORA"
  },
  {
    "Name": "FORT SCOTT",
    "Type": "NHS",
    "Park Code": "FOSC"
  },
  {
    "Name": "FORT SMITH",
    "Type": "NHS",
    "Park Code": "FOSM"
  },
  {
    "Name": "FORT STANWIX",
    "Type": "NM",
    "Park Code": "FOST"
  },
  {
    "Name": "FORT SUMTER",
    "Type": "NM",
    "Park Code": "FOSU"
  },
  {
    "Name": "FORT UNION",
    "Type": "NM",
    "Park Code": "FOUN"
  },
  {
    "Name": "FORT UNION TRADING POST",
    "Type": "NHS",
    "Park Code": "FOUS"
  },
  {
    "Name": "FORT VANCOUVER",
    "Type": "NHS",
    "Park Code": "FOVA"
  },
  {
    "Name": "FORT WASHINGTON",
    "Type": "PARK",
    "Park Code": "FOWA"
  },
  {
    "Name": "FOSSIL BUTTE",
    "Type": "NM",
    "Park Code": "FOBU"
  },
  {
    "Name": "FRANKLIN DELANO ROOSEVELT",
    "Type": "NMEM",
    "Park Code": "FRDE"
  },
  {
    "Name": "FREDERICK DOUGLASS",
    "Type": "NHS",
    "Park Code": "FRDO"
  },
  {
    "Name": "FREDRICK LAW OLMSTED",
    "Type": "NHS",
    "Park Code": "FRLA"
  },
  {
    "Name": "FREDRICKSBURG & SPOTSYLVANIA",
    "Type": "NMP",
    "Park Code": "FRSP"
  },
  {
    "Name": "FREEDOM RIDERS",
    "Type": "NM",
    "Park Code": "FRRI"
  },
  {
    "Name": "FRIENDSHIP HILL",
    "Type": "NHS",
    "Park Code": "FRHI"
  },
  {
    "Name": "GATES OF THE ARCTIC",
    "Type": "NP",
    "Park Code": "GAAR"
  },
  {
    "Name": "GATES OF THE ARCTIC",
    "Type": "NPRES",
    "Park Code": "GAAR"
  },
  {
    "Name": "GATEWAY",
    "Type": "NRA",
    "Park Code": "GATE"
  },
  {
    "Name": "GATEWAY ARCH NATIONAL PARK",
    "Type": "MEM",
    "Park Code": "JEFF"
  },
  {
    "Name": "GAULEY",
    "Type": "NRA",
    "Park Code": "GARI"
  },
  {
    "Name": "GENERAL GRANT",
    "Type": "NMEM",
    "Park Code": "GEGR"
  },
  {
    "Name": "GEORGE ROGERS CLARK",
    "Type": "NHP",
    "Park Code": "GERO"
  },
  {
    "Name": "GEORGE WASHINGTON BIRTHPLACE",
    "Type": "NM",
    "Park Code": "GEWA"
  },
  {
    "Name": "GEORGE WASHINGTON CARVER",
    "Type": "NM",
    "Park Code": "GWCA"
  },
  {
    "Name": "GEORGE WASHINGTON MEMORIAL PARKWAY",
    "Type": "MEMPW",
    "Park Code": "GWMP"
  },
  {
    "Name": "GETTYSBURG",
    "Type": "NMP",
    "Park Code": "GETT"
  },
  {
    "Name": "GILA CLIFF DWELLINGS",
    "Type": "NM",
    "Park Code": "GICL"
  },
  {
    "Name": "GLACIER",
    "Type": "NP",
    "Park Code": "GLAC"
  },
  {
    "Name": "GLACIER BAY",
    "Type": "NP",
    "Park Code": "GLBA"
  },
  {
    "Name": "GLEN CANYON",
    "Type": "NRA",
    "Park Code": "GLCA"
  },
  {
    "Name": "GOLDEN GATE",
    "Type": "NRA",
    "Park Code": "GOGA"
  },
  {
    "Name": "GOLDEN SPIKE",
    "Type": "NHS",
    "Park Code": "GOSP"
  },
  {
    "Name": "GOVERNORS ISLAND",
    "Type": "NM",
    "Park Code": "GOIS"
  },
  {
    "Name": "GRAND CANYON",
    "Type": "NP",
    "Park Code": "GRCA"
  },
  {
    "Name": "GRAND CANYON PARASHANT",
    "Type": "NM",
    "Park Code": "PARA"
  },
  {
    "Name": "GRAND PORTAGE",
    "Type": "NM",
    "Park Code": "GRPO"
  },
  {
    "Name": "GRAND TETON",
    "Type": "NP",
    "Park Code": "GRTE"
  },
  {
    "Name": "GRANT-KOHRS RANCH",
    "Type": "NHS",
    "Park Code": "GRKO"
  },
  {
    "Name": "GREAT BASIN",
    "Type": "NP",
    "Park Code": "GRBA"
  },
  {
    "Name": "GREAT EGG HARBOR",
    "Type": "S&RR",
    "Park Code": "GREG"
  },
  {
    "Name": "GREAT SAND DUNES",
    "Type": "NP",
    "Park Code": "GRSA"
  },
  {
    "Name": "GREAT SAND DUNES",
    "Type": "PRES",
    "Park Code": "GRSA"
  },
  {
    "Name": "GREAT SMOKY MOUNTAINS",
    "Type": "NP",
    "Park Code": "GRSM"
  },
  {
    "Name": "GREENBELT",
    "Type": "PARK",
    "Park Code": "GREE"
  },
  {
    "Name": "GUADALUPE MOUNTAINS",
    "Type": "NP",
    "Park Code": "GUMO"
  },
  {
    "Name": "GUILFORD COURTHOUSE",
    "Type": "NMP",
    "Park Code": "GUCO"
  },
  {
    "Name": "GULF ISLANDS",
    "Type": "NS",
    "Park Code": "GUIS"
  },
  {
    "Name": "HAGERMAN FOSSIL BEDS",
    "Type": "NM",
    "Park Code": "HAFO"
  },
  {
    "Name": "HALEAKALA",
    "Type": "NP",
    "Park Code": "HALE"
  },
  {
    "Name": "HAMILTON GRANGE",
    "Type": "NMEM",
    "Park Code": "HAGR"
  },
  {
    "Name": "HAMPTON",
    "Type": "NHS",
    "Park Code": "HAMP"
  },
  {
    "Name": "HARPERS FERRY",
    "Type": "NHP",
    "Park Code": "HAFE"
  },
  {
    "Name": "HARRIET TUBMAN",
    "Type": "NHP",
    "Park Code": "HART"
  },
  {
    "Name": "HARRIET TUBMAN UNDERGROUND RAILROAD",
    "Type": "NHP",
    "Park Code": "HATU"
  },
  {
    "Name": "HARRY S TRUMAN",
    "Type": "NHS",
    "Park Code": "HSTR"
  },
  {
    "Name": "HAWAII VOLCANOES",
    "Type": "NP",
    "Park Code": "HAVO"
  },
  {
    "Name": "HERBERT HOOVER",
    "Type": "NHS",
    "Park Code": "HEHO"
  },
  {
    "Name": "HOHOKAM PIMA",
    "Type": "NM",
    "Park Code": "PIMA"
  },
  {
    "Name": "HOME OF FRANKLIN D. ROOSEVELT",
    "Type": "NHS",
    "Park Code": "HOFR"
  },
  {
    "Name": "HOMESTEAD",
    "Type": "NM",
    "Park Code": "HOME"
  },
  {
    "Name": "HONOULIULI",
    "Type": "NM",
    "Park Code": "HONO"
  },
  {
    "Name": "HOPEWELL CULTURE",
    "Type": "NHP",
    "Park Code": "HOCU"
  },
  {
    "Name": "HOPEWELL FURNACE",
    "Type": "NHS",
    "Park Code": "HOFU"
  },
  {
    "Name": "HORSESHOE BEND",
    "Type": "NMP",
    "Park Code": "HOBE"
  },
  {
    "Name": "HOT SPRINGS",
    "Type": "NP",
    "Park Code": "HOSP"
  },
  {
    "Name": "HOVENWEEP",
    "Type": "NM",
    "Park Code": "HOVE"
  },
  {
    "Name": "HUBBELL TRADING POST",
    "Type": "NHS",
    "Park Code": "HUTR"
  },
  {
    "Name": "INDEPENDENCE",
    "Type": "NHP",
    "Park Code": "INDE"
  },
  {
    "Name": "INDIANA DUNES",
    "Type": "NL",
    "Park Code": "INDU"
  },
  {
    "Name": "ISLE ROYALE",
    "Type": "NP",
    "Park Code": "ISRO"
  },
  {
    "Name": "JAMES A. GARFIELD",
    "Type": "NHS",
    "Park Code": "JAGA"
  },
  {
    "Name": "JEAN LAFITTE",
    "Type": "NHP & PRES",
    "Park Code": "JELA"
  },
  {
    "Name": "JEWEL CAVE",
    "Type": "NM",
    "Park Code": "JECA"
  },
  {
    "Name": "JIMMY CARTER",
    "Type": "NHS",
    "Park Code": "JICA"
  },
  {
    "Name": "JOHN DAY FOSSIL BEDS",
    "Type": "NM",
    "Park Code": "JODA"
  },
  {
    "Name": "JOHN D. ROCKEFELLER, JR.",
    "Type": "MEMPW",
    "Park Code": "JODR"
  },
  {
    "Name": "JOHN FITZGERALD KENNEDY",
    "Type": "NHS",
    "Park Code": "JOFI"
  },
  {
    "Name": "JOHN MUIR",
    "Type": "NHS",
    "Park Code": "JOMU"
  },
  {
    "Name": "JOHNSTOWN FLOOD",
    "Type": "NMEM",
    "Park Code": "JOFL"
  },
  {
    "Name": "JOSHUA TREE",
    "Type": "NP",
    "Park Code": "JOTR"
  },
  {
    "Name": "KALAUPAPA",
    "Type": "NHP",
    "Park Code": "KALA"
  },
  {
    "Name": "KALOKO-HONOKOHAU",
    "Type": "NHP",
    "Park Code": "KAHO"
  },
  {
    "Name": "KATAHDIN WOODS AND WATERS",
    "Type": "NM",
    "Park Code": "KAWW"
  },
  {
    "Name": "KATMAI",
    "Type": "NP&PRES",
    "Park Code": "KATM"
  },
  {
    "Name": "KENAI  FJORDS",
    "Type": "NP",
    "Park Code": "KEFJ"
  },
  {
    "Name": "KENNESAW MOUNTAIN",
    "Type": "NBP",
    "Park Code": "KEMO"
  },
  {
    "Name": "KEWEENAW",
    "Type": "NHP",
    "Park Code": "KEWE"
  },
  {
    "Name": "KINGS CANYON",
    "Type": "NP",
    "Park Code": "SEKI"
  },
  {
    "Name": "KINGS MOUNTAIN",
    "Type": "NMP",
    "Park Code": "KIMO"
  },
  {
    "Name": "KLONDIKE GOLD RUSH",
    "Type": "NHP",
    "Park Code": "KLSE"
  },
  {
    "Name": "KLONDIKE GOLD RUSH",
    "Type": "NHP",
    "Park Code": "KLGO"
  },
  {
    "Name": "KNIFE RIVER  INDIAN VILLAGES",
    "Type": "NHS",
    "Park Code": "KNRI"
  },
  {
    "Name": "KOBUK VALLEY",
    "Type": "NP",
    "Park Code": "KOVA"
  },
  {
    "Name": "KOREAN WAR VETERANS",
    "Type": "NMEM",
    "Park Code": "KOWA"
  },
  {
    "Name": "LAKE CHELAN",
    "Type": "NRA",
    "Park Code": "LACH"
  },
  {
    "Name": "LAKE CLARK",
    "Type": "NP",
    "Park Code": "LACL"
  },
  {
    "Name": "LAKE CLARK",
    "Type": "NPRES",
    "Park Code": "LACL"
  },
  {
    "Name": "LAKE MEAD",
    "Type": "NRA",
    "Park Code": "LAKE"
  },
  {
    "Name": "LAKE ROOSEVELT",
    "Type": "NRA",
    "Park Code": "LARO"
  },
  {
    "Name": "LASSEN VOLCANIC",
    "Type": "NP",
    "Park Code": "LAVO"
  },
  {
    "Name": "LAVA BEDS",
    "Type": "NM",
    "Park Code": "LABE"
  },
  {
    "Name": "LAKE MEREDITH",
    "Type": "NRA",
    "Park Code": "LAMR"
  },
  {
    "Name": "LEWIS AND CLARK",
    "Type": "NHP",
    "Park Code": "FOCL"
  },
  {
    "Name": "LINCOLN",
    "Type": "MEM",
    "Park Code": "LIME"
  },
  {
    "Name": "LINCOLN BOYHOOD",
    "Type": "NMEM",
    "Park Code": "LIBO"
  },
  {
    "Name": "LINCOLN HOME",
    "Type": "NHS",
    "Park Code": "LIHO"
  },
  {
    "Name": "LITTLE BIGHORN",
    "Type": "NM",
    "Park Code": "LIBI"
  },
  {
    "Name": "LITTLE RIVER CANYON",
    "Type": "NPRES",
    "Park Code": "LIRI"
  },
  {
    "Name": "LITTLE ROCK CENTRAL HIGH SCHOOL",
    "Type": "NHS",
    "Park Code": "CHSC"
  },
  {
    "Name": "LONGFELLOW HOUSE -WASHINGTON'S HEADQUARTERS",
    "Type": "NHS",
    "Park Code": "LONG"
  },
  {
    "Name": "LOWELL",
    "Type": "NHP",
    "Park Code": "LOWE"
  },
  {
    "Name": "LYNDON B. JOHNSON",
    "Type": "NHP",
    "Park Code": "LYJO"
  },
  {
    "Name": "LYNDON BAINES JOHNSON MEMORIAL GROVE ON THE POTOMAC",
    "Type": "NMEM",
    "Park Code": "GWMP"
  },
  {
    "Name": "MAGGIE L. WALKER",
    "Type": "NHS",
    "Park Code": "MAWA"
  },
  {
    "Name": "MAMMOTH CAVE",
    "Type": "NP",
    "Park Code": "MACA"
  },
  {
    "Name": "MANASSAS",
    "Type": "NBP",
    "Park Code": "MANA"
  },
  {
    "Name": "MANHATTAN PROJECT",
    "Type": "NHP",
    "Park Code": "MAPR"
  },
  {
    "Name": "MANZANAR",
    "Type": "NHS",
    "Park Code": "MANZ"
  },
  {
    "Name": "MARSH-BILLINGS-ROCKEFELLER",
    "Type": "NHP",
    "Park Code": "MABI"
  },
  {
    "Name": "MARTIN LUTHER KING, JR.",
    "Type": "NHP",
    "Park Code": "MALU"
  },
  {
    "Name": "MARTIN VAN BUREN",
    "Type": "NHS",
    "Park Code": "MAVA"
  },
  {
    "Name": "MARY MCLEOD BETHUNE COUNCIL HOUSE",
    "Type": "NHS",
    "Park Code": "MAMC"
  },
  {
    "Name": "MESA VERDE",
    "Type": "NP",
    "Park Code": "MEVE"
  },
  {
    "Name": "MINUTE MAN",
    "Type": "NHP",
    "Park Code": "MIMA"
  },
  {
    "Name": "MINUTEMAN MISSILE",
    "Type": "NHS",
    "Park Code": "MIMI"
  },
  {
    "Name": "MISSISSIPPI NATIONAL RIVER AND RECREATION AREA",
    "Type": "NR&RA",
    "Park Code": "MISS"
  },
  {
    "Name": "MISSOURI NATIONAL RECREATIONAL RIVER",
    "Type": "NRR",
    "Park Code": "MNRR"
  },
  {
    "Name": "MOJAVE",
    "Type": "NP&PRES",
    "Park Code": "MOJA"
  },
  {
    "Name": "MONOCACY",
    "Type": "NB",
    "Park Code": "MONO"
  },
  {
    "Name": "MONTEZUMA CASTLE",
    "Type": "NM",
    "Park Code": "MOCA"
  },
  {
    "Name": "MOORES CREEK",
    "Type": "NB",
    "Park Code": "MOCR"
  },
  {
    "Name": "MORRISTOWN",
    "Type": "NHP",
    "Park Code": "MORR"
  },
  {
    "Name": "MOUNT RAINIER",
    "Type": "NP",
    "Park Code": "MORA"
  },
  {
    "Name": "MOUNT RUSHMORE",
    "Type": "NMEM",
    "Park Code": "MORU"
  },
  {
    "Name": "MUIR WOODS",
    "Type": "NM",
    "Park Code": "MUWO"
  },
  {
    "Name": "NATCHEZ",
    "Type": "NHP",
    "Park Code": "NATC"
  },
  {
    "Name": "NATCHEZ TRACE NATIONAL SCENIC TRAIL",
    "Type": "NST",
    "Park Code": "NATR"
  },
  {
    "Name": "NATCHEZ TRACE PARKWAY",
    "Type": "PW",
    "Park Code": "NATR"
  },
  {
    "Name": "NATIONAL  MALL",
    "Type": "OTHER",
    "Park Code": "NAMA"
  },
  {
    "Name": "NATIONAL CAPITAL PARKS - EAST",
    "Type": "OTHER",
    "Park Code": "NACE"
  },
  {
    "Name": "NATIONAL MALL AND MEMORIAL PARKS",
    "Type": "OTHER",
    "Park Code": "NAMA"
  },
  {
    "Name": "MINIDOKA",
    "Type": "NHS",
    "Park Code": "MIIN"
  },
  {
    "Name": "NATIONAL PARK  OF AMERICAN SAMOA",
    "Type": "NP",
    "Park Code": "NPSA"
  },
  {
    "Name": "NATURAL BRIDGES",
    "Type": "NM",
    "Park Code": "NABR"
  },
  {
    "Name": "NAVAJO",
    "Type": "NM",
    "Park Code": "NAVA"
  },
  {
    "Name": "NEW BEDFORD WHALING",
    "Type": "NHP",
    "Park Code": "NEBE"
  },
  {
    "Name": "NEW ORLEANS JAZZ",
    "Type": "NHP",
    "Park Code": "JAZZ"
  },
  {
    "Name": "NEW RIVER GORGE",
    "Type": "NR",
    "Park Code": "NERI"
  },
  {
    "Name": "NEZ PERCE",
    "Type": "NHP",
    "Park Code": "NEPE"
  },
  {
    "Name": "NICODEMUS",
    "Type": "NHS",
    "Park Code": "NICO"
  },
  {
    "Name": "NINETY SIX",
    "Type": "NHS",
    "Park Code": "NISI"
  },
  {
    "Name": "NIOBRARA",
    "Type": "NSR",
    "Park Code": "NIOB"
  },
  {
    "Name": "NOATAK",
    "Type": "NPRES",
    "Park Code": "NOAT"
  },
  {
    "Name": "NORTH CASCADES",
    "Type": "NP",
    "Park Code": "NOCA"
  },
  {
    "Name": "OBED",
    "Type": "W&SR",
    "Park Code": "OBRI"
  },
  {
    "Name": "OCMULGEE",
    "Type": "NM",
    "Park Code": "OCMU"
  },
  {
    "Name": "OLYMPIC",
    "Type": "NP",
    "Park Code": "OLYM"
  },
  {
    "Name": "OREGON CAVES",
    "Type": "NM&PRE",
    "Park Code": "ORCA"
  },
  {
    "Name": "ORGAN PIPE CACTUS",
    "Type": "NM",
    "Park Code": "ORPI"
  },
  {
    "Name": "OVERMOUNTAIN VICTORY",
    "Type": "NHT",
    "Park Code": "OVVI"
  },
  {
    "Name": "OZARK NATIONAL SCENIC RIVERWAY",
    "Type": "NSR",
    "Park Code": "OZAR"
  },
  {
    "Name": "PADRE ISLAND",
    "Type": "NS",
    "Park Code": "PAIS"
  },
  {
    "Name": "PALO ALTO",
    "Type": "NHP",
    "Park Code": "PAAL"
  },
  {
    "Name": "PARASHANT",
    "Type": "NM",
    "Park Code": "PARA"
  },
  {
    "Name": "PATERSON GREAT FALLS",
    "Type": "NHP",
    "Park Code": "PAGR"
  },
  {
    "Name": "PEA RIDGE",
    "Type": "NMP",
    "Park Code": "PERI"
  },
  {
    "Name": "PEARL HARBOR (USS Arizona) (Honouliuli NM)",
    "Type": "NMEM",
    "Park Code": "PERL"
  },
  {
    "Name": "PECOS",
    "Type": "NHP",
    "Park Code": "PECO"
  },
  {
    "Name": "PENNSYLVANIA AVENUE",
    "Type": "NHS",
    "Park Code": "PAAV"
  },
  {
    "Name": "PERRY�S VICTORY AND INTERNATIONAL PEACE MEMORIAL",
    "Type": "NMEM",
    "Park Code": "PEVI"
  },
  {
    "Name": "PETERSBURG",
    "Type": "NB",
    "Park Code": "PETE"
  },
  {
    "Name": "PETRIFIED FOREST",
    "Type": "NP",
    "Park Code": "PEFO"
  },
  {
    "Name": "PETROGLYPH",
    "Type": "NM",
    "Park Code": "PETR"
  },
  {
    "Name": "PICTURED ROCKS",
    "Type": "NL",
    "Park Code": "PIRO"
  },
  {
    "Name": "PIPE SPRING",
    "Type": "NM",
    "Park Code": "PISP"
  },
  {
    "Name": "PIPESTONE",
    "Type": "NM",
    "Park Code": "PIPE"
  },
  {
    "Name": "PINNACLES",
    "Type": "NP",
    "Park Code": "PINN"
  },
  {
    "Name": "PISCATAWAY",
    "Type": "PARK",
    "Park Code": "PISC"
  },
  {
    "Name": "POINT REYES",
    "Type": "NS",
    "Park Code": "PORE"
  },
  {
    "Name": "PU'UHONUA O HONAUNAU",
    "Type": "NHP",
    "Park Code": "PUHO"
  },
  {
    "Name": "PU'UKOHOLA HEIAU",
    "Type": "NHS",
    "Park Code": "PUHE"
  },
  {
    "Name": "PORT CHICAGO NAVAL MAGAZINE",
    "Type": "NM",
    "Park Code": "POCH"
  },
  {
    "Name": "POTOMAC HERITAGE",
    "Type": "NST",
    "Park Code": "POHT"
  },
  {
    "Name": "POVERTY POINT STATE",
    "Type": "NM",
    "Park Code": "POPO"
  },
  {
    "Name": "PRESIDENT WILLIAM JEFFERSON CLINTON BIRTHPLACE HOME",
    "Type": "NHS",
    "Park Code": "WICL"
  },
  {
    "Name": "PRINCE WILLIAM FOREST PARK",
    "Type": "OTHER",
    "Park Code": "PRWI"
  },
  {
    "Name": "PULLMAN",
    "Type": "NM",
    "Park Code": "PULL"
  },
  {
    "Name": "RAINBOW BRIDGE",
    "Type": "NM",
    "Park Code": "RABR"
  },
  {
    "Name": "RECONSTRUCTION ERA",
    "Type": "NM",
    "Park Code": "REER"
  },
  {
    "Name": "REDWOOD",
    "Type": "NP",
    "Park Code": "REDW"
  },
  {
    "Name": "RICHMOND",
    "Type": "NBP",
    "Park Code": "RICH"
  },
  {
    "Name": "RIO GRANDE",
    "Type": "W&SR",
    "Park Code": "RIGR"
  },
  {
    "Name": "RIVER RAISIN",
    "Type": "NBP",
    "Park Code": "RIRA"
  },
  {
    "Name": "ROCK CREEK",
    "Type": "PARK",
    "Park Code": "ROCR"
  },
  {
    "Name": "ROCKY MOUNTAIN",
    "Type": "NP",
    "Park Code": "ROMO"
  },
  {
    "Name": "ROGER WILLIAMS",
    "Type": "NMEM",
    "Park Code": "ROWI"
  },
  {
    "Name": "ROSIE THE RIVETER/WWII HOME FRONT",
    "Type": "NHP",
    "Park Code": "RORI"
  },
  {
    "Name": "ROSS LAKE",
    "Type": "NRA",
    "Park Code": "ROLA"
  },
  {
    "Name": "RUSSELL CAVE",
    "Type": "NM",
    "Park Code": "RUCA"
  },
  {
    "Name": "SAGAMORE HILL",
    "Type": "NHS",
    "Park Code": "SAHI"
  },
  {
    "Name": "SAGUARO",
    "Type": "NP",
    "Park Code": "SAGU"
  },
  {
    "Name": "SAINT CROIX",
    "Type": "NSR",
    "Park Code": "SACN"
  },
  {
    "Name": "SAINT CROIX ISLAND INTERNATIONAL HISTORIC SITE",
    "Type": "OTHER",
    "Park Code": "SACR"
  },
  {
    "Name": "SAINT PAUL'S CHURCH",
    "Type": "NHS",
    "Park Code": "SAPA"
  },
  {
    "Name": "SAINT-GAUDENS",
    "Type": "NHS",
    "Park Code": "SAGA"
  },
  {
    "Name": "SALEM MARITIME",
    "Type": "NHS",
    "Park Code": "SAMA"
  },
  {
    "Name": "SALINAS PUEBLO MISSIONS",
    "Type": "NM",
    "Park Code": "SAPU"
  },
  {
    "Name": "SALT RIVER BAY",
    "Type": "NHP & ECO PRES",
    "Park Code": "SARI"
  },
  {
    "Name": "SAN ANTONIO MISSIONS",
    "Type": "NHP",
    "Park Code": "SAAN"
  },
  {
    "Name": "SAN FRANCISCO MARITIME",
    "Type": "NHP",
    "Park Code": "SAFR"
  },
  {
    "Name": "SANTA MONICA MOUNTAINS",
    "Type": "NRA",
    "Park Code": "SAMO"
  },
  {
    "Name": "SAN JUAN",
    "Type": "NHS",
    "Park Code": "SAJU"
  },
  {
    "Name": "SAN JUAN ISLAND",
    "Type": "NHP",
    "Park Code": "SAJH"
  },
  {
    "Name": "SEQUOIA",
    "Type": "NP",
    "Park Code": "SEKI"
  },
  {
    "Name": "SAND CREEK MASSACRE",
    "Type": "NHS",
    "Park Code": "SAND"
  },
  {
    "Name": "SARATOGA NATIONAL HISTORICAL PARK",
    "Type": "NHP",
    "Park Code": "SARA"
  },
  {
    "Name": "SAUGUS IRON WORKS",
    "Type": "NHS",
    "Park Code": "SAIR"
  },
  {
    "Name": "SCOTTS BLUFF",
    "Type": "NM",
    "Park Code": "SCBL"
  },
  {
    "Name": "SELMA TO MONTGOMERY",
    "Type": "NHT",
    "Park Code": "SEMO"
  },
  {
    "Name": "SHENANDOAH",
    "Type": "NP",
    "Park Code": "SHEN"
  },
  {
    "Name": "SHILOH",
    "Type": "NMP",
    "Park Code": "SHIL"
  },
  {
    "Name": "SITKA",
    "Type": "NHP",
    "Park Code": "SITK"
  },
  {
    "Name": "SLEEPING BEAR DUNES",
    "Type": "NL",
    "Park Code": "SLBE"
  },
  {
    "Name": "SPRINGFIELD ARMORY",
    "Type": "NHS",
    "Park Code": "SPAR"
  },
  {
    "Name": "STATUE OF LIBERTY AND ELLIS ISLAND",
    "Type": "NM",
    "Park Code": "STLI"
  },
  {
    "Name": "STEAMTOWN",
    "Type": "NHS",
    "Park Code": "STEA"
  },
  {
    "Name": "STE GENEVIEVE",
    "Type": "NHP",
    "Park Code": "STGE"
  },
  {
    "Name": "STONES RIVER",
    "Type": "NB",
    "Park Code": "STRI"
  },
  {
    "Name": "STONEWALL",
    "Type": "NM",
    "Park Code": "STON"
  },
  {
    "Name": "SUNSET CRATER VOLCANO",
    "Type": "NM",
    "Park Code": "SUCR"
  },
  {
    "Name": "TALLGRASS PRAIRIE",
    "Type": "NPRES",
    "Park Code": "TAPR"
  },
  {
    "Name": "THADDEUS KOSCIUSZKO",
    "Type": "NMEM",
    "Park Code": "THKO"
  },
  {
    "Name": "THEODORE ROOSEVELT",
    "Type": "NP",
    "Park Code": "THRO"
  },
  {
    "Name": "THEODORE ROOSEVELT BIRTHPLACE",
    "Type": "NHS",
    "Park Code": "THRB"
  },
  {
    "Name": "THEODORE ROOSEVELT ISLAND",
    "Type": "NMEM",
    "Park Code": "THIS"
  },
  {
    "Name": "THOMAS EDISON",
    "Type": "NHP",
    "Park Code": "EDIS"
  },
  {
    "Name": "THOMAS JEFFERSON",
    "Type": "MEM",
    "Park Code": "THJE"
  },
  {
    "Name": "THOMAS STONE",
    "Type": "NHS",
    "Park Code": "THST"
  },
  {
    "Name": "TIMPANOGOS CAVE",
    "Type": "NM",
    "Park Code": "TICA"
  },
  {
    "Name": "TIMUCUAN ECOLOGICAL",
    "Type": "PRES",
    "Park Code": "TIMU"
  },
  {
    "Name": "TONTO",
    "Type": "NM",
    "Park Code": "TONT"
  },
  {
    "Name": "TULE LAKE",
    "Type": "NM",
    "Park Code": "TULE"
  },
  {
    "Name": "TULE SPRINGS FOSSIL BEDS",
    "Type": "NM",
    "Park Code": "TUSK"
  },
  {
    "Name": "TUMACACORI",
    "Type": "NHP",
    "Park Code": "TUMA"
  },
  {
    "Name": "TUPELO",
    "Type": "NB",
    "Park Code": "TUPE"
  },
  {
    "Name": "TUSKEGEE AIRMEN",
    "Type": "NHS",
    "Park Code": "TUAI"
  },
  {
    "Name": "TUSKEGEE INSTITUTE",
    "Type": "NHS",
    "Park Code": "TUIN/      SEMO"
  },
  {
    "Name": "TUZIGOOT",
    "Type": "NM",
    "Park Code": "TUZI"
  },
  {
    "Name": "ULYSSES S. GRANT",
    "Type": "NHS",
    "Park Code": "ULSG"
  },
  {
    "Name": "UPPER DELAWARE",
    "Type": "S&RR",
    "Park Code": "UPDE"
  },
  {
    "Name": "VALLES CALDERA",
    "Type": "NPRES",
    "Park Code": "VALL"
  },
  {
    "Name": "VALLEY FORGE",
    "Type": "NHP",
    "Park Code": "VAFO"
  },
  {
    "Name": "VANDERBILT MANSION",
    "Type": "NHS",
    "Park Code": "VAMA"
  },
  {
    "Name": "VICKSBURG",
    "Type": "NMP",
    "Park Code": "VICK"
  },
  {
    "Name": "VIETNAM VETERANS",
    "Type": "MEM",
    "Park Code": "VIVE"
  },
  {
    "Name": "VIRGIN ISLANDS",
    "Type": "NP",
    "Park Code": "VIIS"
  },
  {
    "Name": "VIRGIN ISLANDS CORAL REEF",
    "Type": "NM",
    "Park Code": "VICR"
  },
  {
    "Name": "VOYAGEURS",
    "Type": "NP",
    "Park Code": "VOYA"
  },
  {
    "Name": "WACO MAMMOTH",
    "Type": "NM",
    "Park Code": "WACO"
  },
  {
    "Name": "WALNUT CANYON",
    "Type": "NM",
    "Park Code": "WACA"
  },
  {
    "Name": "WAR IN THE PACIFIC",
    "Type": "NHP",
    "Park Code": "WAPA"
  },
  {
    "Name": "WASHINGTON MONUMENT",
    "Type": "OTHER",
    "Park Code": "WAMO"
  },
  {
    "Name": "WASHITA BATTLEFIELD",
    "Type": "NHS",
    "Park Code": "WABA"
  },
  {
    "Name": "WEIR FARM",
    "Type": "NHS",
    "Park Code": "WEFA"
  },
  {
    "Name": "WHISKEYTOWN",
    "Type": "NRA",
    "Park Code": "WHIS"
  },
  {
    "Name": "WHITE HOUSE (Presidents Park)",
    "Type": "OTHER",
    "Park Code": "PRPA"
  },
  {
    "Name": "WHITE SANDS",
    "Type": "NM",
    "Park Code": "WHSA"
  },
  {
    "Name": "WHITMAN MISSION",
    "Type": "NHS",
    "Park Code": "WHMI"
  },
  {
    "Name": "WILLIAM HOWARD TAFT",
    "Type": "NHS",
    "Park Code": "WIHO"
  },
  {
    "Name": "WILSON�S CREEK",
    "Type": "NB",
    "Park Code": "WICR"
  },
  {
    "Name": "WIND CAVE",
    "Type": "NP",
    "Park Code": "WICA"
  },
  {
    "Name": "WOLF TRAP PARK FOR THE PERFORMING ARTS",
    "Type": "OTHER",
    "Park Code": "WOTR"
  },
  {
    "Name": "WOMEN'S RIGHTS",
    "Type": "NHP",
    "Park Code": "WORI"
  },
  {
    "Name": "WORLD WAR II",
    "Type": "MEM",
    "Park Code": "NAWO"
  },
  {
    "Name": "WRANGELL-ST. ELIAS",
    "Type": "NP",
    "Park Code": "WRST"
  },
  {
    "Name": "WRANGELL-ST. ELIAS",
    "Type": "NPRES",
    "Park Code": "WRST"
  },
  {
    "Name": "WRIGHT BROTHERS",
    "Type": "NMEM",
    "Park Code": "WRBR"
  },
  {
    "Name": "WUPATKI",
    "Type": "NM",
    "Park Code": "WUPA"
  },
  {
    "Name": "YELLOWSTONE",
    "Type": "NP",
    "Park Code": "YELL"
  },
  {
    "Name": "YOSEMITE",
    "Type": "NP",
    "Park Code": "YOSE"
  },
  {
    "Name": "YUCCA HOUSE",
    "Type": "NM",
    "Park Code": "YUHO"
  },
  {
    "Name": "YUKON-CHARLEY RIVERS",
    "Type": "NPRES",
    "Park Code": "YUCH"
  },
  {
    "Name": "ZION",
    "Type": "NP",
    "Park Code": "ZION"
  }
];