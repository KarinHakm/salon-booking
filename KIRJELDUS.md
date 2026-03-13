# Juuksuri Salongi Broneerimissüsteem — Projekti Kirjeldus

## 1. Arhitektuur (klient-server põhimõte)

Rakendus järgib klient-server mudelit, kus frontend ja backend on eraldatud:

- **Klient (Frontend)**: React 18 + TypeScript + Vite. Töötab kasutaja brauseris, saadab HTTP päringuid backendile ja kuvab andmeid kasutajale. Klient ei pöördu otse andmebaasi poole.
- **Server (Backend)**: Node.js + Express + TypeScript. Töötleb API päringuid, kontrollib sisendeid, haldab autentimist ja suhtleb PostgreSQL andmebaasiga.
- **Andmebaas**: PostgreSQL. Salvestab teenused, töötajad, kasutajad ja broneeringud.

Suhtlusvoog:
```
Brauser (React) —→ HTTP/JSON —→ Express API —→ PostgreSQL
```

Klient saadab päringuid (nt `GET /api/staff`, `POST /api/bookings`) ja server vastab JSON-formaadis andmetega. Klient ei tea andmebaasi struktuurist midagi — kogu äriloogika asub serveris.

## 2. MVC muster

Rakenduses on eristatavad mudeli, vaate ja kontrolleri rollid:

- **Model (Mudel)**: PostgreSQL andmebaas + `database/db.ts` päringumoodul. Tabelid: `users`, `services`, `staff`, `appointments`. Andmete salvestamine, lugemine ja kitsendused (UNIQUE constraint topeltbroneeringu vastu).
- **View (Vaade)**: React komponendid (`BookingPage.tsx`, `AdminPage.tsx`, `AdminLoginPage.tsx`, `HomePage.tsx`). Kuvavad andmeid kasutajale ja koguvad sisendit.
- **Controller (Kontroller)**: Express kontrollerid (`bookingsController.ts`, `authController.ts`, `staffController.ts`, `servicesController.ts`). Töötlevad päringuid, valideerivad sisendeid ja koordineerivad mudelikihi päringuid.

## 3. Kasutatavad raamistikud ja teegid

### Frontend
| Teek | Otstarve |
|------|----------|
| React 18 | UI komponentide raamistik |
| React Router DOM v6 | Marsruutimine lehtede vahel |
| Axios | HTTP päringud backendile |
| Tailwind CSS | Utiliidipõhine CSS raamistik |
| i18next | Tõlkesüsteem (eesti keel) |
| Vite | Arendus- ja ehitustööriist |
| TypeScript | Tüübikindlus |

### Backend
| Teek | Otstarve |
|------|----------|
| Express | Veebiserveri raamistik |
| jsonwebtoken (JWT) | Autentimistokenid |
| bcryptjs | Paroolide räsimine |
| pg (node-postgres) | PostgreSQL klient |
| cors | Ristdomeeni päringute tugi |
| TypeScript | Tüübikindlus |

## 4. Turvalisuse ülevaade

### Peamised ründevektorid ja kaitsemeetmed

| Ründevektor | Kaitsemeede |
|-------------|-------------|
| **Volitamata ligipääs admin-vaatele** | JWT-põhine autentimine. `ProtectedRoute` komponent kontrollib sisse logitud kasutaja admin-rolli. Backend middleware (`authenticateToken`, `requireAdmin`) kontrollib tokeni kehtivust ja admin-õigusi. |
| **SQL-süstepäringud (SQL Injection)** | Parameetrilised päringud (`$1, $2, ...`) kõigis andmebaasipäringutes. Kasutaja sisend ei sattu kunagi otse SQL-lausesse. |
| **Topeltbroneering (Race Condition)** | Kahekihiline kaitse: (1) eksplitsiitne SELECT-kontroll enne INSERT-i, (2) PostgreSQL UNIQUE constraint (`staff_id, appointment_date, appointment_time`) püüab samaaegseid päringuid ja tagastab `409 Conflict`. |
| **Paroolide lekkimine** | Paroolid räsitakse `bcryptjs`-iga (salt rounds: 10) enne salvestamist. Andmebaasis hoitakse ainult räsi. |
| **XSS (Cross-Site Scripting)** | React escapeb vaikimisi kõik JSX-is renderdatud väärtused. Kasutaja sisendit ei lisata `dangerouslySetInnerHTML` kaudu. |
| **Sisendite kontroll** | Backend valideerib kohustuslikud väljad enne töötlust (`serviceId`, `staffId`, `appointmentDate`, `appointmentTime`). Frontend kasutab HTML5 vormi valideerimist (`required`, `type="email"`). |

## 5. Koodistandard

- **Keel**: TypeScript kogu projektis (nii frontend kui backend)
- **Stiil**: Ühtne camelCase muutujate ja funktsioonide jaoks, PascalCase React komponentide ja tüüpide jaoks
- **Projekti struktuur**: Loogiline jaotus kaustadesse (`controllers/`, `routes/`, `middleware/`, `pages/`, `components/`, `api/`, `context/`)
- **Komponentide muster**: Funktsionaalsed React komponendid koos React Hooks-idega (`useState`, `useEffect`, `useContext`)
- **API klient**: Tsentraliseeritud Axios instants koos interceptoritega (`api/client.ts`)
- **Korduvkasutatavad moodulid**: `AuthContext` (autentimise olek), `ProtectedRoute` (marsruudi kaitse), `Header` (navigatsioon), API kliendimoodulid
- **Vormindus**: Ühtne taandridu (2 tühikut), semikoolonid, ühekordsed jutumärgid
