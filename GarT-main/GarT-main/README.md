<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>Gardening Web Tutor</title>
    </head>
    <body>
        <div role="contentinfo">
            <d1>
                <h2>Membrii echipei</h2>
                <dd>
                    Popa Razvan Gabriel
                </dd>
                <dd>
                    Tanase George
                </dd>
                <h2>Coordonator/Facultate/Materie</h2>
                <dd>
                    Micu Matei
                </dd>
                <dd>
                    Facultatea de Informatica Iasi
                </dd>
                <dd>
                    Tehnologii Web
                </dd>
            </d1>
        </div>
        <section role="doc-introduction">
            <h2>1. Introduction</h2>
            <h3>1.1 Scope</h3>
            <p>
                Scopul acestui document este de a prezenta detalii despre site-ul web GarT (Gardening Web Tutor).
                Va prezenta caracteristicile site-ului si cum trebuie sa functioneze site-ul. Acest document va 
                fi folosit de catre primii utilizatori pentru a intelege mai bine site-ul.
            </p>
            <h3>1.2 Intended Audience and Reading Suggestions</h3>
            <p>
                Acest document este atat pentru developeri cat si pentru utilizatorii site-ului.
                Developerii vor putea intelege mai bine cum functioneaza site-ul. Site-ul ar putea
                fi folosita de catre urmatoarele categorii de persoane: gradinari incepatori care vor
                sa invete sau sa inteleaga unele concepte despre gradinarit si de orice persoana
                care doreste sa invete pentru a isi face si intretine propria gradina.
            </p>
            <h3>1.3 Product Scope</h3>
            <p>
                Scopul site-ului este de a crea un mediu user-friendly de invatare pentru persoanele care
                vor sa invete despre gradinarit sau la ce l-ar ajuta o anumita unealta. Acestia vor avea la dispozitie
                concepte, unelte si tehnici din care sa aleaga si se vor pune la dispozitie semnificatia/tipul,
                contextul de utilizare, sugestii privind momentul propice realizarii unor activitati specifice, etc.
            </p>
            <h2>2. Overall Description</h2>
            <h3>2.1 Product prespective</h3>
            <p>
                Produsul s-a nascut din dorinta oamenilor de a isi crea gradina in locuinta proprie,
                fiind foarte folositor sa existe o platforma care ii ajuta la fiecare pas cu sfaturi, 
                informatii si explicatii. Cea mai mare realizare a site-ului nostru este ca putem ajuta
                orice persoana sa isi construiasca propria gradina de la zero.
            </p>
            <h3>2.2 Product Functions</h3>
            <p>
                <dt>Authentication:</dt>
                <dd>Register</dd>
                <dd>Login</dd>
                <dd>Forgot password</dd>
                <dt>Informatii despre gradinarit precum tipuri de unelte, tehnici, sfaturi, etc</dt>
                <dt>Fiecare utilizator, pe masura ce va progresa va avea un alt rank in aplicatie
                    (incepator, avansat, experimentat) 
                </dt>
                <dt>Va fi un clasament cu utilizatorii ce au progresat cel mai mult</dt>
                <dt>Posibilitatea de a cauta orice informatie</dt>
            </p>
            <h3>2.3 Operating Environment</h3>
            <p>
                Site-ul va functiona pe orice sistem de operare, cat si pe orice browser web. 
            </p>
            <h3>2.4 Design and Implementation Constraints</h3>
            <p>
                <dt>Front-End:</dt>
                <dd>HTML</dd>
                <dd>CSS</dd>
                <dd>JavaScript</dd>
                <dt>Back-End:</dt>
                <dd>Node.js (comunicarea dintre front-end si back-end)</dd>
                <dd>MySQL (stocarea datelor)</dd>
                <dt>Vom structura codul prin crearea unor diagrame UML pentru a ne face o idee
                    despre ce ar trebui implementat, vom avea code conventions (numele variabilelor, declararea lor)
                    si vom folosi design patterns.
                </dt>
            </p>
            <h2>3. External Interface Requirements</h2>
            <h3>3.1 User Interface</h3>
            <p>
                <dt>Home Page Interface</dt>
                <img src="/Users/georgetanase/Documents/Documentatia/LandingPage.png" height="350" width="600" alt="Home Page Interface">
                <dt>Login Page</dt>
                <img src="/Users/georgetanase/Documents/Documentatia/Login.png" height="350" width="600">
                <dt>Register Page</dt>
                <img src="/Users/georgetanase/Documents/Documentatia/Register.png" height="350" width="600">
            </p>
            <h3>3.2 Communications Interfaces</h3>
            <p>
                FrontEnd-ul si BackEnd-ul comunica intre ele prin http requests. De exemplu,
                frontend-ul va trimite datele introduse catre backend, iar backend-ul va valida 
                datele si le va stoca in baza de date.
            </p>
            <h2>4. System Features</h3>
            <h3>4.1 Register</h3>
            <p>
                <b><dt>Descriere si prioritate</dt></b>
                <dd>Acest feature este unul cu o prioritate mare. Un utilizator care intra pentru 
                    prima data pe site va fi rugat sa se inreistreze. Acesta va trebui sa isi puna numele,
                    adresa de email si parola. Acesta va trebui sa confirme parola.
                </dd>
                <b><dt>Response Sequences List</dt></b>
                <dd>
                    Utilizatorul va trebui sa introduca informatii neexistente in baza de date.
                    Daca informatiile sunt deja folosite, va aparea o eroare si ii va cere utilizatorului
                    sa foloseasca altele.
                </dd>                
            </p>
            <h3>4.2 Login</h3>
            <p>
                <b><dt>Descriere si prioritate</dt></b>
                <dd>
                    Acest feature este unul cu o prioritate mare. Userul introduce adresa
                    de email si parola si dupa ce email-ul si parola sunt verificate in baza
                    noastra de date, acesta va avea acces in cont.
                </dd>
                <b><dt>Response Sequences List</dt></b>
                <dd>User-ul trebuie sa foloseasca emailul si parola folosite la inregistrare</dd>
                <dd>Daca email-ul sau parola nu exista in baza de date o eroare va aparea. Aceasta
                    ii va cere utilizatorului sa scrie un email sau o parola valide.
                </dd>
            </p>
            <h3>4.3 Forgot Password</h3>
            <p>
                <b><dt>Descriere si prioritate</dt></b>
                <dd>
                    Acest feature este unul cu o prioritate mare. Userul, in cazul in care si-a
                    uitat parola, are posibilitatea sa o schimbe.
                </dd>
                <b><dt>Response Sequences List</dt></b>
                <dd>User-ul va primi parola pe adresa de email</dd>
                <dd>Daca email-ul nu exista in baza de date o eroare va aparea. Aceasta
                    ii va cere utilizatorului sa scrie un email valid.
                </dd>
            </p>
            <h3>4.4 Ranking</h3>
            <p>
                <b><dt>Descriere si prioritate</dt></b>
                <dd>
                    Acest feature este unul cu o prioritate medie. Utilizatorul, pe masura
                    ce invata si descopera cat mai multe pe site, va creste in rank si totodata in 
                    clasamentul site-ului.
                </dd>
            </p>
            <h3>4.5 Search</h3>
            <p>
                <b><dt>Descriere si prioritate</dt></b>
                <dd>
                    Acest feature este unul cu o prioritate medie. Utilizatorul va avea 
                    posibilitatea sa caute orice cuvant cheie sau informatie care il interseaza
                    pentru a ii usura mediul de invatare si a economisi timp.
                </dd>
            </p>
        </section>
    </body>
