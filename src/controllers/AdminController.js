const db = require("../models");
const utils = require("./helpers/utils");
const Op = db.Sequelize.Op;
const sequelize =db.Sequelize;
const ServiceSkills = db.skills;




async function CreateSkills(req, res) {
    try {
   
      ServiceSkills.create({
        name: req.body.title
      }).then((datas) => {
        return res.status(200).send({
          status: "1",
          code: 200,
          data: "Skill was created",
          developerMessage: datas,
        });
      });
    } catch (error) {
      return res.status(500).send({
        status: "0",
        data: [
          {
            code: 500,
            message: "Whoops 💩, looks like something went wrong ❌",
            developerMessage: error.message,
          },
        ],
      });
    }
  }


  async function SkillDelete(req, res) {
try{
  ServiceSkills.destroy({
    where: { id: req.params.id },
  }).then((result) => {
    if (!result) {
      return res.status(404).send({
        status: "FALSE",
        data: [
          {
            code: 404,
            message: "Skill record  not found.",
          },
        ],
      });
    }
    return res.status(200).send({
      status: "TRUE",
      code: 200,
      data: "Skill record deleted successfully ",
    });
  });

  } catch (error) {
    return res.status(500).send({
      status: "0",
      data: [
        {
          code: 500,
          message: "Whoops 💩, looks like something went wrong ❌",
          developerMessage: error.message,
        },
      ],
    });
  }
  }


  module.exports={
    CreateSkills,SkillDelete
  }