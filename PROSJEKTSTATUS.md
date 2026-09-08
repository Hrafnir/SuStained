# Prosjektstatus — 8. september 2026

## Implementert første milepæl

`game/` inneholder nå en spillbar Tier I-prototype med 21 teknologier, sju per gren. Den nye gjeldende kortlisten og alle virkningene ligger i `game/lib/game.ts`. Historiske kilder er lenket fra hvert kort. Regelheftet finnes inne i spillet.

Prototypen bruker åtte runder med to investeringer per land per runde, foreløpig arbeiderplassering med dra-og-slipp og produksjon først ved «Lås plassering», handel begrenset av mottatte enheter, og matbetaling etter investeringsfasen. Opptil tre nye teknologier åpnes hver runde etter en fast historisk plan. Tidligere kort forblir tilgjengelige. Hvert land får en statusside med manuell matfordeling, forhåndsvisning av konsekvenser og bekreftelse før turen går videre. Dette er bevisste prototypevalg, ikke en ferdig modell for hele kampanjens epokeåpning.

Spilles på delt skjerm av 2–5 mennesker. Fullført Tier I-test slutter i 1800 med poengtelling. Ingen Tier II/III eller samarbeidsfase er implementert ennå. Nettspill er heller ikke implementert. Brukeren har bedt om GitHub-publisering; denne utgaven leveres via GitHub Pages.

## Ny føring: digital prototype

Brukerens neste bestilling erstatter tidligere produksjonsrekkefølge:

- Tier 1 skal ha **21 teknologier: sju industri, sju transport og sju mat** (utvidet etter spilltest 8. september).
- Tier 1: ca. **1700–1800**. Tier 2: **1800–1900**. Tier 3: **1900–1980**.
- Kortene skal gi historisk rimelige og logiske effekter: utbytte, arealtilgang, handel og byggbar infrastruktur med bonuser.
- Prosjektet skal først bli et fullt spillbart digitalt brettspill med gjennomarbeidet spillflyt, UI, illustrasjoner, kort og brikker. Fysisk produksjon kommer etter digital prototyping.
- Nåværende oppgave er å lage gjennomføringsplanen, ikke å implementere spillet ennå.
- Se `GJENNOMFORINGSPLAN.md`. De tidligere 20 kortene i `design/tier-1.md` er heretter en kandidatbank, ikke gjeldende kortliste. Tidligere bestilling om PNG-kort 11–20 er satt til side av den nye rekkefølgen.

Resten av dokumentet bevarer overtakelsesstatusen og må leses med disse nyere føringene foran.

## Kilde og sikkerhet i overføringen

Kilde: https://chatgpt.com/share/6a9ed192-e854-83ed-b9dc-72797e74aae6

Samtalens 13 brukerbestillinger og tilhørende tilgjengelig tekst er gjennomgått i nettleseren. Nedenfor skilles brukerens føringer fra tidligere assistentforslag og åpne spørsmål. Historiske og naturvitenskapelige påstander fra samtalen er ikke kontrollert på nytt ved overtakelsen.

Originalbilder, graveringsmasker og tidligere omtalt ZIP-pakke er ikke importert. Samtalen viser genererte bilder, men den omtalte kortpakken hadde ingen tilgjengelig nedlastingslenke i den leste siden. Siste svar viser bare en arbeidstidsindikator; det dokumenterer ikke at de siste ti PNG-kortene ble levert.

## Arbeidsform

Brukeren står for innholdet. Assistenten skal være sparringspartner, vurdere ideer og foreslå løsninger, men ikke produsere nye spillkomponenter uten konkret bestilling. Overtakelsen organiserer eksisterende materiale; den innfører ingen nye regler.

## Navn og presentasjon — brukerens korrigering

- Første møte med spillet: **Sustained**, med positiv industriell box art.
- Ved fase 2: **SuStained**, med todelt logo og industri/forurensning i møte med natur/bærekraft.
- «SusStained» var en tidligere feilstaving, selv om den fortsatt brukes i samtaletittelen og flere assistentsvar.
- Todelt boks. Del 2 er forseglet under første fase; box art byttes ved overgangen.
- Realistisk illustrasjon, ingen Gaia-guddom. Box art i 3:2.
- Tidligere box art ble godkjent som midlertidige illustrasjoner.

