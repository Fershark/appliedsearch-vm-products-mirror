const RequestHTTPS = require('../utils/requestHTTPS');
const RequestHTTP = require('../utils/requestHTTP');

const {
  DIGITAL_OCEAN_API_TOKEN,
  GMAIL_PASSWD,
  GMAIL_USER,
  TEST_MAIL,
  DJANGO_API_HOST
} = require('../config');

const VM = require('../models/VM');
const Action = require('../models/Action');
const nodemailer = require("nodemailer");
const authorize = require('../utils/authorize');
const actionController = require('../controllers/actionController');

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

exports.getVMS = async (req, res, next) => {

  const options = {
    hostname: 'api.digitalocean.com',
    port: 443,
    path: '/v2/droplets?tag_name=' + req.user.id,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
    }
  }

  try{
    //get info from local db
    let vmsDataLocal = await VM.getByUserId(req.user.id);

    //get info from DO
    let vmsDataRemote = await RequestHTTPS.get(options);
  
    // console.log(vmsDataLocal[0]);
    // console.log(vmsDataRemote);

    vmsDataRemote.droplets.forEach(droplet => {
      droplet.products = vmsDataLocal[0]
                    .find(vm => vm.id == droplet.id).products;
    });  

    res.status(200).json(vmsDataRemote.droplets);
  }catch(err){
    res.status(404).json(err)
    console.log("ERROR from getVM")
    console.log(err);
  }
};

exports.getVM = async (req, res, next) => {
  let vm_id = req.params.id;
  console.log("Get VM info of id = " + vm_id);

  try{
    //validate user is vm's owner
    await authorize.checkOwnership(req.user.id, vm_id);
  
    let data = await getDroplet(vm_id);
    let result = await VM.getById(vm_id);

    data.droplet.products = result[0][0].products;
    res.status(200).json(data.droplet);
  }catch(err){
    res.status(404).json(err)
    console.log("ERROR from getVM")
    console.log(err);
  }
};

const actionOnVM = async (vm_id, action) => {
  
  console.log(action + " VM of id = " + vm_id);

  const options = {
    hostname: 'api.digitalocean.com',
    port: 443,
    path: '/v2/droplets/' + vm_id + '/actions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
    }
  }

  try{  

    var data = await RequestHTTPS.post(options, {"type": action})
    return data;

  }catch(err){
    console.log("ERROR from action on VM")
    console.log(err);
    throw err
  }
}

exports.powerOff = async (req, res, next) => {
  let vm_id = req.params.id;

  try{
    //validate user is vm's owner
    await authorize.checkOwnership(req.user.id, vm_id);
  
    var data = await actionOnVM(vm_id, "power_off")
    let result = null

    do {
      await sleep(2000);
      result = await getDroplet(vm_id);
      // console.log(result)
    } while (result.droplet.status !== "off");

    // console.log(data)

    // data.droplet.products = result[0][0].products;
    res.status(200).json({message: 'Success'});
  }catch(err){
    res.status(404).json(err)
    console.log("ERROR from powerOff")
    console.log(err);
  }
};

exports.powerOn = async (req, res, next) => {
  let vm_id = req.params.id;

  try{
    //validate user is vm's owner
    await authorize.checkOwnership(req.user.id, vm_id);
  
    var data = await actionOnVM(vm_id, "power_on")
    let result = null

    do {
      await sleep(2000);
      result = await getDroplet(vm_id);
      // console.log(result)
    } while (result.droplet.status !== "active");

    // console.log(data)
    res.status(200).json({message: 'Success'});
  }catch(err){
    res.status(404).json(err)
    console.log("ERROR from powerOn")
    console.log(err);
  }
};

