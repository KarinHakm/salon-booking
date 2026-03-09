# Juuksuri Salongi Broneerimissusteem - Projekti Kirjeldus

## 1. Arhitektuur (klient-server pohimote)

Rakendus jargib klient-server mudelit, kus frontend ja backend on eraldatud:

- **Klient (Frontend)**: React 18 + TypeScript + Vite. Tootab kasutaja brauseris, saadab HTTP paringuid backendile ja kuvab andmeid kasutajale. Klient ei paardu otse andmebaasiga.
- **Server (Backend)**: Node.js + Express + TypeScript. Tootleb API paringuid, kontrollib sisendeid, haldab autentimist ja suhtleb PostgreSQL andmebaasiga.
- **Andmebaas**: PostgreSQL. Salvestab teenused, tootajad, kasutajad ja broneeringud.

Suhtlusvoog:
```
Brauser (React) → HTTP/JSON → Express API → PostgreSQL
```

Klient saadab paringuid (nt `GET /api/staff`, `POST /api/bookings`) ja server vastab JSON-formaadis andmetega. Klient ei tea andmebaasi struktuurist midagi - kogu ariloogika asub serveris.

## 2. MVC muster

Rakenduses on eristatavad mudeli, vaate ja kontrolleri rollid:

- **Model (Mudel)**: PostgreSQL andmebaas + `database/db.ts` paringumoodul. Tabelid: `users`, `services`, `staff`, `appointments`. Andmete salvestamine, lugemine ja kitsendused (UNIQUE constraint topeltbroneeringu vastu).
- **View (Vaade)**: React komponendid (`BookingPage.tsx`, `AdminPage.tsx`, `AdminLoginPage.tsx`, `HomePage.tsx`). Kuvavad andmeid kasutajale ja koguvad sisendit.
- **Controller (Kontroller)**: Express kontrollerid (`bookingsController.ts`, `authController.ts`, `staffController.ts`, `servicesController.ts`). Tootlevad paringuid, valideerivad sisendeid ja koordineerivad mudelikihi paringuid.

## 3. Kasutatavad raamistikud ja teegid

### Frontend
| Teek | Otstarve |
|------|----------|
| React 18 | UI komponentide raamistik |
| React Router DOM v6 | Marsruutimine lehtede vahel |
| Axios | HTTP paringud backendile |
| Tailwind CSS | Utiliidi-pohine CSS raamistik |
| i18next + react-i18next | Mitmekeelne tugi (ET/EN) |
| Vite | Arendus- ja ehitustooriist |
| TypeScript | Tuubikindlus |

### Backend
| Teek | Otstarve |
|------|----------|
| Express | Veebiserveri raamistik |
| jsonwebtoken (JWT) | Autentimistokenid |
| bcryptjs | Paroolide rasimine |
| pg (node-postgres) | PostgreSQL klient |
| cors | Ristdomeeni paringute tugi |
| TypeScript | Tuubikindlus |

## 4. Turvalisuse ulevaade

### Peamised rundevektorid ja kaitsemeetmed

| Rundvektor | Kaitsemeede |
|------------|-------------|
| **Volitamata ligipaaes admin-vaatele** | JWT-pohine autentimine. `ProtectedRoute` komponent kontrollib sisse logitud kasutaja admin-rolli. Backend middleware (`authenticateToken`, `requireAdmin`) kontrollib tokeni kehtivust ja admin-oigusi. |
| **SQL-susteparingud (SQL Injection)** | Parameetrilised paringud (`$1, $2, ...`) koigis andmebaasiparlngutes. Kasutaja sisend ei sattu kunagi otse SQL-lausesse. |
| **Topeltbroneering (Race Condition)** | Kahekihiline kaitse: (1) eksplitsiitne SELECT-kontroll enne INSERT-i, (2) PostgreSQL UNIQUE constraint (`staff_id, appointment_date, appointment_time`) puuab samaaegseid paringuid ja tagastab `409 Conflict`. |
| **Paroolide lekkimine** | Paroolid rasitakse `bcryptjs`-iga (salt rounds: 10) enne salvestamist. Andmebaasis hoitakse ainult rasi. |
| **XSS (Cross-Site Scripting)** | React escapeb vaikimisi koik JSX-is renderdatud vaartused. Kasutaja sisendit ei lisata `dangerouslySetInnerHTML` kaudu. |
| **Sisendite kontroll** | Backend valideerib kohustuslikud valjad enne tootlust (`serviceId`, `staffId`, `appointmentDate`, `appointmentTime`). Frontend kasutab HTML5 vormi valideerimist (`required`, `type="email"`). |

## 5. Koodistandard

- **Keel**: TypeScript kogu projektis (nii frontend kui backend)
- **Stiil**: Uhtne camelCase muutujate ja funktsioonide jaoks, PascalCase React komponentide ja tuupide jaoks
- **Projekti struktuur**: Loogiline jaotus kaustadesse (`controllers/`, `routes/`, `middleware/`, `pages/`, `components/`, `api/`, `context/`)
- **Komponentide muster**: Funktsionaalsed React komponendid koos React Hooks-idega (`useState`, `useEffect`, `useContext`)
- **API klient**: Tsentraliseeritud Axios instants koos interceptoritega (`api/client.ts`)
- **Korduvkasutatavad moodulid**: `AuthContext` (autentimise olek), `ProtectedRoute` (marsruudi kaitse), `Header` (navigatsioon), API kliendimoodulid
- **Vormindus**: Uhtne taandridu (2 tuhikut), semikoolonid, uhekordsed jutumargid
