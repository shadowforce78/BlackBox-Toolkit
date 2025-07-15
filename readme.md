# BlackBox Toolkit

> ⚠️ **Avertissement :**  
> Ce projet est destiné à des fins éducatives, de recherche et de sensibilisation à la sécurité informatique uniquement.  
> Toute utilisation malveillante est strictement interdite.

---

## 📖 Description

BlackBox Toolkit est une plateforme locale tout-en-un développée avec Node.js, Express et Electron.  
Elle regroupe plusieurs outils et modules liés à la sécurité offensive, tels que des générateurs de payloads, des simulateurs de phishing, des chats chiffrés, et bien plus.

---

## 🚀 Fonctionnalités principales

- Serveur Express fournissant une API et une interface web locale  
- Interface native avec Electron pour une expérience utilisateur fluide  
- Modules extensibles pour divers outils de test en sécurité informatique  
- Architecture modulaire pour faciliter l’ajout de nouvelles fonctionnalités

---

## 🛠️ Installation

```bash
git clone http://github.com/shadowforce78/blackbox-toolkit.git
cd blackbox-toolkit
npm install
````

---

## ⚙️ Utilisation

* **Lancer l’application complète avec Electron :**

```bash
npm start
```

* **Lancer uniquement le serveur Express (API + UI web) :**

```bash
npm run server
```

---

## 📁 Structure du projet

```
blackbox-toolkit/
├── main.js            # Entrée principale Electron
├── server.js          # Serveur Express
├── modules/           # Modules et outils divers
├── public/            # Fichiers statiques (CSS, JS, images)
├── views/             # Templates EJS pour l’UI
├── package.json
└── README.md
```

---

## 📦 Modules actuels

| Module                 | Description                                | Statut  |
| ---------------------- | ------------------------------------------ | ------- |
| TokenGrabber Generator | Génération de scripts de capture de tokens | À venir |
| Phishing Page Builder  | Génération de pages de phishing simulées   | À venir |
| Encrypted Chat         | Chat chiffré et obfusqué                   | À venir |
| ...                    | ...                                        | ...     |

---

## 🧩 Ajouter un module

1. Créer un nouveau dossier dans `modules/`
2. Ajouter les routes nécessaires dans `server.js` ou créer un routeur dédié
3. Ajouter l’interface utilisateur dans `views/` ou `public/`
4. Tester et documenter le module ici

---

## 🔐 Sécurité & Disclaimer

* Ce projet doit être exécuté **uniquement en local**.
* Ne pas déployer en production ni sur un réseau public sans précautions.
* Respecter les lois en vigueur dans votre pays concernant les tests de sécurité.

---

## 🤝 Contributions

Les contributions sont les bienvenues !
Merci de respecter la licence et l’éthique du projet.

---

## 📫 Contact

Pour toute question ou suggestion, contactez [planque.adam@gmail.com](mailto:planque.adam@gmail.com)

---

## 📝 TODO

# ✅ TODO – Modules à intégrer dans BlackBox Toolkit

> ⚠️ Tous les modules doivent fonctionner en local, être modulaires, et afficher leurs logs dans le dashboard.

---

## 🧩 Modules "Offensifs"

- [ ] **Token Grabber Generator**
  - Générateur de scripts (JS/Python) obfusqués
  - Ciblage : Discord tokens, sessions locales, clipboard
  - Options : crypter avec clé custom, export zip

- [ ] **Phishing Page Builder**
  - Choix de thème (Steam, Gmail, Discord…)
  - Génération page HTML + serveur local listener
  - Export zip avec nom aguicheur (`MonCV.html.zip`)

- [ ] **Encrypted Chat**
  - P2P ou WebSocket chiffré (AES/RSA)
  - Auto-delete + option de clé externe
  - Mode obfuscation (emoji, base64, etc.)

- [ ] **Keylogger Simulator (JS)**
  - Script à injecter dans pages locales
  - Sauvegarde des frappes dans logs locaux
  - Option d’activation / désactivation

- [ ] **Payload Encoder / Decoder**
  - Encode / decode :
    - Base64 / hex / unicode / `String.fromCharCode`
    - Obfuscation emoji / code inversé
  - Interface simple + textarea

- [ ] **Fake File Generator**
  - Génère un `.pdf.exe` ou `.jpg.html` factice
  - Personnalisation du nom et de l’icône
  - Option auto-open ou dropper

---

## 🕵️‍♂️ Modules "Analyse & Sensibilisation"

- [ ] **User Fingerprinting Tool**
  - OS, navigateur, canvas, IP locale, résolution, timezone
  - Rapport exportable

- [ ] **Webhook Listener / Catcher**
  - Serveur d’écoute pour fausses livraisons Discord, Slack
  - Dashboard des données reçues en temps réel

- [ ] **Link Preview Generator**
  - Génère un lien raccourci piégé (phishing)
  - Affiche la preview telle qu’elle serait sur Discord / WhatsApp

---

## 🛠️ Modules "Utilitaires"

- [ ] **Port Scanner (local only)**
  - Scan IP locale (LAN) ou 127.0.0.1
  - Affichage des ports ouverts avec service associé

- [ ] **Password Generator**
  - Générateur custom (force, caractères, format)
  - Option d’export .txt

- [ ] **Obfuscation Viewer / Deobfuscator**
  - Entrée de JS/Python obfusqué → tentative de nettoyage
  - Mise en forme et analyse de code grabber connu

---

## 🧠 Modules bonus (pour + tard)

- [ ] **Exploit Builder (PoC templates)**
  - Génération de petits exploits HTML/PDF/JS
  - À utiliser en local uniquement

- [ ] **DNS Spoofing Local (simulé)**
  - Faux serveur DNS local pour test d'URL détournée
  - Simulation pédagogique

- [ ] **Social Engineering Simulator**
  - Générateur de scénarios : fausse conversation / faux formulaire / fake alert

---

> 🔧 Chaque module doit :
> - Avoir sa propre route (`/module-name`)
> - Être activable/désactivable depuis le dashboard
> - Posséder un footer de contexte + bouton retour
> - Logger ses actions dans un fichier `.log` ou un mini dashboard



---

*Développé avec ❤️ par \[SaumonDeLuxe]*