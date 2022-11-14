const data = require('./CURSO_TEST.json');
const tedious = require('tedious');
const { Sequelize, Model, DataTypes } = require('sequelize');
const moment = require('moment')


let facultades = {}
//let escuelas   = {}


const sequelize = new Sequelize(
    'academico_etl',
    'sa',
    'sa',
    {
        host: 'localhost',
        dialect: 'mssql'
    }
);

const Facultad = sequelize.define('Facultad',
    {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cod_facultad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    abreviatura: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estadoAuditoria: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        type: DataTypes.NOW,
        defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        type: DataTypes.NOW,
        defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
    },
    modifiedBy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
        timestamps: false,
        //schema:
        //paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'Facultad'
});

const Escuela = sequelize.define('Carrera',
    {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        facultad_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cod_carrera: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        estadoAuditoria: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        cat_grado_estudio_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        num_ciclo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            type: DataTypes.NOW,
            defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false
        },
        modifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            type: DataTypes.NOW,
            defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
        },
        modifiedBy: {
            type: DataTypes.STRING,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
        timestamps: false,
        //schema:
        //paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'Carrera'
    });

const CatalogoTipo = sequelize.define('CatalogoTipo',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        estado_auditoria: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            type: DataTypes.NOW,
            defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false
        },
        modifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            type: DataTypes.NOW,
            defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
        },
        modifiedBy: {
            type: DataTypes.STRING,
            allowNull: false
        },
        abreviatura: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false,
        //schema:
        //paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'Catalogo_Tipo'
    }
)

const Catalogo = sequelize.define('Catalogo',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        catalogo_tipo_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        estado_auditoria: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            type: DataTypes.NOW,
            defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false
        },
        modifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            type: DataTypes.NOW,
            defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
        },
        modifiedBy: {
            type: DataTypes.STRING,
            allowNull: false
        },
        valor_orden: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: false,
        //schema:
        //paranoid: true,
        underscored: true,
        freezeTableName: true,
        tableName: 'Catalogo'
    }
)

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    // FACULTADES
    for (let d of data) {
        if (facultades[d.FAC_FACCODI.toString()] == undefined) {
            facultades[d.FAC_FACCODI.toString()] = {
                FAC_FACCODI: d.FAC_FACCODI.toString(),
                FAC_FACNOMB: d.FAC_FACNOMB.toString(),
                FAC_FACNICK: d.FAC_FACNICK.toString(),
                FAC_FACANR: d.FAC_FACANR.toString(),
                ESCUELAS: {}
            }
        }
        if (facultades[d.FAC_FACCODI.toString()].ESCUELAS[d.ESC_CARCODI.toString()] == undefined) {
            facultades[d.FAC_FACCODI.toString()].ESCUELAS[d.ESC_CARCODI.toString()] = {
                ESC_CARCODI: d.ESC_CARCODI.toString(),
                ESC_FACCODI: d.ESC_FACCODI.toString(),
                ESC_CARNICK: d.ESC_CARNICK.toString(),
                ESC_CARANR: d.ESC_CARANR.toString(),
                ESC_CARSEME: d.ESC_CARSEME.toString(),
                ESC_CARHDUR: d.ESC_CARHDUR.toString(),
                PLANES: {}
            }
        }
        if (facultades[d.FAC_FACCODI.toString()].ESCUELAS[d.ESC_CARCODI.toString()].PLANES[d.PLAN_CRRCODI.toString()] == undefined) {
            facultades[d.FAC_FACCODI.toString()].ESCUELAS[d.ESC_CARCODI.toString()].PLANES[d.PLAN_CRRCODI.toString()] = {
                PLAN_CRRCODI: d.PLAN_CRRCODI.toString(),
                PLAN_CRRDESC: d.PLAN_CRRDESC.toString(),
                PLAN_CRRDHRS: d.PLAN_CRRDHRS.toString(),
                PLAN_CRRESTA: d.PLAN_CRRESTA.toString(),
                CURSOS: {}
            }
        }
        if (facultades[d.FAC_FACCODI.toString()].ESCUELAS[d.ESC_CARCODI.toString()].PLANES[d.PLAN_CRRCODI.toString()].CURSOS[d.CURSO_CURCODI.toString()] == undefined) {
            facultades[d.FAC_FACCODI.toString()].ESCUELAS[d.ESC_CARCODI.toString()].PLANES[d.PLAN_CRRCODI.toString()].CURSOS[d.CURSO_CURCODI.toString()] = {
                CURSO_CURCODI: d.CURSO_CURCODI.toString(),
                CURSO_CRRCODI: d.CURSO_CRRCODI.toString(),
                CURSO_CURNICK: d?.CURSO_CURNICK?.toString(),
                CURSO_CURESTA: d.CURSO_CURESTA.toString(),

                CURSO_CURNCRE: d.CURSO_CURNCRE.toString(),
                CURSO_CURSEME: d.CURSO_CURSEME.toString(),
                CURSO_CURTIPO: d.CURSO_CURTIPO.toString(),
                CURSO_CURHTEO: d.CURSO_CURHTEO.toString(),

                CURSO_CURHPRA: d.CURSO_CURHPRA.toString(),
                CURSO_CURTHRS: d.CURSO_CURTHRS.toString(),
                CURSO_CURDHRS: d.CURSO_CURDHRS.toString(),

                CURSO_CURHLAB: d.CURSO_CURHLAB.toString(),
                // CURSO_CURTUSO: d.CURSO_CURTUSO.toString(),

            }
        }
    }


    //console.log(JSON.stringify(facultades, null, 4));
    //console.log(facultades.length)


    (async function() {
        // initializers
        const catalogo_tipo = CatalogoTipo.build({
            descripcion: "CATALOGO TIPO 01",
            estado_auditoria: true,
            createdBy: 'SYSTEM',
            modifiedBy: 'SYSTEM',
            abreviatura: 'CT01'
        });
        let i_catalogo_tipo = await catalogo_tipo.save();
        const catalogo = Catalogo.build({
            descripcion: "CATALOGO 01",
            catalogo_tipo_id: i_catalogo_tipo.dataValues.id,
            estado_auditoria: true,
            createdBy: 'SYSTEM',
            modifiedBy: 'SYSTEM'
        });
        let i_catalogo = await catalogo.save();


        for (let f in facultades) {
            //console.log(facultades[f])
            const facultad = Facultad.build({
                cod_facultad: facultades[f].FAC_FACCODI,
                abreviatura: facultades[f].FAC_FACNICK.substring(0,50),
                nombre: facultades[f].FAC_FACNOMB,
                activo: true,
                createdBy: 'SYSTEM',
                modifiedBy: 'SYSTEM'
            });
            let res = await facultad.save();
            console.log('-----')
            console.log(res.dataValues.nombre)

            for (let e in facultades[f].ESCUELAS) {
                //console.log(facultades[f].ESCUELAS[e])
                const escuela = Escuela.build({
                    facultad_id: res.dataValues.id,
                    cod_carrera: facultades[f].ESCUELAS[e].ESC_CARCODI,
                    nombre: facultades[f].ESCUELAS[e].ESC_CARANR,
                    estadoAuditoria: true,
                    cat_grado_estudio_id: i_catalogo.dataValues.id,
                    num_ciclo: facultades[f].ESCUELAS[e].ESC_CARSEME,
                    createdBy: 'SYSTEM',
                    modifiedBy:'SYSTEM',
                    activo: true
                })

                let res1 = await escuela.save();
                console.log("    " + res1.dataValues.nombre)
            }

        }

    })();




}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

/*



 */