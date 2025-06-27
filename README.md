# MentorIA

This project provides an adaptive learning platform built with React.

The example accounting questions used in the demo now live under
`MentorIA/public/preguntas-contabilidad.json`. Static assets placed in the
`public` directory are served relative to the app's base path. The file is
now fetched using `${import.meta.env.BASE_URL}preguntas-contabilidad.json` in
the frontend code so deployments under different base URLs work correctly.

## Data Types

Courses are described by the `Course` interface found in `project/src/types`.
A course may optionally include structured `chapters` which are defined by the
`Chapter` type. Each chapter lists its concepts so that teachers can create
targeted practice sessions.
