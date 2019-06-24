// https://github.com/Rocketseat/bootcamp-gostack-desafio-01/blob/master/README.md#desafio-01-conceitos-do-nodejs

const express = require('express')

const server = express()

server.use(express.json())

const projects = [
    { 
        "id": "1", 
        "title": "Novo projeto", 
        "tasks": ['Nova tarefa'] 
    },
    { 
        "id": "2", 
        "title": "Projeto XPTO", 
        "tasks": ['Implementar XPTO', 'Testar XPTO'] 
    },
    { 
        "id": "3", 
        "title": "Projeto ACME", 
        "tasks": ['Rodar ACME', 'Consultar clientes sobre ACME', 'Finalizar tarefa'] 
    }
]

let count = 0
server.use((req, res, next) => {
    console.time('Request')
    console.log(`Método: ${req.method}; URL: ${req.url}`)
    count++

    console.log(`Número de requisições ${count}`)
    next()

    console.timeEnd('Request')
})


function checkIdIdExists(req, res, next) {
    const { id } = req.params


    const result = projects.filter((value, index, array) => {
        return value.id === id
    })

    
    if ( result.length === 0 ) {
        return res.status(400).json({ error: 'Id not found'})
    }
    
    return next()
}

server.post('/projects', (req, res) => {
    const { id, title, tasks } = req.body
    
    projects.push({ id, title, tasks })

    return res.json(projects)
})

server.get('/projects', (req, res) => {
    return res.json(projects)
})

server.put('/projects/:id', checkIdIdExists, (req, res) => {
    const { id } = req.params
    const { title } = req.body

    // forEach retorna void
    projects.forEach(project => {
        if (project.id === id) {
            project.title = title
        }
    })
    // projects.filter((value, index, array) => {
    //     return value.id === id
    // }).map((value, index, array) => {
    //     return value.title = title
    // })

    const result = projects.filter(value => {
        return value.id === id
    })

    return res.json(result)
})

server.delete('/projects/:id', checkIdIdExists, (req, res) => {
    const { id } = req.params

    projects.forEach((project, index) => {
        if (project.id === id) {
            projects.splice(index, 1)
        }
    })

    return res.json(projects)
})

server.get('/projects/:id', checkIdIdExists, (req, res) => {
    const { id } = req.params

    const result = projects.filter((value, index, array) => {
        return value.id === id
    })

    return res.json(result)
})

server.post('/projects/:id/tasks', checkIdIdExists, (req, res) => {
    const { id } = req.params
    const { title } = req.body

    projects.forEach(project => {
        if (project.id === id) {
            project.tasks.push(title)
        }
    })

    const result = projects.filter(value => {
        return value.id === id
    })
    
    return res.json(result)
})

server.listen(3000)
