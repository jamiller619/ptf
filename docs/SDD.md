<img src="../app/src/assets/logo.svg" width="16%" style="background-color:transparent" />

# Software Design Document

## Purpose

To document design decisions and the reason for choosing
them in an attempt to stay organized and remain focused.

## Requirements

[Requirements can be found here](requirements.pdf),
along with my submitted [Statement of Work.](SOW.pdf)

## Tech Stack

### Cloud Platform & Hosting: **Heroku**

- Quick setup with Postgres and Node.js
- Great workflow with Heroku CLI
- Free SSL hosting

### Database: [**Heroku Postgres**](https://www.heroku.com/postgres)

- Persistance
- Notifications for setting up Web Socket real-time services
- Great setup/tooling with Heroku

### API: **Node.js / Express**

- 🤘 [Because Metal](https://twitter.com/shit_hn_says/status/234856345579446272)

### DevOps: Docker

### UI: [**Superfine**](https://github.com/jorgebucaran/superfine)

A React-like UI micro framework (~1 Kb) featuring:

- Global State by default
- JSX
- Options for SSR
- 100% Functional

Testing: **Jest**

Bundler: [**Parcel**](https://parceljs.org/)

- Because [config hell is real.](https://webpack.js.org/configuration/)

JS Transpilation: **Babel**

- 💘

**_TODO:_**

- Explore security options provided by Heroku with PostgresSQL
- Explore options for web sockets
- Explore smaller, faster to implement alternative to Jest

---

## The `generateFactoryChildren` function

To prevent unnecessary IO, Factory Children will not be
stored in the database. Instead, a function will be created
that, when given the same series of five parameters, will
always produce the same set of numbers. Those five
parameters are:

- `UpperBound`
- `LowerBound`
- `ChildNodeCount`
- `FactoryId`
- `GeneratedCounter`

The `GeneratedCounter` parameter will remove the possibility
of generating duplicates with each re-generation of
children. `FactoryParentId` will reinforce this constraint,
preventing different factories from producing the same, or
similar, children.

---

## Database: it's a small world, after-all

With the `generateFactoryChildren` function, we can reduce the
database down to a single table:

#### Factory Table

| Field           | Type        | Constraints        |
| --------------- | ----------- | ------------------ |
| id              | SERIAL      | PRIMARY KEY        |
| name            | VARCHAR(55) |                    |
| upper_bound     | SMALLINT    | NOT NULL           |
| lower_bound     | SMALLINT    | NOT NULL           |
| children_length | SMALLINT    | CHECK > 0 AND < 16 |
| times_generated | SERIAL      |                    |

The "Root Node" won't be stored in the database at all,
since there can only be one, and it cannot be changed.

---

## Objects

#### `Node`

Nodes on the back-end and/or middle-tier will be represented
by lightweight and immutable objects. This object will not
contain an interface or methods.

#### `FactoryNode`

```json
{
  "id": "",
  "name": "",
  "upperBound": 0,
  "lowerBound": 0,
  "childNodeCount": 0,
  "generatedCount": 0,
  "children": ["28", "11", "9449", "2"]
}
```

Neither `Root` or `FactoryChildNodes` will be represented by
objects, preferring the most simple implementation
available.

---

## API

The API will serve the following responsibilities:

- Security (all communication via SSL)
- Data Validation, Sanitation and Integrity
- Entitlement (this will be minimally implemented in direct
  coorelation to project scope, possibly with JWT or another
  service from Heroku)
- Logging (if time allows)

---

## API Interface

All methods expect to receive, and will respond with:

```http
HEADER Content-Type:application/json
```

Responses will also contain proper HTTP Status Codes.

---

### GET ALL Factory Nodes

```http
GET /factoryNodes

```

---

### CREATE a NEW Factory Node

```http
PUT /factoryNode
```

**_(ALL fields REQUIRED)_**

```json
{
  "name": "string",
  "upperBound": 0,
  "lowerBound": 0,
  "childNodeCount": 0
}
```

---

### EDIT an existing Factory Node

```http
POST /factoryNode
```

_Only `id` is REQUIRED, all other fields are OPTIONAL._

```json
{
  "id": "uid",
  "name": "string",
  "upperBound": 0,
  "lowerBound": 0,
  "childNodeCount": 0,
  "generatedCount": 0
}
```

> **NOTE:** If a `POST` request is made to `/factoryNode` with
> an object that does _NOT contain an optional property_,
> the API will _NOT update that field._

---

### DELETE a Factory Node

```http
DELETE /factoryNode/nodeId
```

---

## User Interface

> The next big thing is the one that makes the last big thing usable.

[View the wireframe.](wireframe.pdf)

### Requirements:

- Responsive
  - This applies to both: _responsive_ to device, and
    _responsive_ to time, or it should be _fast._
- Aesthetic
- Accessible

### Considerations:

- The app will work on all modern browsers, mobile and desktop.
- The current UI might need to be scaled back somewhat,
  referring to the way nodes are displayed on the screen and
  their ability to be moved around.
  - Almost the entire UI will needs to built with SVG
- The possibility of making this a PWA is pretty high
  considering the only thing we'll need to add is the
  manifest.json file.

### UI Components

- FactoryNode
- FactoryNodeEditor
- FactoryNodeCreator
- FactoryNodeChild or FactoryNodeChildren
- RootNode
- Animate (via anime.js)
- Confirm or Confirmation
- Loader ?
- Form
- Input
- Button

#### Inspiration:

- https://shopify.github.io/draggable/
- http://www.decembercafe.org/demo/relation/

<br>
<br>
<img src="../app/src/assets/vs.svg" width="22%" style="background-color:transparent" />
