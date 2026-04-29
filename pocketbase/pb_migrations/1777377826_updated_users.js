/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "bool150283522",
    "name": "actif",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "select3804820873",
    "maxSelect": 1,
    "name": "Statut",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "test de 7 jours",
      "par mois",
      "par ans"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("bool150283522")

  // remove field
  collection.fields.removeById("select3804820873")

  return app.save(collection)
})