exports.createVM = async (req, res, next) => {
  console.log("Create VM");

  console.log("req.body", req.body);

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

    console.log("RESPONE DATA FROM DIGITAL OCEAN");
    console.log(data);

    console.log("NEW REQUEST DATA");
    console.log(req.body);
    // let vm_id = data.droplets[0].id;
    // let action_id = 0;

    let vm_ids = data.droplets.map(d => d.id);
    console.log(vm_ids);

    let action_ids = {};


    for(let i=0; i< vm_ids.length; i++){
      //Add VM
      let result = await VM.addVM({
        "vm_id": vm_ids[i],
        "user_id": req.user.id
      });

      if(result[0].affectedRows != 1) 
        throw new Error('Cannot add new VM to local DB');
      
      //Add Action
      result = await actionController._create({
          "vm_id": vm_ids[i],
          "type": Action.TYPE_CREATE()
        });
      
      action_ids[vm_ids[i]] = result[0].insertId;
    }

    // Wait for them to come online
    let droplet = null;
    let droplets = [];
    let vm_ids_copy = [...vm_ids];
    let done_ids = [];

    do {
      await sleep(5000);
      for(let i=0; i < vm_ids_copy.length ; i++){
        let result = await getDroplet(vm_ids_copy[i]);
        droplet = result.droplet;
        if(droplet.status === "active"){
          droplets.push(droplet);
          done_ids.push(vm_ids_copy[i]);
        }
      }
      console.log('done_ids', done_ids);
      //filter done_ids
      if(done_ids.length > 0){
        vm_ids_copy = vm_ids_copy.filter(id => !done_ids.includes(id))
        done_ids = [];
      }

    } while (droplets.length !== vm_ids.length);

    for(let i=0; i<droplets.length; i++){
      //send email
      sendPasswdToUser({
        "name": droplets[i].name,
        "ipV4": droplets[i].networks.v4[0].ip_address,
        "username": "root",
        "password": password
      }, req.user.email)

      ///update action status
      // Action.updateActionStatus(action_id, Action.STATUS_COMPLETED());
      await actionController._update({
        "action_id": action_ids[droplets[i].id],
        "status": Action.STATUS_COMPLETED()
      });

      //update ipV4 in localDB
      await VM.updateIpV4(droplets[i].networks.v4[0].ip_address, droplets[i].id);

      // NOTE: CONNECT TO DJANGO API
      RequestHTTP.post(
        {
          hostname: DJANGO_API_HOST,
          port: 80,
          path: '/api/vms/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }, 
        {
          "vm_ip_address": droplets[i].networks.v4[0].ip_address,
          "vm_name": droplets[i].id,
          "vm_owner": req.user.email,
          "vm_group": "DO_VM"
        });
    }

    res.status(201).json(droplets);

  } catch (err) {
    res.status(404).json(err)
    console.log("ERROR from vmController: createVM")
    console.log(err);
  }

};

/*exports.deleteAllVMsOfUser = async (req, res, next) => {
  console.log("deleteAllVMsOfUser");

  const options = {
    hostname: 'api.digitalocean.com',
    port: 443,
    path: '/v2/droplets?tag_name=' + req.user.id,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIGITAL_OCEAN_API_TOKEN}`
    }
  }

  try {
    //validate
    //1. TODO: get vm_ids of a user

    //2. all actions on vm must not be "in-progess", wait until all done
    let isBusy = await Action.checkBusyVM(vm_id);
    console.log("isBusy: ", isBusy[0][0].result);
    
    while(isBusy[0][0].result == 1) {
      await sleep(5000);
      isBusy = await Action.checkBusyVM(vm_id);
      console.log("isBusy: ", isBusy[0][0].result);
    }

    let data = await RequestHTTPS.delete(options);

    //delete vm on local db
    let deleteResult = await VM.deleteVM(vm_id);

    //TODO: CALL /update_do_vms from QUANG
    let VMSsummary = await VM.getVMSsummary();
    console.log("VMSsummary: ", VMSsummary[0][0].result);

    if(deleteResult[0].affectedRows == 1)
      res.status(200).json(data);
    else
      throw new Error('Cannot delete the VM, or VM does not exist');

    res.status(200).json(data)

  } catch (err) {
    res.status(404).json(err)
    console.log("ERROR from deleteAllVMsOfUser")
    console.log(err);
  }
};*/

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
    authorize.checkOwnership(req.user.id, vm_id);

    //2. all actions on vm must not be "in-progess", wait until all done
    let isBusy = await Action.checkBusyVM(vm_id);
    console.log("isBusy: ", isBusy[0][0].result);
    
    while(isBusy[0][0].result == 1) {
      await sleep(5000);
      isBusy = await Action.checkBusyVM(vm_id);
      console.log("isBusy: ", isBusy[0][0].result);
    }

    let data = await RequestHTTPS.delete(options);

    //delete vm on local db
    let deleteResult = await VM.deleteVM(vm_id);

    //TODO: CALL /update_do_vms from QUANG
    // let VMSsummary = await VM.getVMSsummary();
    // console.log("VMSsummary: ", VMSsummary[0][0].result);
    // NOTE: PLESASE COMMENT THIS HTTP IN DEVELOPMENT SERVER
    RequestHTTP.delete({
      hostname: 'appliedresearch-nginx-reverse',
      port: 80,
      path: '/api/vms/' + vm_id,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if(deleteResult[0].affectedRows == 1)
      res.status(200).json(data);
    else
      throw new Error('Cannot delete the VM, or VM does not exist');

  } catch (err) {
    console.log("ERROR from deleteVM ", err);
    res.status(404).json({
      "message": err.message
    });
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
