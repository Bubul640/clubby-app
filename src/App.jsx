import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase.js";

const GFONTS = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ DONNÉES ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CLUBS = [
  { id:1, name:"Tennis Club de Paris", city:"Paris", arrondissement:"16e", sport:"Tennis", emoji:"🎾", type:"Privé", indoor:false, rating:4.8, reviews:234, priceMin:80, priceMax:150, priceUnit:"mois", priceCourse:25, essaiGratuit:true, tarifEtudiant:true, tarifSenior:true, tarifFamille:false, womenOnly:false, pmr:true, postPartum:false, parentEnfant:true, ambiance:"performance", levels:["Débutant","Intermédiaire","Avancé"], features:["12 courts terre battue","4 courts couverts","Pro shop","Restaurant","Vestiaires","Douches","Parking"], labels:["PMR ♿","Essai gratuit ✓","Tarif étudiant","Parent/enfant"], trendBadge:"Populaire", courses:[{name:"Cours collectif débutant",level:"Débutant",duration:60,maxPeople:8,price:25,spotsLeft:3,equipment:"Raquette fournie",language:"Français"},{name:"Perfectionnement",level:"Intermédiaire",duration:90,maxPeople:6,price:35,spotsLeft:1,equipment:"Raquette perso",language:"Français / Anglais"},{name:"Cours particulier",level:"Tous niveaux",duration:60,maxPeople:1,price:70,spotsLeft:2,equipment:"Matériel fourni",language:"Français / Anglais / Espagnol"}], coaches:[{name:"Marc Dupont",title:"Entraîneur fédéral",certif:"Brevet d'État Tennis",languages:["Français","Anglais"],initials:"MD"},{name:"Sophie Martin",title:"Prof certifiée FFT",certif:"Diplôme d'État JEPS",languages:["Français","Espagnol"],initials:"SM"}], schedule:{"Lun":["09:00","11:00","18:00","20:00"],"Mar":["09:00","11:00","18:00"],"Mer":["09:00","14:00","18:00","20:00"],"Jeu":["09:00","11:00","18:00"],"Ven":["09:00","11:00","18:00","20:00"],"Sam":["09:00","11:00","14:00"],"Dim":["09:00","11:00"]}, cancelPolicy:"Annulation gratuite jusqu'à 24h avant. Au-delà, le cours est dû.", socialLinks:{instagram:"@tcparis16",facebook:"TennisClubParis16"}, description:"Club de tennis premium au cœur de Paris avec 12 courts en terre battue et 4 courts couverts. Ambiance conviviale et professionnelle, idéal pour tous niveaux.", image:"https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80", lat:48.856, lng:2.299, accentColor:"#1AC7C1", tags:["Premium","Cours collectifs","Coach perso"], address:"12 Allée des Courts, 75016 Paris", phone:"01 42 XX XX XX", email:"contact@tcparis.fr", openHours:"7h - 22h tous les jours" },
  { id:2, name:"Padel Factory Vincennes", city:"Vincennes", arrondissement:"Val-de-Marne", sport:"Padel", emoji:"🏓", type:"Privé", indoor:true, rating:4.6, reviews:156, priceMin:15, priceMax:30, priceUnit:"séance", priceCourse:15, essaiGratuit:true, tarifEtudiant:true, tarifSenior:false, tarifFamille:true, womenOnly:false, pmr:false, postPartum:false, parentEnfant:false, ambiance:"loisirs", levels:["Débutant","Intermédiaire","Avancé"], features:["8 terrains panoramiques","Tournois hebdo","Location matériel","Bar","Vestiaires"], labels:["Essai gratuit ✓","Tarif étudiant","Tarif famille"], trendBadge:"Tendance", courses:[{name:"Initiation Padel",level:"Débutant",duration:60,maxPeople:4,price:15,spotsLeft:4,equipment:"Raquette fournie",language:"Français"},{name:"Clinique technique",level:"Intermédiaire",duration:90,maxPeople:4,price:25,spotsLeft:2,equipment:"Raquette perso recommandée",language:"Français / Anglais"}], coaches:[{name:"Carlos Rivera",title:"Coach certifié FIP",certif:"Licence Pro Padel",languages:["Français","Espagnol","Anglais"],initials:"CR"}], schedule:{"Lun":["10:00","18:00","20:00"],"Mar":["10:00","18:00","20:00"],"Mer":["10:00","12:00","14:00","18:00"],"Jeu":["10:00","18:00","20:00"],"Ven":["10:00","12:00","18:00","20:00"],"Sam":["09:00","11:00","14:00","16:00"],"Dim":["09:00","11:00","14:00"]}, cancelPolicy:"Annulation gratuite jusqu'à 2h avant. Après ce délai, 50% du montant est retenu.", socialLinks:{instagram:"@padelfactoryvincennes",facebook:"PadelFactoryVincennes"}, description:"Le plus grand centre de padel du Val-de-Marne avec 8 terrains panoramiques. Cours pour tous niveaux et tournois réguliers dans une ambiance festive.", image:"https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80", lat:48.846, lng:2.439, accentColor:"#FF9A5A", tags:["Tournois","Indoor","Ambiance"], address:"45 Avenue de Paris, 94300 Vincennes", phone:"01 43 XX XX XX", email:"bonjour@padelfactory-vincennes.fr", openHours:"8h - 23h tous les jours" },
  { id:3, name:"Zen Yoga Studio", city:"Paris", arrondissement:"11e", sport:"Yoga", emoji:"🧘", type:"Privé", indoor:true, rating:4.9, reviews:312, priceMin:80, priceMax:120, priceUnit:"mois", priceCourse:18, essaiGratuit:true, tarifEtudiant:true, tarifSenior:false, tarifFamille:false, womenOnly:false, pmr:true, postPartum:true, parentEnfant:false, ambiance:"bien-être", levels:["Débutant","Intermédiaire","Avancé"], features:["4 styles de yoga","Cours en ligne","Hammam","Vestiaires","Douches"], labels:["PMR ♿","Post-partum 🤱","Essai gratuit ✓"], trendBadge:"Populaire", courses:[{name:"Hatha Yoga",level:"Débutant",duration:60,maxPeople:12,price:18,spotsLeft:5,equipment:"Tapis fourni",language:"Français"},{name:"Vinyasa Flow",level:"Intermédiaire",duration:75,maxPeople:10,price:20,spotsLeft:2,equipment:"Tapis perso conseillé",language:"Français / Anglais"},{name:"Yoga post-partum",level:"Débutant",duration:60,maxPeople:8,price:22,spotsLeft:1,equipment:"Tapis fourni + accessoires",language:"Français"},{name:"Yin Yoga",level:"Tous niveaux",duration:90,maxPeople:15,price:18,spotsLeft:8,equipment:"Tapis + bolster fournis",language:"Français"}], coaches:[{name:"Amélie Chen",title:"Professeure RYT 500",certif:"Yoga Alliance 500h",languages:["Français","Anglais","Mandarin"],initials:"AC"},{name:"Léa Moreau",title:"Spécialiste périnatalité",certif:"Yoga prénatal & post-natal",languages:["Français"],initials:"LM"}], schedule:{"Lun":["07:00","09:00","12:00","18:30","20:00"],"Mar":["07:00","09:00","18:30","20:00"],"Mer":["07:00","09:00","12:00","18:30"],"Jeu":["07:00","09:00","18:30","20:00"],"Ven":["07:00","09:00","12:00","18:30","20:00"],"Sam":["09:00","10:30","12:00"],"Dim":["09:00","10:30"]}, cancelPolicy:"Annulation possible jusqu'à 12h avant via l'application. Les cours annulés sont recrédités automatiquement.", socialLinks:{instagram:"@zenyogaparis11",facebook:"ZenYogaStudio"}, description:"Studio de yoga moderne proposant Hatha, Vinyasa, Yin et cours spécialisés post-partum. Professeurs certifiés et ambiance zen garantie dans le 11e.", image:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80", lat:48.863, lng:2.377, accentColor:"#9B5DE5", tags:["Post-partum","PMR","Bien-être"], address:"8 Rue de la Sérénité, 75011 Paris", phone:"01 43 XX XX XX", email:"namaste@zen-yoga-paris.fr", openHours:"6h30 - 21h30 tous les jours" },
  { id:4, name:"Boxing Gym Montreuil", city:"Montreuil", arrondissement:"Seine-Saint-Denis", sport:"Boxe", emoji:"🥊", type:"Association", indoor:true, rating:4.7, reviews:178, priceMin:200, priceMax:400, priceUnit:"an", priceCourse:null, essaiGratuit:true, tarifEtudiant:true, tarifSenior:false, tarifFamille:false, womenOnly:false, pmr:false, postPartum:false, parentEnfant:false, ambiance:"performance", levels:["Débutant","Intermédiaire","Avancé","Compétition"], features:["Ring olympique","Boxe anglaise & française","Sacs de frappe","Coach perso","Vestiaires"], labels:["Essai gratuit ✓","Tarif étudiant","Coach perso"], trendBadge:"Nouveau", courses:[{name:"Boxe Débutant",level:"Débutant",duration:60,maxPeople:15,price:null,spotsLeft:6,equipment:"Gants fournis pour l'essai",language:"Français"},{name:"Prépa compétition",level:"Compétition",duration:90,maxPeople:6,price:null,spotsLeft:1,equipment:"Gants + coquille perso obligatoires",language:"Français"}], coaches:[{name:"Jamal Diarra",title:"Champion de France amateur",certif:"BPJEPS Boxe",languages:["Français","Anglais"],initials:"JD"}], schedule:{"Lun":["09:00","18:00","20:00"],"Mar":["18:00","20:00"],"Mer":["09:00","14:00","18:00"],"Jeu":["18:00","20:00"],"Ven":["09:00","18:00","20:00"],"Sam":["10:00","12:00"],"Dim":[]}, cancelPolicy:"Inscription annuelle. Accès libre à toutes les séances programmées sans réservation.", socialLinks:{instagram:"@boxinggymmontreuil",facebook:"BoxingGymMontreuil"}, description:"Club de boxe anglaise et française à Montreuil. Entraînements pour débutants et compétiteurs dans une ambiance motivante et bienveillante. Association reconnue FFA.", image:"https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80", lat:48.864, lng:2.448, accentColor:"#EF4444", tags:["Compétition","Coach","Association"], address:"23 Rue du Stade, 93100 Montreuil", phone:"01 48 XX XX XX", email:"boxing@bgm.fr", openHours:"Lun-Sam 9h - 22h" },
  { id:5, name:"Aqua Center Versailles", city:"Versailles", arrondissement:"Yvelines", sport:"Natation", emoji:"🏊", type:"Association", indoor:true, rating:4.5, reviews:445, priceMin:100, priceMax:200, priceUnit:"an", priceCourse:8, essaiGratuit:false, tarifEtudiant:false, tarifSenior:true, tarifFamille:true, womenOnly:false, pmr:true, postPartum:true, parentEnfant:true, ambiance:"bien-être", levels:["Débutant","Intermédiaire","Avancé"], features:["Piscine olympique","Espace bien-être","Sauna","Cours adultes & enfants","Vestiaires","Parking"], labels:["PMR ♿","Post-partum 🤱","Tarif senior","Tarif famille","Parent/enfant"], trendBadge:null, courses:[{name:"Natation adultes",level:"Tous niveaux",duration:45,maxPeople:10,price:8,spotsLeft:4,equipment:"Bonnet obligatoire",language:"Français"},{name:"Aquagym",level:"Débutant",duration:45,maxPeople:20,price:8,spotsLeft:10,equipment:"Maillot + bonnet",language:"Français"},{name:"Aqua post-natal",level:"Débutant",duration:45,maxPeople:8,price:12,spotsLeft:2,equipment:"Maillot + bonnet",language:"Français"},{name:"Parent/enfant (dès 3 ans)",level:"Débutant",duration:30,maxPeople:8,price:14,spotsLeft:3,equipment:"Maillot + bonnet pour 2",language:"Français"}], coaches:[{name:"Claire Fontaine",title:"MNS diplômée",certif:"BEESAN",languages:["Français"],initials:"CF"},{name:"Paul Lebrun",title:"Maître-nageur sauveteur",certif:"BEESAN + BNSSA",languages:["Français","Anglais"],initials:"PL"}], schedule:{"Lun":["07:00","09:00","12:00","17:00","19:00"],"Mar":["07:00","09:00","12:00","17:00","19:00"],"Mer":["07:00","09:00","14:00","17:00"],"Jeu":["07:00","09:00","12:00","17:00","19:00"],"Ven":["07:00","09:00","12:00","17:00","19:00"],"Sam":["08:00","10:00","14:00"],"Dim":["08:00","10:00"]}, cancelPolicy:"Annulation possible jusqu'à 24h avant. Crédit automatique sur le compte adhérent.", socialLinks:{instagram:"@aquacenter78",facebook:"AquaCenterVersailles"}, description:"Complexe aquatique à Versailles avec piscine olympique, bassin ludique et espace bien-être. Cours pour tous âges, aquagym, post-partum et parent/enfant dès 3 ans.", image:"https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80", lat:48.804, lng:2.123, accentColor:"#38BDF8", tags:["Post-partum","Famille","PMR"], address:"100 Avenue de Saint-Cloud, 78000 Versailles", phone:"01 39 XX XX XX", email:"contact@aqua-versailles.fr", openHours:"6h - 22h tous les jours" },
  { id:6, name:"Bloc Vertical Paris", city:"Paris", arrondissement:"19e", sport:"Escalade", emoji:"🧗", type:"Privé", indoor:true, rating:4.8, reviews:203, priceMin:25, priceMax:25, priceUnit:"séance", priceCourse:25, essaiGratuit:true, tarifEtudiant:true, tarifSenior:false, tarifFamille:true, womenOnly:false, pmr:false, postPartum:false, parentEnfant:true, ambiance:"loisirs", levels:["Débutant","Intermédiaire","Avancé"], features:["Mur de bloc 800m²","Voie de corde","Location matériel","Café","Vestiaires","Sauna"], labels:["Essai gratuit ✓","Tarif étudiant","Parent/enfant","Tarif famille"], trendBadge:"Tendance", courses:[{name:"Initiation bloc",level:"Débutant",duration:90,maxPeople:8,price:25,spotsLeft:3,equipment:"Chaussons fournis",language:"Français / Anglais"},{name:"Cours enfants (8-14 ans)",level:"Débutant",duration:60,maxPeople:8,price:20,spotsLeft:2,equipment:"Chaussons fournis",language:"Français"},{name:"Progression technique",level:"Intermédiaire",duration:90,maxPeople:6,price:30,spotsLeft:1,equipment:"Chaussons perso recommandés",language:"Français"}], coaches:[{name:"Théo Escalier",title:"Guide haute montagne",certif:"BPJEPS Escalade",languages:["Français","Anglais"],initials:"TE"},{name:"Nadia Blanc",title:"Monitrice fédérale",certif:"CQP Moniteur Escalade",languages:["Français"],initials:"NB"}], schedule:{"Lun":["10:00","12:00","18:00","20:00"],"Mar":["10:00","18:00","20:00"],"Mer":["10:00","14:00","18:00"],"Jeu":["10:00","18:00","20:00"],"Ven":["10:00","12:00","18:00","20:00"],"Sam":["09:00","11:00","14:00","16:00"],"Dim":["09:00","11:00","14:00"]}, cancelPolicy:"Annulation gratuite jusqu'à 6h avant. Sinon séance décomptée.", socialLinks:{instagram:"@blocvertical19",facebook:"BlocVerticalParis"}, description:"Salle de bloc et voie au cœur du 19e. Ambiance communautaire, staff passionné et murs redessinés toutes les semaines. Idéal familles et passionnés.", image:"https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80", lat:48.887, lng:2.379, accentColor:"#22C55E", tags:["Parent/enfant","Famille","Communauté"], address:"7 Rue des Grimpeurs, 75019 Paris", phone:"01 40 XX XX XX", email:"allo@blocvertical.fr", openHours:"10h - 22h30 tous les jours" },
  { id:7, name:"Studio Pilates Boulogne", city:"Boulogne-Billancourt", arrondissement:"Hauts-de-Seine", sport:"Pilates", emoji:"🤸", type:"Privé", indoor:true, rating:4.9, reviews:187, priceMin:90, priceMax:160, priceUnit:"mois", priceCourse:22, essaiGratuit:true, tarifEtudiant:false, tarifSenior:true, tarifFamille:false, womenOnly:true, pmr:true, postPartum:true, parentEnfant:false, ambiance:"bien-être", levels:["Débutant","Intermédiaire"], features:["Reformers Pilates","Cours au sol","Mat work","Post-partum","Vestiaires","Douches"], labels:["Women Only 💜","PMR ♿","Post-partum 🤱","Essai gratuit ✓","Tarif senior"], trendBadge:"Nouveau", courses:[{name:"Pilates Mat débutant",level:"Débutant",duration:55,maxPeople:8,price:22,spotsLeft:4,equipment:"Tapis fourni",language:"Français"},{name:"Reformer Pilates",level:"Intermédiaire",duration:55,maxPeople:4,price:45,spotsLeft:1,equipment:"Tout fourni",language:"Français"},{name:"Pilates post-partum",level:"Débutant",duration:55,maxPeople:6,price:28,spotsLeft:2,equipment:"Tout fourni",language:"Français"}], coaches:[{name:"Marie-Anne Leroy",title:"Instructrice STOTT PILATES",certif:"Certification STOTT + périnatalité",languages:["Français","Anglais"],initials:"ML"}], schedule:{"Lun":["09:00","10:00","11:00","17:00","18:00","19:00"],"Mar":["09:00","10:00","17:00","18:00","19:00"],"Mer":["09:00","10:00","11:00","17:00"],"Jeu":["09:00","10:00","17:00","18:00","19:00"],"Ven":["09:00","10:00","11:00","17:00","18:00"],"Sam":["09:00","10:00","11:00"],"Dim":[]}, cancelPolicy:"Annulation jusqu'à 24h avant. Séances annulées moins de 24h facturées à 50%.", socialLinks:{instagram:"@pilatesboulogne92",facebook:"StudioPilatesBoulogne"}, description:"Studio exclusivement féminin à Boulogne-Billancourt proposant Pilates mat et reformer, avec spécialisation post-partum. Petits groupes pour un suivi vraiment personnalisé.", image:"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80", lat:48.835, lng:2.239, accentColor:"#EC4899", tags:["Women Only","Post-partum","PMR"], address:"15 Rue de la Paix, 92100 Boulogne-Billancourt", phone:"01 46 XX XX XX", email:"studio@pilates-boulogne.fr", openHours:"Lun-Sam 8h30 - 20h" },
  { id:8, name:"Judo Club Saint-Denis", city:"Saint-Denis", arrondissement:"Seine-Saint-Denis", sport:"Judo", emoji:"🥋", type:"Association", indoor:true, rating:4.6, reviews:129, priceMin:180, priceMax:280, priceUnit:"an", priceCourse:null, essaiGratuit:true, tarifEtudiant:true, tarifSenior:false, tarifFamille:true, womenOnly:false, pmr:true, postPartum:false, parentEnfant:true, ambiance:"performance", levels:["Débutant","Intermédiaire","Avancé","Compétition"], features:["Tatami homologué","Cours enfants & adultes","Compétitions régionales","Vestiaires","Parking"], labels:["PMR ♿","Essai gratuit ✓","Parent/enfant","Tarif famille","Tarif étudiant"], trendBadge:null, courses:[{name:"Judo Enfants (5-10 ans)",level:"Débutant",duration:60,maxPeople:15,price:null,spotsLeft:7,equipment:"Kimono fourni pour essai",language:"Français"},{name:"Judo Adultes",level:"Tous niveaux",duration:90,maxPeople:20,price:null,spotsLeft:12,equipment:"Kimono perso après 1 mois",language:"Français"},{name:"Compétition",level:"Avancé",duration:120,maxPeople:10,price:null,spotsLeft:2,equipment:"Kimono homologué IJF",language:"Français"}], coaches:[{name:"Karim Ndiaye",title:"Ceinture noire 4e dan",certif:"DEJEPS Judo + Diplôme fédéral",languages:["Français","Anglais","Wolof"],initials:"KN"}], schedule:{"Lun":["17:00","18:30","20:00"],"Mar":["17:00","20:00"],"Mer":["14:00","16:00","18:00"],"Jeu":["17:00","18:30","20:00"],"Ven":["17:00","20:00"],"Sam":["09:00","10:30"],"Dim":[]}, cancelPolicy:"Licence annuelle. Accès libre à tous les créneaux sans réservation.", socialLinks:{instagram:"@judoclubsaintdenis",facebook:"JudoClubSaintDenis"}, description:"Club familial en Seine-Saint-Denis avec cours pour tous les âges, de 5 à 65 ans. Ambiance bienveillante, compétitions pour qui le souhaite, accessibilité PMR.", image:"https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80", lat:48.936, lng:2.357, accentColor:"#F59E0B", tags:["Famille","Enfants","PMR"], address:"34 Avenue du Président Wilson, 93200 Saint-Denis", phone:"01 48 XX XX XX", email:"contact@judoclub-saintdenis.fr", openHours:"Lun-Sam 17h-22h / Mer 14h-19h" },
  { id:9, name:"CrossFit Nord Paris", city:"Paris", arrondissement:"18e", sport:"CrossFit", emoji:"💪", type:"Privé", indoor:true, rating:4.7, reviews:168, priceMin:100, priceMax:160, priceUnit:"mois", priceCourse:null, essaiGratuit:true, tarifEtudiant:false, tarifSenior:false, tarifFamille:false, womenOnly:false, pmr:false, postPartum:false, parentEnfant:false, ambiance:"performance", levels:["Débutant","Intermédiaire","Avancé"], features:["Box CrossFit","WOD quotidien","Coaching individualisé","Nutrition","Vestiaires","Douches"], labels:["Essai gratuit ✓","Coach perso"], trendBadge:"Populaire", courses:[{name:"Foundations (débutant)",level:"Débutant",duration:60,maxPeople:6,price:null,spotsLeft:2,equipment:"Tout fourni",language:"Français / Anglais"},{name:"WOD CrossFit",level:"Intermédiaire",duration:60,maxPeople:15,price:null,spotsLeft:5,equipment:"Chaussures adaptées",language:"Français"},{name:"Open Gym",level:"Avancé",duration:90,maxPeople:10,price:null,spotsLeft:3,equipment:"Matériel perso",language:"Français"}], coaches:[{name:"Baptiste Duval",title:"CrossFit Level 2 Trainer",certif:"CF-L2 + Weightlifting",languages:["Français","Anglais"],initials:"BD"},{name:"Emma Perrin",title:"CrossFit Level 1 + Nutrition",certif:"CF-L1 + Certif Nutrition",languages:["Français"],initials:"EP"}], schedule:{"Lun":["06:30","07:30","09:30","12:15","18:00","19:00","20:00"],"Mar":["06:30","07:30","12:15","18:00","19:00","20:00"],"Mer":["06:30","07:30","09:30","12:15","18:00","19:00"],"Jeu":["06:30","07:30","12:15","18:00","19:00","20:00"],"Ven":["06:30","07:30","09:30","12:15","18:00","19:00"],"Sam":["08:00","09:00","10:00"],"Dim":["09:00","10:00"]}, cancelPolicy:"Annulation possible jusqu'à 1h avant. Au-delà, la séance est décomptée.", socialLinks:{instagram:"@crossfitnordparis",facebook:"CrossFitNordParis18"}, description:"Box CrossFit affiliée dans le 18e. Communauté soudée, coaching de qualité, pour tous niveaux à partir de zéro. Suivi nutrition disponible.", image:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", lat:48.893, lng:2.344, accentColor:"#EF4444", tags:["Performance","Communauté","Indoor"], address:"45 Rue Championnet, 75018 Paris", phone:"01 46 XX XX XX", email:"info@crossfitnordparis.fr", openHours:"Lun-Ven 6h30-21h / Sam-Dim 8h-12h" },
  { id:10, name:"Athlé Club Créteil", city:"Créteil", arrondissement:"Val-de-Marne", sport:"Athlétisme", emoji:"🏃", type:"Association", indoor:false, rating:4.4, reviews:89, priceMin:100, priceMax:200, priceUnit:"an", priceCourse:null, essaiGratuit:true, tarifEtudiant:true, tarifSenior:true, tarifFamille:true, womenOnly:false, pmr:false, postPartum:false, parentEnfant:true, ambiance:"performance", levels:["Débutant","Intermédiaire","Avancé","Compétition"], features:["Piste synthétique","Saut en longueur","Lancer","Sprint","Cross-country","Vestiaires"], labels:["Essai gratuit ✓","Parent/enfant","Tarif famille","Tarif étudiant","Tarif senior"], trendBadge:"Nouveau", courses:[{name:"Course à pied tous niveaux",level:"Tous niveaux",duration:90,maxPeople:20,price:null,spotsLeft:9,equipment:"Chaussures de running",language:"Français"},{name:"Athlétisme jeunes (8-16 ans)",level:"Débutant",duration:90,maxPeople:15,price:null,spotsLeft:5,equipment:"Chaussures de sport",language:"Français"}], coaches:[{name:"David Kone",title:"Entraîneur FFA certifié",certif:"Diplôme d'État + Brevet Fédéral",languages:["Français"],initials:"DK"}], schedule:{"Lun":["17:30","19:00"],"Mar":[],"Mer":["14:00","17:30"],"Jeu":["17:30","19:00"],"Ven":[],"Sam":["09:00","10:30"],"Dim":["09:00"]}, cancelPolicy:"Licence annuelle, accès libre aux entraînements.", socialLinks:{instagram:"@athletecreteil94",facebook:"AthleClubCreteil"}, description:"Association sportive d'athlétisme du Val-de-Marne ouverte à tous, de 8 à 70 ans. Compétitions régionales, groupes jeunes et adultes dans un esprit associatif chaleureux.", image:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80", lat:48.777, lng:2.456, accentColor:"#10B981", tags:["Famille","Outdoor","Compétition"], address:"Stade Municipal, Avenue du Général de Gaulle, 94000 Créteil", phone:"01 42 XX XX XX", email:"contact@athle-creteil.fr", openHours:"Mer 14h-18h / Lun,Jeu 17h30-20h30 / Sam-Dim 9h-12h" },
  { id:11, name:"Dojo Karaté Levallois", city:"Levallois-Perret", arrondissement:"Hauts-de-Seine", sport:"Karaté", emoji:"🥋", type:"Association", indoor:true, rating:4.7, reviews:143, priceMin:190, priceMax:320, priceUnit:"an", priceCourse:null, essaiGratuit:true, tarifEtudiant:true, tarifSenior:true, tarifFamille:true, womenOnly:false, pmr:true, postPartum:false, parentEnfant:true, ambiance:"performance", levels:["Débutant","Intermédiaire","Avancé","Compétition"], features:["Tatami 300m²","Cours enfants & adultes","Kata & Kumité","Ceintures noires formateurs","Vestiaires","Parking"], labels:["PMR ♿","Essai gratuit ✓","Parent/enfant","Tarif famille"], trendBadge:"Populaire", courses:[{name:"Karaté Enfants (5-12 ans)",level:"Débutant",duration:60,maxPeople:16,price:null,spotsLeft:5,equipment:"Kimono fourni essai",language:"Français"},{name:"Karaté Adultes",level:"Tous niveaux",duration:90,maxPeople:20,price:null,spotsLeft:8,equipment:"Kimono perso",language:"Français"},{name:"Compétition Kumité",level:"Avancé",duration:120,maxPeople:8,price:null,spotsLeft:2,equipment:"Protections homologuées WKF",language:"Français"}], coaches:[{name:"Pierre Tanaka",title:"Ceinture noire 5e dan",certif:"BPJEPS Karaté + Arbitre WKF",languages:["Français","Japonais"],initials:"PT"}], schedule:{"Lun":["17:00","18:30","20:00"],"Mar":["18:30","20:00"],"Mer":["14:00","16:00","18:00"],"Jeu":["17:00","18:30","20:00"],"Ven":["18:30","20:00"],"Sam":["09:00","10:30"],"Dim":[]}, cancelPolicy:"Licence annuelle FFK. Accès libre à tous les entraînements.", socialLinks:{instagram:"@dojokaratelevallois",facebook:"DojoKarateLevalloisParis"}, description:"Dojo de karaté traditionnel à Levallois avec compétitions régionales et nationales. Cours enfants dès 5 ans, adultes tous niveaux. Ambiance familiale et exigeante.", image:"https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80", lat:48.895, lng:2.285, accentColor:"#F59E0B", tags:["Compétition","Enfants","Famille"], address:"12 Rue du Maréchal Foch, 92300 Levallois-Perret", phone:"01 47 XX XX XX", email:"contact@dojo-levallois.fr", openHours:"Lun-Sam 17h-22h / Mer 14h-19h" },
  { id:12, name:"Swim Academy Issy", city:"Issy-les-Moulineaux", arrondissement:"Hauts-de-Seine", sport:"Natation", emoji:"🏊", type:"Privé", indoor:true, rating:4.8, reviews:211, priceMin:120, priceMax:220, priceUnit:"mois", priceCourse:20, essaiGratuit:true, tarifEtudiant:false, tarifSenior:true, tarifFamille:true, womenOnly:false, pmr:true, postPartum:true, parentEnfant:true, ambiance:"bien-être", levels:["Débutant","Intermédiaire","Avancé"], features:["Bassin 25m chauffé","Cours adultes & enfants","Aquabike","Balnéo","Vestiaires","Parking"], labels:["PMR ♿","Post-partum 🤱","Essai gratuit ✓","Tarif famille"], trendBadge:"Nouveau", courses:[{name:"Nage perfectionnement",level:"Intermédiaire",duration:60,maxPeople:8,price:20,spotsLeft:3,equipment:"Bonnet + lunettes",language:"Français"},{name:"Aquabike",level:"Débutant",duration:45,maxPeople:12,price:18,spotsLeft:4,equipment:"Maillot + bonnet",language:"Français"},{name:"Bébé nageur (4-36 mois)",level:"Débutant",duration:30,maxPeople:6,price:25,spotsLeft:2,equipment:"Couche piscine",language:"Français"}], coaches:[{name:"Lucie Vidal",title:"MNS + Coach sportif",certif:"BEESAN + BNSSA",languages:["Français","Anglais"],initials:"LV"}], schedule:{"Lun":["07:00","09:00","12:00","17:00","19:00"],"Mar":["07:00","09:00","17:00","19:00"],"Mer":["07:00","09:00","14:00","17:00"],"Jeu":["07:00","09:00","12:00","17:00","19:00"],"Ven":["07:00","09:00","12:00","17:00","19:00"],"Sam":["08:00","09:30","11:00"],"Dim":["09:00","10:30"]}, cancelPolicy:"Annulation gratuite jusqu'à 24h avant. Crédit automatique.", socialLinks:{instagram:"@swimacademyissy",facebook:"SwimAcademyIssy"}, description:"Centre de natation premium à Issy-les-Moulineaux avec bassin 25m chauffé toute l'année. Aquabike, bébé nageur, cours adultes. Accès PMR et post-partum spécialisé.", image:"https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80", lat:48.823, lng:2.271, accentColor:"#38BDF8", tags:["Post-partum","Famille","Premium"], address:"30 Rue du Général Leclerc, 92130 Issy-les-Moulineaux", phone:"01 46 XX XX XX", email:"hello@swimacademy-issy.fr", openHours:"7h - 21h30 tous les jours" },
  { id:13, name:"Danse Studio Oberkampf", city:"Paris", arrondissement:"11e", sport:"Danse", emoji:"💃", type:"Privé", indoor:true, rating:4.9, reviews:278, priceMin:70, priceMax:130, priceUnit:"mois", priceCourse:16, essaiGratuit:true, tarifEtudiant:true, tarifSenior:false, tarifFamille:false, womenOnly:false, pmr:false, postPartum:false, parentEnfant:false, ambiance:"loisirs", levels:["Débutant","Intermédiaire","Avancé"], features:["Salle avec miroirs","Parquet flottant","Salsa","Hip-hop","Bachata","Vestiaires"], labels:["Essai gratuit ✓","Tarif étudiant"], trendBadge:"Tendance", courses:[{name:"Salsa Débutant",level:"Débutant",duration:60,maxPeople:14,price:16,spotsLeft:6,equipment:"Chaussures à semelle lisse",language:"Français / Espagnol"},{name:"Bachata Sensual",level:"Intermédiaire",duration:60,maxPeople:10,price:18,spotsLeft:3,equipment:"Chaussures de danse",language:"Français"},{name:"Hip-Hop Urban",level:"Tous niveaux",duration:60,maxPeople:16,price:16,spotsLeft:8,equipment:"Sneakers propres",language:"Français"}], coaches:[{name:"María González",title:"Professeure certifiée",certif:"Diplôme fédéral Danse",languages:["Français","Espagnol","Anglais"],initials:"MG"},{name:"Kevin Diop",title:"Chorégraphe hip-hop",certif:"Formation FFMDA",languages:["Français"],initials:"KD"}], schedule:{"Lun":["12:00","18:30","20:00"],"Mar":["18:30","20:00"],"Mer":["12:00","18:30","20:00"],"Jeu":["18:30","20:00"],"Ven":["12:00","18:30","20:00"],"Sam":["10:00","11:30","14:00","15:30"],"Dim":["10:00","11:30"]}, cancelPolicy:"Annulation jusqu'à 6h avant. Cours non annulé = cours décompté.", socialLinks:{instagram:"@dansestudiooberkampf",facebook:"DanseStudioOberkampf"}, description:"Studio de danse convivial dans le 11e avec cours de salsa, bachata et hip-hop. Professeurs passionnés, ambiance festive, idéal pour débutants comme confirmés.", image:"https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&q=80", lat:48.864, lng:2.375, accentColor:"#EC4899", tags:["Festif","Couple","Débutant ok"], address:"56 Rue Oberkampf, 75011 Paris", phone:"01 43 XX XX XX", email:"hello@danse-oberkampf.fr", openHours:"Lun-Ven 12h-22h / Sam-Dim 10h-18h" },
  { id:14, name:"Gym Plus Neuilly", city:"Neuilly-sur-Seine", arrondissement:"Hauts-de-Seine", sport:"Gym", emoji:"🏋️", type:"Privé", indoor:true, rating:4.6, reviews:332, priceMin:60, priceMax:120, priceUnit:"mois", priceCourse:null, essaiGratuit:true, tarifEtudiant:true, tarifSenior:true, tarifFamille:false, womenOnly:false, pmr:true, postPartum:false, parentEnfant:false, ambiance:"performance", levels:["Débutant","Intermédiaire","Avancé"], features:["Espace cardio 40 machines","Salle de musculation","Cours collectifs","Coach perso","Sauna","Vestiaires"], labels:["PMR ♿","Essai gratuit ✓","Tarif étudiant","Tarif senior"], trendBadge:"Populaire", courses:[{name:"Circuit training",level:"Tous niveaux",duration:45,maxPeople:15,price:null,spotsLeft:5,equipment:"Tenue de sport",language:"Français"},{name:"Body Pump",level:"Débutant",duration:55,maxPeople:20,price:null,spotsLeft:12,equipment:"Tenue + serviette",language:"Français"},{name:"Coaching perso",level:"Tous niveaux",duration:60,maxPeople:1,price:65,spotsLeft:3,equipment:"Tout disponible",language:"Français / Anglais"}], coaches:[{name:"Antoine Roux",title:"Coach certifié STAPS",certif:"Licence STAPS + CF-L1",languages:["Français","Anglais"],initials:"AR"},{name:"Laura Petit",title:"Coach bien-être",certif:"BPJEPS AF",languages:["Français"],initials:"LP"}], schedule:{"Lun":["06:00","07:30","09:00","12:00","17:00","18:30","20:00"],"Mar":["06:00","07:30","12:00","17:00","18:30","20:00"],"Mer":["06:00","07:30","09:00","12:00","17:00","18:30"],"Jeu":["06:00","07:30","12:00","17:00","18:30","20:00"],"Ven":["06:00","07:30","09:00","12:00","17:00","18:30"],"Sam":["08:00","09:30","11:00"],"Dim":["09:00","10:30"]}, cancelPolicy:"Abonnement mensuel sans engagement. Accès libre aux machines 6h-23h.", socialLinks:{instagram:"@gymplusneuilly",facebook:"GymPlusNeuilly"}, description:"Salle de sport complète à Neuilly avec espace cardio, musculation, cours collectifs et coaching personnalisé. Équipements premium, ouverte 7j/7 dès 6h du matin.", image:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", lat:48.885, lng:2.269, accentColor:"#6366F1", tags:["Premium","Coach perso","Cardio"], address:"8 Avenue Charles de Gaulle, 92200 Neuilly-sur-Seine", phone:"01 46 XX XX XX", email:"contact@gymplus-neuilly.fr", openHours:"Lun-Ven 6h-23h / Sam-Dim 8h-21h" },
  { id:15, name:"Running Club Bois de Vincennes", city:"Paris", arrondissement:"12e", sport:"Running", emoji:"🏃", type:"Association", indoor:false, rating:4.5, reviews:167, priceMin:80, priceMax:120, priceUnit:"an", priceCourse:null, essaiGratuit:true, tarifEtudiant:true, tarifSenior:true, tarifFamille:true, womenOnly:false, pmr:false, postPartum:false, parentEnfant:false, ambiance:"bien-être", levels:["Débutant","Intermédiaire","Avancé"], features:["Entraînements en forêt","Prépa semi-marathon","Séances trail","Groupe WhatsApp","Ravitos"], labels:["Essai gratuit ✓","Tarif étudiant","Tarif senior","Tarif famille"], trendBadge:null, courses:[{name:"Jogging débutant",level:"Débutant",duration:60,maxPeople:25,price:null,spotsLeft:15,equipment:"Chaussures de running",language:"Français"},{name:"Fartlek & VMA",level:"Avancé",duration:75,maxPeople:12,price:null,spotsLeft:4,equipment:"Montre GPS conseillée",language:"Français"},{name:"Sortie trail weekend",level:"Intermédiaire",duration:120,maxPeople:20,price:null,spotsLeft:7,equipment:"Chaussures trail + veste",language:"Français"}], coaches:[{name:"Isabelle Morin",title:"Entraîneur FFA",certif:"Diplôme Entraîneur Athlétisme",languages:["Français"],initials:"IM"}], schedule:{"Lun":[],"Mar":["07:00","19:00"],"Mer":[],"Jeu":["07:00","19:00"],"Ven":[],"Sam":["08:00"],"Dim":["08:30"]}, cancelPolicy:"Inscription annuelle. Aucune réservation nécessaire, présentez-vous au RDV.", socialLinks:{instagram:"@rcboisvincennes",facebook:"RunningClubBoisVincennes"}, description:"Club de running associatif qui s'entraîne dans le Bois de Vincennes. Groupes de niveau, préparation aux courses (10km, semi, marathon), sorties trail le weekend.", image:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80", lat:48.837, lng:2.432, accentColor:"#10B981", tags:["Outdoor","Nature","Trail"], address:"Entrée Lac Daumesnil, Bois de Vincennes, 75012 Paris", phone:"06 XX XX XX XX", email:"bonjour@rc-vincennes.fr", openHours:"Mar & Jeu 7h/19h · Sam 8h · Dim 8h30" },
  { id:16, name:"Taekwondo Club Pantin", city:"Pantin", arrondissement:"Seine-Saint-Denis", sport:"Taekwondo", emoji:"🦵", type:"Association", indoor:true, rating:4.6, reviews:112, priceMin:150, priceMax:250, priceUnit:"an", priceCourse:null, essaiGratuit:true, tarifEtudiant:true, tarifSenior:false, tarifFamille:true, womenOnly:false, pmr:false, postPartum:false, parentEnfant:true, ambiance:"performance", levels:["Débutant","Intermédiaire","Avancé","Compétition"], features:["Tatami homologué WTF","Cours enfants & adultes","Poomsae & Kyorugi","Compétitions départementales","Vestiaires"], labels:["Essai gratuit ✓","Tarif étudiant","Parent/enfant","Tarif famille"], trendBadge:"Nouveau", courses:[{name:"Taekwondo 6-14 ans",level:"Débutant",duration:60,maxPeople:18,price:null,spotsLeft:6,equipment:"Dobok fourni essai",language:"Français"},{name:"Adultes tous niveaux",level:"Tous niveaux",duration:90,maxPeople:20,price:null,spotsLeft:9,equipment:"Dobok perso",language:"Français"},{name:"Poomsae compétition",level:"Avancé",duration:90,maxPeople:8,price:null,spotsLeft:1,equipment:"Dobok WTF",language:"Français / Coréen"}], coaches:[{name:"Ji-Ho Park",title:"Ceinture noire 4e dan WT",certif:"BPJEPS + Arbitre international",languages:["Français","Coréen","Anglais"],initials:"JP"}], schedule:{"Lun":["17:00","18:30","20:00"],"Mar":["18:30","20:00"],"Mer":["14:00","16:00","18:00"],"Jeu":["17:00","18:30","20:00"],"Ven":["18:30"],"Sam":["09:00","10:30"],"Dim":[]}, cancelPolicy:"Licence annuelle FFTDA. Toutes les séances sont libres d'accès.", socialLinks:{instagram:"@tkdpantin93",facebook:"TaekwondoClubPantin"}, description:"Club de taekwondo dynamique à Pantin, reconnu World Taekwondo. Cours enfants dès 6 ans et adultes. Poomsae et Kyorugi, compétitions régulières en IDF.", image:"https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80", lat:48.896, lng:2.403, accentColor:"#EF4444", tags:["Compétition","Enfants","Arts martiaux"], address:"45 Avenue Jean-Lolive, 93500 Pantin", phone:"01 48 XX XX XX", email:"tkd@clubpantin.fr", openHours:"Lun-Sam 17h-22h / Mer 14h-19h" },
  { id:17, name:"Surf & Skate Indoor Paris", city:"Paris", arrondissement:"15e", sport:"Gym", emoji:"🛹", type:"Privé", indoor:true, rating:4.7, reviews:198, priceMin:30, priceMax:60, priceUnit:"séance", priceCourse:30, essaiGratuit:true, tarifEtudiant:true, tarifSenior:false, tarifFamille:false, womenOnly:false, pmr:false, postPartum:false, parentEnfant:true, ambiance:"loisirs", levels:["Débutant","Intermédiaire","Avancé"], features:["Rampes & bowl","Skate électrique","Wave machine","Cours skateboard","Café & lounge","Location matériel"], labels:["Essai gratuit ✓","Tarif étudiant","Parent/enfant"], trendBadge:"Tendance", courses:[{name:"Initiation skate (dès 8 ans)",level:"Débutant",duration:60,maxPeople:8,price:30,spotsLeft:4,equipment:"Casque + protections fournis",language:"Français"},{name:"Bowl & Rampe",level:"Intermédiaire",duration:90,maxPeople:6,price:40,spotsLeft:2,equipment:"Équipement perso ou location",language:"Français / Anglais"},{name:"Balance & Surf training",level:"Tous niveaux",duration:60,maxPeople:10,price:35,spotsLeft:5,equipment:"Chaussures de sport",language:"Français"}], coaches:[{name:"Axel Merlin",title:"Coach certifié skate",certif:"Formation fédérale + BPJEPS",languages:["Français","Anglais"],initials:"AM"}], schedule:{"Lun":["10:00","14:00","18:00"],"Mar":["10:00","14:00","18:00"],"Mer":["10:00","12:00","14:00","16:00","18:00"],"Jeu":["10:00","14:00","18:00"],"Ven":["10:00","14:00","18:00","20:00"],"Sam":["09:00","11:00","14:00","16:00","18:00"],"Dim":["10:00","12:00","14:00","16:00"]}, cancelPolicy:"Annulation jusqu'à 4h avant. Sinon séance facturée 50%.", socialLinks:{instagram:"@surfskateindoor15",facebook:"SurfSkateIndoorParis"}, description:"Espace unique dans le 15e combinant skatepark indoor, wave machine et cours de skateboard. Pour débutants et riders confirmés, esprit fun et communauté bienveillante.", image:"https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80", lat:48.838, lng:2.297, accentColor:"#F59E0B", tags:["Fun","Indoor","Unique"], address:"18 Rue de la Convention, 75015 Paris", phone:"01 45 XX XX XX", email:"ride@surfskate-paris.fr", openHours:"10h - 22h tous les jours" },
  { id:18, name:"Badminton Club Ivry", city:"Ivry-sur-Seine", arrondissement:"Val-de-Marne", sport:"Badminton", emoji:"🏸", type:"Association", indoor:true, rating:4.5, reviews:134, priceMin:160, priceMax:280, priceUnit:"an", priceCourse:null, essaiGratuit:true, tarifEtudiant:true, tarifSenior:true, tarifFamille:true, womenOnly:false, pmr:true, postPartum:false, parentEnfant:true, ambiance:"loisirs", levels:["Débutant","Intermédiaire","Avancé","Compétition"], features:["12 terrains Yonex","Location raquettes","Tournois mensuels","Loisir & compétition","Vestiaires","Parking"], labels:["PMR ♿","Essai gratuit ✓","Tarif famille","Tarif étudiant"], trendBadge:null, courses:[{name:"Initiation badminton",level:"Débutant",duration:90,maxPeople:12,price:null,spotsLeft:7,equipment:"Raquette fournie essai",language:"Français"},{name:"Technique & tactique",level:"Intermédiaire",duration:90,maxPeople:8,price:null,spotsLeft:3,equipment:"Raquette perso conseillée",language:"Français"},{name:"Tournoi interne",level:"Tous niveaux",duration:120,maxPeople:32,price:null,spotsLeft:14,equipment:"Raquette + tenue",language:"Français"}], coaches:[{name:"Nathalie Wu",title:"Joueuse N3 + Entraîneur",certif:"BE1 Badminton FFBaD",languages:["Français","Mandarin"],initials:"NW"}], schedule:{"Lun":["18:00","19:30"],"Mar":["18:00","19:30"],"Mer":["14:00","18:00","19:30"],"Jeu":["18:00","19:30"],"Ven":["18:00","19:30"],"Sam":["09:00","10:30","14:00"],"Dim":["10:00"]}, cancelPolicy:"Licence annuelle FFBaD. Accès libre aux terrains selon disponibilité.", socialLinks:{instagram:"@badminton_ivry94",facebook:"BadmintonClubIvry"}, description:"Club de badminton convivial à Ivry avec 12 terrains. Loisirs et compétition, enfants et adultes, tournois mensuels. L'un des plus grands clubs d'IDF.", image:"https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80", lat:48.813, lng:2.387, accentColor:"#1AC7C1", tags:["Tournois","Famille","Indoor"], address:"Gymnase Joliot-Curie, 94200 Ivry-sur-Seine", phone:"01 46 XX XX XX", email:"contact@badminton-ivry.fr", openHours:"Lun-Ven 18h-22h / Mer 14h-22h / Sam-Dim 9h-17h" },
  { id:19, name:"Studio Gymdance Asnières", city:"Asnières-sur-Seine", arrondissement:"Hauts-de-Seine", sport:"Danse", emoji:"🕺", type:"Privé", indoor:true, rating:4.8, reviews:224, priceMin:75, priceMax:140, priceUnit:"mois", priceCourse:17, essaiGratuit:true, tarifEtudiant:true, tarifSenior:false, tarifFamille:true, womenOnly:false, pmr:false, postPartum:true, parentEnfant:true, ambiance:"bien-être", levels:["Débutant","Intermédiaire"], features:["Zumba","Piloxing","Danse africaine","Cours parent/enfant","Post-partum dansé","Vestiaires"], labels:["Post-partum 🤱","Essai gratuit ✓","Parent/enfant","Tarif famille"], trendBadge:"Populaire", courses:[{name:"Zumba fitness",level:"Débutant",duration:60,maxPeople:20,price:17,spotsLeft:8,equipment:"Chaussures de danse ou running",language:"Français"},{name:"Danse africaine",level:"Tous niveaux",duration:75,maxPeople:15,price:19,spotsLeft:4,equipment:"Tenue confortable",language:"Français"},{name:"Danse post-partum",level:"Débutant",duration:60,maxPeople:10,price:22,spotsLeft:2,equipment:"Tenue souple + chaussons",language:"Français"},{name:"Parent & enfant (3-6 ans)",level:"Débutant",duration:45,maxPeople:8,price:24,spotsLeft:3,equipment:"Chaussons conseillés",language:"Français"}], coaches:[{name:"Aminata Kouyaté",title:"Chorégraphe & prof certifiée",certif:"Diplôme État Danse + BPJEPS",languages:["Français","Anglais","Bambara"],initials:"AK"},{name:"Céline Faure",title:"Spécialiste post-partum",certif:"Sage-femme + Danse thérapeutique",languages:["Français"],initials:"CF"}], schedule:{"Lun":["09:30","18:30","20:00"],"Mar":["09:30","18:30","20:00"],"Mer":["09:30","11:00","14:00","18:30"],"Jeu":["09:30","18:30","20:00"],"Ven":["09:30","18:30","20:00"],"Sam":["09:00","10:30","12:00"],"Dim":[]}, cancelPolicy:"Annulation jusqu'à 12h avant. Cours non annulé = séance décomptée.", socialLinks:{instagram:"@gymdanceasnieres",facebook:"StudioGymDanceAsnieres"}, description:"Studio de danse et fitness à Asnières proposant Zumba, danse africaine et cours post-partum. Cours parent/enfant dès 3 ans. Ambiance joyeuse et bienveillante.", image:"https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&q=80", lat:48.915, lng:2.285, accentColor:"#FF9A5A", tags:["Post-partum","Famille","Bien-être"], address:"22 Rue de la Paix, 92600 Asnières-sur-Seine", phone:"01 47 XX XX XX", email:"studio@gymdance-asnieres.fr", openHours:"Lun-Sam 9h-21h" },
  { id:20, name:"Squash Arena Boulogne", city:"Boulogne-Billancourt", arrondissement:"Hauts-de-Seine", sport:"Squash", emoji:"🎯", type:"Privé", indoor:true, rating:4.6, reviews:156, priceMin:25, priceMax:45, priceUnit:"séance", priceCourse:25, essaiGratuit:true, tarifEtudiant:true, tarifSenior:false, tarifFamille:false, womenOnly:false, pmr:false, postPartum:false, parentEnfant:false, ambiance:"performance", levels:["Débutant","Intermédiaire","Avancé"], features:["8 courts verre","Location raquettes","Tournois hebdo","Bar sportif","Vestiaires","Douches"], labels:["Essai gratuit ✓","Tarif étudiant","Coach perso"], trendBadge:"Tendance", courses:[{name:"Initiation squash",level:"Débutant",duration:60,maxPeople:2,price:25,spotsLeft:4,equipment:"Raquette fournie",language:"Français / Anglais"},{name:"Cours intermédiaire",level:"Intermédiaire",duration:60,maxPeople:2,price:30,spotsLeft:2,equipment:"Raquette perso conseillée",language:"Français"},{name:"Coaching compétition",level:"Avancé",duration:75,maxPeople:1,price:55,spotsLeft:1,equipment:"Raquette homologuée WSF",language:"Français / Anglais"}], coaches:[{name:"Hugo Blanchard",title:"Pro circuit PSA",certif:"Level 3 Coach WSF",languages:["Français","Anglais"],initials:"HB"}], schedule:{"Lun":["07:00","09:00","12:00","18:00","19:30","21:00"],"Mar":["07:00","09:00","12:00","18:00","19:30","21:00"],"Mer":["07:00","09:00","12:00","14:00","18:00","19:30"],"Jeu":["07:00","09:00","12:00","18:00","19:30","21:00"],"Ven":["07:00","09:00","12:00","18:00","19:30","21:00"],"Sam":["08:00","09:30","11:00","14:00","16:00"],"Dim":["09:00","10:30","12:00","14:00"]}, cancelPolicy:"Annulation gratuite jusqu'à 2h avant. Sinon séance facturée intégralement.", socialLinks:{instagram:"@squasharenaboulogne",facebook:"SquashArenaBoulogne"}, description:"Centre de squash moderne à Boulogne-Billancourt avec 8 courts en verre. Cours de la découverte à la compétition. Tournois hebdomadaires, ambiance dynamique.", image:"https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80", lat:48.832, lng:2.248, accentColor:"#8B5CF6", tags:["Compétition","Indoor","Cardio"], address:"55 Route de la Reine, 92100 Boulogne-Billancourt", phone:"01 46 XX XX XX", email:"play@squasharena-boulogne.fr", openHours:"7h - 23h tous les jours" },
];

const SPORTS = ["Tous","Tennis","Padel","Yoga","Boxe","Natation","Escalade","Pilates","Judo","CrossFit","Athlétisme","Karaté","Danse","Gym","Running","Taekwondo","Badminton","Squash"];
const CITIES = ["Toutes","Paris","Vincennes","Versailles","Boulogne-Billancourt","Montreuil","Saint-Denis","Créteil","Levallois-Perret","Issy-les-Moulineaux","Neuilly-sur-Seine","Pantin","Ivry-sur-Seine","Asnières-sur-Seine"];
const LEVELS_LIST = ["Débutant","Intermédiaire","Avancé","Compétition"];
const DAYS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const ONBOARDING_SPORTS = ["Tennis 🎾","Yoga 🧘","Natation 🏊","Padel 🏓","Boxe 🥊","CrossFit 💪","Pilates 🤸","Escalade 🧗","Judo 🥋","Athlétisme 🏃","Danse 💃","Gym 🏋️","Running 🏃","Karaté 🥋","Badminton 🏸","Squash 🎾","Taekwondo 🥋","Autre 🏅"];
const OBJECTIVES = [{id:"remise",label:"Remise en forme",icon:"🔥"},{id:"performance",label:"Performance",icon:"🏆"},{id:"bienetre",label:"Bien-être",icon:"☮️"},{id:"sante",label:"Santé / Récupération",icon:"💊"},{id:"decouverte",label:"Découverte",icon:"✨"}];
const FREQ_OPTIONS = ["1x / semaine","2x / semaine","3x / semaine","Tous les jours"];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ CSS ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const STYLES = `
@import url('${GFONTS}');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--tq:#1AC7C1;--co:#FF9A5A;--bg:#F7F9FB;--white:#fff;--text:#1A1A2E;--text2:#6B7280;--border:#E5E7EB;--shadow:0 2px 16px rgba(0,0,0,0.08);--font:'Montserrat',sans-serif;--r:14px;--card:#fff;--nav-bg:rgba(255,255,255,0.96);--sheet-bg:#fff;--drawer-bg:#fff}
body{background:var(--bg);color:var(--text);font-family:var(--font);overflow-x:hidden;transition:background .3s,color .3s}
body.dark{--bg:#111827;--white:#1F2937;--text:#F9FAFB;--text2:#9CA3AF;--border:#374151;--card:#1F2937;--nav-bg:rgba(17,24,39,0.97);--sheet-bg:#1F2937;--drawer-bg:#1F2937;--shadow:0 2px 16px rgba(0,0,0,0.4)}
body.dark .hero{background:linear-gradient(135deg,#1F2937 0%,#111827 100%)}
body.dark .club-card{background:var(--card)}
body.dark .nav{background:var(--nav-bg)}
body.dark .sheet{background:var(--sheet-bg)}
body.dark .drawer{background:var(--drawer-bg)}
body.dark .ob-wrap,.dark .ob-footer{background:var(--card)}
body.dark input,.dark textarea,.dark select{background:var(--card);color:var(--text);border-color:var(--border)}
body.dark .prog-card,body.dark .plan-item,body.dark .fav-card,body.dark .hist-item,body.dark .profile-header,body.dark .pro-stat,body.dark .pro-chart,body.dark .lead-item,body.dark .pro-edit-form,body.dark .course-card,body.dark .coach-card,body.dark .sh-body,body.dark .sh-hero-content{background:var(--card)}
body.dark .sort-sel,body.dark .form-input,body.dark .form-textarea{background:var(--card);color:var(--text);border-color:var(--border)}
body.dark .feat-tag{background:#374151;border-color:#4B5563;color:var(--text2)}
body.dark .chip,body.dark .fchip{background:#374151;border-color:#4B5563;color:var(--text2)}
body.dark .chip:hover,body.dark .fchip:hover{border-color:var(--tq);color:var(--tq)}
body.dark .filter-strip-wrap{background:var(--card);border-color:var(--border)}
body.dark .bottom-nav{background:rgba(17,24,39,0.97);border-color:var(--border)}
/* SEARCH BAR */
.search-wrap{padding:0 20px 0;margin-bottom:0}
.search-bar{display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:10px 14px;transition:border-color .2s;box-shadow:var(--shadow)}
.search-bar:focus-within{border-color:var(--tq)}
.search-ico{font-size:16px;flex-shrink:0;color:var(--text2)}
.search-input{flex:1;border:none;outline:none;font-size:14px;font-family:var(--font);background:transparent;color:var(--text)}
.search-input::placeholder{color:var(--text2)}
.search-clear{background:none;border:none;font-size:14px;cursor:pointer;color:var(--text2);padding:0;line-height:1;transition:color .2s}
.search-clear:hover{color:var(--text)}
/* VIEW TOGGLE */
.view-toggle{display:flex;gap:4px;background:var(--bg);border-radius:8px;padding:3px}
.vt-btn{padding:5px 12px;border-radius:6px;border:none;background:transparent;font-size:11px;font-weight:700;color:var(--text2);cursor:pointer;transition:all .2s}
.vt-btn.active{background:#fff;color:var(--text);box-shadow:0 1px 4px rgba(0,0,0,0.1)}
body.dark .vt-btn.active{background:#374151}
/* TREND BADGE */
.b-trend{position:absolute;top:10px;left:10px;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700;backdrop-filter:blur(10px);z-index:2}
.b-trend.new{background:rgba(16,185,129,0.92);color:#fff}
.b-trend.popular{background:rgba(255,154,90,0.92);color:#fff}
.b-trend.trending{background:rgba(155,93,229,0.92);color:#fff}
/* SPOTS LEFT */
.spots-pill{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:100px;font-size:10px;font-weight:700}
.spots-urgent{background:rgba(239,68,68,0.1);color:#EF4444;border:1px solid rgba(239,68,68,0.2)}
.spots-ok{background:rgba(26,199,193,0.1);color:var(--tq);border:1px solid rgba(26,199,193,0.2)}
/* MAP */
.map-wrap{margin:0 20px 16px;border-radius:var(--r);overflow:hidden;border:1.5px solid var(--border);position:relative}
.map-container{width:100%;height:380px}
.map-popup-btn{padding:4px 10px;background:var(--tq);color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;margin-top:4px;width:100%}
/* DARK MODE TOGGLE in footer */
.dark-toggle-row{display:flex;align-items:center;justify-content:center;gap:10px;padding:6px 0 2px;border-top:1px solid var(--border);margin:0 20px}
.dark-toggle-lbl{font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.5px}
body.dark .search-bar{background:var(--card)}
body.dark .search-input{color:var(--text)}
body.dark .bottom-nav{background:var(--nav-bg)}
body.dark .sort-sel{background:var(--card);color:var(--text)}
body.dark .progress-banner{background:linear-gradient(135deg,#0fa8a3,#0d8f8a)}
body.dark .dr-head{background:var(--drawer-bg)}
body.dark .fav-card,.dark .hist-item,.dark .plan-item,.dark .prog-card,.dark .pro-stat,.dark .pro-chart,.dark .pro-edit-form,.dark .lead-item{background:var(--card)}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--tq);border-radius:2px}
button{font-family:var(--font)}
/* NAV */
.nav{position:sticky;top:0;z-index:200;background:rgba(255,255,255,0.96);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);padding:0 20px;height:60px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.nav-logo{font-size:22px;font-weight:900;color:var(--text);cursor:pointer;flex-shrink:0;display:flex;align-items:center;gap:8px}
.nav-logo .dot{width:8px;height:8px;background:var(--co);border-radius:50%}
.nav-logo em{color:var(--tq);font-style:normal}
.nav-actions{display:flex;align-items:center;gap:8px}
.nav-btn{background:var(--tq);color:#fff;border:none;cursor:pointer;font-size:12px;font-weight:700;padding:8px 16px;border-radius:8px;transition:all .2s;white-space:nowrap}
.nav-btn:hover{background:#17b3ad;transform:translateY(-1px)}
.nav-icon-btn{width:38px;height:38px;border-radius:50%;background:var(--bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;transition:all .2s;color:var(--text2)}
.nav-icon-btn:hover,.nav-icon-btn.active{background:var(--tq);color:#fff;border-color:var(--tq)}
.nav-notif{position:relative}
.nav-notif-dot{position:absolute;top:4px;right:4px;width:8px;height:8px;background:var(--co);border-radius:50%;border:2px solid #fff}
/* NOTIF PANEL */
.notif-panel{position:absolute;top:calc(100% + 10px);right:0;width:300px;background:var(--white);border:1.5px solid var(--border);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.12);z-index:250;overflow:hidden;animation:cardFadeIn .2s ease}
.notif-header{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.notif-header-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--text)}
.notif-clear{font-size:10px;font-weight:700;color:var(--tq);cursor:pointer;background:none;border:none;font-family:var(--font)}
.notif-item{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .15s}
.notif-item:last-child{border-bottom:none}
.notif-item:hover{background:var(--bg)}
.notif-item.unread{background:rgba(26,199,193,0.04)}
.notif-ico{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.notif-body{flex:1;min-width:0}
.notif-text{font-size:12px;font-weight:600;color:var(--text);line-height:1.45;margin-bottom:2px}
.notif-text strong{color:var(--tq)}
.notif-time{font-size:10px;color:var(--text2)}
.notif-unread-dot{width:7px;height:7px;border-radius:50%;background:var(--tq);flex-shrink:0;margin-top:4px}
/* HERO */
.hero{padding:36px 20px 28px;background:linear-gradient(135deg,#fff 0%,#f0fffe 100%);position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-60px;right:-60px;width:220px;height:220px;background:radial-gradient(circle,rgba(26,199,193,0.12),transparent 70%)}
.hero::after{content:'';position:absolute;bottom:-40px;left:-40px;width:160px;height:160px;background:radial-gradient(circle,rgba(255,154,90,0.1),transparent 70%)}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(26,199,193,0.1);border:1px solid rgba(26,199,193,0.3);color:var(--tq);border-radius:100px;padding:5px 14px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px}
.hero-badge::before{content:'';width:6px;height:6px;background:var(--tq);border-radius:50%;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}
/* SPLASH */
@keyframes splashFadeOut{0%{opacity:1}80%{opacity:1}100%{opacity:0;pointer-events:none}}
@keyframes splashLogo{0%{transform:scale(0.7);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1);opacity:1}}
@keyframes splashDot{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes splashTagline{0%,40%{opacity:0;transform:translateY(8px)}70%,100%{opacity:1;transform:translateY(0)}}
.splash{position:fixed;top:0;left:0;right:0;bottom:0;background:linear-gradient(160deg,#0B0F1A 60%,#0d1829);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;animation:splashFadeOut 2.2s ease forwards}
.splash-logo{font-size:52px;font-weight:900;color:#F8FAFC;animation:splashLogo .7s cubic-bezier(.34,1.56,.64,1) .1s both}
.splash-logo em{color:#1AC7C1;font-style:normal}
.splash-dots{display:flex;gap:8px;margin-top:28px}
.splash-dot{width:8px;height:8px;border-radius:50%;background:#1AC7C1;animation:splashDot .7s ease infinite}
.splash-dot:nth-child(2){animation-delay:.15s;background:#FF9A5A}
.splash-dot:nth-child(3){animation-delay:.3s;background:#1AC7C1}
.splash-tagline{font-size:13px;font-weight:600;color:#64748B;margin-top:20px;letter-spacing:1px;animation:splashTagline 1.5s ease .5s both}
/* CARD FADE-IN */
@keyframes cardFadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.club-card{animation:cardFadeIn .35s ease both}
/* EMPTY STATES ILLUSTRATED */
.empty-illustrated{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:36px 20px;text-align:center}
.empty-illus-wrap{position:relative;width:96px;height:96px;margin-bottom:18px}
.empty-illus-circle{width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:44px}
.empty-illus-badge{position:absolute;bottom:-4px;right:-4px;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:2.5px solid var(--white)}
.empty-illus-title{font-size:16px;font-weight:800;color:var(--text);margin-bottom:6px}
.empty-illus-sub{font-size:13px;color:var(--text2);line-height:1.6;max-width:260px;margin-bottom:18px}
.empty-illus-btn{padding:10px 22px;border-radius:100px;font-size:13px;font-weight:700;border:none;cursor:pointer;font-family:var(--font);transition:all .2s}
.hero h1{font-size:clamp(26px,5vw,38px);font-weight:900;line-height:1.1;margin-bottom:10px}
.hero h1 em{color:var(--tq);font-style:normal}
.hero p{color:var(--text2);font-size:14px;line-height:1.6;margin-bottom:20px;max-width:480px}
.hero-stats{display:flex;gap:24px;flex-wrap:wrap}
.stat-num{font-size:24px;font-weight:900;color:var(--text)}
.stat-num em{color:var(--tq);font-style:normal}
.stat-label{font-size:10px;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-top:2px}
/* PROGRESS BANNER */
.progress-banner{margin:12px 20px;background:linear-gradient(135deg,var(--tq),#0fa8a3);border-radius:14px;padding:14px 16px;color:#fff;position:relative;overflow:hidden;cursor:pointer}
.progress-banner::after{content:'';position:absolute;top:-20px;right:-20px;width:80px;height:80px;background:rgba(255,255,255,0.1);border-radius:50%}
.pb-row{display:flex;align-items:center;justify-content:space-between}
.pb-title{font-size:13px;font-weight:800}
.pb-sub{font-size:11px;opacity:.85;margin-top:2px}
.pb-badge{background:rgba(255,255,255,0.25);border-radius:100px;padding:4px 10px;font-size:12px;font-weight:700}
.pb-bar-wrap{background:rgba(255,255,255,0.2);border-radius:100px;height:4px;margin-top:10px}
.pb-bar{background:#fff;border-radius:100px;height:4px;transition:width .6s}
/* FILTER STRIP */
.filter-btn-sm{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:100px;font-size:11px;font-weight:700;background:var(--text);border:none;color:#fff;cursor:pointer;transition:all .2s;flex-shrink:0}
.filter-btn-sm:hover{background:#2d2d3a}
.fchip{flex-shrink:0;padding:6px 13px;border-radius:100px;font-size:12px;font-weight:600;background:var(--bg);border:1.5px solid var(--border);color:var(--text2);cursor:pointer;transition:all .18s;white-space:nowrap}
.fchip:hover{border-color:var(--tq);color:var(--tq)}
.fchip.active{background:var(--tq);border-color:var(--tq);color:#fff}
.fcnt{background:var(--co);color:#fff;border-radius:100px;min-width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;padding:0 4px}
/* RESULTS */
.results-bar{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 8px;flex-wrap:wrap;gap:8px}
.results-count{font-size:14px;font-weight:700}
.results-count em{color:var(--tq);font-style:normal}
.sort-sel{background:#fff;border:1.5px solid var(--border);color:var(--text2);font-size:12px;font-weight:600;padding:6px 12px;border-radius:8px;outline:none;cursor:pointer}
/* GRID */
.clubs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;padding:8px 20px 100px}
/* CARD */
.club-card{background:#fff;border:1.5px solid var(--border);border-radius:var(--r);overflow:hidden;cursor:pointer;transition:all .25s;animation:cardIn .35s ease both;position:relative}
.club-card:nth-child(2){animation-delay:.06s}.club-card:nth-child(3){animation-delay:.12s}.club-card:nth-child(4){animation-delay:.18s}.club-card:nth-child(5){animation-delay:.24s}
@keyframes cardIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.club-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(26,199,193,0.15);border-color:rgba(26,199,193,0.4)}
.card-img{position:relative;height:180px;overflow:hidden}
.card-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s;filter:brightness(.9)}
.club-card:hover .card-img img{transform:scale(1.04);filter:brightness(1)}
.card-img-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,26,46,.7) 0%,transparent 55%)}
.card-badges{position:absolute;top:10px;left:10px;display:flex;gap:5px;flex-wrap:wrap}
.badge{padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700;backdrop-filter:blur(10px)}
.b-sport{background:rgba(255,255,255,0.92);color:var(--text)}
.b-asso{background:rgba(26,199,193,0.9);color:#fff}
.b-indoor{background:rgba(255,154,90,0.9);color:#fff}
.b-essai{position:absolute;bottom:10px;left:10px;background:rgba(26,199,193,0.95);color:#fff;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700;backdrop-filter:blur(10px)}
.b-fav{position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,0.92);border:none;display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;transition:all .2s;backdrop-filter:blur(10px)}
.b-fav:hover{transform:scale(1.15)}
.card-rating{position:absolute;bottom:10px;right:10px;background:rgba(255,255,255,0.92);border-radius:100px;padding:3px 9px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:4px;backdrop-filter:blur(10px)}
.star{color:#FFC107}
.card-body{padding:14px}
.card-labels{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px}
.lpill{font-size:9px;font-weight:700;padding:2px 7px;border-radius:100px;background:rgba(26,199,193,0.1);color:var(--tq);border:1px solid rgba(26,199,193,0.2)}
.lpill.co{background:rgba(255,154,90,0.1);color:var(--co);border-color:rgba(255,154,90,0.2)}
.lpill.pur{background:rgba(155,93,229,0.1);color:#9B5DE5;border-color:rgba(155,93,229,0.2)}
.lpill.pk{background:rgba(236,72,153,0.1);color:#EC4899;border-color:rgba(236,72,153,0.2)}
.card-name{font-size:16px;font-weight:800;margin-bottom:3px;line-height:1.2}
.card-loc{font-size:11px;color:var(--text2);display:flex;align-items:center;gap:4px;margin-bottom:8px}
.card-desc{font-size:12px;color:var(--text2);line-height:1.5;margin-bottom:10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card-feats{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px}
.feat-tag{font-size:10px;padding:2px 8px;border-radius:4px;background:var(--bg);border:1px solid var(--border);color:var(--text2)}
.card-footer{display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px solid var(--border)}
.card-price{font-size:18px;font-weight:900;color:var(--tq)}
.card-price small{font-size:11px;font-weight:500;color:var(--text2)}
/* EMPTY */
.empty{padding:60px 20px;text-align:center}
.empty-icon{font-size:48px;margin-bottom:12px}
.empty h3{font-size:18px;font-weight:700;margin-bottom:8px}
.empty p{font-size:13px;color:var(--text2)}
/* SHEET */
.ov{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);animation:fadeIn .2s ease;display:flex;align-items:flex-end}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.sheet{background:#fff;width:100%;max-width:680px;margin:0 auto;border-radius:20px 20px 0 0;max-height:92vh;overflow-y:auto;animation:slideUp .3s cubic-bezier(.32,0,.15,.99)}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.sh-handle{width:36px;height:4px;background:var(--border);border-radius:2px;margin:12px auto 0}
.sh-hero{position:relative;height:220px;margin-top:8px}
.sh-hero img{width:100%;height:100%;object-fit:cover}
.sh-hero-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,26,46,.85),transparent 50%)}
.sh-close{position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,0.5);border:none;color:#fff;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px)}
.sh-fav{position:absolute;top:12px;right:50px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,0.5);border:none;color:#fff;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);transition:all .2s}
.sh-fav.on{background:rgba(239,68,68,0.9)}
.sh-hero-content{position:absolute;bottom:14px;left:16px;right:16px}
.sh-sbadge{display:inline-flex;align-items:center;gap:5px;background:var(--tq);color:#fff;border-radius:100px;padding:3px 10px;font-size:10px;font-weight:700;margin-bottom:6px}
.sh-title{font-size:24px;font-weight:900;color:#fff;line-height:1.1}
.sh-body{padding:16px 20px 32px}
.sh-rating{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.sh-rnum{font-size:36px;font-weight:900;color:var(--tq)}
.stars-row{display:flex;gap:1px;font-size:14px;margin-bottom:3px}
.sh-rvw{font-size:11px;color:var(--text2)}
.sh-labels{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:16px}
.sh-lbl{padding:4px 10px;border-radius:100px;font-size:11px;font-weight:600;background:rgba(26,199,193,0.1);color:var(--tq);border:1px solid rgba(26,199,193,0.2)}
.sh-section{margin-bottom:18px}
.sh-stitle{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2);margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--border)}
.sh-desc{font-size:13px;color:var(--text2);line-height:1.7}
.meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.meta-item{display:flex;align-items:flex-start;gap:8px;padding:10px;background:var(--bg);border-radius:10px}
.meta-ico{font-size:16px;flex-shrink:0;margin-top:1px}
.meta-lbl{font-size:9px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:2px}
.meta-val{font-size:12px;font-weight:600;color:var(--text)}
.price-block{background:linear-gradient(135deg,rgba(26,199,193,0.08),rgba(255,154,90,0.05));border:1px solid rgba(26,199,193,0.2);border-radius:12px;padding:14px;margin-bottom:14px}
.price-main{font-size:32px;font-weight:900;color:var(--tq)}
.price-range{font-size:13px;color:var(--text2);margin-top:2px}
.cancel-box{background:rgba(255,154,90,0.08);border-left:3px solid var(--co);border-radius:0 8px 8px 0;padding:10px 12px;font-size:12px;color:var(--text2);line-height:1.5}
.course-list{display:flex;flex-direction:column;gap:8px}
.course-card{background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:12px;transition:all .2s}
.course-card:hover{border-color:var(--tq);background:rgba(26,199,193,0.04)}
.course-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.course-name{font-size:13px;font-weight:700}
.course-price{font-size:14px;font-weight:900;color:var(--tq)}
.course-tags{display:flex;gap:6px;flex-wrap:wrap}
.ctag{font-size:10px;padding:2px 7px;border-radius:4px;background:rgba(26,199,193,0.1);color:var(--tq);font-weight:600}
.ctag.lang{background:rgba(255,154,90,0.1);color:var(--co)}
.coach-list{display:flex;flex-direction:column;gap:8px}
.coach-card{display:flex;align-items:center;gap:12px;background:var(--bg);border-radius:10px;padding:12px}
.coach-av{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--tq),var(--co));display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;flex-shrink:0}
.coach-name{font-size:13px;font-weight:700;margin-bottom:1px}
.coach-title{font-size:11px;color:var(--text2);margin-bottom:2px}
.coach-certif{font-size:10px;color:var(--tq);font-weight:600;margin-bottom:2px}
.coach-langs{font-size:10px;color:var(--text2)}
.sched-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.sched-col{display:flex;flex-direction:column;align-items:center;gap:3px}
.sched-day{font-size:9px;font-weight:700;color:var(--text2);text-transform:uppercase;margin-bottom:3px}
.sched-slot{font-size:8px;border-radius:5px;padding:3px 4px;font-weight:700;text-align:center;width:100%;line-height:1.3;box-sizing:border-box}
.sched-slot-time{font-size:8px;opacity:.75;font-weight:600}
.social-row{display:flex;gap:8px}
.social-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;background:var(--bg);border:1.5px solid var(--border);font-size:12px;font-weight:600;color:var(--text2);cursor:pointer;transition:all .2s}
.social-btn:hover{border-color:var(--tq);color:var(--tq)}
/* ALERT / PERSONS */
.alert-row{display:flex;align-items:center;justify-content:space-between;background:rgba(26,199,193,0.06);border:1px solid rgba(26,199,193,0.2);border-radius:10px;padding:10px 14px;margin-bottom:10px}
.alert-lbl{font-size:12px;font-weight:600}
.toggle-wrap{position:relative;width:42px;height:24px;cursor:pointer;display:inline-flex;align-items:center}
.toggle-wrap input{opacity:0;width:0;height:0;position:absolute}
.tslider{position:absolute;inset:0;background:var(--border);border-radius:12px;transition:.3s;cursor:pointer}
.tslider::before{content:'';position:absolute;width:18px;height:18px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.3s}
.toggle-wrap input:checked~.tslider{background:var(--tq)}
.toggle-wrap input:checked~.tslider::before{transform:translateX(18px)}
.persons-row{display:flex;align-items:center;gap:12px;margin-bottom:14px;padding:10px 14px;background:var(--bg);border-radius:10px;border:1px solid var(--border)}
.persons-lbl{font-size:12px;font-weight:600;flex:1}
.persons-ctrl{display:flex;align-items:center;gap:10px}
.pctrl-btn{width:28px;height:28px;border-radius:50%;background:#fff;border:1.5px solid var(--border);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.pctrl-btn:hover{background:var(--tq);color:#fff;border-color:var(--tq)}
.pctrl-num{font-size:16px;font-weight:800;color:var(--tq);min-width:24px;text-align:center}
/* CTA STRIP */
.sh-ctas{display:flex;gap:8px;padding-top:14px;border-top:1px solid var(--border);flex-wrap:wrap}
.btn-p{flex:1;min-width:130px;background:var(--tq);color:#fff;border:none;font-size:13px;font-weight:700;padding:13px 16px;border-radius:10px;cursor:pointer;transition:all .2s;text-align:center}
.btn-p:hover{background:#17b3ad;transform:translateY(-1px)}
.btn-co{flex:1;min-width:130px;background:var(--co);color:#fff;border:none;font-size:13px;font-weight:700;padding:13px 16px;border-radius:10px;cursor:pointer;transition:all .2s}
.btn-co:hover{background:#f08848;transform:translateY(-1px)}
.btn-s{background:var(--bg);color:var(--text2);border:1.5px solid var(--border);font-size:12px;font-weight:600;padding:13px 14px;border-radius:10px;cursor:pointer;transition:all .2s}
.btn-s:hover{border-color:var(--tq);color:var(--tq)}
/* DRAWER */
.drawer-ov{position:fixed;inset:0;z-index:250;background:rgba(0,0,0,0.4);animation:fadeIn .2s ease;display:flex;align-items:flex-end}
.drawer{background:#fff;width:100%;max-width:680px;margin:0 auto;border-radius:20px 20px 0 0;max-height:88vh;overflow-y:auto;animation:slideUp .3s cubic-bezier(.32,0,.15,.99);padding:0 20px 40px}
.dr-head{display:flex;align-items:center;justify-content:space-between;padding:16px 0 14px;position:sticky;top:0;background:#fff;z-index:1;border-bottom:1px solid var(--border);margin-bottom:16px}
.dr-title{font-size:16px;font-weight:800}
.dr-reset{font-size:12px;font-weight:600;color:var(--co);background:none;border:none;cursor:pointer}
.dr-handle{width:36px;height:4px;background:var(--border);border-radius:2px;margin:12px auto 0}
.fg{margin-bottom:18px}
.fgt{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2);margin-bottom:8px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{padding:6px 13px;border-radius:100px;font-size:12px;font-weight:600;background:var(--bg);border:1.5px solid var(--border);color:var(--text2);cursor:pointer;transition:all .18s}
.chip:hover{border-color:var(--tq);color:var(--tq)}
.chip.on{background:var(--tq);border-color:var(--tq);color:#fff}
.chip.co{background:var(--co);border-color:var(--co);color:#fff}
.range-row{display:flex;justify-content:space-between;margin-bottom:8px}
.range-val{font-size:18px;font-weight:800;color:var(--tq)}
input[type=range]{width:100%;-webkit-appearance:none;appearance:none;height:4px;background:var(--bg);border-radius:2px;outline:none;cursor:pointer}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--tq);cursor:pointer;box-shadow:0 0 8px rgba(26,199,193,.4)}
.cbs{display:flex;flex-direction:column;gap:6px}
.cb-item{display:flex;align-items:center;gap:10px;cursor:pointer;padding:5px 0}
.cb-box{width:18px;height:18px;border-radius:5px;border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;transition:all .15s;background:#fff;flex-shrink:0;font-size:10px}
.cb-box.on{background:var(--tq);border-color:var(--tq);color:#fff}
.cb-lbl{font-size:13px;font-weight:500}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bg)}
.toggle-lbl{font-size:13px;font-weight:600}
.dr-apply{width:100%;background:var(--tq);color:#fff;border:none;font-size:14px;font-weight:800;padding:15px;border-radius:12px;cursor:pointer;transition:all .2s;margin-top:16px}
.dr-apply:hover{background:#17b3ad}
/* ONBOARDING */
.ob-wrap{position:fixed;inset:0;z-index:500;background:#fff;overflow-y:auto;animation:fadeIn .3s}
.ob-progress{height:4px;background:var(--bg);position:sticky;top:0;z-index:1}
.ob-progress-bar{height:4px;background:linear-gradient(90deg,var(--tq),var(--co));transition:width .4s}
.ob-body{padding:40px 24px 120px;max-width:520px;margin:0 auto}
.ob-step{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--tq);margin-bottom:12px}
.ob-title{font-size:clamp(24px,5vw,32px);font-weight:900;line-height:1.15;margin-bottom:8px}
.ob-title em{color:var(--tq);font-style:normal}
.ob-sub{font-size:14px;color:var(--text2);margin-bottom:28px;line-height:1.6}
.ob-sports-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:28px}
.ob-sport-btn{padding:12px 8px;border:2px solid var(--border);border-radius:12px;background:#fff;cursor:pointer;text-align:center;transition:all .2s}
.ob-sport-btn:hover{border-color:var(--tq)}
.ob-sport-btn.on{border-color:var(--tq);background:rgba(26,199,193,0.06)}
.ob-sport-ico{font-size:20px;display:block;margin-bottom:4px}
.ob-sport-name{font-size:11px;font-weight:600;color:var(--text)}
.ob-obj-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:28px}
.ob-obj-btn{display:flex;align-items:center;gap:12px;padding:14px;border:2px solid var(--border);border-radius:12px;background:#fff;cursor:pointer;text-align:left;transition:all .2s}
.ob-obj-btn:hover{border-color:var(--tq)}
.ob-obj-btn.on{border-color:var(--tq);background:rgba(26,199,193,0.06)}
.ob-obj-ico{font-size:22px;flex-shrink:0}
.ob-obj-label{font-size:13px;font-weight:700}
.ob-freq-list{display:flex;flex-direction:column;gap:8px;margin-bottom:28px}
.ob-freq-btn{padding:14px 18px;border:2px solid var(--border);border-radius:12px;background:#fff;cursor:pointer;text-align:left;font-size:14px;font-weight:600;transition:all .2s}
.ob-freq-btn:hover{border-color:var(--tq)}
.ob-freq-btn.on{border-color:var(--tq);background:rgba(26,199,193,0.06);color:var(--tq)}
.ob-health-list{display:flex;flex-direction:column;gap:8px;margin-bottom:28px}
.ob-health-btn{display:flex;align-items:center;gap:12px;padding:14px 18px;border:2px solid var(--border);border-radius:12px;background:#fff;cursor:pointer;text-align:left;transition:all .2s}
.ob-health-btn:hover,.ob-health-btn.on{border-color:var(--tq);background:rgba(26,199,193,0.06)}
.ob-health-ico{font-size:22px;flex-shrink:0}
.ob-health-label{font-size:13px;font-weight:700}
.ob-health-sub{font-size:11px;color:var(--text2);margin-top:1px}
.ob-footer{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--border);padding:16px 24px 28px;display:flex;gap:12px;max-width:520px;margin:0 auto}
.ob-next{flex:1;background:var(--tq);color:#fff;border:none;font-size:14px;font-weight:800;padding:15px;border-radius:12px;cursor:pointer;transition:all .2s}
.ob-next:hover{background:#17b3ad;transform:translateY(-1px)}
.ob-next:disabled{opacity:.4;cursor:not-allowed;transform:none}
.ob-back{background:var(--bg);color:var(--text2);border:1.5px solid var(--border);font-size:14px;font-weight:600;padding:15px 20px;border-radius:12px;cursor:pointer;transition:all .2s}
.ob-back:hover{border-color:var(--tq);color:var(--tq)}
.ob-skip{font-size:12px;color:var(--text2);font-weight:500;background:none;border:none;cursor:pointer;padding:15px 0;text-decoration:underline}
/* ONBOARDING PROFILE STEP */
.ob-form{display:flex;flex-direction:column;gap:14px;margin-bottom:28px}
.ob-field{display:flex;flex-direction:column;gap:5px}
.ob-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text2);display:flex;align-items:center;gap:5px}
.ob-label span.opt{font-size:9px;font-weight:500;color:var(--text2);text-transform:none;letter-spacing:0;background:var(--bg);padding:1px 6px;border-radius:100px;border:1px solid var(--border)}
.ob-input{padding:11px 14px;border:1.5px solid var(--border);border-radius:10px;font-size:14px;font-family:var(--font);outline:none;transition:border-color .2s;background:#fff;color:var(--text)}
.ob-input:focus{border-color:var(--tq)}
.ob-input-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.ob-genre-row{display:flex;gap:8px}
.ob-genre-btn{flex:1;padding:10px 8px;border:1.5px solid var(--border);border-radius:10px;font-size:13px;font-weight:600;background:#fff;cursor:pointer;text-align:center;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:4px}
.ob-genre-btn:hover{border-color:var(--tq)}
.ob-genre-btn.on{border-color:var(--tq);background:rgba(26,199,193,0.06);color:var(--tq)}
.ob-genre-ico{font-size:20px}
.ob-medical-list{display:flex;flex-direction:column;gap:6px}
.ob-medical-btn{display:flex;align-items:center;gap:10px;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;background:#fff;cursor:pointer;transition:all .2s;text-align:left}
.ob-medical-btn:hover,.ob-medical-btn.on{border-color:var(--tq);background:rgba(26,199,193,0.05)}
.ob-medical-btn.on .ob-medical-check{background:var(--tq);border-color:var(--tq)}
.ob-medical-check{width:18px;height:18px;border-radius:50%;border:1.5px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:10px;color:#fff}
.ob-avatar-area{display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:8px}
.ob-avatar-circle{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--tq),var(--co));display:flex;align-items:center;justify-content:center;font-size:28px;cursor:pointer;position:relative;border:3px solid #fff;box-shadow:0 2px 16px rgba(26,199,193,0.3)}
.ob-avatar-edit{position:absolute;bottom:-2px;right:-2px;width:22px;height:22px;background:var(--co);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;border:2px solid #fff}
.ob-avatar-hint{font-size:11px;color:var(--text2);font-weight:500}
.ob-pw-wrap{position:relative}
.ob-pw-toggle{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:14px;color:var(--text2)}
body.dark .ob-input{background:var(--card);color:var(--text);border-color:var(--border)}
body.dark .ob-genre-btn,.dark .ob-medical-btn{background:var(--card);color:var(--text)}
/* PROFILE */
.profile-page{padding:20px 20px 100px}
.profile-header{display:flex;align-items:center;gap:14px;margin-bottom:24px;padding:20px;background:#fff;border-radius:var(--r);border:1.5px solid var(--border)}
.profile-avatar{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--tq),var(--co));display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#fff;flex-shrink:0}
.profile-name{font-size:18px;font-weight:800}
.profile-meta{font-size:12px;color:var(--text2);margin-top:2px}
.profile-edit{margin-left:auto;padding:8px 14px;background:var(--bg);border:1.5px solid var(--border);border-radius:8px;font-size:12px;font-weight:600;color:var(--text2);cursor:pointer;transition:all .2s}
.profile-edit:hover{border-color:var(--tq);color:var(--tq)}
.profile-section{margin-bottom:20px}
.ps-title{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2);margin-bottom:10px;display:flex;align-items:center;justify-content:space-between}
.ps-link{font-size:11px;font-weight:600;color:var(--tq);cursor:pointer}
.fav-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}
.fav-card{display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:12px;cursor:pointer;transition:all .2s}
.fav-card:hover{border-color:var(--tq);transform:translateY(-1px)}
.fav-img{width:48px;height:48px;border-radius:8px;object-fit:cover;flex-shrink:0}
.fav-name{font-size:13px;font-weight:700;margin-bottom:2px}
.fav-meta{font-size:11px;color:var(--text2)}
.fav-remove{margin-left:auto;background:none;border:none;font-size:16px;cursor:pointer;color:var(--text2);padding:4px;transition:all .2s}
.fav-remove:hover{color:#EF4444}
.history-list{display:flex;flex-direction:column;gap:8px}
.hist-item{display:flex;align-items:center;gap:12px;background:#fff;border:1.5px solid var(--border);border-radius:10px;padding:12px;cursor:pointer;transition:all .2s}
.hist-item:hover{border-color:var(--tq)}
.hist-emoji{font-size:20px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:var(--bg);border-radius:8px;flex-shrink:0}
.hist-name{font-size:13px;font-weight:600;margin-bottom:1px}
.hist-meta{font-size:11px;color:var(--text2)}
.hist-ago{font-size:10px;color:var(--text2);margin-left:auto;flex-shrink:0}
/* PLANNING */
.planning-list{display:flex;flex-direction:column;gap:8px}
.plan-item{background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;transition:all .2s}
.plan-item:hover{border-color:var(--tq)}
.plan-item.urgent{border-color:rgba(239,68,68,0.4);background:rgba(239,68,68,0.03)}
.plan-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.plan-time{font-size:22px;font-weight:900;color:var(--tq);min-width:52px}
.plan-name{font-size:13px;font-weight:700;margin-bottom:2px}
.plan-club{font-size:11px;color:var(--text2)}
.plan-cancel{margin-left:auto;padding:5px 10px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#EF4444;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer;transition:all .2s}
.plan-cancel:hover{background:rgba(239,68,68,0.15)}
.plan-badge{font-size:11px;font-weight:700;padding:4px 10px;border-radius:100px;background:rgba(26,199,193,0.1);color:var(--tq)}
.plan-urgent-badge{font-size:9px;font-weight:800;padding:3px 8px;border-radius:100px;background:rgba(239,68,68,0.1);color:#EF4444;border:1px solid rgba(239,68,68,0.2);animation:pulse 2s infinite}
/* CALENDAR */
.cal-toggle{display:flex;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:3px;gap:3px;margin-bottom:14px}
.cal-toggle-btn{flex:1;padding:7px;border:none;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;transition:all .2s;background:transparent;color:var(--text2);font-family:var(--font)}
.cal-toggle-btn.active{background:#fff;color:var(--tq);box-shadow:0 1px 4px rgba(0,0,0,0.08)}
body.dark .cal-toggle-btn.active{background:var(--night3,#2a3042);color:var(--tq)}
.cal-week{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:4px}
.cal-day-head{text-align:center;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--text2);padding:4px 0}
.cal-day-head.today{color:var(--tq)}
.cal-week-cells{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.cal-cell{min-height:64px;border:1.5px solid var(--border);border-radius:8px;padding:4px;background:var(--white);position:relative;transition:all .2s}
.cal-cell.today{border-color:rgba(26,199,193,0.4);background:rgba(26,199,193,0.03)}
.cal-cell.empty{background:var(--bg);border-color:transparent}
.cal-event{border-radius:5px;padding:3px 5px;margin-bottom:3px;font-size:9px;font-weight:700;color:#fff;line-height:1.3;overflow:hidden;cursor:pointer;transition:opacity .2s}
.cal-event:hover{opacity:.85}
.cal-event .ev-time{font-size:8px;opacity:.85;font-weight:600}
.cal-month-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}
.cal-month-head{text-align:center;font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text2);padding:4px 0}
.cal-month-cell{min-height:44px;border:1px solid var(--border);border-radius:6px;padding:3px;background:var(--white)}
.cal-month-cell.other-month{background:var(--bg);opacity:.5}
.cal-month-cell.today-cell{border-color:var(--tq);background:rgba(26,199,193,0.04)}
.cal-month-num{font-size:10px;font-weight:700;color:var(--text2);margin-bottom:2px}
.cal-month-num.today-num{color:var(--tq)}
.cal-dot-wrap{display:flex;flex-wrap:wrap;gap:2px}
.cal-mdot{width:7px;height:7px;border-radius:50%}
/* PROGRESS */
.progress-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.prog-card{background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:14px;text-align:center}
.prog-num{font-size:28px;font-weight:900;color:var(--tq);margin-bottom:2px}
.prog-lbl{font-size:10px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:1px}
.streak-bar{display:flex;gap:4px;justify-content:center;margin-top:8px}
.streak-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;border:2px solid var(--border)}
.streak-dot.done{background:var(--tq);border-color:var(--tq);color:#fff}
.streak-dot.today{background:var(--co);border-color:var(--co);color:#fff;animation:pulse 2s infinite}
/* PRO */
.pro-page{padding:20px 20px 100px}
.pro-header{background:linear-gradient(135deg,var(--tq),#0fa8a3);border-radius:var(--r);padding:24px 20px;color:#fff;margin-bottom:20px;position:relative;overflow:hidden}
.pro-header::after{content:'🏆';position:absolute;right:20px;top:20px;font-size:40px;opacity:.3}
.pro-header h2{font-size:22px;font-weight:900;margin-bottom:4px}
.pro-header p{font-size:13px;opacity:.85}
.pro-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px}
.pro-stat{background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:16px;text-align:center}
.pro-stat-num{font-size:28px;font-weight:900;color:var(--tq)}
.pro-stat-lbl{font-size:10px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-top:2px}
.pro-section{margin-bottom:20px}
.pro-section-title{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2);margin-bottom:12px}
.pro-chart{background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:16px}
.chart-bars{display:flex;align-items:flex-end;gap:6px;height:80px;margin-bottom:8px}
.chart-bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.chart-bar{width:100%;background:linear-gradient(to top,var(--tq),rgba(26,199,193,0.4));border-radius:4px 4px 0 0;transition:height .5s}
.chart-bar-lbl{font-size:9px;color:var(--text2);font-weight:600}
.chart-bar-val{font-size:9px;color:var(--tq);font-weight:700}
.pro-leads{display:flex;flex-direction:column;gap:8px}
.lead-item{display:flex;align-items:center;gap:12px;background:#fff;border:1.5px solid var(--border);border-radius:10px;padding:12px}
.lead-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--tq),var(--co));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:13px;flex-shrink:0}
.lead-name{font-size:13px;font-weight:600;margin-bottom:1px}
.lead-meta{font-size:11px;color:var(--text2)}
.lead-action{margin-left:auto;padding:6px 12px;background:var(--tq);color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;transition:all .2s;white-space:nowrap}
.lead-action:hover{background:#17b3ad}
.pro-edit-form{background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:16px}
.form-group{margin-bottom:14px}
.form-label{font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;display:block}
.form-input{width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:var(--font);outline:none;transition:border-color .2s}
.form-input:focus{border-color:var(--tq)}
.form-textarea{width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:var(--font);outline:none;resize:vertical;min-height:80px;transition:border-color .2s}
.form-textarea:focus{border-color:var(--tq)}
/* PRO TABS */
.pro-tabs{display:flex;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:3px;gap:3px;margin-bottom:20px}
.pro-tab{flex:1;padding:8px 4px;border:none;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;transition:all .2s;background:transparent;color:var(--text2);font-family:var(--font);text-align:center}
.pro-tab.active{background:#fff;color:var(--tq);box-shadow:0 1px 4px rgba(0,0,0,0.08)}
body.dark .pro-tab.active{background:var(--night3,#2a3042);color:var(--tq)}
/* MESSAGERIE */
.msg-list{display:flex;flex-direction:column;gap:8px}
.msg-item{background:var(--white);border:1.5px solid var(--border);border-radius:12px;overflow:hidden;transition:all .2s}
.msg-item.unread{border-color:rgba(26,199,193,0.4);background:rgba(26,199,193,0.02)}
.msg-header{display:flex;align-items:center;gap:10px;padding:12px 14px;cursor:pointer}
.msg-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--tq),var(--co));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:13px;flex-shrink:0;position:relative}
.msg-unread-dot{position:absolute;top:-2px;right:-2px;width:10px;height:10px;background:#EF4444;border-radius:50%;border:2px solid var(--white)}
.msg-info{flex:1;min-width:0}
.msg-name{font-size:13px;font-weight:700;margin-bottom:1px}
.msg-preview{font-size:11px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.msg-meta{font-size:10px;color:var(--text2);text-align:right;flex-shrink:0}
.msg-status{font-size:10px;font-weight:700;padding:3px 8px;border-radius:100px;margin-top:3px;display:inline-block}
.msg-status.new{background:rgba(26,199,193,0.1);color:var(--tq)}
.msg-status.replied{background:rgba(34,197,94,0.1);color:#22C55E}
.msg-body{border-top:1px solid var(--border);padding:14px}
.msg-bubble-wrap{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}
.msg-bubble{max-width:80%;padding:9px 12px;border-radius:12px;font-size:12px;line-height:1.5}
.msg-bubble.them{background:var(--bg);color:var(--text);border-bottom-left-radius:4px;align-self:flex-start}
.msg-bubble.us{background:var(--tq);color:#fff;border-bottom-right-radius:4px;align-self:flex-end}
.msg-reply-row{display:flex;gap:8px}
.msg-reply-input{flex:1;padding:9px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:12px;font-family:var(--font);outline:none;background:var(--white);color:var(--text)}
.msg-reply-input:focus{border-color:var(--tq)}
.msg-send-btn{padding:9px 14px;background:var(--tq);color:#fff;border:none;border-radius:8px;font-weight:700;font-size:12px;cursor:pointer;flex-shrink:0}
/* PLANNING EDITOR */
.ped-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:14px}
.ped-day-col{display:flex;flex-direction:column;gap:4px}
.ped-day-head{text-align:center;font-size:9px;font-weight:800;text-transform:uppercase;color:var(--text2);padding:6px 2px;background:var(--bg);border-radius:6px}
.ped-day-head.today{color:var(--tq);background:rgba(26,199,193,0.08)}
.ped-slot{border-radius:8px;padding:6px 4px;font-size:9px;font-weight:700;color:#fff;text-align:center;cursor:pointer;transition:all .2s;line-height:1.3}
.ped-slot:hover{opacity:.85;transform:scale(1.04)}
.ped-add{border:1.5px dashed var(--border);border-radius:8px;padding:6px 4px;text-align:center;font-size:14px;color:var(--text2);cursor:pointer;transition:all .2s;background:transparent}
.ped-add:hover{border-color:var(--tq);color:var(--tq);background:rgba(26,199,193,0.04)}
.ped-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:flex-end;justify-content:center}
.ped-sheet{background:var(--white);border-radius:20px 20px 0 0;padding:24px 20px 40px;width:100%;max-width:540px;max-height:85vh;overflow-y:auto}
.ped-sheet h3{font-size:16px;font-weight:900;margin-bottom:18px}
.ped-form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.ped-input{width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:var(--font);outline:none;background:var(--white);color:var(--text);box-sizing:border-box}
.ped-input:focus{border-color:var(--tq)}
.ped-colors{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.ped-color{width:28px;height:28px;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:all .2s}
.ped-color.selected{border-color:var(--text);transform:scale(1.15)}
/* HAMBURGER MENU */
.hamburger{width:38px;height:38px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:5px;cursor:pointer;border-radius:10px;transition:background .2s;flex-shrink:0}
.hamburger:hover{background:var(--bg)}
.hamburger span{display:block;width:20px;height:2px;background:var(--text);border-radius:2px;transition:all .3s}
.hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hamburger.open span:nth-child(2){opacity:0;transform:scaleX(0)}
.hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.hmenu-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.35);z-index:199;backdrop-filter:blur(2px)}
.hmenu-drawer{position:fixed;top:0;left:0;bottom:0;width:260px;background:var(--white);z-index:200;display:flex;flex-direction:column;box-shadow:4px 0 32px rgba(0,0,0,0.12);transform:translateX(-100%);transition:transform .28s cubic-bezier(.4,0,.2,1)}
.hmenu-drawer.open{transform:translateX(0)}
.hmenu-top{padding:24px 20px 16px;border-bottom:1px solid var(--border)}
.hmenu-logo{font-size:22px;font-weight:900;color:var(--text)}.hmenu-logo em{color:var(--tq);font-style:normal}
.hmenu-sub{font-size:11px;color:var(--text2);margin-top:2px}
.hmenu-items{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:4px}
.hmenu-item{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:12px;cursor:pointer;transition:all .18s;font-size:14px;font-weight:600;color:var(--text)}
.hmenu-item:hover{background:var(--bg)}
.hmenu-item.active{background:rgba(26,199,193,0.1);color:var(--tq)}
.hmenu-item-ico{font-size:20px;width:28px;text-align:center;flex-shrink:0}
.hmenu-divider{height:1px;background:var(--border);margin:8px 12px}
.hmenu-bottom{padding:16px 12px 32px;border-top:1px solid var(--border)}
/* EMPTY STATE */
.empty-smart{padding:32px 20px 20px;text-align:center}
.empty-smart-ico{font-size:52px;margin-bottom:14px}
.empty-smart h3{font-size:18px;font-weight:800;margin-bottom:8px;color:var(--text)}
.empty-smart p{font-size:13px;color:var(--text2);margin-bottom:20px;line-height:1.6}
.empty-actions{display:flex;flex-direction:column;gap:8px;margin-bottom:28px}
.empty-action-btn{padding:11px 16px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font);transition:all .2s;border:1.5px solid var(--border)}
.empty-action-btn.primary{background:var(--tq);color:#fff;border-color:var(--tq)}
.empty-action-btn.secondary{background:transparent;color:var(--text);background:var(--bg)}
.empty-similar-title{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2);margin-bottom:12px;text-align:left}
/* RATING */
.rating-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.45);z-index:300;display:flex;align-items:flex-end;justify-content:center}
.rating-sheet{background:var(--white);border-radius:20px 20px 0 0;padding:24px 20px 40px;width:100%;max-width:540px}
.rating-sheet h3{font-size:16px;font-weight:900;margin-bottom:4px}
.rating-sheet .sub{font-size:12px;color:var(--text2);margin-bottom:20px}
.stars-row{display:flex;gap:6px;justify-content:center;margin-bottom:20px}
.star-btn{font-size:32px;cursor:pointer;transition:transform .15s;line-height:1;background:none;border:none;padding:0}
.star-btn:hover{transform:scale(1.2)}
.rating-textarea{width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:10px;font-size:13px;font-family:var(--font);outline:none;resize:none;min-height:80px;background:var(--white);color:var(--text);box-sizing:border-box}
.rating-textarea:focus{border-color:var(--tq)}
.hist-rating{display:flex;align-items:center;gap:4px;margin-top:3px}
.hist-star{font-size:11px;line-height:1}
.hist-comment{font-size:10px;color:var(--text2);font-style:italic;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px}
/* TOAST */
.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--text);color:#fff;padding:10px 20px;border-radius:100px;font-size:13px;font-weight:600;z-index:400;animation:toastIn .3s ease,toastOut .3s ease 2.2s forwards;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,0.2)}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
@keyframes toastOut{from{opacity:1}to{opacity:0;transform:translateX(-50%) translateY(10px)}}
/* MISC */
.empty{padding:60px 20px;text-align:center}
.empty-ico{font-size:48px;margin-bottom:12px}
.empty h3{font-size:18px;font-weight:700;margin-bottom:8px}
.empty p{font-size:13px;color:var(--text2)}
/* SEARCH BAR */
.hero-search{display:flex;align-items:center;gap:8px;background:var(--white);border:2px solid var(--border);border-radius:14px;padding:10px 16px;margin-bottom:20px;transition:border-color .2s;box-shadow:var(--shadow)}
.hero-search:focus-within{border-color:var(--tq)}
.hero-search-ico{font-size:16px;color:var(--text2);flex-shrink:0}
.hero-search input{flex:1;border:none;outline:none;font-family:var(--font);font-size:14px;font-weight:500;background:transparent;color:var(--text)}
.hero-search input::placeholder{color:var(--text2)}
.hero-search-clear{background:none;border:none;cursor:pointer;color:var(--text2);font-size:14px;padding:2px 6px;border-radius:6px;transition:all .2s}
.hero-search-clear:hover{background:var(--bg);color:var(--text)}
/* TREND BADGE */
.b-trend{position:absolute;top:10px;left:10px;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:800;backdrop-filter:blur(10px);letter-spacing:.3px}
.b-trend.new{background:rgba(34,197,94,0.95);color:#fff}
.b-trend.popular{background:rgba(255,154,90,0.95);color:#fff}
.b-trend.trending{background:rgba(155,93,229,0.95);color:#fff}
/* SPOTS LEFT */
.spots-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:800}
.spots-badge.urgent{background:rgba(239,68,68,0.12);color:#EF4444;border:1px solid rgba(239,68,68,0.25)}
.spots-badge.ok{background:rgba(26,199,193,0.1);color:var(--tq);border:1px solid rgba(26,199,193,0.2)}
/* MAP VIEW */
.map-toggle-bar{display:flex;align-items:center;gap:8px;padding:10px 20px;background:var(--white);border-bottom:1px solid var(--border)}
.map-toggle-btn{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:100px;font-size:12px;font-weight:700;border:1.5px solid var(--border);background:var(--bg);color:var(--text2);cursor:pointer;transition:all .2s}
.map-toggle-btn.active{background:var(--tq);border-color:var(--tq);color:#fff}
.map-view{padding:16px 20px 100px}
.map-container{background:var(--white);border:1.5px solid var(--border);border-radius:var(--r);overflow:hidden;position:relative}
.map-placeholder{width:100%;height:360px;background:linear-gradient(135deg,#e8f4f8,#d1eaf0);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.map-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(26,199,193,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(26,199,193,0.06) 1px,transparent 1px);background-size:40px 40px}
.map-roads{position:absolute;inset:0}
.map-pin{position:absolute;transform:translate(-50%,-100%);cursor:pointer;transition:transform .2s;z-index:2}
.map-pin:hover{transform:translate(-50%,-100%) scale(1.2)}
.map-pin-ico{font-size:22px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.3))}
.map-pin-label{position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:9px;font-weight:700;color:var(--text);background:var(--white);border:1px solid var(--border);border-radius:4px;padding:2px 5px;pointer-events:none}
.map-legend{padding:12px 16px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.map-legend-txt{font-size:11px;color:var(--text2)}
.map-club-list{margin-top:14px;display:flex;flex-direction:column;gap:10px}
.map-club-row{display:flex;align-items:center;gap:12px;background:var(--white);border:1.5px solid var(--border);border-radius:12px;padding:12px;cursor:pointer;transition:all .2s}
.map-club-row:hover{border-color:var(--tq);transform:translateX(3px)}
.map-club-emoji{font-size:24px;width:44px;height:44px;border-radius:10px;background:var(--bg);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.map-club-name{font-size:13px;font-weight:700;margin-bottom:2px}
.map-club-meta{font-size:11px;color:var(--text2)}
.map-club-price{margin-left:auto;font-size:13px;font-weight:800;color:var(--tq);flex-shrink:0}
/* FOOTER */
.app-footer{background:var(--white);border-top:1px solid var(--border);padding:20px 20px 28px;text-align:center;margin-bottom:80px}
.footer-logo{font-size:18px;font-weight:900;color:var(--text);margin-bottom:4px}
.footer-logo em{color:var(--tq);font-style:normal}
.footer-tagline{font-size:11px;color:var(--text2);margin-bottom:16px}
.footer-dark-toggle{display:inline-flex;align-items:center;gap:10px;padding:8px 16px;background:var(--bg);border:1.5px solid var(--border);border-radius:100px;cursor:pointer;transition:all .2s}
.footer-dark-toggle:hover{border-color:var(--tq)}
.footer-dark-lbl{font-size:12px;font-weight:700;color:var(--text)}
@media(min-width:768px){.clubs-grid{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1100px){.clubs-grid{grid-template-columns:repeat(3,1fr)}}
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ HELPERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
const priceLabel = (c) => {
  if (c.type === "Association") return `${c.priceMin}–${c.priceMax}€/an`;
  if (c.priceUnit === "an") return `${c.priceMin}–${c.priceMax}€/an`;
  if (c.priceUnit === "séance") return `${c.priceMin}€/séance`;
  return `${c.priceMin}–${c.priceMax}€/mois`;
};
const labelColor = (l) => {
  if (l.includes("Women")||l.includes("💜")) return "pk";
  if (l.includes("PMR")||l.includes("Post")) return "pur";
  if (l.includes("Essai")||l.includes("Coach")) return "";
  return "co";
};
const MOCK_HISTORY = [
  {id:1,name:"Tennis Club de Paris",emoji:"🎾",city:"Paris",ago:"Il y a 2h"},
  {id:3,name:"Zen Yoga Studio",emoji:"🧘",city:"Paris",ago:"Hier"},
  {id:6,name:"Bloc Vertical Paris",emoji:"🧗",city:"Paris",ago:"Il y a 3 jours"},
];
const MOCK_PLANNING = (() => {
  const today = new Date();
  const todayAbbr = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"][today.getDay()];
  const nextHour = (today.getHours() + 1) % 24;
  const soonHour = String(nextHour).padStart(2,"0")+":"+String(today.getMinutes()).padStart(2,"0");
  const otherDays = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].filter(d=>d!==todayAbbr);
  return [
    {id:1,clubName:"Tennis Club de Paris",courseName:"Perfectionnement",day:todayAbbr,time:soonHour,emoji:"🎾",color:"#1AC7C1"},
    {id:3,clubName:"Zen Yoga Studio",courseName:"Vinyasa Flow",day:otherDays[1]||otherDays[0],time:"12:00",emoji:"🧘",color:"#9B5DE5"},
    {id:6,clubName:"Bloc Vertical Paris",courseName:"Progression technique",day:otherDays[3]||otherDays[2]||otherDays[0],time:"11:00",emoji:"🧗",color:"#22C55E"},
  ];
})();
const MOCK_LEADS = [
  {id:1, initials:"SL", name:"Sarah L.",   sport:"Tennis",  message:"Cherche cours débutant, disponible soir", time:"Il y a 12 min", status:"new",
   conversation:[
     {from:"them", text:"Bonjour ! Je cherche des cours de tennis pour débutants le soir. Est-ce que vous avez des créneaux disponibles cette semaine ?"},
   ]},
  {id:2, initials:"TM", name:"Thomas M.",  sport:"Tennis",  message:"Niveau intermédiaire, compétition", time:"Il y a 2h", status:"new",
   conversation:[
     {from:"them", text:"Bonjour, je suis niveau intermédiaire et je souhaite progresser vers la compétition. Quels sont vos tarifs pour un coaching perso ?"},
   ]},
  {id:3, initials:"CG", name:"Claire G.",  sport:"Tennis",  message:"Essai gratuit demandé", time:"Hier", status:"replied",
   conversation:[
     {from:"them", text:"Bonjour, j'aimerais essayer un cours avant de m'inscrire. Proposez-vous un cours d'essai gratuit ?"},
     {from:"us",   text:"Bonjour Claire ! Oui bien sûr, nous proposons un premier cours d'essai offert. Je vous réserve un créneau samedi à 10h ?"},
     {from:"them", text:"Super, samedi 10h c'est parfait ! Merci beaucoup 😊"},
   ]},
  {id:4, initials:"AM", name:"Alex M.",    sport:"Tennis",  message:"Cours collectifs dispo ?", time:"Hier", status:"new",
   conversation:[
     {from:"them", text:"Salut ! Vous avez encore de la place dans vos cours collectifs pour le mois prochain ?"},
   ]},
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ SPLASH SCREEN ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function SplashScreen() {
  return (
    <div className="splash">
      <div className="splash-logo"><em>Clubby</em></div>
      <div className="splash-tagline">match avec ton sport</div>
      <div className="splash-dots">
        <div className="splash-dot"/>
        <div className="splash-dot"/>
        <div className="splash-dot"/>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ ONBOARDING ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);

  // Step 0 — Profil
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [genre, setGenre] = useState(null); // "M"|"F"|"NA"
  const [health, setHealth] = useState([]);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [avatar, setAvatar] = useState(null); // base64

  // Steps 1-4 — Perso
  const [sports, setSports] = useState([]);
  const [objective, setObjective] = useState(null);
  const [freq, setFreq] = useState(null);

  const total = 5;

  const toggleHealth = (id) => setHealth(h => h.includes(id) ? h.filter(x=>x!==id) : [...h, id]);
  const toggleSport = (s) => setSports(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev, s]);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const canNext = true;

  const next = () => {
    if (step < total - 1) setStep(s => s + 1);
    else onDone({ prenom, nom, dob, email, phone, adresse, genre, medical: health, avatar, sports, objective, freq, health, password });
  };

  const avatarInitials = (prenom[0]||"?").toUpperCase() + (nom[0]||"").toUpperCase();

  return (
    <div className="ob-wrap">
      <div className="ob-progress"><div className="ob-progress-bar" style={{width:`${((step+1)/total)*100}%`}}/></div>
      <div className="ob-body">

        {/* ── STEP 0 : Profil ── */}
        {step===0 && <>
          <div className="ob-step">Étape 1 / {total}</div>
          <h2 className="ob-title">Crée ton <em>profil</em> Clubby</h2>
          <p className="ob-sub">Pour personnaliser ta recherche, réserver des essais et être contacté par les clubs.</p>

          {/* Avatar */}
          <div className="ob-avatar-area">
            <label htmlFor="avatar-upload" style={{cursor:"pointer"}}>
              <div className="ob-avatar-circle">
                {avatar
                  ? <img src={avatar} alt="avatar" style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}/>
                  : <span style={{fontSize:26,fontWeight:900,color:"#fff"}}>{avatarInitials}</span>
                }
                <div className="ob-avatar-edit">📷</div>
              </div>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatar}/>
            <div className="ob-avatar-hint">Appuie pour ajouter une photo</div>
          </div>

          <div className="ob-form">
            {/* Nom / Prénom */}
            <div className="ob-input-row">
              <div className="ob-field">
                <label className="ob-label">Prénom *</label>
                <input className="ob-input" placeholder="ex: Julie" value={prenom} onChange={e=>setPrenom(e.target.value)}/>
              </div>
              <div className="ob-field">
                <label className="ob-label">Nom <span className="opt">optionnel</span></label>
                <input className="ob-input" placeholder="ex: Martin" value={nom} onChange={e=>setNom(e.target.value)}/>
              </div>
            </div>

            {/* Date de naissance */}
            <div className="ob-field">
              <label className="ob-label">Date de naissance</label>
              <input className="ob-input" type="date" value={dob} onChange={e=>setDob(e.target.value)} max={new Date().toISOString().split("T")[0]}/>
            </div>

            {/* Email */}
            <div className="ob-field">
              <label className="ob-label">Email *</label>
              <input className="ob-input" type="email" placeholder="ton@email.fr" value={email} onChange={e=>setEmail(e.target.value)}/>
            </div>

            {/* Téléphone */}
            <div className="ob-field">
              <label className="ob-label">Téléphone <span className="opt">optionnel</span></label>
              <input className="ob-input" type="tel" placeholder="06 XX XX XX XX" value={phone} onChange={e=>setPhone(e.target.value)}/>
              <span style={{fontSize:10,color:"var(--text2)",marginTop:3}}>Rappel de cours par SMS, validation du compte</span>
            </div>

            {/* Adresse */}
            <div className="ob-field">
              <label className="ob-label">Adresse <span className="opt">optionnel</span></label>
              <input className="ob-input" placeholder="ex: 12 rue de la Paix, Paris" value={adresse} onChange={e=>setAdresse(e.target.value)}/>
              <span style={{fontSize:10,color:"var(--text2)",marginTop:3}}>Pour te suggérer des clubs proches de chez toi</span>
            </div>

            {/* Genre */}
            <div className="ob-field">
              <label className="ob-label">Genre <span className="opt">optionnel</span></label>
              <div className="ob-genre-row">
                {[["M","🧔","Homme"],["F","👩","Femme"],["NA","🏳️","Non précisé"]].map(([val,ico,lbl])=>(
                  <button key={val} className={`ob-genre-btn${genre===val?" on":""}`} onClick={()=>setGenre(v=>v===val?null:val)}>
                    <span className="ob-genre-ico">{ico}</span>
                    <span style={{fontSize:11,fontWeight:600}}>{lbl}</span>
                  </button>
                ))}
              </div>
              <span style={{fontSize:10,color:"var(--text2)",marginTop:3}}>Permet de filtrer les cours réservés aux femmes</span>
            </div>

            {/* Mot de passe */}
            <div className="ob-field">
              <label className="ob-label">Mot de passe * <span className="opt">8 caractères min.</span></label>
              <div className="ob-pw-wrap">
                <input
                  className="ob-input"
                  type={showPw?"text":"password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  style={{paddingRight:40}}
                />
                <button className="ob-pw-toggle" onClick={()=>setShowPw(v=>!v)}>{showPw?"🙈":"👁️"}</button>
              </div>
            </div>
          </div>
        </>}

        {/* ── STEP 1 : Sports ── */}
        {step===1 && <>
          <div className="ob-step">Étape 2 / {total}</div>
          <h2 className="ob-title">Quel sport te <em>correspond</em> ?</h2>
          <p className="ob-sub">Sélectionne un ou plusieurs sports. On adaptera les recommandations.</p>
          <div className="ob-sports-grid">
            {ONBOARDING_SPORTS.map(s => { const parts=s.split(" "); const ico=parts.pop(); const nm=parts.join(" "); return (
              <button key={s} className={`ob-sport-btn${sports.includes(s)?" on":""}`} onClick={()=>toggleSport(s)}>
                <span className="ob-sport-ico">{ico}</span>
                <span className="ob-sport-name">{nm}</span>
              </button>
            );})}
          </div>
        </>}

        {/* ── STEP 2 : Objectif ── */}
        {step===2 && <>
          <div className="ob-step">Étape 3 / {total}</div>
          <h2 className="ob-title">Quel est ton <em>objectif</em> ?</h2>
          <p className="ob-sub">On va t'aider à trouver le club qui correspond à ta motivation.</p>
          <div className="ob-obj-grid">
            {OBJECTIVES.map(o => (
              <button key={o.id} className={`ob-obj-btn${objective===o.id?" on":""}`} onClick={()=>setObjective(o.id)}>
                <span className="ob-obj-ico">{o.icon}</span>
                <span className="ob-obj-label">{o.label}</span>
              </button>
            ))}
          </div>
        </>}

        {/* ── STEP 3 : Fréquence ── */}
        {step===3 && <>
          <div className="ob-step">Étape 4 / {total}</div>
          <h2 className="ob-title">Combien de fois <em>par semaine</em> ?</h2>
          <p className="ob-sub">Ça nous aide à filtrer les clubs selon leur planning.</p>
          <div className="ob-freq-list">
            {FREQ_OPTIONS.map(f => (
              <button key={f} className={`ob-freq-btn${freq===f?" on":""}`} onClick={()=>setFreq(f)}>{f}</button>
            ))}
          </div>
        </>}

        {/* ── STEP 4 : Profil spécifique ── */}
        {step===4 && <>
          <div className="ob-step">Étape 5 / {total}</div>
          <h2 className="ob-title">Profil <em>spécifique</em> ?</h2>
          <p className="ob-sub">On activera automatiquement les filtres adaptés. Optionnel, tu peux passer.</p>
          <div className="ob-health-list">
            {[
              {id:"cardiaque",  icon:"❤️", label:"Problème cardiaque",        sub:"Besoin d'autorisation médicale"},
              {id:"grossesse",  icon:"🤰", label:"Grossesse en cours",          sub:"Cours adaptés & sécurisés"},
              {id:"postPartum", icon:"🤱", label:"Post-partum",                 sub:"Reprise progressive après accouchement"},
              {id:"pmr",        icon:"♿", label:"Handicap / PMR",              sub:"Accessibilité et cours adaptés"},
              {id:"blessure",   icon:"🦴", label:"Blessure / Rééducation",      sub:"Programmes de récupération"},
              {id:"senior",     icon:"👴", label:"Senior (65+)",                sub:"Cours adaptés à mon âge"},
              {id:"none",       icon:"👍", label:"Aucun antécédent",            sub:"Je pratique sans contrainte particulière"},
            ].map(h => (
              <button key={h.id} className={`ob-health-btn${health.includes(h.id)?" on":""}`} onClick={()=>toggleHealth(h.id)}>
                <span className="ob-health-ico">{h.icon}</span>
                <div><div className="ob-health-label">{h.label}</div><div className="ob-health-sub">{h.sub}</div></div>
              </button>
            ))}
          </div>
          <div style={{fontSize:10,color:"var(--text2)",marginTop:12}}>🔒 Ces infos restent privées et servent uniquement à adapter tes résultats</div>
        </>}

      </div>
      <div className="ob-footer" style={{left:0,right:0,position:"fixed",bottom:0,background:"#fff",borderTop:"1px solid var(--border)",padding:"16px 24px 28px",display:"flex",gap:"12px",justifyContent:"center"}}>
        <div style={{display:"flex",gap:"12px",width:"100%",maxWidth:"520px"}}>
          {step>0 && <button className="ob-back" onClick={()=>setStep(s=>s-1)}>← Retour</button>}
          {step===total-1 ? <>
            <button className="ob-skip" onClick={()=>onDone(null)}>Passer</button>
            <button className="ob-next" style={{flex:1}} onClick={next}>C'est parti 🚀</button>
          </> : <>
            {step===0
              ? <button className="ob-skip" onClick={()=>onDone(null)}>Passer l'inscription</button>
              : <button className="ob-skip" onClick={()=>onDone(null)}>Passer</button>
            }
            <button className="ob-next" style={{flex:1}} disabled={!canNext} onClick={next}>Suivant →</button>
          </>}
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ CLUB DETAIL ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ClubDetail({ club, isFav, onToggleFav, onClose, onAddToPlanning, showToast }) {
  const [alertOn, setAlertOn] = useState(false);
  const [persons, setPersons] = useState(1);
  const [imgOk, setImgOk] = useState(true);
  const [slotPicker, setSlotPicker] = useState(null); // course being picked
  const [pickedDay, setPickedDay] = useState(null);
  const [pickedTime, setPickedTime] = useState(null);
  const [essaiPicker, setEssaiPicker] = useState(false);
  const [essaiCourse, setEssaiCourse] = useState(null);
  const [essaiDay, setEssaiDay] = useState(null);
  const [essaiTime, setEssaiTime] = useState(null);
  const [essaiConfirmed, setEssaiConfirmed] = useState(false);

  const openSlotPicker = (course) => {
    // Default to first available day/time
    const firstDay = DAYS.find(d=>(club.schedule[d]||[]).length>0) || DAYS[0];
    setPickedDay(firstDay);
    setPickedTime((club.schedule[firstDay]||[])[0] || null);
    setSlotPicker(course);
  };

  const confirmSlot = () => {
    if (!pickedDay || !pickedTime) return;
    onAddToPlanning(club, slotPicker, pickedDay, pickedTime);
    setSlotPicker(null);
    showToast("📅 Cours ajouté à ton planning !");
  };

  return (
    <div className="ov" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sh-handle"/>
        <div className="sh-hero">
          {imgOk
            ? <img src={club.image} alt={club.name} loading="lazy" onError={()=>setImgOk(false)}/>
            : <div style={{width:"100%",height:"100%",background:`linear-gradient(135deg,${club.accentColor}ee,${club.accentColor}88)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
                <span style={{fontSize:80,filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.25))"}}>{club.emoji}</span>
                <span style={{color:"rgba(255,255,255,0.9)",fontSize:15,fontWeight:800,letterSpacing:2,textTransform:"uppercase"}}>{club.sport}</span>
              </div>
          }
          <div className="sh-hero-ov"/>
          <button className="sh-close" onClick={onClose}>✕</button>
          <button className={`sh-fav${isFav?" on":""}`} onClick={()=>onToggleFav(club.id)}>
            {isFav?"❤️":"🤍"}
          </button>
          <div className="sh-hero-content">
            <div className="sh-sbadge">{club.emoji} {club.sport}</div>
            <div className="sh-title">{club.name}</div>
          </div>
        </div>
        <div className="sh-body">
          <div className="sh-rating">
            <div className="sh-rnum">{club.rating}</div>
            <div>
              <div className="stars-row">{stars(club.rating).split("").map((s,i)=><span key={i} className="star">{s}</span>)}</div>
              <div className="sh-rvw">{club.reviews} avis vérifiés</div>
            </div>
          </div>
          <div className="sh-labels">
            {club.labels.map(l=><span key={l} className="sh-lbl">{l}</span>)}
          </div>
          <div className="sh-section">
            <div className="sh-stitle">À propos</div>
            <div className="sh-desc">{club.description}</div>
          </div>
          <div className="sh-section">
            <div className="sh-stitle">Infos pratiques</div>
            <div className="meta-grid">
              <div className="meta-item"><span className="meta-ico">📍</span><div><div className="meta-lbl">Adresse</div><div className="meta-val">{club.address}</div></div></div>
              <div className="meta-item"><span className="meta-ico">📞</span><div><div className="meta-lbl">Téléphone</div><div className="meta-val">{club.phone}</div></div></div>
              <div className="meta-item"><span className="meta-ico">📧</span><div><div className="meta-lbl">Email</div><div className="meta-val" style={{fontSize:11}}>{club.email}</div></div></div>
              <div className="meta-item"><span className="meta-ico">🕐</span><div><div className="meta-lbl">Horaires</div><div className="meta-val">{club.openHours}</div></div></div>
              <div className="meta-item"><span className="meta-ico">{club.indoor?"🏠":"🌳"}</span><div><div className="meta-lbl">Lieu</div><div className="meta-val">{club.indoor?"En salle":"En extérieur"} · {club.type}</div></div></div>
              <div className="meta-item"><span className="meta-ico">👥</span><div><div className="meta-lbl">Ambiance</div><div className="meta-val" style={{textTransform:"capitalize"}}>{club.ambiance}</div></div></div>
            </div>
          </div>
          <div className="sh-section">
            <div className="sh-stitle">Tarifs</div>
            <div className="price-block">
              <div className="price-main">{priceLabel(club)}</div>
              {club.type === "Association"
                ? <div className="price-range">Tarif annuel — varie selon l'âge et le niveau</div>
                : club.priceCourse && <div className="price-range">Cours à l'unité : à partir de {club.priceCourse}€</div>
              }
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                {club.tarifEtudiant&&<span className="ctag">🎓 Tarif étudiant</span>}
                {club.tarifSenior&&<span className="ctag">👴 Tarif senior</span>}
                {club.tarifFamille&&<span className="ctag">👨‍👩‍👧 Tarif famille</span>}
                {club.essaiGratuit&&<span className="ctag" style={{background:"rgba(255,154,90,0.1)",color:"var(--co)"}}>✓ Essai gratuit</span>}
              </div>
            </div>
          </div>
          {club.type !== "Association" && (
          <div className="sh-section">
            <div className="sh-stitle">Politique d'annulation</div>
            <div className="cancel-box">{club.cancelPolicy}</div>
          </div>
          )}
          {club.type !== "Association" && (
          <div className="sh-section">
            <div className="sh-stitle">Cours proposés</div>
            <div className="persons-row">
              <span className="persons-lbl">👥 Réserver pour plusieurs personnes</span>
              <div className="persons-ctrl">
                <button className="pctrl-btn" onClick={()=>setPersons(p=>Math.max(1,p-1))}>−</button>
                <span className="pctrl-num">{persons}</span>
                <button className="pctrl-btn" onClick={()=>setPersons(p=>Math.min(8,p+1))}>+</button>
              </div>
            </div>
            <div className="course-list">
              {club.courses.map((c,i)=>(
                <div key={i} className="course-card">
                  <div className="course-row">
                    <div className="course-name">{c.name}</div>
                    <div className="course-price">{c.price ? `${c.price * persons}€` : "Inclus"}</div>
                  </div>
                  <div className="course-tags">
                    <span className="ctag">⏱ {c.duration}min</span>
                    <span className="ctag">👥 Max {c.maxPeople}</span>
                    <span className="ctag">🎯 {c.level}</span>
                    {c.spotsLeft !== undefined && (
                      <span className={`spots-pill ${c.spotsLeft <= 2 ? "spots-urgent" : "spots-ok"}`}>
                        {c.spotsLeft <= 2 ? "⚡" : "✓"} {c.spotsLeft} place{c.spotsLeft>1?"s":""} restante{c.spotsLeft>1?"s":""}
                      </span>
                    )}
                    <span className="ctag lang">🗣 {c.language}</span>
                    <span className="ctag" style={{background:"var(--bg)",color:"var(--text2)"}}>🎒 {c.equipment}</span>
                  </div>
                  <button onClick={()=>openSlotPicker(c)} style={{marginTop:8,padding:"6px 12px",background:"rgba(26,199,193,0.1)",border:"1px solid rgba(26,199,193,0.3)",borderRadius:6,fontSize:11,fontWeight:700,color:"var(--tq)",cursor:"pointer"}}>
                    📅 Ajouter au planning
                  </button>
                </div>
              ))}
            </div>
          </div>
          )}
          <div className="sh-section">
            <div className="sh-stitle">Nos coachs</div>
            <div className="coach-list">
              {club.coaches.map((c,i)=>(
                <div key={i} className="coach-card">
                  <div className="coach-av">{c.initials}</div>
                  <div>
                    <div className="coach-name">{c.name}</div>
                    <div className="coach-title">{c.title}</div>
                    <div className="coach-certif">🏅 {c.certif}</div>
                    <div className="coach-langs">🗣 {c.languages.join(", ")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sh-section">
            <div className="sh-stitle">Planning hebdomadaire</div>
            <div className="sched-grid">
              {DAYS.map(d=>{
                const slots = club.schedule[d]||[];
                // Assign a course name to each slot pseudo-randomly based on club id + day + slot index
                const courseNames = club.courses.map(c=>c.name);
                const colors = [club.accentColor,"#9B5DE5","#22C55E","#FF9A5A","#3B82F6","#F59E0B"];
                return (
                  <div key={d} className="sched-col">
                    <div className="sched-day">{d}</div>
                    {slots.map((t,i)=>{
                      const seed = (club.id*7 + DAYS.indexOf(d)*3 + i*5) % courseNames.length;
                      const name = courseNames[seed] || courseNames[0];
                      const colorSeed = (club.id + DAYS.indexOf(d) + i) % colors.length;
                      const color = colors[colorSeed];
                      const shortName = name.split(" ").slice(0,2).join(" ");
                      return (
                        <div key={i} className="sched-slot" style={{background:`${color}18`,color,borderLeft:`2px solid ${color}`}}>
                          <div className="sched-slot-time">{t}</div>
                          <div style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%"}}>{shortName}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="sh-section">
            <div className="sh-stitle">Équipements & services</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {club.features.map(f=><span key={f} style={{fontSize:12,padding:"4px 10px",borderRadius:8,background:"var(--bg)",border:"1px solid var(--border)",color:"var(--text2)"}}>✓ {f}</span>)}
            </div>
          </div>
          <div className="sh-section">
            <div className="sh-stitle">Alertes disponibilités</div>
            <div className="alert-row">
              <span className="alert-lbl">🔔 M'alerter si un cours se libère</span>
              <label className="toggle-wrap">
                <input type="checkbox" checked={alertOn} onChange={e=>setAlertOn(e.target.checked)}/>
                <span className="tslider"/>
              </label>
            </div>
            {alertOn && <div style={{fontSize:12,color:"var(--tq)",fontWeight:600,padding:"6px 12px",background:"rgba(26,199,193,0.08)",borderRadius:8}}>✓ Tu seras notifié dès qu'une place se libère !</div>}
          </div>
          <div className="sh-section">
            <div className="sh-stitle">Réseaux sociaux</div>
            <div className="social-row">
              {club.socialLinks.instagram && <button className="social-btn">📸 {club.socialLinks.instagram}</button>}
              {club.socialLinks.facebook && <button className="social-btn">👤 {club.socialLinks.facebook}</button>}
            </div>
          </div>
          <div className="sh-ctas">
            <button className="btn-p" onClick={()=>showToast("📞 Redirection vers le club...")}>Contacter le club</button>
            {club.essaiGratuit && <button className="btn-co" onClick={()=>setEssaiPicker(true)}>Réserver l'essai gratuit</button>}
            <button className="btn-s" onClick={()=>{onToggleFav(club.id);showToast(isFav?"💔 Retiré des favoris":"❤️ Ajouté aux favoris !")}}>
              {isFav?"❤️":"🤍"}
            </button>
            <button className="btn-s" onClick={()=>showToast("🔗 Lien copié !")}>↗</button>
          </div>
        </div>
      </div>

      {/* ── Slot Picker Modal ── */}
      {slotPicker && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{e.stopPropagation();if(e.target===e.currentTarget)setSlotPicker(null)}}>
          <div style={{background:"var(--white)",borderRadius:"20px 20px 0 0",padding:"24px 20px 40px",width:"100%",maxWidth:540,maxHeight:"80vh",overflowY:"auto"}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:800,color:"var(--text)",marginBottom:4}}>📅 Choisir un créneau</div>
              <div style={{fontSize:12,color:"var(--text2)"}}>
                <strong style={{color:club.accentColor}}>{slotPicker.name}</strong> · {club.name}
              </div>
            </div>

            <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--text2)",marginBottom:8}}>Jour</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
              {DAYS.filter(d=>(club.schedule[d]||[]).length>0).map(d=>{
                const todayJs = new Date();
                const todayMon = (todayJs.getDay()+6)%7;
                const dayIdx = DAYS.indexOf(d);
                const diff = ((dayIdx - todayMon) + 7) % 7 || 7; // always future, min today+0 but if same day stays 0
                const date = new Date(todayJs);
                date.setDate(todayJs.getDate() + (dayIdx===todayMon?0:diff));
                const dayNum = date.getDate();
                return (
                  <button key={d} onClick={()=>{setPickedDay(d);setPickedTime((club.schedule[d]||[])[0]||null)}}
                    style={{padding:"7px 14px",borderRadius:100,border:`1.5px solid ${pickedDay===d?"var(--tq)":"var(--border)"}`,background:pickedDay===d?"rgba(26,199,193,0.1)":"transparent",color:pickedDay===d?"var(--tq)":"var(--text2)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"var(--font)",transition:"all .15s",display:"flex",gap:5,alignItems:"center"}}>
                    {d} <span style={{opacity:.65,fontWeight:500}}>{dayNum}</span>
                  </button>
                );
              })}
            </div>

            {pickedDay && <>
              <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--text2)",marginBottom:8}}>Heure</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:24}}>
                {(club.schedule[pickedDay]||[]).map(t=>(
                  <button key={t} onClick={()=>setPickedTime(t)}
                    style={{padding:"8px 16px",borderRadius:10,border:`1.5px solid ${pickedTime===t?club.accentColor:"var(--border)"}`,background:pickedTime===t?`${club.accentColor}15`:"transparent",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"var(--font)",transition:"all .15s",color:pickedTime===t?club.accentColor:"var(--text)"}}>
                    {t}
                  </button>
                ))}
              </div>
            </>}

            {pickedDay && pickedTime && (
              <div style={{background:"rgba(26,199,193,0.06)",border:"1px solid rgba(26,199,193,0.2)",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:12,color:"var(--text2)"}}>
                ✅ <strong style={{color:"var(--text)"}}>{slotPicker.name}</strong> — {pickedDay} à {pickedTime} · {club.name}
              </div>
            )}

            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setSlotPicker(null)} style={{flex:1,padding:12,border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text2)",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"var(--font)"}}>
                Annuler
              </button>
              <button onClick={confirmSlot}
                style={{flex:2,padding:12,background:pickedDay&&pickedTime?"linear-gradient(135deg,var(--tq),#14a09b)":"var(--border)",color:pickedDay&&pickedTime?"#fff":"var(--text2)",border:"none",borderRadius:10,fontWeight:800,fontSize:13,cursor:pickedDay&&pickedTime?"pointer":"not-allowed",fontFamily:"var(--font)",transition:"all .2s"}}>
                Confirmer la réservation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Essai Gratuit Picker ── */}
      {essaiPicker && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{e.stopPropagation();if(e.target===e.currentTarget){setEssaiPicker(false);setEssaiCourse(null);setEssaiConfirmed(false);}}}>
          <div style={{background:"var(--white)",borderRadius:"20px 20px 0 0",padding:"24px 20px 40px",width:"100%",maxWidth:540,maxHeight:"85vh",overflowY:"auto"}}>
            {!essaiConfirmed ? <>
              <div style={{textAlign:"center",marginBottom:20}}>
                <div style={{fontSize:22,marginBottom:6}}>🎉</div>
                <div style={{fontSize:14,fontWeight:800,color:"var(--text)",marginBottom:4}}>Réserver mon essai gratuit</div>
                <div style={{fontSize:12,color:"var(--text2)"}}>{club.name} · Aucun engagement</div>
              </div>

              <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--text2)",marginBottom:8}}>1. Choisir un cours</div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
                {club.courses.map((c,i)=>(
                  <button key={i} onClick={()=>{setEssaiCourse(c);const fd=DAYS.find(d=>(club.schedule[d]||[]).length>0);setEssaiDay(fd||null);setEssaiTime((club.schedule[fd]||[])[0]||null);}}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,border:`1.5px solid ${essaiCourse===c?"var(--tq)":"var(--border)"}`,background:essaiCourse===c?"rgba(26,199,193,0.07)":"transparent",cursor:"pointer",fontFamily:"var(--font)",textAlign:"left",transition:"all .15s"}}>
                    <div style={{width:8,height:8,borderRadius:2,background:club.accentColor,flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>{c.name}</div>
                      <div style={{fontSize:11,color:"var(--text2)"}}>⏱ {c.duration}min · 🎯 {c.level}</div>
                    </div>
                    {essaiCourse===c && <span style={{color:"var(--tq)",fontWeight:800}}>✓</span>}
                  </button>
                ))}
              </div>

              {essaiCourse && <>
                <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--text2)",marginBottom:8}}>2. Choisir un jour</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
                  {DAYS.filter(d=>(club.schedule[d]||[]).length>0).map(d=>{
                    const todayJs=new Date();const todayMon=(todayJs.getDay()+6)%7;
                    const dayIdx2=DAYS.indexOf(d);
                    const diff2=((dayIdx2-todayMon)+7)%7||7;
                    const dt=new Date(todayJs);dt.setDate(todayJs.getDate()+(dayIdx2===todayMon?0:diff2));
                    return (
                      <button key={d} onClick={()=>{setEssaiDay(d);setEssaiTime((club.schedule[d]||[])[0]||null);}}
                        style={{padding:"7px 14px",borderRadius:100,border:`1.5px solid ${essaiDay===d?"var(--co)":"var(--border)"}`,background:essaiDay===d?"rgba(255,154,90,0.1)":"transparent",color:essaiDay===d?"var(--co)":"var(--text2)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"var(--font)",display:"flex",gap:5,alignItems:"center"}}>
                        {d} <span style={{opacity:.65,fontWeight:500}}>{dt.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
              </>}

              {essaiCourse && essaiDay && <>
                <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--text2)",marginBottom:8}}>3. Choisir une heure</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
                  {(club.schedule[essaiDay]||[]).map(t=>(
                    <button key={t} onClick={()=>setEssaiTime(t)}
                      style={{padding:"8px 16px",borderRadius:10,border:`1.5px solid ${essaiTime===t?"var(--co)":"var(--border)"}`,background:essaiTime===t?"rgba(255,154,90,0.12)":"transparent",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"var(--font)",color:essaiTime===t?"var(--co)":"var(--text)"}}>
                      {t}
                    </button>
                  ))}
                </div>
              </>}

              {essaiCourse && essaiDay && essaiTime && (
                <div style={{background:"rgba(255,154,90,0.07)",border:"1px solid rgba(255,154,90,0.25)",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:12,color:"var(--text2)"}}>
                  🎉 <strong style={{color:"var(--text)"}}>{essaiCourse.name}</strong> — {essaiDay} à {essaiTime} · {club.name}
                </div>
              )}

              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>{setEssaiPicker(false);setEssaiCourse(null);}} style={{flex:1,padding:12,border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text2)",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"var(--font)"}}>Annuler</button>
                <button onClick={()=>essaiCourse&&essaiDay&&essaiTime&&setEssaiConfirmed(true)}
                  style={{flex:2,padding:12,background:essaiCourse&&essaiDay&&essaiTime?"var(--co)":"var(--border)",color:essaiCourse&&essaiDay&&essaiTime?"#fff":"var(--text2)",border:"none",borderRadius:10,fontWeight:800,fontSize:13,cursor:essaiCourse&&essaiDay&&essaiTime?"pointer":"not-allowed",fontFamily:"var(--font)",transition:"all .2s"}}>
                  Confirmer mon essai gratuit
                </button>
              </div>
            </> : (
              <div style={{textAlign:"center",padding:"32px 0"}}>
                <div style={{fontSize:48,marginBottom:12}}>🎉</div>
                <div style={{fontSize:18,fontWeight:900,color:"var(--text)",marginBottom:8}}>Essai réservé !</div>
                <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.7,marginBottom:8}}>
                  <strong>{essaiCourse?.name}</strong> au <strong>{club.name}</strong>
                </div>
                <div style={{fontSize:13,color:"var(--co)",fontWeight:700,marginBottom:20}}>📅 {essaiDay} à {essaiTime}</div>
                <button onClick={()=>{setEssaiPicker(false);setEssaiCourse(null);setEssaiConfirmed(false);}} style={{padding:"11px 24px",background:"rgba(255,154,90,0.1)",border:"1.5px solid rgba(255,154,90,0.3)",color:"var(--co)",borderRadius:10,fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"var(--font)"}}>
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ FILTER DRAWER ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function FilterDrawer({ filters, onChange, onClose, resultCount }) {
  const [local, setLocal] = useState(filters);
  const set = (k,v) => setLocal(f=>({...f,[k]:v}));
  const toggleArr = (k,v) => setLocal(f=>({...f,[k]:f[k].includes(v)?f[k].filter(x=>x!==v):[...f[k],v]}));
  const activeCount = [
    local.sport!=="Tous", local.city!=="Toutes",
    local.indoor!==null,
    local.budget<500, local.levels.length>0, local.ambiance!==null,
    local.essaiGratuit, local.pmr, local.postPartum, local.womenOnly,
    local.parentEnfant, local.tarifEtudiant, local.tarifSenior, local.tarifFamille,
    local.coachPerso, local.abonnementMensuel, local.abonnementAnnuel
  ].filter(Boolean).length;

  return (
    <div className="drawer-ov" onClick={onClose}>
      <div className="drawer" onClick={e=>e.stopPropagation()}>
        <div className="dr-handle"/>
        <div className="dr-head">
          <div className="dr-title">Filtres {activeCount>0 && <span style={{color:"var(--co)",marginLeft:4}}>{activeCount}</span>}</div>
          <button className="dr-reset" onClick={()=>setLocal({sport:"Tous",city:"Toutes",budget:500,levels:[],ambiance:null,indoor:null,essaiGratuit:false,pmr:false,postPartum:false,womenOnly:false,parentEnfant:false,tarifEtudiant:false,tarifSenior:false,tarifFamille:false,coachPerso:false,abonnementMensuel:false,abonnementAnnuel:false})}>Réinitialiser</button>
        </div>
        <div className="fg">
          <div className="fgt">Sport</div>
          <div className="chips">{SPORTS.map(s=><button key={s} className={`chip${local.sport===s?" on":""}`} onClick={()=>set("sport",s)}>{s}</button>)}</div>
        </div>
        <div className="fg">
          <div className="fgt">Ville</div>
          <div className="chips">{CITIES.map(c=><button key={c} className={`chip${local.city===c?" on":""}`} onClick={()=>set("city",c)}>{c}</button>)}</div>
        </div>
        <div className="fg">
          <div className="fgt">Budget max · {local.budget===500?"Illimité":`${local.budget}€/mois`}</div>
          <div className="range-row"><span className="range-val">0€</span><span className="range-val">{local.budget===500?"∞":`${local.budget}€`}</span></div>
          <input type="range" min={0} max={500} step={10} value={local.budget} onChange={e=>set("budget",Number(e.target.value))}/>
        </div>
        <div className="fg">
          <div className="fgt">Niveau</div>
          <div className="cbs">{LEVELS_LIST.map(l=><label key={l} className="cb-item"><div className={`cb-box${local.levels.includes(l)?" on":""}`}>{local.levels.includes(l)&&"✓"}</div><span className="cb-lbl">{l}</span><input type="checkbox" style={{display:"none"}} onChange={()=>toggleArr("levels",l)}/></label>)}</div>
        </div>
        <div className="fg">
          <div className="fgt">Ambiance</div>
          <div className="chips">
            {["loisirs","performance","bien-être"].map(a=><button key={a} className={`chip${local.ambiance===a?" on":""}`} onClick={()=>set("ambiance",local.ambiance===a?null:a)} style={{textTransform:"capitalize"}}>{a==="loisirs"?"🎉":a==="performance"?"🏆":"☮️"} {a}</button>)}
          </div>
        </div>
        <div className="fg">
          <div className="fgt">Lieu</div>
          <div className="chips">
            <button className={`chip${local.indoor===true?" on":""}`} onClick={()=>set("indoor",local.indoor===true?null:true)}>🏠 En salle</button>
            <button className={`chip${local.indoor===false?" on":""}`} onClick={()=>set("indoor",local.indoor===false?null:false)}>🌳 En extérieur</button>
          </div>
        </div>
        <div className="fg">
          <div className="fgt">Tarifs spéciaux</div>
          <div className="chips">
            {[["essaiGratuit","✓ Essai gratuit"],["tarifEtudiant","🎓 Étudiant"],["tarifSenior","👴 Senior"],["tarifFamille","👨‍👩‍👧 Famille"]].map(([k,l])=>(
              <button key={k} className={`chip${local[k]?" on":""}`} onClick={()=>set(k,!local[k])}>{l}</button>
            ))}
          </div>
        </div>
        <div className="fg">
          <div className="fgt">Accessibilité & profil</div>
          {[["pmr","♿ PMR"],["postPartum","🤱 Post-partum"],["womenOnly","💜 Women Only"],["parentEnfant","👧 Parent/enfant"],["coachPerso","💪 Coach perso"]].map(([k,l])=>(
            <div key={k} className="toggle-row">
              <span className="toggle-lbl">{l}</span>
              <label className="toggle-wrap">
                <input type="checkbox" checked={local[k]} onChange={e=>set(k,e.target.checked)}/>
                <span className="tslider"/>
              </label>
            </div>
          ))}
        </div>
        <button className="dr-apply" onClick={()=>{onChange(local);onClose()}}>
          Voir {resultCount} club{resultCount>1?"s":""}
        </button>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ MAP VIEW ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function MapView({ clubs, onOpenClub }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (mapError) return;
    // Inject Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    // Inject Leaflet JS
    const initMap = () => {
      try {
        if (!mapRef.current || mapInstance.current) return;
        const L = window.L;
        if (!L) { setMapError(true); return; }
        const bounds = clubs.map(c => [c.lat, c.lng]);
        const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false });
        mapInstance.current = map;
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 19
        }).addTo(map);
        clubs.forEach(club => {
          const icon = L.divIcon({
            className: '',
            html: `<div style="background:${club.accentColor};color:#fff;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 10px rgba(0,0,0,0.25);border:2px solid #fff;cursor:pointer">${club.emoji}</div>`,
            iconSize: [38, 38],
            iconAnchor: [19, 19],
          });
          const marker = L.marker([club.lat, club.lng], { icon }).addTo(map);
          marker.bindPopup(`
            <div style="font-family:Montserrat,sans-serif;min-width:160px">
              <div style="font-size:13px;font-weight:800;margin-bottom:2px">${club.name}</div>
              <div style="font-size:11px;color:#6B7280;margin-bottom:6px">${club.city} · ${club.sport}</div>
              <div style="font-size:12px;font-weight:700;color:#1AC7C1;margin-bottom:6px">★ ${club.rating} · ${priceLabel(club)}</div>
              <button class="map-popup-btn" onclick="window.__clubbyOpen(${club.id})">Voir la fiche →</button>
            </div>
          `);
        });
        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [40, 40] });
        }
      } catch(e) { setMapError(true); }
    };

    window.__clubbyOpen = (id) => {
      const club = clubs.find(c => c.id === id);
      if (club) onOpenClub(club);
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      script.onerror = () => setMapError(true);
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [clubs, mapError]);

  if (mapError) {
    return (
      <div className="map-wrap" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,background:"var(--bg)",border:"1px dashed var(--border)",borderRadius:12,margin:"12px 16px"}}>
        <span style={{fontSize:32}}>🗺️</span>
        <div style={{fontSize:13,fontWeight:700,color:"var(--text2)"}}>Carte non disponible dans cet environnement</div>
        <div style={{fontSize:11,color:"var(--text2)"}}>{clubs.length} club{clubs.length>1?"s":""} disponibles en vue liste</div>
      </div>
    );
  }

  return (
    <div className="map-wrap">
      <div ref={mapRef} className="map-container"/>
      <div style={{position:"absolute",bottom:12,left:12,zIndex:500,background:"rgba(255,255,255,0.95)",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:700,color:"var(--text)",boxShadow:"0 2px 8px rgba(0,0,0,0.15)"}}>
        📍 {clubs.length} club{clubs.length>1?"s":""} sur la carte
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ CARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ClubCard({ club, isFav, onFav, onClick, index=0 }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className="club-card" onClick={onClick} style={{animationDelay:`${Math.min(index*60,400)}ms`}}>
      <div className="card-img">
        {imgOk
          ? <img src={club.image} alt={club.name} loading="lazy" onError={()=>setImgOk(false)}/>
          : <div style={{width:"100%",height:"100%",background:`linear-gradient(135deg,${club.accentColor}dd,${club.accentColor}88)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}><span style={{fontSize:56,filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.2))"}}>{club.emoji}</span><span style={{color:"rgba(255,255,255,0.9)",fontSize:13,fontWeight:700,letterSpacing:1}}>{(club.sport||"").toUpperCase()}</span></div>
        }
        <div className="card-img-ov"/>
        <div className="card-badges">
          <span className="badge b-sport">{club.emoji} {club.sport}</span>
          {club.type==="Association" && <span className="badge b-asso">Asso</span>}
          {club.indoor && <span className="badge b-indoor">Indoor</span>}
        </div>
        {club.essaiGratuit && <div className="b-essai">Essai gratuit ✓</div>}
        <div style={{position:"absolute",top:10,right:10,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,zIndex:3}}>
          <button className="b-fav" style={{position:"static"}} onClick={e=>{e.stopPropagation();onFav(club.id)}}>{isFav?"❤️":"🤍"}</button>
          {club.trendBadge && (
            <span className={`b-trend ${club.trendBadge==="Nouveau"?"new":club.trendBadge==="Populaire"?"popular":"trending"}`} style={{position:"static"}}>
              {club.trendBadge==="Nouveau"?"🆕":club.trendBadge==="Populaire"?"🔥":"📈"} {club.trendBadge}
            </span>
          )}
        </div>
        <div className="card-rating"><span className="star">★</span>{club.rating} <span style={{color:"var(--text2)",fontWeight:400}}>({club.reviews})</span></div>
      </div>
      <div className="card-body">
        <div className="card-labels">
          {club.labels.slice(0,3).map(l=><span key={l} className={`lpill ${labelColor(l)}`}>{l}</span>)}
        </div>
        <div className="card-name">{club.name}</div>
        <div className="card-loc">{club.city} · {club.arrondissement}</div>
        <div className="card-desc">{club.description}</div>
        <div className="card-feats">
          {club.features.slice(0,2).map(f=><span key={f} className="feat-tag">{f}</span>)}
        </div>
        <div className="card-footer">
          <div>
            <div className="card-price">{priceLabel(club)}</div>
            {club.priceCourse && club.type !== "Association" && (
              <div style={{fontSize:10,fontWeight:600,color:"var(--text2)",marginTop:1}}>
                à partir de {club.priceCourse}€/séance
              </div>
            )}
          </div>
          <div style={{display:"flex",gap:4}}>
            {club.levels.map(l=>(
              <div key={l} title={l} className="level-dot" style={{width:8,height:8,borderRadius:"50%",background:l==="Débutant"?"#1AC7C1":l==="Intermédiaire"?"#FF9A5A":l==="Avancé"?"#EF4444":"#9B5DE5"}}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ PROFILE PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ── Date helpers
const DAY_NAMES = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const DAY_FULL  = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const MONTH_NAMES = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

function getTodayIdx() { return new Date().getDay(); } // 0=Dim

// Is a planning item happening within 24h from now?
function isUrgent(item) {
  const todayIdx = new Date().getDay();
  const dayIdx = DAY_NAMES.indexOf(item.day);
  if (dayIdx < 0) return false;
  const now = new Date();
  const [h, m] = item.time.split(":").map(Number);
  const courseDate = new Date();
  courseDate.setDate(now.getDate() + ((dayIdx - todayIdx + 7) % 7));
  courseDate.setHours(h, m, 0, 0);
  const diff = courseDate - now;
  return diff >= 0 && diff < 24 * 60 * 60 * 1000;
}

// ── CalendarView component
function CalendarView({ planning, onCancelPlan, showToast }) {
  const [view, setView] = useState("semaine"); // "semaine" | "mois"
  const today = new Date();
  const todayDayIdx = today.getDay(); // 0=Dim

  // Build the current week (Mon → Sun)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((todayDayIdx + 6) % 7)); // Monday
  const weekDays = Array.from({length:7},(_,i)=>{
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate()+i);
    return d;
  });

  // Build current month grid
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month+1, 0);
  // start on Monday
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;
  const monthCells = Array.from({length:totalCells},(_,i)=>{
    const d = new Date(year, month, 1 - startOffset + i);
    return d;
  });

  // Map planning items to day abbreviations
  const getCoursesForDay = (date) => {
    const abbr = DAY_NAMES[date.getDay()];
    return planning.filter(p => p.day === abbr);
  };

  const isSameDay = (d1, d2) =>
    d1.getDate()===d2.getDate() && d1.getMonth()===d2.getMonth() && d1.getFullYear()===d2.getFullYear();

  return (
    <div>
      {/* Toggle */}
      <div className="cal-toggle">
        {["semaine","mois"].map(v=>(
          <button key={v} className={`cal-toggle-btn${view===v?" active":""}`} onClick={()=>setView(v)}>
            {v==="semaine"?"📅 Semaine":"🗓 Mois"}
          </button>
        ))}
      </div>

      {view==="semaine" && <>
        {/* Day headers */}
        <div className="cal-week">
          {weekDays.map((d,i)=>(
            <div key={i} className={`cal-day-head${isSameDay(d,today)?" today":""}`}>
              <div>{DAY_NAMES[d.getDay()]}</div>
              <div style={{fontSize:13,fontWeight:isSameDay(d,today)?900:600,color:isSameDay(d,today)?"var(--tq)":"var(--text)",marginTop:1}}>{d.getDate()}</div>
            </div>
          ))}
        </div>
        {/* Cells */}
        <div className="cal-week-cells">
          {weekDays.map((d,i)=>{
            const courses = getCoursesForDay(d);
            return (
              <div key={i} className={`cal-cell${isSameDay(d,today)?" today":""}${courses.length===0?" empty":""}`}>
                {courses.map((c,j)=>{
                  const urgent = isUrgent(c);
                  return (
                    <div key={j} className="cal-event" style={{background:urgent?"#EF4444":c.color}} title={`${c.courseName} — ${c.clubName}`}>
                      <div style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.emoji} {c.courseName}</div>
                      <div className="ev-time">{c.time}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div style={{marginTop:10,fontSize:11,color:"var(--text2)",display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:8,height:8,borderRadius:2,background:"var(--tq)",display:"inline-block"}}/>cours planifié
          <span style={{width:8,height:8,borderRadius:2,background:"#EF4444",display:"inline-block",marginLeft:8}}/>dans moins de 24h
        </div>
      </>}

      {view==="mois" && <>
        <div style={{textAlign:"center",fontSize:13,fontWeight:800,color:"var(--text)",marginBottom:10}}>
          {MONTH_NAMES[month]} {year}
        </div>
        <div className="cal-month-grid">
          {["L","M","M","J","V","S","D"].map((d,i)=>(
            <div key={i} className="cal-month-head">{d}</div>
          ))}
          {monthCells.map((d,i)=>{
            const isToday = isSameDay(d,today);
            const isOther = d.getMonth()!==month;
            const courses = getCoursesForDay(d);
            return (
              <div key={i} className={`cal-month-cell${isOther?" other-month":""}${isToday?" today-cell":""}`}>
                <div className={`cal-month-num${isToday?" today-num":""}`}>{d.getDate()}</div>
                <div className="cal-dot-wrap">
                  {courses.map((c,j)=>(
                    <div key={j} className="cal-mdot" style={{background:isUrgent(c)?"#EF4444":c.color}} title={c.courseName}/>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {planning.length>0 && <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:5}}>
          {planning.map((p,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:11,color:"var(--text2)"}}>
              <div style={{width:8,height:8,borderRadius:2,background:p.color,flexShrink:0}}/>
              <span style={{fontWeight:700,color:"var(--text)"}}>{p.day} {p.time}</span>
              <span>{p.emoji} {p.courseName}</span>
              <span style={{marginLeft:"auto",color:"var(--text2)"}}>{p.clubName}</span>
            </div>
          ))}
        </div>}
      </>}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ EDIT PROFILE MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function EditProfileModal({ userProfile, onSave, onClose }) {
  const [step, setStep] = useState(0);
  const total = 3;

  const [sports,    setSports]    = useState(userProfile?.sports || []);
  const [objective, setObjective] = useState(userProfile?.objective || null);
  const [freq,      setFreq]      = useState(userProfile?.freq || null);
  const [health,    setHealth]    = useState(userProfile?.health || []);

  const healthOptions = [
    {id:"pmr",      icon:"♿", label:"Accessibilité PMR",   sub:"Handicap moteur ou fauteuil roulant"},
    {id:"postPartum",icon:"🤱",label:"Post-partum",         sub:"Reprise après accouchement"},
    {id:"grossesse", icon:"🤰",label:"Grossesse",            sub:"Activité pendant la grossesse"},
    {id:"senior",    icon:"👴",label:"Senior (65+)",         sub:"Cours adaptés à mon âge"},
    {id:"none",      icon:"👍",label:"Aucune condition",     sub:"Je pratique sans contrainte particulière"},
  ];

  const toggleSport  = s => setSports(p => p.includes(s) ? p.filter(x=>x!==s) : [...p, s]);
  const toggleHealth = h => setHealth(p => p.includes(h) ? p.filter(x=>x!==h) : [...p, h]);

  const STEP_LABELS = ["Sport", "Objectif", "Fréquence & profil"];

  return (
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"var(--white)",zIndex:300,display:"flex",flexDirection:"column",fontFamily:"var(--font)"}}>
      {/* Header */}
      <div style={{position:"sticky",top:0,background:"var(--white)",borderBottom:"1px solid var(--border)",padding:"14px 20px",display:"flex",alignItems:"center",gap:12,zIndex:10}}>
        <button onClick={onClose} style={{width:36,height:36,borderRadius:10,border:"1.5px solid var(--border)",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,flexShrink:0}}>←</button>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:"var(--text)"}}>Personnaliser mon profil</div>
          <div style={{fontSize:11,color:"var(--text2)"}}>{STEP_LABELS[step]} · étape {step+1}/{total}</div>
        </div>
        {/* Progress */}
        <div style={{marginLeft:"auto",display:"flex",gap:5}}>
          {Array.from({length:total},(_,i)=>(
            <div key={i} style={{width:i===step?20:6,height:6,borderRadius:3,background:i<=step?"var(--tq)":"var(--border)",transition:"all .3s"}}/>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{flex:1,overflowY:"auto",padding:"28px 20px 120px"}}>

        {/* Step 0 — Sport */}
        {step===0 && <>
          <h2 className="ob-title">Quel sport te <em>correspond</em> ?</h2>
          <p className="ob-sub">Sélectionne un ou plusieurs sports.</p>
          <div className="ob-sports-grid">
            {ONBOARDING_SPORTS.map(s => {
              const parts=s.split(" "); const ico=parts.pop(); const nm=parts.join(" ");
              return (
                <button key={s} className={`ob-sport-btn${sports.includes(s)?" on":""}`} onClick={()=>toggleSport(s)}>
                  <span className="ob-sport-ico">{ico}</span>
                  <span className="ob-sport-name">{nm}</span>
                </button>
              );
            })}
          </div>
        </>}

        {/* Step 1 — Objectif */}
        {step===1 && <>
          <h2 className="ob-title">Quel est ton <em>objectif</em> ?</h2>
          <p className="ob-sub">On adapte les recommandations à ta motivation.</p>
          <div className="ob-obj-grid">
            {OBJECTIVES.map(o => (
              <button key={o.id} className={`ob-obj-btn${objective===o.id?" on":""}`} onClick={()=>setObjective(o.id)}>
                <span className="ob-obj-ico">{o.icon}</span>
                <span className="ob-obj-label">{o.label}</span>
              </button>
            ))}
          </div>
        </>}

        {/* Step 2 — Fréquence + profil */}
        {step===2 && <>
          <h2 className="ob-title">Combien de fois <em>par semaine</em> ?</h2>
          <p className="ob-sub">Ça nous aide à filtrer les clubs selon leur planning.</p>
          <div className="ob-freq-list" style={{marginBottom:28}}>
            {FREQ_OPTIONS.map(f => (
              <button key={f} className={`ob-freq-btn${freq===f?" on":""}`} onClick={()=>setFreq(f)}>{f}</button>
            ))}
          </div>
          <h2 className="ob-title" style={{fontSize:18}}>Profil <em>spécifique</em> ?</h2>
          <p className="ob-sub">Optionnel — on activera les filtres adaptés.</p>
          <div className="ob-health-list">
            {healthOptions.map(h => (
              <button key={h.id} className={`ob-health-btn${health.includes(h.id)?" on":""}`} onClick={()=>toggleHealth(h.id)}>
                <span className="ob-health-ico">{h.icon}</span>
                <div><div className="ob-health-label">{h.label}</div><div className="ob-health-sub">{h.sub}</div></div>
              </button>
            ))}
          </div>
        </>}
      </div>

      {/* Footer */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"var(--white)",borderTop:"1px solid var(--border)",padding:"14px 20px 28px",display:"flex",gap:10,justifyContent:"center"}}>
        <div style={{display:"flex",gap:10,width:"100%",maxWidth:520}}>
          {step>0 && <button className="ob-back" onClick={()=>setStep(s=>s-1)}>← Retour</button>}
          {step<total-1
            ? <button className="ob-next" style={{flex:1}} onClick={()=>setStep(s=>s+1)}>Suivant →</button>
            : <button className="ob-next" style={{flex:1}} onClick={()=>onSave({sports, objective, freq, health})}>
                ✅ Enregistrer mon profil
              </button>
          }
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ favs, history, planning, onToggleFav, onOpenClub, onCancelPlan, userProfile, showToast, ratings, onRate, onUpdateProfile }) {
  const favClubs = CLUBS.filter(c=>favs.includes(c.id));
  const weekdays = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  const weekProgress = planning.length;
  const streakDays = weekdays.map((d,i)=>({day:d,done:i<todayIdx,today:i===todayIdx}));
  const [ratingTarget, setRatingTarget] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false); // club history item

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar" style={{overflow:"hidden",padding:0}}>
          {userProfile?.avatar
            ? <img src={userProfile.avatar} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
            : <span>{userProfile?.prenom?.[0]?.toUpperCase()||"👤"}{userProfile?.nom?.[0]?.toUpperCase()||""}</span>
          }
        </div>
        <div>
          <div className="profile-name">
            {userProfile?.prenom ? `${userProfile.prenom}${userProfile.nom ? " "+userProfile.nom : ""}` : "Mon profil"}
          </div>
          <div className="profile-meta">
            {userProfile?.email && <span style={{display:"block"}}>📧 {userProfile.email}</span>}
            {userProfile?.objective ? userProfile.objective : "Objectif non défini"}{userProfile?.freq ? ` · ${userProfile.freq}` : ""}
          </div>
        </div>
        <button className="profile-edit" onClick={()=>setShowEditProfile(true)}>Modifier</button>
      </div>

      <div className="profile-section">
        <div className="ps-title">Ma progression cette semaine</div>
        <div className="progress-cards">
          <div className="prog-card">
            <div className="prog-num" style={{color:"var(--tq)"}}>{planning.length}</div>
            <div className="prog-lbl">Cours planifiés</div>
          </div>
          <div className="prog-card">
            <div className="prog-num" style={{color:"var(--co)"}}>{[...new Set(history.map(h=>h.id))].length}</div>
            <div className="prog-lbl">Clubs découverts</div>
          </div>
        </div>
        <div style={{background:"#fff",border:"1.5px solid var(--border)",borderRadius:12,padding:14,marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--text)"}}>🔥 Streak de la semaine</div>
            <div style={{fontSize:11,fontWeight:800,color:"var(--co)",background:"rgba(255,154,90,0.1)",border:"1px solid rgba(255,154,90,0.2)",borderRadius:100,padding:"3px 10px"}}>6 semaines consécutives 🏆</div>
          </div>
          <div className="streak-bar">
            {streakDays.map(({day,done,today})=>(
              <div key={day} className={`streak-dot${done?" done":today?" today":""}`} title={day}>{done?"✓":today?"▶":day.slice(0,1)}</div>
            ))}
          </div>
        </div>
        {planning.length>=3 && <div style={{background:"linear-gradient(135deg,var(--tq),#0fa8a3)",color:"#fff",borderRadius:12,padding:14,textAlign:"center"}}>
          <div style={{fontSize:18,marginBottom:4}}>🏆</div>
          <div style={{fontSize:14,fontWeight:800}}>Bravo ! {planning.length} cours planifiés cette semaine.</div>
          <div style={{fontSize:11,opacity:.85,marginTop:4}}>Continue comme ça, garde le rythme !</div>
        </div>}
      </div>

      <div className="profile-section" id="planning-section">
        {planning.length===0
          ? <div className="empty-illustrated">
              <div className="empty-illus-wrap">
                <div className="empty-illus-circle" style={{background:"rgba(26,199,193,0.08)"}}>📅</div>
                <div className="empty-illus-badge" style={{background:"rgba(26,199,193,0.15)"}}>✨</div>
              </div>
              <div className="empty-illus-title">Aucun cours planifié</div>
              <div className="empty-illus-sub">Explore les clubs et ajoute tes premiers cours pour construire ta semaine sportive.</div>
              <button className="empty-illus-btn" style={{background:"var(--tq)",color:"#fff"}} onClick={()=>{}}>Explorer les clubs</button>
            </div>
          : <>
            <CalendarView planning={planning} onCancelPlan={onCancelPlan} showToast={showToast}/>
            <div style={{marginTop:14}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--text2)",marginBottom:8}}>Liste des cours</div>
              <div className="planning-list">
                {planning.map((p,i)=>{
                  const urgent = isUrgent(p);
                  return (
                    <div key={i} className={`plan-item${urgent?" urgent":""}`}>
                      <div className="plan-dot" style={{background:urgent?"#EF4444":p.color}}/>
                      <div className="plan-time" style={{color:urgent?"#EF4444":"var(--tq)"}}>{p.time}</div>
                      <div>
                        <div className="plan-name">{p.courseName}</div>
                        <div className="plan-club">{p.emoji} {p.clubName} · {p.day}</div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,marginLeft:"auto"}}>
                        {urgent
                          ? <span className="plan-urgent-badge">⏰ Are you ready?</span>
                          : <span className="plan-badge">{p.day}</span>
                        }
                        <button className="plan-cancel" onClick={()=>{onCancelPlan(i);showToast("✓ Cours annulé")}}>Annuler</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        }
      </div>

      <div className="profile-section">
        <div className="ps-title">Mes favoris ({favClubs.length}) <span className="ps-link">Voir tout</span></div>
        {favClubs.length===0
          ? <div className="empty-illustrated">
              <div className="empty-illus-wrap">
                <div className="empty-illus-circle" style={{background:"rgba(255,154,90,0.08)"}}>❤️</div>
                <div className="empty-illus-badge" style={{background:"rgba(255,154,90,0.15)"}}>🔍</div>
              </div>
              <div className="empty-illus-title">Aucun favori</div>
              <div className="empty-illus-sub">Appuie sur ❤️ sur une fiche club pour le sauvegarder ici et le retrouver facilement.</div>
              <button className="empty-illus-btn" style={{background:"var(--co)",color:"#fff"}} onClick={()=>{}}>Découvrir des clubs</button>
            </div> :
        <div className="fav-grid">
          {favClubs.map(c=>(
            <div key={c.id} className="fav-card" onClick={()=>onOpenClub(c)}>
              <img src={c.image} alt={c.name} className="fav-img"/>
              <div>
                <div className="fav-name">{c.name}</div>
                <div className="fav-meta">{c.emoji} {c.sport} · {c.city}</div>
              </div>
              <button className="fav-remove" onClick={e=>{e.stopPropagation();onToggleFav(c.id);showToast("💔 Retiré des favoris")}}>✕</button>
            </div>
          ))}
        </div>}
      </div>

      <div className="profile-section">
        <div className="ps-title">Historique récent</div>
        <div className="history-list">
          {history.slice(0,5).map((h,i)=>{
            const rated = ratings?.[h.id];
            return (
              <div key={i} className="hist-item" style={{alignItems:"flex-start"}}>
                <div className="hist-emoji" onClick={()=>{const c=CLUBS.find(cl=>cl.id===h.id);if(c)onOpenClub(c)}}>{h.emoji}</div>
                <div style={{flex:1,minWidth:0}} onClick={()=>{const c=CLUBS.find(cl=>cl.id===h.id);if(c)onOpenClub(c)}}>
                  <div className="hist-name">{h.name}</div>
                  <div className="hist-meta">{h.city}</div>
                  {rated && <>
                    <div className="hist-rating">
                      {Array.from({length:5},(_,s)=>(
                        <span key={s} className="hist-star">{s<rated.stars?"⭐":"☆"}</span>
                      ))}
                    </div>
                    {rated.comment && <div className="hist-comment">"{rated.comment}"</div>}
                  </>}
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                  <div className="hist-ago">{h.ago}</div>
                  <button
                    onClick={e=>{e.stopPropagation();setRatingTarget(h)}}
                    style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:100,border:`1.5px solid ${rated?"rgba(26,199,193,0.3)":"var(--border)"}`,background:rated?"rgba(26,199,193,0.07)":"transparent",color:rated?"var(--tq)":"var(--text2)",cursor:"pointer",fontFamily:"var(--font)",whiteSpace:"nowrap"}}
                  >
                    {rated?"✏️ Modifier":"⭐ Noter"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {ratingTarget && (
        <RatingModal
          club={ratingTarget}
          existing={ratings?.[ratingTarget.id]}
          onSave={(stars, comment)=>{
            onRate(ratingTarget.id, stars, comment);
            setRatingTarget(null);
            showToast("⭐ Avis enregistré, merci !");
          }}
          onClose={()=>setRatingTarget(null)}
        />
      )}

      {showEditProfile && (
        <EditProfileModal
          userProfile={userProfile}
          onClose={()=>setShowEditProfile(false)}
          onSave={(updated)=>{
            onUpdateProfile(updated);
            setShowEditProfile(false);
            showToast("✅ Profil mis à jour !");
          }}
        />
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ RATING MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function RatingModal({ club, existing, onSave, onClose }) {
  const [stars, setStars]     = useState(existing?.stars || 0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(existing?.comment || "");

  return (
    <div className="rating-modal" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="rating-sheet">
        <h3>Votre avis sur {club.name}</h3>
        <div className="sub">{club.emoji} {club.city} · {club.ago}</div>

        {/* Stars */}
        <div className="stars-row">
          {Array.from({length:5},(_,i)=>(
            <button
              key={i}
              className="star-btn"
              onMouseEnter={()=>setHovered(i+1)}
              onMouseLeave={()=>setHovered(0)}
              onClick={()=>setStars(i+1)}
            >
              {i < (hovered||stars) ? "⭐" : "☆"}
            </button>
          ))}
        </div>
        {stars>0 && (
          <div style={{textAlign:"center",fontSize:12,fontWeight:700,color:"var(--tq)",marginBottom:16}}>
            {["","😕 Décevant","😐 Moyen","😊 Bien","😃 Très bien","🤩 Excellent !"][stars]}
          </div>
        )}

        {/* Comment */}
        <div style={{marginBottom:16}}>
          <label style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--text2)",marginBottom:6,display:"block"}}>
            Commentaire <span style={{textTransform:"none",letterSpacing:0,fontWeight:500}}>(optionnel)</span>
          </label>
          <textarea
            className="rating-textarea"
            placeholder="Ambiance, coachs, tarifs, installations… Partagez votre expérience !"
            value={comment}
            onChange={e=>setComment(e.target.value)}
            rows={3}
          />
        </div>

        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:12,border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text2)",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"var(--font)"}}>
            Annuler
          </button>
          <button
            onClick={()=>stars>0&&onSave(stars,comment)}
            style={{flex:2,padding:12,background:stars>0?"var(--tq)":"var(--border)",color:stars>0?"#fff":"var(--text2)",border:"none",borderRadius:10,fontWeight:800,fontSize:13,cursor:stars>0?"pointer":"not-allowed",fontFamily:"var(--font)",transition:"all .2s"}}
          >
            {existing?"Mettre à jour mon avis":"Publier mon avis"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ EMPTY STATE ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function EmptyState({ filters, searchQuery, onResetFilters, onResetSearch, onResetSport, onOpenClub, favs, onFav }) {
  const activeSport = filters.sport !== "Tous" ? filters.sport : null;
  const activeCity  = filters.city  !== "Toutes" ? filters.city : null;

  // Suggestions : même sport en priorité, puis même ville, puis populaires
  const sameSport = CLUBS.filter(c => activeSport && c.sport === activeSport).slice(0, 3);
  const sameCity  = CLUBS.filter(c => activeCity && c.city === activeCity && (!activeSport || c.sport !== activeSport)).slice(0, 3);

  const suggestions = sameSport.length >= 2
    ? sameSport.slice(0, 3)
    : [...sameSport, ...sameCity].slice(0, 3);

  // Si vraiment rien (sport introuvable), prendre des clubs populaires
  const fallback = suggestions.length > 0 ? suggestions : CLUBS.filter(c=>c.trendBadge==="Populaire").slice(0,3);

  const suggestionLabel = sameSport.length > 0
    ? `Autres clubs de ${activeSport} disponibles`
    : sameCity.length > 0
    ? `Clubs disponibles à ${activeCity}`
    : "Clubs populaires près de toi";

  const reasonText = searchQuery.trim()
    ? `"${searchQuery}"`
    : [activeSport, activeCity].filter(Boolean).join(" · ") || "ces critères";

  return (
    <div className="empty-smart">
      <div className="empty-smart-ico">🔍</div>
      <h3>Aucun club trouvé</h3>
      <p>Aucun résultat pour <strong>{reasonText}</strong>.<br/>Essaie d'ajuster ta recherche.</p>

      <div className="empty-actions">
        {searchQuery.trim() && (
          <button className="empty-action-btn primary" onClick={onResetSearch}>
            🗑 Effacer la recherche
          </button>
        )}
        {activeSport && (
          <button className="empty-action-btn primary" onClick={onResetSport}>
            🏅 Voir tous les sports
          </button>
        )}
        <button className="empty-action-btn secondary" onClick={onResetFilters}>
          ↺ Réinitialiser tous les filtres
        </button>
      </div>

      <div className="empty-similar-title">
        {suggestionLabel}
      </div>
      <div className="clubs-grid" style={{textAlign:"left"}}>
        {fallback.map(c=>(
          <ClubCard key={c.id} club={c} isFav={favs.includes(c.id)} onFav={onFav} onClick={()=>onOpenClub(c)}/>
        ))}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ PRO PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SLOT_COLORS = ["#1AC7C1","#FF9A5A","#9B5DE5","#22C55E","#EF4444","#3B82F6","#F59E0B"];
const DAY_ABBRS   = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

function ProPage({ showToast, onShowProLanding, clubProfile }) {
  const [proTab, setProTab]   = useState("dashboard"); // dashboard | messagerie | planning | fiche
  const [editing, setEditing] = useState(false);

  // ── Stats / chart
  const weekData = [
    {day:"Lun",val:48},{day:"Mar",val:32},{day:"Mer",val:65},{day:"Jeu",val:41},
    {day:"Ven",val:72},{day:"Sam",val:89},{day:"Dim",val:55}
  ];
  const maxVal = Math.max(...weekData.map(d=>d.val));
  const todayAbbr = DAY_ABBRS[(new Date().getDay()+6)%7]; // Mon=0

  // ── Messagerie
  const [leads, setLeads]         = useState(MOCK_LEADS);
  const [openMsg, setOpenMsg]     = useState(null);
  const [replyText, setReplyText] = useState("");

  const sendReply = (leadId) => {
    if (!replyText.trim()) return;
    setLeads(prev => prev.map(l => l.id===leadId
      ? {...l, status:"replied", conversation:[...l.conversation,{from:"us",text:replyText.trim()}], message:replyText.trim()}
      : l
    ));
    setReplyText("");
    showToast("✓ Message envoyé !");
  };

  const unreadCount = leads.filter(l=>l.status==="new").length;

  // ── Planning editor
  const [slots, setSlots] = useState([
    {id:1,day:"Lun",time:"09:00",name:"Cours collectif débutant",coach:"Marie",capacity:8,color:"#1AC7C1"},
    {id:2,day:"Mer",time:"18:00",name:"Perfectionnement",coach:"Marc",capacity:6,color:"#9B5DE5"},
    {id:3,day:"Ven",time:"12:00",name:"Cours intensif",coach:"Marie",capacity:4,color:"#FF9A5A"},
    {id:4,day:"Sam",time:"10:00",name:"Cours collectif tout niveau",coach:"Marc",capacity:10,color:"#22C55E"},
  ]);
  const [showSlotModal, setShowSlotModal]   = useState(false);
  const [editingSlot, setEditingSlot]       = useState(null); // null = new
  const [slotDay,  setSlotDay]              = useState("Lun");
  const [slotTime, setSlotTime]             = useState("09:00");
  const [slotName, setSlotName]             = useState("");
  const [slotCoach,setSlotCoach]            = useState("");
  const [slotCap,  setSlotCap]              = useState("8");
  const [slotColor,setSlotColor]            = useState(SLOT_COLORS[0]);

  const openNewSlot = (day) => {
    setEditingSlot(null);
    setSlotDay(day||"Lun"); setSlotTime("09:00"); setSlotName(""); setSlotCoach(""); setSlotCap("8"); setSlotColor(SLOT_COLORS[0]);
    setShowSlotModal(true);
  };
  const openEditSlot = (slot) => {
    setEditingSlot(slot.id);
    setSlotDay(slot.day); setSlotTime(slot.time); setSlotName(slot.name); setSlotCoach(slot.coach); setSlotCap(String(slot.capacity)); setSlotColor(slot.color);
    setShowSlotModal(true);
  };
  const saveSlot = () => {
    if (!slotName.trim()) return;
    if (editingSlot) {
      setSlots(prev=>prev.map(s=>s.id===editingSlot?{...s,day:slotDay,time:slotTime,name:slotName,coach:slotCoach,capacity:Number(slotCap),color:slotColor}:s));
      showToast("✓ Créneau mis à jour !");
    } else {
      setSlots(prev=>[...prev,{id:Date.now(),day:slotDay,time:slotTime,name:slotName,coach:slotCoach,capacity:Number(slotCap),color:slotColor}]);
      showToast("✓ Créneau ajouté !");
    }
    setShowSlotModal(false);
  };
  const deleteSlot = (id) => { setSlots(prev=>prev.filter(s=>s.id!==id)); showToast("Créneau supprimé"); setShowSlotModal(false); };

  return (
    <div className="pro-page">
      <div className="pro-header">
        <h2>Espace Club</h2>
        <p>{clubProfile?.clubName||"Tennis Club de Paris"} · Gérez votre club</p>
      </div>

      {/* Tabs */}
      <div className="pro-tabs">
        {[
          {id:"dashboard",  label:"📊 Stats"},
          {id:"messagerie", label:`💬 Messages${unreadCount>0?` (${unreadCount})`:""}` },
          {id:"planning",   label:"📅 Planning"},
          {id:"fiche",      label:"✏️ Fiche"},
          {id:"offre",      label:"🚀 Club Pro"},
        ].map(t=>(
          <button key={t.id} className={`pro-tab${proTab===t.id?" active":""}`} onClick={()=>setProTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD ── */}
      {proTab==="dashboard" && <>
        <div className="pro-stats">
          <div className="pro-stat"><div className="pro-stat-num">1 247</div><div className="pro-stat-lbl">Vues ce mois</div></div>
          <div className="pro-stat"><div className="pro-stat-num" style={{color:"var(--co)"}}>34</div><div className="pro-stat-lbl">Réservations de cours</div></div>
        </div>
        <div className="pro-section">
          <div className="pro-section-title">Visites cette semaine</div>
          <div className="pro-chart">
            <div className="chart-bars">
              {weekData.map(d=>(
                <div key={d.day} className="chart-bar-wrap">
                  <div className="chart-bar-val">{d.val}</div>
                  <div className="chart-bar" style={{height:`${(d.val/maxVal)*60}px`}}/>
                  <div className="chart-bar-lbl">{d.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {unreadCount>0 && (
          <div onClick={()=>setProTab("messagerie")} style={{display:"flex",alignItems:"center",gap:12,background:"rgba(26,199,193,0.06)",border:"1.5px solid rgba(26,199,193,0.25)",borderRadius:12,padding:"12px 16px",marginBottom:16,cursor:"pointer"}}>
            <span style={{fontSize:22}}>💬</span>
            <div><div style={{fontSize:13,fontWeight:700}}>Nouveaux messages</div><div style={{fontSize:11,color:"var(--text2)"}}>{unreadCount} demande{unreadCount>1?"s":""} en attente de réponse</div></div>
            <span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:"var(--tq)"}}>Voir →</span>
          </div>
        )}
      </>}

      {/* ── OFFRE PRO ── */}
      {proTab==="offre" && (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:300,textAlign:"center",padding:"20px 0"}}>
          <div style={{fontSize:56,marginBottom:20}}>🚀</div>
          <h3 style={{fontSize:22,fontWeight:900,marginBottom:10,color:"var(--text)"}}>Passez à la vitesse supérieure</h3>
          <p style={{fontSize:14,color:"var(--text2)",lineHeight:1.7,marginBottom:32,maxWidth:320}}>
            Réservations automatiques, statistiques avancées, mise en avant dans les résultats et bien plus encore.
          </p>
          <button className="btn-co" style={{width:"100%",maxWidth:320,padding:"16px 24px",fontSize:15,fontWeight:800}} onClick={onShowProLanding}>
            Découvrir l'offre Pro →
          </button>
          <p style={{fontSize:11,color:"var(--text2)",marginTop:16}}>Sans engagement · Activation en 48h</p>
        </div>
      )}

      {/* ── MESSAGERIE ── */}
      {proTab==="messagerie" && <>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700}}>{leads.length} conversation{leads.length>1?"s":""}</div>
          {unreadCount>0 && <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",background:"rgba(239,68,68,0.1)",color:"#EF4444",borderRadius:100}}>{unreadCount} non lus</span>}
        </div>
        <div className="msg-list">
          {leads.map(lead=>(
            <div key={lead.id} className={`msg-item${lead.status==="new"?" unread":""}`}>
              <div className="msg-header" onClick={()=>setOpenMsg(openMsg===lead.id?null:lead.id)}>
                <div className="msg-avatar">
                  {lead.initials}
                  {lead.status==="new" && <span className="msg-unread-dot"/>}
                </div>
                <div className="msg-info">
                  <div className="msg-name">{lead.name}</div>
                  <div className="msg-preview">🎾 {lead.sport} · {lead.message}</div>
                </div>
                <div className="msg-meta">
                  <div>{lead.time}</div>
                  <span className={`msg-status ${lead.status==="new"?"new":"replied"}`}>{lead.status==="new"?"Nouveau":"Répondu"}</span>
                </div>
              </div>
              {openMsg===lead.id && (
                <div className="msg-body">
                  <div className="msg-bubble-wrap">
                    {lead.conversation.map((msg,i)=>(
                      <div key={i} className={`msg-bubble ${msg.from==="us"?"us":"them"}`}>{msg.text}</div>
                    ))}
                  </div>
                  <div className="msg-reply-row">
                    <input
                      className="msg-reply-input"
                      placeholder="Écrire une réponse..."
                      value={openMsg===lead.id?replyText:""}
                      onChange={e=>setReplyText(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&sendReply(lead.id)}
                    />
                    <button className="msg-send-btn" onClick={()=>sendReply(lead.id)}>Envoyer</button>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
                    {["Bien reçu, je vous recontacte !","Oui, nous avons de la place 😊","Je vous réserve un créneau d'essai."].map(tmpl=>(
                      <button key={tmpl} onClick={()=>setReplyText(tmpl)} style={{fontSize:10,fontWeight:600,padding:"4px 10px",border:"1px solid var(--border)",borderRadius:100,background:"var(--bg)",color:"var(--text2)",cursor:"pointer",fontFamily:"var(--font)"}}>
                        {tmpl}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </>}

      {/* ── PLANNING EDITOR ── */}
      {proTab==="planning" && <>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700}}>{slots.length} créneau{slots.length>1?"x":""}</div>
          <button style={{fontSize:11,fontWeight:700,padding:"6px 14px",background:"var(--tq)",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"var(--font)"}} onClick={()=>openNewSlot()}>
            + Ajouter
          </button>
        </div>
        {/* Grid */}
        <div className="ped-grid">
          {DAY_ABBRS.map(day=>{
            const daySlots = slots.filter(s=>s.day===day);
            return (
              <div key={day} className="ped-day-col">
                <div className={`ped-day-head${day===todayAbbr?" today":""}`}>{day}</div>
                {daySlots.map(s=>(
                  <div key={s.id} className="ped-slot" style={{background:s.color}} onClick={()=>openEditSlot(s)} title={`${s.name} — ${s.time}`}>
                    <div>{s.time}</div>
                    <div style={{fontSize:8,opacity:.9,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name}</div>
                  </div>
                ))}
                <div className="ped-add" onClick={()=>openNewSlot(day)}>+</div>
              </div>
            );
          })}
        </div>
        {/* List */}
        <div style={{marginTop:4,display:"flex",flexDirection:"column",gap:8}}>
          {DAY_ABBRS.flatMap(day=>slots.filter(s=>s.day===day)).map(s=>(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,background:"var(--white)",border:"1.5px solid var(--border)",borderRadius:10,padding:"10px 12px",cursor:"pointer"}} onClick={()=>openEditSlot(s)}>
              <div style={{width:10,height:10,borderRadius:2,background:s.color,flexShrink:0}}/>
              <div style={{fontSize:12,fontWeight:800,color:"var(--tq)",minWidth:42}}>{s.time}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700}}>{s.name}</div>
                <div style={{fontSize:11,color:"var(--text2)"}}>👤 {s.coach||"—"} · 🎓 {s.capacity} places · {s.day}</div>
              </div>
              <span style={{fontSize:11,color:"var(--text2)"}}>✏️</span>
            </div>
          ))}
        </div>
      </>}

      {/* ── FICHE ── */}
      {proTab==="fiche" && <>
        <div className="pro-section">
          <div className="pro-section-title" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>Ma fiche club</span>
            <button style={{fontSize:11,fontWeight:700,padding:"4px 12px",background:editing?"var(--tq)":"var(--bg)",color:editing?"#fff":"var(--text2)",border:"1.5px solid var(--border)",borderRadius:6,cursor:"pointer"}} onClick={()=>setEditing(!editing)}>
              {editing?"✓ Enregistrer":"✏️ Modifier"}
            </button>
          </div>
          <div className="pro-edit-form">
            {[["Nom du club",clubProfile?.clubName||"Tennis Club de Paris"],["Sport",clubProfile?.sport||"Tennis"],["Adresse",clubProfile?.address||"12 Allée des Courts, 75016 Paris"],["Téléphone",clubProfile?.phone||"01 42 XX XX XX"],["Email",clubProfile?.email||"contact@tcparis.fr"]].map(([label,placeholder])=>(
              <div key={label} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" defaultValue={placeholder} readOnly={!editing} style={{background:editing?"var(--white)":"var(--bg)"}}/>
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" defaultValue="Club de tennis premium au cœur de Paris..." readOnly={!editing} style={{background:editing?"var(--white)":"var(--bg)"}}/>
            </div>
            {editing && <button className="dr-apply" onClick={()=>{setEditing(false);showToast("✓ Fiche mise à jour !")}}>Enregistrer les modifications</button>}
          </div>
        </div>
      </>}

      {/* ── SLOT MODAL ── */}
      {showSlotModal && (
        <div className="ped-modal" onClick={e=>{if(e.target===e.currentTarget)setShowSlotModal(false)}}>
          <div className="ped-sheet">
            <h3>{editingSlot?"Modifier le créneau":"Nouveau créneau"}</h3>
            <div className="ped-form-row">
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1,marginBottom:6,display:"block"}}>Jour</label>
                <select value={slotDay} onChange={e=>setSlotDay(e.target.value)} className="ped-input">
                  {DAY_ABBRS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1,marginBottom:6,display:"block"}}>Heure</label>
                <input type="time" value={slotTime} onChange={e=>setSlotTime(e.target.value)} className="ped-input"/>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:11,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1,marginBottom:6,display:"block"}}>Nom du cours *</label>
              <input value={slotName} onChange={e=>setSlotName(e.target.value)} placeholder="ex: Cours collectif débutant" className="ped-input"/>
            </div>
            <div className="ped-form-row">
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1,marginBottom:6,display:"block"}}>Coach</label>
                <input value={slotCoach} onChange={e=>setSlotCoach(e.target.value)} placeholder="ex: Marie" className="ped-input"/>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1,marginBottom:6,display:"block"}}>Places</label>
                <input type="number" value={slotCap} onChange={e=>setSlotCap(e.target.value)} min="1" className="ped-input"/>
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{fontSize:11,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1,marginBottom:8,display:"block"}}>Couleur</label>
              <div className="ped-colors">
                {SLOT_COLORS.map(c=>(
                  <div key={c} className={`ped-color${slotColor===c?" selected":""}`} style={{background:c}} onClick={()=>setSlotColor(c)}/>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              {editingSlot && <button onClick={()=>deleteSlot(editingSlot)} style={{padding:"12px 16px",border:"1.5px solid rgba(239,68,68,0.3)",background:"rgba(239,68,68,0.06)",color:"#EF4444",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"var(--font)"}}>Supprimer</button>}
              <button onClick={()=>setShowSlotModal(false)} style={{flex:1,padding:12,border:"1.5px solid var(--border)",background:"var(--bg)",color:"var(--text2)",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"var(--font)"}}>Annuler</button>
              <button onClick={saveSlot} style={{flex:2,padding:12,background:slotName.trim()?"var(--tq)":"var(--border)",color:slotName.trim()?"#fff":"var(--text2)",border:"none",borderRadius:10,fontWeight:800,fontSize:13,cursor:slotName.trim()?"pointer":"not-allowed",fontFamily:"var(--font)"}}>
                {editingSlot?"Mettre à jour":"Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ APP ━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ FILTER BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function FilterBar({ filters, setFilters, activeFiltersCount, onOpenDrawer, onResetFilters }) {
  const [openCat, setOpenCat] = useState(null);
  const toggle = (cat) => setOpenCat(c => c === cat ? null : cat);

  const catActive = {
    sport: filters.sport !== "Tous",
    ville: filters.city !== "Toutes",
    abonnement: filters.essaiGratuit || filters.tarifEtudiant || filters.tarifSenior || filters.tarifFamille || filters.abonnementMensuel || filters.abonnementAnnuel || filters.budget < 500,
    niveau: filters.coachPerso || filters.levels.length > 0,
    lieu: filters.indoor !== null,
    profil: filters.pmr || filters.postPartum || filters.womenOnly || filters.parentEnfant,
    ambiance: filters.ambiance !== null,
  };

  const CATS = [
    { id:"sport",      label:"🏅 Sport",           active: catActive.sport },
    { id:"ville",      label:"📍 Ville",            active: catActive.ville },
    { id:"abonnement", label:"💶 Tarifs",           active: catActive.abonnement },
    { id:"niveau",     label:"🎯 Niveau",           active: catActive.niveau },
    { id:"lieu",       label:"🏠 Lieu",             active: catActive.lieu },
    { id:"profil",     label:"👤 Profil spécifique",active: catActive.profil },
    { id:"ambiance",   label:"✨ Ambiance",         active: catActive.ambiance },
  ];

  return (
    <div style={{background:"#fff",borderBottom:"1px solid var(--border)",position:"relative"}}>
      {/* Pill bar */}
      <div style={{display:"flex",gap:6,padding:"10px 16px",overflowX:"auto",scrollbarWidth:"none",alignItems:"center"}}>
        <button className="filter-btn-sm" onClick={onOpenDrawer} style={{flexShrink:0,display:"flex",alignItems:"center",gap:5}}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="3" width="14" height="1.5" rx=".75"/><rect x="1" y="7.25" width="14" height="1.5" rx=".75"/><rect x="1" y="11.5" width="14" height="1.5" rx=".75"/><circle cx="5" cy="3.75" r="2" fill="currentColor"/><circle cx="11" cy="8" r="2" fill="currentColor"/><circle cx="6" cy="12.25" r="2" fill="currentColor"/></svg>
          {activeFiltersCount>0&&<span className="fcnt">{activeFiltersCount}</span>}
        </button>
        {activeFiltersCount>0 && (
          <button onClick={onResetFilters} style={{flexShrink:0,padding:"6px 12px",borderRadius:100,fontSize:11,fontWeight:700,background:"rgba(239,68,68,0.08)",border:"1.5px solid rgba(239,68,68,0.25)",color:"#EF4444",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"var(--font)"}}>
            ✕ Tout effacer
          </button>
        )}
        <div style={{width:"1px",height:24,background:"var(--border)",flexShrink:0,margin:"0 2px"}}/>
        {CATS.map(cat=>(
          <button key={cat.id}
            onClick={()=>toggle(cat.id)}
            style={{flexShrink:0,padding:"6px 14px",borderRadius:"100px",fontSize:12,fontWeight:700,
              background: cat.active ? "var(--tq)" : openCat===cat.id ? "var(--bg)" : "#fff",
              border: `1.5px solid ${cat.active ? "var(--tq)" : openCat===cat.id ? "var(--tq)" : "var(--border)"}`,
              color: cat.active ? "#fff" : openCat===cat.id ? "var(--tq)" : "var(--text2)",
              cursor:"pointer",transition:"all .18s",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"
            }}>
            {cat.label}
            <span style={{fontSize:10,opacity:.7,marginLeft:1}}>{openCat===cat.id?"▲":"▼"}</span>
          </button>
        ))}
      </div>

      {/* Dropdown panel */}
      {openCat && (
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",borderBottom:"2px solid var(--tq)",zIndex:150,padding:"12px 16px 16px",boxShadow:"0 8px 24px rgba(0,0,0,0.1)",animation:"fadeIn .15s ease"}}>

          {openCat==="sport" && <div>
            <div style={{fontSize:10,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Sport pratiqué</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {SPORTS.slice(1).map(s=>(
                <button key={s} className={`fchip${filters.sport===s?" active":""}`} onClick={()=>{setFilters(f=>({...f,sport:f.sport===s?"Tous":s}));setOpenCat(null);}}>{s}</button>
              ))}
            </div>
          </div>}

          {openCat==="ville" && <div>
            <div style={{fontSize:10,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Localisation</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {CITIES.slice(1).map(c=>(
                <button key={c} className={`fchip${filters.city===c?" active":""}`} onClick={()=>{setFilters(f=>({...f,city:f.city===c?"Toutes":c}));setOpenCat(null);}}>{c}</button>
              ))}
            </div>
          </div>}

          {openCat==="abonnement" && <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Tarifs & abonnements</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {[
                  ["essaiGratuit","✓ Essai gratuit"],
                  ["tarifEtudiant","🎓 Tarif étudiant"],
                  ["tarifSenior","👴 Tarif sénior"],
                  ["tarifFamille","👨‍👩‍👧 Tarif famille"],
                  ["abonnementMensuel","📅 Abonnement mensuel"],
                  ["abonnementAnnuel","📆 Abonnement annuel"],
                ].map(([k,l])=>(
                  <button key={k} className={`fchip${filters[k]?" active":""}`} onClick={()=>setFilters(f=>({...f,[k]:!f[k]}))}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Budget max · {filters.budget===500?"Illimité":`${filters.budget}€/mois`}</div>
              <input type="range" min={0} max={500} step={10} value={filters.budget} onChange={e=>setFilters(f=>({...f,budget:Number(e.target.value)}))} style={{width:"100%"}}/>
            </div>
          </div>}

          {openCat==="niveau" && <div>
            <div style={{fontSize:10,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Niveau & encadrement</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              <button className={`fchip${filters.coachPerso?" active":""}`} onClick={()=>setFilters(f=>({...f,coachPerso:!f.coachPerso}))}>💪 Coach perso</button>
              {LEVELS_LIST.map(l=>(
                <button key={l} className={`fchip${filters.levels.includes(l)?" active":""}`} onClick={()=>setFilters(f=>({...f,levels:f.levels.includes(l)?f.levels.filter(x=>x!==l):[...f.levels,l]}))}>{l}</button>
              ))}
            </div>
          </div>}

          {openCat==="lieu" && <div>
            <div style={{fontSize:10,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Type de lieu</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              <button className={`fchip${filters.indoor===true?" active":""}`} onClick={()=>setFilters(f=>({...f,indoor:f.indoor===true?null:true}))}>🏠 Indoor</button>
              <button className={`fchip${filters.indoor===false?" active":""}`} onClick={()=>setFilters(f=>({...f,indoor:f.indoor===false?null:false}))}>🌳 Outdoor</button>
            </div>
          </div>}

          {openCat==="profil" && <div>
            <div style={{fontSize:10,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Profil spécifique</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              <button className={`fchip${filters.pmr?" active":""}`} onClick={()=>setFilters(f=>({...f,pmr:!f.pmr}))}>♿ PMR</button>
              <button className={`fchip${filters.postPartum?" active":""}`} onClick={()=>setFilters(f=>({...f,postPartum:!f.postPartum}))}>🤱 Post-partum</button>
              <button className={`fchip${filters.womenOnly?" active":""}`} onClick={()=>setFilters(f=>({...f,womenOnly:!f.womenOnly}))}>💜 Women Only</button>
              <button className={`fchip${filters.parentEnfant?" active":""}`} onClick={()=>setFilters(f=>({...f,parentEnfant:!f.parentEnfant}))}>👧 Parent/enfant</button>
            </div>
          </div>}

          {openCat==="ambiance" && <div>
            <div style={{fontSize:10,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Ambiance du club</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {[["loisirs","🎉 Loisirs"],["performance","🏆 Performance"],["bien-être","☮️ Bien-être"]].map(([val,lbl])=>(
                <button key={val} className={`fchip${filters.ambiance===val?" active":""}`} onClick={()=>{setFilters(f=>({...f,ambiance:f.ambiance===val?null:val}));setOpenCat(null);}}>{lbl}</button>
              ))}
            </div>
          </div>}

          <button onClick={()=>setOpenCat(null)} style={{position:"absolute",top:10,right:12,background:"none",border:"none",fontSize:16,cursor:"pointer",color:"var(--text2)"}}>✕</button>
        </div>
      )}
    </div>
  );
}

const DEFAULT_FILTERS = { sport:"Tous", city:"Toutes", budget:500, levels:[], ambiance:null, indoor:null, essaiGratuit:false, pmr:false, postPartum:false, womenOnly:false, parentEnfant:false, tarifEtudiant:false, tarifSenior:false, tarifFamille:false, coachPerso:false, abonnementMensuel:false, abonnementAnnuel:false };

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ PRO LANDING ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ProLanding({ onClose }) {
  const [formSent, setFormSent] = useState(false);
  const [fPrenom, setFPrenom] = useState("");
  const [fNom, setFNom] = useState("");
  const [fClub, setFClub] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fTel, setFTel] = useState("");
  const [fSport, setFSport] = useState("");
  const [fMsg, setFMsg] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const submit = () => {
    if(!fPrenom.trim()||!fEmail.trim()||!fClub.trim()){alert("Merci de remplir prénom, email et nom du club.");return;}
    setFormSent(true);
  };

  const PAINS = [
    {ico:"🔍",title:"Invisible en ligne",desc:"Votre fiche Google est incomplète, votre site pas à jour, et les sportifs vous passent à côté sans le savoir."},
    {ico:"📵",title:"Des appels manqués",desc:"Les gens appellent, tombent sur répondeur, et finissent chez le concurrent qui répond instantanément en ligne."},
    {ico:"📊",title:"Zéro visibilité sur vos données",desc:"Combien de vues ce mois ? Quels cours attirent le plus ? Vous pilotez à l'aveugle."},
    {ico:"🏃",title:"Des places qui restent vides",desc:"Des créneaux non remplis = charges fixes non amorties, coach sous-utilisé, revenus perdus."},
  ];

  const FEATS = [
    {ico:"🎯",title:"Fiche enrichie & optimisée SEO",desc:"Photos, cours, coachs, horaires, avis. Référencée sur Clubby et Google. Les sportifs vous trouvent, enfin."},
    {ico:"📲",title:"Demandes d'essais en temps réel",desc:"Les sportifs demandent un essai directement depuis Clubby. Vous recevez leurs coordonnées instantanément."},
    {ico:"📈",title:"Tableau de bord & statistiques",desc:"Vues, clics, demandes, taux de conversion — tout en un coup d'œil pour piloter votre développement."},
    {ico:"🔔",title:"Alertes places libérées",desc:"Un sportif en liste d'attente est notifié automatiquement dès qu'une place se libère."},
    {ico:"⭐",title:"Avis vérifiés & réputation",desc:"Collectez des avis authentiques. La preuve sociale qui convainc les indécis de franchir la porte."},
  ];

  const TESTIS = [
    {stars:5,quote:"En 2 mois, on a eu 23 demandes d'essais supplémentaires. Avant Clubby, on comptait sur le bouche-à-oreille uniquement.",name:"Marc C.",role:"Directeur, Tennis Club Paris 16e",tag:"+23 essais",color:"#1AC7C1"},
    {stars:5,quote:"Notre taux de remplissage est passé de 62% à 91% en 3 mois. L'investissement est remboursé en quelques semaines.",name:"Amélie L.",role:"Gérante, Zen Yoga Studio Paris",tag:"91% rempli",color:"#9B5DE5"},
    {stars:4,quote:"Le tableau de bord nous a permis de réaliser que notre cours du mercredi était sous-communiqué. On l'a mis en avant et il est complet.",name:"Jamal D.",role:"Entraîneur, Boxing Gym Montreuil",tag:"Cours complet",color:"#EF4444"},
  ];

  const FAQS = [
    {q:"Comment fonctionne l'essai gratuit ?",a:"Votre fiche de base est créée gratuitement et reste visible indéfiniment. Passez à Pro à tout moment pour débloquer les demandes d'essais, les stats et la mise en avant. Aucune carte bancaire requise pour commencer."},
    {q:"Combien de temps faut-il pour être en ligne ?",a:"Après notre échange de démo, votre fiche est activée sous 48h. Notre équipe configure tout : photos, cours, horaires. Vous validez et c'est en ligne."},
    {q:"Est-ce que je gère les réservations moi-même ?",a:"Clubby gère la mise en relation : vous recevez les coordonnées du sportif intéressé, et vous le recontactez selon votre process. Vous gardez le contrôle total de vos inscriptions."},
    {q:"Y a-t-il un engagement de durée ?",a:"Non, Clubby Pro est sans engagement. Résiliation à tout moment depuis votre espace Pro ou en contactant notre équipe. Aucun frais."},
  ];

  const pl = {
    wrap:{position:"fixed",top:0,left:0,right:0,bottom:0,width:"100%",height:"100%",zIndex:9999,background:"#0B0F1A",overflowY:"auto",fontFamily:"'Montserrat',sans-serif",color:"#F8FAFC"},
    nav:{position:"sticky",top:0,background:"rgba(11,15,26,0.95)",backdropFilter:"blur(20px)",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.07)",zIndex:10},
    logo:{fontSize:20,fontWeight:900,display:"flex",alignItems:"center",gap:6},
    dot:{width:7,height:7,background:"#FF9A5A",borderRadius:"50%"},
    close:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",color:"#94A3B8",padding:"8px 18px",borderRadius:100,fontSize:13,fontWeight:700,cursor:"pointer"},
    section:{maxWidth:960,margin:"0 auto",padding:"64px 24px"},
    eyebrow:{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(26,199,193,0.1)",border:"1px solid rgba(26,199,193,0.25)",color:"#1AC7C1",borderRadius:100,padding:"5px 14px",fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:20},
    h1:{fontSize:"clamp(32px,5vw,58px)",fontWeight:900,lineHeight:1.07,marginBottom:20},
    sub:{fontSize:16,color:"#94A3B8",lineHeight:1.7,marginBottom:32,maxWidth:500},
    btnPrimary:{background:"linear-gradient(135deg,#1AC7C1,#14a09b)",color:"#fff",padding:"14px 28px",borderRadius:12,fontSize:14,fontWeight:800,border:"none",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8},
    sectionLabel:{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#1AC7C1",marginBottom:12},
    h2:{fontSize:"clamp(24px,3vw,38px)",fontWeight:900,lineHeight:1.15,marginBottom:12},
    card:{background:"#141927",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:22},
    tqText:{color:"#1AC7C1",fontStyle:"normal"},
    coText:{color:"#FF9A5A"},
  };

  const scrollToForm = () => { document.getElementById("pl-form")?.scrollIntoView({behavior:"smooth"}); };

  return (
    <div style={pl.wrap}>
      {/* NAV */}
      <div style={pl.nav}>
        <div style={pl.logo}><span style={{color:"#1AC7C1"}}>Clubby</span><div style={pl.dot}/><span style={{fontSize:13,fontWeight:600,color:"#64748B",marginLeft:4}}>Pro</span></div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <a href="#pl-form" onClick={e=>{e.preventDefault();scrollToForm();}} style={{color:"#94A3B8",fontSize:13,fontWeight:600,textDecoration:"none"}}>Contact</a>
          <button style={pl.close} onClick={onClose}>← Retour à l'espace club</button>
        </div>
      </div>

      {/* HERO */}
      <div style={{...pl.section, paddingTop:80, paddingBottom:72, position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute",top:-100,right:-80,width:500,height:500,background:"radial-gradient(circle,rgba(26,199,193,0.1) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-150,left:-60,width:400,height:400,background:"radial-gradient(circle,rgba(255,154,90,0.07) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:620}}>
          <div style={pl.eyebrow}><span style={{width:6,height:6,background:"#1AC7C1",borderRadius:"50%",display:"inline-block"}}/>Pour les clubs &amp; assos sportifs IDF</div>
          <h1 style={pl.h1}>Remplissez vos cours.<br/><em style={pl.tqText}>Développez votre club.</em></h1>
          <p style={pl.sub}>Clubby connecte votre club aux sportifs qui cherchent exactement ce que vous proposez. Visibilité, demandes d'essais, statistiques — tout au même endroit.</p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button style={pl.btnPrimary} onClick={scrollToForm}>🚀 Demander une démo gratuite</button>
            <button style={{background:"rgba(255,255,255,0.06)",color:"#F8FAFC",padding:"14px 24px",borderRadius:12,fontSize:14,fontWeight:700,border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer"}} onClick={()=>document.getElementById("pl-solution")?.scrollIntoView({behavior:"smooth"})}>Voir comment ça marche</button>
          </div>
          <div style={{marginTop:36,display:"flex",alignItems:"center",gap:14}}>
            <div style={{display:"flex"}}>
              {["#1AC7C1","#FF9A5A","#9B5DE5","#EF4444"].map((c,i)=>(
                <div key={i} style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${c},${c}aa)`,border:"2px solid #0B0F1A",marginLeft:i===0?0:-8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff"}}>
                  {["MC","AL","JD","SL"][i]}
                </div>
              ))}
            </div>
            <span style={{fontSize:13,color:"#94A3B8"}}><strong style={{color:"#F8FAFC"}}>+40 clubs</strong> nous font déjà confiance</span>
          </div>
        </div>
      </div>

      {/* PAIN */}
      <div style={{...pl.section,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={pl.sectionLabel}>Le problème</div>
        <h2 style={pl.h2}>Vos cours sont trop souvent <em style={pl.coText}>à moitié vides</em>.</h2>
        <p style={{...pl.sub,marginBottom:36}}>Pas par manque de qualité — mais parce que les sportifs ne vous trouvent pas.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
          {PAINS.map(p=>(
            <div key={p.title} style={{...pl.card,borderTop:"2px solid rgba(255,154,90,0.4)"}}>
              <span style={{fontSize:26,marginBottom:12,display:"block"}}>{p.ico}</span>
              <div style={{fontSize:14,fontWeight:800,marginBottom:6}}>{p.title}</div>
              <div style={{fontSize:12,color:"#94A3B8",lineHeight:1.6}}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SOLUTION */}
      <div id="pl-solution" style={{...pl.section,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={pl.sectionLabel}>La solution</div>
        <h2 style={pl.h2}>Clubby Pro : votre club en <em style={pl.tqText}>mode turbo</em>.</h2>
        <div style={{display:"flex",flexDirection:"column",gap:20,marginTop:36}}>
          {FEATS.map(f=>(
            <div key={f.title} style={{...pl.card,display:"flex",gap:16,alignItems:"flex-start"}}>
              <div style={{width:44,height:44,borderRadius:12,background:"rgba(26,199,193,0.1)",border:"1px solid rgba(26,199,193,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{f.ico}</div>
              <div><div style={{fontSize:14,fontWeight:800,marginBottom:4}}>{f.title}</div><div style={{fontSize:13,color:"#94A3B8",lineHeight:1.6}}>{f.desc}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS BAND */}
      <div style={{background:"linear-gradient(135deg,rgba(26,199,193,0.07),rgba(255,154,90,0.05))",borderTop:"1px solid rgba(255,255,255,0.06)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"48px 24px"}}>
        <div style={{maxWidth:960,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:24,textAlign:"center"}}>
          {[["300+","Clubs référencés","en Île-de-France"],["18k","Sportifs actifs","cherchent chaque mois"],["+34%","De remplissage","en moyenne après 3 mois"],["48h","Délai d'activation","fiche en ligne"]].map(([n,l,s])=>(
            <div key={l}><div style={{fontSize:42,fontWeight:900,color:"#1AC7C1",lineHeight:1}}>{n}</div><div style={{fontSize:13,color:"#94A3B8",fontWeight:600,marginTop:6}}>{l}</div><div style={{fontSize:11,color:"#64748B",marginTop:2}}>{s}</div></div>
          ))}
        </div>
      </div>

      {/* CALENDAR SYNC */}
      <div style={{...pl.section,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={pl.sectionLabel}>Intégration</div>
        <h2 style={{...pl.h2,marginBottom:8}}>Synchronisez votre calendrier <em style={pl.tqText}>avec le nôtre.</em></h2>
        <p style={{color:"#94A3B8",fontSize:14,marginBottom:32,lineHeight:1.7}}>Connectez votre planning existant à Clubby Pro en un clic. Vos créneaux se mettent à jour automatiquement — plus de double saisie, plus d'erreurs.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
          {[
            {ico:"📅",label:"Google Calendar",sub:"Synchronisation en temps réel"},
            {ico:"🍎",label:"Apple Calendar",sub:"Compatible iPhone & Mac"},
            {ico:"🔵",label:"Outlook / Teams",sub:"Pour les structures en entreprise"},
            {ico:"🔗",label:"Lien iCal universel",sub:"Compatible avec tous les outils"},
          ].map(c=>(
            <div key={c.label} style={{...pl.card,display:"flex",gap:14,alignItems:"center"}}>
              <span style={{fontSize:28,flexShrink:0}}>{c.ico}</span>
              <div>
                <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{c.label}</div>
                <div style={{fontSize:11,color:"#64748B"}}>{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{...pl.section,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{...pl.sectionLabel,textAlign:"center"}}>Tarifs</div>
        <h2 style={{...pl.h2,textAlign:"center",marginBottom:8}}>Simple et transparent.</h2>
        <p style={{textAlign:"center",color:"#94A3B8",fontSize:14,marginBottom:44}}>Commencez gratuitement, passez en Pro quand vous êtes prêt.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,maxWidth:720,margin:"0 auto"}}>
          {/* FREE */}
          <div style={pl.card}>
            <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:"#64748B",marginBottom:8}}>Gratuit</div>
            <div style={{fontSize:44,fontWeight:900,lineHeight:1,marginBottom:6}}><sup style={{fontSize:20,color:"#64748B"}}>€</sup>0<sub style={{fontSize:13,fontWeight:500,color:"#64748B"}}>/mois</sub></div>
            <div style={{fontSize:12,color:"#94A3B8",marginBottom:20,paddingBottom:20,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>Pour être visible et tester Clubby.</div>
            {["Fiche club basique","Visible dans les résultats","Coordonnées affichées","Horaires & description"].map(f=><div key={f} style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,fontSize:12}}><span style={{width:16,height:16,borderRadius:"50%",background:"rgba(26,199,193,0.15)",color:"#1AC7C1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,flexShrink:0}}>✓</span>{f}</div>)}
            {["Demandes d'essais directes","Statistiques avancées","Mise en avant"].map(f=><div key={f} style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,fontSize:12,opacity:.4}}><span style={{width:16,height:16,borderRadius:"50%",background:"rgba(100,116,139,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,flexShrink:0}}>✗</span>{f}</div>)}
            <button style={{width:"100%",padding:13,borderRadius:10,fontSize:13,fontWeight:800,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.05)",color:"#F8FAFC",cursor:"pointer",marginTop:10}} onClick={scrollToForm}>Commencer gratuitement</button>
          </div>
          {/* PRO */}
          <div style={{...pl.card,border:"1px solid rgba(26,199,193,0.4)",background:"linear-gradient(145deg,#141927,rgba(26,199,193,0.04))",position:"relative"}}>
            <div style={{position:"absolute",top:14,right:14,background:"linear-gradient(135deg,#1AC7C1,#14a09b)",color:"#fff",fontSize:9,fontWeight:800,letterSpacing:1,padding:"3px 9px",borderRadius:100}}>⚡ POPULAIRE</div>
            <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:"#64748B",marginBottom:8}}>Pro</div>
            <div style={{fontSize:44,fontWeight:900,lineHeight:1,marginBottom:6,color:"#1AC7C1"}}><sup style={{fontSize:20,color:"#64748B"}}>€</sup>49<sub style={{fontSize:13,fontWeight:500,color:"#64748B"}}>/mois</sub></div>
            <div style={{fontSize:12,color:"#94A3B8",marginBottom:20,paddingBottom:20,borderBottom:"1px solid rgba(255,255,255,0.07)"}}>Tout pour remplir vos cours.</div>
            {["Tout du plan Gratuit","Fiche enrichie (photos, cours, coachs)","Demandes d'essais en temps réel","Tableau de bord & statistiques","Mise en avant dans les résultats","Gestion des avis vérifiés","Alertes places libérées","Synchronisation de votre calendrier","Support dédié inclus"].map(f=><div key={f} style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,fontSize:12}}><span style={{width:16,height:16,borderRadius:"50%",background:"rgba(26,199,193,0.15)",color:"#1AC7C1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,flexShrink:0}}>✓</span>{f}</div>)}
            <button style={{width:"100%",padding:13,borderRadius:10,fontSize:13,fontWeight:800,border:"none",background:"linear-gradient(135deg,#1AC7C1,#14a09b)",color:"#fff",cursor:"pointer",marginTop:10}} onClick={scrollToForm}>Contacter l'équipe →</button>
          </div>
        </div>
        <p style={{textAlign:"center",fontSize:11,color:"#475569",marginTop:18}}>🔒 Sans engagement · Résiliation à tout moment · Fiche activée en 48h</p>
      </div>

      {/* TESTIMONIALS */}
      <div style={{...pl.section,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={pl.sectionLabel}>Témoignages</div>
        <h2 style={{...pl.h2,marginBottom:32}}>Ils l'ont fait. <em style={pl.tqText}>Résultats concrets.</em></h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
          {TESTIS.map(t=>(
            <div key={t.name} style={pl.card}>
              <div style={{color:"#FFC107",fontSize:13,letterSpacing:2,marginBottom:12}}>{"★".repeat(t.stars)}{"☆".repeat(5-t.stars)}</div>
              <div style={{fontSize:13,color:"#E2E8F0",lineHeight:1.7,marginBottom:16,fontStyle:"italic"}}>"{t.quote}"</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${t.color},${t.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:800,flexShrink:0}}>{t.name.split(" ").map(x=>x[0]).join("")}</div>
                <div><div style={{fontSize:12,fontWeight:700}}>{t.name}</div><div style={{fontSize:10,color:"#64748B",marginTop:1}}>{t.role}</div></div>
                <div style={{marginLeft:"auto",background:"rgba(26,199,193,0.1)",color:"#1AC7C1",borderRadius:100,padding:"3px 9px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>{t.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT FORM */}
      <div id="pl-form" style={{...pl.section,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{...pl.sectionLabel,textAlign:"center"}}>Contact</div>
        <h2 style={{...pl.h2,textAlign:"center",marginBottom:8}}>Prêt à remplir <em style={pl.tqText}>vos cours</em> ?</h2>
        <p style={{textAlign:"center",color:"#94A3B8",fontSize:14,marginBottom:40}}>Notre équipe vous répond sous 24h avec une démo personnalisée.</p>
        <div style={{...pl.card,maxWidth:640,margin:"0 auto"}}>
          {!formSent ? <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              {[["Prénom *",fPrenom,setFPrenom,"ex: Sophie","text"],["Nom",fNom,setFNom,"ex: Martin","text"]].map(([lbl,val,set,ph,t])=>(
                <div key={lbl}><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#64748B",marginBottom:5}}>{lbl}</div>
                <input value={val} onChange={e=>set(e.target.value)} placeholder={ph} type={t} style={{width:"100%",background:"#1e2535",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"10px 12px",fontSize:13,color:"#F8FAFC",fontFamily:"inherit",outline:"none"}}/></div>
              ))}
            </div>
            {[["Nom du club *",fClub,setFClub,"ex: Tennis Club de Paris","text"],["Email professionnel *",fEmail,setFEmail,"vous@monclub.fr","email"],["Téléphone",fTel,setFTel,"06 XX XX XX XX","tel"]].map(([lbl,val,set,ph,t])=>(
              <div key={lbl} style={{marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#64748B",marginBottom:5}}>{lbl}</div>
                <input value={val} onChange={e=>set(e.target.value)} placeholder={ph} type={t} style={{width:"100%",background:"#1e2535",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"10px 12px",fontSize:13,color:"#F8FAFC",fontFamily:"inherit",outline:"none"}}/>
              </div>
            ))}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#64748B",marginBottom:5}}>Votre besoin principal</div>
              <textarea value={fMsg} onChange={e=>setFMsg(e.target.value)} placeholder="Ex: On a des créneaux vides, on manque de visibilité..." style={{width:"100%",background:"#1e2535",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"10px 12px",fontSize:13,color:"#F8FAFC",fontFamily:"inherit",outline:"none",resize:"vertical",minHeight:80}}/>
            </div>
            <button onClick={submit} style={{width:"100%",padding:15,background:"linear-gradient(135deg,#1AC7C1,#14a09b)",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              🚀 Envoyer ma demande de démo
            </button>
            <p style={{textAlign:"center",fontSize:11,color:"#475569",marginTop:10}}>🔒 Vos données sont confidentielles. Pas de spam.</p>
          </> : (
            <div style={{textAlign:"center",padding:"32px 0"}}>
              <div style={{fontSize:48,marginBottom:12}}>🎉</div>
              <div style={{fontSize:18,fontWeight:800,color:"#1AC7C1",marginBottom:8}}>Demande envoyée !</div>
              <div style={{fontSize:13,color:"#94A3B8",lineHeight:1.7}}>Notre équipe vous contacte sous 24h pour organiser votre démo personnalisée.<br/>On a hâte de vous montrer ce que Clubby peut faire pour votre club !</div>
              <button onClick={onClose} style={{marginTop:24,padding:"12px 28px",background:"rgba(26,199,193,0.1)",border:"1px solid rgba(26,199,193,0.3)",color:"#1AC7C1",borderRadius:10,fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>← Retour à l'espace club</button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{background:"#141927",borderTop:"1px solid rgba(255,255,255,0.06)",padding:"28px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div style={{fontSize:18,fontWeight:900}}><span style={{color:"#1AC7C1"}}>Clubby</span> Pro</div>
        <div style={{display:"flex",gap:20}}>
          {["Conditions","Confidentialité","pro@clubby.fr"].map(l=><span key={l} style={{fontSize:12,color:"#64748B",cursor:"pointer"}}>{l}</span>)}
        </div>
        <div style={{fontSize:11,color:"#475569"}}>© 2025 Clubby — Île-de-France</div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ CONTACT CLUBBY ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ContactClubby({ onClose, clubProfile }) {
  const [prenom,  setPrenom]  = useState(clubProfile?.contactPrenom||"");
  const [nom,     setNom]     = useState(clubProfile?.contactNom||"");
  const [club,    setClub]    = useState(clubProfile?.clubName||"");
  const [email,   setEmail]   = useState(clubProfile?.email||"");
  const [tel,     setTel]     = useState(clubProfile?.phone||"");
  const [sujet,   setSujet]   = useState("");
  const [msg,     setMsg]     = useState("");
  const [sent,    setSent]    = useState(false);

  const SUJETS = ["Question sur mon offre","Problème technique","Demande de démo","Facturation","Autre"];

  const inp = {
    width:"100%", background:"var(--bg)", border:"1.5px solid var(--border)",
    borderRadius:10, padding:"11px 14px", fontSize:13, color:"var(--text)",
    fontFamily:"var(--font)", outline:"none", boxSizing:"border-box", transition:"border-color .2s"
  };
  const lbl = {fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--text2)",marginBottom:5,display:"block"};

  return (
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"var(--white)",zIndex:300,overflowY:"auto",fontFamily:"var(--font)"}}>
      {/* Header */}
      <div style={{position:"sticky",top:0,background:"var(--white)",borderBottom:"1px solid var(--border)",padding:"14px 20px",display:"flex",alignItems:"center",gap:12,zIndex:10,backdropFilter:"blur(12px)"}}>
        <button onClick={onClose} style={{width:36,height:36,borderRadius:10,border:"1.5px solid var(--border)",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,flexShrink:0}}>←</button>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:"var(--text)"}}>Contacter Clubby</div>
          <div style={{fontSize:11,color:"var(--text2)"}}>Notre équipe répond sous 24h ouvrées</div>
        </div>
        <div style={{marginLeft:"auto",fontSize:20,fontWeight:900,color:"var(--tq)"}}>Clubby</div>
      </div>

      <div style={{padding:"28px 20px 60px",maxWidth:520,margin:"0 auto"}}>
        {!sent ? <>
          {/* Infos */}
          <div style={{background:"rgba(26,199,193,0.06)",border:"1px solid rgba(26,199,193,0.15)",borderRadius:14,padding:"14px 16px",marginBottom:24,display:"flex",gap:12,alignItems:"flex-start"}}>
            <span style={{fontSize:22,flexShrink:0}}>💬</span>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"var(--text)",marginBottom:3}}>Une question ? Un problème ?</div>
              <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.6}}>L'équipe Clubby est là pour vous aider. Écrivez-nous, on vous répond vite.</div>
            </div>
          </div>

          {/* Formulaire */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div><label style={lbl}>Prénom</label><input value={prenom} onChange={e=>setPrenom(e.target.value)} placeholder="Sophie" style={inp}/></div>
            <div><label style={lbl}>Nom</label><input value={nom} onChange={e=>setNom(e.target.value)} placeholder="Martin" style={inp}/></div>
          </div>

          <div style={{marginBottom:12}}>
            <label style={lbl}>Club</label>
            <input value={club} onChange={e=>setClub(e.target.value)} placeholder="Nom de votre club" style={inp}/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
            <div><label style={lbl}>Email *</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="vous@club.fr" style={inp}/></div>
            <div><label style={lbl}>Téléphone</label><input type="tel" value={tel} onChange={e=>setTel(e.target.value)} placeholder="06 XX XX XX XX" style={inp}/></div>
          </div>

          <div style={{marginBottom:12}}>
            <label style={lbl}>Sujet</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {SUJETS.map(s=>(
                <button key={s} onClick={()=>setSujet(s)} style={{padding:"7px 14px",borderRadius:100,border:`1.5px solid ${sujet===s?"var(--tq)":"var(--border)"}`,background:sujet===s?"rgba(26,199,193,0.1)":"transparent",color:sujet===s?"var(--tq)":"var(--text2)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"var(--font)",transition:"all .15s"}}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{marginBottom:24}}>
            <label style={lbl}>Message *</label>
            <textarea
              value={msg} onChange={e=>setMsg(e.target.value)}
              placeholder="Décrivez votre question ou votre problème en détail..."
              rows={4}
              style={{...inp,resize:"vertical",minHeight:100}}
            />
          </div>

          <button
            onClick={()=>(email.trim()&&msg.trim())&&setSent(true)}
            style={{width:"100%",padding:15,background:email.trim()&&msg.trim()?"linear-gradient(135deg,var(--tq),#14a09b)":"var(--border)",color:email.trim()&&msg.trim()?"#fff":"var(--text2)",border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:email.trim()&&msg.trim()?"pointer":"not-allowed",fontFamily:"var(--font)",transition:"all .2s"}}
          >
            📨 Envoyer mon message
          </button>
          <p style={{textAlign:"center",fontSize:11,color:"var(--text2)",marginTop:10}}>⏰ Réponse sous 24h ouvrées</p>

          {/* Autres canaux */}
          <div style={{marginTop:28,borderTop:"1px solid var(--border)",paddingTop:20}}>
            <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--text2)",marginBottom:12}}>Autres moyens de nous contacter</div>
            <div style={{display:"flex",alignItems:"center",gap:12,background:"rgba(239,68,68,0.05)",border:"1.5px solid rgba(239,68,68,0.2)",borderRadius:12,padding:"14px 16px"}}>
              <span style={{fontSize:24,flexShrink:0}}>🚨</span>
              <div>
                <div style={{fontSize:13,fontWeight:800,color:"var(--text)",marginBottom:2}}>Un problème urgent ?</div>
                <div style={{fontSize:12,color:"var(--text2)",marginBottom:6}}>Appelez-nous directement</div>
                <a href="tel:0781000000" style={{fontSize:16,fontWeight:900,color:"#EF4444",textDecoration:"none",letterSpacing:.5}}>07 81 00 00 00</a>
              </div>
            </div>
          </div>
        </> : (
          <div style={{textAlign:"center",padding:"48px 0"}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(26,199,193,0.1)",border:"2px solid rgba(26,199,193,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 20px"}}>✓</div>
            <h2 style={{fontSize:22,fontWeight:900,color:"var(--text)",marginBottom:10}}>Message envoyé !</h2>
            <p style={{fontSize:14,color:"var(--text2)",lineHeight:1.7,marginBottom:28,maxWidth:300,margin:"0 auto 28px"}}>
              Merci <strong style={{color:"var(--text)"}}>{prenom||"!"}</strong> Notre équipe vous répondra sous <strong style={{color:"var(--tq)"}}>24h ouvrées</strong> à l'adresse <strong>{email}</strong>.
            </p>
            <button onClick={onClose} style={{padding:"12px 28px",background:"rgba(26,199,193,0.1)",border:"1.5px solid rgba(26,199,193,0.25)",color:"var(--tq)",borderRadius:10,fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"var(--font)"}}>
              ← Retour à l'espace club
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ CLUB ONBOARDING ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ClubOnboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  // Step 0 — Infos générales
  const [clubName, setClubName] = useState("");
  const [sports, setSports] = useState([]);
  const toggleSport = s => setSports(p => p.includes(s) ? p.filter(x=>x!==s) : [...p, s]);
  const [type, setType] = useState(""); // Privé / Association / Franchise
  const [description, setDescription] = useState("");

  // Step 1 — Coordonnées
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  // Step 2 — Responsable
  const [contactPrenom, setContactPrenom] = useState("");
  const [contactNom, setContactNom] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Step 3 — Offre
  const [nbCours, setNbCours] = useState("");
  const [niveaux, setNiveaux] = useState([]);
  const [prixMin, setPrixMin] = useState("");
  const [essaiGratuit, setEssaiGratuit] = useState(null);
  const [capacite, setCapacite] = useState("");

  // Step 4 — Besoins
  const [besoins, setBesoins] = useState([]);

  const total = 5;
  const SPORTS_LIST = ["Tennis","Padel","Yoga","Pilates","Natation","Escalade","Boxe","CrossFit","Danse","Judo","Karaté","Running","Badminton","Squash","Autre"];
  const TYPES = [{id:"Privé",ico:"🏢"},{id:"Association",ico:"🤝"},{id:"Franchise",ico:"🏆"}];
  const NIVEAUX_LIST = ["Débutant","Intermédiaire","Avancé","Compétition","Tous niveaux"];
  const BESOINS_LIST = [
    {id:"visibilite",ico:"🔍",label:"Plus de visibilité en ligne"},
    {id:"essais",ico:"📲",label:"Recevoir des demandes d'essais"},
    {id:"stats",ico:"📊",label:"Suivre mes statistiques"},
    {id:"avis",ico:"⭐",label:"Gérer mes avis membres"},
    {id:"remplissage",ico:"📅",label:"Remplir mes cours"},
    {id:"notoriete",ico:"📣",label:"Développer ma notoriété"},
  ];

  const toggleArr = (arr, setArr, val) => setArr(prev => prev.includes(val) ? prev.filter(x=>x!==val) : [...prev, val]);

  const canNext = [true, true, true, true, true][step];

  const submit = () => {
    setConfirmed(true);
  };

  const inp = {
    width:"100%", background:"#1e2535", border:"1px solid rgba(255,255,255,0.1)",
    borderRadius:10, padding:"11px 14px", fontSize:14, color:"#F8FAFC",
    fontFamily:"'Montserrat',sans-serif", outline:"none", boxSizing:"border-box"
  };
  const lbl = { fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"#64748B", marginBottom:6, display:"block" };
  const fieldWrap = { marginBottom:14 };
  const row2 = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 };

  if (confirmed) {
    return (
      <div style={{minHeight:"100vh",background:"#0B0F1A",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Montserrat',sans-serif",padding:24}}>
        <div style={{maxWidth:480,width:"100%",textAlign:"center"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#1AC7C1,#14a09b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 24px",boxShadow:"0 8px 32px rgba(26,199,193,0.4)"}}>✓</div>
          <h2 style={{fontSize:28,fontWeight:900,color:"#F8FAFC",marginBottom:12}}>Demande envoyée !</h2>
          <p style={{fontSize:15,color:"#94A3B8",lineHeight:1.7,marginBottom:8}}>
            Merci <strong style={{color:"#F8FAFC"}}>{contactPrenom}</strong> ! Nous avons bien reçu les informations de <strong style={{color:"#1AC7C1"}}>{clubName}</strong>.
          </p>
          <div style={{background:"rgba(26,199,193,0.07)",border:"1px solid rgba(26,199,193,0.2)",borderRadius:16,padding:24,marginBottom:32,textAlign:"left"}}>
            <div style={{fontSize:13,fontWeight:800,color:"#1AC7C1",marginBottom:14}}>📋 Prochaines étapes</div>
            {[
              ["📞","Appel de vérification","Notre équipe vous contacte sous 24h ouvrées pour valider vos informations"],
              ["✅","Accès à votre fiche club personnalisable","Une fois validée, vous aurez accès à votre page club sous 48h"],
              ["🚀","Bienvenue sur Clubby Pro","Accédez à votre tableau de bord et commencez à développer votre club"],
            ].map(([ico,title,desc])=>(
              <div key={title} style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}>
                <span style={{fontSize:20,flexShrink:0}}>{ico}</span>
                <div><div style={{fontSize:13,fontWeight:700,color:"#F8FAFC",marginBottom:2}}>{title}</div><div style={{fontSize:12,color:"#64748B",lineHeight:1.5}}>{desc}</div></div>
              </div>
            ))}
          </div>
          <button
            onClick={()=>onDone({clubName,sport:sports.join(", "),sports,type,address,city,email,phone,contactPrenom,contactNom})}
            style={{width:"100%",padding:16,background:"linear-gradient(135deg,#1AC7C1,#14a09b)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}
          >
            Accéder à mon Espace Club →
          </button>
          <p style={{fontSize:11,color:"#334155",marginTop:12}}>Un email de confirmation a été envoyé à {email}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:"#0B0F1A",fontFamily:"'Montserrat',sans-serif",color:"#F8FAFC",display:"flex",flexDirection:"column"}}>
      {/* Progress bar */}
      <div style={{height:3,background:"rgba(255,255,255,0.06)"}}>
        <div style={{height:"100%",background:"linear-gradient(90deg,#1AC7C1,#FF9A5A)",width:`${((step+1)/total)*100}%`,transition:"width .4s ease"}}/>
      </div>

      {/* Header */}
      <div style={{padding:"16px 24px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <span style={{fontSize:20,fontWeight:900,color:"#1AC7C1"}}>Clubby</span>
        <span style={{fontSize:11,fontWeight:600,color:"#64748B",letterSpacing:1}}>· Inscription club</span>
        <span style={{marginLeft:"auto",fontSize:11,fontWeight:700,color:"#64748B"}}>{step+1} / {total}</span>
      </div>

      {/* Body */}
      <div style={{flex:1,overflowY:"auto",padding:"32px 24px 120px",maxWidth:540,width:"100%",margin:"0 auto",boxSizing:"border-box"}}>

        {/* ── STEP 0 : Infos club ── */}
        {step===0 && <>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#1AC7C1",marginBottom:10}}>Étape 1 — Votre club</div>
          <h2 style={{fontSize:26,fontWeight:900,lineHeight:1.15,marginBottom:6}}>Parlez-nous de <em style={{color:"#1AC7C1",fontStyle:"normal"}}>votre club</em></h2>
          <p style={{fontSize:13,color:"#64748B",marginBottom:28,lineHeight:1.6}}>Ces informations seront affichées sur votre page Clubby.</p>

          <div style={fieldWrap}>
            <label style={lbl}>Nom du club *</label>
            <input value={clubName} onChange={e=>setClubName(e.target.value)} placeholder="ex: Tennis Club de Paris" style={inp}/>
          </div>

          <div style={fieldWrap}>
            <label style={lbl}>Sports pratiqués *</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {SPORTS_LIST.map(s=>(
                <button key={s} onClick={()=>toggleSport(s)} style={{padding:"8px 14px",borderRadius:100,border:`1.5px solid ${sports.includes(s)?"#1AC7C1":"rgba(255,255,255,0.1)"}`,background:sports.includes(s)?"rgba(26,199,193,0.12)":"transparent",color:sports.includes(s)?"#1AC7C1":"#94A3B8",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={lbl}>Type de structure *</label>
            <div style={{display:"flex",gap:10}}>
              {TYPES.map(t=>(
                <button key={t.id} onClick={()=>setType(t.id)} style={{flex:1,padding:"12px 8px",borderRadius:12,border:`1.5px solid ${type===t.id?"#1AC7C1":"rgba(255,255,255,0.1)"}`,background:type===t.id?"rgba(26,199,193,0.1)":"rgba(255,255,255,0.03)",color:type===t.id?"#1AC7C1":"#94A3B8",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:6,transition:"all .15s"}}>
                  <span style={{fontSize:22}}>{t.ico}</span>{t.id}
                </button>
              ))}
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={lbl}>Description <span style={{textTransform:"none",letterSpacing:0,fontWeight:500,color:"#475569"}}>(optionnel)</span></label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Décrivez votre club en quelques mots..." rows={3} style={{...inp,resize:"vertical"}}/>
          </div>
        </>}

        {/* ── STEP 1 : Coordonnées ── */}
        {step===1 && <>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#1AC7C1",marginBottom:10}}>Étape 2 — Coordonnées</div>
          <h2 style={{fontSize:26,fontWeight:900,lineHeight:1.15,marginBottom:6}}>Où vous <em style={{color:"#1AC7C1",fontStyle:"normal"}}>trouver</em> ?</h2>
          <p style={{fontSize:13,color:"#64748B",marginBottom:28,lineHeight:1.6}}>Pour que les sportifs puissent vous localiser et vous contacter.</p>

          <div style={fieldWrap}>
            <label style={lbl}>Adresse *</label>
            <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="ex: 12 Allée des Courts" style={inp}/>
          </div>
          <div style={row2}>
            <div><label style={lbl}>Ville *</label><input value={city} onChange={e=>setCity(e.target.value)} placeholder="ex: Paris" style={inp}/></div>
            <div><label style={lbl}>Code postal</label><input placeholder="ex: 75016" style={inp}/></div>
          </div>
          <div style={row2}>
            <div><label style={lbl}>Email *</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="contact@monclub.fr" style={inp}/></div>
            <div><label style={lbl}>Téléphone</label><input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="01 XX XX XX XX" style={inp}/></div>
          </div>
          <div style={fieldWrap}>
            <label style={lbl}>Site web <span style={{textTransform:"none",letterSpacing:0,fontWeight:500,color:"#475569"}}>(optionnel)</span></label>
            <input value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://monclub.fr" style={inp}/>
          </div>
          <div style={row2}>
            <div>
              <label style={lbl}>Instagram</label>
              <input placeholder="@monclub" style={inp}/>
            </div>
            <div>
              <label style={lbl}>Facebook</label>
              <input placeholder="facebook.com/monclub" style={inp}/>
            </div>
          </div>
        </>}

        {/* ── STEP 2 : Responsable ── */}
        {step===2 && <>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#1AC7C1",marginBottom:10}}>Étape 3 — Responsable</div>
          <h2 style={{fontSize:26,fontWeight:900,lineHeight:1.15,marginBottom:6}}>Qui est notre <em style={{color:"#1AC7C1",fontStyle:"normal"}}>interlocuteur</em> ?</h2>
          <p style={{fontSize:13,color:"#64748B",marginBottom:28,lineHeight:1.6}}>La personne que notre équipe contactera pour valider votre inscription.</p>

          <div style={row2}>
            <div><label style={lbl}>Prénom *</label><input value={contactPrenom} onChange={e=>setContactPrenom(e.target.value)} placeholder="ex: Sophie" style={inp}/></div>
            <div><label style={lbl}>Nom *</label><input value={contactNom} onChange={e=>setContactNom(e.target.value)} placeholder="ex: Martin" style={inp}/></div>
          </div>
          <div style={fieldWrap}>
            <label style={lbl}>Rôle dans le club</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {["Directeur·rice","Gérant·e","Entraîneur·se","Responsable com","Autre"].map(r=>(
                <button key={r} onClick={()=>setContactRole(r)} style={{padding:"8px 14px",borderRadius:100,border:`1.5px solid ${contactRole===r?"#FF9A5A":"rgba(255,255,255,0.1)"}`,background:contactRole===r?"rgba(255,154,90,0.1)":"transparent",color:contactRole===r?"#FF9A5A":"#94A3B8",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div style={fieldWrap}>
            <label style={lbl}>Téléphone direct</label>
            <input type="tel" value={contactPhone} onChange={e=>setContactPhone(e.target.value)} placeholder="06 XX XX XX XX" style={inp}/>
            <span style={{fontSize:10,color:"#475569",marginTop:4,display:"block"}}>Pour être recontacté par notre équipe rapidement</span>
          </div>
          <div style={{background:"rgba(255,154,90,0.06)",border:"1px solid rgba(255,154,90,0.2)",borderRadius:12,padding:16,marginTop:8}}>
            <div style={{fontSize:12,fontWeight:700,color:"#FF9A5A",marginBottom:6}}>🔒 Vos données sont sécurisées</div>
            <div style={{fontSize:12,color:"#64748B",lineHeight:1.6}}>Ces informations sont confidentielles et utilisées uniquement pour vérifier votre identité et activer votre compte Clubby Pro.</div>
          </div>
        </>}

        {/* ── STEP 3 : Offre ── */}
        {step===3 && <>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#1AC7C1",marginBottom:10}}>Étape 4 — Votre offre</div>
          <h2 style={{fontSize:26,fontWeight:900,lineHeight:1.15,marginBottom:6}}>Ce que vous <em style={{color:"#1AC7C1",fontStyle:"normal"}}>proposez</em></h2>
          <p style={{fontSize:13,color:"#64748B",marginBottom:28,lineHeight:1.6}}>Ces infos aideront les sportifs à trouver le bon cours.</p>

          <div style={row2}>
            <div><label style={lbl}>Nb de cours / semaine *</label><input type="number" value={nbCours} onChange={e=>setNbCours(e.target.value)} placeholder="ex: 8" style={inp} min="1"/></div>
            <div><label style={lbl}>Capacité max / cours</label><input type="number" value={capacite} onChange={e=>setCapacite(e.target.value)} placeholder="ex: 12" style={inp} min="1"/></div>
          </div>
          <div style={fieldWrap}>
            <label style={lbl}>Niveaux proposés *</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {NIVEAUX_LIST.map(n=>(
                <button key={n} onClick={()=>toggleArr(niveaux,setNiveaux,n)} style={{padding:"8px 14px",borderRadius:100,border:`1.5px solid ${niveaux.includes(n)?"#1AC7C1":"rgba(255,255,255,0.1)"}`,background:niveaux.includes(n)?"rgba(26,199,193,0.12)":"transparent",color:niveaux.includes(n)?"#1AC7C1":"#94A3B8",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div style={fieldWrap}>
            <label style={lbl}>Tarif mensuel à partir de (€) *</label>
            <input type="number" value={prixMin} onChange={e=>setPrixMin(e.target.value)} placeholder="ex: 60" style={inp} min="0"/>
          </div>
          <div style={fieldWrap}>
            <label style={lbl}>Proposez-vous un essai gratuit ? *</label>
            <div style={{display:"flex",gap:10}}>
              {[["Oui, essai gratuit","✅",true],["Non, payant","💶",false]].map(([lbl2,ico,val])=>(
                <button key={lbl2} onClick={()=>setEssaiGratuit(val)} style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${essaiGratuit===val?"#1AC7C1":"rgba(255,255,255,0.1)"}`,background:essaiGratuit===val?"rgba(26,199,193,0.1)":"rgba(255,255,255,0.03)",color:essaiGratuit===val?"#1AC7C1":"#94A3B8",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <span style={{fontSize:18}}>{ico}</span>{lbl2}
                </button>
              ))}
            </div>
          </div>
        </>}

        {/* ── STEP 4 : Besoins ── */}
        {step===4 && <>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#1AC7C1",marginBottom:10}}>Étape 5 — Vos besoins</div>
          <h2 style={{fontSize:26,fontWeight:900,lineHeight:1.15,marginBottom:6}}>Qu'est-ce qui vous <em style={{color:"#1AC7C1",fontStyle:"normal"}}>intéresse</em> le plus ?</h2>
          <p style={{fontSize:13,color:"#64748B",marginBottom:28,lineHeight:1.6}}>On personnalisera votre espace en fonction de vos priorités.</p>

          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
            {BESOINS_LIST.map(b=>(
              <button key={b.id} onClick={()=>toggleArr(besoins,setBesoins,b.id)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:12,border:`1.5px solid ${besoins.includes(b.id)?"#1AC7C1":"rgba(255,255,255,0.08)"}`,background:besoins.includes(b.id)?"rgba(26,199,193,0.07)":"rgba(255,255,255,0.02)",cursor:"pointer",textAlign:"left",transition:"all .15s",fontFamily:"inherit"}}>
                <span style={{fontSize:22,flexShrink:0}}>{b.ico}</span>
                <span style={{fontSize:13,fontWeight:600,color:besoins.includes(b.id)?"#F8FAFC":"#94A3B8"}}>{b.label}</span>
                {besoins.includes(b.id) && <span style={{marginLeft:"auto",width:20,height:20,borderRadius:"50%",background:"#1AC7C1",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontWeight:800,flexShrink:0}}>✓</span>}
              </button>
            ))}
          </div>

          <div style={{background:"linear-gradient(135deg,rgba(26,199,193,0.08),rgba(255,154,90,0.05))",border:"1px solid rgba(26,199,193,0.15)",borderRadius:14,padding:20,textAlign:"center"}}>
            <div style={{fontSize:15,fontWeight:800,color:"#F8FAFC",marginBottom:6}}>🎉 Presque terminé !</div>
            <div style={{fontSize:12,color:"#94A3B8",lineHeight:1.6}}>En cliquant sur "Envoyer ma demande", notre équipe recevra vos informations et vous contactera sous <strong style={{color:"#F8FAFC"}}>24h</strong> pour valider et activer votre fiche.</div>
          </div>
        </>}

      </div>

      {/* Footer nav */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(11,15,26,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.07)",padding:"14px 24px 20px",display:"flex",gap:12,justifyContent:"center"}}>
        <div style={{display:"flex",gap:12,width:"100%",maxWidth:500}}>
          {step > 0 && (
            <button onClick={()=>setStep(s=>s-1)} style={{padding:"13px 20px",borderRadius:12,border:"1.5px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"#94A3B8",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
              ← Retour
            </button>
          )}
          {step < total-1 ? (
            <button onClick={()=>canNext&&setStep(s=>s+1)} style={{flex:1,padding:13,borderRadius:12,border:"none",background:canNext?"linear-gradient(135deg,#1AC7C1,#14a09b)":"rgba(255,255,255,0.08)",color:canNext?"#fff":"#475569",fontSize:13,fontWeight:800,cursor:canNext?"pointer":"not-allowed",fontFamily:"inherit",transition:"all .2s"}}>
              Suivant →
            </button>
          ) : (
            <button onClick={submit} style={{flex:1,padding:13,borderRadius:12,border:"none",background:"linear-gradient(135deg,#1AC7C1,#14a09b)",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              🚀 Envoyer ma demande
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━ MODE SELECTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ModeSelection({ onSelect, onLogin }) {
  const [hovered, setHovered] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState("sportif"); // "sportif" | "pro"
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPw.trim()) { setLoginError("Remplis tous les champs."); return; }
    setLoading(true); setLoginError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPw });
      if (error) { setLoginError("Email ou mot de passe incorrect."); setLoading(false); return; }
      onLogin(loginMode, data.user);
    } catch(e) { setLoginError("Erreur de connexion."); }
    setLoading(false);
  };

  const inp = {width:"100%",background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"11px 14px",fontSize:14,color:"#F8FAFC",fontFamily:"'Montserrat',sans-serif",outline:"none",boxSizing:"border-box"};

  return (
    <div style={{minHeight:"100vh",background:"#0B0F1A",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Montserrat',sans-serif",padding:"32px 20px",position:"relative",overflow:"hidden"}}>
      {/* Background glows */}
      <div style={{position:"absolute",top:"-10%",left:"-10%",width:"50vw",height:"50vw",background:"radial-gradient(circle,rgba(26,199,193,0.12),transparent 65%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"-10%",right:"-10%",width:"50vw",height:"50vw",background:"radial-gradient(circle,rgba(255,154,90,0.09),transparent 65%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(26,199,193,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(26,199,193,0.03) 1px,transparent 1px)",backgroundSize:"50px 50px",pointerEvents:"none"}}/>

      {/* Se connecter button top right */}
      <button onClick={()=>setShowLogin(true)} style={{position:"absolute",top:20,right:20,padding:"8px 18px",borderRadius:100,border:"1.5px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.06)",color:"#94A3B8",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Montserrat',sans-serif",transition:"all .2s",zIndex:10}}>
        Se connecter
      </button>

      <div style={{position:"relative",zIndex:1,textAlign:"center",maxWidth:600,width:"100%"}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:12}}>
          <span style={{fontSize:36,fontWeight:900,color:"#1AC7C1",letterSpacing:-1}}>Clubby</span>
          <div style={{width:9,height:9,background:"#FF9A5A",borderRadius:"50%",marginBottom:4}}/>
        </div>
        <div style={{fontSize:13,color:"#64748B",fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",marginBottom:48}}>match avec ton sport</div>

        <h1 style={{fontSize:"clamp(22px,5vw,34px)",fontWeight:900,color:"#F8FAFC",lineHeight:1.2,marginBottom:10}}>
          Bienvenue sur Clubby
        </h1>
        <p style={{fontSize:15,color:"#94A3B8",marginBottom:48,lineHeight:1.6}}>
          Dis-nous qui tu es pour te proposer<br/>l'expérience qui te correspond.
        </p>

        {/* Two cards */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:32}}>
          {/* SPORTIF */}
          <div
            onClick={()=>onSelect("sportif")}
            onMouseEnter={()=>setHovered("sportif")}
            onMouseLeave={()=>setHovered(null)}
            style={{
              background: hovered==="sportif" ? "rgba(26,199,193,0.1)" : "rgba(255,255,255,0.04)",
              border: hovered==="sportif" ? "2px solid #1AC7C1" : "2px solid rgba(255,255,255,0.08)",
              borderRadius:20,padding:"28px 20px",cursor:"pointer",
              transition:"all .25s",transform:hovered==="sportif"?"translateY(-4px)":"none",
              boxShadow:hovered==="sportif"?"0 12px 40px rgba(26,199,193,0.2)":"none"
            }}
          >
            <div style={{fontSize:48,marginBottom:14}}>🏃</div>
            <div style={{fontSize:17,fontWeight:900,color:"#F8FAFC",marginBottom:8}}>Je suis sportif·ve</div>
            <div style={{fontSize:12,color:"#64748B",lineHeight:1.6,marginBottom:16}}>
              Je cherche un club, des cours, ou un coach adapté à mes besoins.
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {["🔍 Trouver un club","⭐ Lire les avis","📅 Planifier mes cours"].map(f=>(
                <div key={f} style={{fontSize:11,fontWeight:600,color:"#94A3B8",textAlign:"left",display:"flex",alignItems:"center",gap:6}}>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:20,padding:"10px 20px",background:"linear-gradient(135deg,#1AC7C1,#14a09b)",borderRadius:100,fontSize:13,fontWeight:800,color:"#fff",display:"inline-block"}}>
              Commencer →
            </div>
          </div>

          {/* CLUB PRO */}
          <div
            onClick={()=>onSelect("pro")}
            onMouseEnter={()=>setHovered("pro")}
            onMouseLeave={()=>setHovered(null)}
            style={{
              background: hovered==="pro" ? "rgba(255,154,90,0.1)" : "rgba(255,255,255,0.04)",
              border: hovered==="pro" ? "2px solid #FF9A5A" : "2px solid rgba(255,255,255,0.08)",
              borderRadius:20,padding:"28px 20px",cursor:"pointer",
              transition:"all .25s",transform:hovered==="pro"?"translateY(-4px)":"none",
              boxShadow:hovered==="pro"?"0 12px 40px rgba(255,154,90,0.2)":"none"
            }}
          >
            <div style={{fontSize:48,marginBottom:14}}>🏢</div>
            <div style={{fontSize:17,fontWeight:900,color:"#F8FAFC",marginBottom:8}}>Je suis un club</div>
            <div style={{fontSize:12,color:"#64748B",lineHeight:1.6,marginBottom:16}}>
              Je veux attirer de nouveaux membres et remplir mes cours.
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {["📈 Booster ma visibilité","📲 Recevoir des essais","📊 Suivre mes stats"].map(f=>(
                <div key={f} style={{fontSize:11,fontWeight:600,color:"#94A3B8",textAlign:"left",display:"flex",alignItems:"center",gap:6}}>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:20,padding:"10px 20px",background:"linear-gradient(135deg,#FF9A5A,#e07e3e)",borderRadius:100,fontSize:13,fontWeight:800,color:"#fff",display:"inline-block"}}>
              Découvrir l'offre →
            </div>
          </div>
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>{if(e.target===e.currentTarget)setShowLogin(false)}}>
          <div style={{background:"#141927",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"32px 28px",width:"100%",maxWidth:400,position:"relative"}}>
            <button onClick={()=>setShowLogin(false)} style={{position:"absolute",top:16,right:16,background:"none",border:"none",color:"#64748B",fontSize:18,cursor:"pointer"}}>✕</button>

            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:22,fontWeight:900,color:"#1AC7C1",marginBottom:4}}>Clubby</div>
              <div style={{fontSize:16,fontWeight:800,color:"#F8FAFC",marginBottom:4}}>Bon retour 👋</div>
              <div style={{fontSize:12,color:"#64748B"}}>Connecte-toi à ton compte</div>
            </div>

            {/* Type toggle */}
            <div style={{display:"flex",background:"rgba(255,255,255,0.05)",borderRadius:10,padding:3,gap:3,marginBottom:20}}>
              {[["sportif","🏃 Sportif"],["pro","🏢 Club"]].map(([mode,lbl])=>(
                <button key={mode} onClick={()=>setLoginMode(mode)} style={{flex:1,padding:"8px",border:"none",borderRadius:7,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Montserrat',sans-serif",background:loginMode===mode?"rgba(26,199,193,0.15)":"transparent",color:loginMode===mode?"#1AC7C1":"#64748B",transition:"all .2s"}}>
                  {lbl}
                </button>
              ))}
            </div>

            <div style={{marginBottom:12}}>
              <label style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#64748B",marginBottom:5,display:"block"}}>Email</label>
              <input value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} placeholder="ton@email.fr" type="email" style={inp}/>
            </div>
            <div style={{marginBottom:6}}>
              <label style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#64748B",marginBottom:5,display:"block"}}>Mot de passe</label>
              <div style={{position:"relative"}}>
                <input value={loginPw} onChange={e=>setLoginPw(e.target.value)} placeholder="••••••••" type={showPw?"text":"password"} style={{...inp,paddingRight:40}} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
                <button onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:14}}>{showPw?"🙈":"👁️"}</button>
              </div>
            </div>
            <div style={{textAlign:"right",marginBottom:20}}>
              <span style={{fontSize:11,color:"#1AC7C1",cursor:"pointer",fontWeight:600}}>Mot de passe oublié ?</span>
            </div>

            {loginError && <div style={{fontSize:12,color:"#EF4444",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:8,padding:"8px 12px",marginBottom:14,textAlign:"center"}}>{loginError}</div>}

            <button onClick={handleLogin} style={{width:"100%",padding:14,background:loading?"rgba(26,199,193,0.4)":"linear-gradient(135deg,#1AC7C1,#14a09b)",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:800,cursor:loading?"not-allowed":"pointer",fontFamily:"'Montserrat',sans-serif"}}>
              {loading?"Connexion...":"Se connecter →"}
            </button>

            <div style={{textAlign:"center",marginTop:16,fontSize:12,color:"#475569"}}>
              Pas encore de compte ?{" "}
              <span onClick={()=>{setShowLogin(false);onSelect(loginMode)}} style={{color:"#1AC7C1",fontWeight:700,cursor:"pointer"}}>Créer un compte</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [splash, setSplash]   = useState(true);
  const [appMode, setAppMode] = useState(null); // null | "sportif" | "pro"
  const [showClubOnboarding, setShowClubOnboarding] = useState(true);
  const [clubProfile, setClubProfile] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showProLanding, setShowProLanding] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [ratings, setRatings] = useState({}); // { clubId: {stars, comment} }
  const [sort, setSort] = useState("pertinence");
  const [selectedClub, setSelectedClub] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [favs, setFavs] = useState([]);
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [planning, setPlanning] = useState(MOCK_PLANNING);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [proMenuOpen, setProMenuOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"
  const [visibleCount, setVisibleCount] = useState(10);
  const toastRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // ── Supabase auth: check existing session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from("profiles").select("*").eq("id", session.user.id).single()
          .then(({ data }) => {
            if (data) {
              setUserProfile(data);
              setShowOnboarding(false);
            }
          });
        supabase.from("clubs").select("*").eq("user_id", session.user.id).single()
          .then(({ data }) => {
            if (data) {
              setClubProfile(data);
              setShowClubOnboarding(false);
            }
          });
      }
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUserProfile(null);
        setShowOnboarding(true);
        setShowClubOnboarding(true);
        setAppMode(null);
      }
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setVisibleCount(10);
  }, [filters, searchQuery]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    if(toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(()=>setToast(null), 2500);
  }, []);

  const toggleFav = (id) => {
    setFavs(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };

  const openClub = (club) => {
    setSelectedClub(club);
    if (!history.find(h=>h.id===club.id)) {
      setHistory(h=>[{id:club.id,name:club.name,emoji:club.emoji,city:club.city,ago:"À l'instant"},...h.slice(0,9)]);
    }
  };

  const addToPlanning = (club, course, day, time) => {
    const d = day || (Object.keys(club.schedule).find(k=>club.schedule[k].length>0) || "Lun");
    const t = time || (club.schedule[d]||[])[0] || "18:00";
    setPlanning(p=>[...p, {clubName:club.name,courseName:course.name,day:d,time:t,emoji:club.emoji,color:club.accentColor}]);
  };

  const cancelPlan = (idx) => setPlanning(p=>p.filter((_,i)=>i!==idx));

  const filtered = CLUBS.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.sport.toLowerCase().includes(q) && !c.city.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false;
    }
    if (filters.sport !== "Tous" && c.sport !== filters.sport) return false;
    if (filters.city !== "Toutes" && c.city !== filters.city) return false;
    const monthlyPrice = c.priceUnit === "an" ? c.priceMin / 12 : c.priceUnit === "séance" ? c.priceMin * 4 : c.priceMin;
    if (filters.budget < 500 && monthlyPrice > filters.budget) return false;
    if (filters.levels.length > 0 && !filters.levels.some(l=>c.levels.includes(l))) return false;
    if (filters.ambiance && c.ambiance !== filters.ambiance) return false;
    if (filters.indoor !== null && c.indoor !== filters.indoor) return false;
    if (filters.essaiGratuit && !c.essaiGratuit) return false;
    if (filters.pmr && !c.pmr) return false;
    if (filters.postPartum && !c.postPartum) return false;
    if (filters.womenOnly && !c.womenOnly) return false;
    if (filters.parentEnfant && !c.parentEnfant) return false;
    if (filters.tarifEtudiant && !c.tarifEtudiant) return false;
    if (filters.tarifSenior && !c.tarifSenior) return false;
    if (filters.tarifFamille && !c.tarifFamille) return false;
    if (filters.coachPerso && !c.labels.includes("Coach perso")) return false;
    if (filters.abonnementMensuel && c.priceUnit !== "mois") return false;
    if (filters.abonnementAnnuel && c.priceUnit !== "an") return false;
    return true;
  });
  const toMonthly = c => c.priceUnit === "an" ? c.priceMin/12 : c.priceUnit === "séance" ? c.priceMin*4 : c.priceMin;
  const sorted = [...filtered].sort((a,b) => {
    if (sort === "prix") return toMonthly(a) - toMonthly(b);
    if (sort === "avis") return b.rating - a.rating;
    // pertinence: rating * log(reviews) — clubs populaires ET bien notés remontent
    return (b.rating * Math.log(b.reviews+1)) - (a.rating * Math.log(a.reviews+1));
  });

  const activeFiltersCount = Object.entries(filters).filter(([k,v]) => {
    if (k==="sport") return v!=="Tous";
    if (k==="city") return v!=="Toutes";
    if (k==="budget") return v<500;
    if (k==="levels") return v.length>0;
    if (k==="ambiance") return v!==null;
    if (k==="indoor") return v!==null;
    if (typeof v === "boolean") return v===true;
    return false;
  }).length;

  const hasSearched = searchQuery.trim() !== "" || activeFiltersCount > 0;

  // ── Splash screen
  if (splash) {
    return (
      <>
        <style>{STYLES}</style>
        <SplashScreen/>
      </>
    );
  }

  // ── Mode selection screen
  if (!appMode) {
    return (
      <>
        <style>{STYLES}</style>
        <ModeSelection onSelect={(mode) => {
          setAppMode(mode);
          if (mode === "pro") {
            setShowOnboarding(false);
          }
        }} onLogin={(mode, user) => {
          setAppMode(mode);
          setShowOnboarding(false);
          setShowClubOnboarding(false);
        }}/>
      </>
    );
  }

  // ── Pro mode: club onboarding first, then Espace Pro
  if (appMode === "pro") {
    if (showClubOnboarding) {
      return (
        <>
          <style>{STYLES}</style>
          <ClubOnboarding onDone={async (clubData) => {
            // Supabase sign up for club
            if (clubData?.email) {
              const password = Math.random().toString(36).slice(-10) + "Aa1!";
              const { data, error } = await supabase.auth.signUp({
                email: clubData.email,
                password,
              });
              if (!error && data?.user) {
                await supabase.from("clubs").insert({
                  user_id: data.user.id,
                  club_name: clubData.clubName,
                  sport: clubData.sport,
                  type: clubData.type,
                  address: clubData.address,
                  city: clubData.city,
                  email: clubData.email,
                  phone: clubData.phone,
                  contact_prenom: clubData.contactPrenom,
                  contact_nom: clubData.contactNom,
                  status: "pending",
                });
              }
            }
            setClubProfile(clubData);
            setShowClubOnboarding(false);
          }}/>
        </>
      );
    }
    return (
      <>
        <style>{STYLES}</style>
        <div style={{paddingBottom:20}}>
          {/* Pro top nav */}
          <nav className="nav">
            <div className={`hamburger${proMenuOpen?" open":""}`} onClick={()=>setProMenuOpen(o=>!o)}>
              <span/><span/><span/>
            </div>
            <div className="nav-logo"><em>Clubby</em><div className="dot"/><span style={{fontSize:11,fontWeight:700,color:"var(--text2)",marginLeft:6}}>Club</span></div>
          </nav>

          {/* Hamburger drawer */}
          {proMenuOpen && <div className="hmenu-overlay" onClick={()=>setProMenuOpen(false)}/>}
          <div className={`hmenu-drawer${proMenuOpen?" open":""}`}>
            <div className="hmenu-top">
              <div className="hmenu-logo"><em>Clubby</em> <span style={{fontWeight:600,fontSize:14,color:"var(--text2)"}}>Club</span></div>
              <div className="hmenu-sub">{clubProfile?.clubName||"Votre espace club"}</div>
            </div>
            <div className="hmenu-items">
              <div className="hmenu-item active">
                <span className="hmenu-item-ico">🏢</span> Espace Club
              </div>
              <div className="hmenu-item" onClick={()=>{setShowProLanding(true);setProMenuOpen(false)}}>
                <span className="hmenu-item-ico">🚀</span> Mon offre Pro
              </div>
              <div className="hmenu-item" onClick={()=>{setShowContact(true);setProMenuOpen(false)}}>
                <span className="hmenu-item-ico">💬</span> Contacter l'équipe Clubby
              </div>
            </div>
            <div className="hmenu-divider"/>
            <div className="hmenu-bottom">
              <div className="hmenu-item" onClick={()=>setDarkMode(d=>!d)}>
                <span className="hmenu-item-ico">{darkMode?"☀️":"🌙"}</span> {darkMode?"Mode clair":"Mode sombre"}
              </div>
              <div className="hmenu-item" style={{color:"#EF4444"}} onClick={()=>{supabase.auth.signOut();setAppMode(null);}}>
                <span className="hmenu-item-ico">🔄</span> Déconnexion
              </div>
            </div>
          </div>

          <ProPage showToast={showToast} onShowProLanding={()=>setShowProLanding(true)} clubProfile={clubProfile}/>
        </div>
        {toast && <div className="toast">{toast}</div>}
        {showProLanding && <ProLanding onClose={()=>setShowProLanding(false)}/>}
        {showContact && <ContactClubby onClose={()=>setShowContact(false)} clubProfile={clubProfile}/>}
      </>
    );
  }

  if (showOnboarding) {
    return (
      <>
        <style>{STYLES}</style>
        <Onboarding onDone={async (profile) => {
          // Supabase sign up
          if (profile?.email && profile?.password) {
            const { data, error } = await supabase.auth.signUp({
              email: profile.email,
              password: profile.password,
            });
            if (!error && data?.user) {
              await supabase.from("profiles").upsert({
                id: data.user.id,
                prenom: profile.prenom,
                nom: profile.nom,
                email: profile.email,
                phone: profile.phone,
                adresse: profile.adresse,
                genre: profile.genre,
                dob: profile.dob,
                sport: profile.sports?.[0] || null,
                objective: profile.objective,
                freq: profile.freq,
                medical: profile.medical || [],
              });
            }
          }
          setShowOnboarding(false);
          if (profile) {
            setUserProfile(profile);
            const sportName = profile.sports?.[0]?.split(" ").slice(0,-1).join(" ") || profile.sports?.[0]?.replace(/\s*\S+$/, "").trim();
            const cleanSport = sportName || profile.sports?.[0];
            if (cleanSport && SPORTS.includes(cleanSport)) setFilters(f=>({...f,sport:cleanSport}));
            if (profile.health?.includes("pmr") || profile.medical?.includes("pmr")) setFilters(f=>({...f,pmr:true}));
            if (profile.health?.includes("postPartum") || profile.medical?.includes("postPartum")) setFilters(f=>({...f,postPartum:true}));
          }
        }}/>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>

      <nav className="nav">
        <div className={`hamburger${menuOpen?" open":""}`} onClick={()=>setMenuOpen(o=>!o)}>
          <span/><span/><span/>
        </div>
        <div className="nav-logo" onClick={()=>{setActiveTab("home");setMenuOpen(false)}}><em>Clubby</em><div className="dot"/></div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={()=>{setActiveTab("profile");setTimeout(()=>{const el=document.getElementById("planning-section");if(el)el.scrollIntoView({behavior:"smooth"})},100);}}>
            📅 Mes réservations
          </button>
          <div style={{position:"relative"}}>
            <div
              className={`nav-icon-btn nav-notif`}
              onClick={()=>{setShowNotifs(o=>!o);setMenuOpen(false);}}
              style={{position:"relative"}}
            >
              🔔
              <span className="nav-notif-dot" style={{background:"#EF4444"}}/>
            </div>
            {showNotifs && (
              <>
                <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:249}} onClick={()=>setShowNotifs(false)}/>
                <div className="notif-panel">
                  <div className="notif-header">
                    <span className="notif-header-title">Notifications</span>
                    <button className="notif-clear" onClick={()=>setShowNotifs(false)}>Tout marquer lu</button>
                  </div>
                  {[
                    {ico:"📅",bg:"rgba(26,199,193,0.1)",text:<>Un créneau vient de se <strong>libérer</strong> au <strong>Zen Yoga Studio</strong> — Mercredi 12h</>,time:"Il y a 5 min",unread:true},
                    {ico:"🧘",bg:"rgba(255,154,90,0.1)",text:<>N'oubliez pas votre cours de <strong>Pilates</strong> aujourd'hui à <strong>18h00</strong> !</>,time:"Il y a 1h",unread:true},
                    {ico:"💬",bg:"rgba(155,93,229,0.1)",text:<><strong>Tennis Club de Paris</strong> vient de répondre à votre message</>,time:"Il y a 2h",unread:true},
                  ].map((n,i)=>(
                    <div key={i} className={`notif-item${n.unread?" unread":""}`} onClick={()=>setShowNotifs(false)}>
                      <div className="notif-ico" style={{background:n.bg}}>{n.ico}</div>
                      <div className="notif-body">
                        <div className="notif-text">{n.text}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                      {n.unread && <div className="notif-unread-dot"/>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hamburger drawer */}
      {menuOpen && <div className="hmenu-overlay" onClick={()=>setMenuOpen(false)}/>}
      <div className={`hmenu-drawer${menuOpen?" open":""}`}>
        <div className="hmenu-top">
          <div className="hmenu-logo"><em>Clubby</em></div>
          <div className="hmenu-sub">Navigation</div>
        </div>
        <div className="hmenu-items">
          <div className={`hmenu-item${activeTab==="home"?" active":""}`} onClick={()=>{setActiveTab("home");setMenuOpen(false)}}>
            <span className="hmenu-item-ico">🏠</span> Explorer
          </div>
          <div className={`hmenu-item${activeTab==="profile"?" active":""}`} onClick={()=>{setActiveTab("profile");setMenuOpen(false)}}>
            <span className="hmenu-item-ico">👤</span> Mon profil
            {favs.length>0 && <span style={{marginLeft:"auto",fontSize:11,fontWeight:800,background:"var(--co)",color:"#fff",borderRadius:100,padding:"2px 7px"}}>{favs.length}</span>}
          </div>
        </div>
        <div className="hmenu-divider"/>
        <div className="hmenu-bottom">
          <div className="hmenu-item" onClick={()=>{setDarkMode(d=>!d)}}>
            <span className="hmenu-item-ico">{darkMode?"☀️":"🌙"}</span> {darkMode?"Mode clair":"Mode sombre"}
          </div>
          <div className="hmenu-item" style={{color:"#EF4444"}} onClick={()=>{supabase.auth.signOut();setAppMode(null);}}>
            <span className="hmenu-item-ico">🔄</span> Déconnexion
          </div>
        </div>
      </div>

      {activeTab==="home" && <>
        <div className="hero">
          <div className="hero-badge">La nouvelle façon de trouver ton sport</div>
          <h1>Match avec<br/><em>ton sport</em></h1>
          <p>La plateforme qui centralise tous les clubs et assos sportives. Trouve celui qui te correspond vraiment.</p>
          <div className="search-wrap" style={{padding:"0 0 16px"}}>
            <div className="search-bar">
              <span className="search-ico">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Yoga, Tennis, Piscine, Vincennes..."
                value={searchQuery}
                onChange={e=>setSearchQuery(e.target.value)}
              />
              {searchQuery && <button className="search-clear" onClick={()=>setSearchQuery("")}>✕</button>}
            </div>
          </div>
          <div className="hero-stats">
            <div><div className="stat-num"><em>300</em>+</div><div className="stat-label">clubs référencés</div></div>
            <div><div className="stat-num"><em>50</em>+</div><div className="stat-label">sports</div></div>
            <div><div className="stat-num"><em>1.4k</em></div><div className="stat-label">avis de sportifs vérifiés</div></div>
          </div>
        </div>

        {planning.length >= 3 && (
          <div className="progress-banner" onClick={()=>setActiveTab("profile")}>
            <div className="pb-row">
              <div><div className="pb-title">🔥 Tu es en feu cette semaine !</div><div className="pb-sub">{planning.length} cours planifiés · Continue comme ça</div></div>
              <div className="pb-badge">{planning.length}/7</div>
            </div>
            <div className="pb-bar-wrap"><div className="pb-bar" style={{width:`${(planning.length/7)*100}%`}}/></div>
          </div>
        )}

        {/* ── Clubs populaires de la semaine ── */}
        <div style={{padding:"20px 20px 0",background:"var(--white)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                <span style={{fontSize:18}}>🏆</span>
                <span style={{fontSize:15,fontWeight:900,color:"var(--text)"}}>Populaires cette semaine</span>
              </div>
              <div style={{fontSize:11,color:"var(--text2)",fontWeight:500}}>Les clubs préférés de notre communauté</div>
            </div>
          </div>
          <div style={{display:"flex",gap:12,overflowX:"auto",scrollbarWidth:"none",paddingBottom:16}}>
            {CLUBS.filter(c=>c.trendBadge==="Populaire").slice(0,3).map((c,i)=>{
              const medals = ["🥇","🥈","🥉"];
              return (
                <div key={c.id} onClick={()=>openClub(c)} style={{flexShrink:0,width:200,borderRadius:16,overflow:"hidden",border:"1px solid var(--border)",background:"var(--white)",cursor:"pointer",transition:"all .2s",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                  {/* Image */}
                  <div style={{position:"relative",height:110,overflow:"hidden",background:`linear-gradient(135deg,${c.accentColor}dd,${c.accentColor}88)`}}>
                    <img src={c.image} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none"}}/>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.5))"}}/>
                    {/* Medal */}
                    <div style={{position:"absolute",top:8,left:8,fontSize:22}}>{medals[i]}</div>
                    {/* Sport badge */}
                    <div style={{position:"absolute",bottom:8,left:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(6px)",borderRadius:100,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#fff"}}>
                      {c.emoji} {c.sport}
                    </div>
                  </div>
                  {/* Content */}
                  <div style={{padding:"10px 12px"}}>
                    <div style={{fontSize:12,fontWeight:800,color:"var(--text)",marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div>
                    <div style={{fontSize:10,color:"var(--text2)",marginBottom:8}}>📍 {c.city}</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        <span style={{fontSize:12}}>⭐</span>
                        <span style={{fontSize:12,fontWeight:800,color:"var(--text)"}}>{c.rating}</span>
                        <span style={{fontSize:10,color:"var(--text2)"}}>({c.reviews})</span>
                      </div>
                      <div style={{fontSize:11,fontWeight:700,color:"var(--tq)"}}>
                        {c.type==="Association" ? `${c.priceMin}–${c.priceMax}€/an` : `${c.priceMin}€/${c.priceUnit}`}
                      </div>
                    </div>
                    {c.essaiGratuit && <div style={{marginTop:6,fontSize:9,fontWeight:700,color:"var(--co)",background:"rgba(255,154,90,0.1)",borderRadius:100,padding:"2px 8px",display:"inline-block"}}>✓ Essai gratuit</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <FilterBar filters={filters} setFilters={setFilters} activeFiltersCount={activeFiltersCount} onOpenDrawer={()=>setShowDrawer(true)} onResetFilters={()=>{setFilters(DEFAULT_FILTERS);setSearchQuery("");}}/>

        <div className="results-bar">
          <div className="results-count"><em>{activeFiltersCount>0||searchQuery.trim()?filtered.length:"300+"}</em> club{filtered.length!==1?"s":""} trouvé{filtered.length!==1?"s":""}</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {hasSearched && (
              <div className="view-toggle">
                <button className={`vt-btn${viewMode==="list"?" active":""}`} onClick={()=>setViewMode("list")}>≡ Liste</button>
                <button className={`vt-btn${viewMode==="map"?" active":""}`} onClick={()=>setViewMode("map")}>🗺 Carte</button>
              </div>
            )}
            <select className="sort-sel" value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="pertinence">Pertinence</option>
              <option value="prix">Prix croissant</option>
              <option value="avis">Meilleures notes</option>
            </select>
          </div>
        </div>

        {hasSearched && viewMode==="map" ? (
          <MapView clubs={sorted} onOpenClub={openClub}/>
        ) : sorted.length===0 ? (
          <EmptyState
            filters={filters}
            searchQuery={searchQuery}
            onResetFilters={()=>{setFilters(DEFAULT_FILTERS);setSearchQuery("");}}
            onResetSearch={()=>setSearchQuery("")}
            onResetSport={()=>setFilters(f=>({...f,sport:"Tous"}))}
            onOpenClub={openClub}
            favs={favs}
            onFav={toggleFav}
          />
        ) : (
          <>
            <div className="clubs-grid">
              {sorted.slice(0, visibleCount).map((c,i)=><ClubCard key={c.id} club={c} isFav={favs.includes(c.id)} onFav={toggleFav} onClick={()=>openClub(c)} index={i}/>)}
            </div>
            {visibleCount < sorted.length && (
              <div style={{padding:"0 20px 100px",textAlign:"center"}}>
                <button
                  onClick={()=>setVisibleCount(v=>v+10)}
                  style={{background:"var(--bg)",border:"1.5px solid var(--border)",borderRadius:12,padding:"14px 28px",fontSize:14,fontWeight:700,color:"var(--text2)",cursor:"pointer",transition:"all .2s",display:"inline-flex",alignItems:"center",gap:8,marginTop:4}}
                  onMouseOver={e=>{e.currentTarget.style.borderColor="var(--tq)";e.currentTarget.style.color="var(--tq)"}}
                  onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text2)"}}
                >
                  <span style={{fontSize:16}}>🔍</span>
                  Chercher plus de clubs
                  <span style={{background:"rgba(26,199,193,0.12)",color:"var(--tq)",borderRadius:100,padding:"2px 8px",fontSize:11,fontWeight:800}}>+{Math.min(10, sorted.length - visibleCount)}</span>
                </button>
                <div style={{marginTop:8,fontSize:11,color:"var(--text2)"}}>
                  {visibleCount} sur {sorted.length} clubs affichés
                </div>
              </div>
            )}
            {visibleCount >= sorted.length && sorted.length > 10 && (
              <div style={{padding:"8px 20px 100px",textAlign:"center",fontSize:12,color:"var(--text2)"}}>
                ✅ Tous les clubs sont affichés
              </div>
            )}
          </>
        )}
      </>}

      {activeTab==="profile" && (
        <ProfilePage
          favs={favs} history={history} planning={planning}
          onToggleFav={toggleFav} onOpenClub={openClub}
          onCancelPlan={cancelPlan} userProfile={userProfile}
          showToast={showToast}
          ratings={ratings}
          onRate={(clubId, stars, comment)=>setRatings(r=>({...r,[clubId]:{stars,comment}}))}
          onUpdateProfile={(updated)=>setUserProfile(p=>({...p,...updated}))}
        />
      )}

      {activeTab==="pro" && <ProPage showToast={showToast} onShowProLanding={()=>setShowProLanding(true)}/>}

      {selectedClub && (
        <ClubDetail
          club={selectedClub} isFav={favs.includes(selectedClub.id)}
          onToggleFav={toggleFav} onClose={()=>setSelectedClub(null)}
          onAddToPlanning={addToPlanning} showToast={showToast}
        />
      )}

      {showDrawer && (
        <FilterDrawer
          filters={filters} onChange={setFilters}
          onClose={()=>setShowDrawer(false)} resultCount={filtered.length}
        />
      )}

      {toast && <div className="toast">{toast}</div>}

      {showProLanding && <ProLanding onClose={()=>setShowProLanding(false)}/>}
    </>
  );
}
