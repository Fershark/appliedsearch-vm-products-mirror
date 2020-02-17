const RequestHTTPS = require('../utils/requestHTTPS');
const {
  DIGITAL_OCEAN_API_TOKEN,
  GMAIL_PASSWD,
  GMAIL_USER,
  TEST_MAIL
} = require('../config');

const VM = require('../models/VM');
const Action = require('../models/Action');
const nodemailer = require("nodemailer");

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

const sendPasswdToUser = (vm, user_email) => {

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASSWD
    }
  });

  var mailOptions = {
    from: GMAIL_PASSWD,
    to: user_email,
    subject: 'Your New VM: ' + vm.name,
    text: `Your new VM is all set to go! You can access it using the following credentials:

    VM Name: ${vm.name}
    IP Address: ${vm.ipV4}
    Username: ${vm.username}
    Password: ${vm.password}
    
    For security reasons, you will be required to change this VM’s root password when you login. You should choose a strong password that will be easy for you to remember, but hard for a computer to guess. You might try creating an alpha-numerical phrase from a memorable sentence (e.g. “I won my first spelling bee at age 7,” might become “Iwm#1sbaa7”). Random strings of common words, such as “Mousetrap Sandwich Hospital Anecdote,” tend to work well, too.
    
    Happy Coding,
    Team VM Service`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

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

  if (req.user == null) {
    res.status(400).json({
      message: "The user should be provided, add the callback to the router to check if the user is logged"
    });
    return;
  }

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

  let password = "csis4495";
  let postData = req.body;
  //add default values
  postData.ssh_key = null;
  postData.backups = false;
  postData.ipv6 = false;
  postData.private_networking = false;
  postData.monitoring = false;
  //tag vm with user.id
  postData.tags = [req.user.id + ""];
  //add default password
  postData.user_data = `#cloud-config
  users:
  - name: vm-service
    groups: sudo
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh-authorized-keys:
      - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDLYPP/fHevjbng9Y+4pBtPxfJuyxAQGWhldViQiVt07uN577BmtAooEZf3uZKDbA9JCTDlcfQRwsCsyJZuebDAFvpRVidwhrvafLYHmBXFYzmR546m5S+bFAgeXQcxdgQkHfgF8Vuz5aA0XN+gtIYTGPwpalPJTzm03uHfxkut/YsubhlqyLI5jzYXkTfRc1vRRaCwh3ZnHwUZqbW8zxzwGkMpMGw9ZKBEBL7YhsnXBhXYOLJ600Sb8wTxN1moV5UiITgH0ohAfqlHxZG0pdwb5OhweWYUG5Ldgx7jK98Ti9Y5WYGzNdzSEBKqdj+ksC6B56waEnZ0D/nQ0rrR1K7X nvdha@nvdhau

  chpasswd:
    list: |
      root:${password}
    expire: True`;

  // ssh-authorized-keys:
  // - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDLYPP/fHevjbng9Y+4pBtPxfJuyxAQGWhldViQiVt07uN577BmtAooEZf3uZKDbA9JCTDlcfQRwsCsyJZuebDAFvpRVidwhrvafLYHmBXFYzmR546m5S+bFAgeXQcxdgQkHfgF8Vuz5aA0XN+gtIYTGPwpalPJTzm03uHfxkut/YsubhlqyLI5jzYXkTfRc1vRRaCwh3ZnHwUZqbW8zxzwGkMpMGw9ZKBEBL7YhsnXBhXYOLJ600Sb8wTxN1moV5UiITgH0ohAfqlHxZG0pdwb5OhweWYUG5Ldgx7jK98Ti9Y5WYGzNdzSEBKqdj+ksC6B56waEnZ0D/nQ0rrR1K7X nvdha@nvdhau
  console.log("POST DATA");
  console.log(postData);

  try {
    var data = await RequestHTTPS.post(options, postData)

    console.log("RESPONE DATA");
    console.log(data);

    console.log("NEW REQUEST DATA");
    console.log(req.body);
    let vm_id = data.droplets[0].id;
    let action_id = 0;

    //Add VM
    VM.addVM({
      "vm_id": vm_id,
      "user_id": req.user.id
    }).then(([rows, fields]) => {
      //Create action
      let action = {
        "vm_id": vm_id,
        "type": "create",
        "status": Action.STATUS_IN_PROGRESS()
      }
      return Action.addAction(action);
    }).then(([rows, fields]) => {
      action_id = rows.insertId; //get action_id
    }).catch(err => {
      console.log(err);
      throw new Error('Create VM and Action on server fail!')
    });

    // Wait for it to come online
    let droplet = null;

    do {
      await sleep(5000);
      const result = await getDroplet(vm_id);
      droplet = result.droplet;
      console.log("Droplet status: " + droplet.status);
    } while (droplet.status === "new");

    //send email
    sendPasswdToUser({
      "name": droplet.name,
      "ipV4": droplet.networks.v4[0].ip_address,
      "username": "root",
      "password": password
    }, TEST_MAIL)

    ///update action status
    Action.updateActionStatus(action_id, Action.STATUS_COMPLETED());

    //update ipV4 in localDB
    await VM.updateIpV4(droplet.networks.v4[0].ip_address, vm_id);

    //TODO: CALL /update_do_vms from QUANG
    let VMSsummary = await VM.getVMSsummary();
    console.log("VMSsummary: ", VMSsummary[0][0].result);

    res.status(201).json(droplet);

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
};

exports.deleteVM = async (req, res, next) => {
  console.log("Delete VM");

  let vm_id = req.params.id;

  const options = {
    hostname: 'api.digitalocean.com',
    port: 443,
    path: '/v2/droplets/' + vm_id,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
    }
  }

  try {
    //validate
    //1. user is vm's owner
    let isOwner = await VM.checkOwner(req.user.id, vm_id);
    console.log("isOwner: ", isOwner[0][0].result);
    if(isOwner[0][0].result == 0) {
      throw new Error("User is not the vm's owner!")
    }

    //2. all actions on vm must not be "in-progess", wait until all done
    let isBusy = await Action.checkBusyVM(vm_id);
    console.log("isBusy: ", isBusy[0][0].result);
    
    while(isBusy[0][0].result == 1) {
      await sleep(5000);
      isBusy = await Action.checkBusyVM(vm_id);
      console.log("isBusy: ", isBusy[0][0].result);
    }

    let data = await RequestHTTPS.delete(options);

    //TODO: CALL /update_do_vms from QUANG
    let VMSsummary = await VM.getVMSsummary();
    console.log("VMSsummary: ", VMSsummary[0][0].result);

    //delete vm on local db
    let deleteResult = await VM.deleteVM(vm_id);

    if(deleteResult[0].affectedRows == 1)
      res.status(200).json(data);
    else
      throw new Error('Cannot delete the VM');

  } catch (err) {
    console.log("ERROR from deleteVM ", err);
    res.status(404).json(err)
  }
};


