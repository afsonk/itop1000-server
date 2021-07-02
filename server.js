const express = require("express")
const app = express()
const cors = require('cors')
const admin = require("firebase-admin")
const port = process.env.PORT || 4000


app.use(cors({credentials: true}))
app.use(express.json())
app.use(express.urlencoded({extended: false}))


const serviceAccount = require("./itop1000-2f7bf-firebase-adminsdk-ypeu0-ef9436beb1.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

app.post('/user', async (req, res) => {
    console.log(req.body)
    if (req.body.id) {
        await admin.auth()
            .setCustomUserClaims(req.body.id, {
                role: req.body.role,
                username: req.body.username
            })
        res.end(JSON.stringify({
            status: 'success'
        }))
    } else {
        res.end(JSON.stringify({status: 'ineligible'}))
    }
})

app.post('/deleteUser', async (req, res) => {
    console.log(req.body)
    if (req.body.id) {
        try {
            await admin.auth()
                .deleteUser(req.body.id)
            res.end(JSON.stringify({
                status: 'success'
            }))
        } catch (e) {
            res.end(JSON.stringify({
                status: 'error'
            }))
        }

    } else {
        res.end(JSON.stringify({status: 'ineligible'}))
    }
})

app.post('/updateUser', async (req, res) => {
    console.log(req.body)
    if (req.body.id) {
        await admin.auth()
            .updateUser(req.body.id, {
                email: req.body?.email,
            })
            .then((s) => {
                res.status(201).json({message: "user data is updated successfully", data: {...s}})
            }).catch(e => res.status(400).json({err: e}))

    } else {
        res.end(JSON.stringify({status: 'ineligible'}))
    }
})


app.listen(port, () => console.log(`listening on port ${port}`))