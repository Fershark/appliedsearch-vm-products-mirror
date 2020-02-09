const RequestHTTPS = require('../utils/requestHTTPS');
const {
  DIGITAL_OCEAN_API_TOKEN
} = require('../config');

const VM = require('../models/VM');
const Action = require('../models/Action');

const sleep = async ms => {
  return new Promise(f => {
    setTimeout(f, ms);
  });
};

const getDroplet = async (id) => {

  const options = {
    hostname: 'api.digitalocean.com',
    port: 443,
    path: `/v2/droplets/${id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
    }
  }

  try {
    var data = await RequestHTTPS.get(options)

    console.log("Droplet: ", data);
    var actions = await getActionsOnDroplet(id);
    console.log("Actions: ", actions);

    return data

  } catch (err) {
    console.log("ERROR from getDroplet() ")
    console.log(err);
  }
}

const getActionsOnDroplet = async (id) => {

  const options = {
    hostname: 'api.digitalocean.com',
    port: 443,
    path: `/v2/droplets/${id}/actions?page=1&per_page=1000`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
    }
  }

  try {
    var data = await RequestHTTPS.get(options)
    return data

  } catch (err) {
    console.log("ERROR from getDroplet() ")
    console.log(err);
  }
}


// const Review = require('../models/review');
// const { UPLOAD_IMAGE_FOLDER } = require('../config');
// const Utils = require('../util/utils');

// exports.getAllItems = (req, res, next) => {
//   // we use promise which is nicer than callback
//   const itemName = req.query.itemname;
//   Item.findAll(itemName)
//     .then(([rows, fields]) => {
//       rows.forEach((currentValue, index, array) => {
//         Utils.toBoolean(currentValue, 'isActive');
//         array[index] = currentValue;
//       });
//       res.status(200).json(rows);
//     }).catch(err => {
//       console.log(err);
//     });
// };

exports.getVM = async (req, res, next) => {
  // Item.findByItemId(req.params.item_id)
  //     .then(([rows, fields]) => {
  //         rows.forEach((currentValue, index, array) => {
  //           Utils.toBoolean(currentValue, 'isActive');
  //           array[index] = currentValue;
  //         });
  //         res.status(200).json(rows[0]);
  //     }).catch(err => {
  //         console.log(err);
  //     });

  let data = await getDroplet(req.params.id);
  res.status(200).json(data)

};

exports.createVM = async (req, res, next) => {
  console.log("Create VM");

  //   if (req.user == null) {
  //     res.status(400).json({
  //       message: "The user should be provided, add the callback to the router to check if the user is logged"
  //     });
  //     return;
  //   }

  const options = {
    hostname: 'api.digitalocean.com',
    port: 443,
    path: '/v2/droplets',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
    }
  }

  // example req.body
  // {
  //   "user_id": 1,
  //   "config_details":{
  //   "names": ["example.com1"],
  //   "region": "nyc3",
  //   "size": "s-1vcpu-1gb",
  //   "image": "ubuntu-16-04-x64",
  //   "ssh_keys": null,
  //   "backups": false,
  //   "ipv6": false,
  //   "private_networking": false,
  //   "monitoring": false
  //   }
  // }

  let password = "csis4495";
  let postData = req.body.config_details;
  //used user_id to tag the VM
  postData.tags = [req.body.user_id + ""];
  //add default password
  postData.user_data = `#cloud-config
  chpasswd:
    list: |
      root:${password}
    expire: True`;

  console.log("POST DATA");
  console.log(postData);

  try {
    var data = await RequestHTTPS.post(options, postData)

    console.log("RESPONE DATA");
    console.log(data);

    //add vm_id to req.body
    req.body.vm_id = data.droplets[0].id;

    console.log("NEW REQUEST DATA");
    console.log(req.body);

    //Create action
    let action = {
      "vm_id": req.body.vm_id,
      "type": "create",
      "status": Action.STATUS_IN_PROGRESS()
    }

    let action_id = null;
    Action.addAction(action)
      .then(([rows, fields]) => {
        action_id = rows.insertId;
      });

    // Wait for it to come online
    let droplet = null;

    do {
      await sleep(5000);
      const result = await getDroplet(req.body.vm_id);
      droplet = result.droplet;
      console.log("Droplet status: " + droplet.status);
    } while (droplet.status === "new");

    VM.addVM(req.body)
      .then(([rows, fields]) => {

        //TODO: send email, then set action complete

        Action.updateActionStatus(action_id, Action.STATUS_COMPLETED());

        res.status(201).json(droplet);
      });

  } catch (err) {
    res.status(404).json(err)
    console.log("ERROR from vmController: createVM")
    console.log(err);
  }

};

exports.deleteAllVMsOfUser = async (req, res, next) => {
  console.log("deleteAllVMsOfUser");

  // console.log(req.query["user_id"]);

  const options = {
    hostname: 'api.digitalocean.com',
    port: 443,
    path: '/v2/droplets?tag_name=' + req.query["user_id"],
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
    }
  }

  try {
    var data = await RequestHTTPS.delete(options)

    res.status(200).json(data)

  } catch (err) {
    res.status(404).json(err)
    console.log("ERROR from deleteAllVMsOfUser")
    console.log(err);
  }

  // if (req.user == null) {
  //   res.status(400).json({
  //     message: "The user should be provided, add the callback to the router to check if the user is logged"
  //   });
  //   return;
  // }

  // if (req.file != null)
  //   req.body.imageURLs = UPLOAD_IMAGE_FOLDER + req.file.filename;

  // Item.editItem(req.body).then(([rows, fields]) => {
  //   res.status(200).json(req.body);
  // }).catch(err => {
  //   console.log(err);
  // });
};

// exports.editItem = (req, res, next) => {
//   console.log("Edit item");
//   if (req.user == null) {
//     res.status(400).json({
//       message: "The user should be provided, add the callback to the router to check if the user is logged"
//     });
//     return;
//   }

//   if (req.file != null) 
//     req.body.imageURLs = UPLOAD_IMAGE_FOLDER + req.file.filename;

//   Item.editItem(req.body).then(([rows, fields]) => {
//     res.status(200).json(req.body);
//   }).catch(err => {
//     console.log(err);
//   });
// };

// exports.deleteItem= (req, res, next) => {
// };

// exports.getAllReviewsOfItem = (req, res, next) => {
//   Review.findAllReviewsOfItem(req.params.item_id)
//     .then(([rows, fields]) => {
//       res.status(200).json(rows);
//     }).catch(err => {
//       console.log(err);
//     });
// };