## Grunnidé — brukerens føringer

Et spill over to faser, gjerne to kvelder, hvor første fase etterlater konkrete konsekvenser i andre fase.

Fase 1 er konkurranse om å bygge industrielle stormakter, med arbeiderplassering og ressursforvaltning. Den skal være et spennende industrispill i seg selv. Fase 2 er samarbeid om konsekvensene av utviklingen. Globale konsekvenser følger samlet aktivitet; lokale naturinngrep følger det enkelte landet. Spillerne kjenner ikke de konkrete konsekvensene i fase 1.

Politisk og pedagogisk tematikk skal kombineres med et godt brettspill. Godt samarbeid skal kunne gi en optimistisk, solarpunkpreget utvikling.

## Tidsramme — siste brukerføringer gjelder

- Fase 1 starter foreløpig rundt 1750 og går til **1980**.
- Fase 2 starter **1980**.
- En runde representerer omtrent 20 år i fase 1 og 10 år i fase 2.
- Tidligere sluttår 1930 og alternative fase 2-startår 2000/2030/2050 er erstattet.
- Tidligere ønske om 7–8 runder er ikke avstemt mot den utvidede perioden. Dette er et åpent designspørsmål, ikke en grunn til å endre antallet automatisk.
- Tier 1 ca. 1700–1830 er et tidligere assistentforslag for kortsettet, ikke en separat fastsatt historisk regel.

## Fase 1 — etablert retning

Inntil fem spillere var et foreløpig utgangspunkt, med to befolkningsbrikker hver. Endelig spillerantall er ikke fastsatt.

Fem sentrale størrelser:

1. Befolkning: arbeidere og handlinger.
2. Industri: samlet industriell produksjon, brukt til bestemte fysiske investeringer.
3. Mat: vedlikeholder og øker befolkningen.
4. Vitenskap/forskning: kjøper teknologi.
5. Penger: fleksibel finansiering av blant annet institusjoner, handel og enkelte investeringer.

Industri skal gi større spesialisert produksjon enn penger alene kan erstatte. Noen kjøp krever penger, andre industri eller en kombinasjon. Handel avhenger av transportkapasitet.

Teknologi har tre hovedgrener: **industri, transport og mat**. Utdanning/forskning er et tverrgående institusjonelt lag, ikke en fjerde likestilt teknologigren. Reelle historiske teknologier og institusjoner skal gi historieforståelse gjennom mekanikken.

- Grunnteknologi finnes i like mange eksemplarer som spillere.
- Spesialisert teknologi er knappere.
- Global samlet forskning åpner neste tier, med et foreløpig eksempel på to Tier 1-kort per spiller i gjennomsnitt.
- Hver spiller trenger også egen forskning for adgang. Brukerens formulering «to Tier 2» for å åpne Tier 2 ble tolket av forrige assistent som «to Tier 1»; dette er en tydelig merket tolkning.
- Teknologi kan gi direkte bonus, låse opp en fysisk investering, eller begge deler.
- Forutsetninger skal gjøre spesialisering relevant.
- Vekslingsforhold utvikles fra 2:1 via 3:2 til 1:1, både industri til penger og motsatt.
- Nye teknologikort tilføres markedet over tid. Markedsstørrelse, eksakt tempo og full åpning av tiers er ikke ferdig avklart.

Prestisjebygg som opera, teater og nasjonalbibliotek kan gi fase 1-poeng og positive konsekvenser i fase 2. Utdanning og kultur skal kunne bli verdifull arv. Eksakte poengformler er ikke fastsatt.

## Landbrett — brukerens føringer

- Foreløpig **4 × 4 områder**, med rader som åpnes gjennom infrastruktur.
- Nærmeste rad er tilgjengelig først. Landrad 2–4 må åpnes; landrader og teknologitiers er forskjellige begreper.
- Start med noe tradisjonelt landbruk, lett tømmerhogst og ellers natur. Eksakt startoppsett er ikke fastsatt.
- Areal fordeles mellom industri, landbruk og eventuelt bolig ved høy befolkning.
- Lett og tung industri; tradisjonelt og industrielt landbruk.
- Skånsom høsting bevarer natur, mens intensiv utnyttelse/flatehogst endrer den.
- Landbrettets inngrep skal følge landet inn i fase 2.
- **Kolonier er droppet.** All utbygging er lokal.

