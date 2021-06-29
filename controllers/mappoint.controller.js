const Mappoint = require('../models/Mappoint');
const User = require('../models/User');

function get(req, res) {
    Mappoint.find().then(mps=>{
        res.send({
            error: false,
            data: mps,
        });
    }).catch(err=>{
        console.log(err.message);
        res.status(500).send({
            error: true,
            message: 'Internal Server Error',
        })
    })
}

function getOne(req, res){
    Mappoint.findById(req.params.id).then(mp=>{
        if(!mp){
            return res.status(400).send({
                error: true,
                message: "Not Found Map Point."
            });
        }
        res.send({
            error: false,
            data: mp
        });
    }).catch(err=>{
        console.log(err.message);
        res.status(500).send({
            error: true,
            message: "Internal Server Error.",
        });
    });
}

const create = async (req, res) => {
    const userId = req.userId;
    User.findById(userId).then(async u=>{
        if(!u){
            return res.status(404).send({
                error: true,
                message: 'Cannot find the creator.'
            })
        }
        const data = req.body;
        const mappoint = new Mappoint({
            title: data.title,
            location: {
                lat: data.lat,
                lng: data.lng,
            },
            condition: data.condition,
            description: data.description,
            economic: data.economic,
            createdBy: userId,
        });
        await mappoint.save();
        res.send({
            error: false,
            message: "Created Map Point successfully."
        })
    }).catch(err=>{
        console.log(err.message);
        res.status(500).send({
            error: true,
            message: 'Internal Server Error.'
        })
    })
}

module.exports = {
    create,
    get,
    getOne,
}