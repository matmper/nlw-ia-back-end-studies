## Configure

### Install & Requeriments

#### Requeriments
- Docker Installed
- Docker Compose Installed

---

#### Install
- Clone this repository on a clean folder: [Github](https://github.com/matmper/nlw-ia-back-end)
- Start docker and run this commands: 
```bash
$ cp .env.example .env
$ make build
```
- Use `make up` to start or `make down` to stop
- Access `http://localhost:3333` to api request

#### Commands
```bash
# prisma migrate deploy
$ make migrate-deploy

# prisma migrate dev
$ make migrate-dev

# yarn add <package_name>
$ make yarn-add package=<package_name>

# yarn add <package_name> -D
$ make yarn-add-dev package=<package_name>

# prettier and eslint
$ make code-lint
```

---
- This code cannot be reproduced or used commercially
---

![May the force be with us](https://media.tenor.com/images/1dc098da87dacc651a0738e2ef66c25f/tenor.gif)
May the force be with us!
