<img src="public/assets/logo.svg" width="10%" style="background-color:transparent" />

# Passport Tree Factory

## Install

```bash
git clone https://github.com/jamiller619/ptf.git
cd ptf
yarn install
```

## Run

You will need a local install of PostgreSQL to run this
site.

First, create an .env file and add in your PostgreSQL info:

```
NODE_ENV=development
PORT=3000
DATABASE_URL=?
```

`PORT` can be anything you want.

`DATABASE_URL` should include your username and password

---

To run both the server and the web app in development mode, we need two shells
open.

### Back end server:

```bash
yarn dev
```

### Front end server:

```bash
cd public
yarn dev
```

## Docs

> Don't document the program; program the document.

- [Software Design Document](docs/SDD.md)
- [Wireframe](docs/wireframe.pdf)
- [Original Requirements](docs/requirements.md)
- [Statement of Work](docs/SOW.md)

<br>
<br>
<img src="public/assets/vs.svg" width="22%" style="background-color:transparent" />