## Fase 2 — brukerens siste retning

Grunnsystemer: energi, mat, andre naturressurser, teknologi/forskning, klimagasser og lokal forurensning, samt en samlet faktor for velstand/livskvalitet/tilfredshet. Navnet på denne faktoren er åpent.

- Produksjon og befolkning skaper løpende belastning. Foreløpig formulering er aktive produksjonsfasiliteter + befolkning = utslipp.
- Bemannet fabrikk gir produksjon og utslipp. Ubemannet fabrikk gir ingen av delene, men opptar fortsatt land.
- En global klimagassbeholdning starter på et nivå avledet av fase 1 og øker med videre utslipp.
- Terskler utløser Stain-kort i tre alvorlighetsgrader. Tidlige hendelser kan unntaksvis være positive; de høyeste nivåene kan utløse samfunnskollaps.
- For høy global belastning gir felles tap.
- Levestandard må opprettholdes samtidig som utslipp reduseres, skade repareres og natur frigjøres.
- Kultur og bærekraftig teknologi kan opprettholde livskvalitet med lavere ressursbruk.
- Tillit/stabilitet og tilfredshet er omtalt, men forholdet mellom dem er ikke ferdig bestemt.
- Matmangel fører til befolkningstap og alvorlig fall i tilfredshet. Lav tilfredshet svekker produksjon/forskning.
- En dødsspiral er tilsiktet, men det skal være mulig å unngå den fra alle tillatte fase 1-resultater.
- Samarbeidsprosjekter finansieres med bidrag av industri, forskning og/eller penger.
- Tre nye teknologitiers i fase 2. Renere energi og energieffektivisering er sentralt.
- Permafrosthendelser og avansert kjernekraft/fusjon er nevnte kandidater, ikke ferdig balanserte eller faktakontrollerte kort.

## Kortproduksjon — siste bestilling og format

Det finnes tekstgrunnlag for **20 Tier 1-teknologier**, bevart i `design/tier-1.md`. Første ti ble omtalt som prototype 0.2. Tallverdiene er foreløpige.

Brukerens krav:

- Kort skal printes i 0,5 mm sort PLA, med gravert motiv og tekst.
- Sideforhold bredde:høyde **1:1,618**.
- Flott, realistisk **hvit grafikk på transparent bakgrunn**.
- All relevant korttekst skal være med.
- **Separate PNG-filer, ett kort per bilde.**

Forrige assistent foreslo 63 × 102 mm og 1260 × 2040 piksler, ren sort/hvit og omtrent 0,4 mm minste sentrale strek. Dette er produksjonsforslag, mens brukerens sideforhold og transparente bakgrunn er føringer.

Siste bestilling i kilden: «ok.lag kortene som png», etter at kort 11–20 var foreslått. Neste konkrete produksjonsoppgave er dermed PNG-kort 11–20 i den etablerte stilen. Overtakelsen har ikke produsert disse på nytt eller bekreftet tidligere levering.

## Åpne spørsmål som må beholdes åpne

- Rundeantall mot perioden 1750–1980.
- Grunnproduksjon, startressurser, mating, befolkningsvekst og full runderekkefølge.
- Handelskapasitetens måleenhet og om handel koster handling.
- Nøyaktig markedsoppsett og tieråpning.
- Rabattstabling, minstepris, definisjon av dampanlegg og tilstøtende felt.
- Sammenheng mellom fase 1-poeng og samlet resultat.
- Overføring av historiske utslipp, naturinngrep og positiv kapasitet til fase 2.
- Navn og rolle for tilfredshet, tillit og stabilitet.
- Garantien om at alle lovlige fase 1-resultater skal gi en vinnbar fase 2.
- Historisk/naturvitenskapelig kvalitetssikring og faktisk spillbalanse.