exports.getAllDistributions = async (req, res, next) => {

  const options = {
    hostname: 'api.digitalocean.com',
    port: 443,
    path: '/v2/images?page=1&per_page=100&type=distribution',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
    }
  }

  try {
    var data = await RequestHTTPS.get(options)

    const distributionNames = ['Ubuntu', 'FreeBSD', 'Fedora', 'Debian', 'CentOS'];

    let distributions = [];

    distributionNames.forEach(name => {
      distributions.push({
        name: name,
        data: data.images.filter(image => {
          return image.distribution == name
        }).map(image => {
          return {
            "id": image.id,
            "name": image.name,
            "slug": image.slug
          }
        })
      })
    });

    // distributions = data["images"];

    res.status(200).json(distributions)
  } catch (err) {
    res.status(404).json(err)
    console.log("ERROR from DO-Controller: getAllDistributions")
    console.log(err);
  }
};

exports.getAllSizes = async (req, res, next) => {

  const options = {
    hostname: 'api.digitalocean.com',
    port: 443,
    path: '/v2/sizes',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
    }
  }

  try {
    var data = await RequestHTTPS.get(options)

    res.status(200).json(data.sizes.filter(size => size.available == true))

  } catch (err) {
    res.status(404).json(err)
    console.log("ERROR from DO-Controller: getAllSizes")
    console.log(err);
  }
};

exports.getAllRegions = async (req, res, next) => {

  const options = {
    hostname: 'api.digitalocean.com',
    port: 443,
    path: '/v2/regions',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
    }
  }

  try {
    var data = await RequestHTTPS.get(options)

    res.status(200).json(data.regions)

  } catch (err) {
    res.status(404).json(err)
    console.log("ERROR from DO-Controller: getAllRegions")
    console.log(err);
  }
};